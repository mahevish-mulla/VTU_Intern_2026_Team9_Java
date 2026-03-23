package com.Demiexample.DemiProjectWW.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Demiexample.DemiProjectWW.dto.request.AdminLoginRequest;
import com.Demiexample.DemiProjectWW.dto.request.ForgotPasswordRequest;
import com.Demiexample.DemiProjectWW.dto.request.LoginRequest;
import com.Demiexample.DemiProjectWW.dto.request.RegisterRequest;
import com.Demiexample.DemiProjectWW.dto.request.ResetPasswordRequest;
import com.Demiexample.DemiProjectWW.dto.request.VerifyOtpRequest;
import com.Demiexample.DemiProjectWW.dto.response.AuthResponse;
import com.Demiexample.DemiProjectWW.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(
            authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest req) {
        return ResponseEntity.ok(
            authService.login(req));
    }

    @PostMapping("/admin/login")
    public ResponseEntity<AuthResponse> adminLogin(
            @RequestBody AdminLoginRequest req) {
        return ResponseEntity.ok(
            authService.adminLogin(req));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody ForgotPasswordRequest req) {
        return ResponseEntity.ok(
            authService.sendOtp(req));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(
            @RequestBody VerifyOtpRequest req) {
        return ResponseEntity.ok(
            authService.verifyOtp(req));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestBody ResetPasswordRequest req) {
        return ResponseEntity.ok(
            authService.resetPassword(req));
    }
}