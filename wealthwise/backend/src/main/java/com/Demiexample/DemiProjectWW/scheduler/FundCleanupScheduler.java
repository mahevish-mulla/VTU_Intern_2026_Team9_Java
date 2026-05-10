package com.Demiexample.DemiProjectWW.scheduler;

import com.Demiexample.DemiProjectWW.entity.Investment;
import com.Demiexample.DemiProjectWW.entity.MutualFund;
import com.Demiexample.DemiProjectWW.repository.InvestmentRepository;
import com.Demiexample.DemiProjectWW.repository.MutualFundRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class FundCleanupScheduler {

    private final MutualFundRepository mutualFundRepository;
    private final InvestmentRepository investmentRepository;

    /**
     * This scheduled job runs automatically every day at midnight.
     * It scans for deactivated funds whose 30-day grace period has expired,
     * and stops any ongoing investments/SIPs linked to those funds.
     */
    @Scheduled(cron = "0 0 0 * * ?") 
    @Transactional
    public void cleanupDeactivatedFunds() {
        log.info("Starting scheduled cleanup of expired deactivated mutual funds...");

        // Find all deactivated funds
        List<MutualFund> deactivatedFunds = mutualFundRepository.findAll().stream()
                .filter(fund -> !fund.isActive() && fund.getGracePeriodEnds() != null)
                .toList();

        LocalDateTime now = LocalDateTime.now();
        int affectedInvestments = 0;

        for (MutualFund fund : deactivatedFunds) {
            // Check if grace period is fully over
            if (now.isAfter(fund.getGracePeriodEnds())) {
                log.info("Grace period expired for fund: {}", fund.getFundName());
                
                // Fetch all investments tied to this fund
                List<Investment> investments = investmentRepository.findByMutualFundFundId(fund.getFundId());
                
                for (Investment investment : investments) {
                    if (investment.getStatus() != Investment.InvestmentStatus.STOPPED) {
                        investment.setStatus(Investment.InvestmentStatus.STOPPED);
                        affectedInvestments++;
                    }
                }
                
                // Save the modifications
                investmentRepository.saveAll(investments);
            }
        }

        log.info("Scheduled cleanup finished. Total investments automatically stopped: {}", affectedInvestments);
    }
}
