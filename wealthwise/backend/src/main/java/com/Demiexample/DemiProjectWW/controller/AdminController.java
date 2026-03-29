package com.Demiexample.DemiProjectWW.controller;

import com.Demiexample.DemiProjectWW.dto.request.AmcRequest;
import com.Demiexample.DemiProjectWW.dto.request.FundRequest;
import com.Demiexample.DemiProjectWW.entity.Amc;
import com.Demiexample.DemiProjectWW.entity.MutualFund;
import com.Demiexample.DemiProjectWW.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/amc")
    public ResponseEntity<Amc> addAmc(@RequestBody AmcRequest req) {
        return ResponseEntity.ok(adminService.addAmc(req));
    }

    @GetMapping("/amcs")
    public ResponseEntity<List<Amc>> getAllAmcs() {
        return ResponseEntity.ok(adminService.getAllAmcs());
    }

    @PostMapping("/funds")
    public ResponseEntity<MutualFund> addMutualFund(@RequestBody FundRequest req) {
        return ResponseEntity.ok(adminService.addMutualFund(req));
    }
}