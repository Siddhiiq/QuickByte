package com.quickbyte.service;

import com.quickbyte.dto.Request.FoodImageRequest;
import com.quickbyte.dto.Response.FoodImageResponse;

import java.util.List;

public interface FoodImageService {

    FoodImageResponse addImage(
            FoodImageRequest request);

    List<FoodImageResponse> getImages(
            Long foodId);

    void deleteImage(
            Long imageId);

}