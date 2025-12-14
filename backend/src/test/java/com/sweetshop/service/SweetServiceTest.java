package com.sweetshop.service;

import com.sweetshop.dto.request.PurchaseRequest;
import com.sweetshop.dto.request.RestockRequest;
import com.sweetshop.dto.request.SweetRequest;
import com.sweetshop.dto.response.PurchaseResponse;
import com.sweetshop.dto.response.SweetResponse;
import com.sweetshop.entity.PurchaseHistory;
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
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.lenient;

@ExtendWith(MockitoExtension.class)
@DisplayName("SweetService Unit Tests")
class SweetServiceTest {

    @Mock
    private SweetRepository sweetRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PurchaseHistoryRepository purchaseHistoryRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private SweetService sweetService;

    private Sweet testSweet;
    private User testUser;
    private UUID sweetId;
    private UUID userId;

    @BeforeEach
    void setUp() {
        sweetId = UUID.randomUUID();
        userId = UUID.randomUUID();

        testSweet = Sweet.builder()
                .id(sweetId)
                .name("Kaju Katli")
                .category(SweetCategory.BARFI)
                .price(BigDecimal.valueOf(650.00))
                .quantity(100)
                .description("Premium cashew fudge")
                .imageUrl("/BARFI/Kaju_Barfi.jpg")
                .build();

        testUser = User.builder()
                .id(userId)
                .email("user@example.com")
                .password("encodedPassword")
                .firstName("Test")
                .lastName("User")
                .role(UserRole.USER)
                .build();
    }

    @Nested
    @DisplayName("Get All Sweets Tests")
    class GetAllSweetsTests {

        @Test
        @DisplayName("Should return paginated list of sweets")
        void getAllSweets_ReturnsPaginatedList() {
            Pageable pageable = PageRequest.of(0, 10);
            Page<Sweet> sweetPage = new PageImpl<>(List.of(testSweet), pageable, 1);

            when(sweetRepository.findAll(pageable)).thenReturn(sweetPage);

            Page<SweetResponse> result = sweetService.getAllSweets(pageable);

            assertThat(result).isNotNull();
            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getContent().get(0).getName()).isEqualTo("Kaju Katli");

            verify(sweetRepository).findAll(pageable);
        }
    }

    @Nested
    @DisplayName("Get Sweet By ID Tests")
    class GetSweetByIdTests {

        @Test
        @DisplayName("Should return sweet when ID exists")
        void getSweetById_WithValidId_ReturnsSweet() {
            when(sweetRepository.findById(sweetId)).thenReturn(Optional.of(testSweet));

            SweetResponse result = sweetService.getSweetById(sweetId);

            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(sweetId);
            assertThat(result.getName()).isEqualTo("Kaju Katli");
            assertThat(result.getCategory()).isEqualTo(SweetCategory.BARFI);

            verify(sweetRepository).findById(sweetId);
        }

        @Test
        @DisplayName("Should throw exception when ID not found")
        void getSweetById_WithInvalidId_ThrowsNotFound() {
            UUID invalidId = UUID.randomUUID();
            when(sweetRepository.findById(invalidId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> sweetService.getSweetById(invalidId))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Sweet");

            verify(sweetRepository).findById(invalidId);
        }
    }

    @Nested
    @DisplayName("Search Sweets Tests")
    class SearchSweetsTests {

        @Test
        @DisplayName("Should filter by name")
        void searchSweets_ByName_ReturnsMatches() {
            Pageable pageable = PageRequest.of(0, 10);
            Page<Sweet> sweetPage = new PageImpl<>(List.of(testSweet), pageable, 1);

            when(sweetRepository.searchSweets(eq("Kaju"), any(), any(), any(), eq(pageable)))
                    .thenReturn(sweetPage);

            Page<SweetResponse> result = sweetService.searchSweets("Kaju", null, null, null, pageable);

            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getContent().get(0).getName()).contains("Kaju");
        }

        @Test
        @DisplayName("Should filter by category")
        void searchSweets_ByCategory_ReturnsMatches() {
            Pageable pageable = PageRequest.of(0, 10);
            Page<Sweet> sweetPage = new PageImpl<>(List.of(testSweet), pageable, 1);

            when(sweetRepository.searchSweets(any(), eq(SweetCategory.BARFI), any(), any(), eq(pageable)))
                    .thenReturn(sweetPage);

            Page<SweetResponse> result = sweetService.searchSweets(null, SweetCategory.BARFI, null, null, pageable);

            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getContent().get(0).getCategory()).isEqualTo(SweetCategory.BARFI);
        }

        @Test
        @DisplayName("Should filter by price range")
        void searchSweets_ByPriceRange_ReturnsMatches() {
            Pageable pageable = PageRequest.of(0, 10);
            Page<Sweet> sweetPage = new PageImpl<>(List.of(testSweet), pageable, 1);

            BigDecimal minPrice = BigDecimal.valueOf(500);
            BigDecimal maxPrice = BigDecimal.valueOf(700);

            when(sweetRepository.searchSweets(any(), any(), eq(minPrice), eq(maxPrice), eq(pageable)))
                    .thenReturn(sweetPage);

            Page<SweetResponse> result = sweetService.searchSweets(null, null, minPrice, maxPrice, pageable);

            assertThat(result.getContent()).hasSize(1);
        }
    }

    @Nested
    @DisplayName("Create Sweet Tests")
    class CreateSweetTests {

        @Test
        @DisplayName("Should create sweet with valid data")
        void createSweet_WithValidData_ReturnsSweet() {
            SweetRequest request = SweetRequest.builder()
                    .name("New Sweet")
                    .category(SweetCategory.LADOO)
                    .price(BigDecimal.valueOf(400))
                    .quantity(50)
                    .description("Test description")
                    .build();

            Sweet savedSweet = Sweet.builder()
                    .id(UUID.randomUUID())
                    .name("New Sweet")
                    .category(SweetCategory.LADOO)
                    .price(BigDecimal.valueOf(400))
                    .quantity(50)
                    .description("Test description")
                    .build();

            when(sweetRepository.save(any(Sweet.class))).thenReturn(savedSweet);

            SweetResponse result = sweetService.createSweet(request);

            assertThat(result).isNotNull();
            assertThat(result.getName()).isEqualTo("New Sweet");
            assertThat(result.getCategory()).isEqualTo(SweetCategory.LADOO);

            verify(sweetRepository).save(any(Sweet.class));
        }
    }

    @Nested
    @DisplayName("Update Sweet Tests")
    class UpdateSweetTests {

        @Test
        @DisplayName("Should update sweet with valid data")
        void updateSweet_WithValidData_ReturnsUpdated() {
            SweetRequest request = SweetRequest.builder()
                    .name("Updated Kaju Katli")
                    .category(SweetCategory.BARFI)
                    .price(BigDecimal.valueOf(700))
                    .quantity(150)
                    .description("Updated description")
                    .build();

            when(sweetRepository.findById(sweetId)).thenReturn(Optional.of(testSweet));
            when(sweetRepository.save(any(Sweet.class))).thenAnswer(i -> i.getArgument(0));

            SweetResponse result = sweetService.updateSweet(sweetId, request);

            assertThat(result.getName()).isEqualTo("Updated Kaju Katli");
            assertThat(result.getPrice()).isEqualByComparingTo(BigDecimal.valueOf(700));

            verify(sweetRepository).findById(sweetId);
            verify(sweetRepository).save(any(Sweet.class));
        }

        @Test
        @DisplayName("Should throw exception when updating non-existent sweet")
        void updateSweet_WithInvalidId_ThrowsNotFound() {
            UUID invalidId = UUID.randomUUID();
            SweetRequest request = SweetRequest.builder()
                    .name("Test")
                    .category(SweetCategory.BARFI)
                    .price(BigDecimal.valueOf(100))
                    .quantity(10)
                    .build();

            when(sweetRepository.findById(invalidId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> sweetService.updateSweet(invalidId, request))
                    .isInstanceOf(ResourceNotFoundException.class);

            verify(sweetRepository, never()).save(any(Sweet.class));
        }
    }

    @Nested
    @DisplayName("Delete Sweet Tests")
    class DeleteSweetTests {

        @Test
        @DisplayName("Should delete sweet with valid ID")
        void deleteSweet_WithValidId_DeletesSweet() {
            when(sweetRepository.findById(sweetId)).thenReturn(Optional.of(testSweet));
            doNothing().when(sweetRepository).delete(testSweet);

            sweetService.deleteSweet(sweetId);

            verify(sweetRepository).findById(sweetId);
            verify(sweetRepository).delete(testSweet);
        }

        @Test
        @DisplayName("Should throw exception when deleting non-existent sweet")
        void deleteSweet_WithInvalidId_ThrowsNotFound() {
            UUID invalidId = UUID.randomUUID();
            when(sweetRepository.findById(invalidId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> sweetService.deleteSweet(invalidId))
                    .isInstanceOf(ResourceNotFoundException.class);

            verify(sweetRepository, never()).delete(any(Sweet.class));
        }
    }

    @Nested
    @DisplayName("Purchase Sweet Tests")
    class PurchaseSweetTests {

        private void setUpSecurityContext() {
            SecurityContextHolder.setContext(securityContext);
            lenient().when(securityContext.getAuthentication()).thenReturn(authentication);
            lenient().when(authentication.getName()).thenReturn("user@example.com");
        }

        @Test
        @DisplayName("Should purchase sweet with sufficient stock")
        void purchaseSweet_WithSufficientStock_ReducesQuantity() {
            setUpSecurityContext();
            PurchaseRequest request = PurchaseRequest.builder()
                    .quantity(5)
                    .build();

            PurchaseHistory savedPurchase = PurchaseHistory.builder()
                    .id(UUID.randomUUID())
                    .user(testUser)
                    .sweet(testSweet)
                    .quantity(5)
                    .unitPrice(testSweet.getPrice())
                    .totalPrice(testSweet.getPrice().multiply(BigDecimal.valueOf(5)))
                    .build();

            when(sweetRepository.findById(sweetId)).thenReturn(Optional.of(testSweet));
            when(sweetRepository.save(any(Sweet.class))).thenReturn(testSweet);
            when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(testUser));
            when(purchaseHistoryRepository.save(any(PurchaseHistory.class))).thenReturn(savedPurchase);

            PurchaseResponse result = sweetService.purchaseSweet(sweetId, request);

            assertThat(result).isNotNull();
            assertThat(result.getQuantity()).isEqualTo(5);
            assertThat(testSweet.getQuantity()).isEqualTo(95); // 100 - 5

            verify(sweetRepository).save(any(Sweet.class));
            verify(purchaseHistoryRepository).save(any(PurchaseHistory.class));
        }

        @Test
        @DisplayName("Should throw exception when stock is insufficient")
        void purchaseSweet_WithInsufficientStock_ThrowsException() {
            testSweet.setQuantity(3);
            PurchaseRequest request = PurchaseRequest.builder()
                    .quantity(5)
                    .build();

            when(sweetRepository.findById(sweetId)).thenReturn(Optional.of(testSweet));

            assertThatThrownBy(() -> sweetService.purchaseSweet(sweetId, request))
                    .isInstanceOf(InsufficientStockException.class)
                    .hasMessageContaining("Insufficient stock");

            verify(sweetRepository, never()).save(any(Sweet.class));
        }

        @Test
        @DisplayName("Should throw exception when stock is zero")
        void purchaseSweet_WithZeroStock_ThrowsException() {
            testSweet.setQuantity(0);
            PurchaseRequest request = PurchaseRequest.builder()
                    .quantity(1)
                    .build();

            when(sweetRepository.findById(sweetId)).thenReturn(Optional.of(testSweet));

            assertThatThrownBy(() -> sweetService.purchaseSweet(sweetId, request))
                    .isInstanceOf(InsufficientStockException.class);
        }

        @Test
        @DisplayName("Should record purchase history")
        void purchaseSweet_RecordsPurchaseHistory() {
            setUpSecurityContext();
            PurchaseRequest request = PurchaseRequest.builder()
                    .quantity(2)
                    .build();

            PurchaseHistory savedPurchase = PurchaseHistory.builder()
                    .id(UUID.randomUUID())
                    .user(testUser)
                    .sweet(testSweet)
                    .quantity(2)
                    .unitPrice(testSweet.getPrice())
                    .totalPrice(testSweet.getPrice().multiply(BigDecimal.valueOf(2)))
                    .build();

            when(sweetRepository.findById(sweetId)).thenReturn(Optional.of(testSweet));
            when(sweetRepository.save(any(Sweet.class))).thenReturn(testSweet);
            when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(testUser));
            when(purchaseHistoryRepository.save(any(PurchaseHistory.class))).thenReturn(savedPurchase);

            PurchaseResponse result = sweetService.purchaseSweet(sweetId, request);

            assertThat(result.getTotalPrice()).isEqualByComparingTo(
                    testSweet.getPrice().multiply(BigDecimal.valueOf(2))
            );

            verify(purchaseHistoryRepository).save(any(PurchaseHistory.class));
        }
    }

    @Nested
    @DisplayName("Restock Sweet Tests")
    class RestockSweetTests {

        @Test
        @DisplayName("Should increase quantity with valid restock")
        void restockSweet_WithValidData_IncreasesQuantity() {
            RestockRequest request = RestockRequest.builder()
                    .quantity(50)
                    .build();

            when(sweetRepository.findById(sweetId)).thenReturn(Optional.of(testSweet));
            when(sweetRepository.save(any(Sweet.class))).thenAnswer(i -> i.getArgument(0));

            SweetResponse result = sweetService.restockSweet(sweetId, request);

            assertThat(result.getQuantity()).isEqualTo(150); // 100 + 50

            verify(sweetRepository).save(any(Sweet.class));
        }

        @Test
        @DisplayName("Should throw exception when restocking non-existent sweet")
        void restockSweet_WithInvalidId_ThrowsNotFound() {
            UUID invalidId = UUID.randomUUID();
            RestockRequest request = RestockRequest.builder()
                    .quantity(50)
                    .build();

            when(sweetRepository.findById(invalidId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> sweetService.restockSweet(invalidId, request))
                    .isInstanceOf(ResourceNotFoundException.class);

            verify(sweetRepository, never()).save(any(Sweet.class));
        }
    }
}
