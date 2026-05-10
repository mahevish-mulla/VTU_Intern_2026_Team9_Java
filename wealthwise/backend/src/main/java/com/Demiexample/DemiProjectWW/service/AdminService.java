package com.Demiexample.DemiProjectWW.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.Demiexample.DemiProjectWW.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.Demiexample.DemiProjectWW.entity.Amc;
import com.Demiexample.DemiProjectWW.entity.Investment;
import com.Demiexample.DemiProjectWW.entity.MutualFund;
import com.Demiexample.DemiProjectWW.entity.Notification;
import com.Demiexample.DemiProjectWW.entity.User;

import lombok.RequiredArgsConstructor;
import com.Demiexample.DemiProjectWW.dto.request.AmcRequest;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AmcRepository amcRepository;
    private final InvestmentRepository investmentRepository;
    private final MutualFundRepository mutualFundRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;
    private final RestTemplate restTemplate;
    private final UserRepository userRepository;
    private final NavHistoryRepository navHistoryRepository;


    /**
     * AMC Management: Onboard a new Asset Management Company.
     */
    @Transactional
    public Amc onboardAmc(AmcRequest request) {
        if (amcRepository.findByAmcName(request.getAmcName()).isPresent()) {
            throw new RuntimeException("AMC already exists");
        }
        Amc amc = new Amc();
        amc.setAmcName(request.getAmcName());
        return amcRepository.save(amc);
    }

    /**
     * System Health: Check if the NAV scheduler has updated data in the last 24 hours.
     */
    public Map<String, Object> getSystemHealth() {
        Map<String, Object> health = new HashMap<>();

        // Check if there is any NAV history entry from today
        boolean isNavFresh = navHistoryRepository.findAll().stream()
                .anyMatch(h -> h.getNavDate().equals(LocalDate.now()));

        health.put("navDataStatus", isNavFresh ? "FRESH" : "STALE");
        health.put("lastCheckTimestamp", LocalDateTime.now());
        health.put("activeSchedulers", List.of("NavScheduler", "FundCleanupScheduler"));
        return health;
    }

    /**
     * User Oversight: Calculate Total Assets Under Management (AUM).
     */
    public Map<String, Object> getFinancialOversight() {
        Double totalAum = mutualFundRepository.calculateTotalAUM();
        long totalActiveInvestments = investmentRepository.count(); // Simplified for oversight

        Map<String, Object> oversight = new HashMap<>();
        oversight.put("totalAUM", totalAum != null ? totalAum : 0.0);
        oversight.put("activeInvestmentCount", totalActiveInvestments);
        return oversight;
    }

    /**
     * Retrieves all users with the role INVESTOR.
     */
    public List<User> getAllInvestors() {
        return userRepository.findByRole(User.Role.INVESTOR);
    }

    /**
     * Toggles the status (ACTIVE/INACTIVE) for a specific user.
     */
    @Transactional
    public void updateUserStatus(Long userId, User.Status status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(status);
        userRepository.save(user);
    }

    /**
     * Provides analytics for the User Management dashboard.
     */
    public Map<String, Object> getUserAnalytics() {
        List<User> investors = userRepository.findByRole(User.Role.INVESTOR);

        long activeCount = investors.stream()
                .filter(u -> u.getStatus() == User.Status.ACTIVE).count();
        long inactiveCount = investors.stream()
                .filter(u -> u.getStatus() == User.Status.INACTIVE).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalInvestors", investors.size());
        stats.put("activeInvestors", activeCount);
        stats.put("inactiveInvestors", inactiveCount);
        return stats;
    }

    /**
     * Search functionality for the user management table.
     */
    public List<User> searchInvestors(String query) {
        return userRepository.findByRoleAndNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                User.Role.INVESTOR, query, query);
    }

    // --- Automated MFAPI Integration ---


    @Transactional
    public MutualFund autoAddFundByCode(Integer schemeCode, MutualFund.RiskLevel risk) {
        // 1. Fetch latest data from MFAPI
        String url = "https://api.mfapi.in/mf/" + schemeCode + "/latest";
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        if (response == null || !"SUCCESS".equals(response.get("status"))) {
            throw new RuntimeException("Failed to fetch data from MFAPI for code: " + schemeCode);
        }

        Map<String, Object> meta = (Map<String, Object>) response.get("meta");
        List<Map<String, String>> data = (List<Map<String, String>>) response.get("data");

        // 2. Automated AMC Creation: Extract Fund House and save if new
        String amcName = (String) meta.get("fund_house");
        Amc amc = amcRepository.findByAmcName(amcName)
                .orElseGet(() -> {
                    Amc newAmc = new Amc();
                    newAmc.setAmcName(amcName);
                    return amcRepository.save(newAmc);
                });

        // 3. Automated Category Mapping
        String apiCategory = (String) meta.get("scheme_category");
        MutualFund.Category category = MutualFund.Category.EQUITY;
        if (apiCategory.contains("Debt")) category = MutualFund.Category.DEBT;
        if (apiCategory.contains("Hybrid")) category = MutualFund.Category.HYBRID;

        // 4. Create and Save Mutual Fund with real-time NAV
        MutualFund fund = new MutualFund();
        fund.setFundName((String) meta.get("scheme_name"));
        fund.setSchemeCode(schemeCode);
        fund.setAmc(amc);
        fund.setCategory(category);
        fund.setRiskLevel(risk);

        // Extract NAV from the first entry in the data list
        String latestNav = data.get(0).get("nav");
        fund.setCurrentNav(new BigDecimal(latestNav));

        return mutualFundRepository.save(fund);
    }
    
    public void deleteFund(Long fundId) {
    	mutualFundRepository.deleteById(fundId);
    }
    
    @Transactional
    public int sendSipDueReminders() {
        LocalDate today = LocalDate.now();
        LocalDate threeDaysLater = today.plusDays(3);

        // Use a range query: any SIP due between today and 3 days from now
        List<Investment> dueSips = investmentRepository
            .findByNextDueDateBetweenAndTypeAndStatus(
                today,
                threeDaysLater,
                Investment.InvestmentType.SIP,
                Investment.InvestmentStatus.ACTIVE
            );

        if (dueSips.isEmpty()) {
            return 0; // no SIPs due
        }

        dueSips.forEach(inv -> {
            User user = inv.getUser();
            String fundName = inv.getMutualFund().getFundName();
            String amount = inv.getAmount().toString();
            String dueDate = inv.getNextDueDate() != null ? inv.getNextDueDate().toString() : "soon";

            // In-app notification
            notificationService.createNotification(
                user,
                "SIP Due Soon",
                "Your SIP of ₹" + amount +
                " for " + fundName +
                " is due on " + dueDate +
                ". Ensure sufficient balance.",
                Notification.NotificationType.GENERAL
            );

            // Email
            emailService.sendSipReminderEmail(
                user.getEmail(),
                user.getName(),
                fundName,
                amount,
                dueDate
            );
        });

        return dueSips.size();
    }

    @Transactional
    public void broadcastAlert(String title, String message) {
        List<User> investors = userRepository
            .findByRole(User.Role.INVESTOR);

        investors.forEach(user -> {
            notificationService.createNotification(
                user,
                title,
                message,
                Notification.NotificationType.GENERAL
            );
            emailService.sendGeneralAlert(
                user.getEmail(),
                title,
                message
            );
        });
    }
    
    @Transactional
    public void deactivateFund(Long fundId) {
        MutualFund fund = mutualFundRepository.findById(fundId)
            .orElseThrow(() -> new RuntimeException("Fund not found"));

        fund.setActive(false);
        fund.setDeactivatedAt(LocalDateTime.now());
        fund.setGracePeriodEnds(LocalDateTime.now().plusDays(30));
        mutualFundRepository.save(fund);

        // Get all investors of this fund and email them
        List<Investment> investments = 
            investmentRepository.findByMutualFundFundId(fundId);
        
        investments.stream()
        .map(Investment::getUser)
        .distinct()
        .forEach(user -> {
            // Send email
            emailService.sendFundDeactivationEmail(
                user.getEmail(),
                fund.getFundName(),
                fund.getGracePeriodEnds().toLocalDate().toString()
            );
            // Create notification
            notificationService.createNotification(
                user,
                "Fund Deactivated: " + fund.getFundName(),
                "The fund has been deactivated. Grace period ends " +
                fund.getGracePeriodEnds().toLocalDate(),
                Notification.NotificationType.FUND_DEACTIVATED
            );
        });
    }
}
