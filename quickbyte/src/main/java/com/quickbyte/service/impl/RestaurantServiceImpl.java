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
import com.quickbyte.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepository restaurantRepository;

    private final UserRepository userRepository;

    @Override
    public RestaurantResponse createRestaurant(
            RestaurantRequest request) {

        if (restaurantRepository.existsByEmail(request.getEmail())) {

            throw new ResourceAlreadyExistsException(
                    "Restaurant email already exists");
        }

        if (restaurantRepository.existsByPhoneNumber(
                request.getPhoneNumber())) {

            throw new ResourceAlreadyExistsException(
                    "Restaurant phone already exists");
        }

        Users owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Owner not found"));

        Restaurant restaurant =
                RestaurantMapper.toEntity(request);

        restaurant.setOwner(owner);

        Restaurant savedRestaurant =
                restaurantRepository.save(restaurant);

        return RestaurantMapper.toResponse(savedRestaurant);
    }

    @Override
    public RestaurantResponse updateRestaurant(
            Long restaurantId,
            RestaurantRequest request) {

        Restaurant restaurant =
                restaurantRepository.findById(restaurantId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Restaurant not found"));

        restaurant.setName(request.getName());
        restaurant.setDescription(request.getDescription());
        restaurant.setEmail(request.getEmail());
        restaurant.setPhoneNumber(request.getPhoneNumber());

        RestaurantAddress address = restaurant.getAddress();

        address.setStreet(request.getStreet());
        address.setArea(request.getArea());
        address.setLandmark(request.getLandmark());
        address.setCity(request.getCity());
        address.setDistrict(request.getDistrict());
        address.setState(request.getState());
        address.setCountry(request.getCountry());
        address.setPincode(request.getPincode());
        address.setLatitude(request.getLatitude());
        address.setLongitude(request.getLongitude());

        Restaurant updated =
                restaurantRepository.save(restaurant);

        return RestaurantMapper.toResponse(updated);

    }

    @Override
    public RestaurantResponse getRestaurantById(
            Long restaurantId) {

        Restaurant restaurant =
                restaurantRepository.findById(restaurantId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Restaurant not found"));

        return RestaurantMapper.toResponse(restaurant);

    }

    @Override
    public Page<RestaurantResponse> getAllRestaurants(
            int page,
            int size,
            String sortBy) {

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by(sortBy));

        return restaurantRepository.findAll(pageable)
                .map(RestaurantMapper::toResponse);

    }

    @Override
    public Page<RestaurantResponse> searchRestaurants(
            String keyword,
            int page,
            int size) {

        Pageable pageable =
                PageRequest.of(page, size);

        return restaurantRepository
                .findByNameContainingIgnoreCase(
                        keyword,
                        pageable)
                .map(RestaurantMapper::toResponse);

    }

    @Override
    public void deleteRestaurant(
            Long restaurantId) {

        Restaurant restaurant =
                restaurantRepository.findById(restaurantId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Restaurant not found"));

        restaurantRepository.delete(restaurant);

    }

}