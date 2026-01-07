package com.sweetshop.service;

import com.sweetshop.entity.RefreshToken;
import com.sweetshop.entity.User;
import com.sweetshop.exception.InvalidTokenException;
import com.sweetshop.repository.RefreshTokenRepository;
import com.sweetshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

/**
 * Service for managing refresh tokens.
 * Handles token creation, validation, rotation, and revocation.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    @Value("${jwt.refresh-expiration:604800000}")
    private long refreshTokenExpiration;

    private static final int MAX_ACTIVE_SESSIONS = 5;

    /**
     * Create a new refresh token for a user.
     */
    @Transactional
    public RefreshToken createRefreshToken(String email, String userAgent, String ipAddress) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidTokenException("User not found"));

        long activeTokens = refreshTokenRepository.countActiveTokensByUser(user, Instant.now());
        if (activeTokens >= MAX_ACTIVE_SESSIONS) {
            refreshTokenRepository.revokeAllUserTokens(user);
            log.info("Revoked all tokens for user {} due to max sessions exceeded", email);
        }

        RefreshToken refreshToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiryDate(Instant.now().plusMillis(refreshTokenExpiration))
                .userAgent(userAgent)
                .ipAddress(ipAddress)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    /**
     * Validate and return refresh token.
     */
    @Transactional(readOnly = true)
    public RefreshToken validateRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidTokenException("Refresh token not found"));

        if (!refreshToken.isValid()) {
            throw new InvalidTokenException("Refresh token is expired or revoked");
        }

        return refreshToken;
    }

    /**
     * Rotate refresh token - revoke old one and create new one.
     */
    @Transactional
    public RefreshToken rotateRefreshToken(String oldToken, String userAgent, String ipAddress) {
        RefreshToken oldRefreshToken = validateRefreshToken(oldToken);
        
        oldRefreshToken.setRevoked(true);
        refreshTokenRepository.save(oldRefreshToken);

        return createRefreshToken(
                oldRefreshToken.getUser().getEmail(),
                userAgent,
                ipAddress
        );
    }

    /**
     * Revoke a specific refresh token.
     */
    @Transactional
    public void revokeToken(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
            log.info("Refresh token revoked for user: {}", rt.getUser().getEmail());
        });
    }

    /**
     * Revoke all refresh tokens for a user.
     */
    @Transactional
    public void revokeAllUserTokens(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidTokenException("User not found"));
        refreshTokenRepository.revokeAllUserTokens(user);
        log.info("All refresh tokens revoked for user: {}", email);
    }

    /**
     * Clean up expired refresh tokens (runs every hour).
     */
    @Scheduled(fixedRate = 3600000)
    @Transactional
    public void cleanupExpiredTokens() {
        refreshTokenRepository.deleteExpiredTokens(Instant.now());
        log.debug("Cleaned up expired refresh tokens");
    }
}
