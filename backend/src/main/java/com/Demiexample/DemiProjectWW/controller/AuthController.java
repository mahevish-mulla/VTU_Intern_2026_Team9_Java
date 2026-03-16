package com.Demiexample.DemiProjectWW.controller;

import com.Demiexample.DemiProjectWW.dto.LoginRequest;
import com.Demiexample.DemiProjectWW.dto.RegisterRequest;
import com.Demiexample.DemiProjectWW.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public Map<String,String> register(@RequestBody RegisterRequest request) {

        String token = authService.register(request);

        return Map.of("token", token);
    }

    @PostMapping("/login")
    public Map<String,String> login(@RequestBody LoginRequest request) {

        String token = authService.login(request);

        return Map.of("token", token);
    }
}