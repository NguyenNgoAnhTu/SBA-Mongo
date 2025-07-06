package com.orchid.orchidbe.mappers;

import com.orchid.orchidbe.dto.AccountDto;
import com.orchid.orchidbe.pojos.Account;
import com.orchid.orchidbe.pojos.Role;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-25T10:10:11+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.7 (Oracle Corporation)"
)
@Component
public class AccountMapperImpl implements AccountMapper {

    @Override
    public AccountDto.AccountResponse toAccountResponse(Account account) {
        if ( account == null ) {
            return null;
        }

        String id = null;
        String name = null;
        String email = null;
        Role role = null;

        id = account.getId();
        name = account.getName();
        email = account.getEmail();
        role = account.getRole();

        AccountDto.AccountResponse accountResponse = new AccountDto.AccountResponse( id, name, email, role );

        return accountResponse;
    }
}
