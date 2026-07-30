package com.quickbyte.service;

import com.quickbyte.dto.Request.ReviewRequest;
import com.quickbyte.dto.Response.ReviewResponse;

import java.util.List;

public interface ReviewService {

    ReviewResponse addReview(
            ReviewRequest request);

    List<ReviewResponse> getRestaurantReviews(
            Long restaurantId);

    List<ReviewResponse> getFoodReviews(
            Long foodId);

    List<ReviewResponse> getCustomerReviews(
            Long customerId);

    void deleteReview(
            Long reviewId);

}