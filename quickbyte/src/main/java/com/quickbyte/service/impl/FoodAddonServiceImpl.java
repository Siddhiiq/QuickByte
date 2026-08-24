package com.quickbyte.service.impl;

import com.quickbyte.dto.Request.FoodAddonRequest;
import com.quickbyte.dto.Response.FoodAddonResponse;
import com.quickbyte.entity.Food.Food;
import com.quickbyte.entity.Food.FoodAddon;
import com.quickbyte.exception.ResourceNotFoundException;
import com.quickbyte.mapper.FoodAddonMapper;
import com.quickbyte.repository.FoodAddonRepository;
import com.quickbyte.repository.FoodRepository;
import com.quickbyte.service.FoodAddonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.quickbyte.exception.ResourceAlreadyExistsException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FoodAddonServiceImpl
        implements FoodAddonService {

    private final FoodRepository foodRepository;

    private final FoodAddonRepository addonRepository;

    @Override
    public FoodAddonResponse createAddon(
            FoodAddonRequest request) {

        Food food =
                foodRepository.findById(request.getFoodId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Food not found"));

        if (addonRepository.existsByFoodIdAndNameIgnoreCase(
                request.getFoodId(),
                request.getName())) {

            throw new ResourceAlreadyExistsException(
                    "Addon already exists for this food");
        }

        FoodAddon addon =
                FoodAddonMapper.toEntity(request, food);

        return FoodAddonMapper.toResponse(
                addonRepository.save(addon));
    }

    @Override
    public FoodAddonResponse updateAddon(
            Long addonId,
            FoodAddonRequest request) {

        FoodAddon addon =
                addonRepository.findById(addonId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Addon not found"));

        boolean nameChanged =
                !addon.getName()
                        .equalsIgnoreCase(request.getName());

        if (nameChanged &&
                addonRepository.existsByFoodIdAndNameIgnoreCase(
                        addon.getFood().getId(),
                        request.getName())) {

            throw new ResourceAlreadyExistsException(
                    "Addon already exists for this food");
        }

        addon.setName(request.getName());
        addon.setPrice(request.getPrice());
        addon.setAvailable(request.getAvailable());
        addon.setDisplayOrder(request.getDisplayOrder());

        return FoodAddonMapper.toResponse(
                addonRepository.save(addon));
    }

    @Override
    public FoodAddonResponse getAddonById(
            Long addonId) {

        return FoodAddonMapper.toResponse(

                addonRepository.findById(addonId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Addon not found"))

        );
    }

    @Override
    public List<FoodAddonResponse> getAddonsByFood(
            Long foodId) {

        return addonRepository
                .findByFoodIdOrderByDisplayOrder(foodId)
                .stream()
                .map(FoodAddonMapper::toResponse)
                .toList();
    }

    @Override
    public void deleteAddon(
            Long addonId) {

        FoodAddon addon =
                addonRepository.findById(addonId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Addon not found"));

        addonRepository.delete(addon);
    }
}