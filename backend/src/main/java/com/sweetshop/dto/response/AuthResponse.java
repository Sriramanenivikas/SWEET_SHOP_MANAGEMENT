package com.sweetshop.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for authentication containing JWT token.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String accessToken;
    
    @Builder.Default
    private String tokenType = "Bearer";
    
    private long expiresIn;
    
    private UserResponse user;
}
