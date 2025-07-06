package com.orchid.orchidbe.mappers;

import com.orchid.orchidbe.dto.OrderDetailDto;
import com.orchid.orchidbe.dto.OrderDto;
import com.orchid.orchidbe.pojos.Account;
import com.orchid.orchidbe.pojos.Orchid;
import com.orchid.orchidbe.pojos.Order;
import com.orchid.orchidbe.pojos.OrderDetail;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-25T10:10:10+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.7 (Oracle Corporation)"
)
@Component
public class OrderMapperImpl implements OrderMapper {

    @Override
    public OrderDetailDto.OrderDetailResponse toOrderDetailResponse(OrderDetail orderDetail) {
        if ( orderDetail == null ) {
            return null;
        }

        String orchidId = null;
        String orderId = null;
        String id = null;
        int quantity = 0;
        double price = 0.0d;

        orchidId = orderDetailOrchidId( orderDetail );
        orderId = orderDetailOrderId( orderDetail );
        id = orderDetail.getId();
        quantity = orderDetail.getQuantity();
        price = orderDetail.getPrice();

        OrderDetailDto.OrderDetailResponse orderDetailResponse = new OrderDetailDto.OrderDetailResponse( id, orderId, orchidId, quantity, price );

        return orderDetailResponse;
    }

    @Override
    public List<OrderDetailDto.OrderDetailResponse> toOrderDetailResponseList(List<OrderDetail> orderDetails) {
        if ( orderDetails == null ) {
            return null;
        }

        List<OrderDetailDto.OrderDetailResponse> list = new ArrayList<OrderDetailDto.OrderDetailResponse>( orderDetails.size() );
        for ( OrderDetail orderDetail : orderDetails ) {
            list.add( toOrderDetailResponse( orderDetail ) );
        }

        return list;
    }

    @Override
    public OrderDto.OrderResponse toOrderResponse(Order order, List<OrderDetail> orderDetails) {
        if ( order == null && orderDetails == null ) {
            return null;
        }

        String accountId = null;
        String id = null;
        double totalAmount = 0.0d;
        LocalDateTime orderDate = null;
        Order.OrderStatus orderStatus = null;
        if ( order != null ) {
            accountId = orderAccountId( order );
            id = order.getId();
            totalAmount = order.getTotalAmount();
            orderDate = order.getOrderDate();
            orderStatus = order.getOrderStatus();
        }
        List<OrderDetailDto.OrderDetailResponse> orderDetails1 = null;
        orderDetails1 = toOrderDetailResponseList( orderDetails );

        OrderDto.OrderResponse orderResponse = new OrderDto.OrderResponse( id, totalAmount, orderDate, orderStatus, accountId, orderDetails1 );

        return orderResponse;
    }

    private String orderDetailOrchidId(OrderDetail orderDetail) {
        if ( orderDetail == null ) {
            return null;
        }
        Orchid orchid = orderDetail.getOrchid();
        if ( orchid == null ) {
            return null;
        }
        String id = orchid.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String orderDetailOrderId(OrderDetail orderDetail) {
        if ( orderDetail == null ) {
            return null;
        }
        Order order = orderDetail.getOrder();
        if ( order == null ) {
            return null;
        }
        String id = order.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String orderAccountId(Order order) {
        if ( order == null ) {
            return null;
        }
        Account account = order.getAccount();
        if ( account == null ) {
            return null;
        }
        String id = account.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
