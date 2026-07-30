package com.quickbyte.repository;

import com.quickbyte.entity.Restaurant.Restaurant;
import com.quickbyte.entity.Restaurant.RestaurantTiming;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.List;

public interface RestaurantTimingRepository
        extends JpaRepository<RestaurantTiming, Long> {

    List<RestaurantTiming> findByRestaurant(Restaurant restaurant);

    List<RestaurantTiming> findByRestaurantAndDayOfWeek(
            Restaurant restaurant,
            DayOfWeek dayOfWeek
    );

}