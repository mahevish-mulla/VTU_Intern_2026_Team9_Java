package com.Demiexample.DemiProjectWW.service;

import com.Demiexample.DemiProjectWW.entity.User;
import com.Demiexample.DemiProjectWW.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.security.crypto.password
    .PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation
    .Transactional;

import com.Demiexample.DemiProjectWW.dto.request.AdminLoginRequest;
import com.Demiexample.DemiProjectWW.dto.request.*;

import com.Demiexample.DemiProjectWW.dto.response.AuthResponse;
import com.Demiexample.DemiProjectWW.entity.PasswordResetToken;
import com.Demiexample.DemiProjectWW.repository.*;
import com.Demiexample.DemiProjectWW.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository
        tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    // ── REGISTER ───────────────────────────────────
    public String register(RegisterRequest req) {

        if (userRepository.existsByEmail(
                req.getEmail())) {
            throw new RuntimeException(
                "Email already registered.");
        }
        if (userRepository.existsByPhone(
                req.getPhone())) {
            throw new RuntimeException(
                "Phone already registered.");
        }

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPhone(req.getPhone());
        user.setPassword(passwordEncoder.encode(
            req.getPassword()));
        user.setRole(User.Role.INVESTOR);
        userRepository.save(user);

        return "Registration successful!";
    }

    // ── INVESTOR LOGIN ─────────────────────────────
    public AuthResponse login(LoginRequest req) {

        User user = userRepository
            .findByEmail(req.getEmail())
            .orElseThrow(() ->
                new RuntimeException(
                    "Invalid email or password."));

        if (user.getStatus() ==
                User.Status.INACTIVE) {
            throw new RuntimeException(
                "Account deactivated. " +
                "Contact admin.");
        }

        if (!passwordEncoder.matches(
                req.getPassword(),
                user.getPassword())) {
            throw new RuntimeException(
                "Invalid email or password.");
        }

        String token = jwtUtil.generateToken(
            user.getEmail(),
            user.getRole().name());

        return new AuthResponse(
            token,
            user.getRole().name(),
            user.getName(),
            user.getUserId());
    }

    // ── ADMIN LOGIN ────────────────────────────────
    public AuthResponse adminLogin(
            AdminLoginRequest req) {

        User admin = userRepository
            .findByAdminKey(req.getAdminKey())
            .orElseThrow(() ->
                new RuntimeException(
                    "Invalid admin key."));

        if (admin.getRole() != User.Role.ADMIN) {
            throw new RuntimeException(
                "Not an admin account.");
        }

        String identifier =
            admin.getEmail() != null
                ? admin.getEmail()
                : "admin@wealthwise.com";

        String token = jwtUtil.generateToken(
            identifier,
            admin.getRole().name());

        return new AuthResponse(
            token,
            admin.getRole().name(),
            admin.getName(),
            admin.getUserId());
    }

    // ── SEND OTP ───────────────────────────────────
    @Transactional
    public String sendOtp(
            ForgotPasswordRequest req) {

        User user = userRepository
            .findByEmail(req.getEmail())
            .orElseThrow(() ->
                new RuntimeException(
                    "No account found " +
                    "with this email."));

        // Delete old OTPs
        tokenRepository.deleteByUser_UserId(
            user.getUserId());

        // Generate 6-digit OTP
        String otp = String.format("%06d",
            new Random().nextInt(999999));

        // Save OTP
        PasswordResetToken resetToken =
            new PasswordResetToken();
        resetToken.setUser(user);
        resetToken.setOtp(otp);
        resetToken.setExpiryTime(
            LocalDateTime.now().plusMinutes(10));
        tokenRepository.save(resetToken);

        // Send email
        emailService.sendOtpEmail(
            user.getEmail(), otp);

        return "OTP sent to your registered email.";
    }

    // ── VERIFY OTP ─────────────────────────────────
    public String verifyOtp(VerifyOtpRequest req) {

        PasswordResetToken resetToken =
            tokenRepository
                .findByUser_EmailAndUsedFalse(
                    req.getEmail())
                .orElseThrow(() ->
                    new RuntimeException(
                        "OTP not found. " +
                        "Please request again."));

        if (resetToken.getExpiryTime()
                .isBefore(LocalDateTime.now())) {
            throw new RuntimeException(
                "OTP expired. " +
                "Please request a new one.");
        }

        if (!resetToken.getOtp()
                .equals(req.getOtp())) {
            throw new RuntimeException(
                "Invalid OTP. Please try again.");
        }

        resetToken.setVerified(true);
        tokenRepository.save(resetToken);

        return "OTP verified successfully.";
    }

    // ── RESET PASSWORD ─────────────────────────────
    public String resetPassword(
            ResetPasswordRequest req) {

        PasswordResetToken resetToken =
            tokenRepository
                .findByUser_EmailAndUsedFalse(
                    req.getEmail())
                .orElseThrow(() ->
                    new RuntimeException(
                        "Session expired. " +
                        "Please start again."));

        if (!resetToken.isVerified()) {
            throw new RuntimeException(
                "Please verify OTP first.");
        }

        if (resetToken.getExpiryTime()
                .isBefore(LocalDateTime.now())) {
            throw new RuntimeException(
                "Session expired. " +
                "Please start again.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(
            req.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        return "Password reset successfully. " +
               "Please login.";
    }
}