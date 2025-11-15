package com.dokan.dokan.service;

import com.dokan.dokan.model.Cart;

public interface CartService {
    Cart createCart(String customerEmail);
    Cart getCartById(Long cartId);
    Cart getCartByCustomerEmail(String customerEmail);
    Cart addItemToCart(Long cartId, Long productId, Integer quantity);
    Cart updateCartItemQuantity(Long cartId, Long cartItemId, Integer quantity);
    void removeCartItem(Long cartId, Long cartItemId);
    Cart clearCart(Long cartId);
}
