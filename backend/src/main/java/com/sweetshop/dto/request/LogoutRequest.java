package com.sweetshop.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for logout.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogoutRequest {

    private String refreshToken;
}
