package com.quickbyte.service.impl;

import com.quickbyte.dto.FoodRequest;
import com.quickbyte.dto.FoodResponse;
import com.quickbyte.entity.Category.Category;
import com.quickbyte.entity.Food.Food;
import com.quickbyte.exception.ResourceNotFoundException;
import com.quickbyte.mapper.FoodMapper;
import com.quickbyte.repository.CategoryRepository;
import com.quickbyte.repository.FoodRepository;
import com.quickbyte.service.FoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FoodServiceImpl implements FoodService {

    private final FoodRepository foodRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public FoodResponse createFood(FoodRequest request) {

        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found"));

        if (foodRepository.existsByNameIgnoreCaseAndCategoryId(
                request.getName(),
                request.getCategoryId())) {

            throw new ResourceNotFoundException(
                    "Food already exists in this category");
        }

        Food food = FoodMapper.toEntity(request, category);

        Food saved = foodRepository.save(food);

        return FoodMapper.toResponse(saved);
    }

    @Override
    public FoodResponse updateFood(
            Long foodId,
            FoodRequest request) {

        Food food = foodRepository.findById(foodId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Food not found"));

        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found"));

        food.setName(request.getName());
        food.setDescription(request.getDescription());
        food.setFoodType(request.getFoodType());
        food.setPreparationTime(request.getPreparationTime());
        food.setBestSeller(request.getBestSeller());
        food.setRecommended(request.getRecommended());
        food.setCategory(category);

        return FoodMapper.toResponse(foodRepository.save(food));
    }

    @Override
    public FoodResponse getFoodById(Long foodId) {

        Food food = foodRepository.findById(foodId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Food not found"));

        return FoodMapper.toResponse(food);
    }

    @Override
    public Page<FoodResponse> getFoodsByCategory(
            Long categoryId,
            int page,
            int size,
            String sortBy) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortBy));

        return foodRepository
                .findByCategoryId(categoryId, pageable)
                .map(FoodMapper::toResponse);
    }

    @Override
    public Page<FoodResponse> searchFoods(
            String keyword,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size);

        return foodRepository
                .findByNameContainingIgnoreCase(keyword, pageable)
                .map(FoodMapper::toResponse);
    }

    @Override
    public void deleteFood(Long foodId) {

        Food food = foodRepository.findById(foodId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Food not found"));

        foodRepository.delete(food);
    }

}