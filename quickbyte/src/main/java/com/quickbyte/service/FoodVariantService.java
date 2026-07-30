package com.quickbyte.service;

import com.quickbyte.dto.Request.FoodVariantRequest;
import com.quickbyte.dto.Response.FoodVariantResponse;

import java.util.List;

public interface FoodVariantService {

    FoodVariantResponse createVariant(
            FoodVariantRequest request);

    FoodVariantResponse updateVariant(
            Long variantId,
            FoodVariantRequest request);

    FoodVariantResponse getVariant(
            Long variantId);

    List<FoodVariantResponse> getVariantsByFood(
            Long foodId);

    void deleteVariant(
            Long variantId);

}