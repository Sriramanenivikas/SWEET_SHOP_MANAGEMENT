package com.sweetshop.service;

import com.sweetshop.dto.request.PurchaseRequest;
import com.sweetshop.dto.request.RestockRequest;
import com.sweetshop.dto.request.SweetRequest;
import com.sweetshop.dto.response.PurchaseResponse;
import com.sweetshop.dto.response.SweetResponse;
import com.sweetshop.entity.PurchaseHistory;
import com.sweetshop.entity.Sweet;
import com.sweetshop.entity.User;
import com.sweetshop.enums.SweetCategory;
import com.sweetshop.exception.InsufficientStockException;
import com.sweetshop.exception.ResourceNotFoundException;
import com.sweetshop.repository.PurchaseHistoryRepository;
import com.sweetshop.repository.SweetRepository;
import com.sweetshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Service for sweet operations including CRUD, search, and inventory management.
 * Handles business logic for sweet products with proper transaction management.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SweetService {

    private final SweetRepository sweetRepository;
    private final UserRepository userRepository;
    private final PurchaseHistoryRepository purchaseHistoryRepository;

    /**
     * Get all sweets with pagination.
     */
    @Transactional(readOnly = true)
    public Page<SweetResponse> getAllSweets(Pageable pageable) {
        log.debug("Fetching all sweets - page: {}, size: {}", pageable.getPageNumber(), pageable.getPageSize());
        return sweetRepository.findAll(pageable).map(this::mapToResponse);
    }

    /**
     * Get a sweet by ID.
     */
    @Transactional(readOnly = true)
    public SweetResponse getSweetById(UUID id) {
        log.debug("Fetching sweet by ID: {}", id);
        Sweet sweet = findSweetById(id);
        return mapToResponse(sweet);
    }

    /**
     * Search sweets by name, category, and price range.
     */
    @Transactional(readOnly = true)
    public Page<SweetResponse> searchSweets(String name, SweetCategory category,
                                            BigDecimal minPrice, BigDecimal maxPrice,
                                            Pageable pageable) {
        return sweetRepository.searchSweets(name, category, minPrice, maxPrice, pageable)
                .map(this::mapToResponse);
    }

    /**
     * Create a new sweet (Admin only).
     */
    @Transactional
    public SweetResponse createSweet(SweetRequest request) {
        Sweet sweet = Sweet.builder()
                .name(request.getName())
                .category(request.getCategory())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .build();

        Sweet savedSweet = sweetRepository.save(sweet);
        return mapToResponse(savedSweet);
    }

    /**
     * Update an existing sweet (Admin only).
     */
    @Transactional
    public SweetResponse updateSweet(UUID id, SweetRequest request) {
        Sweet sweet = findSweetById(id);

        sweet.setName(request.getName());
        sweet.setCategory(request.getCategory());
        sweet.setPrice(request.getPrice());
        sweet.setQuantity(request.getQuantity());
        sweet.setDescription(request.getDescription());
        sweet.setImageUrl(request.getImageUrl());

        Sweet updatedSweet = sweetRepository.save(sweet);
        return mapToResponse(updatedSweet);
    }

    /**
     * Delete a sweet (Admin only).
     */
    @Transactional
    public void deleteSweet(UUID id) {
        Sweet sweet = findSweetById(id);
        sweetRepository.delete(sweet);
    }

    /**
     * Purchase a sweet - decreases quantity.
     */
    @Transactional
    public PurchaseResponse purchaseSweet(UUID id, PurchaseRequest request) {
        Sweet sweet = findSweetById(id);

        if (sweet.getQuantity() < request.getQuantity()) {
            throw new InsufficientStockException(sweet.getQuantity(), request.getQuantity());
        }

        // Decrease quantity
        sweet.setQuantity(sweet.getQuantity() - request.getQuantity());
        sweetRepository.save(sweet);

        // Get current user
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        // Record purchase history
        BigDecimal totalPrice = sweet.getPrice().multiply(BigDecimal.valueOf(request.getQuantity()));
        
        PurchaseHistory purchase = PurchaseHistory.builder()
                .user(user)
                .sweet(sweet)
                .quantity(request.getQuantity())
                .unitPrice(sweet.getPrice())
                .totalPrice(totalPrice)
                .build();

        PurchaseHistory savedPurchase = purchaseHistoryRepository.save(purchase);

        return PurchaseResponse.builder()
                .id(savedPurchase.getId())
                .sweetId(sweet.getId())
                .sweetName(sweet.getName())
                .quantity(savedPurchase.getQuantity())
                .unitPrice(savedPurchase.getUnitPrice())
                .totalPrice(savedPurchase.getTotalPrice())
                .purchasedAt(savedPurchase.getPurchasedAt())
                .build();
    }

    /**
     * Restock a sweet - increases quantity (Admin only).
     */
    @Transactional
    public SweetResponse restockSweet(UUID id, RestockRequest request) {
        Sweet sweet = findSweetById(id);

        sweet.setQuantity(sweet.getQuantity() + request.getQuantity());
        Sweet updatedSweet = sweetRepository.save(sweet);

        return mapToResponse(updatedSweet);
    }

    private Sweet findSweetById(UUID id) {
        return sweetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sweet", "id", id));
    }

    private SweetResponse mapToResponse(Sweet sweet) {
        return SweetResponse.builder()
                .id(sweet.getId())
                .name(sweet.getName())
                .category(sweet.getCategory())
                .price(sweet.getPrice())
                .quantity(sweet.getQuantity())
                .description(sweet.getDescription())
                .imageUrl(sweet.getImageUrl())
                .createdAt(sweet.getCreatedAt())
                .updatedAt(sweet.getUpdatedAt())
                .build();
    }
}
