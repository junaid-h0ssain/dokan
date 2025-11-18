package com.dokan.dokan.service;

import com.dokan.dokan.model.Order;
import com.dokan.dokan.model.OrderItem;
import com.dokan.dokan.model.OrderStatus;
import com.dokan.dokan.model.Product;
import com.dokan.dokan.repository.OrderRepository;
import com.dokan.dokan.repository.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderServiceImplementation implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepo productRepo;

    @Override
    public Order createOrder(Order order) {
        // Set price for each order item from the product
        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                if (item.getPriceAtOrder() == null && item.getProduct() != null) {
                    Product product = productRepo.findById(item.getProduct().getProductId()).orElse(null);
                    if (product != null) {
                        item.setPriceAtOrder(product.getPrice());
                    }
                }
                item.setOrder(order);
            }
        }

        // Calculate and set total amount
        Double totalAmount = calculateOrderTotal(order);
        order.setTotalAmount(totalAmount);

        // Set bidirectional relationship for order items
        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                item.setOrder(order);
            }
        }
        
        // Save order (timestamps and status will be set by @PrePersist)
        return orderRepository.save(order);
    }

    @Override
    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId).orElse(null);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public List<Order> getOrdersByCustomerEmail(String email) {
        return orderRepository.findByCustomerEmail(email);
    }

    @Override
    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByOrderStatus(status);
    }

    @Override
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order existingOrder = getOrderById(orderId);
        if (existingOrder == null) {
            return null;
        }
        
        existingOrder.setOrderStatus(newStatus);
        // updatedAt will be set automatically by @PreUpdate
        
        return orderRepository.save(existingOrder);
    }

    @Override
    public void deleteOrder(Long orderId) {
        orderRepository.deleteById(orderId);
    }

    private Double calculateOrderTotal(Order order) {
        if (order.getOrderItems() == null || order.getOrderItems().isEmpty()) {
            return 0.0;
        }
        
        return order.getOrderItems().stream()
                .mapToDouble(item -> {
                    Double price = item.getPriceAtOrder() != null ? item.getPriceAtOrder() : 0.0;
                    Integer qty = item.getQuantity() != null ? item.getQuantity() : 0;
                    return price * qty;
                })
                .sum();
    }
}
