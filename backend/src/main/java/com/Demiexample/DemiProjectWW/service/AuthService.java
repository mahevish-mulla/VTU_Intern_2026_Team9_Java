package com.Demiexample.DemiProjectWW.service;

import com.Demiexample.DemiProjectWW.dto.LoginRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;

    public String login(LoginRequestDto request){

        UsernamePasswordAuthenticationToken token =
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                );

        authenticationManager.authenticate(token);

        return "Login Successful";
    }
}
