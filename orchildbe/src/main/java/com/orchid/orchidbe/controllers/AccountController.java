package com.orchid.orchidbe.controllers;

import com.orchid.orchidbe.apis.ApiResponse;
import com.orchid.orchidbe.dto.AccountDto;
import com.orchid.orchidbe.services.AccountService;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AccountController {

    AccountService accountService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AccountDto.AccountResponse>>> getAccounts() {
        return ApiResponse.success(accountService.findAll());
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AccountDto.LoginResponse>> login(
            @RequestBody AccountDto.LoginRequest loginRequest) {
        AccountDto.LoginResponse loginResponse = accountService.login(loginRequest.email(), loginRequest.password());
        return ApiResponse.success(loginResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountDto.AccountResponse>> getAccountById(@PathVariable String id) {
        AccountDto.AccountResponse accountResponse = accountService.findById(id);
        if (accountResponse == null) {
            return ApiResponse.notFound();
        }
        return ApiResponse.success(accountService.findById(id));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Object>> createAccount(
            @RequestBody @Valid AccountDto.AccountRequest accountRequest,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            fieldError -> Optional.ofNullable(fieldError.getDefaultMessage())
                                    .orElse("Unknown error")
                    ));
            return ApiResponse.validationError(errors);
        }

        AccountDto.AccountResponse accountResponse = accountService.register(accountRequest);
        return ApiResponse.created(accountResponse);
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<Object>> addAccount(
            @RequestBody @Valid AccountDto.AccountRequestForAdmin accountRequest,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            fieldError -> Optional.ofNullable(fieldError.getDefaultMessage())
                                    .orElse("Unknown error")
                    ));
            return ApiResponse.validationError(errors);
        }

        AccountDto.AccountResponse accountResponse = accountService.add(accountRequest);
        return ApiResponse.created(accountResponse);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> updateAccount(
            @PathVariable String id,
            @RequestBody @Valid AccountDto.AccountRequest accountRequest,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            fieldError -> Optional.ofNullable(fieldError.getDefaultMessage())
                                    .orElse("Unknown error")
                    ));
            return ApiResponse.validationError(errors);
        }

        AccountDto.AccountResponse accountResponse = accountService.update(id, accountRequest);
        return ApiResponse.updated(accountResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteAccount(@PathVariable String id) {
        accountService.delete(id);
        return ApiResponse.delete();
    }
}
