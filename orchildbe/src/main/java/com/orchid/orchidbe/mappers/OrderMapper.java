package com.orchid.orchidbe.mappers;

import com.orchid.orchidbe.dto.OrderDetailDto;
import com.orchid.orchidbe.dto.OrderDto;
import com.orchid.orchidbe.pojos.Order;
import com.orchid.orchidbe.pojos.OrderDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    @Mapping(source = "orchid.id", target = "orchidId")
    @Mapping(source = "order.id", target = "orderId")
    OrderDetailDto.OrderDetailResponse toOrderDetailResponse(OrderDetail orderDetail);

    List<OrderDetailDto.OrderDetailResponse> toOrderDetailResponseList(List<OrderDetail> orderDetails);

    @Mapping(source = "order.account.id", target = "accountId")
    OrderDto.OrderResponse toOrderResponse(Order order, List<OrderDetail> orderDetails);


}
