package com.sweetshop.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("JwtTokenProvider Unit Tests")
class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;

    private static final String TEST_SECRET = "testSecretKeyForJWTTokenGenerationThatIsAtLeast256BitsLongForTestingPurposes2024";
    private static final long TEST_EXPIRATION = 3600000L; // 1 hour

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtSecret", TEST_SECRET);
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtExpiration", TEST_EXPIRATION);
    }

    @Nested
    @DisplayName("Token Generation Tests")
    class TokenGenerationTests {

        @Test
        @DisplayName("Should generate valid JWT token")
        void generateToken_ReturnsValidJwt() {
            String token = jwtTokenProvider.generateToken("test@example.com");

            assertThat(token).isNotNull();
            assertThat(token).isNotEmpty();
            assertThat(token.split("\\.")).hasSize(3); // JWT has 3 parts
        }

        @Test
        @DisplayName("Should include email as subject")
        void generateToken_IncludesEmail() {
            String email = "user@example.com";
            String token = jwtTokenProvider.generateToken(email);

            String extractedEmail = jwtTokenProvider.getEmailFromToken(token);

            assertThat(extractedEmail).isEqualTo(email);
        }

        @Test
        @DisplayName("Should set expiration time")
        void generateToken_SetsExpiration() {
            String token = jwtTokenProvider.generateToken("test@example.com");

            // Token should be valid immediately after generation
            assertThat(jwtTokenProvider.validateToken(token)).isTrue();
        }
    }

    @Nested
    @DisplayName("Token Extraction Tests")
    class TokenExtractionTests {

        @Test
        @DisplayName("Should extract correct email from token")
        void getEmailFromToken_ReturnsCorrectEmail() {
            String email = "admin@sweetshop.com";
            String token = jwtTokenProvider.generateToken(email);

            String extractedEmail = jwtTokenProvider.getEmailFromToken(token);

            assertThat(extractedEmail).isEqualTo(email);
        }
    }

    @Nested
    @DisplayName("Token Validation Tests")
    class TokenValidationTests {

        @Test
        @DisplayName("Should return true for valid token")
        void validateToken_WithValidToken_ReturnsTrue() {
            String token = jwtTokenProvider.generateToken("test@example.com");

            boolean isValid = jwtTokenProvider.validateToken(token);

            assertThat(isValid).isTrue();
        }

        @Test
        @DisplayName("Should return false for expired token")
        void validateToken_WithExpiredToken_ReturnsFalse() {
            // Create a token provider with very short expiration
            JwtTokenProvider shortLivedProvider = new JwtTokenProvider();
            ReflectionTestUtils.setField(shortLivedProvider, "jwtSecret", TEST_SECRET);
            ReflectionTestUtils.setField(shortLivedProvider, "jwtExpiration", 1L); // 1ms expiration

            String token = shortLivedProvider.generateToken("test@example.com");

            // Wait for token to expire
            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }

            boolean isValid = shortLivedProvider.validateToken(token);

            assertThat(isValid).isFalse();
        }

        @Test
        @DisplayName("Should return false for tampered token")
        void validateToken_WithTamperedToken_ReturnsFalse() {
            String token = jwtTokenProvider.generateToken("test@example.com");
            String tamperedToken = token.substring(0, token.length() - 5) + "xxxxx";

            boolean isValid = jwtTokenProvider.validateToken(tamperedToken);

            assertThat(isValid).isFalse();
        }

        @Test
        @DisplayName("Should return false for null token")
        void validateToken_WithNullToken_ReturnsFalse() {
            boolean isValid = jwtTokenProvider.validateToken(null);

            assertThat(isValid).isFalse();
        }

        @Test
        @DisplayName("Should return false for empty token")
        void validateToken_WithEmptyToken_ReturnsFalse() {
            boolean isValid = jwtTokenProvider.validateToken("");

            assertThat(isValid).isFalse();
        }

        @Test
        @DisplayName("Should return false for malformed token")
        void validateToken_WithMalformedToken_ReturnsFalse() {
            boolean isValid = jwtTokenProvider.validateToken("not.a.valid.jwt.token");

            assertThat(isValid).isFalse();
        }
    }
}
