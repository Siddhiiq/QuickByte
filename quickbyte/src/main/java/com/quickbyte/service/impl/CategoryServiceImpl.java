package com.quickbyte.service.impl;

import com.quickbyte.dto.Request.CategoryRequest;
import com.quickbyte.dto.Response.CategoryResponse;
import com.quickbyte.entity.Category.Category;
import com.quickbyte.entity.Restaurant.Restaurant;
import com.quickbyte.exception.ResourceAlreadyExistsException;
import com.quickbyte.exception.ResourceNotFoundException;
import com.quickbyte.mapper.CategoryMapper;
import com.quickbyte.repository.CategoryRepository;
import com.quickbyte.repository.RestaurantRepository;
import com.quickbyte.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    private final RestaurantRepository restaurantRepository;

    @Override
    public CategoryResponse createCategory(CategoryRequest request) {

        Restaurant restaurant =
                restaurantRepository.findById(request.getRestaurantId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Restaurant not found"));

        if (categoryRepository.existsByRestaurantIdAndNameIgnoreCase(
                restaurant.getId(),
                request.getName())) {

            throw new ResourceAlreadyExistsException(
                    "Category already exists for this restaurant");
        }

        Category category =
                CategoryMapper.toEntity(request, restaurant);

        Category saved =
                categoryRepository.save(category);

        return CategoryMapper.toResponse(saved);
    }

    @Override
    public CategoryResponse getCategoryById(Long categoryId) {

        Category category =
                categoryRepository.findById(categoryId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Category not found"));

        return CategoryMapper.toResponse(category);
    }

    @Override
    public Page<CategoryResponse> getAllCategories(
            Long restaurantId,
            int page,
            int size,
            String sortBy) {

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by(sortBy));

        return categoryRepository
                .findByRestaurantId(
                        restaurantId,
                        pageable)
                .map(CategoryMapper::toResponse);
    }

    @Override
    public Page<CategoryResponse> searchCategories(
            Long restaurantId,
            String keyword,
            int page,
            int size) {

        Pageable pageable =
                PageRequest.of(page, size);

        return categoryRepository
                .findByRestaurantIdAndNameContainingIgnoreCase(
                        restaurantId,
                        keyword,
                        pageable)
                .map(CategoryMapper::toResponse);
    }

    @Override
    public CategoryResponse updateCategory(
            Long categoryId,
            CategoryRequest request) {

        Category category =
                categoryRepository.findById(categoryId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Category not found"));

        if (!category.getName().equalsIgnoreCase(request.getName())
                && categoryRepository.existsByRestaurantIdAndNameIgnoreCase(
                category.getRestaurant().getId(),
                request.getName())) {

            throw new ResourceNotFoundException(
                    "Category name already exists");
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setDisplayOrder(request.getDisplayOrder());

        Category updated =
                categoryRepository.save(category);

        return CategoryMapper.toResponse(updated);
    }

    @Override
    public void deleteCategory(Long categoryId) {

        Category category =
                categoryRepository.findById(categoryId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Category not found"));

        categoryRepository.delete(category);
    }

}