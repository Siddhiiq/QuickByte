package com.quickbyte.repository;

import com.quickbyte.entity.Review.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository
        extends JpaRepository<Review, Long> {

    List<Review> findByRestaurantId(Long restaurantId);

    List<Review> findByFoodId(Long foodId);

    List<Review> findByCustomerId(Long customerId);

}