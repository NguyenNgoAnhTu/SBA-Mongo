package com.orchid.orchidbe.controllers;

import com.orchid.orchidbe.apis.ApiResponse;
import com.orchid.orchidbe.dto.OrderDto;
import com.orchid.orchidbe.dto.OrderDto.OrderResponse;
import com.orchid.orchidbe.services.OrderService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderController {

    OrderService orderService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> findAllOrders() {
        return ApiResponse.success(orderService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> findOrderById(@PathVariable String id) {
        return ApiResponse.success(orderService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody OrderDto.OrderRequest orderRequest) {
        return ApiResponse.success(orderService.add(orderRequest));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrder(
            @PathVariable String id,
            @Valid @RequestBody OrderDto.OrderRequest orderRequest) {
        return ApiResponse.updated(orderService.update(orderRequest, id));
    }

    @PostMapping("/pay/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> payOrder(
            @PathVariable String id) {
        return ApiResponse.updated(orderService.pay(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteOrder(@PathVariable String id) {
        orderService.delete(id);
        return ApiResponse.delete();
    }

    @GetMapping("/user")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> findOrdersByUser() {
        return ApiResponse.success(orderService.findByAccount());
    }
}