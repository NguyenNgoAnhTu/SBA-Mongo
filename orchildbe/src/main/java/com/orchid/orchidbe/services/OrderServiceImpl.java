package com.orchid.orchidbe.services;

import com.orchid.orchidbe.dto.OrderDto;
import com.orchid.orchidbe.mappers.OrderMapper;
import com.orchid.orchidbe.pojos.Account;
import com.orchid.orchidbe.pojos.Orchid;
import com.orchid.orchidbe.pojos.Order;
import com.orchid.orchidbe.pojos.OrderDetail;
import com.orchid.orchidbe.repositories.OrchidRepository;
import com.orchid.orchidbe.repositories.OrderDetailRepository;
import com.orchid.orchidbe.repositories.OrderRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderServiceImpl implements OrderService {
    OrderRepository orderRepository;
    OrderDetailRepository orderDetailRepository;
    OrchidRepository orchidRepository;
    OrderMapper orderMapper;

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public List<OrderDto.OrderResponse> findAll() {
        List<Order> orders = orderRepository.findAll();

        return orders
                .stream()
                .map(order -> {
                    List<OrderDetail> orderDetails = orderDetailRepository.findByOrderId(order.getId());
                    return orderMapper.toOrderResponse(order, orderDetails);
                })
                .toList();
    }

    @Override
    @PostAuthorize("returnObject.accountId().equals(authentication.principal.id) or hasRole('ADMIN')")
    public OrderDto.OrderResponse findById(String id) {
        return orderRepository.findById(id)
                .map(order -> {
                    List<OrderDetail> orderDetails = orderDetailRepository.findByOrderId(order.getId());
                    return orderMapper.toOrderResponse(order, orderDetails);
                })
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + id));
    }

    @Override
    public List<OrderDto.OrderResponse> findByAccount() {
        return orderRepository.findAllByAccount_Id(this.getCurrentAccount().getId())
                .stream()
                .map(order -> {
                    List<OrderDetail> orderDetails = orderDetailRepository.findByOrderId(order.getId());
                    return orderMapper.toOrderResponse(order, orderDetails);
                })
                .toList();
    }

    private Account getCurrentAccount() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Account currentAccount = (Account) securityContext.getAuthentication().getPrincipal();
        if (currentAccount == null) {
            throw new IllegalArgumentException("Haven't login yet");
        }
        return currentAccount;
    }

    @Override
    @Transactional
    public OrderDto.OrderResponse add(OrderDto.OrderRequest orderRequest) {
        Account account = getCurrentAccount();

        Order newOrder = new Order();
        newOrder.setOrderStatus(Order.OrderStatus.PENDING);
        newOrder.setAccount(account);
        newOrder.setOrderDate(LocalDateTime.now());
        newOrder.setTotalAmount(0.0);

        orderRepository.save(newOrder);

        double totalAmount = 0;
        List<OrderDetail> details = orderRequest.orderDetails()
                .stream()
                .map(orderDetailRequest -> {
                    OrderDetail orderDetail = new OrderDetail();
                    Orchid orchid = orchidRepository.findById(orderDetailRequest.productId())
                            .orElseThrow(() -> new IllegalArgumentException("Orchid not found with ID: " + orderDetailRequest.productId()));
                    orderDetail.setOrder(newOrder);
                    orderDetail.setOrchid(orchid);
                    orderDetail.setPrice(orchid.getPrice());
                    orderDetail.setQuantity(orderDetailRequest.quantity());
                    return orderDetail;
                })
                .toList();

        for (OrderDetail detail : details) {
            totalAmount += detail.getPrice() * detail.getQuantity();
        }

        orderDetailRepository.saveAll(details);

        newOrder.setTotalAmount(totalAmount);
        orderRepository.save(newOrder);

        return orderMapper.toOrderResponse(newOrder, details);
    }

    @Override
    @Transactional
    public OrderDto.OrderResponse update(OrderDto.OrderRequest orderRequest, String id) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + id));
        if (!existingOrder.getOrderStatus().equals(Order.OrderStatus.PENDING)) {
            throw new IllegalArgumentException("Order is not in PENDING status and cannot be updated");
        }

        orderDetailRepository.deleteAllByOrder_Id(id);

        double totalAmount = 0;
        List<OrderDetail> details = orderRequest.orderDetails()
                .stream()
                .map(orderDetailRequest -> {
                    OrderDetail orderDetail = new OrderDetail();
                    orderDetail.setOrder(existingOrder);
                    orderDetail.setOrchid(orchidRepository.findById(orderDetailRequest.productId())
                            .orElseThrow(() -> new IllegalArgumentException("Orchid not found with ID: " + orderDetailRequest.productId())));
                    orderDetail.setQuantity(orderDetailRequest.quantity());
                    return orderDetail;
                })
                .toList();

        for (OrderDetail detail : details) {
            totalAmount += detail.getOrchid().getPrice() * detail.getQuantity();
        }

        orderDetailRepository.saveAll(details);

        existingOrder.setTotalAmount(totalAmount);

        return orderMapper.toOrderResponse(existingOrder, details);
    }

    @Override
    public void delete(String id) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + id));

        existingOrder.setOrderStatus(Order.OrderStatus.CANCELLED);

        orderRepository.save(existingOrder);
    }

    @Override
    @Transactional
    public OrderDto.OrderResponse pay(String id) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + id));

        if (existingOrder.getOrderStatus() != Order.OrderStatus.PENDING) {
            throw new IllegalArgumentException("Order is not in PENDING status");
        }

        Account account = existingOrder.getAccount();
        if (!account.getId().equals(getCurrentAccount().getId())) {
            throw new IllegalArgumentException("You are not authorized to pay this order");
        }

        existingOrder.setOrderStatus(Order.OrderStatus.COMPLETED);
        orderRepository.save(existingOrder);

        List<OrderDetail> orderDetails = orderDetailRepository.findByOrderId(existingOrder.getId());

        return orderMapper.toOrderResponse(existingOrder, orderDetails);
    }
}
