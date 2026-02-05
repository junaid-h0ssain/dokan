# Dokan - E-Commerce API Backend

## Overview

Dokan is a Java-based REST API backend for an e-commerce platform. It provides comprehensive functionality for managing products, categories, orders, shopping carts, and user authentication.

## Project Structure

This is a **Spring Boot** application built with Maven, providing a fully-featured backend for an online shopping system.

## Key Features

### 1. **Authentication & User Management**
- User registration with email and password
- User login with JWT token-based authentication
- Secure password handling

### 2. **Product Management**
- Create, read, update, and delete products
- Search products by keyword
- Organize products into categories
- Track product inventory and expiry dates
- Display product details including price and description

### 3. **Category Management**
- Create and manage product categories
- View all categories
- Update category names
- Delete categories
- List products by category

### 4. **Shopping Cart**
- Create shopping carts for customers
- Add items to cart with quantity
- Update item quantities
- Remove items from cart
- Clear entire cart
- Retrieve cart by ID or customer email

### 5. **Order Management**
- Create orders from cart items
- Track order status (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
- View all orders or filter by status
- Retrieve orders by customer email
- Update order status
- Delete orders
- Support multiple payment methods (Credit Card, Debit Card, PayPal, etc.)
- Store shipping address and customer information

## Technology Stack

- **Language**: Java
- **Framework**: Spring Boot
- **Build Tool**: Maven
- **Databases Supported**: H2, MySQL, PostgreSQL
- **Security**: JWT Token-based Authentication
- **API Documentation**: OpenAPI/Swagger

## Core Entities

### User
- Email and password authentication
- Creation and update timestamps

### Product
- Product name, description, and price
- Inventory quantity tracking
- Expiry date management
- Category association

### Category
- Category name
- Collection of associated products

### Cart
- User/customer email tracking
- Multiple cart items
- Dynamic quantity management

### Order
- Complete customer information (name, email, phone)
- Shipping address details (address, city, state, postal code, country)
- Order status tracking
- Payment method selection
- Total amount calculation
- Order items with product details and pricing at time of order
- Timestamps for creation and updates

### OrderItem
- Link between order and products
- Quantity per item
- Price captured at time of order

## API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and receive JWT token

### Products
- `GET /api/public/products` - Get all products
- `POST /api/public/products` - Create product
- `GET /api/public/products/{productId}` - Get product details
- `PUT /api/public/products/{productId}` - Update product
- `DELETE /api/public/products/{productId}` - Delete product
- `GET /api/public/products/search?keyword=` - Search products
- `GET /api/public/categories/{categoryId}/products` - Get products by category

### Categories
- `GET /api/public/categories` - Get all categories
- `POST /api/public/categories` - Create category
- `GET /api/public/categories/{categoryId}` - Get category details
- `PUT /api/public/categories/{categoryId}/{newcategoryName}` - Update category
- `DELETE /api/public/categories/{categoryId}` - Delete category

### Shopping Cart
- `POST /api/public/carts` - Create cart
- `GET /api/public/carts/{cartId}` - Get cart details
- `GET /api/public/carts/customer/{email}` - Get cart by customer email
- `POST /api/public/carts/{cartId}/items` - Add item to cart
- `PUT /api/public/carts/{cartId}/items/{cartItemId}` - Update item quantity
- `DELETE /api/public/carts/{cartId}/items/{cartItemId}` - Remove item from cart
- `DELETE /api/public/carts/{cartId}/clear` - Clear entire cart

### Orders
- `GET /api/public/orders` - Get all orders
- `POST /api/public/orders` - Create order
- `GET /api/public/orders/{orderId}` - Get order details
- `DELETE /api/public/orders/{orderId}` - Delete order
- `GET /api/public/orders/status/{status}` - Get orders by status
- `GET /api/public/orders/customer/{email}` - Get orders by customer email
- `PUT /api/public/orders/{orderId}/status` - Update order status

## Getting Started

### Prerequisites
- Java 11 or higher
- Maven 3.6+

### Running the Application

```bash
./mvnw spring-boot:run
```

### Database Configuration

The application supports multiple databases via profiles:
- **H2** (in-memory, default for development): `application-h2.properties`
- **MySQL**: `application-mysql.properties`
- **PostgreSQL**: `application-postgresql.properties`

Activate a profile:
```bash
./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=mysql"
```

## API Documentation

Once the application is running, access the interactive Swagger UI at:
```
http://localhost:8080/swagger-ui.html
```

The OpenAPI specification is available at:
```
http://localhost:8080/v3/api-docs
```

## Project Purpose

Dokan is designed to serve as a complete backend solution for an e-commerce platform, providing all necessary APIs for:
- User account management
- Product catalog management
- Shopping experience (cart management)
- Order processing and fulfillment
- Inventory management

It can be used as-is for a standalone e-commerce backend or integrated with a frontend application.
