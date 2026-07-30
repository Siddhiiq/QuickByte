package com.quickbyte.repository;

import com.quickbyte.entity.Food.Food;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodRepository extends JpaRepository<Food, Long> {

    boolean existsByNameIgnoreCaseAndCategoryId(
            String name,
            Long categoryId
    );

    Page<Food> findByCategoryId(
            Long categoryId,
            Pageable pageable
    );

    Page<Food> findByNameContainingIgnoreCase(
            String keyword,
            Pageable pageable
    );

}