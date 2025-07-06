package com.orchid.orchidbe.dto;

import com.orchid.orchidbe.pojos.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AccountDto {

    public record AccountRequest(
            @NotBlank String name,
            @Email String email,
            @NotBlank String password) {
    }

    public record AccountRequestForAdmin(
            @NotBlank String name,
            @Email String email,
            @NotBlank String password,
            @NotNull String roleId) {
    }

    public record LoginRequest(
            @NotBlank String email,
            @NotBlank String password) {
    }

    public record AccountResponse(
            String id,
            String name,
            String email,
            Role role) {
    }

    public record LoginResponse(
       String token,
       AccountResponse accountData) {
    }
}
