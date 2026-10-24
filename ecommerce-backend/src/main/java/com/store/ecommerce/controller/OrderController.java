package com.store.ecommerce.controller;

import com.store.ecommerce.dto.order.CreateOrderRequest;
import com.store.ecommerce.dto.order.OrderResponse;
import com.store.ecommerce.dto.response.ApiResponse;
import com.store.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateOrderRequest request
    ) {
        OrderResponse order =
                orderService.createOrder(
                        userDetails.getUsername(),
                        request
                );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                order,
                                "Order placed successfully"
                        )
                );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        Page<OrderResponse> orders =
                orderService.getUserOrders(
                        userDetails.getUsername(),
                        pageable
                );

        return ResponseEntity.ok(
                ApiResponse.success(orders)
        );
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderByNumber(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String orderNumber
    ) {
        OrderResponse order =
                orderService.getOrderByNumber(
                        userDetails.getUsername(),
                        orderNumber
                );

        return ResponseEntity.ok(
                ApiResponse.success(order)
        );
    }
}