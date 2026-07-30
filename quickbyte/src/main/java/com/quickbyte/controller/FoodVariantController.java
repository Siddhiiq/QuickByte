package com.quickbyte.controller;

import com.quickbyte.dto.Request.FoodVariantRequest;
import com.quickbyte.dto.Response.FoodVariantResponse;
import com.quickbyte.service.FoodVariantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/food-variants")
@RequiredArgsConstructor
public class FoodVariantController {

    private final FoodVariantService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FoodVariantResponse create(
            @Valid @RequestBody FoodVariantRequest request) {

        return service.createVariant(request);
    }

    @PutMapping("/{id}")
    public FoodVariantResponse update(
            @PathVariable Long id,
            @Valid @RequestBody FoodVariantRequest request) {

        return service.updateVariant(id, request);
    }

    @GetMapping("/{id}")
    public FoodVariantResponse get(
            @PathVariable Long id) {

        return service.getVariant(id);
    }

    @GetMapping("/food/{foodId}")
    public List<FoodVariantResponse> getByFood(
            @PathVariable Long foodId) {

        return service.getVariantsByFood(foodId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long id) {

        service.deleteVariant(id);
    }

}