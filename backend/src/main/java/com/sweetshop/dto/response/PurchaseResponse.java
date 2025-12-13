package com.sweetshop.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Response DTO for purchase transaction.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseResponse {

    private UUID id;
    private UUID sweetId;
    private String sweetName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private LocalDateTime purchasedAt;
}
