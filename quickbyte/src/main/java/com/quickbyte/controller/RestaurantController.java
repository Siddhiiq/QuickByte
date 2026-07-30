package com.quickbyte.controller;

import com.quickbyte.dto.Request.RestaurantRequest;
import com.quickbyte.dto.Response.RestaurantResponse;
import com.quickbyte.service.RestaurantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    /**
     * Create Restaurant
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RestaurantResponse createRestaurant(
            @Valid @RequestBody RestaurantRequest request) {

        return restaurantService.createRestaurant(request);
    }
    /**
     * Get Restaurant By Id
     */
    @GetMapping("/{restaurantId}")
    public RestaurantResponse getRestaurantById(
            @PathVariable Long restaurantId) {

        return restaurantService.getRestaurantById(restaurantId);
    }

    /**
     * Get All Restaurants
     */
    @GetMapping
    public Page<RestaurantResponse> getAllRestaurants(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(defaultValue = "name")
            String sortBy) {

        return restaurantService.getAllRestaurants(
                page,
                size,
                sortBy
        );
    }

    /**
     * Search Restaurants
     */
    @GetMapping("/search")
    public Page<RestaurantResponse> searchRestaurants(

            @RequestParam String keyword,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size) {

        return restaurantService.searchRestaurants(
                keyword,
                page,
                size
        );
    }

    /**
     * Update Restaurant
     */
    @PutMapping("/{restaurantId}")
    public RestaurantResponse updateRestaurant(

            @PathVariable Long restaurantId,

            @Valid
            @RequestBody
            RestaurantRequest request) {

        return restaurantService.updateRestaurant(
                restaurantId,
                request
        );
    }

    /**
     * Delete Restaurant
     */
    @DeleteMapping("/{restaurantId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRestaurant(
            @PathVariable Long restaurantId) {

        restaurantService.deleteRestaurant(
                restaurantId
        );
    }

}