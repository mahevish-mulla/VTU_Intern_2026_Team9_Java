package com.Demiexample.DemiProjectWW.controller;


import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.Demiexample.DemiProjectWW.dto.request.InvestmentRequest;
import com.Demiexample.DemiProjectWW.entity.Investment;
import com.Demiexample.DemiProjectWW.entity.MutualFund;
import com.Demiexample.DemiProjectWW.entity.User;
import com.Demiexample.DemiProjectWW.repository.InvestmentRepository;
import com.Demiexample.DemiProjectWW.repository.MutualFundRepository;
import com.Demiexample.DemiProjectWW.repository.UserRepository;

import lombok.RequiredArgsConstructor;
 
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
 
    // GET /api/funds/browse
    // GET /api/funds/browse?category=EQUITY
    // GET /api/funds/browse?risk=LOW
    // GET /api/funds/browse?category=EQUITY&risk=LOW
    @GetMapping("/browse")
    public List<MutualFund> browseFunds(
            @RequestParam(value = "category", required = false) MutualFund.Category category,
            @RequestParam(value = "risk", required = false) MutualFund.RiskLevel risk) {
 
        if (category != null && risk != null) {
            return mutualFundRepository
                .findByCategoryAndRiskLevel(category, risk);
        }
        if (category != null) {
            return mutualFundRepository.findByCategory(category);
        }
        if (risk != null) {
            return mutualFundRepository.findByRiskLevel(risk);
        }
        return mutualFundRepository.findAll();
    }
 
    // GET /api/funds/{schemeCode}/live
    // Called by MyInvestments page to get real-time NAV
    @GetMapping("/{schemeCode}/live")
    public Map<String, Object> getLiveNav(
            @PathVariable(value = "schemeCode") Integer schemeCode) {
        String url = mfApiBaseUrl + "/" + schemeCode + "/latest";
        return restTemplate.getForObject(url, Map.class);
    }
 
    // POST /api/funds/invest
    @PostMapping("/invest")
    public ResponseEntity<Investment> addInvestment(
            @RequestBody InvestmentRequest req) {
 
        if (req.getAmount() == null
                || req.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Invalid investment amount");
        }
 
        User user = userRepository.findById(req.getUserId())
            .orElseThrow(() ->
                new RuntimeException("User not found"));
 
        MutualFund fund = mutualFundRepository.findById(req.getFundId())
            .orElseThrow(() ->
                new RuntimeException("Fund not found"));
 
        BigDecimal nav = fund.getCurrentNav();
        if (nav == null || nav.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Invalid NAV for fund");
        }
 
        BigDecimal units = req.getAmount()
            .divide(nav, 4, RoundingMode.HALF_UP);
 
        Investment investment = new Investment();
        investment.setUser(user);
        investment.setMutualFund(fund);
        investment.setAmount(req.getAmount());
        investment.setType(req.getParsedType());
        investment.setBuyNav(nav);
        investment.setUnits(units);
        
     // ← Add SIP day and next due date
        if (req.getParsedType() == Investment.InvestmentType.SIP 
                && req.getSipStartDate() != null) {
            LocalDate sipDate = LocalDate.parse(req.getSipStartDate());
            int sipDay = sipDate.getDayOfMonth();
            investment.setSipDay(sipDay);
            
            // Calculate next due date
            LocalDate today = LocalDate.now();
            LocalDate nextDue = today.withDayOfMonth(sipDay);
            if (!nextDue.isAfter(today)) {
                nextDue = nextDue.plusMonths(1);
            }
            investment.setNextDueDate(nextDue);
        }
 
        return ResponseEntity.ok(
            investmentRepository.save(investment));
    }
}