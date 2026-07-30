package com.quickbyte.mapper;

import com.quickbyte.dto.Request.CategoryRequest;
import com.quickbyte.dto.Response.CategoryResponse;
import com.quickbyte.entity.Category.Category;
import com.quickbyte.entity.Restaurant.Restaurant;

public class CategoryMapper {

    private CategoryMapper() {
    }

    public static Category toEntity(
            CategoryRequest request,
            Restaurant restaurant) {

        return Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .displayOrder(request.getDisplayOrder())
                .restaurant(restaurant)
                .build();
    }

    public static CategoryResponse toResponse(
            Category category) {

        return CategoryResponse.builder()
                .id(category.getId())
                .restaurantId(category.getRestaurant().getId())
                .restaurantName(category.getRestaurant().getName())
                .name(category.getName())
                .description(category.getDescription())
                .displayOrder(category.getDisplayOrder())
                .status(category.getStatus())
                .build();
    }

}