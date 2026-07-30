package com.quickbyte.service;

import com.quickbyte.dto.Request.FoodAddonRequest;
import com.quickbyte.dto.Response.FoodAddonResponse;

import java.util.List;

public interface FoodAddonService {

    FoodAddonResponse createAddon(
            FoodAddonRequest request);

    FoodAddonResponse updateAddon(
            Long addonId,
            FoodAddonRequest request);

    FoodAddonResponse getAddonById(
            Long addonId);

    List<FoodAddonResponse> getAddonsByFood(
            Long foodId);

    void deleteAddon(
            Long addonId);
}