package com.quickbyte.service.impl;

import com.quickbyte.dto.Request.FoodRequest;
import com.quickbyte.dto.Response.FoodResponse;
import com.quickbyte.entity.Category.Category;
import com.quickbyte.entity.Food.Food;
import com.quickbyte.exception.ResourceAlreadyExistsException;
import com.quickbyte.exception.ResourceNotFoundException;
import com.quickbyte.mapper.FoodMapper;
import com.quickbyte.repository.CategoryRepository;
import com.quickbyte.repository.FoodRepository;
import com.quickbyte.service.FoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FoodServiceImpl implements FoodService {

    private final FoodRepository foodRepository;

    private final CategoryRepository categoryRepository;

    /**
     * Create Food
     */
    @Override
    public FoodResponse createFood(FoodRequest request) {

        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found"));

        if (foodRepository.existsByNameIgnoreCaseAndCategoryId(
                request.getName(),
                request.getCategoryId())) {

            throw new ResourceAlreadyExistsException(
                    "Food already exists in this category");
        }

        Food food = FoodMapper.toEntity(
                request,
                category);

        Food savedFood =
                foodRepository.save(food);

        return FoodMapper.toResponse(savedFood);
    }

    /**
     * Update Food
     */
    @Override
    public FoodResponse updateFood(
            Long foodId,
            FoodRequest request) {

        Food food = foodRepository
                .findById(foodId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Food not found"));

        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found"));

        boolean nameChanged =
                !food.getName()
                        .equalsIgnoreCase(request.getName());

        boolean duplicateExists =
                foodRepository
                        .existsByNameIgnoreCaseAndCategoryId(
                                request.getName(),
                                request.getCategoryId());

        if (nameChanged && duplicateExists) {

            throw new ResourceAlreadyExistsException(
                    "Food already exists in this category");
        }

        food.setName(request.getName());

        food.setDescription(
                request.getDescription());

        food.setFoodType(
                request.getFoodType());

        food.setPreparationTime(
                request.getPreparationTime());

        food.setBestSeller(
                request.getBestSeller());

        food.setRecommended(
                request.getRecommended());

        food.setPrice(
                request.getPrice());

        food.setCategory(category);

        Food updatedFood =
                foodRepository.save(food);

        return FoodMapper.toResponse(updatedFood);
    }

    /**
     * Get Food By ID
     */
    @Override
    public FoodResponse getFoodById(
            Long foodId) {

        Food food = foodRepository
                .findById(foodId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Food not found"));

        return FoodMapper.toResponse(food);
    }

    /**
     * Get Foods By Category
     */
    @Override
    public Page<FoodResponse> getFoodsByCategory(
            Long categoryId,
            int page,
            int size,
            String sortBy) {

        if (!categoryRepository.existsById(categoryId)) {

            throw new ResourceNotFoundException(
                    "Category not found");
        }

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by(sortBy));

        return foodRepository
                .findByCategoryId(
                        categoryId,
                        pageable)
                .map(FoodMapper::toResponse);
    }

    /**
     * Search Foods
     */
    @Override
    public Page<FoodResponse> searchFoods(
            String keyword,
            int page,
            int size) {

        Pageable pageable =
                PageRequest.of(
                        page,
                        size);

        return foodRepository
                .findByNameContainingIgnoreCase(
                        keyword,
                        pageable)
                .map(FoodMapper::toResponse);
    }

    /**
     * Delete Food
     */
    @Override
    public void deleteFood(
            Long foodId) {

        Food food = foodRepository
                .findById(foodId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Food not found"));

        foodRepository.delete(food);
    }
}