package com.store.ecommerce.controller;

import com.store.ecommerce.dto.admin.AdminCustomerResponse;
import com.store.ecommerce.dto.response.ApiResponse;
import com.store.ecommerce.service.AdminCustomerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/customers")
public class AdminCustomerController {

    private final AdminCustomerService adminCustomerService;

    public AdminCustomerController(
            AdminCustomerService adminCustomerService
    ) {
        this.adminCustomerService = adminCustomerService;
    }

    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<AdminCustomerResponse>>> getAllCustomers(
            @PageableDefault(size = 20) Pageable pageable
    ) {

        Page<AdminCustomerResponse> customers =
                adminCustomerService.getAllCustomers(pageable);

        return ResponseEntity.ok(
                ApiResponse.success(customers)
        );
    }
}