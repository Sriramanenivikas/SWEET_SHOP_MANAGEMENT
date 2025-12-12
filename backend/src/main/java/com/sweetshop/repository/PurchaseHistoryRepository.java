package com.sweetshop.repository;

import com.sweetshop.entity.PurchaseHistory;
import com.sweetshop.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * Repository for PurchaseHistory entity operations.
 */
@Repository
public interface PurchaseHistoryRepository extends JpaRepository<PurchaseHistory, UUID> {
    
    Page<PurchaseHistory> findByUserOrderByPurchasedAtDesc(User user, Pageable pageable);
}
