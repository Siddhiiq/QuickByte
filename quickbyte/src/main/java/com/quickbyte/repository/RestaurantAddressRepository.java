package com.quickbyte.repository;

import com.quickbyte.entity.Restaurant.RestaurantAddress;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantAddressRepository
        extends JpaRepository<RestaurantAddress, Long> {

}