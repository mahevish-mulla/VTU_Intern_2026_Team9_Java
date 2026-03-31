package com.Demiexample.DemiProjectWW.controller;

import com.Demiexample.DemiProjectWW.dto.request.InvestmentRequest;
import com.Demiexample.DemiProjectWW.entity.Investment;
import com.Demiexample.DemiProjectWW.entity.MutualFund;
import com.Demiexample.DemiProjectWW.entity.User;
import com.Demiexample.DemiProjectWW.repository.InvestmentRepository;
import com.Demiexample.DemiProjectWW.repository.MutualFundRepository;
import com.Demiexample.DemiProjectWW.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/funds")
@RequiredArgsConstructor
public class PublicFundController {

    private final MutualFundRepository mutualFundRepository;
    private final RestTemplate restTemplate;
    private final InvestmentRepository investmentRepository;
    private final UserRepository userRepository;

    @Value("${mfapi.base.url}")
    private String mfApiBaseUrl;

    @GetMapping("/browse")
    public List<MutualFund> browseFunds(
            @RequestParam(required = false) MutualFund.Category category,
            @RequestParam(required = false) MutualFund.RiskLevel risk) {
        if (category != null && risk != null) {
            return mutualFundRepository.findByCategoryAndRiskLevel(category, risk);
        }
        return mutualFundRepository.findAll();
    }

    @GetMapping("/{schemeCode}/live")
    public Map<String, Object> getLiveNav(@PathVariable Integer schemeCode) {
        String url = mfApiBaseUrl + "/" + schemeCode + "/latest";
        return restTemplate.getForObject(url, Map.class);
    }

    @PostMapping("/invest")
    public ResponseEntity<Investment> addInvestment(@RequestBody InvestmentRequest req) {

        if (req.getAmount() == null || req.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Invalid investment amount");
        }

        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        MutualFund fund = mutualFundRepository.findById(req.getFundId())
                .orElseThrow(() -> new RuntimeException("Fund not found"));

        BigDecimal nav = fund.getCurrentNav();

        if (nav == null || nav.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Invalid NAV for fund");
        }

        BigDecimal units = req.getAmount().divide(nav, 4, RoundingMode.HALF_UP);

        Investment investment = new Investment();
        investment.setUser(user);
        investment.setMutualFund(fund);
        investment.setAmount(req.getAmount());
        investment.setType(req.getParsedType());
        investment.setBuyNav(nav);
        investment.setUnits(units);

        return ResponseEntity.ok(investmentRepository.save(investment));
    }
}