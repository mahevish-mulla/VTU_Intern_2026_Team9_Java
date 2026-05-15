package com.Demiexample.DemiProjectWW.scheduler;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.Demiexample.DemiProjectWW.entity.Investment;
import com.Demiexample.DemiProjectWW.entity.MutualFund;
import com.Demiexample.DemiProjectWW.entity.NavHistory;
import com.Demiexample.DemiProjectWW.repository.InvestmentRepository;
import com.Demiexample.DemiProjectWW.repository.MutualFundRepository;
import com.Demiexample.DemiProjectWW.repository.NavHistoryRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
 
@Component
@EnableScheduling
@RequiredArgsConstructor
@Slf4j
public class NavScheduler {
 
    private final MutualFundRepository mutualFundRepository;
    private final InvestmentRepository investmentRepository; 
    private final NavHistoryRepository navHistoryRepository;
    private final RestTemplate restTemplate;
 
    @Value("${mfapi.base.url}")
    private String mfApiBaseUrl;
 
    // Runs every day at 8:00 PM IST
    // cron = "second minute hour day month weekday"
    @Scheduled(cron = "0 0 20 * * *")
    public void updateAllNavs() {
        log.info("NAV Scheduler started — fetching latest NAVs from MFAPI");
 
        List<MutualFund> funds =
            mutualFundRepository.findBySchemeCodeIsNotNull();
 
        int success = 0;
        int failed = 0;
 
        for (MutualFund fund : funds) {
            try {
                String url = mfApiBaseUrl + "/"
                    + fund.getSchemeCode() + "/latest";
 
                Map<String, Object> response =
                    restTemplate.getForObject(url, Map.class);
 
                if (response == null
                        || !"SUCCESS".equals(response.get("status"))) {
                    log.warn("MFAPI returned non-success for scheme: {}",
                        fund.getSchemeCode());
                    failed++;
                    continue;
                }
 
                // MFAPI response: { "data": [{ "nav": "85.234", "date": "01-04-2026" }] }
                List<Map<String, String>> data =
                    (List<Map<String, String>>) response.get("data");
 
                if (data == null || data.isEmpty()) {
                    log.warn("No NAV data for scheme: {}",
                        fund.getSchemeCode());
                    failed++;
                    continue;
                }
 
                String navStr = data.get(0).get("nav");
                BigDecimal newNav = new BigDecimal(navStr);
 
                // 1. Update current NAV on the fund
                fund.setCurrentNav(newNav);
                mutualFundRepository.save(fund);
 
                // 2. Save to nav_history for historical tracking
                NavHistory history = new NavHistory();
                history.setMutualFund(fund);
                history.setNav(newNav);
                history.setNavDate(LocalDate.now());
                navHistoryRepository.save(history);
 
                success++;
                log.info("Updated NAV for [{}] → ₹{}",
                    fund.getFundName(), newNav);
 
            } catch (Exception e) {
                log.error("Failed to update NAV for scheme {}: {}",
                    fund.getSchemeCode(), e.getMessage());
                failed++;
            }
        }
 
        log.info("NAV Scheduler done — Success: {}, Failed: {}",
            success, failed);
    }
    
    @Scheduled(cron = "0 0 0 * * *") // runs every midnight
    @Transactional
    public void stopExpiredSips() {
        List<Investment> expired = investmentRepository
            .findByStatusAndMutualFundGracePeriodEndsBefore(
                Investment.InvestmentStatus.ACTIVE,
                LocalDateTime.now());

        expired.stream()
            .filter(inv -> inv.getType() == Investment.InvestmentType.SIP)
            .filter(inv -> !inv.getMutualFund().isActive())
            .forEach(inv -> {
                inv.setStatus(Investment.InvestmentStatus.STOPPED);
                investmentRepository.save(inv);
            });
    }
}