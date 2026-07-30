package com.quickbyte.repository;

import com.quickbyte.entity.Restaurant.Restaurant;
import com.quickbyte.entity.Restaurant.RestaurantImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RestaurantImageRepository
        extends JpaRepository<RestaurantImage, Long> {

    List<RestaurantImage> findByRestaurant(Restaurant restaurant);

    List<RestaurantImage> findByRestaurantOrderByDisplayOrder(
            Restaurant restaurant
    );

}