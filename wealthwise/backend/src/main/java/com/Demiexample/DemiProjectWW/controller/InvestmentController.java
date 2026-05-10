package com.Demiexample.DemiProjectWW.controller;

import java.util.List;
import java.util.Map;

import com.Demiexample.DemiProjectWW.repository.InvestmentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.Demiexample.DemiProjectWW.dto.response.PortfolioSummaryResponse;
import com.Demiexample.DemiProjectWW.entity.Investment;
import com.Demiexample.DemiProjectWW.service.InvestmentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/investments")
@RequiredArgsConstructor
public class InvestmentController {

    private final InvestmentService investmentService;
    private final InvestmentRepository investmentRepository;

    @GetMapping("/my")
    public List<Investment> getMyInvestments(Authentication authentication) {
        String email = authentication.getName();
        return investmentRepository.findByUserEmail(email);
    }

    @GetMapping("/{userId}")
    public List<Investment> getUserInvestments(@PathVariable Long userId) {
        return investmentRepository.findByUserUserId(userId);
    }

    @DeleteMapping("/{id}")
    public void deleteInvestment(@PathVariable Long id) {
        investmentRepository.deleteById(id);
    }

    @PutMapping("/{id}/pause")
    public ResponseEntity<Investment> pauseSip(
            @PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(
                investmentService.pauseInvestment(id, auth.getName()));
    }

    @PutMapping("/{id}/resume")
    public ResponseEntity<Investment> resumeSip(
            @PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(
                investmentService.resumeInvestment(id, auth.getName()));
    }

    @DeleteMapping("/{id}/remove")
    public ResponseEntity<?> removeInvestment(
            @PathVariable Long id, Authentication auth) {
        investmentService.removeInvestment(id, auth.getName());
        return ResponseEntity.ok(Map.of("message", "Investment removed"));
    }

    @GetMapping("/summary")
    public ResponseEntity<PortfolioSummaryResponse> getSummary(Authentication auth) {
        return ResponseEntity.ok(
                investmentService.getPortfolioSummary(auth.getName()));
    }

    @GetMapping("/upcoming-sips")
    public ResponseEntity<List<Investment>> getSips(Authentication auth) {
        return ResponseEntity.ok(
                investmentService.getUpcomingSIPs(auth.getName()));
    }

    @GetMapping
    public ResponseEntity<List<Investment>> getAll(Authentication auth) {
        return ResponseEntity.ok(
                investmentService.getMyInvestments(auth.getName()));
    }
}