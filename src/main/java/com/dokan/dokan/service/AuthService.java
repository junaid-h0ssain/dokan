package com.dokan.dokan.service;

import com.dokan.dokan.dto.AuthResponse;
import com.dokan.dokan.dto.LoginRequest;
import com.dokan.dokan.dto.RegisterRequest;
import com.dokan.dokan.dto.UserDto;
import com.dokan.dokan.exception.EmailAlreadyExistsException;
import com.dokan.dokan.exception.InvalidCredentialsException;
import com.dokan.dokan.model.User;
import com.dokan.dokan.repository.UserRepository;
import com.dokan.dokan.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    
    /**
     * Registers a new user with email and password
     * @param request RegisterRequest containing email and password
     * @return AuthResponse with JWT token and user info
     * @throws EmailAlreadyExistsException if email already exists
     */
    public AuthResponse registerUser(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists: " + request.getEmail());
        }
        
        // Validate password length (minimum 8 characters)
        if (request.getPassword().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }
        
        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        // Save user to database
        User savedUser = userRepository.save(user);
        
        // Generate JWT token
        String token = jwtTokenProvider.generateToken(savedUser);
        
        // Return AuthResponse with token and user info
        return new AuthResponse(token, UserDto.fromUser(savedUser));
    }
    
    /**
     * Authenticates a user with email and password
     * @param request LoginRequest containing email and password
     * @return AuthResponse with JWT token and user info
     * @throws InvalidCredentialsException if credentials are invalid
     */
    public AuthResponse loginUser(LoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));
        
        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }
        
        // Generate JWT token
        String token = jwtTokenProvider.generateToken(user);
        
        // Return AuthResponse with token and user info
        return new AuthResponse(token, UserDto.fromUser(user));
    }
}
