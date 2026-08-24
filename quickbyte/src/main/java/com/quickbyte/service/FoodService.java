package com.quickbyte.service;

import com.quickbyte.dto.Request.FoodRequest;
import com.quickbyte.dto.Response.FoodResponse;
import org.springframework.data.domain.Page;

public interface FoodService {

    FoodResponse createFood(FoodRequest request);

    FoodResponse updateFood(
            Long foodId,
            FoodRequest request);

    FoodResponse getFoodById(Long foodId);

    Page<FoodResponse> getFoodsByCategory(
            Long categoryId,
            int page,
            int size,
            String sortBy);

    Page<FoodResponse> searchFoods(
            String keyword,
            int page,
            int size);

    void deleteFood(Long foodId);
}