package com.store.ecommerce.service;

import com.store.ecommerce.dto.admin.AdminOrderResponse;
import com.store.ecommerce.dto.admin.UpdateOrderStatusRequest;
import com.store.ecommerce.entity.Order;
import com.store.ecommerce.entity.OrderStatus;
import com.store.ecommerce.repository.OrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
public class AdminOrderService {

    private final OrderRepository orderRepository;

    public AdminOrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public Page<AdminOrderResponse> getAllOrders(Pageable pageable) {

        return orderRepository
                .findAllByOrderByPlacedAtDesc(pageable)
                .map(this::mapToResponse);
    }

    @Transactional
    public AdminOrderResponse updateOrderStatus(
            String orderNumber,
            UpdateOrderStatusRequest request) {

        Order order = orderRepository
                .findByOrderNumberWithItems(orderNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found: " + orderNumber
                        )
                );

        OrderStatus currentStatus = order.getOrderStatus();
        OrderStatus newStatus = request.getStatus();

        if (currentStatus == newStatus) {
            return mapToResponse(order);
        }

        if (!isValidStatusTransition(currentStatus, newStatus)) {
            throw new IllegalArgumentException(
                    "Invalid order status transition: "
                            + currentStatus
                            + " -> "
                            + newStatus
            );
        }

        order.setOrderStatus(newStatus);

        Order savedOrder = orderRepository.save(order);

        return mapToResponse(savedOrder);
    }

    private boolean isValidStatusTransition(
            OrderStatus currentStatus,
            OrderStatus newStatus) {

        return switch (currentStatus) {

            case PENDING ->
                    newStatus == OrderStatus.PROCESSING;

            case PROCESSING ->
                    newStatus == OrderStatus.SHIPPED;

            case SHIPPED ->
                    newStatus == OrderStatus.DELIVERED;

            case DELIVERED ->
                    false;

            case CANCELLED ->
                    false;

            case REFUNDED ->
                    false;
        };
    }

    private AdminOrderResponse mapToResponse(Order order) {

        var user = order.getUser();

        String customerName =
                ((user.getFirstName() != null ? user.getFirstName() : "")
                        + " "
                        + (user.getLastName() != null ? user.getLastName() : ""))
                        .trim();

        if (customerName.isBlank()) {
            customerName = order.getShippingRecipientName();
        }

        var items = order.getOrderItems()
                .stream()
                .map(item ->
                        new AdminOrderResponse.OrderItemResponse(
                                item.getProductName(),
                                item.getProductSku(),
                                item.getUnitPrice(),
                                item.getQuantity(),
                                item.getTotalPrice()
                        )
                )
                .collect(Collectors.toList());

        return new AdminOrderResponse(
                order.getId(),
                order.getOrderNumber(),

                user.getId(),
                customerName,
                user.getEmail(),
                user.getPhoneNumber(),

                order.getOrderStatus().name(),
                order.getPaymentStatus().name(),

                order.getSubtotal(),
                order.getTaxAmount(),
                order.getShippingFee(),
                order.getTotalAmount(),

                order.getPlacedAt(),

                order.getShippingRecipientName(),
                order.getShippingPhone(),
                order.getShippingStreet1(),
                order.getShippingCity(),
                order.getShippingState(),
                order.getShippingPostalCode(),
                order.getShippingCountry(),

                items
        );
    }
}