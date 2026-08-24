package com.quickbyte.mapper;

import com.quickbyte.dto.Request.RestaurantImageRequest;
import com.quickbyte.dto.Response.RestaurantImageResponse;
import com.quickbyte.entity.Restaurant.Restaurant;
import com.quickbyte.entity.Restaurant.RestaurantImage;

public class RestaurantImageMapper {

    private RestaurantImageMapper() {
    }

    public static RestaurantImage toEntity(
            RestaurantImageRequest request,
            Restaurant restaurant) {

        return RestaurantImage.builder()
                .restaurant(restaurant)
                .imageUrl(request.getImageUrl())
                .thumbnail(request.getThumbnail())
                .displayOrder(request.getDisplayOrder())
                .build();
    }

    public static RestaurantImageResponse toResponse(
            RestaurantImage image) {

        return RestaurantImageResponse.builder()
                .id(image.getId())
                .restaurantId(image.getRestaurant().getId())
                .restaurantName(image.getRestaurant().getName())
                .imageUrl(image.getImageUrl())
                .thumbnail(image.getThumbnail())
                .displayOrder(image.getDisplayOrder())
                .build();
    }
}