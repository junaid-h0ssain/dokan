package com.dokan.dokan.service;

import com.dokan.dokan.model.Category;

import java.util.List;

public interface CatagoryService {
    List<Category> getAllCategories();
    Category getCategoryById(Long catagoryId);
    Category getCategoryByName(String catagoryName);
    void createCategory(Category category);
    String deleteCategory(Long catagoryId);
}
