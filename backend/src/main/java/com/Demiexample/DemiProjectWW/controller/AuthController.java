package com.Demiexample.DemiProjectWW.controller;

import com.Demiexample.DemiProjectWW.dto.*;
import com.Demiexample.DemiProjectWW.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponseDto login(@RequestBody LoginRequestDto request){

        String message = authService.login(request);

        return new LoginResponseDto(message);
    }

    @GetMapping("/")
    public String sipPage(){
        return "This is SPI page";
    }

    @GetMapping("/login")
    public String loginPage(){
        return "Login endpoint - use POST to authenticate";
    }
}