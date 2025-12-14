package com.sweetshop.repository;

import com.sweetshop.entity.Sweet;
import com.sweetshop.enums.SweetCategory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("SweetRepository Tests")
class SweetRepositoryTest {

    @Autowired
    private SweetRepository sweetRepository;

    private Sweet testSweet1;
    private Sweet testSweet2;
    private Sweet testSweet3;

    @BeforeEach
    void setUp() {
        sweetRepository.deleteAll();

        testSweet1 = Sweet.builder()
                .name("Kaju Katli")
                .category(SweetCategory.BARFI)
                .price(BigDecimal.valueOf(650.00))
                .quantity(100)
                .description("Premium cashew fudge")
                .build();

        testSweet2 = Sweet.builder()
                .name("Motichoor Ladoo")
                .category(SweetCategory.LADOO)
                .price(BigDecimal.valueOf(400.00))
                .quantity(80)
                .description("Traditional ladoo")
                .build();

        testSweet3 = Sweet.builder()
                .name("Pista Barfi")
                .category(SweetCategory.BARFI)
                .price(BigDecimal.valueOf(750.00))
                .quantity(60)
                .description("Pistachio barfi")
                .build();
    }

    @Nested
    @DisplayName("Find All Tests")
    class FindAllTests {

        @Test
        @DisplayName("Should return all sweets")
        void findAll_ReturnsAllSweets() {
            sweetRepository.saveAll(List.of(testSweet1, testSweet2, testSweet3));

            List<Sweet> result = sweetRepository.findAll();

            assertThat(result).hasSize(3);
        }

        @Test
        @DisplayName("Should return paginated results")
        void findAll_WithPagination_ReturnsPaginatedResults() {
            sweetRepository.saveAll(List.of(testSweet1, testSweet2, testSweet3));
            Pageable pageable = PageRequest.of(0, 2);

            Page<Sweet> result = sweetRepository.findAll(pageable);

            assertThat(result.getContent()).hasSize(2);
            assertThat(result.getTotalElements()).isEqualTo(3);
            assertThat(result.getTotalPages()).isEqualTo(2);
        }
    }

    @Nested
    @DisplayName("Find By ID Tests")
    class FindByIdTests {

        @Test
        @DisplayName("Should return sweet when ID exists")
        void findById_WhenExists_ReturnsSweet() {
            Sweet savedSweet = sweetRepository.save(testSweet1);

            Optional<Sweet> result = sweetRepository.findById(savedSweet.getId());

            assertThat(result).isPresent();
            assertThat(result.get().getName()).isEqualTo("Kaju Katli");
        }

        @Test
        @DisplayName("Should return empty when ID does not exist")
        void findById_WhenNotExists_ReturnsEmpty() {
            Optional<Sweet> result = sweetRepository.findById(java.util.UUID.randomUUID());

            assertThat(result).isEmpty();
        }
    }

    @Nested
    @DisplayName("Find By Category Tests")
    class FindByCategoryTests {

        @Test
        @DisplayName("Should filter by category")
        void findByCategory_ReturnsFilteredSweets() {
            sweetRepository.saveAll(List.of(testSweet1, testSweet2, testSweet3));
            Pageable pageable = PageRequest.of(0, 10);

            Page<Sweet> result = sweetRepository.findByCategory(SweetCategory.BARFI, pageable);

            assertThat(result.getContent()).hasSize(2);
            assertThat(result.getContent()).allMatch(s -> s.getCategory() == SweetCategory.BARFI);
        }
    }

    @Nested
    @DisplayName("Search Sweets Tests")
    class SearchSweetsTests {

        @Test
        @DisplayName("Should search by name (partial match)")
        void searchSweets_ByName_ReturnsMatches() {
            sweetRepository.saveAll(List.of(testSweet1, testSweet2, testSweet3));
            Pageable pageable = PageRequest.of(0, 10);

            Page<Sweet> result = sweetRepository.searchSweets("Kaju", null, null, null, pageable);

            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getContent().get(0).getName()).isEqualTo("Kaju Katli");
        }

        @Test
        @DisplayName("Should search by category")
        void searchSweets_ByCategory_ReturnsMatches() {
            sweetRepository.saveAll(List.of(testSweet1, testSweet2, testSweet3));
            Pageable pageable = PageRequest.of(0, 10);

            Page<Sweet> result = sweetRepository.searchSweets(null, SweetCategory.LADOO, null, null, pageable);

            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getContent().get(0).getCategory()).isEqualTo(SweetCategory.LADOO);
        }

        @Test
        @DisplayName("Should search by price range")
        void searchSweets_ByPriceRange_ReturnsMatches() {
            sweetRepository.saveAll(List.of(testSweet1, testSweet2, testSweet3));
            Pageable pageable = PageRequest.of(0, 10);

            Page<Sweet> result = sweetRepository.searchSweets(
                    null, null, 
                    BigDecimal.valueOf(600), 
                    BigDecimal.valueOf(700), 
                    pageable
            );

            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getContent().get(0).getName()).isEqualTo("Kaju Katli");
        }

        @Test
        @DisplayName("Should search with all filters combined")
        void searchSweets_WithAllFilters_ReturnsMatches() {
            sweetRepository.saveAll(List.of(testSweet1, testSweet2, testSweet3));
            Pageable pageable = PageRequest.of(0, 10);

            Page<Sweet> result = sweetRepository.searchSweets(
                    "Barfi", 
                    SweetCategory.BARFI, 
                    BigDecimal.valueOf(700), 
                    BigDecimal.valueOf(800), 
                    pageable
            );

            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getContent().get(0).getName()).isEqualTo("Pista Barfi");
        }

        @Test
        @DisplayName("Should return all when no filters applied")
        void searchSweets_WithNullParameters_ReturnsAll() {
            sweetRepository.saveAll(List.of(testSweet1, testSweet2, testSweet3));
            Pageable pageable = PageRequest.of(0, 10);

            Page<Sweet> result = sweetRepository.searchSweets(null, null, null, null, pageable);

            assertThat(result.getContent()).hasSize(3);
        }
    }

    @Nested
    @DisplayName("Save and Delete Tests")
    class SaveAndDeleteTests {

        @Test
        @DisplayName("Should persist sweet with generated ID")
        void save_PersistsSweet() {
            Sweet savedSweet = sweetRepository.save(testSweet1);

            assertThat(savedSweet.getId()).isNotNull();
            assertThat(savedSweet.getName()).isEqualTo("Kaju Katli");
        }

        @Test
        @DisplayName("Should delete sweet")
        void delete_RemovesSweet() {
            Sweet savedSweet = sweetRepository.save(testSweet1);
            
            sweetRepository.delete(savedSweet);

            Optional<Sweet> result = sweetRepository.findById(savedSweet.getId());
            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("Should update sweet quantity")
        void save_UpdatesQuantity() {
            Sweet savedSweet = sweetRepository.save(testSweet1);
            savedSweet.setQuantity(50);
            
            Sweet updatedSweet = sweetRepository.save(savedSweet);

            assertThat(updatedSweet.getQuantity()).isEqualTo(50);
        }
    }
}
