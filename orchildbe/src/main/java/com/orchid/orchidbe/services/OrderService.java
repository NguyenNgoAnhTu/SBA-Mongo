package com.orchid.orchidbe.services;

import com.orchid.orchidbe.dto.OrderDto;

import java.util.List;

public interface OrderService {

    List<OrderDto.OrderResponse> findAll();
    OrderDto.OrderResponse findById(String id);
    List<OrderDto.OrderResponse> findByAccount();
    OrderDto.OrderResponse add(OrderDto.OrderRequest order);
    OrderDto.OrderResponse update(OrderDto.OrderRequest order, String id);
    void delete(String id);
    OrderDto.OrderResponse pay(String id);
}
