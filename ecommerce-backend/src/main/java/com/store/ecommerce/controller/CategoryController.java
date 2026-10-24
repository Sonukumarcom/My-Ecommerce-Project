package com.store.ecommerce.controller;

import com.store.ecommerce.dto.response.ApiResponse;
import com.store.ecommerce.entity.Category;
import com.store.ecommerce.exception.ResourceNotFoundException;
import com.store.ecommerce.repository.CategoryRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {

        List<Category> categories = categoryRepository.findAll()
                .stream()
                .filter(category -> Boolean.TRUE.equals(category.getIsActive()))
                .sorted(Comparator.comparing(
                        Category::getDisplayOrder,
                        Comparator.nullsLast(Comparator.naturalOrder())
                ))
                .toList();

        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<Category>> getCategoryBySlug(
            @PathVariable String slug
    ) {

        Category category = categoryRepository.findBySlug(slug)
                .filter(c -> Boolean.TRUE.equals(c.getIsActive()))
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found: " + slug)
                );

        return ResponseEntity.ok(ApiResponse.success(category));
    }
}