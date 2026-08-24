package com.quickbyte.service.impl;

import com.quickbyte.dto.Request.RestaurantImageRequest;
import com.quickbyte.dto.Response.RestaurantImageResponse;
import com.quickbyte.entity.Restaurant.Restaurant;
import com.quickbyte.entity.Restaurant.RestaurantImage;
import com.quickbyte.exception.ResourceNotFoundException;
import com.quickbyte.mapper.RestaurantImageMapper;
import com.quickbyte.repository.RestaurantImageRepository;
import com.quickbyte.repository.RestaurantRepository;
import com.quickbyte.service.RestaurantImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantImageServiceImpl
        implements RestaurantImageService {

    private final RestaurantImageRepository imageRepository;

    private final RestaurantRepository restaurantRepository;

    @Override
    public RestaurantImageResponse addImage(
            RestaurantImageRequest request) {

        Restaurant restaurant =
                restaurantRepository.findById(
                                request.getRestaurantId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Restaurant not found"));

        RestaurantImage image =
                RestaurantImageMapper.toEntity(
                        request,
                        restaurant);

        RestaurantImage saved =
                imageRepository.save(image);

        return RestaurantImageMapper.toResponse(saved);
    }

    @Override
    public RestaurantImageResponse getImageById(
            Long imageId) {

        RestaurantImage image =
                imageRepository.findById(imageId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Restaurant image not found"));

        return RestaurantImageMapper.toResponse(image);
    }

    @Override
    public List<RestaurantImageResponse>
    getImagesByRestaurant(Long restaurantId) {

        restaurantRepository.findById(restaurantId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Restaurant not found"));

        return imageRepository
                .findByRestaurantIdOrderByDisplayOrderAsc(
                        restaurantId)
                .stream()
                .map(RestaurantImageMapper::toResponse)
                .toList();
    }

    @Override
    public RestaurantImageResponse updateImage(
            Long imageId,
            RestaurantImageRequest request) {

        RestaurantImage image =
                imageRepository.findById(imageId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Restaurant image not found"));

        Restaurant restaurant =
                restaurantRepository.findById(
                                request.getRestaurantId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Restaurant not found"));

        image.setRestaurant(restaurant);
        image.setImageUrl(request.getImageUrl());
        image.setThumbnail(request.getThumbnail());
        image.setDisplayOrder(request.getDisplayOrder());

        RestaurantImage updated =
                imageRepository.save(image);

        return RestaurantImageMapper.toResponse(updated);
    }

    @Override
    public void deleteImage(
            Long imageId) {

        RestaurantImage image =
                imageRepository.findById(imageId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Restaurant image not found"));

        imageRepository.delete(image);
    }
}