package com.orchid.orchidbe.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class OrderDetailDto {

    public record OrderDetail(
            @NotNull
            String productId,
            @NotNull
            @Positive
            int quantity) {
    }

    public record OrderDetailResponse(
            String id,
            String orderId,
            String orchidId,
            int quantity,
            double price) {
    }
}