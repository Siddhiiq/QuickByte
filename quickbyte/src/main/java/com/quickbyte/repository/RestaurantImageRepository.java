package com.quickbyte.repository;

import com.quickbyte.entity.Restaurant.Restaurant;
import com.quickbyte.entity.Restaurant.RestaurantImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RestaurantImageRepository
        extends JpaRepository<RestaurantImage, Long> {

    List<RestaurantImage> findByRestaurantOrderByDisplayOrderAsc(
            Restaurant restaurant);

    List<RestaurantImage> findByRestaurantIdOrderByDisplayOrderAsc(
            Long restaurantId);
}