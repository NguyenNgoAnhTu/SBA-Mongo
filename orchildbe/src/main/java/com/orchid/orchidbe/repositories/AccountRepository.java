package com.orchid.orchidbe.repositories;

import com.orchid.orchidbe.pojos.Account;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends MongoRepository<Account, String> {
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, String id);
    Optional<Account> findByEmail(String email);
}
