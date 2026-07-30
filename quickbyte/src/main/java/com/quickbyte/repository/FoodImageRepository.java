package com.quickbyte.repository;

import com.quickbyte.entity.Food.FoodImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodImageRepository
        extends JpaRepository<FoodImage,Long> {

    List<FoodImage> findByFoodIdOrderByDisplayOrderAsc(
            Long foodId
    );

}