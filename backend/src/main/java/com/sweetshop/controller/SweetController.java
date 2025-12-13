package com.sweetshop.controller;

import com.sweetshop.dto.request.PurchaseRequest;
import com.sweetshop.dto.request.RestockRequest;
import com.sweetshop.dto.request.SweetRequest;
import com.sweetshop.dto.response.PurchaseResponse;
import com.sweetshop.dto.response.SweetResponse;
import com.sweetshop.enums.SweetCategory;
import com.sweetshop.service.SweetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * REST controller for sweet operations.
 * Handles CRUD, search, and inventory endpoints.
 */
@RestController
@RequestMapping("/sweets")
@RequiredArgsConstructor
public class SweetController {

    private final SweetService sweetService;

    /**
     * Get all sweets with pagination.
     * GET /api/sweets
     */
    @GetMapping
    public ResponseEntity<Page<SweetResponse>> getAllSweets(
            @PageableDefault(size = 10, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(sweetService.getAllSweets(pageable));
    }

    /**
     * Get a sweet by ID.
     * GET /api/sweets/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<SweetResponse> getSweetById(@PathVariable UUID id) {
        return ResponseEntity.ok(sweetService.getSweetById(id));
    }

    /**
     * Search sweets by name, category, and price range.
     * GET /api/sweets/search
     */
    @GetMapping("/search")
    public ResponseEntity<Page<SweetResponse>> searchSweets(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) SweetCategory category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @PageableDefault(size = 10, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(sweetService.searchSweets(name, category, minPrice, maxPrice, pageable));
    }

    /**
     * Create a new sweet (Admin only).
     * POST /api/sweets
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SweetResponse> createSweet(@Valid @RequestBody SweetRequest request) {
        SweetResponse response = sweetService.createSweet(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Update an existing sweet (Admin only).
     * PUT /api/sweets/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SweetResponse> updateSweet(
            @PathVariable UUID id,
            @Valid @RequestBody SweetRequest request) {
        return ResponseEntity.ok(sweetService.updateSweet(id, request));
    }

    /**
     * Delete a sweet (Admin only).
     * DELETE /api/sweets/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSweet(@PathVariable UUID id) {
        sweetService.deleteSweet(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Purchase a sweet.
     * POST /api/sweets/{id}/purchase
     */
    @PostMapping("/{id}/purchase")
    public ResponseEntity<PurchaseResponse> purchaseSweet(
            @PathVariable UUID id,
            @Valid @RequestBody PurchaseRequest request) {
        return ResponseEntity.ok(sweetService.purchaseSweet(id, request));
    }

    /**
     * Restock a sweet (Admin only).
     * POST /api/sweets/{id}/restock
     */
    @PostMapping("/{id}/restock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SweetResponse> restockSweet(
            @PathVariable UUID id,
            @Valid @RequestBody RestockRequest request) {
        return ResponseEntity.ok(sweetService.restockSweet(id, request));
    }
}
