package com.orchid.orchidbe.dto;

import jakarta.validation.constraints.NotBlank;

public class CategoryDto {

    public record CategoryRequest(@NotBlank String name) {
    }

}
