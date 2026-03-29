package com.Demiexample.DemiProjectWW.service;

import com.Demiexample.DemiProjectWW.dto.request.AmcRequest;
import com.Demiexample.DemiProjectWW.dto.request.FundRequest;
import com.Demiexample.DemiProjectWW.entity.Amc;
import com.Demiexample.DemiProjectWW.entity.MutualFund;
import com.Demiexample.DemiProjectWW.repository.AmcRepository;
import com.Demiexample.DemiProjectWW.repository.MutualFundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AmcRepository amcRepository;
    private final MutualFundRepository mutualFundRepository;

    @Transactional
    public Amc addAmc(AmcRequest req) {
        Amc amc = new Amc();
        amc.setAmcName(req.getAmcName());
        // createdAt is handled by the entity default or @PrePersist
        return amcRepository.save(amc);
    }

    public List<Amc> getAllAmcs() {
        return amcRepository.findAll();
    }

    @Transactional
    public MutualFund addMutualFund(FundRequest req) {
        // Verify AMC exists before linking
        Amc amc = amcRepository.findById(req.getAmcId())
                .orElseThrow(() -> new RuntimeException("AMC with ID " + req.getAmcId() + " not found"));

        MutualFund fund = new MutualFund();
        fund.setFundName(req.getFundName());
        fund.setCategory(req.getCategory());
        fund.setRiskLevel(req.getRiskLevel());
        fund.setSchemeCode(req.getSchemeCode());
        fund.setAmc(amc);

        // Ensure default NAV is 0.00 as per schema until MFAPI job runs
        fund.setCurrentNav(BigDecimal.ZERO);

        return mutualFundRepository.save(fund);
    }
}