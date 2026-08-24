package com.quickbyte.repository;

import com.quickbyte.entity.Food.FoodAddon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodAddonRepository
        extends JpaRepository<FoodAddon, Long> {
    boolean existsByFoodIdAndNameIgnoreCase(
            Long foodId,
            String name
    );
    List<FoodAddon> findByFoodIdOrderByDisplayOrder(Long foodId);

}