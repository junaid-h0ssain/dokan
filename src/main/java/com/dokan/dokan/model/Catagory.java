package com.dokan.dokan.model;

import lombok.Data;

@Data
public class Catagory {
    private Long catagoryId;
    private String catagoryName;

    // constructor
    public Catagory(Long catagoryId,  String catagoryName) {
        this.catagoryId = catagoryId;
        this.catagoryName = catagoryName;
    }
}
