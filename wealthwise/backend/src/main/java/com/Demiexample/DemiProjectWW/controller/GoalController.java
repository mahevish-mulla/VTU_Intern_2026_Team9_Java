package com.Demiexample.DemiProjectWW.controller;

import com.Demiexample.DemiProjectWW.entity.Goal;
import com.Demiexample.DemiProjectWW.entity.Investment;
import com.Demiexample.DemiProjectWW.entity.User;
import com.Demiexample.DemiProjectWW.repository.GoalRepository;
import com.Demiexample.DemiProjectWW.repository.InvestmentRepository;
import com.Demiexample.DemiProjectWW.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalRepository    goalRepository;
    private final UserRepository    userRepository;
    private final InvestmentRepository investmentRepository; // ← ADDED

    // ── GET /api/goals ───────────────────────────────────────────────────────
    @GetMapping
    public List<Goal> getMyGoals(Authentication auth) {
        return goalRepository.findByUserEmail(auth.getName());
    }

    // ── POST /api/goals ──────────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<?> createGoal(
            @RequestBody Goal goal,
            Authentication auth) {

        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        goal.setUser(user);
        return ResponseEntity.ok(goalRepository.save(goal));
    }

    // ── POST /api/goals/{goalId}/link-investment ─────────────────────────────
    @PostMapping("/{goalId}/link-investment")
    @Transactional
    public ResponseEntity<?> linkInvestment(
            @PathVariable Long goalId,
            @RequestBody Map<String, Long> body,
            Authentication auth) {

        String email = auth.getName();

        // 1. Load & authorise goal
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        if (!goal.getUser().getEmail().equals(email)) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
        }

        Long investmentId = body.get("investmentId");
        if (investmentId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "investmentId is required"));
        }

        // 2. FIX: Validate the investment exists AND belongs to the same user
        Investment investment = investmentRepository.findById(investmentId)
                .orElseThrow(() -> new RuntimeException("Investment not found"));
        if (!investment.getUser().getEmail().equals(email)) {
            return ResponseEntity.status(403).body(Map.of("error", "Investment does not belong to you"));
        }

        // 3. One investment per goal — replace existing link (if any)
        //    This is the "replace" strategy. If you want to BLOCK after first link,
        //    uncomment the block below instead:
        //
        // if (!goal.getLinkedInvestmentIds().isEmpty()) {
        //     return ResponseEntity.badRequest()
        //         .body(Map.of("error", "This goal already has a linked investment. Remove it first."));
        // }

        goal.getLinkedInvestmentIds().clear();
        goal.getLinkedInvestmentIds().add(investmentId);

        return ResponseEntity.ok(goalRepository.save(goal));
    }

    // ── DELETE /api/goals/{id} ────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    @Transactional  // ← FIX: wrap all 3 steps in one transaction
    public ResponseEntity<?> deleteGoal(
            @PathVariable Long id,
            Authentication auth) {

        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        if (!goal.getUser().getEmail().equals(auth.getName())) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
        }

        // Clear join-table rows first, then delete parent
        goal.getLinkedInvestmentIds().clear();
        goalRepository.delete(goal); // @Transactional handles flush order
        return ResponseEntity.ok(Map.of("message", "Goal deleted"));
    }
}
