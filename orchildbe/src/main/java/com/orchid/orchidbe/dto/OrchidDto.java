package com.orchid.orchidbe.dto;

import com.orchid.orchidbe.pojos.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class OrchidDto {

    public record OrchidRequest(
            @NotNull(message = "Natural status cannot be null")
            boolean isNatural,

            @NotBlank(message = "Description cannot be blank")
            @Size(max = 500, message = "Description cannot exceed 500 characters")
            String description,

            @NotBlank(message = "Name cannot be blank")
            @Size(max = 100, message = "Name cannot exceed 100 characters")
            String name,

            @NotBlank(message = "URL cannot be blank")
            String url,

            @NotNull(message = "Price cannot be null")
            @Positive(message = "Price must be positive")
            double price,

            @NotNull(message = "Category cannot be null")
            String categoryId) {
    }

    public record OrchidResponse(
            String id,
            boolean isNatural,
            String description,
            String name,
            String url,
            double price,
            boolean isAvailable,
            Category category) {
    }
}