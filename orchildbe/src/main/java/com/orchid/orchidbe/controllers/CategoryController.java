package com.orchid.orchidbe.controllers;

import com.orchid.orchidbe.apis.ApiResponse;
import com.orchid.orchidbe.dto.CategoryDto;
import com.orchid.orchidbe.pojos.Category;
import com.orchid.orchidbe.services.CategoryService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryController {

    CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getCategories() {
        return ApiResponse.success(categoryService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> getCategoryById(@PathVariable String id) {
        return ApiResponse.success(categoryService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Category>> createCategory(
            @RequestBody @Valid CategoryDto.CategoryRequest categoryRequest) {

        return ApiResponse.created(categoryService.save(categoryRequest));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> updateCategory(
            @PathVariable String id,
            @RequestBody @Valid CategoryDto.CategoryRequest categoryRequest) {

        return ApiResponse.updated(categoryService.update(id, categoryRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteCategory(@PathVariable String id) {
        categoryService.delete(id);
        return ApiResponse.delete();
    }
}