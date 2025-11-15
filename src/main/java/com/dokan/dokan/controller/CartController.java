package com.dokan.dokan.controller;

import com.dokan.dokan.model.Cart;
import com.dokan.dokan.service.CartService;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Data
@RestController
public class CartController {

    private CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/api/public/carts")
    public ResponseEntity<?> createCart(@RequestBody Map<String, String> request) {
        try {
            String customerEmail = request.get("customerEmail");
            
            // Validate customer email
            if (customerEmail == null || customerEmail.trim().isEmpty()) {
                return new ResponseEntity<>("Customer email is required", HttpStatus.BAD_REQUEST);
            }
            
            Cart cart = cartService.createCart(customerEmail);
            return new ResponseEntity<>(cart, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating cart: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/api/public/carts/{cartId}")
    public ResponseEntity<?> getCartById(@PathVariable("cartId") Long cartId) {
        try {
            Cart cart = cartService.getCartById(cartId);
            return new ResponseEntity<>(cart, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving cart: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/api/public/carts/customer/{email}")
    public ResponseEntity<?> getCartByCustomerEmail(@PathVariable("email") String email) {
        try {
            Cart cart = cartService.getCartByCustomerEmail(email);
            return new ResponseEntity<>(cart, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving cart: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/api/public/carts/{cartId}/items")
    public ResponseEntity<?> addItemToCart(
            @PathVariable("cartId") Long cartId,
            @RequestBody Map<String, Object> request) {
        try {
            //validate productId
            Object productIdObj = request.get("productId");
            if (productIdObj == null) {
                return new ResponseEntity<>("Product ID is required", HttpStatus.BAD_REQUEST);
            }
            Long productId = ((Number) productIdObj).longValue();
            
            //validate quantity
            Object quantityObj = request.get("quantity");
            if (quantityObj == null) {
                return new ResponseEntity<>("Quantity is required", HttpStatus.BAD_REQUEST);
            }
            Integer quantity = ((Number) quantityObj).intValue();
            
            if (quantity <= 0) {
                return new ResponseEntity<>("Quantity must be greater than zero", HttpStatus.BAD_REQUEST);
            }
            
            Cart cart = cartService.addItemToCart(cartId, productId, quantity);
            return new ResponseEntity<>(cart, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error adding item to cart: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/api/public/carts/{cartId}/items/{cartItemId}")
    public ResponseEntity<?> updateCartItemQuantity(
            @PathVariable("cartId") Long cartId,
            @PathVariable("cartItemId") Long cartItemId,
            @RequestBody Map<String, Object> request) {
        try {
            // validate quantity
            Object quantityObj = request.get("quantity");
            if (quantityObj == null) {
                return new ResponseEntity<>("Quantity is required", HttpStatus.BAD_REQUEST);
            }
            Integer quantity = ((Number) quantityObj).intValue();
            
            if (quantity < 0) {
                return new ResponseEntity<>("Quantity must be greater than or equal to zero", HttpStatus.BAD_REQUEST);
            }
            
            Cart cart = cartService.updateCartItemQuantity(cartId, cartItemId, quantity);
            return new ResponseEntity<>(cart, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating cart item: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/api/public/carts/{cartId}/items/{cartItemId}")
    public ResponseEntity<?> removeCartItem(
            @PathVariable("cartId") Long cartId,
            @PathVariable("cartItemId") Long cartItemId) {
        try {
            cartService.removeCartItem(cartId, cartItemId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Cart item removed successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error removing cart item: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/api/public/carts/{cartId}/clear")
    public ResponseEntity<?> clearCart(@PathVariable("cartId") Long cartId) {
        try {
            cartService.clearCart(cartId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Cart cleared successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error clearing cart: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
