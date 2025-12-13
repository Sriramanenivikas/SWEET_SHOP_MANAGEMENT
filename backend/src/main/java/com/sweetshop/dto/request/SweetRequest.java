package com.sweetshop.dto.request;

import com.sweetshop.enums.SweetCategory;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Request DTO for creating or updating a sweet.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SweetRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Category is required")
    private SweetCategory category;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    private String description;

    private String imageUrl;
}
