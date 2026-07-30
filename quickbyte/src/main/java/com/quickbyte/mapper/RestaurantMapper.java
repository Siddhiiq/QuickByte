package com.quickbyte.mapper;

import com.quickbyte.dto.Request.RestaurantRequest;
import com.quickbyte.dto.Response.RestaurantResponse;
import com.quickbyte.entity.Restaurant.Restaurant;
import com.quickbyte.entity.Restaurant.RestaurantAddress;

public class RestaurantMapper {

    private RestaurantMapper() {
    }

    public static Restaurant toEntity(RestaurantRequest request) {

        Restaurant restaurant = Restaurant.builder()
                .name(request.getName())
                .description(request.getDescription())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .build();

        RestaurantAddress address = RestaurantAddress.builder()
                .restaurant(restaurant)
                .street(request.getStreet())
                .area(request.getArea())
                .landmark(request.getLandmark())
                .city(request.getCity())
                .district(request.getDistrict())
                .state(request.getState())
                .country(request.getCountry())
                .pincode(request.getPincode())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .build();

        restaurant.setAddress(address);

        return restaurant;
    }

    public static RestaurantResponse toResponse(Restaurant restaurant) {

        RestaurantAddress address = restaurant.getAddress();

        return RestaurantResponse.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .description(restaurant.getDescription())
                .email(restaurant.getEmail())
                .phoneNumber(restaurant.getPhoneNumber())
                .status(restaurant.getStatus())

                .street(address.getStreet())
                .area(address.getArea())
                .landmark(address.getLandmark())
                .city(address.getCity())
                .district(address.getDistrict())
                .state(address.getState())
                .country(address.getCountry())
                .pincode(address.getPincode())
                .latitude(address.getLatitude())
                .longitude(address.getLongitude())
                .build();
    }
}