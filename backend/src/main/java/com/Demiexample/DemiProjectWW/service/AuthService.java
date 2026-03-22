package com.Demiexample.DemiProjectWW.service;

import com.Demiexample.DemiProjectWW.dto.LoginRequest;
import com.Demiexample.DemiProjectWW.dto.RegisterRequest;
import com.Demiexample.DemiProjectWW.entity.User;
import com.Demiexample.DemiProjectWW.repository.UserRepository;
import com.Demiexample.DemiProjectWW.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.Demiexample.DemiProjectWW.dto.PasswordUpdateRequest;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public String register(RegisterRequest request) {

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));

        userRepository.save(user);

        return jwtUtil.generateToken(user.getEmail());
    }

    public Map<String, String> login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        Map<String, String> response = new HashMap<>();
        response.put("token", jwtUtil.generateToken(user.getEmail()));
        response.put("role", user.getRole());
        return response;
    }

    public Map<String, String> getUserProfile(String token) {
        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, String> profile = new HashMap<>();
        profile.put("name", user.getName());
        profile.put("email", user.getEmail());
        profile.put("role", user.getRole());
        return profile;
    }

    public void updatePassword(String token, PasswordUpdateRequest request) {
        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!encoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid current password");
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public void deleteAccount(String token) {
        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }
}