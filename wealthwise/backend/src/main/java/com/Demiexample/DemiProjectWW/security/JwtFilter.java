package com.Demiexample.DemiProjectWW.security;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        System.out.println("=== JWT FILTER ===");
        System.out.println("URL: " + request.getRequestURI());
        System.out.println("Auth Header: " + authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            System.out.println("Token found: " + token.substring(0, 20) + "...");

            if (jwtUtil.validateToken(token)) {
                System.out.println("Token is VALID");
                String email = jwtUtil.extractEmail(token);
                System.out.println("Email from token: " + email);

                try {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                    System.out.println("User loaded: " + userDetails.getUsername());
                    System.out.println("Authorities: " + userDetails.getAuthorities());

                    UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                            userDetails, null,
                            userDetails.getAuthorities());
                    authToken.setDetails(
                        new WebAuthenticationDetailsSource()
                            .buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("Authentication SET successfully");

                } catch (Exception e) {
                    System.out.println("ERROR loading user: " + e.getMessage());
                }
            } else {
                System.out.println("Token is INVALID");
            }
        } else {
            System.out.println("No Bearer token found");
        }

        filterChain.doFilter(request, response);
    }
}

//package com.Demiexample.DemiProjectWW.security;
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.authentication
//    .UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.context
//    .SecurityContextHolder;
//import org.springframework.security.core.userdetails
//    .UserDetails;
//import org.springframework.security.web.authentication
//    .WebAuthenticationDetailsSource;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter
//    .OncePerRequestFilter;
//import java.io.IOException;
//
//@Component
//@RequiredArgsConstructor
//public class JwtFilter extends OncePerRequestFilter {
//
//    private final JwtUtil jwtUtil;
//    private final UserDetailsServiceImpl userDetailsService;
//
//    @Override
//    protected void doFilterInternal(
//            HttpServletRequest request,
//            HttpServletResponse response,
//            FilterChain filterChain)
//            throws ServletException, IOException {
//
//        String authHeader =
//            request.getHeader("Authorization");
//
//        if (authHeader != null
//                && authHeader.startsWith("Bearer ")) {
//
//            String token = authHeader.substring(7);
//
//            if (jwtUtil.validateToken(token)) {
//                String email =
//                    jwtUtil.extractEmail(token);
//
//                UserDetails userDetails =
//                    userDetailsService
//                        .loadUserByUsername(email);
//
//                UsernamePasswordAuthenticationToken
//                    authToken =
//                    new UsernamePasswordAuthenticationToken(
//                        userDetails, null,
//                        userDetails.getAuthorities());
//
//                authToken.setDetails(
//                    new WebAuthenticationDetailsSource()
//                        .buildDetails(request));
//
//                SecurityContextHolder.getContext()
//                    .setAuthentication(authToken);
//            }
//        }
//        filterChain.doFilter(request, response);
//    }
//}
