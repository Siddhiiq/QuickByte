package com.quickbyte.mapper;

import com.quickbyte.dto.FoodRequest;
import com.quickbyte.dto.FoodResponse;
import com.quickbyte.entity.Category.Category;
import com.quickbyte.entity.Food.Food;

public class FoodMapper {

    private FoodMapper() {
    }

    public static Food toEntity(
            FoodRequest request,
            Category category) {

        return Food.builder()
                .name(request.getName())
                .description(request.getDescription())
                .foodType(request.getFoodType())
                .preparationTime(request.getPreparationTime())
                .bestSeller(request.getBestSeller())
                .recommended(request.getRecommended())
                .category(category)
                .build();
    }

    public static FoodResponse toResponse(Food food) {

        return FoodResponse.builder()
                .id(food.getId())
                .name(food.getName())
                .description(food.getDescription())
                .foodType(food.getFoodType())
                .preparationTime(food.getPreparationTime())
                .bestSeller(food.getBestSeller())
                .recommended(food.getRecommended())
                .averageRating(food.getAverageRating())
                .totalReviews(food.getTotalReviews())
                .status(food.getStatus())
                .categoryId(food.getCategory().getId())
                .categoryName(food.getCategory().getName())
                .build();
    }

}