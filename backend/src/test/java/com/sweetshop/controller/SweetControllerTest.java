package com.sweetshop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sweetshop.dto.request.PurchaseRequest;
import com.sweetshop.dto.request.RestockRequest;
import com.sweetshop.dto.request.SweetRequest;
import com.sweetshop.entity.Sweet;
import com.sweetshop.entity.User;
import com.sweetshop.enums.SweetCategory;
import com.sweetshop.enums.UserRole;
import com.sweetshop.repository.SweetRepository;
import com.sweetshop.repository.UserRepository;
import com.sweetshop.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@DisplayName("SweetController Integration Tests")
class SweetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SweetRepository sweetRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private String adminToken;
    private String userToken;
    private Sweet testSweet;

    @BeforeEach
    void setUp() {
        sweetRepository.deleteAll();
        userRepository.deleteAll();

        // Create admin user
        User admin = User.builder()
                .email("admin@test.com")
                .password(passwordEncoder.encode("Password123"))
                .firstName("Admin")
                .lastName("User")
                .role(UserRole.ADMIN)
                .build();
        userRepository.save(admin);
        adminToken = jwtTokenProvider.generateToken(admin.getEmail());

        // Create regular user
        User user = User.builder()
                .email("user@test.com")
                .password(passwordEncoder.encode("Password123"))
                .firstName("Regular")
                .lastName("User")
                .role(UserRole.USER)
                .build();
        userRepository.save(user);
        userToken = jwtTokenProvider.generateToken(user.getEmail());

        // Create test sweet
        testSweet = Sweet.builder()
                .name("Test Kaju Katli")
                .category(SweetCategory.BARFI)
                .price(BigDecimal.valueOf(650.00))
                .quantity(100)
                .description("Test description")
                .imageUrl("/test/image.jpg")
                .build();
        testSweet = sweetRepository.save(testSweet);
    }

    @Nested
    @DisplayName("Public Endpoint Tests")
    class PublicEndpointTests {

        @Test
        @DisplayName("GET /sweets - Should return sweets without authentication")
        void getSweets_WithoutAuth_Returns200() throws Exception {
            mockMvc.perform(get("/sweets"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content").isArray())
                    .andExpect(jsonPath("$.content[0].name").value("Test Kaju Katli"));
        }

        @Test
        @DisplayName("GET /sweets/{id} - Should return sweet by ID without authentication")
        void getSweetById_WithoutAuth_Returns200() throws Exception {
            mockMvc.perform(get("/sweets/{id}", testSweet.getId()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.name").value("Test Kaju Katli"))
                    .andExpect(jsonPath("$.category").value("BARFI"));
        }

        @Test
        @DisplayName("GET /sweets/search - Should search sweets without authentication")
        void searchSweets_WithoutAuth_Returns200() throws Exception {
            mockMvc.perform(get("/sweets/search")
                            .param("name", "Kaju"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content").isArray());
        }

        @Test
        @DisplayName("GET /sweets/{id} - Should return 404 for non-existent sweet")
        void getSweetById_WithInvalidId_Returns404() throws Exception {
            mockMvc.perform(get("/sweets/{id}", UUID.randomUUID()))
                    .andExpect(status().isNotFound());
        }
    }

    @Nested
    @DisplayName("Admin Endpoint Tests - No Auth")
    class AdminEndpointsNoAuthTests {

        @Test
        @DisplayName("POST /sweets - Should return 401 or 403 without authentication")
        void createSweet_WithoutAuth_ReturnsUnauthorizedOrForbidden() throws Exception {
            SweetRequest request = createSweetRequest();

            mockMvc.perform(post("/sweets")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().is4xxClientError()); // Either 401 or 403
        }

        @Test
        @DisplayName("PUT /sweets/{id} - Should return 401 or 403 without authentication")
        void updateSweet_WithoutAuth_ReturnsUnauthorizedOrForbidden() throws Exception {
            SweetRequest request = createSweetRequest();

            mockMvc.perform(put("/sweets/{id}", testSweet.getId())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().is4xxClientError());
        }

        @Test
        @DisplayName("DELETE /sweets/{id} - Should return 401 or 403 without authentication")
        void deleteSweet_WithoutAuth_ReturnsUnauthorizedOrForbidden() throws Exception {
            mockMvc.perform(delete("/sweets/{id}", testSweet.getId()))
                    .andExpect(status().is4xxClientError());
        }

        @Test
        @DisplayName("POST /sweets/{id}/restock - Should return 401 or 403 without authentication")
        void restockSweet_WithoutAuth_ReturnsUnauthorizedOrForbidden() throws Exception {
            RestockRequest request = RestockRequest.builder().quantity(50).build();

            mockMvc.perform(post("/sweets/{id}/restock", testSweet.getId())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().is4xxClientError());
        }
    }

    @Nested
    @DisplayName("Admin Endpoint Tests - User Role (Should be Forbidden)")
    class AdminEndpointsUserRoleTests {

        @Test
        @DisplayName("POST /sweets - Should return 403 for regular user")
        void createSweet_AsUser_Returns403() throws Exception {
            SweetRequest request = createSweetRequest();

            mockMvc.perform(post("/sweets")
                            .header("Authorization", "Bearer " + userToken)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("PUT /sweets/{id} - Should return 403 for regular user")
        void updateSweet_AsUser_Returns403() throws Exception {
            SweetRequest request = createSweetRequest();

            mockMvc.perform(put("/sweets/{id}", testSweet.getId())
                            .header("Authorization", "Bearer " + userToken)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("DELETE /sweets/{id} - Should return 403 for regular user")
        void deleteSweet_AsUser_Returns403() throws Exception {
            mockMvc.perform(delete("/sweets/{id}", testSweet.getId())
                            .header("Authorization", "Bearer " + userToken))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("POST /sweets/{id}/restock - Should return 403 for regular user")
        void restockSweet_AsUser_Returns403() throws Exception {
            RestockRequest request = RestockRequest.builder().quantity(50).build();

            mockMvc.perform(post("/sweets/{id}/restock", testSweet.getId())
                            .header("Authorization", "Bearer " + userToken)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isForbidden());
        }
    }

    @Nested
    @DisplayName("Admin Endpoint Tests - Admin Role (Should Succeed)")
    class AdminEndpointsAdminRoleTests {

        @Test
        @DisplayName("POST /sweets - Should create sweet as admin")
        void createSweet_AsAdmin_Returns201() throws Exception {
            SweetRequest request = SweetRequest.builder()
                    .name("New Sweet")
                    .category(SweetCategory.LADOO)
                    .price(BigDecimal.valueOf(400))
                    .quantity(50)
                    .description("New sweet description")
                    .build();

            mockMvc.perform(post("/sweets")
                            .header("Authorization", "Bearer " + adminToken)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.name").value("New Sweet"))
                    .andExpect(jsonPath("$.category").value("LADOO"))
                    .andExpect(jsonPath("$.id").isNotEmpty());
        }

        @Test
        @DisplayName("PUT /sweets/{id} - Should update sweet as admin")
        void updateSweet_AsAdmin_Returns200() throws Exception {
            SweetRequest request = SweetRequest.builder()
                    .name("Updated Sweet Name")
                    .category(SweetCategory.BARFI)
                    .price(BigDecimal.valueOf(700))
                    .quantity(200)
                    .description("Updated description")
                    .build();

            mockMvc.perform(put("/sweets/{id}", testSweet.getId())
                            .header("Authorization", "Bearer " + adminToken)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.name").value("Updated Sweet Name"))
                    .andExpect(jsonPath("$.quantity").value(200));
        }

        @Test
        @DisplayName("DELETE /sweets/{id} - Should delete sweet as admin")
        void deleteSweet_AsAdmin_Returns204() throws Exception {
            mockMvc.perform(delete("/sweets/{id}", testSweet.getId())
                            .header("Authorization", "Bearer " + adminToken))
                    .andExpect(status().isNoContent());

            // Verify deletion
            mockMvc.perform(get("/sweets/{id}", testSweet.getId()))
                    .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("POST /sweets/{id}/restock - Should restock sweet as admin")
        void restockSweet_AsAdmin_Returns200() throws Exception {
            RestockRequest request = RestockRequest.builder().quantity(50).build();

            mockMvc.perform(post("/sweets/{id}/restock", testSweet.getId())
                            .header("Authorization", "Bearer " + adminToken)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.quantity").value(150)); // 100 + 50
        }
    }

    @Nested
    @DisplayName("Purchase Endpoint Tests")
    class PurchaseEndpointTests {

        @Test
        @DisplayName("POST /sweets/{id}/purchase - Should return 401 or 403 without authentication")
        void purchaseSweet_WithoutAuth_ReturnsUnauthorizedOrForbidden() throws Exception {
            PurchaseRequest request = PurchaseRequest.builder().quantity(5).build();

            mockMvc.perform(post("/sweets/{id}/purchase", testSweet.getId())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().is4xxClientError());
        }

        @Test
        @DisplayName("POST /sweets/{id}/purchase - Should allow purchase as regular user")
        void purchaseSweet_AsUser_Returns200() throws Exception {
            PurchaseRequest request = PurchaseRequest.builder().quantity(5).build();

            mockMvc.perform(post("/sweets/{id}/purchase", testSweet.getId())
                            .header("Authorization", "Bearer " + userToken)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.quantity").value(5))
                    .andExpect(jsonPath("$.sweetName").value("Test Kaju Katli"));
        }

        @Test
        @DisplayName("POST /sweets/{id}/purchase - Should allow purchase as admin")
        void purchaseSweet_AsAdmin_Returns200() throws Exception {
            PurchaseRequest request = PurchaseRequest.builder().quantity(5).build();

            mockMvc.perform(post("/sweets/{id}/purchase", testSweet.getId())
                            .header("Authorization", "Bearer " + adminToken)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.quantity").value(5));
        }

        @Test
        @DisplayName("POST /sweets/{id}/purchase - Should return 400 for insufficient stock")
        void purchaseSweet_WithInsufficientStock_Returns400() throws Exception {
            PurchaseRequest request = PurchaseRequest.builder().quantity(500).build();

            mockMvc.perform(post("/sweets/{id}/purchase", testSweet.getId())
                            .header("Authorization", "Bearer " + userToken)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value(containsString("Insufficient")));
        }
    }

    @Nested
    @DisplayName("Validation Tests")
    class ValidationTests {

        @Test
        @DisplayName("POST /sweets - Should return 400 for missing required fields")
        void createSweet_WithInvalidData_Returns400() throws Exception {
            SweetRequest request = SweetRequest.builder()
                    .name("") // Empty name
                    .build();

            mockMvc.perform(post("/sweets")
                            .header("Authorization", "Bearer " + adminToken)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.validationErrors").exists());
        }

        @Test
        @DisplayName("POST /sweets - Should return 400 for invalid price")
        void createSweet_WithInvalidPrice_Returns400() throws Exception {
            SweetRequest request = SweetRequest.builder()
                    .name("Test Sweet")
                    .category(SweetCategory.BARFI)
                    .price(BigDecimal.valueOf(-10))
                    .quantity(50)
                    .build();

            mockMvc.perform(post("/sweets")
                            .header("Authorization", "Bearer " + adminToken)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("POST /sweets/{id}/purchase - Should return 400 for zero quantity")
        void purchaseSweet_WithZeroQuantity_Returns400() throws Exception {
            PurchaseRequest request = PurchaseRequest.builder().quantity(0).build();

            mockMvc.perform(post("/sweets/{id}/purchase", testSweet.getId())
                            .header("Authorization", "Bearer " + userToken)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());
        }
    }

    private SweetRequest createSweetRequest() {
        return SweetRequest.builder()
                .name("Test Sweet")
                .category(SweetCategory.BARFI)
                .price(BigDecimal.valueOf(500))
                .quantity(100)
                .description("Test description")
                .build();
    }
}
