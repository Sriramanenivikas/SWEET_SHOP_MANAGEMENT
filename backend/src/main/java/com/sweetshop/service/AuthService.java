package com.sweetshop.service;

import com.sweetshop.dto.request.LoginRequest;
import com.sweetshop.dto.request.RegisterRequest;
import com.sweetshop.dto.response.AuthResponse;
import com.sweetshop.dto.response.UserResponse;
import com.sweetshop.entity.User;
import com.sweetshop.exception.BadCredentialsException;
import com.sweetshop.exception.DuplicateResourceException;
import com.sweetshop.repository.UserRepository;
import com.sweetshop.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for authentication operations.
 * Handles user registration and login.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    /**
     * Register a new user.
     * All users register with USER role. Admin accounts are pre-configured in the database.
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User", "email", request.getEmail());
        }

        // All registered users get USER role only
        // Admin accounts must be pre-seeded or created directly in database
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(com.sweetshop.enums.UserRole.USER)
                .build();

        User savedUser = userRepository.save(user);

        // Generate token
        String token = jwtTokenProvider.generateToken(savedUser.getEmail());

        return buildAuthResponse(savedUser, token);
    }

    /**
     * Authenticate user and return JWT token.
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(BadCredentialsException::new);

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException();
        }

        String token = jwtTokenProvider.generateToken(user.getEmail());

        return buildAuthResponse(user, token);
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .build();

        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .expiresIn(jwtExpiration / 1000) // Convert to seconds
                .user(userResponse)
                .build();
    }
}
