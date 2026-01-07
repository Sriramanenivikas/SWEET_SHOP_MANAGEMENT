package com.sweetshop.controller;

import com.sweetshop.dto.request.LoginRequest;
import com.sweetshop.dto.request.LogoutRequest;
import com.sweetshop.dto.request.RefreshTokenRequest;
import com.sweetshop.dto.request.RegisterRequest;
import com.sweetshop.dto.response.AuthResponse;
import com.sweetshop.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Arrays;
import java.util.Map;

/**
 * REST controller for authentication endpoints.
 * Handles user registration, login, logout, and token refresh.
 * Uses HttpOnly cookies for secure token storage.
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Value("${jwt.expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-expiration:604800000}")
    private long refreshTokenExpiration;

    @Value("${app.cookie.secure:true}")
    private boolean secureCookie;

    @Value("${app.cookie.same-site:Strict}")
    private String sameSite;

    private static final String ACCESS_TOKEN_COOKIE = "access_token";
    private static final String REFRESH_TOKEN_COOKIE = "refresh_token";

    /**
     * Register a new user.
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {
        
        String userAgent = httpRequest.getHeader("User-Agent");
        String ipAddress = getClientIp(httpRequest);
        
        AuthResponse response = authService.register(request, userAgent, ipAddress);
        setTokenCookies(httpResponse, response.getAccessToken(), response.getRefreshToken());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Authenticate user and return JWT tokens.
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {
        
        String userAgent = httpRequest.getHeader("User-Agent");
        String ipAddress = getClientIp(httpRequest);
        
        AuthResponse response = authService.login(request, userAgent, ipAddress);
        setTokenCookies(httpResponse, response.getAccessToken(), response.getRefreshToken());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Refresh access token using refresh token.
     * POST /api/auth/refresh
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(
            @RequestBody(required = false) RefreshTokenRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {
        
        String refreshToken = extractRefreshToken(httpRequest, request);
        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
        
        String userAgent = httpRequest.getHeader("User-Agent");
        String ipAddress = getClientIp(httpRequest);
        
        AuthResponse response = authService.refreshToken(refreshToken, userAgent, ipAddress);
        setTokenCookies(httpResponse, response.getAccessToken(), response.getRefreshToken());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Logout user - invalidate tokens.
     * POST /api/auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            @RequestBody(required = false) LogoutRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {
        
        String accessToken = extractAccessToken(httpRequest);
        String refreshToken = extractRefreshToken(httpRequest, 
                request != null ? new RefreshTokenRequest(request.getRefreshToken()) : null);
        
        authService.logout(accessToken, refreshToken);
        clearTokenCookies(httpResponse);
        
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    /**
     * Logout from all devices.
     * POST /api/auth/logout-all
     */
    @PostMapping("/logout-all")
    public ResponseEntity<Map<String, String>> logoutAll(
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not authenticated"));
        }
        
        String accessToken = extractAccessToken(httpRequest);
        authService.logoutAll(auth.getName(), accessToken);
        clearTokenCookies(httpResponse);
        
        return ResponseEntity.ok(Map.of("message", "Logged out from all devices"));
    }

    private void setTokenCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        ResponseCookie accessCookie = ResponseCookie.from(ACCESS_TOKEN_COOKIE, accessToken)
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite(sameSite)
                .path("/")
                .maxAge(Duration.ofMillis(accessTokenExpiration))
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE, refreshToken)
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite(sameSite)
                .path("/api/auth")
                .maxAge(Duration.ofMillis(refreshTokenExpiration))
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
    }

    private void clearTokenCookies(HttpServletResponse response) {
        ResponseCookie accessCookie = ResponseCookie.from(ACCESS_TOKEN_COOKIE, "")
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite(sameSite)
                .path("/")
                .maxAge(0)
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE, "")
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite(sameSite)
                .path("/api/auth")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
    }

    private String extractAccessToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            return Arrays.stream(cookies)
                    .filter(c -> ACCESS_TOKEN_COOKIE.equals(c.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(extractFromHeader(request));
        }
        return extractFromHeader(request);
    }

    private String extractFromHeader(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private String extractRefreshToken(HttpServletRequest request, RefreshTokenRequest bodyRequest) {
        if (bodyRequest != null && bodyRequest.getRefreshToken() != null) {
            return bodyRequest.getRefreshToken();
        }
        
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            return Arrays.stream(cookies)
                    .filter(c -> REFRESH_TOKEN_COOKIE.equals(c.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);
        }
        return null;
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
