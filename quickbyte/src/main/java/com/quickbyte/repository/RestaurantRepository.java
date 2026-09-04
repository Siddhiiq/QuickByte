package com.quickbyte.repository;

import com.quickbyte.entity.Restaurant.Restaurant;
import com.quickbyte.entity.User.Users;
import com.quickbyte.enums.RestaurantStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RestaurantRepository
        extends JpaRepository<Restaurant, Long> {

    Optional<Restaurant> findByEmail(String email);

    Optional<Restaurant> findByPhoneNumber(String phoneNumber);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    List<Restaurant> findByOwner(Users owner);

    List<Restaurant> findByOwner_Email(String email);

    Page<Restaurant> findByStatus(
            RestaurantStatus status,
            Pageable pageable
    );

    Page<Restaurant> findByNameContainingIgnoreCase(
            String keyword,
            Pageable pageable
    );
}