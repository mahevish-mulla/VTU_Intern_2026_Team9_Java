package com.Demiexample.DemiProjectWW.controller;

import com.Demiexample.DemiProjectWW.dto.LoginRequest;
import com.Demiexample.DemiProjectWW.dto.RegisterRequest;
import com.Demiexample.DemiProjectWW.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.Demiexample.DemiProjectWW.dto.PasswordUpdateRequest;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            String token = authService.register(request);
            return ResponseEntity.ok(Map.of("token", token));
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage() : "Registration failed";
            return ResponseEntity.status(400).body(Map.of("message", msg));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Map<String, String> response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage() : "Login failed";
            return ResponseEntity.status(401).body(Map.of("message", msg));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Map<String, String> profile = authService.getUserProfile(token);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage() : "Unauthorized access";
            return ResponseEntity.status(401).body(Map.of("message", msg));
        }
    }

    @PutMapping("/update-password")
    public ResponseEntity<?> updatePassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody PasswordUpdateRequest request) {
        try {
            String token = authHeader.replace("Bearer ", "");
            authService.updatePassword(token, request);
            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage() : "Password update failed";
            if (msg.contains("Invalid current password")) {
                return ResponseEntity.status(400).body(Map.of("message", msg));
            }
            return ResponseEntity.status(401).body(Map.of("message", msg));
        }
    }

    @DeleteMapping("/profile")
    public ResponseEntity<?> deleteAccount(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            authService.deleteAccount(token);
            return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage() : "Account deletion failed";
            return ResponseEntity.status(400).body(Map.of("message", msg));
        }
    }
}