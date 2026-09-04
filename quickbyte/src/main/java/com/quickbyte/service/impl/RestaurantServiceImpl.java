package com.quickbyte.service.impl;

import com.quickbyte.dto.Request.RestaurantRequest;
import com.quickbyte.dto.Response.RestaurantResponse;
import com.quickbyte.entity.Restaurant.Restaurant;
import com.quickbyte.entity.Restaurant.RestaurantAddress;
import com.quickbyte.entity.User.Users;
import com.quickbyte.exception.ResourceAlreadyExistsException;
import com.quickbyte.exception.ResourceNotFoundException;
import com.quickbyte.mapper.RestaurantMapper;
import com.quickbyte.repository.RestaurantRepository;
import com.quickbyte.repository.UserRepository;
import com.quickbyte.security.SecurityUtils;
import com.quickbyte.service.RestaurantService;
import com.quickbyte.enums.RestaurantStatus;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.security.access.AccessDeniedException;

import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RestaurantServiceImpl
        implements RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;


    // =========================
    // CREATE RESTAURANT
    // =========================

    @Override
    @CacheEvict(
            value = "restaurants",
            allEntries = true
    )
    public RestaurantResponse createRestaurant(
            RestaurantRequest request) {

        if (restaurantRepository
                .existsByEmail(request.getEmail())) {

            throw new ResourceAlreadyExistsException(
                    "Restaurant email already exists"
            );
        }

        if (restaurantRepository
                .existsByPhoneNumber(
                        request.getPhoneNumber())) {

            throw new ResourceAlreadyExistsException(
                    "Restaurant phone already exists"
            );
        }

        String email =
                SecurityUtils.getCurrentUserEmail();

        Users owner =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Owner not found"
                                )
                        );

        Restaurant restaurant =
                RestaurantMapper.toEntity(request);

        // Assign the currently logged-in owner
        restaurant.setOwner(owner);

        Restaurant savedRestaurant =
                restaurantRepository.save(restaurant);

        log.info(
                "Restaurant created successfully. ID={}, Name={}",
                savedRestaurant.getId(),
                savedRestaurant.getName()
        );

        return RestaurantMapper
                .toResponse(savedRestaurant);
    }


    // =========================
    // GET MY RESTAURANTS
    // =========================

    @Override
    public List<RestaurantResponse> getMyRestaurants() {

        String email =
                SecurityUtils.getCurrentUserEmail();

        List<Restaurant> restaurants =
                restaurantRepository
                        .findByOwner_Email(email);

        if (restaurants.isEmpty()) {

            throw new ResourceNotFoundException(
                    "No restaurants found for current owner"
            );
        }

        return restaurants.stream()
                .map(RestaurantMapper::toResponse)
                .toList();
    }


    // =========================
    // UPDATE RESTAURANT
    // =========================

    @Override
    @CachePut(
            value = "restaurants",
            key = "#restaurantId"
    )
    public RestaurantResponse updateRestaurant(
            Long restaurantId,
            RestaurantRequest request) {

        Restaurant restaurant =
                restaurantRepository
                        .findById(restaurantId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Restaurant not found"
                                )
                        );

        String currentEmail =
                SecurityUtils.getCurrentUserEmail();

        // Check whether the current owner owns this restaurant
        if (!restaurant.getOwner()
                .getEmail()
                .equals(currentEmail)) {

            throw new AccessDeniedException(
                    "You are not allowed to modify this restaurant."
            );
        }

        // Check email uniqueness
        if (!restaurant.getEmail()
                .equalsIgnoreCase(request.getEmail())
                &&
                restaurantRepository
                        .existsByEmail(
                                request.getEmail())) {

            throw new ResourceAlreadyExistsException(
                    "Restaurant email already exists"
            );
        }

        // Check phone number uniqueness
        if (!restaurant.getPhoneNumber()
                .equals(request.getPhoneNumber())
                &&
                restaurantRepository
                        .existsByPhoneNumber(
                                request.getPhoneNumber())) {

            throw new ResourceAlreadyExistsException(
                    "Restaurant phone already exists"
            );
        }


        // =========================
        // UPDATE RESTAURANT DETAILS
        // =========================

        restaurant.setName(
                request.getName()
        );

        restaurant.setDescription(
                request.getDescription()
        );

        restaurant.setEmail(
                request.getEmail()
        );

        restaurant.setPhoneNumber(
                request.getPhoneNumber()
        );


        // =========================
        // UPDATE RESTAURANT ADDRESS
        // =========================

        RestaurantAddress address =
                restaurant.getAddress();

        address.setStreet(
                request.getStreet()
        );

        address.setArea(
                request.getArea()
        );

        address.setLandmark(
                request.getLandmark()
        );

        address.setCity(
                request.getCity()
        );

        address.setDistrict(
                request.getDistrict()
        );

        address.setState(
                request.getState()
        );

        address.setCountry(
                request.getCountry()
        );

        address.setPincode(
                request.getPincode()
        );

        address.setLatitude(
                request.getLatitude()
        );

        address.setLongitude(
                request.getLongitude()
        );


        Restaurant updated =
                restaurantRepository.save(restaurant);

        log.info(
                "Restaurant updated successfully. ID={}",
                updated.getId()
        );

        return RestaurantMapper
                .toResponse(updated);
    }


    // =========================
    // GET RESTAURANT BY ID
    // =========================

    @Override
    @Cacheable(
            value = "restaurants",
            key = "#restaurantId"
    )
    public RestaurantResponse getRestaurantById(
            Long restaurantId) {

        Restaurant restaurant =
                restaurantRepository
                        .findById(restaurantId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Restaurant not found"
                                )
                        );

        log.info(
                "Restaurant fetched. ID={}",
                restaurant.getId()
        );

        return RestaurantMapper
                .toResponse(restaurant);
    }


    // =========================
    // GET ALL RESTAURANTS
    // =========================

    @Override
    public Page<RestaurantResponse>
    getAllRestaurants(
            int page,
            int size,
            String sortBy) {

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by(sortBy)
                );

        return restaurantRepository
                .findAll(pageable)
                .map(RestaurantMapper::toResponse);
    }


    // =========================
    // SEARCH RESTAURANTS
    // =========================

    @Override
    public Page<RestaurantResponse>
    searchRestaurants(
            String keyword,
            int page,
            int size) {

        Pageable pageable =
                PageRequest.of(
                        page,
                        size
                );

        log.info(
                "Restaurant search performed. Keyword={}",
                keyword
        );

        return restaurantRepository
                .findByNameContainingIgnoreCase(
                        keyword,
                        pageable
                )
                .map(RestaurantMapper::toResponse);
    }

    // =========================
// ADMIN UPDATE RESTAURANT STATUS
// =========================

    @Override
    @CachePut(
            value = "restaurants",
            key = "#restaurantId"
    )
    public RestaurantResponse updateRestaurantStatus(
            Long restaurantId,
            RestaurantStatus status) {

        Restaurant restaurant =
                restaurantRepository
                        .findById(restaurantId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Restaurant not found"
                                )
                        );

        restaurant.setStatus(status);

        Restaurant updatedRestaurant =
                restaurantRepository.save(restaurant);

        log.info(
                "Restaurant status updated. ID={}, Status={}",
                updatedRestaurant.getId(),
                updatedRestaurant.getStatus()
        );

        return RestaurantMapper
                .toResponse(updatedRestaurant);
    }


    // =========================
    // DELETE RESTAURANT
    // =========================

    @Override
    @CacheEvict(
            value = "restaurants",
            key = "#restaurantId"
    )
    public void deleteRestaurant(
            Long restaurantId) {

        Restaurant restaurant =
                restaurantRepository
                        .findById(restaurantId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Restaurant not found"
                                )
                        );

        String currentEmail =
                SecurityUtils.getCurrentUserEmail();

        // Check whether the current owner owns this restaurant
        if (!restaurant.getOwner()
                .getEmail()
                .equals(currentEmail)) {

            throw new AccessDeniedException(
                    "You are not allowed to delete this restaurant."
            );
        }

        log.warn(
                "Restaurant deleted. ID={}",
                restaurant.getId()
        );

        restaurantRepository
                .delete(restaurant);
    }
}