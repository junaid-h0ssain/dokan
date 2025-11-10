package com.dokan.dokan.service;

import com.dokan.dokan.model.Product;
import com.dokan.dokan.repository.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ProductServiceImplementation implements ProductService {

    @Autowired
    private ProductRepo productRepo;

    @Override
    public List<Product> getAllProducts() {
        return (List<Product>) productRepo.findAll();
    }

    @Override
    public Product getProductById(Long productId) {
        return productRepo.findById(productId).orElse(null);
    }

    @Override
    public void createProduct(Product product) {
        if (product.getPrice() < 0) {
            throw new IllegalArgumentException("Price must be greater than or equal to zero");
        }
        if (product.getQuantity() < 0) {
            throw new IllegalArgumentException("Quantity must be greater than or equal to zero");
        }
        productRepo.save(product);
    }

    @Override
    public String updateProduct(Long productId, Product productDetails) {
        Product existingProduct = getProductById(productId);
        if (existingProduct == null) {
            return "Product not found";
        }
        
        if (productDetails.getPrice() < 0) {
            throw new IllegalArgumentException("Price must be greater than or equal to zero");
        }
        if (productDetails.getQuantity() < 0) {
            throw new IllegalArgumentException("Quantity must be greater than or equal to zero");
        }
        
        existingProduct.setProductName(productDetails.getProductName());
        existingProduct.setDescription(productDetails.getDescription());
        existingProduct.setPrice(productDetails.getPrice());
        existingProduct.setQuantity(productDetails.getQuantity());
        existingProduct.setCategory(productDetails.getCategory());
        
        productRepo.save(existingProduct);
        return "Product updated successfully";
    }

    @Override
    public Boolean deleteProduct(Long productId) {
        Product product = getProductById(productId);
        if (product == null) {
            return false;
        }
        productRepo.deleteById(productId);
        return true;
    }

    @Override
    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepo.findByCategoryCategoryId(categoryId);
    }

    @Override
    public List<Product> searchProducts(String keyword) {
        List<Product> nameResults = productRepo.findByProductNameContainingIgnoreCase(keyword);
        List<Product> descriptionResults = productRepo.findByDescriptionContainingIgnoreCase(keyword);
        
        Set<Product> combinedResults = new HashSet<>();
        combinedResults.addAll(nameResults);
        combinedResults.addAll(descriptionResults);
        
        return new ArrayList<>(combinedResults);
    }
}
