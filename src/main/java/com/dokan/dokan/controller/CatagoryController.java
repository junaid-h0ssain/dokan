package com.dokan.dokan.controller;

import com.dokan.dokan.service.CatagoryService;
import lombok.Data;
import com.dokan.dokan.model.Category;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Data
@RestController
public class CatagoryController {

    // catagoryservice class
    private CatagoryService catagoryService;

    //constructor
    public CatagoryController(CatagoryService catagoryService) {
        this.catagoryService = catagoryService;
    }

    //get function
    @GetMapping("api/public/categories")
    public List<Category> getCategories() {
        return catagoryService.getAllCategories();
    }

    //get func
    @GetMapping("api/public/catagories/{catagoryId}")
    public Category getCategoryById(@PathVariable("catagoryId") Long catagoryId) {
        return catagoryService.getCategoryById(catagoryId);
    }

    //post function
    @PostMapping("api/public/categories")
    public String addCategory(@RequestBody Category category) {
        catagoryService.createCategory(category);
        return "Category added";
    }

    //delete func
    @DeleteMapping("api/public/categories/{catagoryId}")
    public String deleteCategory(@PathVariable Long catagoryId) {
        return catagoryService.deleteCategory(catagoryId);
    }
}
