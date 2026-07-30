package com.quickbyte.mapper;

import com.quickbyte.dto.Request.FoodVariantRequest;
import com.quickbyte.dto.Response.FoodVariantResponse;
import com.quickbyte.entity.Food.Food;
import com.quickbyte.entity.Food.FoodVariant;

public class FoodVariantMapper {

    private FoodVariantMapper() {}

    public static FoodVariant toEntity(
            FoodVariantRequest request,
            Food food) {

        return FoodVariant.builder()
                .food(food)
                .variantType(request.getVariantType())
                .price(request.getPrice())
                .stock(request.getStock())
                .build();

    }

    public static FoodVariantResponse toResponse(
            FoodVariant variant) {

        return FoodVariantResponse.builder()
                .id(variant.getId())
                .foodId(variant.getFood().getId())
                .foodName(variant.getFood().getName())
                .variantType(variant.getVariantType())
                .price(variant.getPrice())
                .stock(variant.getStock())
                .available(variant.getAvailable())
                .build();

    }

}