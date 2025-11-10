package com.dokan.dokan.service;

import com.dokan.dokan.model.Product;

import java.util.List;

public interface ProductService {
    List<Product> getAllProducts();
    Product getProductById(Long productId);
    void createProduct(Product product);
    String updateProduct(Long productId, Product productDetails);
    Boolean deleteProduct(Long productId);
    List<Product> getProductsByCategory(Long categoryId);
    List<Product> searchProducts(String keyword);
}
