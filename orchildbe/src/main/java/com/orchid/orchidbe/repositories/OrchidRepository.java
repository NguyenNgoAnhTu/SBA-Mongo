package com.orchid.orchidbe.repositories;

import com.orchid.orchidbe.pojos.Orchid;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrchidRepository extends MongoRepository<Orchid, String> {
    boolean existsByName(String name);
    boolean existsByNameAndIdNot(String name, String id);
}
