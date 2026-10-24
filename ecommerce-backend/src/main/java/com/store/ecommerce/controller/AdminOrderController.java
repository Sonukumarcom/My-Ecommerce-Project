package com.store.ecommerce.controller;

import com.store.ecommerce.dto.admin.AdminOrderResponse;
import com.store.ecommerce.dto.admin.UpdateOrderStatusRequest;
import com.store.ecommerce.dto.response.ApiResponse;
import com.store.ecommerce.service.AdminOrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/orders")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    public AdminOrderController(AdminOrderService adminOrderService) {
        this.adminOrderService = adminOrderService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AdminOrderResponse>>> getAllOrders(
            @PageableDefault(size = 10) Pageable pageable
    ) {

        Page<AdminOrderResponse> orders =
                adminOrderService.getAllOrders(pageable);

        return ResponseEntity.ok(
                ApiResponse.success(orders)
        );
    }

    @PatchMapping("/{orderNumber}/status")
    public ResponseEntity<ApiResponse<AdminOrderResponse>> updateOrderStatus(
            @PathVariable String orderNumber,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {

        AdminOrderResponse updatedOrder =
                adminOrderService.updateOrderStatus(
                        orderNumber,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        updatedOrder,
                        "Order status updated successfully"
                )
        );
    }
}