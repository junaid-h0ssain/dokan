package com.dokan.dokan.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity(name = "orders")
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;
    
    private LocalDateTime orderDate;
    
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    
    private String shippingAddress;
    private String shippingCity;
    private String shippingState;
    private String shippingPostalCode;
    private String shippingCountry;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;
    
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;
    
    private Double totalAmount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        if (orderDate == null) {
            orderDate = now;
        }
        if (orderStatus == null) {
            orderStatus = OrderStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public Order() {}

    public Order(Long orderId, LocalDateTime orderDate, String customerName, String customerEmail, 
                 String customerPhone, String shippingAddress, String shippingCity, String shippingState, 
                 String shippingPostalCode, String shippingCountry, OrderStatus orderStatus, 
                 PaymentMethod paymentMethod, Double totalAmount, LocalDateTime createdAt, 
                 LocalDateTime updatedAt, List<OrderItem> orderItems) {
        this.orderId = orderId;
        this.orderDate = orderDate;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.customerPhone = customerPhone;
        this.shippingAddress = shippingAddress;
        this.shippingCity = shippingCity;
        this.shippingState = shippingState;
        this.shippingPostalCode = shippingPostalCode;
        this.shippingCountry = shippingCountry;
        this.orderStatus = orderStatus;
        this.paymentMethod = paymentMethod;
        this.totalAmount = totalAmount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.orderItems = orderItems;
    }
}
