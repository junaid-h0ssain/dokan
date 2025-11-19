package com.dokan.dokan.controller;

import com.dokan.dokan.dto.AuthResponse;
import com.dokan.dokan.dto.LoginRequest;
import com.dokan.dokan.dto.RegisterRequest;
import com.dokan.dokan.model.User;
import com.dokan.dokan.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    /**
     * Register a new user
     * @param request RegisterRequest containing email and password
     * @return ResponseEntity with AuthResponse and HTTP 201 status
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse authResponse = authService.registerUser(request);
        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }
    
    /**
     * Login user and return JWT token
     * @param request LoginRequest containing email and password
     * @return ResponseEntity with AuthResponse and HTTP 200 status
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.loginUser(request);
        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }
}
