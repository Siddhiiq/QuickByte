package com.quickbyte.repository;

import com.quickbyte.entity.Review.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository
        extends JpaRepository<Review, Long> {

    List<Review> findByRestaurantId(Long restaurantId);

    List<Review> findByFoodId(Long foodId);

    List<Review> findByCustomerId(Long customerId);

    boolean existsByCustomerIdAndFoodId(
            Long customerId,
            Long foodId
    );

    @Query("""
        SELECT AVG(r.rating)
        FROM Review r
        WHERE r.food.id = :foodId
        """)
    Double getAverageRatingByFoodId(Long foodId);

    long countByFoodId(Long foodId);



}