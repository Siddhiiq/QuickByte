package com.quickbyte.repository;

import com.quickbyte.entity.Food.FoodVariant;
import com.quickbyte.enums.VariantType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodVariantRepository
        extends JpaRepository<FoodVariant, Long> {

    boolean existsByFoodIdAndVariantType(
            Long foodId,
            VariantType variantType
    );

    List<FoodVariant> findByFoodId(Long foodId);

}