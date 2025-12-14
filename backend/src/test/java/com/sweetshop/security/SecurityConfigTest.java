package com.sweetshop.security;

import com.sweetshop.entity.User;
import com.sweetshop.enums.UserRole;
import com.sweetshop.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@DisplayName("Security Configuration Tests")
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private String adminToken;
    private String userToken;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        // Create admin user
        User admin = User.builder()
                .email("admin@security-test.com")
                .password(passwordEncoder.encode("Password123"))
                .firstName("Admin")
                .lastName("User")
                .role(UserRole.ADMIN)
                .build();
        userRepository.save(admin);
        adminToken = jwtTokenProvider.generateToken(admin.getEmail());

        // Create regular user
        User user = User.builder()
                .email("user@security-test.com")
                .password(passwordEncoder.encode("Password123"))
                .firstName("Regular")
                .lastName("User")
                .role(UserRole.USER)
                .build();
        userRepository.save(user);
        userToken = jwtTokenProvider.generateToken(user.getEmail());
    }

    @Nested
    @DisplayName("Public Endpoint Access Tests")
    class PublicEndpointTests {

        @Test
        @DisplayName("Auth endpoints should be accessible without authentication")
        void authEndpoints_ArePublic() throws Exception {
            mockMvc.perform(post("/auth/login")
                            .contentType("application/json")
                            .content("{\"email\":\"test@test.com\",\"password\":\"test\"}"))
                    .andExpect(status().isUnauthorized()); // 401 because credentials are wrong, not 403
        }

        @Test
        @DisplayName("GET /sweets should be accessible without authentication")
        void getSweets_IsPublic() throws Exception {
            mockMvc.perform(get("/sweets"))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("GET /sweets/search should be accessible without authentication")
        void searchSweets_IsPublic() throws Exception {
            mockMvc.perform(get("/sweets/search"))
                    .andExpect(status().isOk());
        }
    }

    @Nested
    @DisplayName("Protected Endpoint Access Tests")
    class ProtectedEndpointTests {

        @Test
        @DisplayName("POST /sweets should require authentication")
        void createSweet_RequiresAuth() throws Exception {
            mockMvc.perform(post("/sweets")
                            .contentType("application/json")
                            .content("{}"))
                    .andExpect(status().is4xxClientError()); // 401 or 403
        }

        @Test
        @DisplayName("PUT /sweets/{id} should require authentication")
        void updateSweet_RequiresAuth() throws Exception {
            mockMvc.perform(put("/sweets/{id}", java.util.UUID.randomUUID())
                            .contentType("application/json")
                            .content("{}"))
                    .andExpect(status().is4xxClientError());
        }

        @Test
        @DisplayName("DELETE /sweets/{id} should require authentication")
        void deleteSweet_RequiresAuth() throws Exception {
            mockMvc.perform(delete("/sweets/{id}", java.util.UUID.randomUUID()))
                    .andExpect(status().is4xxClientError());
        }

        @Test
        @DisplayName("POST /sweets/{id}/purchase should require authentication")
        void purchaseSweet_RequiresAuth() throws Exception {
            mockMvc.perform(post("/sweets/{id}/purchase", java.util.UUID.randomUUID())
                            .contentType("application/json")
                            .content("{\"quantity\":1}"))
                    .andExpect(status().is4xxClientError());
        }
    }

    @Nested
    @DisplayName("Admin Role Enforcement Tests")
    class AdminRoleTests {

        @Test
        @DisplayName("Admin endpoints should return 403 for regular user")
        void adminEndpoints_Return403ForUser() throws Exception {
            mockMvc.perform(post("/sweets")
                            .header("Authorization", "Bearer " + userToken)
                            .contentType("application/json")
                            .content("{\"name\":\"test\",\"category\":\"BARFI\",\"price\":100,\"quantity\":10}"))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("Admin endpoints should succeed for admin user")
        void adminEndpoints_SucceedForAdmin() throws Exception {
            // This will fail validation but not authorization
            mockMvc.perform(post("/sweets")
                            .header("Authorization", "Bearer " + adminToken)
                            .contentType("application/json")
                            .content("{\"name\":\"Test Sweet\",\"category\":\"BARFI\",\"price\":100,\"quantity\":10}"))
                    .andExpect(status().isCreated());
        }
    }

    @Nested
    @DisplayName("CORS Configuration Tests")
    class CorsTests {

        @Test
        @DisplayName("OPTIONS requests should be allowed")
        void optionsRequests_AreAllowed() throws Exception {
            mockMvc.perform(options("/sweets")
                            .header("Origin", "http://localhost:3000")
                            .header("Access-Control-Request-Method", "GET"))
                    .andExpect(status().isOk());
        }
    }

    @Nested
    @DisplayName("JWT Token Validation Tests")
    class JwtValidationTests {

        @Test
        @DisplayName("Should reject requests with invalid token")
        void invalidToken_ReturnsClientError() throws Exception {
            mockMvc.perform(post("/sweets")
                            .header("Authorization", "Bearer invalid-token")
                            .contentType("application/json")
                            .content("{}"))
                    .andExpect(status().is4xxClientError()); // 401 or 403
        }

        @Test
        @DisplayName("Should reject requests with malformed Authorization header")
        void malformedAuthHeader_ReturnsClientError() throws Exception {
            mockMvc.perform(post("/sweets")
                            .header("Authorization", "NotBearer token")
                            .contentType("application/json")
                            .content("{}"))
                    .andExpect(status().is4xxClientError());
        }
    }
}
