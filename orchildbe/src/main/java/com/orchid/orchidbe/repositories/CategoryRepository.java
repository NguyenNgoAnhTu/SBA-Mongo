package com.orchid.orchidbe.repositories;

import com.orchid.orchidbe.pojos.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
    boolean existsByName(String name);
    boolean existsByNameAndIdNot(String name, String id);
    Optional<Category> findByName(String name);
}
