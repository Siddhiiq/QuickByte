package com.quickbyte.repository;

import com.quickbyte.entity.Category.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository
        extends JpaRepository<Category, Long> {

    boolean existsByRestaurantIdAndNameIgnoreCase(
            Long restaurantId,
            String name
    );

    Page<Category> findByRestaurantId(
            Long restaurantId,
            Pageable pageable
    );

    Page<Category> findByRestaurantIdAndNameContainingIgnoreCase(
            Long restaurantId,
            String keyword,
            Pageable pageable
    );

}