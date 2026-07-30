package com.quickbyte.mapper;

import com.quickbyte.dto.Request.FoodAddonRequest;
import com.quickbyte.dto.Response.FoodAddonResponse;
import com.quickbyte.entity.Food.Food;
import com.quickbyte.entity.Food.FoodAddon;

public class FoodAddonMapper {

    private FoodAddonMapper() {
    }

    public static FoodAddon toEntity(
            FoodAddonRequest request,
            Food food) {

        return FoodAddon.builder()
                .food(food)
                .name(request.getName())
                .price(request.getPrice())
                .available(request.getAvailable())
                .displayOrder(request.getDisplayOrder())
                .build();
    }

    public static FoodAddonResponse toResponse(
            FoodAddon addon) {

        return FoodAddonResponse.builder()
                .id(addon.getId())
                .foodId(addon.getFood().getId())
                .foodName(addon.getFood().getName())
                .name(addon.getName())
                .price(addon.getPrice())
                .available(addon.getAvailable())
                .displayOrder(addon.getDisplayOrder())
                .build();
    }
}
