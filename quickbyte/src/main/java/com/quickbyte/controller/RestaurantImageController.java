package com.quickbyte.controller;

import com.quickbyte.dto.Request.RestaurantImageRequest;
import com.quickbyte.dto.Response.RestaurantImageResponse;
import com.quickbyte.service.RestaurantImageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/restaurant-images")
@RequiredArgsConstructor
public class RestaurantImageController {

    private final RestaurantImageService imageService;

    @PostMapping
    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @ResponseStatus(HttpStatus.CREATED)
    public RestaurantImageResponse addImage(
            @Valid
            @RequestBody
            RestaurantImageRequest request) {

        return imageService.addImage(request);
    }

    @GetMapping("/{imageId}")
    public RestaurantImageResponse getImage(
            @PathVariable Long imageId) {

        return imageService.getImageById(imageId);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public List<RestaurantImageResponse>
    getRestaurantImages(
            @PathVariable Long restaurantId) {

        return imageService
                .getImagesByRestaurant(restaurantId);
    }

    @PutMapping("/{imageId}")
    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    public RestaurantImageResponse updateImage(
            @PathVariable Long imageId,
            @Valid
            @RequestBody
            RestaurantImageRequest request) {

        return imageService.updateImage(
                imageId,
                request);
    }

    @DeleteMapping("/{imageId}")
    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteImage(
            @PathVariable Long imageId) {

        imageService.deleteImage(imageId);
    }
}