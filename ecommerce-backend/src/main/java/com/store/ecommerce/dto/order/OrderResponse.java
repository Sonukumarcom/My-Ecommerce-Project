package com.store.ecommerce.dto.order;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class OrderResponse {

    private Long id;
    private String orderNumber;
    private String orderStatus;
    private String paymentStatus;

    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal shippingFee;
    private BigDecimal totalAmount;

    private Instant placedAt;

    // Delivery address
    private String shippingRecipientName;
    private String shippingPhone;
    private String shippingStreet1;
    private String shippingCity;
    private String shippingState;
    private String shippingPostalCode;
    private String shippingCountry;

    private List<OrderItemResponse> items;

    public OrderResponse(
            Long id,
            String orderNumber,
            String orderStatus,
            String paymentStatus,
            BigDecimal subtotal,
            BigDecimal taxAmount,
            BigDecimal shippingFee,
            BigDecimal totalAmount,
            Instant placedAt,
            String shippingRecipientName,
            String shippingPhone,
            String shippingStreet1,
            String shippingCity,
            String shippingState,
            String shippingPostalCode,
            String shippingCountry,
            List<OrderItemResponse> items) {

        this.id = id;
        this.orderNumber = orderNumber;
        this.orderStatus = orderStatus;
        this.paymentStatus = paymentStatus;
        this.subtotal = subtotal;
        this.taxAmount = taxAmount;
        this.shippingFee = shippingFee;
        this.totalAmount = totalAmount;
        this.placedAt = placedAt;
        this.shippingRecipientName = shippingRecipientName;
        this.shippingPhone = shippingPhone;
        this.shippingStreet1 = shippingStreet1;
        this.shippingCity = shippingCity;
        this.shippingState = shippingState;
        this.shippingPostalCode = shippingPostalCode;
        this.shippingCountry = shippingCountry;
        this.items = items;
    }

    public Long getId() {
        return id;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public BigDecimal getShippingFee() {
        return shippingFee;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public Instant getPlacedAt() {
        return placedAt;
    }

    public String getShippingRecipientName() {
        return shippingRecipientName;
    }

    public String getShippingPhone() {
        return shippingPhone;
    }

    public String getShippingStreet1() {
        return shippingStreet1;
    }

    public String getShippingCity() {
        return shippingCity;
    }

    public String getShippingState() {
        return shippingState;
    }

    public String getShippingPostalCode() {
        return shippingPostalCode;
    }

    public String getShippingCountry() {
        return shippingCountry;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }

    public static class OrderItemResponse {

        private String productName;
        private String productSku;
        private BigDecimal unitPrice;
        private Integer quantity;
        private BigDecimal totalPrice;

        public OrderItemResponse(
                String productName,
                String productSku,
                BigDecimal unitPrice,
                Integer quantity,
                BigDecimal totalPrice) {

            this.productName = productName;
            this.productSku = productSku;
            this.unitPrice = unitPrice;
            this.quantity = quantity;
            this.totalPrice = totalPrice;
        }

        public String getProductName() {
            return productName;
        }

        public String getProductSku() {
            return productSku;
        }

        public BigDecimal getUnitPrice() {
            return unitPrice;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public BigDecimal getTotalPrice() {
            return totalPrice;
        }
    }
}