# Dokan E-commerce API - Setup Instructions

## Overview

The test webapp has been integrated into the Spring Boot application. The frontend (HTML, CSS, JS) is now served directly from the Spring Boot server, eliminating the need for a separate Node.js server.

## Prerequisites

1. **Java 25** - Required for the Spring Boot application
2. **MySQL** - Database server running on localhost:3306
3. **Maven** - For building and running the application

## Setup Steps

### 1. Create the Database

Connect to MySQL and create the database:

```sql
CREATE DATABASE IF NOT EXISTS dokan;
```

### 2. Configure Database Credentials

Edit `src/main/resources/application-mysql.properties` and update the credentials if needed:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/dokan
spring.datasource.username=root
spring.datasource.password=4466
```

### 3. Run the Application

From the project root directory, run:

```bash
mvn spring-boot:run
```

Or build and run the JAR:

```bash
mvn clean package
java -jar target/dokan-0.0.1-SNAPSHOT.jar
```

### 4. Access the Application

Open your browser and navigate to:

```
http://localhost:8080/
```

## API Endpoints

The API is available at:

```
http://localhost:8080/api/public
```

### Available Endpoints

- **Products**: `/api/public/products`
- **Categories**: `/api/public/categories`
- **Shopping Cart**: `/api/public/carts`
- **Orders**: `/api/public/orders`

## Features

The integrated test webapp provides:

- **Products Management**: View, create, update, and delete products
- **Categories Management**: Manage product categories
- **Shopping Cart**: Create carts, add/remove items, manage quantities
- **Orders**: Create orders, view order details, update order status

## Troubleshooting

### Port Already in Use

If port 8080 is already in use, change it in `application.properties`:

```properties
server.port=8081
```

### Database Connection Issues

Ensure MySQL is running and the credentials are correct. Check the logs for connection errors.

### Static Files Not Loading

Verify that files are in the correct locations:
- Static files: `src/main/resources/static/`
- Templates: `src/main/resources/templates/`

## Architecture

```
Spring Boot Application (Port 8080)
├── API Endpoints (/api/public/*)
├── Static Resources (/static/*)
│   ├── api-client.js
│   ├── app.js
│   └── styles.css
└── Templates (/templates/*)
    └── index.html
```

## Notes

- The frontend uses relative URLs to communicate with the API
- All static resources are served from the Spring Boot server
- No separate frontend server is needed
- The application uses H2 database by default for testing (can be changed to MySQL)
