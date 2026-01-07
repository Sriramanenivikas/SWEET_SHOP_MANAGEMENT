package com.sweetshop.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

/**
 * Entity for storing blacklisted/revoked JWT tokens.
 * Tokens are added here on logout or security events.
 */
@Entity
@Table(name = "token_blacklist", indexes = {
    @Index(name = "idx_token_blacklist_jti", columnList = "jti"),
    @Index(name = "idx_token_blacklist_expiry", columnList = "expiry_date")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenBlacklist {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String jti;

    @Column(name = "expiry_date", nullable = false)
    private Instant expiryDate;

    @Column(name = "blacklisted_at", nullable = false)
    private Instant blacklistedAt;

    @Column
    private String reason;

    @PrePersist
    protected void onCreate() {
        blacklistedAt = Instant.now();
    }
}
