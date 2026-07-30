package com.quickbyte.service.impl;

import com.quickbyte.dto.Request.ReviewRequest;
import com.quickbyte.dto.Response.ReviewResponse;
import com.quickbyte.entity.Food.Food;
import com.quickbyte.entity.Restaurant.Restaurant;
import com.quickbyte.entity.Review.Review;
import com.quickbyte.entity.User.Users;
import com.quickbyte.exception.ResourceNotFoundException;
import com.quickbyte.mapper.ReviewMapper;
import com.quickbyte.repository.*;
import com.quickbyte.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final FoodRepository foodRepository;

    @Override
    public ReviewResponse addReview(ReviewRequest request) {

        Users customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        Food food = foodRepository.findById(request.getFoodId())
                .orElseThrow(() -> new ResourceNotFoundException("Food not found"));

        Review review = Review.builder()
                .customer(customer)
                .restaurant(restaurant)
                .food(food)
                .rating(request.getRating())
                .review(request.getReview())
                .build();

        Review saved = reviewRepository.save(review);

        return ReviewMapper.toResponse(saved);
    }

    @Override
    public List<ReviewResponse> getRestaurantReviews(Long restaurantId) {
        return reviewRepository.findByRestaurantId(restaurantId)
                .stream()
                .map(ReviewMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewResponse> getFoodReviews(Long foodId) {
        return reviewRepository.findByFoodId(foodId)
                .stream()
                .map(ReviewMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewResponse> getCustomerReviews(Long customerId) {
        return reviewRepository.findByCustomerId(customerId)
                .stream()
                .map(ReviewMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }
}