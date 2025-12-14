package com.sweetshop.repository;

import com.sweetshop.entity.User;
import com.sweetshop.enums.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("UserRepository Tests")
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        
        testUser = User.builder()
                .email("test@example.com")
                .password("encodedPassword")
                .firstName("Test")
                .lastName("User")
                .role(UserRole.USER)
                .build();
    }

    @Nested
    @DisplayName("Find By Email Tests")
    class FindByEmailTests {

        @Test
        @DisplayName("Should return user when email exists")
        void findByEmail_WhenExists_ReturnsUser() {
            userRepository.save(testUser);

            Optional<User> result = userRepository.findByEmail("test@example.com");

            assertThat(result).isPresent();
            assertThat(result.get().getEmail()).isEqualTo("test@example.com");
            assertThat(result.get().getFirstName()).isEqualTo("Test");
        }

        @Test
        @DisplayName("Should return empty when email does not exist")
        void findByEmail_WhenNotExists_ReturnsEmpty() {
            Optional<User> result = userRepository.findByEmail("nonexistent@example.com");

            assertThat(result).isEmpty();
        }
    }

    @Nested
    @DisplayName("Exists By Email Tests")
    class ExistsByEmailTests {

        @Test
        @DisplayName("Should return true when email exists")
        void existsByEmail_WhenExists_ReturnsTrue() {
            userRepository.save(testUser);

            boolean exists = userRepository.existsByEmail("test@example.com");

            assertThat(exists).isTrue();
        }

        @Test
        @DisplayName("Should return false when email does not exist")
        void existsByEmail_WhenNotExists_ReturnsFalse() {
            boolean exists = userRepository.existsByEmail("nonexistent@example.com");

            assertThat(exists).isFalse();
        }
    }

    @Nested
    @DisplayName("Save User Tests")
    class SaveUserTests {

        @Test
        @DisplayName("Should persist user with generated ID")
        void save_PersistsUser() {
            User savedUser = userRepository.save(testUser);

            assertThat(savedUser.getId()).isNotNull();
            assertThat(savedUser.getEmail()).isEqualTo("test@example.com");
            assertThat(savedUser.getRole()).isEqualTo(UserRole.USER);
        }

        @Test
        @DisplayName("Should throw exception for duplicate email")
        void save_WithDuplicateEmail_ThrowsException() {
            userRepository.save(testUser);

            User duplicateUser = User.builder()
                    .email("test@example.com")
                    .password("anotherPassword")
                    .firstName("Another")
                    .lastName("User")
                    .role(UserRole.USER)
                    .build();

            assertThatThrownBy(() -> {
                userRepository.save(duplicateUser);
                userRepository.flush();
            }).isInstanceOf(DataIntegrityViolationException.class);
        }

        @Test
        @DisplayName("Should save admin user correctly")
        void save_AdminUser_PersistsWithAdminRole() {
            User adminUser = User.builder()
                    .email("admin@example.com")
                    .password("encodedPassword")
                    .firstName("Admin")
                    .lastName("User")
                    .role(UserRole.ADMIN)
                    .build();

            User savedUser = userRepository.save(adminUser);

            assertThat(savedUser.getRole()).isEqualTo(UserRole.ADMIN);
        }
    }
}
