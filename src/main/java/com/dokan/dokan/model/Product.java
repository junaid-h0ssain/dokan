package com.dokan.dokan.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity(name = "products")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;
    
    private String productName;
    private String description;
    private Double price;
    private Integer quantity;
    private LocalDate expiryDate;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    // Constructors
    public Product() {}

    public Product(Long productId, String productName, String description, Double price, Integer quantity, LocalDate expiryDate, Category category) {
        this.productId = productId;
        this.productName = productName;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.expiryDate = expiryDate;
        this.category = category;
    }
}
