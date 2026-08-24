package com.quickbyte.service.impl;

import com.quickbyte.dto.Request.RestaurantTimingRequest;
import com.quickbyte.dto.Response.RestaurantTimingResponse;
import com.quickbyte.entity.Restaurant.Restaurant;
import com.quickbyte.entity.Restaurant.RestaurantTiming;
import com.quickbyte.exception.ResourceAlreadyExistsException;
import com.quickbyte.exception.ResourceNotFoundException;
import com.quickbyte.mapper.RestaurantTimingMapper;
import com.quickbyte.repository.RestaurantRepository;
import com.quickbyte.repository.RestaurantTimingRepository;
import com.quickbyte.service.RestaurantTimingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantTimingServiceImpl
        implements RestaurantTimingService {

    private final RestaurantTimingRepository timingRepository;

    private final RestaurantRepository restaurantRepository;

    @Override
    public RestaurantTimingResponse createTiming(
            RestaurantTimingRequest request) {

        Restaurant restaurant =
                restaurantRepository.findById(
                                request.getRestaurantId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Restaurant not found"));

        validateTiming(request);

        if (!timingRepository
                .findByRestaurantAndDayOfWeek(
                        restaurant,
                        request.getDayOfWeek())
                .isEmpty()) {

            throw new ResourceAlreadyExistsException(
                    "Timing already exists for this day");
        }

        RestaurantTiming timing =
                RestaurantTimingMapper.toEntity(
                        request,
                        restaurant);

        RestaurantTiming saved =
                timingRepository.save(timing);

        return RestaurantTimingMapper.toResponse(saved);
    }

    @Override
    public RestaurantTimingResponse getTiming(
            Long timingId) {

        RestaurantTiming timing =
                timingRepository.findById(timingId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Restaurant timing not found"));

        return RestaurantTimingMapper.toResponse(timing);
    }

    @Override
    public List<RestaurantTimingResponse>
    getTimingsByRestaurant(Long restaurantId) {

        Restaurant restaurant =
                restaurantRepository.findById(restaurantId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Restaurant not found"));

        return timingRepository
                .findByRestaurant(restaurant)
                .stream()
                .map(RestaurantTimingMapper::toResponse)
                .toList();
    }

    @Override
    public RestaurantTimingResponse updateTiming(
            Long timingId,
            RestaurantTimingRequest request) {

        RestaurantTiming timing =
                timingRepository.findById(timingId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Restaurant timing not found"));

        validateTiming(request);

        Restaurant restaurant =
                timing.getRestaurant();

        if (!timing.getDayOfWeek()
                .equals(request.getDayOfWeek())) {

            boolean exists =
                    !timingRepository
                            .findByRestaurantAndDayOfWeek(
                                    restaurant,
                                    request.getDayOfWeek())
                            .isEmpty();

            if (exists) {

                throw new ResourceAlreadyExistsException(
                        "Timing already exists for this day");
            }
        }

        timing.setDayOfWeek(request.getDayOfWeek());
        timing.setOpeningTime(request.getOpeningTime());
        timing.setClosingTime(request.getClosingTime());
        timing.setClosed(request.getClosed());

        RestaurantTiming updated =
                timingRepository.save(timing);

        return RestaurantTimingMapper.toResponse(updated);
    }

    @Override
    public void deleteTiming(
            Long timingId) {

        RestaurantTiming timing =
                timingRepository.findById(timingId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Restaurant timing not found"));

        timingRepository.delete(timing);
    }

    private void validateTiming(
            RestaurantTimingRequest request) {

        if (!request.getClosingTime()
                .isAfter(request.getOpeningTime())) {

            throw new IllegalArgumentException(
                    "Closing time must be after opening time");
        }
    }
}