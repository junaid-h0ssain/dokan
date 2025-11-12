package com.dokan.dokan.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity(name = "order_items")
@Data
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderItemId;
    
    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonBackReference
    private Order order;
    
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
    
    private Integer quantity;
    private Double priceAtOrder;

    // Constructors
    public OrderItem() {}

    public OrderItem(Long orderItemId, Order order, Product product, Integer quantity, Double priceAtOrder) {
        this.orderItemId = orderItemId;
        this.order = order;
        this.product = product;
        this.quantity = quantity;
        this.priceAtOrder = priceAtOrder;
    }
}
