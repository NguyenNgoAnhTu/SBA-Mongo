package com.orchid.orchidbe.services;

import com.orchid.orchidbe.dto.AccountDto;

import java.util.List;

public interface AccountService {
    List<AccountDto.AccountResponse> findAll();
    AccountDto.LoginResponse login(String email, String password);
    AccountDto.AccountResponse findById(String id);
    AccountDto.AccountResponse register(AccountDto.AccountRequest accountRequest);
    AccountDto.AccountResponse add(AccountDto.AccountRequestForAdmin accountRequest);
    AccountDto.AccountResponse update(String id, AccountDto.AccountRequest accountRequest);
    void delete(String id);
}
