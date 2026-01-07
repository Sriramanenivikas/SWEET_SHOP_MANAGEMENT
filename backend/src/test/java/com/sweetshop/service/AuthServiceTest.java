package com.sweetshop.service;

import com.sweetshop.dto.request.LoginRequest;
import com.sweetshop.dto.request.RegisterRequest;
import com.sweetshop.dto.response.AuthResponse;
import com.sweetshop.entity.RefreshToken;
import com.sweetshop.entity.User;
import com.sweetshop.enums.UserRole;
import com.sweetshop.exception.BadCredentialsException;
import com.sweetshop.exception.DuplicateResourceException;
import com.sweetshop.repository.UserRepository;
import com.sweetshop.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Unit Tests")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private RefreshTokenService refreshTokenService;

    @Mock
    private TokenBlacklistService tokenBlacklistService;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest validRegisterRequest;
    private LoginRequest validLoginRequest;
    private User testUser;
    private RefreshToken testRefreshToken;

    private static final String USER_AGENT = "Mozilla/5.0";
    private static final String IP_ADDRESS = "127.0.0.1";

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "jwtExpiration", 86400000L);

        validRegisterRequest = RegisterRequest.builder()
                .email("test@example.com")
                .password("Password123")
                .firstName("John")
                .lastName("Doe")
                .build();

        validLoginRequest = LoginRequest.builder()
                .email("test@example.com")
                .password("Password123")
                .build();

        testUser = User.builder()
                .id(UUID.randomUUID())
                .email("test@example.com")
                .password("encodedPassword")
                .firstName("John")
                .lastName("Doe")
                .role(UserRole.USER)
                .build();

        testRefreshToken = RefreshToken.builder()
                .id(UUID.randomUUID())
                .token("refresh-token-value")
                .user(testUser)
                .expiryDate(Instant.now().plusSeconds(604800))
                .revoked(false)
                .build();
    }

    @Nested
    @DisplayName("Registration Tests")
    class RegistrationTests {

        @Test
        @DisplayName("Should register user with valid data")
        void register_WithValidData_ReturnsAuthResponse() {
            when(userRepository.existsByEmail(anyString())).thenReturn(false);
            when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
            when(userRepository.save(any(User.class))).thenReturn(testUser);
            when(jwtTokenProvider.generateToken(anyString())).thenReturn("jwt-token");
            when(refreshTokenService.createRefreshToken(anyString(), anyString(), anyString()))
                    .thenReturn(testRefreshToken);

            AuthResponse response = authService.register(validRegisterRequest, USER_AGENT, IP_ADDRESS);

            assertThat(response).isNotNull();
            assertThat(response.getAccessToken()).isEqualTo("jwt-token");
            assertThat(response.getRefreshToken()).isEqualTo("refresh-token-value");
            assertThat(response.getTokenType()).isEqualTo("Bearer");
            assertThat(response.getUser()).isNotNull();
            assertThat(response.getUser().getEmail()).isEqualTo("test@example.com");
            assertThat(response.getUser().getRole()).isEqualTo(UserRole.USER);

            verify(userRepository).existsByEmail("test@example.com");
            verify(passwordEncoder).encode("Password123");
            verify(userRepository).save(any(User.class));
        }

        @Test
        @DisplayName("Should throw exception for duplicate email")
        void register_WithDuplicateEmail_ThrowsDuplicateException() {
            when(userRepository.existsByEmail(anyString())).thenReturn(true);

            assertThatThrownBy(() -> authService.register(validRegisterRequest, USER_AGENT, IP_ADDRESS))
                    .isInstanceOf(DuplicateResourceException.class)
                    .hasMessageContaining("email");

            verify(userRepository).existsByEmail("test@example.com");
            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("Should encode password before saving")
        void register_EncodesPassword() {
            when(userRepository.existsByEmail(anyString())).thenReturn(false);
            when(passwordEncoder.encode("Password123")).thenReturn("$2a$12$encodedHash");
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
                User user = invocation.getArgument(0);
                assertThat(user.getPassword()).isEqualTo("$2a$12$encodedHash");
                user.setId(UUID.randomUUID());
                return user;
            });
            when(jwtTokenProvider.generateToken(anyString())).thenReturn("jwt-token");
            when(refreshTokenService.createRefreshToken(anyString(), anyString(), anyString()))
                    .thenReturn(testRefreshToken);

            authService.register(validRegisterRequest, USER_AGENT, IP_ADDRESS);

            verify(passwordEncoder).encode("Password123");
        }
    }

    @Nested
    @DisplayName("Login Tests")
    class LoginTests {

        @Test
        @DisplayName("Should login with valid credentials")
        void login_WithValidCredentials_ReturnsToken() {
            when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
            when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
            when(jwtTokenProvider.generateToken(anyString())).thenReturn("jwt-token");
            when(refreshTokenService.createRefreshToken(anyString(), anyString(), anyString()))
                    .thenReturn(testRefreshToken);

            AuthResponse response = authService.login(validLoginRequest, USER_AGENT, IP_ADDRESS);

            assertThat(response).isNotNull();
            assertThat(response.getAccessToken()).isEqualTo("jwt-token");
            assertThat(response.getRefreshToken()).isEqualTo("refresh-token-value");
            assertThat(response.getUser().getEmail()).isEqualTo("test@example.com");

            verify(userRepository).findByEmail("test@example.com");
            verify(passwordEncoder).matches("Password123", "encodedPassword");
        }

        @Test
        @DisplayName("Should throw exception for non-existent email")
        void login_WithInvalidEmail_ThrowsBadCredentials() {
            when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

            assertThatThrownBy(() -> authService.login(validLoginRequest, USER_AGENT, IP_ADDRESS))
                    .isInstanceOf(BadCredentialsException.class);

            verify(userRepository).findByEmail("test@example.com");
            verify(passwordEncoder, never()).matches(anyString(), anyString());
        }

        @Test
        @DisplayName("Should throw exception for wrong password")
        void login_WithInvalidPassword_ThrowsBadCredentials() {
            when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
            when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

            assertThatThrownBy(() -> authService.login(validLoginRequest, USER_AGENT, IP_ADDRESS))
                    .isInstanceOf(BadCredentialsException.class);

            verify(passwordEncoder).matches("Password123", "encodedPassword");
            verify(jwtTokenProvider, never()).generateToken(anyString());
        }

        @Test
        @DisplayName("Should return correct user role in response")
        void login_ReturnsCorrectUserRole() {
            User adminUser = User.builder()
                    .id(UUID.randomUUID())
                    .email("admin@example.com")
                    .password("encodedPassword")
                    .firstName("Admin")
                    .lastName("User")
                    .role(UserRole.ADMIN)
                    .build();

            when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(adminUser));
            when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
            when(jwtTokenProvider.generateToken(anyString())).thenReturn("jwt-token");
            when(refreshTokenService.createRefreshToken(anyString(), anyString(), anyString()))
                    .thenReturn(testRefreshToken);

            LoginRequest adminLogin = LoginRequest.builder()
                    .email("admin@example.com")
                    .password("Password123")
                    .build();

            AuthResponse response = authService.login(adminLogin, USER_AGENT, IP_ADDRESS);

            assertThat(response.getUser().getRole()).isEqualTo(UserRole.ADMIN);
        }
    }
}
