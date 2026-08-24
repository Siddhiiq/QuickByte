package com.quickbyte.service.impl;

import com.quickbyte.dto.Request.FoodVariantRequest;
import com.quickbyte.dto.Response.FoodVariantResponse;
import com.quickbyte.entity.Food.Food;
import com.quickbyte.entity.Food.FoodVariant;
import com.quickbyte.exception.ResourceAlreadyExistsException;
import com.quickbyte.exception.ResourceNotFoundException;
import com.quickbyte.mapper.FoodVariantMapper;
import com.quickbyte.repository.FoodRepository;
import com.quickbyte.repository.FoodVariantRepository;
import com.quickbyte.service.FoodVariantService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FoodVariantServiceImpl
        implements FoodVariantService {

    private final FoodRepository foodRepository;

    private final FoodVariantRepository variantRepository;

    @Override
    public FoodVariantResponse createVariant(
            FoodVariantRequest request) {

        Food food = foodRepository.findById(request.getFoodId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Food not found"));

        if (variantRepository.existsByFoodIdAndVariantType(
                request.getFoodId(),
                request.getVariantType())) {

            throw new ResourceAlreadyExistsException(
                    "Variant already exists");
        }

        FoodVariant variant =
                FoodVariantMapper.toEntity(request, food);

        return FoodVariantMapper.toResponse(
                variantRepository.save(variant));

    }

    @Override
    public FoodVariantResponse updateVariant(
            Long variantId,
            FoodVariantRequest request) {

        FoodVariant variant =
                variantRepository.findById(variantId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Variant not found"));

        boolean variantTypeChanged =
                variant.getVariantType()
                        != request.getVariantType();

        if (variantTypeChanged &&
                variantRepository.existsByFoodIdAndVariantType(
                        variant.getFood().getId(),
                        request.getVariantType())) {

            throw new ResourceAlreadyExistsException(
                    "Variant already exists for this food");
        }

        variant.setVariantType(request.getVariantType());
        variant.setPrice(request.getPrice());
        variant.setStock(request.getStock());
        variant.setAvailable(request.getStock() > 0);

        return FoodVariantMapper.toResponse(
                variantRepository.save(variant));
    }

    @Override
    public FoodVariantResponse getVariant(
            Long variantId) {

        return FoodVariantMapper.toResponse(
                variantRepository.findById(variantId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Variant not found")));
    }

    @Override
    public List<FoodVariantResponse> getVariantsByFood(
            Long foodId) {

        return variantRepository
                .findByFoodId(foodId)
                .stream()
                .map(FoodVariantMapper::toResponse)
                .toList();

    }

    @Override
    public void deleteVariant(
            Long variantId) {

        FoodVariant variant =
                variantRepository.findById(variantId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Variant not found"));

        variantRepository.delete(variant);
    }

}