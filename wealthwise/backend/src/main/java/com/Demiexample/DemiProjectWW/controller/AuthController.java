package com.Demiexample.DemiProjectWW.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

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
    public ResponseEntity<AuthResponse> register(
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
    public ResponseEntity<?> forgotPassword(
            @RequestBody ForgotPasswordRequest req) {
        return ResponseEntity.ok(
            Map.of("message", authService.sendOtp(req))
        );
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestBody VerifyOtpRequest req) {
        return ResponseEntity.ok(
            Map.of("message", authService.verifyOtp(req))
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequest req) {
        return ResponseEntity.ok(
            Map.of("message", authService.resetPassword(req))
        );
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(authService.getProfile(email));
    }

    @PutMapping("/update-password")
    public ResponseEntity<?> updatePassword(
            @RequestBody Map<String, String> req,
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
            Map.of("message",
                authService.updatePassword(
                    email,
                    req.get("currentPassword"),
                    req.get("newPassword")
                )
            )
        );
    }

    @DeleteMapping("/profile")
    public ResponseEntity<?> deleteAccount(Authentication authentication) {
        String email = authentication.getName();
        authService.deleteAccount(email);
        return ResponseEntity.ok(
            Map.of("message", "Account deleted successfully")
        );
    }
}