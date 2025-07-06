package com.orchid.orchidbe.mappers;

import com.orchid.orchidbe.dto.AccountDto;
import com.orchid.orchidbe.pojos.Account;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    AccountDto.AccountResponse toAccountResponse(Account account);
}
