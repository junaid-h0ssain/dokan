package com.dokan.dokan.repository;

import com.dokan.dokan.model.Product;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ProductRepo extends CrudRepository<Product, Long> {
    
    List<Product> findByCategoryCategoryId(Long categoryId);
    
    List<Product> findByProductNameContainingIgnoreCase(String keyword);
    
    List<Product> findByDescriptionContainingIgnoreCase(String keyword);
}
