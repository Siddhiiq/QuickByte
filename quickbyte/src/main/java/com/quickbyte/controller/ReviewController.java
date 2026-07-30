package com.quickbyte.controller;

import com.quickbyte.dto.Request.ReviewRequest;
import com.quickbyte.dto.Response.ReviewResponse;
import com.quickbyte.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewResponse addReview(
            @Valid @RequestBody ReviewRequest request) {

        return reviewService.addReview(request);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public List<ReviewResponse> getRestaurantReviews(
            @PathVariable Long restaurantId) {

        return reviewService.getRestaurantReviews(restaurantId);
    }

    @GetMapping("/food/{foodId}")
    public List<ReviewResponse> getFoodReviews(
            @PathVariable Long foodId) {

        return reviewService.getFoodReviews(foodId);
    }

    @GetMapping("/customer/{customerId}")
    public List<ReviewResponse> getCustomerReviews(
            @PathVariable Long customerId) {

        return reviewService.getCustomerReviews(customerId);
    }

    @DeleteMapping("/{reviewId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReview(
            @PathVariable Long reviewId) {

        reviewService.deleteReview(reviewId);
    }
}