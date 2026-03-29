// New File: VTU_Intern_2026_Team9_Java/wealthwise/backend/src/main/java/com/Demiexample/DemiProjectWW/controller/PublicFundController.java
package com.Demiexample.DemiProjectWW.controller;

import com.Demiexample.DemiProjectWW.dto.request.InvestmentRequest;
import com.Demiexample.DemiProjectWW.entity.Investment;
import com.Demiexample.DemiProjectWW.entity.MutualFund;
import com.Demiexample.DemiProjectWW.entity.User;
import com.Demiexample.DemiProjectWW.repository.InvestmentRepository;
import com.Demiexample.DemiProjectWW.repository.MutualFundRepository;
import com.Demiexample.DemiProjectWW.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
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

    // Shivshankar's Feature: Browse Funds with Filters
    @GetMapping("/browse")
    public List<MutualFund> browseFunds(
            @RequestParam(required = false) MutualFund.Category category,
            @RequestParam(required = false) MutualFund.RiskLevel risk) {
        if (category != null && risk != null) return mutualFundRepository.findByCategoryAndRiskLevel(category, risk);
        return mutualFundRepository.findAll();
    }

    // Shivshankar's Feature: Live NAV Display
    @GetMapping("/{schemeCode}/live")
    public Map<String, Object> getLiveNav(@PathVariable Integer schemeCode) {
        String url = "https://api.mfapi.in/mf/" + schemeCode + "/latest";
        return restTemplate.getForObject(url, Map.class);
    }

    @PostMapping("/invest")
    public ResponseEntity<Investment> addInvestment(@RequestBody InvestmentRequest req) {
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        MutualFund fund = mutualFundRepository.findById(req.getFundId())
                .orElseThrow(() -> new RuntimeException("Fund not found"));

        Investment investment = new Investment();
        investment.setUser(user);
        investment.setMutualFund(fund);
        investment.setAmount(req.getAmount());
        investment.setType(req.getType());

        return ResponseEntity.ok(investmentRepository.save(investment));
    }
}