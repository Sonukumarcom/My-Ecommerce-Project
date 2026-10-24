package com.store.ecommerce.dto.admin;

import java.time.LocalDateTime;

public class AdminCustomerResponse {

    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private boolean active;
    private String roles;
    private long totalOrders;
    private LocalDateTime createdAt;

    public AdminCustomerResponse(
            Long id,
            String name,
            String email,
            String phoneNumber,
            boolean active,
            String roles,
            long totalOrders,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.active = active;
        this.roles = roles;
        this.totalOrders = totalOrders;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public boolean isActive() {
        return active;
    }

    public String getRoles() {
        return roles;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}