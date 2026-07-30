package com.quickbyte.mapper;

import com.quickbyte.dto.Request.FoodImageRequest;
import com.quickbyte.dto.Response.FoodImageResponse;
import com.quickbyte.entity.Food.Food;
import com.quickbyte.entity.Food.FoodImage;

public class FoodImageMapper {

    private FoodImageMapper(){}

    public static FoodImage toEntity(
            FoodImageRequest request,
            Food food){

        return FoodImage.builder()
                .food(food)
                .imageUrl(request.getImageUrl())
                .imageUrl(request.getImageUrl())
                .thumbnail(request.getThumbnail())
                .displayOrder(request.getDisplayOrder())
                .build();

    }

    public static FoodImageResponse toResponse(
            FoodImage image){

        return FoodImageResponse.builder()
                .id(image.getId())
                .foodId(image.getFood().getId())
                .foodName(image.getFood().getName())
                .imageUrl(image.getImageUrl())
                .thumbnail(image.getThumbnail())
                .displayOrder(image.getDisplayOrder())
                .build();

    }

}