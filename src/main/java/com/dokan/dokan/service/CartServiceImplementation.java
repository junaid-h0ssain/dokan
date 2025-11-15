package com.dokan.dokan.service;

import com.dokan.dokan.model.Cart;
import com.dokan.dokan.model.CartItem;
import com.dokan.dokan.model.Product;
import com.dokan.dokan.repository.CartRepository;
import com.dokan.dokan.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CartServiceImplementation implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductService productService;

    @Override
    public Cart createCart(String customerEmail) {
        validateEmail(customerEmail);
        
        Cart cart = new Cart();
        cart.setCustomerEmail(customerEmail);
        cart.setTotalAmount(0.0);
        
        return cartRepository.save(cart);
    }

    @Override
    public Cart getCartById(Long cartId) {
        return cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));
    }

    @Override
    public Cart getCartByCustomerEmail(String customerEmail) {
        return cartRepository.findByCustomerEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Cart not found for customer email: " + customerEmail));
    }

    @Override
    public Cart addItemToCart(Long cartId, Long productId, Integer quantity) {
        validateQuantity(quantity);
        
        Cart cart = getCartById(cartId);
        Product product = productService.getProductById(productId);
        
        if (product == null) {
            throw new RuntimeException("Product not found with id: " + productId);
        }
        
        Optional<CartItem> existingItem = cartItemRepository.findByCartAndProduct(cart, product);
        
        if (existingItem.isPresent()) {
            CartItem cartItem = existingItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            cartItemRepository.save(cartItem);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            newItem.setPriceAtAddition(product.getPrice());
            cartItemRepository.save(newItem);
            cart.getCartItems().add(newItem);
        }
        
        calculateTotal(cart);
        return cartRepository.save(cart);
    }

    @Override
    public Cart updateCartItemQuantity(Long cartId, Long cartItemId, Integer quantity) {
        Cart cart = getCartById(cartId);
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found with id: " + cartItemId));
        
        if (!cartItem.getCart().getCartId().equals(cartId)) {
            throw new RuntimeException("Cart item does not belong to the specified cart");
        }
        
        if (quantity == 0) {
            cart.getCartItems().remove(cartItem);
            cartItemRepository.delete(cartItem);
        } else {
            validateQuantity(quantity);
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }
        
        calculateTotal(cart);
        return cartRepository.save(cart);
    }

    @Override
    public void removeCartItem(Long cartId, Long cartItemId) {
        Cart cart = getCartById(cartId);
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found with id: " + cartItemId));
        
        if (!cartItem.getCart().getCartId().equals(cartId)) {
            throw new RuntimeException("Cart item does not belong to the specified cart");
        }
        
        cart.getCartItems().remove(cartItem);
        cartItemRepository.delete(cartItem);
        
        calculateTotal(cart);
        cartRepository.save(cart);
    }

    @Override
    public Cart clearCart(Long cartId) {
        Cart cart = getCartById(cartId);
        
        cart.getCartItems().clear();
        cartItemRepository.deleteAll(cartItemRepository.findByCart(cart));
        
        cart.setTotalAmount(0.0);
        return cartRepository.save(cart);
    }

    private void calculateTotal(Cart cart) {
        double total = cart.getCartItems().stream()
                .mapToDouble(item -> item.getQuantity() * item.getPriceAtAddition())
                .sum();
        cart.setTotalAmount(total);
    }

    private void validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer email cannot be null or empty");
        }
    }

    private void validateQuantity(Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }
    }
}
