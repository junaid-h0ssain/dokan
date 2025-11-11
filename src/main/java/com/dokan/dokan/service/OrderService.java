package com.dokan.dokan.service;

import com.dokan.dokan.model.Order;
import com.dokan.dokan.model.OrderStatus;

import java.util.List;

public interface OrderService {
    Order createOrder(Order order);
    Order getOrderById(Long orderId);
    List<Order> getAllOrders();
    List<Order> getOrdersByCustomerEmail(String email);
    List<Order> getOrdersByStatus(OrderStatus status);
    Order updateOrderStatus(Long orderId, OrderStatus newStatus);
    void deleteOrder(Long orderId);
}
