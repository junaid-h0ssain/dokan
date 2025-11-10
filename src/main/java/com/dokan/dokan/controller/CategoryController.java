package com.dokan.dokan.controller;

import com.dokan.dokan.service.CategoryService;
import lombok.Data;
import com.dokan.dokan.model.Category;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Data
@RestController
public class CategoryController {

    // categoryservice class
    private CategoryService categoryService;

    //constructor
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    //get function
//    @GetMapping("api/public/categories")
//    public List<category> getCategories() {
//        return categoryService.getAllCategories();
//    }

    @GetMapping("/api/public/categories")
    public ResponseEntity<List<Category>> getCategories() {
        categoryService.getAllCategories();
        return new ResponseEntity<>(categoryService.getAllCategories(), HttpStatus.OK);
    }

    //get func
//    @GetMapping("api/public/categories/{categoryId}")
//    public category getcategoryById(@PathVariable("categoryId") Long categoryId) {
//        return categoryService.getcategoryById(categoryId);
//    }

    @GetMapping("api/public/categories/{categoryId}")
    public ResponseEntity<Category> getcategoryById(@PathVariable("categoryId") Long categoryId) {
        Category category = categoryService.getCategoryById(categoryId);
        if (category == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(categoryService.getCategoryById(categoryId), HttpStatus.OK);
    }

    //post function
    @PostMapping("api/public/categories")
    public String addCategory(@RequestBody Category category) {
        categoryService.createCategory(category);
        return "category added";
    }

//    @PostMapping("/api/public/categories")
//    public ResponseEntity<String> addCategory(@RequestBody Category category) {
//        categoryService.createCategory(category);
//        return new ResponseEntity<>("Category " + category.getCategoryId() + " added", HttpStatus.CREATED);
//    }

    //delete func
//    @DeleteMapping("api/public/categories/{categoryId}")
//    public String deleteCategory(@PathVariable Long categoryId) {
//        return categoryService.deleteCategory(categoryId);
//    }

    @DeleteMapping("api/public/categories/{categoryId}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long categoryId) {
        Boolean status = categoryService.deleteCategory(categoryId);
        if (status) {
            return new ResponseEntity<>("category " + categoryId + " deleted", HttpStatus.OK);
        }
        return new ResponseEntity<>("Category not found or does not exist", HttpStatus.NOT_FOUND);
    }

    @PutMapping("api/public/categories/{categoryId}/{newcategoryName}")
    public ResponseEntity<String> updateCategory(@PathVariable Long categoryId, @PathVariable String newcategoryName) {

        String status = categoryService.updateCategory(categoryId,newcategoryName);
        return new ResponseEntity<>(status, HttpStatus.OK);
    }

}
