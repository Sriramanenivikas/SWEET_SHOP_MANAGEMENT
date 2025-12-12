package com.sweetshop.repository;

import com.sweetshop.entity.Sweet;
import com.sweetshop.enums.SweetCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Repository for Sweet entity operations with custom search queries.
 */
@Repository
public interface SweetRepository extends JpaRepository<Sweet, UUID>, JpaSpecificationExecutor<Sweet> {
    
    Page<Sweet> findByCategory(SweetCategory category, Pageable pageable);
    
    Page<Sweet> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    @Query("SELECT s FROM Sweet s WHERE " +
           "(:name IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:category IS NULL OR s.category = :category) AND " +
           "(:minPrice IS NULL OR s.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR s.price <= :maxPrice)")
    Page<Sweet> searchSweets(
            @Param("name") String name,
            @Param("category") SweetCategory category,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable);
}
