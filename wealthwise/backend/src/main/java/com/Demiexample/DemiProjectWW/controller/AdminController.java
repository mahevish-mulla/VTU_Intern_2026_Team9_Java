package com.Demiexample.DemiProjectWW.controller;

import java.util.List;
import java.util.Map;

import com.Demiexample.DemiProjectWW.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Demiexample.DemiProjectWW.entity.MutualFund;
import com.Demiexample.DemiProjectWW.service.AdminService;

import lombok.RequiredArgsConstructor;
import com.Demiexample.DemiProjectWW.entity.Amc;
import com.Demiexample.DemiProjectWW.dto.request.AmcRequest;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/funds/auto/{schemeCode}")
    public ResponseEntity<MutualFund> autoAddFund(
            @PathVariable(value = "schemeCode") Integer schemeCode,
            @RequestParam(value = "risk") MutualFund.RiskLevel risk) {
        return ResponseEntity.ok(adminService.autoAddFundByCode(schemeCode, risk));
    }
    
//    @DeleteMapping("/funds/{fundId}")
//    public ResponseEntity<?> deleteFund(@PathVariable Long fundId) {
//        adminService.deleteFund(fundId);
//        return ResponseEntity.ok(Map.of("message", "Fund deleted"));
//    }
    
    @PutMapping("/funds/{fundId}/deactivate")
    public ResponseEntity<?> deactivateFund(@PathVariable(value = "fundId") Long fundId) {
        adminService.deactivateFund(fundId);
        return ResponseEntity.ok(Map.of("message", "Fund deactivated successfully"));
    }
    
    @PostMapping("/alerts/sip-due")
    public ResponseEntity<?> sendSipDueAlerts() {
        int count = adminService.sendSipDueReminders();
        return ResponseEntity.ok(Map.of(
            "message", "SIP due alerts sent",
            "count", count
        ));
    }

    @PostMapping("/alerts/custom")
    public ResponseEntity<?> sendCustomAlert(
            @RequestBody Map<String, String> body) {
        adminService.broadcastAlert(
            body.get("title"),
            body.get("body")
        );
        return ResponseEntity.ok(Map.of("message", "Alert sent"));
    }

    /**
     * Get list of all investors.
     */
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllInvestors() {
        return ResponseEntity.ok(adminService.getAllInvestors());
    }

    /**
     * Get user statistics for the dashboard.
     */
    @GetMapping("/users/analytics")
    public ResponseEntity<Map<String, Object>> getUserAnalytics() {
        return ResponseEntity.ok(adminService.getUserAnalytics());
    }

    /**
     * Search for specific investors.
     */
    @GetMapping("/users/search")
    public ResponseEntity<List<User>> searchInvestors(@RequestParam String q) {
        return ResponseEntity.ok(adminService.searchInvestors(q));
    }

    /**
     * Update a user's status (Activate/Deactivate).
     */
    @PutMapping("/users/{userId}/status")
    public ResponseEntity<?> changeUserStatus(
            @PathVariable Long userId,
            @RequestBody Map<String, String> statusMap) {

        User.Status status = User.Status.valueOf(statusMap.get("status").toUpperCase());
        adminService.updateUserStatus(userId, status);
        return ResponseEntity.ok(Map.of("message", "User status updated to " + status));
    }

    /**
     * Onboard a new AMC.
     */
    @PostMapping("/amc")
    public ResponseEntity<Amc> onboardAmc(@RequestBody AmcRequest request) {
        return ResponseEntity.ok(adminService.onboardAmc(request));
    }

    /**
     * Monitor System Health (NavScheduler status).
     */
    @GetMapping("/system/health")
    public ResponseEntity<Map<String, Object>> getSystemHealth() {
        return ResponseEntity.ok(adminService.getSystemHealth());
    }

    /**
     * View Total Assets Under Management (AUM).
     */
    @GetMapping("/analytics/aum")
    public ResponseEntity<Map<String, Object>> getTotalAum() {
        return ResponseEntity.ok(adminService.getFinancialOversight());
    }

}