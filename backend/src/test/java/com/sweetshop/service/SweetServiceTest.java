package com.sweetshop.service;

import com.sweetshop.dto.request.PurchaseRequest;
import com.sweetshop.dto.request.RestockRequest;
import com.sweetshop.dto.request.SweetRequest;
import com.sweetshop.dto.response.PurchaseResponse;
import com.sweetshop.dto.response.SweetResponse;
import com.sweetshop.entity.Sweet;
import com.sweetshop.entity.User;
import com.sweetshop.enums.SweetCategory;
import com.sweetshop.enums.UserRole;
import com.sweetshop.exception.InsufficientStockException;
import com.sweetshop.exception.ResourceNotFoundException;
import com.sweetshop.repository.PurchaseHistoryRepository;
import com.sweetshop.repository.SweetRepository;
import com.sweetshop.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for SweetService.
 */
@ExtendWith(MockitoExtension.class)
class SweetServiceTest {

    @Mock
    private SweetRepository sweetRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PurchaseHistoryRepository purchaseHistoryRepository;

    @InjectMocks
    private SweetService sweetService;

    private Sweet testSweet;
    private User testUser;

    @BeforeEach
    void setUp() {
        testSweet = Sweet.builder()
                .id(UUID.randomUUID())
                .name("Chocolate Truffle")
                .category(SweetCategory.CHOCOLATE)
                .price(new BigDecimal("12.99"))
                .quantity(100)
                .description("Delicious chocolate truffle")
                .build();

        testUser = User.builder()
                .id(UUID.randomUUID())
                .email("user@example.com")
                .firstName("Test")
                .lastName("User")
                .role(UserRole.USER)
                .build();
    }

    @Test
    @DisplayName("Should get all sweets with pagination")
    void getAllSweets_returnsPageOfSweets() {
        Page<Sweet> page = new PageImpl<>(List.of(testSweet));
        when(sweetRepository.findAll(any(PageRequest.class))).thenReturn(page);

        Page<SweetResponse> result = sweetService.getAllSweets(PageRequest.of(0, 10));

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getName()).isEqualTo("Chocolate Truffle");
    }

    @Test
    @DisplayName("Should get sweet by ID")
    void getSweetById_existingId_returnsSweet() {
        when(sweetRepository.findById(any(UUID.class))).thenReturn(Optional.of(testSweet));

        SweetResponse result = sweetService.getSweetById(testSweet.getId());

        assertThat(result.getName()).isEqualTo("Chocolate Truffle");
    }

    @Test
    @DisplayName("Should throw exception for non-existent sweet")
    void getSweetById_nonExistentId_throwsException() {
        when(sweetRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sweetService.getSweetById(UUID.randomUUID()))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("Should create sweet successfully")
    void createSweet_withValidData_returnsCreatedSweet() {
        SweetRequest request = SweetRequest.builder()
                .name("New Candy")
                .category(SweetCategory.CANDY)
                .price(new BigDecimal("5.99"))
                .quantity(50)
                .build();

        Sweet savedSweet = Sweet.builder()
                .id(UUID.randomUUID())
                .name("New Candy")
                .category(SweetCategory.CANDY)
                .price(new BigDecimal("5.99"))
                .quantity(50)
                .build();

        when(sweetRepository.save(any(Sweet.class))).thenReturn(savedSweet);

        SweetResponse result = sweetService.createSweet(request);

        assertThat(result.getName()).isEqualTo("New Candy");
        verify(sweetRepository).save(any(Sweet.class));
    }

    @Test
    @DisplayName("Should update sweet successfully")
    void updateSweet_withValidData_returnsUpdatedSweet() {
        SweetRequest request = SweetRequest.builder()
                .name("Updated Truffle")
                .category(SweetCategory.CHOCOLATE)
                .price(new BigDecimal("15.99"))
                .quantity(80)
                .build();

        when(sweetRepository.findById(any(UUID.class))).thenReturn(Optional.of(testSweet));
        when(sweetRepository.save(any(Sweet.class))).thenReturn(testSweet);

        SweetResponse result = sweetService.updateSweet(testSweet.getId(), request);

        verify(sweetRepository).save(any(Sweet.class));
    }

    @Test
    @DisplayName("Should delete sweet successfully")
    void deleteSweet_existingId_deletesSweet() {
        when(sweetRepository.findById(any(UUID.class))).thenReturn(Optional.of(testSweet));
        doNothing().when(sweetRepository).delete(any(Sweet.class));

        sweetService.deleteSweet(testSweet.getId());

        verify(sweetRepository).delete(testSweet);
    }

    @Test
    @DisplayName("Should throw exception for insufficient stock")
    void purchaseSweet_insufficientStock_throwsException() {
        testSweet.setQuantity(5);
        PurchaseRequest request = PurchaseRequest.builder()
                .quantity(10)
                .build();

        when(sweetRepository.findById(any(UUID.class))).thenReturn(Optional.of(testSweet));

        assertThatThrownBy(() -> sweetService.purchaseSweet(testSweet.getId(), request))
                .isInstanceOf(InsufficientStockException.class);
    }

    @Test
    @DisplayName("Should restock sweet successfully")
    void restockSweet_withValidQuantity_increasesStock() {
        RestockRequest request = RestockRequest.builder()
                .quantity(50)
                .build();

        when(sweetRepository.findById(any(UUID.class))).thenReturn(Optional.of(testSweet));
        when(sweetRepository.save(any(Sweet.class))).thenReturn(testSweet);

        SweetResponse result = sweetService.restockSweet(testSweet.getId(), request);

        assertThat(testSweet.getQuantity()).isEqualTo(150); // 100 + 50
        verify(sweetRepository).save(testSweet);
    }
}
