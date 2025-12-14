package com.sweetshop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sweetshop.dto.request.LoginRequest;
import com.sweetshop.dto.request.RegisterRequest;
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
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@DisplayName("AuthController Integration Tests")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Nested
    @DisplayName("Registration Endpoint Tests")
    class RegistrationTests {

        @Test
        @DisplayName("Should register user with valid data - returns 201")
        void register_WithValidData_Returns201() throws Exception {
            RegisterRequest request = RegisterRequest.builder()
                    .email("newuser@example.com")
                    .password("Password123")
                    .firstName("John")
                    .lastName("Doe")
                    .build();

            performRegister(request)
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.accessToken").isNotEmpty())
                    .andExpect(jsonPath("$.tokenType").value("Bearer"))
                    .andExpect(jsonPath("$.user.email").value("newuser@example.com"))
                    .andExpect(jsonPath("$.user.firstName").value("John"))
                    .andExpect(jsonPath("$.user.lastName").value("Doe"))
                    .andExpect(jsonPath("$.user.role").value("USER"));
        }

        @Test
        @DisplayName("Should reject registration with missing email - returns 400")
        void register_WithMissingEmail_Returns400() throws Exception {
            RegisterRequest request = RegisterRequest.builder()
                    .password("Password123")
                    .firstName("John")
                    .lastName("Doe")
                    .build();

            performRegister(request)
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.validationErrors.email").exists());
        }

        @Test
        @DisplayName("Should reject registration with invalid email format - returns 400")
        void register_WithInvalidEmail_Returns400() throws Exception {
            RegisterRequest request = RegisterRequest.builder()
                    .email("invalid-email")
                    .password("Password123")
                    .firstName("John")
                    .lastName("Doe")
                    .build();

            performRegister(request)
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.validationErrors.email").exists());
        }

        @Test
        @DisplayName("Should reject registration with short password - returns 400")
        void register_WithShortPassword_Returns400() throws Exception {
            RegisterRequest request = RegisterRequest.builder()
                    .email("user@example.com")
                    .password("short")
                    .firstName("John")
                    .lastName("Doe")
                    .build();

            performRegister(request)
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.validationErrors.password").exists());
        }

        @Test
        @DisplayName("Should reject registration with duplicate email - returns 409")
        void register_WithDuplicateEmail_Returns409() throws Exception {
            // First registration
            createTestUser("existing@example.com", "Password123", UserRole.USER);

            // Duplicate registration
            RegisterRequest request = RegisterRequest.builder()
                    .email("existing@example.com")
                    .password("Password123")
                    .firstName("Another")
                    .lastName("User")
                    .build();

            performRegister(request)
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.message").value(containsString("email")));
        }

        @Test
        @DisplayName("Should reject registration with missing first name - returns 400")
        void register_WithMissingFirstName_Returns400() throws Exception {
            RegisterRequest request = RegisterRequest.builder()
                    .email("user@example.com")
                    .password("Password123")
                    .lastName("Doe")
                    .build();

            performRegister(request)
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.validationErrors.firstName").exists());
        }

        private ResultActions performRegister(RegisterRequest request) throws Exception {
            return mockMvc.perform(post("/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)));
        }
    }

    @Nested
    @DisplayName("Login Endpoint Tests")
    class LoginTests {

        @Test
        @DisplayName("Should login with valid credentials - returns 200")
        void login_WithValidCredentials_Returns200() throws Exception {
            createTestUser("user@example.com", "Password123", UserRole.USER);

            LoginRequest request = LoginRequest.builder()
                    .email("user@example.com")
                    .password("Password123")
                    .build();

            performLogin(request)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.accessToken").isNotEmpty())
                    .andExpect(jsonPath("$.tokenType").value("Bearer"))
                    .andExpect(jsonPath("$.user.email").value("user@example.com"))
                    .andExpect(jsonPath("$.user.role").value("USER"));
        }

        @Test
        @DisplayName("Should login as admin and return admin role")
        void login_AsAdmin_ReturnsAdminRole() throws Exception {
            createTestUser("admin@example.com", "Password123", UserRole.ADMIN);

            LoginRequest request = LoginRequest.builder()
                    .email("admin@example.com")
                    .password("Password123")
                    .build();

            performLogin(request)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.user.role").value("ADMIN"));
        }

        @Test
        @DisplayName("Should reject login with wrong password - returns 401")
        void login_WithInvalidCredentials_Returns401() throws Exception {
            createTestUser("user@example.com", "Password123", UserRole.USER);

            LoginRequest request = LoginRequest.builder()
                    .email("user@example.com")
                    .password("WrongPassword")
                    .build();

            performLogin(request)
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.message").value(containsString("Invalid")));
        }

        @Test
        @DisplayName("Should reject login with non-existent user - returns 401")
        void login_WithNonExistentUser_Returns401() throws Exception {
            LoginRequest request = LoginRequest.builder()
                    .email("nonexistent@example.com")
                    .password("Password123")
                    .build();

            performLogin(request)
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.message").value(containsString("Invalid")));
        }

        @Test
        @DisplayName("Should reject login with missing email - returns 400")
        void login_WithMissingEmail_Returns400() throws Exception {
            LoginRequest request = LoginRequest.builder()
                    .password("Password123")
                    .build();

            performLogin(request)
                    .andExpect(status().isBadRequest());
        }

        private ResultActions performLogin(LoginRequest request) throws Exception {
            return mockMvc.perform(post("/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)));
        }
    }

    private User createTestUser(String email, String password, UserRole role) {
        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .firstName("Test")
                .lastName("User")
                .role(role)
                .build();
        return userRepository.save(user);
    }
}
