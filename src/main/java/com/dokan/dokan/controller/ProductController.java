package com.dokan.dokan.controller;

import com.dokan.dokan.model.Product;
import com.dokan.dokan.service.ProductService;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Data
@RestController
public class ProductController {

    private ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/api/public/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/api/public/products/{productId}")
    public ResponseEntity<Product> getProductById(@PathVariable("productId") Long productId) {
        Product product = productService.getProductById(productId);
        if (product == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @GetMapping("/api/public/categories/{categoryId}/products")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable("categoryId") Long categoryId) {
        List<Product> products = productService.getProductsByCategory(categoryId);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/api/public/products/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam("keyword") String keyword) {
        List<Product> products = productService.searchProducts(keyword);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @PostMapping("/api/public/products")
    public ResponseEntity<String> createProduct(@RequestBody Product product) {
        // Validate price and quantity
        if (product.getPrice() != null && product.getPrice() < 0) {
            return new ResponseEntity<>("Price must be greater than or equal to zero", HttpStatus.BAD_REQUEST);
        }
        if (product.getQuantity() != null && product.getQuantity() < 0) {
            return new ResponseEntity<>("Quantity must be greater than or equal to zero", HttpStatus.BAD_REQUEST);
        }
        
        productService.createProduct(product);
        return new ResponseEntity<>("Product created successfully", HttpStatus.CREATED);
    }

    @PutMapping("/api/public/products/{productId}")
    public ResponseEntity<String> updateProduct(@PathVariable("productId") Long productId, @RequestBody Product productDetails) {
        // Validate price and quantity
        if (productDetails.getPrice() != null && productDetails.getPrice() < 0) {
            return new ResponseEntity<>("Price must be greater than or equal to zero", HttpStatus.BAD_REQUEST);
        }
        if (productDetails.getQuantity() != null && productDetails.getQuantity() < 0) {
            return new ResponseEntity<>("Quantity must be greater than or equal to zero", HttpStatus.BAD_REQUEST);
        }
        
        String result = productService.updateProduct(productId, productDetails);
        if (result.contains("not found") || result.contains("does not exist")) {
            return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping("/api/public/products/{productId}")
    public ResponseEntity<String> deleteProduct(@PathVariable("productId") Long productId) {
        Boolean status = productService.deleteProduct(productId);
        if (status) {
            return new ResponseEntity<>("Product " + productId + " deleted successfully", HttpStatus.OK);
        }
        return new ResponseEntity<>("Product not found or does not exist", HttpStatus.NOT_FOUND);
    }
}
