package com.store.ecommerce.service;

import com.store.ecommerce.dto.order.CreateOrderRequest;
import com.store.ecommerce.dto.order.OrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {

    OrderResponse createOrder(
            String userEmail,
            CreateOrderRequest request
    );

    Page<OrderResponse> getUserOrders(
            String userEmail,
            Pageable pageable
    );

    OrderResponse getOrderByNumber(
            String userEmail,
            String orderNumber
    );
}