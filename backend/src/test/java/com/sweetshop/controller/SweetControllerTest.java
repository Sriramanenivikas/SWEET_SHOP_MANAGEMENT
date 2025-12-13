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
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for SweetController.
 * Tests CRUD operations, search, and inventory management.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
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

    private String userToken;
    private String adminToken;
    private Sweet testSweet;

    @BeforeEach
    void setUp() {
        sweetRepository.deleteAll();
        userRepository.deleteAll();

        // Create regular user
        User user = User.builder()
                .email("user@example.com")
                .password(passwordEncoder.encode("password"))
                .firstName("Test")
                .lastName("User")
                .role(UserRole.USER)
                .build();
        userRepository.save(user);
        userToken = jwtTokenProvider.generateToken(user.getEmail());

        // Create admin user
        User admin = User.builder()
                .email("admin@example.com")
                .password(passwordEncoder.encode("password"))
                .firstName("Admin")
                .lastName("User")
                .role(UserRole.ADMIN)
                .build();
        userRepository.save(admin);
        adminToken = jwtTokenProvider.generateToken(admin.getEmail());

        // Create test sweet
        testSweet = Sweet.builder()
                .name("Chocolate Truffle")
                .category(SweetCategory.CHOCOLATE)
                .price(new BigDecimal("12.99"))
                .quantity(100)
                .description("Delicious chocolate truffle")
                .build();
        testSweet = sweetRepository.save(testSweet);
    }

    @Test
    @DisplayName("Should get all sweets")
    void getAllSweets_returnsPageOfSweets() throws Exception {
        mockMvc.perform(get("/sweets")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].name", is("Chocolate Truffle")));
    }

    @Test
    @DisplayName("Should get sweet by ID")
    void getSweetById_existingId_returnsSweet() throws Exception {
        mockMvc.perform(get("/sweets/{id}", testSweet.getId())
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Chocolate Truffle")))
                .andExpect(jsonPath("$.price", is(12.99)));
    }

    @Test
    @DisplayName("Should return 404 for non-existent sweet")
    void getSweetById_nonExistentId_returnsNotFound() throws Exception {
        mockMvc.perform(get("/sweets/{id}", "00000000-0000-0000-0000-000000000000")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should search sweets by name")
    void searchSweets_byName_returnsMatchingSweets() throws Exception {
        mockMvc.perform(get("/sweets/search")
                        .param("name", "chocolate")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)));
    }

    @Test
    @DisplayName("Should create sweet as admin")
    void createSweet_asAdmin_returnsCreated() throws Exception {
        SweetRequest request = SweetRequest.builder()
                .name("New Candy")
                .category(SweetCategory.CANDY)
                .price(new BigDecimal("5.99"))
                .quantity(50)
                .build();

        mockMvc.perform(post("/sweets")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is("New Candy")));
    }

    @Test
    @DisplayName("Should reject create sweet as regular user")
    void createSweet_asUser_returnsForbidden() throws Exception {
        SweetRequest request = SweetRequest.builder()
                .name("New Candy")
                .category(SweetCategory.CANDY)
                .price(new BigDecimal("5.99"))
                .quantity(50)
                .build();

        mockMvc.perform(post("/sweets")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Should update sweet as admin")
    void updateSweet_asAdmin_returnsUpdated() throws Exception {
        SweetRequest request = SweetRequest.builder()
                .name("Updated Truffle")
                .category(SweetCategory.CHOCOLATE)
                .price(new BigDecimal("15.99"))
                .quantity(80)
                .build();

        mockMvc.perform(put("/sweets/{id}", testSweet.getId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Updated Truffle")))
                .andExpect(jsonPath("$.price", is(15.99)));
    }

    @Test
    @DisplayName("Should delete sweet as admin")
    void deleteSweet_asAdmin_returnsNoContent() throws Exception {
        mockMvc.perform(delete("/sweets/{id}", testSweet.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("Should purchase sweet successfully")
    void purchaseSweet_withSufficientStock_returnsSuccess() throws Exception {
        PurchaseRequest request = PurchaseRequest.builder()
                .quantity(5)
                .build();

        mockMvc.perform(post("/sweets/{id}/purchase", testSweet.getId())
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity", is(5)))
                .andExpect(jsonPath("$.totalPrice", is(64.95)));
    }

    @Test
    @DisplayName("Should reject purchase with insufficient stock")
    void purchaseSweet_withInsufficientStock_returnsBadRequest() throws Exception {
        PurchaseRequest request = PurchaseRequest.builder()
                .quantity(150) // More than available
                .build();

        mockMvc.perform(post("/sweets/{id}/purchase", testSweet.getId())
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should restock sweet as admin")
    void restockSweet_asAdmin_returnsUpdatedQuantity() throws Exception {
        RestockRequest request = RestockRequest.builder()
                .quantity(50)
                .build();

        mockMvc.perform(post("/sweets/{id}/restock", testSweet.getId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity", is(150))); // 100 + 50
    }

    @Test
    @DisplayName("Should reject restock as regular user")
    void restockSweet_asUser_returnsForbidden() throws Exception {
        RestockRequest request = RestockRequest.builder()
                .quantity(50)
                .build();

        mockMvc.perform(post("/sweets/{id}/restock", testSweet.getId())
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }
}
