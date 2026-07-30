package com.quickbyte.mapper;

import com.quickbyte.dto.Response.ReviewResponse;
import com.quickbyte.entity.Review.Review;

public class ReviewMapper {

    private ReviewMapper() {
    }

    public static ReviewResponse toResponse(
            Review review) {

        return ReviewResponse.builder()
                .id(review.getId())
                .customerId(review.getCustomer().getId())
                .customerName(review.getCustomer().getFullName())
                .restaurantId(review.getRestaurant().getId())
                .restaurantName(review.getRestaurant().getName())
                .foodId(review.getFood().getId())
                .foodName(review.getFood().getName())
                .rating(review.getRating())
                .review(review.getReview())
                .build();
    }

}