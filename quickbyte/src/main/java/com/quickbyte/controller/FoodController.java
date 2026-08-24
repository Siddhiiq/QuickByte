package com.quickbyte.controller;

import com.quickbyte.dto.Request.FoodRequest;
import com.quickbyte.dto.Response.FoodResponse;
import com.quickbyte.service.FoodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/v1/foods")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;

    @PostMapping
    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @ResponseStatus(HttpStatus.CREATED)
    public FoodResponse createFood(
            @Valid @RequestBody FoodRequest request) {

        return foodService.createFood(request);
    }

    @GetMapping("/{foodId}")
    public FoodResponse getFoodById(
            @PathVariable Long foodId) {

        return foodService.getFoodById(foodId);
    }

    @GetMapping
    public Page<FoodResponse> getFoodsByCategory(

            @RequestParam Long categoryId,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(defaultValue = "name")
            String sortBy) {

        return foodService.getFoodsByCategory(
                categoryId,
                page,
                size,
                sortBy);
    }

    @GetMapping("/search")
    public Page<FoodResponse> searchFoods(

            @RequestParam String keyword,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size) {

        return foodService.searchFoods(
                keyword,
                page,
                size);
    }

    @PutMapping("/{foodId}")
    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    public FoodResponse updateFood(
            @PathVariable Long foodId,
            @Valid @RequestBody FoodRequest request) {

        return foodService.updateFood(foodId, request);
    }

    @DeleteMapping("/{foodId}")
    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFood(
            @PathVariable Long foodId) {

        foodService.deleteFood(foodId);
    }

}