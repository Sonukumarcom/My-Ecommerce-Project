package com.store.ecommerce.service;

import com.store.ecommerce.dto.admin.AdminCustomerResponse;
import com.store.ecommerce.entity.User;
import com.store.ecommerce.repository.OrderRepository;
import com.store.ecommerce.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
public class AdminCustomerService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public AdminCustomerService(
            UserRepository userRepository,
            OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public Page<AdminCustomerResponse> getAllCustomers(
            Pageable pageable) {
        return userRepository
                .findCustomers(pageable)
                .map(this::mapToResponse);
    }

    private AdminCustomerResponse mapToResponse(User user) {

        String name = ((user.getFirstName() != null
                ? user.getFirstName()
                : "")
                + " "
                + (user.getLastName() != null
                        ? user.getLastName()
                        : ""))
                .trim();

        if (name.isBlank()) {
            name = "N/A";
        }

        String roles = user.getRoles()
                .stream()
                .map(role -> role.getName())
                .sorted()
                .collect(Collectors.joining(", "));

        long totalOrders = orderRepository.countByUserId(user.getId());

        return new AdminCustomerResponse(
                user.getId(),
                name,
                user.getEmail(),
                user.getPhoneNumber(),
                Boolean.TRUE.equals(user.getIsActive()),
                roles,
                totalOrders,
                user.getCreatedAt());
    }
}