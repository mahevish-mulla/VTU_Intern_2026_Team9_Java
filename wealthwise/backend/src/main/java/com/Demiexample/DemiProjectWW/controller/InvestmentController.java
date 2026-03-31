package com.Demiexample.DemiProjectWW.controller;

import com.Demiexample.DemiProjectWW.entity.Investment;
import com.Demiexample.DemiProjectWW.repository.InvestmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/investments")
@RequiredArgsConstructor
public class InvestmentController {

    private final InvestmentRepository investmentRepository;

    @GetMapping("/{userId}")
    public List<Investment> getUserInvestments(@PathVariable Long userId) {
        return investmentRepository.findByUserUserId(userId);
    }
    @DeleteMapping("/{id}")
    public void deleteInvestment(@PathVariable Long id) {
        investmentRepository.deleteById(id);
    }
}