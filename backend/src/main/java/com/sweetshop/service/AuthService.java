package com.sweetshop.service;

import com.sweetshop.dto.request.LoginRequest;
import com.sweetshop.dto.request.RegisterRequest;
import com.sweetshop.dto.response.AuthResponse;
import com.sweetshop.dto.response.UserResponse;
import com.sweetshop.entity.RefreshToken;
import com.sweetshop.entity.User;
import com.sweetshop.exception.BadCredentialsException;
import com.sweetshop.exception.DuplicateResourceException;
import com.sweetshop.exception.InvalidTokenException;
import com.sweetshop.repository.UserRepository;
import com.sweetshop.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

/**
 * Service for authentication operations.
 * Handles user registration, login, logout, and token refresh.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final TokenBlacklistService tokenBlacklistService;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    /**
     * Register a new user.
     * All users register with USER role. Admin accounts are pre-configured in the database.
     */
    @Transactional
    public AuthResponse register(RegisterRequest request, String userAgent, String ipAddress) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User", "email", request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(com.sweetshop.enums.UserRole.USER)
                .build();

        User savedUser = userRepository.save(user);
        log.info("New user registered: {}", savedUser.getEmail());

        String accessToken = jwtTokenProvider.generateToken(savedUser.getEmail());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(
                savedUser.getEmail(), userAgent, ipAddress);

        return buildAuthResponse(savedUser, accessToken, refreshToken.getToken());
    }

    /**
     * Authenticate user and return JWT tokens.
     */
    @Transactional
    public AuthResponse login(LoginRequest request, String userAgent, String ipAddress) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(BadCredentialsException::new);

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException();
        }

        String accessToken = jwtTokenProvider.generateToken(user.getEmail());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(
                user.getEmail(), userAgent, ipAddress);

        log.info("User logged in: {}", user.getEmail());
        return buildAuthResponse(user, accessToken, refreshToken.getToken());
    }

    /**
     * Refresh access token using refresh token.
     */
    @Transactional
    public AuthResponse refreshToken(String refreshTokenStr, String userAgent, String ipAddress) {
        RefreshToken refreshToken = refreshTokenService.validateRefreshToken(refreshTokenStr);
        User user = refreshToken.getUser();

        RefreshToken newRefreshToken = refreshTokenService.rotateRefreshToken(
                refreshTokenStr, userAgent, ipAddress);
        String newAccessToken = jwtTokenProvider.generateToken(user.getEmail());

        log.info("Token refreshed for user: {}", user.getEmail());
        return buildAuthResponse(user, newAccessToken, newRefreshToken.getToken());
    }

    /**
     * Logout user - blacklist access token and revoke refresh token.
     */
    @Transactional
    public void logout(String accessToken, String refreshToken) {
        if (accessToken != null && jwtTokenProvider.validateToken(accessToken)) {
            String jti = jwtTokenProvider.getJtiFromToken(accessToken);
            Instant expiry = jwtTokenProvider.getExpirationFromToken(accessToken);
            tokenBlacklistService.blacklistToken(jti, expiry, "logout");
        }

        if (refreshToken != null) {
            refreshTokenService.revokeToken(refreshToken);
        }

        log.info("User logged out successfully");
    }

    /**
     * Logout from all devices - revoke all refresh tokens.
     */
    @Transactional
    public void logoutAll(String email, String currentAccessToken) {
        if (currentAccessToken != null && jwtTokenProvider.validateToken(currentAccessToken)) {
            String jti = jwtTokenProvider.getJtiFromToken(currentAccessToken);
            Instant expiry = jwtTokenProvider.getExpirationFromToken(currentAccessToken);
            tokenBlacklistService.blacklistToken(jti, expiry, "logout_all");
        }

        refreshTokenService.revokeAllUserTokens(email);
        log.info("User logged out from all devices: {}", email);
    }

    private AuthResponse buildAuthResponse(User user, String accessToken, String refreshToken) {
        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .build();

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtExpiration / 1000)
                .user(userResponse)
                .build();
    }
}
