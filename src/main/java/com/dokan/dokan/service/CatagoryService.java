package com.dokan.dokan.service;

import com.dokan.dokan.model.Catagory;

import java.util.List;

public interface CatagoryService {
    List<Catagory> getAllCategories();
    Catagory getcatagoryById(Long catagoryId);
    Catagory getcatagoryByName(String catagoryName);
    void createcatagory(Catagory catagory);
    String deletecatagory(Long catagoryId);
}
