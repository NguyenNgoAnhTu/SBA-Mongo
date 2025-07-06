package com.orchid.orchidbe.services;

import com.orchid.orchidbe.dto.CategoryDto;
import com.orchid.orchidbe.pojos.Category;
import java.util.List;

public interface CategoryService {

    List<Category> findAll();
    Category findById(String id);
    Category save(CategoryDto.CategoryRequest categoryRequest);
    Category update(String id, CategoryDto.CategoryRequest categoryRequest);
    void delete(String id);
}
