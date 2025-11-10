package com.dokan.dokan.service;

import com.dokan.dokan.model.Category;
import com.dokan.dokan.repository.CategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImplementation implements CategoryService {
//    private final List<Category> categories =  new ArrayList<>();

    private Long nextId = 1000L;

    @Autowired
    private CategoryRepo categoryRepo;

    @Override
    public List<Category> getAllCategories() {
        return (List<Category>) categoryRepo.findAll();
    }

    @Override
    public Category getCategoryById(Long id) {
        return categoryRepo.findById(id).get();
    }

//    @Override
//    public Category getCategoryById(Long categoryId) {
//        for (Category category : categories) {
//            if (category.getCategoryId().equals(categoryId)) {
//                return category;
//            }
//        }
//        return null;
//    }

    @Override
    public void createCategory(Category category) {
//        category.setCategoryId(nextId++);
        categoryRepo.save(category);
    }

    @Override
    public String updateCategory(Long categoryId, String categoryName) {
        Category category = getCategoryById(categoryId);
        if (category == null) {
            return "Category "+ categoryName +" not found or does not exist";
        }
        String oldCategoryName = category.getCategoryName();
        category.setCategoryName(categoryName);
        categoryRepo.save(category);

        return "Category "+ oldCategoryName+" updated to " + category.getCategoryName();
    }

    @Override
    public Boolean deleteCategory(Long categoryId) {
        Category category = getCategoryById(categoryId);
        if (category == null) {
            return false;
        }
        categoryRepo.deleteById(categoryId);
        return true;
    }
}
