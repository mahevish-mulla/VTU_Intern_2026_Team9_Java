package com.Demiexample.DemiProjectWW.service;

import com.Demiexample.DemiProjectWW.entity.Investment;
import com.Demiexample.DemiProjectWW.entity.MutualFund;
import com.Demiexample.DemiProjectWW.dto.response.PortfolioSummaryResponse;
import com.Demiexample.DemiProjectWW.repository.InvestmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvestmentService {

    private final InvestmentRepository investmentRepository;

    public List<Investment> getMyInvestments(String email) {
        return investmentRepository.findByUserEmail(email);
    }

    // Pause SIP
    public Investment pauseInvestment(Long id, String email) {
        Investment inv = investmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Investment not found"));

        if (!inv.getUser().getEmail().equals(email))
            throw new RuntimeException("Unauthorized");

        if (inv.getType() != Investment.InvestmentType.SIP)
            throw new RuntimeException("Only SIP investments can be paused");

        if (inv.getStatus() == Investment.InvestmentStatus.PAUSED)
            throw new RuntimeException("SIP is already paused");

        inv.setStatus(Investment.InvestmentStatus.PAUSED);
        return investmentRepository.save(inv);
    }

    // Resume SIP
    public Investment resumeInvestment(Long id, String email) {
        Investment inv = investmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Investment not found"));

        if (!inv.getUser().getEmail().equals(email))
            throw new RuntimeException("Unauthorized");

        if (inv.getStatus() != Investment.InvestmentStatus.PAUSED)
            throw new RuntimeException("SIP is not paused");

        inv.setStatus(Investment.InvestmentStatus.ACTIVE);
        return investmentRepository.save(inv);
    }

    // Remove investment (SIP or Lumpsum)
    public void removeInvestment(Long id, String email) {
        Investment inv = investmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Investment not found"));

        if (!inv.getUser().getEmail().equals(email))
            throw new RuntimeException("Unauthorized");

        investmentRepository.delete(inv);
    }

    public PortfolioSummaryResponse getPortfolioSummary(String email) {
        List<Investment> investments = investmentRepository.findByUserEmail(email);

        BigDecimal totalInvested = BigDecimal.ZERO;
        BigDecimal currentValue = BigDecimal.ZERO;
        Map<String, BigDecimal> allocation = new HashMap<>();

        for (Investment inv : investments) {
            // 1. Calculate Total Invested
            totalInvested = totalInvested.add(inv.getAmount());

            // 2. Calculate Current Value (Units * Current NAV from MutualFund entity)
            BigDecimal currentNav = inv.getMutualFund().getCurrentNav();
            BigDecimal value = inv.getUnits().multiply(currentNav);
            currentValue = currentValue.add(value);

            // 3. Personalized Analytics: Asset Allocation
            String category = inv.getMutualFund().getCategory().name();
            allocation.put(category, allocation.getOrDefault(category, BigDecimal.ZERO).add(value));
        }

        BigDecimal gainLoss = currentValue.subtract(totalInvested);
        Double percentage = totalInvested.compareTo(BigDecimal.ZERO) > 0
                ? gainLoss.divide(totalInvested, 4, RoundingMode.HALF_UP).multiply(new BigDecimal(100)).doubleValue()
                : 0.0;

        return new PortfolioSummaryResponse(totalInvested, currentValue, gainLoss, percentage, allocation);
    }

    public List<Investment> getUpcomingSIPs(String email) {
        // Fetches active SIPs for the user to display next due dates
        return investmentRepository.findByUserEmailAndTypeAndStatus(
                email,
                Investment.InvestmentType.SIP,
                Investment.InvestmentStatus.ACTIVE
        );
    }
}