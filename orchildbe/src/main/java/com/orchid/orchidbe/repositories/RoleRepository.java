package com.orchid.orchidbe.repositories;

import com.orchid.orchidbe.pojos.Role;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends MongoRepository<Role, String> {
    boolean existsByName(String name);

    Optional<Role> findByName(String name);
}
