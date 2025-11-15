package com.dokan.dokan.repository;

import com.dokan.dokan.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    
    Optional<Cart> findByCustomerEmail(String email);
}
