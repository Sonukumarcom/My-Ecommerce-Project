package com.store.ecommerce.service.impl;

import com.store.ecommerce.dto.order.CreateOrderRequest;
import com.store.ecommerce.dto.order.OrderResponse;
import com.store.ecommerce.entity.*;
import com.store.ecommerce.exception.BadRequestException;
import com.store.ecommerce.exception.InsufficientStockException;
import com.store.ecommerce.exception.ResourceNotFoundException;
import com.store.ecommerce.repository.*;
import com.store.ecommerce.service.OrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final AddressRepository addressRepository;

    public OrderServiceImpl(
            OrderRepository orderRepository,
            UserRepository userRepository,
            ProductRepository productRepository,
            AddressRepository addressRepository) {

        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.addressRepository = addressRepository;
    }

    @Override
    public OrderResponse createOrder(
            String userEmail,
            CreateOrderRequest request) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User",
                                "email",
                                userEmail
                        ));

      Address address;

if (request.getAddressId() != null) {

    address = addressRepository.findByIdAndUserId(
            request.getAddressId(),
            user.getId()
    ).orElseThrow(() ->
            new BadRequestException(
                    "Selected address is invalid or does not belong to the user."
            )
    );

} else {

    address = new Address();

    address.setUser(user);
    address.setRecipientName(request.getRecipientName());
    address.setPhoneNumber(request.getPhoneNumber());
    address.setStreetAddress1(request.getStreetAddress1());
    address.setStreetAddress2(request.getStreetAddress2());
    address.setCity(request.getCity());
    address.setStateProvince(request.getStateProvince());
    address.setPostalCode(request.getPostalCode());
    address.setCountry(request.getCountry());
    address.setIsDefault(false);

    address = addressRepository.save(address);
}

        Order order = new Order();

        order.setOrderNumber(
                "ORD-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase()
        );

        order.setUser(user);
        order.setOrderStatus(OrderStatus.PENDING);
        order.setPaymentStatus(PaymentStatus.UNPAID);

        // Snapshot address details
        order.setShippingRecipientName(address.getRecipientName());
        order.setShippingPhone(address.getPhoneNumber());
        order.setShippingStreet1(address.getStreetAddress1());
        order.setShippingCity(address.getCity());
        order.setShippingState(address.getStateProvince());
        order.setShippingPostalCode(address.getPostalCode());
        order.setShippingCountry(address.getCountry());

        BigDecimal subtotal = BigDecimal.ZERO;

        for (CreateOrderRequest.OrderItemRequest itemReq :
                request.getItems()) {

            Product product = productRepository
                    .findById(itemReq.getProductId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Product",
                                    "id",
                                    itemReq.getProductId()
                            ));

            ProductInventory inventory = product.getInventory();

            if (inventory == null ||
                    inventory.getAvailableStock() < itemReq.getQuantity()) {

                int available =
                        inventory != null
                                ? inventory.getAvailableStock()
                                : 0;

                throw new InsufficientStockException(
                        product.getName(),
                        available,
                        itemReq.getQuantity()
                );
            }

            // Reserve stock quantity
            inventory.setReservedQuantity(
                    inventory.getReservedQuantity()
                            + itemReq.getQuantity()
            );

            BigDecimal itemPrice =
                    product.getSalePrice() != null
                            ? product.getSalePrice()
                            : product.getPrice();

            BigDecimal itemTotal =
                    itemPrice.multiply(
                            BigDecimal.valueOf(itemReq.getQuantity())
                    );

            subtotal = subtotal.add(itemTotal);

            OrderItem orderItem = new OrderItem();

            orderItem.setProduct(product);
            orderItem.setProductName(product.getName());
            orderItem.setProductSku(product.getSku());
            orderItem.setUnitPrice(itemPrice);
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setTotalPrice(itemTotal);

            order.addOrderItem(orderItem);
        }

        order.setSubtotal(subtotal);

BigDecimal shippingFee =
        subtotal.compareTo(new BigDecimal("5000.00")) >= 0
                ? BigDecimal.ZERO
                : new BigDecimal("100.00");

BigDecimal taxAmount =
        subtotal.multiply(new BigDecimal("0.18"));

BigDecimal totalAmount =
        subtotal
                .add(shippingFee)
                .add(taxAmount);

order.setShippingFee(shippingFee);
order.setTaxAmount(taxAmount);
order.setTotalAmount(totalAmount);

        Order savedOrder =
                orderRepository.save(order);

        return mapToResponse(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getUserOrders(
            String userEmail,
            Pageable pageable) {

        User user = userRepository
                .findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User",
                                "email",
                                userEmail
                        ));

        return orderRepository
                .findByUserIdOrderByPlacedAtDesc(
                        user.getId(),
                        pageable
                )
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderByNumber(
            String userEmail,
            String orderNumber) {

        Order order = orderRepository
                .findByOrderNumberWithItems(orderNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order",
                                "orderNumber",
                                orderNumber
                        ));

        if (!order.getUser().getEmail().equals(userEmail)) {
            throw new BadRequestException(
                    "Unauthorized access to requested order."
            );
        }

        return mapToResponse(order);
    }

   private OrderResponse mapToResponse(Order order) {

    var items = order.getOrderItems()
            .stream()
            .map(i ->
                    new OrderResponse.OrderItemResponse(
                            i.getProductName(),
                            i.getProductSku(),
                            i.getUnitPrice(),
                            i.getQuantity(),
                            i.getTotalPrice()
                    )
            )
            .collect(Collectors.toList());

    return new OrderResponse(
            order.getId(),
            order.getOrderNumber(),
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