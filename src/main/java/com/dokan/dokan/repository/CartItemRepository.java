package com.dokan.dokan.repository;

import com.dokan.dokan.model.Cart;
import com.dokan.dokan.model.CartItem;
import com.dokan.dokan.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
    
    List<CartItem> findByCart(Cart cart);
}
