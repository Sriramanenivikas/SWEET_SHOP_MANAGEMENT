package com.sweetshop.repository;

import com.sweetshop.entity.TokenBlacklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.UUID;

@Repository
public interface TokenBlacklistRepository extends JpaRepository<TokenBlacklist, UUID> {

    boolean existsByJti(String jti);

    @Modifying
    @Query("DELETE FROM TokenBlacklist tb WHERE tb.expiryDate < :now")
    void deleteExpiredTokens(@Param("now") Instant now);
}
