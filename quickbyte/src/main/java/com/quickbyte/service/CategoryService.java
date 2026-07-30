package com.quickbyte.service;

import com.quickbyte.dto.Request.CategoryRequest;
import com.quickbyte.dto.Response.CategoryResponse;
import org.springframework.data.domain.Page;

public interface CategoryService {

    CategoryResponse createCategory(CategoryRequest request);

    CategoryResponse getCategoryById(Long categoryId);

    Page<CategoryResponse> getAllCategories(
            Long restaurantId,
            int page,
            int size,
            String sortBy
    );

    Page<CategoryResponse> searchCategories(
            Long restaurantId,
            String keyword,
            int page,
            int size
    );

    CategoryResponse updateCategory(
            Long categoryId,
            CategoryRequest request
    );

    void deleteCategory(Long categoryId);

}