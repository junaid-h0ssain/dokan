package com.dokan.dokan.model;

import lombok.Data;

@Data
public class Category {
    private Long catagoryId;
    private String catagoryName;

    // constructor
    public Category(Long catagoryId,  String catagoryName) {
        this.catagoryId = catagoryId;
        this.catagoryName = catagoryName;
    }
}
