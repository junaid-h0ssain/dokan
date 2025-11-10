package com.dokan.dokan.model;

import lombok.Data;

@Data
public class Category {
    private Long categoryId;
    private String categoryName;

    // constructor
    public Category(Long categoryId,  String categoryName) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }
}
