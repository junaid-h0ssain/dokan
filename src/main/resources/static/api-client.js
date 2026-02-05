// API Client for Dokan E-commerce API

class DokanAPIClient {
  constructor(baseURL = 'http://localhost:8080/api/public') {
    this.baseURL = baseURL;
  }

  /**
   * Helper method for making fetch requests with error handling
   * @param {string} endpoint - API endpoint path
   * @param {object} options - Fetch options (method, headers, body, etc.)
   * @returns {Promise<any>} - Response data or error
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle different response types
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Handle error responses
      if (!response.ok) {
        const error = new Error(typeof data === 'string' ? data : JSON.stringify(data));
        error.status = response.status;
        error.statusText = response.statusText;
        throw error;
      }

      return data;
    } catch (error) {
      // Re-throw with additional context if not already an HTTP error
      if (!error.status) {
        const networkError = new Error(`Network error: ${error.message}`);
        networkError.originalError = error;
        throw networkError;
      }
      throw error;
    }
  }

  // ==================== PRODUCT ENDPOINTS ====================

  /**
   * Get all products
   * @returns {Promise<Array>} - List of all products
   */
  async getAllProducts() {
    return this.request('/products');
  }

  /**
   * Get product by ID
   * @param {number} productId - Product ID
   * @returns {Promise<object>} - Product details
   */
  async getProductById(productId) {
    return this.request(`/products/${productId}`);
  }

  /**
   * Create a new product
   * @param {object} productData - Product data (productName, description, price, quantity, expiryDate, categoryId)
   * @returns {Promise<object>} - Created product
   */
  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  /**
   * Update an existing product
   * @param {number} productId - Product ID
   * @param {object} productData - Updated product data
   * @returns {Promise<object>} - Updated product
   */
  async updateProduct(productId, productData) {
    return this.request(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  /**
   * Delete a product
   * @param {number} productId - Product ID
   * @returns {Promise<string>} - Success message
   */
  async deleteProduct(productId) {
    return this.request(`/products/${productId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get products by category
   * @param {number} categoryId - Category ID
   * @returns {Promise<Array>} - List of products in the category
   */
  async getProductsByCategory(categoryId) {
    return this.request(`/categories/${categoryId}/products`);
  }

  /**
   * Search products by keyword
   * @param {string} keyword - Search keyword
   * @returns {Promise<Array>} - List of matching products
   */
  async searchProducts(keyword) {
    return this.request(`/products/search?keyword=${encodeURIComponent(keyword)}`);
  }

  // ==================== CATEGORY ENDPOINTS ====================

  /**
   * Get all categories
   * @returns {Promise<Array>} - List of all categories
   */
  async getAllCategories() {
    return this.request('/categories');
  }

  /**
   * Get category by ID
   * @param {number} categoryId - Category ID
   * @returns {Promise<object>} - Category details
   */
  async getCategoryById(categoryId) {
    return this.request(`/categories/${categoryId}`);
  }

  /**
   * Create a new category
   * @param {string} categoryName - Category name
   * @returns {Promise<object>} - Created category
   */
  async createCategory(categoryName) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify({ categoryName }),
    });
  }

  /**
   * Update category name
   * @param {number} categoryId - Category ID
   * @param {string} newCategoryName - New category name
   * @returns {Promise<object>} - Updated category
   */
  async updateCategory(categoryId, newCategoryName) {
    return this.request(`/categories/${categoryId}/${encodeURIComponent(newCategoryName)}`, {
      method: 'PUT',
    });
  }

  /**
   * Delete a category
   * @param {number} categoryId - Category ID
   * @returns {Promise<string>} - Success message
   */
  async deleteCategory(categoryId) {
    return this.request(`/categories/${categoryId}`, {
      method: 'DELETE',
    });
  }

  // ==================== CART ENDPOINTS ====================

  /**
   * Create a new shopping cart
   * @param {string} customerEmail - Customer email
   * @returns {Promise<object>} - Created cart
   */
  async createCart(customerEmail) {
    return this.request('/carts', {
      method: 'POST',
      body: JSON.stringify({ customerEmail }),
    });
  }

  /**
   * Get cart by ID
   * @param {number} cartId - Cart ID
   * @returns {Promise<object>} - Cart details
   */
  async getCartById(cartId) {
    return this.request(`/carts/${cartId}`);
  }

  /**
   * Get cart by customer email
   * @param {string} email - Customer email
   * @returns {Promise<object>} - Cart details
   */
  async getCartByCustomerEmail(email) {
    return this.request(`/carts/customer/${encodeURIComponent(email)}`);
  }

  /**
   * Add item to cart
   * @param {number} cartId - Cart ID
   * @param {number} productId - Product ID
   * @param {number} quantity - Quantity to add
   * @returns {Promise<object>} - Updated cart
   */
  async addItemToCart(cartId, productId, quantity) {
    return this.request(`/carts/${cartId}/items`, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  /**
   * Update cart item quantity
   * @param {number} cartId - Cart ID
   * @param {number} cartItemId - Cart item ID
   * @param {number} quantity - New quantity
   * @returns {Promise<object>} - Updated cart
   */
  async updateCartItemQuantity(cartId, cartItemId, quantity) {
    return this.request(`/carts/${cartId}/items/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  /**
   * Remove item from cart
   * @param {number} cartId - Cart ID
   * @param {number} cartItemId - Cart item ID
   * @returns {Promise<string>} - Success message
   */
  async removeItemFromCart(cartId, cartItemId) {
    return this.request(`/carts/${cartId}/items/${cartItemId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Clear all items from cart
   * @param {number} cartId - Cart ID
   * @returns {Promise<string>} - Success message
   */
  async clearCart(cartId) {
    return this.request(`/carts/${cartId}`, {
      method: 'DELETE',
    });
  }

  // ==================== ORDER ENDPOINTS ====================

  /**
   * Create a new order
   * @param {object} orderData - Order data (customerName, customerEmail, customerPhone, shipping details, paymentMethod, orderItems)
   * @returns {Promise<object>} - Created order
   */
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  /**
   * Get all orders
   * @returns {Promise<Array>} - List of all orders
   */
  async getAllOrders() {
    return this.request('/orders');
  }

  /**
   * Get order by ID
   * @param {number} orderId - Order ID
   * @returns {Promise<object>} - Order details
   */
  async getOrderById(orderId) {
    return this.request(`/orders/${orderId}`);
  }

  /**
   * Get orders by customer email
   * @param {string} email - Customer email
   * @returns {Promise<Array>} - List of customer orders
   */
  async getOrdersByCustomerEmail(email) {
    return this.request(`/orders/customer/${encodeURIComponent(email)}`);
  }

  /**
   * Get orders by status
   * @param {string} status - Order status (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
   * @returns {Promise<Array>} - List of orders with the specified status
   */
  async getOrdersByStatus(status) {
    return this.request(`/orders/status/${status}`);
  }

  /**
   * Update order status
   * @param {number} orderId - Order ID
   * @param {string} newStatus - New order status
   * @returns {Promise<object>} - Updated order
   */
  async updateOrderStatus(orderId, newStatus) {
    return this.request(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ orderStatus: newStatus }),
    });
  }

  /**
   * Delete an order
   * @param {number} orderId - Order ID
   * @returns {Promise<string>} - Success message
   */
  async deleteOrder(orderId) {
    return this.request(`/orders/${orderId}`, {
      method: 'DELETE',
    });
  }
}
