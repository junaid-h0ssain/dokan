package com.dokan.dokan.service;

import com.dokan.dokan.model.Category;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryServiceImplementation implements CategoryService {
    private final List<Category> categories =  new ArrayList<>();

    private Long nextId = 1000L;

    @Override
    public List<Category> getAllCategories() {
        return categories;
    }

    @Override
    public Category getCategoryById(Long categoryId) {
        for (Category category : categories) {
            if (category.getCategoryId().equals(categoryId)) {
                return category;
            }
        }
        return null;
    }

    @Override
    public void createCategory(Category category) {
        category.setCategoryId(nextId++);
        categories.add(category);
    }

    @Override
    public String updateCategory(Long categoryId, String categoryName) {
        Category category = getCategoryById(categoryId);
        if (category == null) {
            return "Category "+ categoryName +" not found";
        }
        String oldCategoryName = category.getCategoryName();
        category.setCategoryName(categoryName);

        return "Category "+ oldCategoryName+" updated to " + category.getCategoryName();
    }

    @Override
    public Boolean deleteCategory(Long categoryId) {
        Category category = getCategoryById(categoryId);
        if (category == null) {
            return false;
        }
        categories.remove(category);
        return true;
    }
}
