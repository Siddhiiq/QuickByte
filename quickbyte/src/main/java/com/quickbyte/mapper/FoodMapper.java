package com.quickbyte.mapper;

import com.quickbyte.dto.Request.FoodRequest;
import com.quickbyte.dto.Response.FoodResponse;
import com.quickbyte.entity.Category.Category;
import com.quickbyte.entity.Food.Food;
import com.quickbyte.entity.Food.FoodImage;

import java.util.Comparator;

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
                .price(request.getPrice())
                .category(category)
                .build();
    }

    public static FoodResponse toResponse(Food food) {

        String imageUrl = null;

        if (food.getImages() != null &&
                !food.getImages().isEmpty()) {

            /*
             * First preference:
             * Image marked as thumbnail
             */
            imageUrl = food.getImages()
                    .stream()
                    .filter(image ->
                            Boolean.TRUE.equals(
                                    image.getThumbnail()))
                    .min(Comparator.comparing(
                            FoodImage::getDisplayOrder))
                    .map(FoodImage::getImageUrl)
                    .orElse(null);

            /*
             * If no thumbnail exists,
             * use the first image based on display order
             */
            if (imageUrl == null) {

                imageUrl = food.getImages()
                        .stream()
                        .min(Comparator.comparing(
                                FoodImage::getDisplayOrder))
                        .map(FoodImage::getImageUrl)
                        .orElse(null);
            }
        }

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
                .price(food.getPrice())
                .imageUrl(imageUrl)
                .build();
    }
}