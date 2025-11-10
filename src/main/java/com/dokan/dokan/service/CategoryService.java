package com.dokan.dokan.service;

import com.dokan.dokan.model.Category;

import java.util.List;

public interface CategoryService {
    List<Category> getAllCategories();
    Category getCategoryById(Long categoryId);
    void createCategory(Category category);
    String updateCategory(Long categoryId, String categoryName);
    Boolean deleteCategory(Long categoryId);
}
