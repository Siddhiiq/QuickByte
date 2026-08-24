package com.quickbyte.service;

import com.quickbyte.dto.Request.RestaurantTimingRequest;
import com.quickbyte.dto.Response.RestaurantTimingResponse;

import java.util.List;

public interface RestaurantTimingService {

    RestaurantTimingResponse createTiming(
            RestaurantTimingRequest request);

    RestaurantTimingResponse getTiming(
            Long timingId);

    List<RestaurantTimingResponse> getTimingsByRestaurant(
            Long restaurantId);

    RestaurantTimingResponse updateTiming(
            Long timingId,
            RestaurantTimingRequest request);

    void deleteTiming(
            Long timingId);
}