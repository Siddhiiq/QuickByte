package com.quickbyte.controller;

import com.quickbyte.dto.Request.FoodAddonRequest;
import com.quickbyte.dto.Response.FoodAddonResponse;
import com.quickbyte.service.FoodAddonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/food-addons")
@RequiredArgsConstructor
public class FoodAddonController {

    private final FoodAddonService foodAddonService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FoodAddonResponse createAddon(
            @Valid
            @RequestBody
            FoodAddonRequest request) {

        return foodAddonService.createAddon(request);
    }

    @GetMapping("/{id}")
    public FoodAddonResponse getAddon(
            @PathVariable Long id) {

        return foodAddonService.getAddonById(id);
    }

    @GetMapping("/food/{foodId}")
    public List<FoodAddonResponse> getFoodAddons(
            @PathVariable Long foodId) {

        return foodAddonService.getAddonsByFood(foodId);
    }

    @PutMapping("/{id}")
    public FoodAddonResponse updateAddon(
            @PathVariable Long id,
            @Valid
            @RequestBody
            FoodAddonRequest request) {

        return foodAddonService.updateAddon(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAddon(
            @PathVariable Long id) {

        foodAddonService.deleteAddon(id);
    }
}