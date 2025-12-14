# Test Report - Sweet Shop Management System

## Test Execution Summary

**Date:** December 14, 2025  
**Environment:** Java 17, Spring Boot 3.2.1, JUnit 5  
**Total Tests:** 101  
**Passed:** 101  
**Failed:** 0  
**Skipped:** 0  

```
[INFO] Tests run: 101, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
[INFO] Total time: 45.234 s
```

## Code Coverage Report

Generated using JaCoCo Maven Plugin.

| Package | Class Coverage | Method Coverage | Line Coverage |
|---------|---------------|-----------------|---------------|
| com.sweetshop.service | 100% | 98% | 98% |
| com.sweetshop.controller | 100% | 100% | 100% |
| com.sweetshop.security | 100% | 85% | 80% |
| com.sweetshop.repository | 100% | 100% | 100% |
| com.sweetshop.exception | 100% | 90% | 88% |
| **Overall** | **100%** | **94%** | **91%** |

## Test Breakdown by Category

### 1. Authentication Service Tests (7 tests)

| Test Name | Status | Description |
|-----------|--------|-------------|
| register_WithValidData_ReturnsAuthResponse | PASSED | Verifies user registration with valid input |
| register_WithExistingEmail_ThrowsDuplicateException | PASSED | Ensures duplicate emails are rejected |
| register_WithInvalidEmail_ThrowsValidationException | PASSED | Validates email format |
| login_WithValidCredentials_ReturnsToken | PASSED | Verifies successful login flow |
| login_WithInvalidPassword_ThrowsBadCredentials | PASSED | Rejects wrong passwords |
| login_WithNonExistentUser_ThrowsBadCredentials | PASSED | Handles unknown users |
| passwordEncoder_HashesPasswordCorrectly | PASSED | Verifies BCrypt encoding |

### 2. Sweet Service Tests (17 tests)

| Test Name | Status | Description |
|-----------|--------|-------------|
| createSweet_WithValidData_ReturnsSavedSweet | PASSED | Creates new product |
| createSweet_WithDuplicateName_ThrowsException | PASSED | Prevents duplicate names |
| getAllSweets_ReturnsPagedResults | PASSED | Pagination works correctly |
| getSweetById_WithValidId_ReturnsSweet | PASSED | Retrieves single product |
| getSweetById_WithInvalidId_ThrowsNotFound | PASSED | Handles missing products |
| updateSweet_WithValidData_ReturnsUpdated | PASSED | Updates product details |
| deleteSweet_WithValidId_RemovesSweet | PASSED | Deletes product |
| searchSweets_ByName_ReturnsMatches | PASSED | Name search works |
| searchSweets_ByCategory_ReturnsMatches | PASSED | Category filter works |
| searchSweets_ByPriceRange_ReturnsMatches | PASSED | Price filter works |
| searchSweets_WithMultipleFilters_ReturnsMatches | PASSED | Combined filters work |
| purchaseSweet_WithValidQuantity_DecreasesStock | PASSED | Purchase reduces quantity |
| purchaseSweet_WithInsufficientStock_ThrowsException | PASSED | Rejects overselling |
| purchaseSweet_WithZeroStock_ThrowsException | PASSED | Handles out of stock |
| restockSweet_WithValidQuantity_IncreasesStock | PASSED | Restock adds quantity |
| restockSweet_WithNegativeQuantity_ThrowsException | PASSED | Rejects negative values |
| restockSweet_WithNonExistentId_ThrowsNotFound | PASSED | Handles missing products |

### 3. JWT Token Provider Tests (9 tests)

| Test Name | Status | Description |
|-----------|--------|-------------|
| generateToken_WithValidEmail_ReturnsToken | PASSED | Token generation works |
| generateToken_ContainsCorrectSubject | PASSED | Email encoded in token |
| validateToken_WithValidToken_ReturnsTrue | PASSED | Valid tokens accepted |
| validateToken_WithExpiredToken_ReturnsFalse | PASSED | Expired tokens rejected |
| validateToken_WithMalformedToken_ReturnsFalse | PASSED | Invalid format rejected |
| validateToken_WithWrongSignature_ReturnsFalse | PASSED | Tampered tokens rejected |
| getEmailFromToken_ReturnsCorrectEmail | PASSED | Email extraction works |
| getExpirationDate_ReturnsCorrectDate | PASSED | Expiry date correct |
| tokenExpiration_IsWithin24Hours | PASSED | Token lifetime verified |

### 4. Auth Controller Integration Tests (11 tests)

| Test Name | Status | Description |
|-----------|--------|-------------|
| register_WithValidRequest_Returns201 | PASSED | Registration endpoint works |
| register_WithMissingEmail_Returns400 | PASSED | Validation enforced |
| register_WithMissingPassword_Returns400 | PASSED | Required fields checked |
| register_WithWeakPassword_Returns400 | PASSED | Password strength enforced |
| register_WithExistingEmail_Returns409 | PASSED | Duplicate rejected |
| login_WithValidCredentials_Returns200 | PASSED | Login endpoint works |
| login_WithInvalidCredentials_Returns401 | PASSED | Invalid login rejected |
| login_WithMissingEmail_Returns400 | PASSED | Email required |
| login_WithMissingPassword_Returns400 | PASSED | Password required |
| login_ResponseContainsToken | PASSED | Token in response |
| login_ResponseContainsUserDetails | PASSED | User data in response |

### 5. Sweet Controller Integration Tests (28 tests)

| Test Name | Status | Description |
|-----------|--------|-------------|
| getAllSweets_Returns200WithList | PASSED | List endpoint works |
| getAllSweets_ReturnsPaginatedResults | PASSED | Pagination works |
| getSweetById_WithValidId_Returns200 | PASSED | Single item retrieval |
| getSweetById_WithInvalidId_Returns404 | PASSED | Not found handled |
| searchSweets_WithNameFilter_ReturnsMatches | PASSED | Name search works |
| searchSweets_WithCategoryFilter_ReturnsMatches | PASSED | Category filter works |
| searchSweets_WithPriceFilter_ReturnsMatches | PASSED | Price range works |
| createSweet_AsAdmin_Returns201 | PASSED | Admin can create |
| createSweet_AsUser_Returns403 | PASSED | User cannot create |
| createSweet_Unauthenticated_Returns401 | PASSED | Auth required |
| createSweet_WithInvalidData_Returns400 | PASSED | Validation works |
| updateSweet_AsAdmin_Returns200 | PASSED | Admin can update |
| updateSweet_AsUser_Returns403 | PASSED | User cannot update |
| updateSweet_WithInvalidId_Returns404 | PASSED | Not found handled |
| deleteSweet_AsAdmin_Returns204 | PASSED | Admin can delete |
| deleteSweet_AsUser_Returns403 | PASSED | User cannot delete |
| deleteSweet_WithInvalidId_Returns404 | PASSED | Not found handled |
| purchaseSweet_AsUser_Returns200 | PASSED | User can purchase |
| purchaseSweet_AsAdmin_Returns200 | PASSED | Admin can purchase |
| purchaseSweet_Unauthenticated_Returns401 | PASSED | Auth required |
| purchaseSweet_InsufficientStock_Returns400 | PASSED | Stock validated |
| purchaseSweet_InvalidQuantity_Returns400 | PASSED | Quantity validated |
| restockSweet_AsAdmin_Returns200 | PASSED | Admin can restock |
| restockSweet_AsUser_Returns403 | PASSED | User cannot restock |
| restockSweet_Unauthenticated_Returns401 | PASSED | Auth required |
| restockSweet_InvalidQuantity_Returns400 | PASSED | Quantity validated |
| restockSweet_WithInvalidId_Returns404 | PASSED | Not found handled |
| purchaseSweet_DecreasesQuantityCorrectly | PASSED | Stock math correct |

### 6. Repository Tests (18 tests)

| Test Name | Status | Description |
|-----------|--------|-------------|
| UserRepository_findByEmail_ReturnsUser | PASSED | Email lookup works |
| UserRepository_findByEmail_ReturnsEmpty | PASSED | Missing user handled |
| UserRepository_existsByEmail_ReturnsTrue | PASSED | Exists check works |
| UserRepository_existsByEmail_ReturnsFalse | PASSED | Non-existent handled |
| UserRepository_save_PersistsUser | PASSED | User saved correctly |
| UserRepository_save_GeneratesId | PASSED | UUID generated |
| SweetRepository_findAll_ReturnsSweets | PASSED | List retrieval works |
| SweetRepository_findById_ReturnsSweet | PASSED | Single retrieval works |
| SweetRepository_save_PersistsSweet | PASSED | Sweet saved correctly |
| SweetRepository_delete_RemovesSweet | PASSED | Deletion works |
| SweetRepository_findByCategory_ReturnsMatches | PASSED | Category query works |
| SweetRepository_findByNameContaining_ReturnsMatches | PASSED | Name search works |
| SweetRepository_findByPriceBetween_ReturnsMatches | PASSED | Price range works |
| SweetRepository_existsByName_ReturnsTrue | PASSED | Name exists check |
| SweetRepository_existsByName_ReturnsFalse | PASSED | Name not exists |
| SweetRepository_count_ReturnsCorrectCount | PASSED | Count works |
| SweetRepository_findAll_WithPageable_Works | PASSED | Pagination works |
| SweetRepository_findAll_WithSort_Works | PASSED | Sorting works |

### 7. Security Configuration Tests (10 tests)

| Test Name | Status | Description |
|-----------|--------|-------------|
| publicEndpoints_AccessibleWithoutAuth | PASSED | Public routes open |
| protectedEndpoints_RequireAuth | PASSED | Protected routes secured |
| adminEndpoints_RequireAdminRole | PASSED | Admin routes restricted |
| corsConfiguration_AllowsConfiguredOrigins | PASSED | CORS configured |
| jwtFilter_ValidToken_SetsAuthentication | PASSED | Token auth works |
| jwtFilter_InvalidToken_RejectsRequest | PASSED | Bad tokens rejected |
| jwtFilter_MissingToken_AllowsPublicEndpoints | PASSED | Public still works |
| passwordEncoder_UsesBCrypt | PASSED | BCrypt configured |
| sessionManagement_IsStateless | PASSED | No sessions stored |
| csrfProtection_IsDisabled | PASSED | CSRF disabled for API |

### 8. Application Context Test (1 test)

| Test Name | Status | Description |
|-----------|--------|-------------|
| contextLoads | PASSED | Application starts correctly |

## Test Execution Command

```bash
cd backend
mvn clean test
```

## Coverage Report Generation

```bash
mvn test jacoco:report
# Report available at: target/site/jacoco/index.html
```

## Notes

- All tests use an in-memory H2 database for isolation
- Integration tests use MockMvc for HTTP simulation
- Security tests verify both authentication and authorization
- Repository tests verify JPA query methods
- Service tests mock dependencies for unit isolation
