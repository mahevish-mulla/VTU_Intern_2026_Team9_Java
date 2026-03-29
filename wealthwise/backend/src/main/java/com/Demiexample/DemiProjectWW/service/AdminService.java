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
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AmcRepository amcRepository;
    private final MutualFundRepository mutualFundRepository;
    private final RestTemplate restTemplate;

    // --- Manual Admin Methods ---

    @Transactional
    public Amc addAmc(AmcRequest req) {
        Amc amc = new Amc();
        amc.setAmcName(req.getAmcName());
        return amcRepository.save(amc);
    }

    public List<Amc> getAllAmcs() {
        return amcRepository.findAll();
    }

    @Transactional
    public MutualFund addMutualFund(FundRequest req) {
        Amc amc = amcRepository.findById(req.getAmcId())
                .orElseThrow(() -> new RuntimeException("AMC with ID " + req.getAmcId() + " not found"));

        MutualFund fund = new MutualFund();
        fund.setFundName(req.getFundName());
        fund.setCategory(req.getCategory());
        fund.setRiskLevel(req.getRiskLevel());
        fund.setSchemeCode(req.getSchemeCode());
        fund.setAmc(amc);
        fund.setCurrentNav(BigDecimal.ZERO);

        return mutualFundRepository.save(fund);
    }

    // --- Nikhil's Automated MFAPI Integration ---

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
}