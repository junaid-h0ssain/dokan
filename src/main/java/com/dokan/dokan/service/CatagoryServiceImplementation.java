package com.dokan.dokan.service;

import com.dokan.dokan.model.Category;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CatagoryServiceImplementation implements CatagoryService {
    private final List<Category> categories =  new ArrayList<>();

    private Long nextId = 1000L;

    @Override
    public List<Category> getAllCategories() {
        return categories;
    }

    @Override
    public Category getCategoryById(Long catagoryId) {
        for (Category category : categories) {
            if (category.getCatagoryId().equals(catagoryId)) {
                return category;
            }
        }
        return null;
    }

    @Override
    public Category getCategoryByName(String catagoryName) {
        return null;
    }

    @Override
    public void createCategory(Category category) {
        category.setCatagoryId(nextId++);
        categories.add(category);
    }

    @Override
    public String deleteCategory(Long catagoryId) {
        Category category = getCategoryById(catagoryId);
        if (category == null) {
            return "Category not found or does not exist";
        }
        categories.remove(category);
        return "Category " + catagoryId + " has been deleted";
    }
}
