package com.orchid.orchidbe.dto;

import com.orchid.orchidbe.pojos.Order.OrderStatus;
import jakarta.validation.constraints.*;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;
import java.util.List;

public class OrderDto {

    public record OrderRequest(
            @NotNull(message = "Order details cannot be null")
            @Size(min = 1, message = "At least one order detail is required")
            List<OrderDetailDto.OrderDetail> orderDetails) {
    }

    public record OrderResponse(
            String id,
            double totalAmount,
            LocalDateTime orderDate,
            OrderStatus orderStatus,
            String accountId,
            List<OrderDetailDto.OrderDetailResponse> orderDetails) {
    }
}
