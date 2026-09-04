package com.quickbyte.service;

import com.quickbyte.dto.Request.RestaurantRequest;
import com.quickbyte.dto.Response.RestaurantResponse;
import org.springframework.data.domain.Page;
import com.quickbyte.enums.RestaurantStatus;
import java.util.List;

public interface RestaurantService {

    RestaurantResponse createRestaurant(
            RestaurantRequest request
    );

    RestaurantResponse updateRestaurant(
            Long restaurantId,
            RestaurantRequest request
    );

    RestaurantResponse getRestaurantById(
            Long restaurantId
    );

    List<RestaurantResponse> getMyRestaurants();

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

    RestaurantResponse updateRestaurantStatus(
            Long restaurantId,
            RestaurantStatus status
    );

    void deleteRestaurant(
            Long restaurantId
    );
}