package com.quickbyte.service;

import com.quickbyte.dto.Request.RestaurantImageRequest;
import com.quickbyte.dto.Response.RestaurantImageResponse;

import java.util.List;

public interface RestaurantImageService {

    RestaurantImageResponse addImage(
            RestaurantImageRequest request);

    RestaurantImageResponse getImageById(
            Long imageId);

    List<RestaurantImageResponse> getImagesByRestaurant(
            Long restaurantId);

    RestaurantImageResponse updateImage(
            Long imageId,
            RestaurantImageRequest request);

    void deleteImage(
            Long imageId);
}