package com.dokan.dokan.service;

import com.dokan.dokan.model.Category;
import com.dokan.dokan.model.Product;
import com.dokan.dokan.repository.ProductRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplementationTest {

    @Mock
    private ProductRepo productRepo;

    @InjectMocks
    private ProductServiceImplementation productService;

    private Product testProduct;
    private Category testCategory;

    @BeforeEach
    void setUp() {
        testCategory = new Category(1L, "Electronics");
        testProduct = new Product(1L, "Laptop", "High-performance laptop", 999.99, 10, LocalDate.now().plusMonths(6), testCategory);
    }

    @Test
    void getAllProducts_WithEmptyList_ReturnsEmptyList() {
        when(productRepo.findAll()).thenReturn(new ArrayList<>());

        List<Product> result = productService.getAllProducts();

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(productRepo, times(1)).findAll();
    }

    @Test
    void getAllProducts_WithPopulatedList_ReturnsAllProducts() {
        Product product2 = new Product(2L, "Mouse", "Wireless mouse", 29.99, 50, LocalDate.now().plusMonths(12), testCategory);
        List<Product> products = Arrays.asList(testProduct, product2);
        when(productRepo.findAll()).thenReturn(products);

        List<Product> result = productService.getAllProducts();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Laptop", result.get(0).getProductName());
        assertEquals("Mouse", result.get(1).getProductName());
        verify(productRepo, times(1)).findAll();
    }

    @Test
    void getProductById_WithValidId_ReturnsProduct() {
        when(productRepo.findById(1L)).thenReturn(Optional.of(testProduct));

        Product result = productService.getProductById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getProductId());
        assertEquals("Laptop", result.getProductName());
        verify(productRepo, times(1)).findById(1L);
    }

    @Test
    void getProductById_WithInvalidId_ReturnsNull() {
        when(productRepo.findById(999L)).thenReturn(Optional.empty());

        Product result = productService.getProductById(999L);

        assertNull(result);
        verify(productRepo, times(1)).findById(999L);
    }

    @Test
    void createProduct_WithValidData_SavesProduct() {
        when(productRepo.save(any(Product.class))).thenReturn(testProduct);

        assertDoesNotThrow(() -> productService.createProduct(testProduct));
        verify(productRepo, times(1)).save(testProduct);
    }

    @Test
    void createProduct_WithNegativePrice_ThrowsException() {
        testProduct.setPrice(-10.0);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, 
            () -> productService.createProduct(testProduct));

        assertEquals("Price must be greater than or equal to zero", exception.getMessage());
        verify(productRepo, never()).save(any(Product.class));
    }

    @Test
    void createProduct_WithNegativeQuantity_ThrowsException() {
        testProduct.setQuantity(-5);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, 
            () -> productService.createProduct(testProduct));

        assertEquals("Quantity must be greater than or equal to zero", exception.getMessage());
        verify(productRepo, never()).save(any(Product.class));
    }

    @Test
    void createProduct_WithZeroPrice_SavesProduct() {
        testProduct.setPrice(0.0);
        when(productRepo.save(any(Product.class))).thenReturn(testProduct);

        assertDoesNotThrow(() -> productService.createProduct(testProduct));
        verify(productRepo, times(1)).save(testProduct);
    }

    @Test
    void createProduct_WithZeroQuantity_SavesProduct() {
        testProduct.setQuantity(0);
        when(productRepo.save(any(Product.class))).thenReturn(testProduct);

        assertDoesNotThrow(() -> productService.createProduct(testProduct));
        verify(productRepo, times(1)).save(testProduct);
    }

    @Test
    void updateProduct_WithExistingProduct_UpdatesSuccessfully() {
        Product updatedDetails = new Product(null, "Updated Laptop", "New description", 1099.99, 15, LocalDate.now().plusMonths(12), testCategory);
        when(productRepo.findById(1L)).thenReturn(Optional.of(testProduct));
        when(productRepo.save(any(Product.class))).thenReturn(testProduct);

        String result = productService.updateProduct(1L, updatedDetails);

        assertEquals("Product updated successfully", result);
        assertEquals("Updated Laptop", testProduct.getProductName());
        assertEquals("New description", testProduct.getDescription());
        assertEquals(1099.99, testProduct.getPrice());
        assertEquals(15, testProduct.getQuantity());
        verify(productRepo, times(1)).findById(1L);
        verify(productRepo, times(1)).save(testProduct);
    }

    @Test
    void updateProduct_WithNonExistentProduct_ReturnsNotFound() {
        Product updatedDetails = new Product(null, "Updated Laptop", "New description", 1099.99, 15, LocalDate.now().plusMonths(12), testCategory);
        when(productRepo.findById(999L)).thenReturn(Optional.empty());

        String result = productService.updateProduct(999L, updatedDetails);

        assertEquals("Product not found", result);
        verify(productRepo, times(1)).findById(999L);
        verify(productRepo, never()).save(any(Product.class));
    }

    @Test
    void updateProduct_WithNegativePrice_ThrowsException() {
        Product updatedDetails = new Product(null, "Updated Laptop", "New description", -100.0, 15, LocalDate.now().plusMonths(12), testCategory);
        when(productRepo.findById(1L)).thenReturn(Optional.of(testProduct));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, 
            () -> productService.updateProduct(1L, updatedDetails));

        assertEquals("Price must be greater than or equal to zero", exception.getMessage());
        verify(productRepo, times(1)).findById(1L);
        verify(productRepo, never()).save(any(Product.class));
    }

    @Test
    void updateProduct_WithNegativeQuantity_ThrowsException() {
        Product updatedDetails = new Product(null, "Updated Laptop", "New description", 1099.99, -5, LocalDate.now().plusMonths(12), testCategory);
        when(productRepo.findById(1L)).thenReturn(Optional.of(testProduct));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, 
            () -> productService.updateProduct(1L, updatedDetails));

        assertEquals("Quantity must be greater than or equal to zero", exception.getMessage());
        verify(productRepo, times(1)).findById(1L);
        verify(productRepo, never()).save(any(Product.class));
    }

    @Test
    void deleteProduct_WithExistingProduct_ReturnsTrue() {
        when(productRepo.findById(1L)).thenReturn(Optional.of(testProduct));
        doNothing().when(productRepo).deleteById(1L);

        Boolean result = productService.deleteProduct(1L);

        assertTrue(result);
        verify(productRepo, times(1)).findById(1L);
        verify(productRepo, times(1)).deleteById(1L);
    }

    @Test
    void deleteProduct_WithNonExistentProduct_ReturnsFalse() {
        when(productRepo.findById(999L)).thenReturn(Optional.empty());

        Boolean result = productService.deleteProduct(999L);

        assertFalse(result);
        verify(productRepo, times(1)).findById(999L);
        verify(productRepo, never()).deleteById(anyLong());
    }

    @Test
    void getProductsByCategory_WithValidCategory_ReturnsProducts() {
        Product product2 = new Product(2L, "Keyboard", "Mechanical keyboard", 79.99, 25, LocalDate.now().plusMonths(12), testCategory);
        List<Product> categoryProducts = Arrays.asList(testProduct, product2);
        when(productRepo.findByCategoryCategoryId(1L)).thenReturn(categoryProducts);

        List<Product> result = productService.getProductsByCategory(1L);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Laptop", result.get(0).getProductName());
        assertEquals("Keyboard", result.get(1).getProductName());
        verify(productRepo, times(1)).findByCategoryCategoryId(1L);
    }

    @Test
    void searchProducts_WithKeywordInName_ReturnsMatchingProducts() {
        List<Product> nameResults = Arrays.asList(testProduct);
        List<Product> descriptionResults = new ArrayList<>();
        when(productRepo.findByProductNameContainingIgnoreCase("Laptop")).thenReturn(nameResults);
        when(productRepo.findByDescriptionContainingIgnoreCase("Laptop")).thenReturn(descriptionResults);

        List<Product> result = productService.searchProducts("Laptop");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Laptop", result.get(0).getProductName());
        verify(productRepo, times(1)).findByProductNameContainingIgnoreCase("Laptop");
        verify(productRepo, times(1)).findByDescriptionContainingIgnoreCase("Laptop");
    }

    @Test
    void searchProducts_WithKeywordInDescription_ReturnsMatchingProducts() {
        List<Product> nameResults = new ArrayList<>();
        List<Product> descriptionResults = Arrays.asList(testProduct);
        when(productRepo.findByProductNameContainingIgnoreCase("performance")).thenReturn(nameResults);
        when(productRepo.findByDescriptionContainingIgnoreCase("performance")).thenReturn(descriptionResults);

        List<Product> result = productService.searchProducts("performance");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Laptop", result.get(0).getProductName());
        verify(productRepo, times(1)).findByProductNameContainingIgnoreCase("performance");
        verify(productRepo, times(1)).findByDescriptionContainingIgnoreCase("performance");
    }

    @Test
    void searchProducts_WithKeywordInBothNameAndDescription_ReturnsUniqueProducts() {
        Product product2 = new Product(2L, "Gaming Laptop", "High-performance gaming laptop", 1499.99, 5, LocalDate.now().plusMonths(6), testCategory);
        List<Product> nameResults = Arrays.asList(testProduct, product2);
        List<Product> descriptionResults = Arrays.asList(testProduct);
        when(productRepo.findByProductNameContainingIgnoreCase("Laptop")).thenReturn(nameResults);
        when(productRepo.findByDescriptionContainingIgnoreCase("Laptop")).thenReturn(descriptionResults);

        List<Product> result = productService.searchProducts("Laptop");

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(productRepo, times(1)).findByProductNameContainingIgnoreCase("Laptop");
        verify(productRepo, times(1)).findByDescriptionContainingIgnoreCase("Laptop");
    }

    @Test
    void searchProducts_WithNoMatches_ReturnsEmptyList() {
        when(productRepo.findByProductNameContainingIgnoreCase("NonExistent")).thenReturn(new ArrayList<>());
        when(productRepo.findByDescriptionContainingIgnoreCase("NonExistent")).thenReturn(new ArrayList<>());

        List<Product> result = productService.searchProducts("NonExistent");

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(productRepo, times(1)).findByProductNameContainingIgnoreCase("NonExistent");
        verify(productRepo, times(1)).findByDescriptionContainingIgnoreCase("NonExistent");
    }
}
