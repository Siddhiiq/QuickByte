package com.quickbyte.controller;

import com.quickbyte.dto.Request.CategoryRequest;
import com.quickbyte.dto.Response.CategoryResponse;
import com.quickbyte.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * Create Category
     */
    @PostMapping
    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse createCategory(
            @Valid @RequestBody CategoryRequest request) {

        return categoryService.createCategory(request);
    }

    /**
     * Get Category By Id
     */
    @GetMapping("/{categoryId}")
    public CategoryResponse getCategoryById(
            @PathVariable Long categoryId) {

        return categoryService.getCategoryById(categoryId);
    }

    /**
     * Get All Categories of Restaurant
     */
    @GetMapping
    public Page<CategoryResponse> getAllCategories(

            @RequestParam Long restaurantId,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(defaultValue = "displayOrder")
            String sortBy) {

        return categoryService.getAllCategories(
                restaurantId,
                page,
                size,
                sortBy
        );
    }

    /**
     * Search Category
     */
    @GetMapping("/search")
    public Page<CategoryResponse> searchCategories(

            @RequestParam Long restaurantId,

            @RequestParam String keyword,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size) {

        return categoryService.searchCategories(
                restaurantId,
                keyword,
                page,
                size
        );
    }

    /**
     * Update Category
     */
    @PutMapping("/{categoryId}")
    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    public CategoryResponse updateCategory(

            @PathVariable Long categoryId,

            @Valid
            @RequestBody
            CategoryRequest request) {

        return categoryService.updateCategory(
                categoryId,
                request
        );
    }

    /**
     * Delete Category
     */
    @DeleteMapping("/{categoryId}")
    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(
            @PathVariable Long categoryId) {

        categoryService.deleteCategory(categoryId);
    }
}