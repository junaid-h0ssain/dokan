package com.dokan.dokan.controller;

import com.dokan.dokan.model.Order;
import com.dokan.dokan.model.OrderStatus;
import com.dokan.dokan.service.OrderService;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Data
@RestController
public class OrderController {

    private OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/api/public/orders")
    public ResponseEntity<String> createOrder(@RequestBody Order order) {
        // Validate order has at least one order item
        if (order.getOrderItems() == null || order.getOrderItems().isEmpty()) {
            return new ResponseEntity<>("Order must contain at least one item", HttpStatus.BAD_REQUEST);
        }

        if (order.getCustomerName() == null || order.getCustomerName().trim().isEmpty() ||
            order.getCustomerEmail() == null || order.getCustomerEmail().trim().isEmpty() ||
            order.getCustomerPhone() == null || order.getCustomerPhone().trim().isEmpty()) {
            return new ResponseEntity<>("Customer name, email, and phone are required", HttpStatus.BAD_REQUEST);
        }

        if (order.getShippingAddress() == null || order.getShippingAddress().trim().isEmpty() ||
            order.getShippingCity() == null || order.getShippingCity().trim().isEmpty() ||
            order.getShippingState() == null || order.getShippingState().trim().isEmpty() ||
            order.getShippingPostalCode() == null || order.getShippingPostalCode().trim().isEmpty() ||
            order.getShippingCountry() == null || order.getShippingCountry().trim().isEmpty()) {
            return new ResponseEntity<>("Complete shipping address is required", HttpStatus.BAD_REQUEST);
        }

        for (var item : order.getOrderItems()) {
            if (item.getQuantity() == null || item.getQuantity() <= 0) {
                return new ResponseEntity<>("Quantity must be greater than zero", HttpStatus.BAD_REQUEST);
            }
        }

        if (order.getPaymentMethod() == null) {
            return new ResponseEntity<>("Valid payment method is required", HttpStatus.BAD_REQUEST);
        }

        Order createdOrder = orderService.createOrder(order);
        return new ResponseEntity<>("Order created successfully with ID: " + createdOrder.getOrderId(), HttpStatus.CREATED);
    }

    @GetMapping("/api/public/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/api/public/orders/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable("orderId") Long orderId) {
        Order order = orderService.getOrderById(orderId);
        if (order == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    @GetMapping("/api/public/orders/customer/{email}")
    public ResponseEntity<List<Order>> getOrdersByCustomerEmail(@PathVariable("email") String email) {
        List<Order> orders = orderService.getOrdersByCustomerEmail(email);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/api/public/orders/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable("status") OrderStatus status) {
        List<Order> orders = orderService.getOrdersByStatus(status);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @PutMapping("/api/public/orders/{orderId}/status")
    public ResponseEntity<String> updateOrderStatus(@PathVariable("orderId") Long orderId, @RequestBody OrderStatus newStatus) {
        if (newStatus == null) {
            return new ResponseEntity<>("Valid order status is required", HttpStatus.BAD_REQUEST);
        }

        Order updatedOrder = orderService.updateOrderStatus(orderId, newStatus);
        if (updatedOrder == null) {
            return new ResponseEntity<>("Order with ID " + orderId + " not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>("Order status updated successfully", HttpStatus.OK);
    }

    @DeleteMapping("/api/public/orders/{orderId}")
    public ResponseEntity<String> deleteOrder(@PathVariable("orderId") Long orderId) {
        Order order = orderService.getOrderById(orderId);
        if (order == null) {
            return new ResponseEntity<>("Order with ID " + orderId + " not found", HttpStatus.NOT_FOUND);
        }
        
        orderService.deleteOrder(orderId);
        return new ResponseEntity<>("Order " + orderId + " deleted successfully", HttpStatus.OK);
    }
}
