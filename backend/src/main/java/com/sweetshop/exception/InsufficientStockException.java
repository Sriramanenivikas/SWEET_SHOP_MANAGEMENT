package com.sweetshop.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when there is insufficient stock for a purchase.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InsufficientStockException extends RuntimeException {
    
    public InsufficientStockException(String message) {
        super(message);
    }

    public InsufficientStockException(int available, int requested) {
        super(String.format("Insufficient stock. Available: %d, Requested: %d", available, requested));
    }
}
