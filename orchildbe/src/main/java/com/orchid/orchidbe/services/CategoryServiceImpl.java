package com.orchid.orchidbe.services;

import com.orchid.orchidbe.dto.CategoryDto;
import com.orchid.orchidbe.pojos.Category;
import com.orchid.orchidbe.repositories.CategoryRepository;
import java.util.List;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryServiceImpl implements CategoryService {

    CategoryRepository categoryRepository;

    @Override
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    @Override
    public Category findById(String id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public Category save(CategoryDto.CategoryRequest categoryRequest) {
        if (categoryRepository.existsByName(categoryRequest.name())) {
            throw new IllegalArgumentException("Category with name " + categoryRequest.name() + " already exists");
        }

        Category newCategory = new Category();
        newCategory.setName(categoryRequest.name());

        return categoryRepository.save(newCategory);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public Category update(String id, CategoryDto.CategoryRequest categoryRequest) {
        Category existingCategory = findById(id);

        if (categoryRepository.existsByNameAndIdNot(categoryRequest.name(), id)) {
            throw new IllegalArgumentException("Category with name " + categoryRequest.name() + " already exists");
        }

        existingCategory.setName(categoryRequest.name());

        return categoryRepository.save(existingCategory);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(String id) {
        Category existingCategory = findById(id);
        categoryRepository.delete(existingCategory);
    }
}
