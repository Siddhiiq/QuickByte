package com.quickbyte.controller;

import com.quickbyte.dto.Request.RestaurantTimingRequest;
import com.quickbyte.dto.Response.RestaurantTimingResponse;
import com.quickbyte.service.RestaurantTimingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/restaurant-timings")
@RequiredArgsConstructor
public class RestaurantTimingController {

    private final RestaurantTimingService timingService;

    @PostMapping
    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @ResponseStatus(HttpStatus.CREATED)
    public RestaurantTimingResponse createTiming(
            @Valid
            @RequestBody
            RestaurantTimingRequest request) {

        return timingService.createTiming(request);
    }

    @GetMapping("/{timingId}")
    public RestaurantTimingResponse getTiming(
            @PathVariable Long timingId) {

        return timingService.getTiming(timingId);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public List<RestaurantTimingResponse>
    getTimingsByRestaurant(
            @PathVariable Long restaurantId) {

        return timingService
                .getTimingsByRestaurant(restaurantId);
    }

    @PutMapping("/{timingId}")
    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    public RestaurantTimingResponse updateTiming(
            @PathVariable Long timingId,
            @Valid
            @RequestBody
            RestaurantTimingRequest request) {

        return timingService.updateTiming(
                timingId,
                request);
    }

    @DeleteMapping("/{timingId}")
    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTiming(
            @PathVariable Long timingId) {

        timingService.deleteTiming(timingId);
    }
}