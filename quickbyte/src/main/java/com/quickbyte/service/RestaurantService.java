package com.quickbyte.service;

import com.quickbyte.dto.Request.RestaurantRequest;
import com.quickbyte.dto.Response.RestaurantResponse;
import org.springframework.data.domain.Page;

public interface RestaurantService {

    RestaurantResponse createRestaurant(
            RestaurantRequest request);

    RestaurantResponse updateRestaurant(
            Long restaurantId,
            RestaurantRequest request
    );

    RestaurantResponse getRestaurantById(Long restaurantId);

    RestaurantResponse getMyRestaurant();

    Page<RestaurantResponse> getAllRestaurants(
            int page,
            int size,
            String sortBy
    );

    Page<RestaurantResponse> searchRestaurants(
            String keyword,
            int page,
            int size
    );

    void deleteRestaurant(Long restaurantId);

}