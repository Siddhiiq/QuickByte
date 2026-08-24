package com.quickbyte.mapper;

import com.quickbyte.dto.Request.RestaurantTimingRequest;
import com.quickbyte.dto.Response.RestaurantTimingResponse;
import com.quickbyte.entity.Restaurant.Restaurant;
import com.quickbyte.entity.Restaurant.RestaurantTiming;

public class RestaurantTimingMapper {

    private RestaurantTimingMapper() {
    }

    public static RestaurantTiming toEntity(
            RestaurantTimingRequest request,
            Restaurant restaurant) {

        return RestaurantTiming.builder()
                .restaurant(restaurant)
                .dayOfWeek(request.getDayOfWeek())
                .openingTime(request.getOpeningTime())
                .closingTime(request.getClosingTime())
                .closed(request.getClosed())
                .build();
    }

    public static RestaurantTimingResponse toResponse(
            RestaurantTiming timing) {

        return RestaurantTimingResponse.builder()
                .id(timing.getId())
                .restaurantId(timing.getRestaurant().getId())
                .dayOfWeek(timing.getDayOfWeek())
                .openingTime(timing.getOpeningTime())
                .closingTime(timing.getClosingTime())
                .closed(timing.getClosed())
                .build();
    }
}