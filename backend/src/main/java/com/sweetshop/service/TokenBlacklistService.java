package com.sweetshop.service;

import com.sweetshop.entity.TokenBlacklist;
import com.sweetshop.repository.TokenBlacklistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

/**
 * Service for managing token blacklist.
 * Handles token revocation for logout and security events.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TokenBlacklistService {

    private final TokenBlacklistRepository tokenBlacklistRepository;

    /**
     * Add a token to the blacklist.
     */
    @Transactional
    public void blacklistToken(String jti, Instant expiryDate, String reason) {
        if (tokenBlacklistRepository.existsByJti(jti)) {
            return;
        }

        TokenBlacklist blacklistedToken = TokenBlacklist.builder()
                .jti(jti)
                .expiryDate(expiryDate)
                .reason(reason)
                .build();

        tokenBlacklistRepository.save(blacklistedToken);
        log.info("Token blacklisted: jti={}, reason={}", jti, reason);
    }

    /**
     * Check if a token is blacklisted.
     */
    public boolean isBlacklisted(String jti) {
        return tokenBlacklistRepository.existsByJti(jti);
    }

    /**
     * Clean up expired blacklisted tokens (runs every hour).
     */
    @Scheduled(fixedRate = 3600000)
    @Transactional
    public void cleanupExpiredTokens() {
        tokenBlacklistRepository.deleteExpiredTokens(Instant.now());
        log.debug("Cleaned up expired blacklisted tokens");
    }
}
