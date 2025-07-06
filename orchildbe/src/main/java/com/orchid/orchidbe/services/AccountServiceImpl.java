package com.orchid.orchidbe.services;

import com.orchid.orchidbe.configs.JwtUtil;
import com.orchid.orchidbe.dto.AccountDto;
import com.orchid.orchidbe.mappers.AccountMapper;
import com.orchid.orchidbe.pojos.Account;
import com.orchid.orchidbe.pojos.Role;
import com.orchid.orchidbe.repositories.AccountRepository;
import com.orchid.orchidbe.repositories.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AccountServiceImpl implements AccountService {
    AccountRepository accountRepository;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;
    JwtUtil jwtUtil;
    AccountMapper accountMapper;

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public List<AccountDto.AccountResponse> findAll() {
        return accountRepository.findAll()
                .stream()
                .map(accountMapper::toAccountResponse)
                .toList();
    }

    @Override
    public AccountDto.LoginResponse login(String email, String password) {
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        if (!passwordEncoder.matches(password, account.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        AccountDto.AccountResponse accountResponse = accountMapper.toAccountResponse(account);
        String token = jwtUtil.generateToken(account);

        return new AccountDto.LoginResponse(token, accountResponse);
    }

    @Override
    @PostAuthorize("returnObject == null or returnObject.id.equals(authentication.principal.id) or hasRole('ADMIN')")
    public AccountDto.AccountResponse findById(String id) {
        Optional<Account> accountById = accountRepository.findById(id);
        if (accountById.isPresent()) {
            Account account = accountById.get();
            return accountMapper.toAccountResponse(account);
        }
        return null;
    }

    @Override
    @Transactional
    public AccountDto.AccountResponse register(AccountDto.AccountRequest accountRequest) {
        if (accountRepository.existsByEmail(accountRequest.email())) {
            throw new IllegalArgumentException("Email already exists");
        }

        Account newAccount = new Account();
        newAccount.setName(accountRequest.name());
        newAccount.setEmail(accountRequest.email());
        newAccount.setPassword(passwordEncoder.encode(accountRequest.password()));
        newAccount.setRole(roleRepository.findByName("USER").orElse(new Role("USER")));

        return accountMapper.toAccountResponse(accountRepository.save(newAccount));
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public AccountDto.AccountResponse add(AccountDto.AccountRequestForAdmin accountRequest) {
        if (accountRepository.existsByEmail(accountRequest.email())) {
            throw new IllegalArgumentException("Email already exists");
        }

        Account newAccount = new Account();
        newAccount.setName(accountRequest.name());
        newAccount.setEmail(accountRequest.email());
        newAccount.setPassword(passwordEncoder.encode(accountRequest.password()));
        newAccount.setRole(roleRepository.findById(accountRequest.roleId()).orElse(new Role("USER")));

        return accountMapper.toAccountResponse(accountRepository.save(newAccount));
    }

    @Override
    @Transactional
    @PostAuthorize("returnObject.id.equals(authentication.principal.id) or hasRole('ADMIN')")
    public AccountDto.AccountResponse update(String id, AccountDto.AccountRequest accountRequest) {

        Account existingAccount = accountRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        if (accountRepository.existsByEmailAndIdNot(accountRequest.email(), id)) {
            throw new IllegalArgumentException("Email already exists");
        }

        existingAccount.setName(accountRequest.name());
        existingAccount.setPassword(passwordEncoder.encode(accountRequest.password()));
        existingAccount.setEmail(accountRequest.email());

        return accountMapper.toAccountResponse(accountRepository.save(existingAccount));
    }

    @Override
    @Transactional
    @PreAuthorize("#id.equals(authentication.principal.id) or hasRole('ADMIN')")
    public void delete(String id) {
        Account existingAccount = accountRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Account not found"));
        accountRepository.delete(existingAccount);
    }
}