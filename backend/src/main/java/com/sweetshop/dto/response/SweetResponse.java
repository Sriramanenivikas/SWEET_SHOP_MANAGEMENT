package com.sweetshop.dto.response;

import com.sweetshop.enums.SweetCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Response DTO for sweet information.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SweetResponse {

    private UUID id;
    private String name;
    private SweetCategory category;
    private BigDecimal price;
    private Integer quantity;
    private String description;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
