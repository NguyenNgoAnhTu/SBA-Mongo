package com.orchid.orchidbe.dto;

import jakarta.validation.constraints.NotBlank;

public class RoleDto {

    public record RoleRequest(@NotBlank(message = "Name cannot be blank") String name) {
    }
}
