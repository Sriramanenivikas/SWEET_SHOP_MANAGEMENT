package com.sweetshop.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when authentication fails.
 */
@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class BadCredentialsException extends RuntimeException {
    
    public BadCredentialsException(String message) {
        super(message);
    }

    public BadCredentialsException() {
        super("Invalid email or password");
    }
}
