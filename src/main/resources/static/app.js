// Main application logic and UI management

/**
 * UIManager class handles all user interface interactions and updates
 */
class UIManager {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.currentSection = 'products';
    this.allProducts = [];
    this.allCategories = [];
    this.searchDebounceTimer = null;
    this.currentCartId = null;
    this.currentCustomerEmail = null;
    this.initializeNavigation();
  }

  /**
   * Initialize navigation menu click handlers
   */
  initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const section = item.getAttribute('data-section');
        this.showSection(section);
      });
    });
  }

  /**
   * Show a specific section and hide others
   * @param {string} sectionName - Name of the section to show (products, categories, cart, orders)
   */
  showSection(sectionName) {
    // Update current section
    this.currentSection = sectionName;

    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
      section.classList.remove('active');
    });

    // Show the selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Update navigation menu active state
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-section') === sectionName) {
        item.classList.add('active');
      }
    });

    // Load section-specific data
    if (sectionName === 'categories') {
      this.loadCategoriesForDisplay();
    } else if (sectionName === 'cart') {
      this.showCartCreationForm();
    } else if (sectionName === 'orders') {
      this.initializeOrdersSection();
    }
  }

  /**
   * Display a success toast notification
   * @param {string} message - Success message to display
   */
  showSuccess(message) {
    this.showToast(message, 'success');
  }

  /**
   * Display an error toast notification
   * @param {string} message - Error message to display
   */
  showError(message) {
    this.showToast(message, 'error');
  }

  /**
   * Display a toast notification
   * @param {string} message - Message to display
   * @param {string} type - Type of toast (success or error)
   */
  showToast(message, type) {
    const toastContainer = document.getElementById('toast-container');
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  /**
   * Show or hide loading indicator
   * @param {boolean} isLoading - True to show loading, false to hide
   */
  showLoading(isLoading) {
    console.log("yo oyo oy")
    
  }

  /**
   * Display products in a grid
   * @param {Array} products - Array of product objects
   */
  displayProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    
    if (!products || products.length === 0) {
      productsGrid.innerHTML = '<p class="empty-message">No products found.</p>';
      return;
    }

    productsGrid.innerHTML = products.map(product => this.createProductCard(product)).join('');

    // Add click handlers to product cards
    const productCards = productsGrid.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        this.displayProductDetails(products[index]);
      });
    });
  }

  /**
   * Create HTML for a product card
   * @param {Object} product - Product object
   * @returns {string} HTML string for product card
   */
  createProductCard(product) {
    const categoryName = product.category ? product.category.categoryName : 'Uncategorized';
    const quantityClass = product.quantity === 0 ? 'out-of-stock' : (product.quantity < 10 ? 'low-stock' : '');
    const stockText = product.quantity === 0 ? 'Out of Stock' : `Stock: ${product.quantity}`;

    return `
      <div class="product-card" data-product-id="${product.productId}">
        <div class="product-card-header">
          <div class="product-name">${this.escapeHtml(product.productName)}</div>
          <span class="product-category">${this.escapeHtml(categoryName)}</span>
        </div>
        <div class="product-card-body">
          <div class="product-price">$${product.price.toFixed(2)}</div>
          <div class="product-quantity ${quantityClass}">${stockText}</div>
        </div>
      </div>
    `;
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Handle product search with debouncing
   * @param {string} keyword - Search keyword
   */
  handleProductSearch(keyword) {
    // Clear existing timer
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }

    // Set new timer for debouncing (300ms delay)
    this.searchDebounceTimer = setTimeout(async () => {
      try {
        this.showLoading(true);
        
        if (!keyword || keyword.trim() === '') {
          // If search is empty, show all products (filtered by category if applicable)
          const categoryFilter = document.getElementById('category-filter');
          const categoryId = categoryFilter ? categoryFilter.value : '';
          
          if (categoryId) {
            await this.handleCategoryFilter(categoryId);
          } else {
            this.displayProducts(this.allProducts);
          }
        } else {
          // Search products by keyword
          const products = await this.apiClient.searchProducts(keyword.trim());
          this.displayProducts(products);
        }
        
        this.showLoading(false);
      } catch (error) {
        this.showLoading(false);
        this.showError(`Search failed: ${error.message}`);
      }
    }, 300);
  }

  /**
   * Handle category filter
   * @param {string} categoryId - Category ID to filter by (empty string for all)
   */
  async handleCategoryFilter(categoryId) {
    try {
      this.showLoading(true);
      
      if (!categoryId || categoryId === '') {
        // Show all products
        this.displayProducts(this.allProducts);
      } else {
        // Filter products by category
        const products = await this.apiClient.getProductsByCategory(categoryId);
        this.displayProducts(products);
      }
      
      this.showLoading(false);
    } catch (error) {
      this.showLoading(false);
      this.showError(`Filter failed: ${error.message}`);
    }
  }

  /**
   * Initialize product section controls
   */
  initializeProductControls() {
    // Search input
    const searchInput = document.getElementById('product-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleProductSearch(e.target.value);
      });
    }

    // Category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', (e) => {
        // Clear search when filtering by category
        if (searchInput) {
          searchInput.value = '';
        }
        this.handleCategoryFilter(e.target.value);
      });
    }

    // Refresh button
    const refreshBtn = document.getElementById('refresh-products-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.loadProducts();
      });
    }

    // Add product button
    const addProductBtn = document.getElementById('add-product-btn');
    if (addProductBtn) {
      addProductBtn.addEventListener('click', () => {
        this.showProductForm();
      });
    }
  }

  /**
   * Load all products from API
   */
  async loadProducts() {
    try {
      this.allProducts = await this.apiClient.getAllProducts();
      this.displayProducts(this.allProducts);
      this.showLoading(false);
    } catch (error) {
      this.showLoading(false);
      this.showError(`Failed to load products: ${error.message}`);
    }
  }

  /**
   * Load categories and populate filter dropdown
   */
  async loadCategories() {
    try {
      this.allCategories = await this.apiClient.getAllCategories();
      
      const categoryFilter = document.getElementById('category-filter');
      if (categoryFilter) {
        categoryFilter.innerHTML = '<option value="">All Categories</option>';
        this.allCategories.forEach(category => {
          const option = document.createElement('option');
          option.value = category.categoryId;
          option.textContent = category.categoryName;
          categoryFilter.appendChild(option);
        });
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      this.showError(`Failed to load categories: ${error.message}`);
    }
  }

  /**
   * Display product details in a modal
   * @param {Object} product - Product object
   */
  displayProductDetails(product) {
    const categoryName = product.category ? product.category.categoryName : 'Uncategorized';
    const expiryDate = product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : 'N/A';
    const stockStatus = product.quantity === 0 ? 'Out of Stock' : (product.quantity < 10 ? 'Low Stock' : 'In Stock');

    const modalHtml = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Product Details</h3>
          <button class="modal-close" onclick="uiManager.closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          <div class="product-detail-grid">
            <div class="detail-row">
              <span class="detail-label">Product Name</span>
              <span class="detail-value">${this.escapeHtml(product.productName)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Description</span>
              <span class="detail-value description">${this.escapeHtml(product.description || 'No description available')}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Price</span>
              <span class="detail-value price">$${product.price.toFixed(2)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Stock Quantity</span>
              <span class="detail-value">${product.quantity} (${stockStatus})</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Category</span>
              <span class="detail-value">${this.escapeHtml(categoryName)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Expiry Date</span>
              <span class="detail-value">${expiryDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Product ID</span>
              <span class="detail-value">${product.productId}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="uiManager.closeModal()">Close</button>
          <button class="btn btn-primary" onclick="uiManager.showProductForm(${product.productId})">Edit</button>
          <button class="btn btn-danger" onclick="uiManager.confirmDeleteProduct(${product.productId})">Delete</button>
        </div>
      </div>
    `;

    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = modalHtml;
    modalContainer.classList.remove('hidden');

    // Close modal when clicking outside
    modalContainer.onclick = (e) => {
      if (e.target === modalContainer) {
        this.closeModal();
      }
    };
  }

  /**
   * Close the modal
   */
  closeModal() {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.classList.add('hidden');
    modalContainer.innerHTML = '';
  }

  /**
   * Show product form for creating or updating a product
   * @param {number|null} productId - Product ID for editing, null for creating new
   */
  async showProductForm(productId = null) {
    const isEdit = productId !== null;
    let product = null;

    if (isEdit) {
      try {
        this.showLoading(true);
        product = await this.apiClient.getProductById(productId);
        this.showLoading(false);
      } catch (error) {
        this.showLoading(false);
        this.showError(`Failed to load product: ${error.message}`);
        return;
      }
    }

    const categoryOptions = this.allCategories.map(cat => 
      `<option value="${cat.categoryId}" ${product && product.category && product.category.categoryId === cat.categoryId ? 'selected' : ''}>
        ${this.escapeHtml(cat.categoryName)}
      </option>`
    ).join('');

    const expiryDate = product && product.expiryDate ? product.expiryDate.split('T')[0] : '';

    const modalHtml = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">${isEdit ? 'Edit Product' : 'Add New Product'}</h3>
          <button class="modal-close" onclick="uiManager.closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          <form id="product-form">
            <div class="form-group">
              <label class="form-label required" for="product-name">Product Name</label>
              <input type="text" id="product-name" class="form-input" value="${product ? this.escapeHtml(product.productName) : ''}" required>
              <div class="form-error" id="product-name-error"></div>
            </div>

            <div class="form-group">
              <label class="form-label" for="product-description">Description</label>
              <textarea id="product-description" class="form-textarea">${product && product.description ? this.escapeHtml(product.description) : ''}</textarea>
            </div>

            <div class="form-group">
              <label class="form-label required" for="product-price">Price</label>
              <input type="number" id="product-price" class="form-input" step="0.01" min="0" value="${product ? product.price : ''}" required>
              <div class="form-error" id="product-price-error"></div>
            </div>

            <div class="form-group">
              <label class="form-label required" for="product-quantity">Quantity</label>
              <input type="number" id="product-quantity" class="form-input" min="0" value="${product ? product.quantity : ''}" required>
              <div class="form-error" id="product-quantity-error"></div>
            </div>

            <div class="form-group">
              <label class="form-label" for="product-expiry">Expiry Date</label>
              <input type="date" id="product-expiry" class="form-input" value="${expiryDate}">
            </div>

            <div class="form-group">
              <label class="form-label" for="product-category">Category</label>
              <select id="product-category" class="form-select">
                <option value="">No Category</option>
                ${categoryOptions}
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="uiManager.closeModal()">Cancel</button>
          <button class="btn btn-primary" onclick="uiManager.submitProductForm(${productId})">${isEdit ? 'Update' : 'Create'}</button>
        </div>
      </div>
    `;

    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = modalHtml;
    modalContainer.classList.remove('hidden');

    // Close modal when clicking outside
    modalContainer.onclick = (e) => {
      if (e.target === modalContainer) {
        this.closeModal();
      }
    };
  }

  /**
   * Confirm product deletion
   * @param {number} productId - Product ID to delete
   */
  confirmDeleteProduct(productId) {
    const modalHtml = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Confirm Delete</h3>
          <button class="modal-close" onclick="uiManager.closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this product? This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="uiManager.closeModal()">Cancel</button>
          <button class="btn btn-danger" onclick="uiManager.deleteProduct(${productId})">Delete</button>
        </div>
      </div>
    `;

    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = modalHtml;
    modalContainer.classList.remove('hidden');

    // Close modal when clicking outside
    modalContainer.onclick = (e) => {
      if (e.target === modalContainer) {
        this.closeModal();
      }
    };
  }

  /**
   * Delete a product
   * @param {number} productId - Product ID to delete
   */
  async deleteProduct(productId) {
    try {
      this.showLoading(true);
      await this.apiClient.deleteProduct(productId);
      this.showSuccess('Product deleted successfully');
      this.closeModal();
      await this.loadProducts();
      this.showLoading(false);
    } catch (error) {
      this.showLoading(false);
      this.showError(`Failed to delete product: ${error.message}`);
    }
  }

  /**
   * Submit product form (create or update)
   * @param {number|null} productId - Product ID for editing, null for creating new
   */
  async submitProductForm(productId = null) {
    const isEdit = productId !== null;

    // Get form values
    const name = document.getElementById('product-name').value.trim();
    const description = document.getElementById('product-description').value.trim();
    const price = parseFloat(document.getElementById('product-price').value);
    const quantity = parseInt(document.getElementById('product-quantity').value);
    const expiryDate = document.getElementById('product-expiry').value;
    const categoryId = document.getElementById('product-category').value;

    // Validate form
    let hasError = false;

    if (!name) {
      document.getElementById('product-name-error').textContent = 'Product name is required';
      document.getElementById('product-name').classList.add('error');
      hasError = true;
    } else {
      document.getElementById('product-name-error').textContent = '';
      document.getElementById('product-name').classList.remove('error');
    }

    if (isNaN(price) || price < 0) {
      document.getElementById('product-price-error').textContent = 'Valid price is required';
      document.getElementById('product-price').classList.add('error');
      hasError = true;
    } else {
      document.getElementById('product-price-error').textContent = '';
      document.getElementById('product-price').classList.remove('error');
    }

    if (isNaN(quantity) || quantity < 0) {
      document.getElementById('product-quantity-error').textContent = 'Valid quantity is required';
      document.getElementById('product-quantity').classList.add('error');
      hasError = true;
    } else {
      document.getElementById('product-quantity-error').textContent = '';
      document.getElementById('product-quantity').classList.remove('error');
    }

    if (hasError) {
      return;
    }

    // Prepare product data
    const productData = {
      productName: name,
      description: description || null,
      price: price,
      quantity: quantity,
      expiryDate: expiryDate || null,
      categoryId: categoryId ? parseInt(categoryId) : null
    };

    try {
      this.showLoading(true);

      if (isEdit) {
        await this.apiClient.updateProduct(productId, productData);
        this.showSuccess('Product updated successfully');
      } else {
        await this.apiClient.createProduct(productData);
        this.showSuccess('Product created successfully');
      }

      this.closeModal();
      await this.loadProducts();
      
      this.showLoading(false);
    } catch (error) {
      this.showLoading(false);
      this.showError(`Failed to ${isEdit ? 'update' : 'create'} product: ${error.message}`);
    }
  }

  // ==================== CATEGORY METHODS ====================

  /**
   * Display categories in a grid
   * @param {Array} categories - Array of category objects
   */
  displayCategories(categories) {
    const categoriesGrid = document.getElementById('categories-grid');
    
    if (!categories || categories.length === 0) {
      categoriesGrid.innerHTML = '<p class="empty-message">No categories found.</p>';
      return;
    }

    categoriesGrid.innerHTML = categories.map(category => this.createCategoryCard(category)).join('');

    // Add click handlers to category cards
    const categoryCards = categoriesGrid.querySelectorAll('.category-card');
    categoryCards.forEach((card, index) => {
      card.addEventListener('click', async () => {
        await this.viewCategoryProducts(categories[index]);
      });
    });
  }

  /**
   * Create HTML for a category card
   * @param {Object} category - Category object
   * @returns {string} HTML string for category card
   */
  createCategoryCard(category) {
    // Count products in this category
    const productCount = this.allProducts.filter(p => 
      p.category && p.category.categoryId === category.categoryId
    ).length;

    return `
      <div class="category-card" data-category-id="${category.categoryId}">
        <div class="category-card-header">
          <div class="category-name">${this.escapeHtml(category.categoryName)}</div>
        </div>
        <div class="category-card-body">
          <div class="category-product-count">${productCount} product${productCount !== 1 ? 's' : ''}</div>
        </div>
        <div class="category-card-actions">
          <button class="btn-icon btn-edit" onclick="event.stopPropagation(); uiManager.showCategoryForm(${category.categoryId})" title="Edit">✏️</button>
          <button class="btn-icon btn-delete" onclick="event.stopPropagation(); uiManager.confirmDeleteCategory(${category.categoryId})" title="Delete">🗑️</button>
        </div>
      </div>
    `;
  }

  /**
   * View products in a category
   * @param {Object} category - Category object
   */
  async viewCategoryProducts(category) {
    try {
      this.showLoading(true);
      const products = await this.apiClient.getProductsByCategory(category.categoryId);
      
      // Switch to products section
      this.showSection('products');
      
      // Update category filter
      const categoryFilter = document.getElementById('category-filter');
      if (categoryFilter) {
        categoryFilter.value = category.categoryId;
      }
      
      // Display filtered products
      this.displayProducts(products);
      this.showLoading(false);
      
      this.showSuccess(`Showing products in "${category.categoryName}"`);
    } catch (error) {
      this.showLoading(false);
      this.showError(`Failed to load category products: ${error.message}`);
    }
  }

  /**
   * Initialize category section controls
   */
  initializeCategoryControls() {
    // Add category button
    const addCategoryBtn = document.getElementById('add-category-btn');
    if (addCategoryBtn) {
      addCategoryBtn.addEventListener('click', () => {
        this.showCategoryForm();
      });
    }

    // Refresh button
    const refreshBtn = document.getElementById('refresh-categories-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.loadCategoriesForDisplay();
      });
    }
  }

  /**
   * Load categories and display them
   */
  async loadCategoriesForDisplay() {
    try {
      this.showLoading(true);
      this.allCategories = await this.apiClient.getAllCategories();
      this.displayCategories(this.allCategories);
      this.showLoading(false);
    } catch (error) {
      this.showLoading(false);
      this.showError(`Failed to load categories: ${error.message}`);
    }
  }

  /**
   * Show category form for creating or updating a category
   * @param {number|null} categoryId - Category ID for editing, null for creating new
   */
  async showCategoryForm(categoryId = null) {
    const isEdit = categoryId !== null;
    let category = null;

    if (isEdit) {
      try {
        this.showLoading(true);
        category = await this.apiClient.getCategoryById(categoryId);
        this.showLoading(false);
      } catch (error) {
        this.showLoading(false);
        this.showError(`Failed to load category: ${error.message}`);
        return;
      }
    }

    const modalHtml = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">${isEdit ? 'Edit Category' : 'Add New Category'}</h3>
          <button class="modal-close" onclick="uiManager.closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          <form id="category-form">
            <div class="form-group">
              <label class="form-label required" for="category-name">Category Name</label>
              <input type="text" id="category-name" class="form-input" value="${category ? this.escapeHtml(category.categoryName) : ''}" required>
              <div class="form-error" id="category-name-error"></div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="uiManager.closeModal()">Cancel</button>
          <button class="btn btn-primary" onclick="uiManager.submitCategoryForm(${categoryId})">${isEdit ? 'Update' : 'Create'}</button>
        </div>
      </div>
    `;

    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = modalHtml;
    modalContainer.classList.remove('hidden');

    // Close modal when clicking outside
    modalContainer.onclick = (e) => {
      if (e.target === modalContainer) {
        this.closeModal();
      }
    };
  }

  /**
   * Submit category form (create or update)
   * @param {number|null} categoryId - Category ID for editing, null for creating new
   */
  async submitCategoryForm(categoryId = null) {
    const isEdit = categoryId !== null;

    // Get form values
    const name = document.getElementById('category-name').value.trim();

    // Validate form
    let hasError = false;

    if (!name) {
      document.getElementById('category-name-error').textContent = 'Category name is required';
      document.getElementById('category-name').classList.add('error');
      hasError = true;
    } else {
      document.getElementById('category-name-error').textContent = '';
      document.getElementById('category-name').classList.remove('error');
    }

    if (hasError) {
      return;
    }

    try {
      this.showLoading(true);

      if (isEdit) {
        await this.apiClient.updateCategory(categoryId, name);
        this.showSuccess('Category updated successfully');
      } else {
        await this.apiClient.createCategory(name);
        this.showSuccess('Category created successfully');
      }

      this.closeModal();
      await this.loadCategories();
      await this.loadCategoriesForDisplay();
      
      this.showLoading(false);
    } catch (error) {
      this.showLoading(false);
      this.showError(`Failed to ${isEdit ? 'update' : 'create'} category: ${error.message}`);
    }
  }

  /**
   * Confirm category deletion
   * @param {number} categoryId - Category ID to delete
   */
  confirmDeleteCategory(categoryId) {
    const modalHtml = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Confirm Delete</h3>
          <button class="modal-close" onclick="uiManager.closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this category? This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="uiManager.closeModal()">Cancel</button>
          <button class="btn btn-danger" onclick="uiManager.deleteCategory(${categoryId})">Delete</button>
        </div>
      </div>
    `;

    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = modalHtml;
    modalContainer.classList.remove('hidden');

    // Close modal when clicking outside
    modalContainer.onclick = (e) => {
      if (e.target === modalContainer) {
        this.closeModal();
      }
    };
  }

  /**
   * Delete a category
   * @param {number} categoryId - Category ID to delete
   */
  async deleteCategory(categoryId) {
    try {
      this.showLoading(true);
      await this.apiClient.deleteCategory(categoryId);
      this.showSuccess('Category deleted successfully');
      this.closeModal();
      await this.loadCategories();
      await this.loadCategoriesForDisplay();
      this.showLoading(false);
    } catch (error) {
      this.showLoading(false);
      this.showError(`Failed to delete category: ${error.message}`);
    }
  }

  // ==================== CART METHODS ====================

  /**
   * Initialize cart section controls
   */
  initializeCartControls() {
    // Cart creation form will be shown when cart section is accessed
    const cartSection = document.getElementById('cart-section');
    if (cartSection) {
      // We'll initialize cart UI when the section is shown
    }
  }

  /**
   * Show cart creation form with customer email input
   */
  showCartCreationForm() {
    const cartContent = document.querySelector('#cart-section .section-content');
    
    const formHtml = `
      <div class="cart-creation-form">
        <h3>Create or Load Shopping Cart</h3>
        <div class="form-group">
          <label class="form-label required" for="customer-email">Customer Email</label>
          <input type="email" id="customer-email" class="form-input" placeholder="Enter customer email" required>
          <div class="form-error" id="customer-email-error"></div>
        </div>
        <div class="form-actions">
          <button class="btn btn-primary" onclick="uiManager.handleCreateCart()">Create New Cart</button>
          <button class="btn btn-secondary" onclick="uiManager.handleLoadCart()">Load Existing Cart</button>
        </div>
      </div>
    `;
    
    cartContent.innerHTML = formHtml;
  }

  /**
   * Handle create cart action
   */
  async handleCreateCart() {
    const email = document.getElementById('customer-email').value.trim();
    
    // Validate email
    if (!email) {
      document.getElementById('customer-email-error').textContent = 'Email is required';
      document.getElementById('customer-email').classList.add('error');
      return;
    }
    
    if (!this.isValidEmail(email)) {
      document.getElementById('customer-email-error').textContent = 'Please enter a valid email';
      document.getElementById('customer-email').classList.add('error');
      return;
    }
    
    document.getElementById('customer-email-error').textContent = '';
    document.getElementById('customer-email').classList.remove('error');
    
    try {
      this.showLoading(true);
      const cart = await this.apiClient.createCart(email);
      this.currentCartId = cart.cartId;
      this.currentCustomerEmail = email;
      this.showSuccess(`Cart created successfully (ID: ${cart.cartId})`);
      this.displayCart(cart);
      this.showLoading(false);
    } catch (error) {
      this.showLoading(false);
      this.showError(`Failed to create cart: ${error.message}`);
    }
  }

  /**
   * Handle load cart action
   */
  async handleLoadCart() {
    const email = document.getElementById('customer-email').value.trim();
    
    // Validate email
    if (!email) {
      document.getElementById('customer-email-error').textContent = 'Email is required';
      document.getElementById('customer-email').classList.add('error');
      return;
    }
    
    if (!this.isValidEmail(email)) {
      document.getElementById('customer-email-error').textContent = 'Please enter a valid email';
      document.getElementById('customer-email').classList.add('error');
      return;
    }
    
    document.getElementById('customer-email-error').textContent = '';
    document.getElementById('customer-email').classList.remove('error');
    
    try {
      this.showLoading(true);
      const cart = await this.apiClient.getCartByCustomerEmail(email);
      this.currentCartId = cart.cartId;
      this.currentCustomerEmail = email;
      this.showSuccess(`Cart loaded successfully (ID: ${cart.cartId})`);
      this.displayCart(cart);
      this.showLoading(false);
    } catch (error) {
      this.showLoading(false);
      this.showError(`Failed to load cart: ${error.message}`);
    }
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} - True if valid email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Display cart with items and summary
   * @param {Object} cart - Cart object
   */
  displayCart(cart) {
    const cartContent = document.querySelector('#cart-section .section-content');
    
    if (!cart || !cart.cartItems) {
      cartContent.innerHTML = '<p class="empty-message">No cart loaded.</p>';
      return;
    }

    const itemCount = cart.cartItems.length;
    const totalAmount = cart.totalAmount || 0;

    let cartHtml = `
      <div class="cart-container">
        <div class="cart-summary">
          <div class="summary-item">
            <span class="summary-label">Cart ID:</span>
            <span class="summary-value">${cart.cartId}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Customer Email:</span>
            <span class="summary-value">${this.escapeHtml(cart.customerEmail)}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Item Count:</span>
            <span class="summary-value">${itemCount}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Total Amount:</span>
            <span class="summary-value price">${totalAmount.toFixed(2)}</span>
          </div>
        </div>
    `;

    if (itemCount === 0) {
      cartHtml += `
        <div class="empty-cart-message">
          <p>Your cart is empty.</p>
        </div>
      `;
    } else {
      cartHtml += `
        <div class="cart-items-section">
          <h3>Cart Items</h3>
          <table class="cart-items-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
      `;

      cart.cartItems.forEach(item => {
        const subtotal = (item.priceAtAddition || 0) * item.quantity;
        cartHtml += `
          <tr class="cart-item-row" data-cart-item-id="${item.cartItemId}">
            <td class="product-name">${this.escapeHtml(item.product.productName)}</td>
            <td class="product-price">${(item.priceAtAddition || 0).toFixed(2)}</td>
            <td class="product-quantity">
              <div class="quantity-controls">
                <button class="qty-btn qty-minus" onclick="uiManager.decrementQuantity(${item.cartItemId})">−</button>
                <span class="qty-display">${item.quantity}</span>
                <button class="qty-btn qty-plus" onclick="uiManager.incrementQuantity(${item.cartItemId})">+</button>
              </div>
            </td>
            <td class="product-subtotal">${subtotal.toFixed(2)}</td>
            <td class="item-actions">
              <button class="btn-icon btn-delete" onclick="uiManager.removeCartItem(${item.cartItemId})" title="Remove">🗑️</button>
            </td>
          </tr>
        `;
      });

      cartHtml += `
            </tbody>
          </table>
        </div>
      `;
    }

    cartHtml += `
        <div class="cart-actions">
          <button class="btn btn-primary" onclick="uiManager.showAddToCartForm()">Add Item to Cart</button>
          <button class="btn btn-secondary" onclick="uiManager.showCartCreationForm()">Load Different Cart</button>
          <button class="btn btn-danger" onclick="uiManager.confirmClearCart()">Clear Cart</button>
        </div>
      </div>
    `;

    cartContent.innerHTML = cartHtml;
  }

  /**
   * Show form to add item to cart
   */
  showAddToCartForm() {
    if (!this.currentCartId) {
      this.showError('Please create or load a cart first');
      return;
    }

    // Create product options
    const productOptions = this.allProducts.map(product => 
      `<option value="${product.productId}" data-max-quantity="${product.quantity}">
        ${this.escapeHtml(product.productName)} (Stock: ${product.quantity})
      </option>`
    ).join('');

    const modalHtml = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Add Item to Cart</h3>
          <button class="modal-close" onclick="uiManager.closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          <form id="add-to-cart-form">
            <div class="form-group">
              <label class="form-label required" for="cart-product-select">Product</label>
              <select id="cart-product-select" class="form-select" required>
                <option value="">Select a product...</option>
                ${productOptions}
              </select>
              <div class="form-error" id="cart-product-error"></div>
            </div>

            <div class="form-group">
              <label class="form-label required" for="cart-quantity-input">Quantity</label>
              <input type="number" id="cart-quantity-input" class="form-input" min="1" value="1" required>
              <div class="form-error" id="cart-quantity-error"></div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="uiManager.closeModal()">Cancel</button>
          <button class="btn btn-primary" onclick="uiManager.submitAddToCart()">Add to Cart</button>
        </div>
      </div>
    `;

    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = modalHtml;
    modalContainer.classList.remove('hidden');

    // Close modal when clicking outside
    modalContainer.onclick = (e) => {
      if (e.target === modalContainer) {
        this.closeModal();
      }
    };

    // Update max quantity when product selection changes
    const productSelect = document.getElementById('cart-product-select');
    productSelect.addEventListener('change', () => {
      const selectedOption = productSelect.options[productSelect.selectedIndex];
      const maxQuantity = selectedOption.getAttribute('data-max-quantity');
      const quantityInput = document.getElementById('cart-quantity-input');
      if (maxQuantity) {
        quantityInput.max = maxQuantity;
      }
    });
  }

  /**
   * Submit add to cart form
   */
  async submitAddToCart() {
    const productId = parseInt(document.getElementById('cart-product-select').value);
    const quantity = parseInt(document.getElementById('cart-quantity-input').value);

    // Validate form
    let hasError = false;

    if (!productId) {
      document.getElementById('cart-product-error').textContent = 'Please select a product';
      document.getElementById('cart-product-select').classList.add('error');
      hasError = true;
    } else {
      document.getElementById('cart-product-error').textContent = '';
      document.getElementById('cart-product-select').classList.remove('error');
    }

    if (isNaN(quantity) || quantity < 1) {
      document.getElementById('cart-quantity-error').textContent = 'Quantity must be at least 1';
      document.getElementById('cart-quantity-input').classList.add('error');
      hasError = true;
    } else {
      document.getElementById('cart-quantity-error').textContent = '';
      document.getElementById('cart-quantity-input').classList.remove('error');
    }

    if (hasError) {
      return;
    }

    try {
      this.showLoading(true);
      const updatedCart = await this.apiClient.addItemToCart(this.currentCartId, productId, quantity);
      this.showSuccess('Item added to cart successfully');
      this.closeModal();
      this.displayCart(updatedCart);
      this.showLoading(false);
    } catch (error) {
      this.showLoading(false);
      this.showError(`Failed to add item to cart: ${error.message}`);
    }
  }

  /**
   * Increment cart item quantity
   * @param {number} cartItemId - Cart item ID
   */
  async incrementQuantity(cartItemId) {
    if (!this.currentCartId) {
      this.showError('No cart loaded');
      return;
    }

    try {
      this.showLoading(true);
      
      // Get current cart to find the item and its current quantity
      const cart = await this.apiClient.getCartById(this.currentCartId);
      const cartItem = cart.cartItems.find(item => item.cartItemId === cartItemId);
      
      if (!cartItem) {
        this.showError('Cart item not found');
        this.showLoading(false);
        return;
      }

      const newQuantity = cartItem.quantity + 1;
      const updatedCart = await this.apiClient.updateCartItemQuantity(this.currentCartId, cartItemId, newQuantity);
      this.displayCart(updatedCart);
      this.showLoading(false);
    } catch (error) {
      this.showLoading(false);
      this.showError(`Failed to update quantity: ${error.message}`);
    }
  }

  /**
   * Decrement cart item quantity
   * @param {number} cartItemId - Cart item ID
   */
  async decrementQuantity(cartItemId) {
    if (!this.currentCartId) {
      this.showError('No cart loaded');
      return;
    }

    try {
      this.showLoading(true);
      
      // Get current cart to find the item and its current quantity
      const cart = await this.apiClient.getCartById(this.currentCartId);
      const cartItem = cart.cartItems.find(item => item.cartItemId === cartItemId);
      
      if (!cartItem) {
        this.showError('Cart item not found');
        this.showLoading(false);
        return;
      }

      if (cartItem.quantity <= 1) {
        this.showError('Quantity cannot be less than 1. Use remove button to delete the item.');
        this.showLoading(false);
        return;
      }

      const newQuantity = cartItem.quantity - 1;
      const updatedCart = await this.apiClient.updateCartItemQuantity(this.currentCartId, cartItemId, newQuantity);
      this.displayCart(updatedCart);
      this.showLoading(false);
    } catch (error) {
      this.showLoading(false);
      this.showError(`Failed to update quantity: ${error.message}`);
    }
  }

  /**
   * Remove item from cart
   * @param {number} cartItemId - Cart item ID
   */
  async removeCartItem(cartItemId) {
    if (!this.currentCartId) {
      this.showError('No cart loaded');
      return;
    }

    try {
      this.showLoading(true);
      const updatedCart = await this.apiClient.removeItemFromCart(this.currentCartId, cartItemId);
      this.showSuccess('Item removed from cart');
      this.displayCart(updatedCart);
      this.showLoading(false);
    } catch (error) {
      this.showLoading(false);
      this.showError(`Failed to remove item: ${error.message}`);
    }
  }

  /**
   * Confirm clear cart action
   */
  confirmClearCart() {
    if (!this.currentCartId) {
      this.showError('No cart loaded');
      return;
    }

    const modalHtml = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Confirm Clear Cart</h3>
          <button class="modal-close" onclick="uiManager.closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to clear all items from the cart? This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="uiManager.closeModal()">Cancel</button>
          <button class="btn btn-danger" onclick="uiManager.clearCart()">Clear Cart</button>
        </div>
      </div>
    `;

    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = modalHtml;
    modalContainer.classList.remove('hidden');

    // Close modal when clicking outside
    modalContainer.onclick = (e) => {
      if (e.target === modalContainer) {
        this.closeModal();
      }
    };
  }

  /**
   * Clear all items from cart
   */
  async clearCart() {
    if (!this.currentCartId) {
      this.showError('No cart loaded');
      return;
    }

    try {
      this.showLoading(true);
      await this.apiClient.clearCart(this.currentCartId);
      this.showSuccess('Cart cleared successfully');
      this.closeModal();
      
      // Reload the cart to show empty state
      const cart = await this.apiClient.getCartById(this.currentCartId);
      this.displayCart(cart);
      this.showLoading(false);
    } catch (error) {
      this.showLoading(false);
      this.showError(`Failed to clear cart: ${error.message}`);
    }
  }

  // ==================== ORDERS METHODS ====================

  /**
   * Initialize orders section controls
   */
  initializeOrderControls() {
    // Orders controls will be initialized when the section is accessed
  }

  /**
   * Initialize orders section with filters
   */
  async initializeOrdersSection() {
    const ordersContent = document.querySelector('#orders-section .section-content');
    
    const filtersHtml = `
      <div class="orders-filters">
        <div class="filter-group">
          <label class="form-label" for="order-email-filter">Filter by Customer Email</label>
          <input type="email" id="order-email-filter" class="form-input" placeholder="Enter customer email">
        </div>
        <div class="filter-group">
          <label class="form-label" for="order-status-filter">Filter by Status</label>
          <select id="order-status-filter" class="form-select">
            <option value="">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
        <div class="filter-actions">
          <button class="btn btn-secondary" onclick="uiManager.applyOrderFilters()">Apply Filters</button>
          <button class="btn btn-secondary" onclick="uiManager.clearOrderFilters()">Show All Orders</button>
        </div>
      </div>
      <div id="orders-list-container"></div>
    `;
    
    ordersContent.innerHTML = filtersHtml;
    
    // Load all orders initially
    await this.loadAllOrders();
  }

  /**
   * Apply order filters
   */
  async applyOrderFilters() {
    const emailFilter = document.getElementById('order-email-filter').value.trim();
    const statusFilter = document.getElementById('order-status-filter').value.trim();

    try {
      this.showLoading(true);
      let orders = [];

      if (emailFilter && statusFilter) {
        // Both filters applied - get by email first, then filter by status
        const emailOrders = await this.apiClient.getOrdersByCustomerEmail(emailFilter);
        orders = emailOrders.filter(order => order.orderStatus === statusFilter);
      } else if (emailFilter) {
        // Only email filter
        orders = await this.apiClient.getOrdersByCustomerEmail(emailFilter);
      } else if (statusFilter) {
        // Only status filter
        orders = await this.apiClient.getOrdersByStatus(statusFilter);
      } else {
        // No filters - show all
        orders = await this.apiClient.getAllOrders();
      }

      this.showLoading(false);
      this.displayOrdersInContainer(orders);
      
      if (orders.length === 0) {
        this.showSuccess('No orders found matching the filters');
      }
    } catch (error) {
      this.showLoading(false);
      this.showError(`Failed to apply filters: ${error.message}`);
    }
  }

  /**
   * Clear order filters and show all orders
   */
  async clearOrderFilters() {
    document.getElementById('order-email-filter').value = '';
    document.getElementById('order-status-filter').value = '';
    
    try {
      this.showLoading(true);
      const orders = await this.apiClient.getAllOrders();
      this.showLoading(false);
      this.displayOrdersInContainer(orders);
      this.showSuccess('Showing all orders');
    } catch (error) {
      this.showLoading(false);
      this.showError(`Failed to load orders: ${error.message}`);
    }
  }

  /**
   * Display orders in the container (used by filters)
   * @param {Array} orders - Array of order objects
   */
  displayOrdersInContainer(orders) {
    const ordersListContainer = document.getElementById('orders-list-container');
    
    if (!orders || orders.length === 0) {
      ordersListContainer.innerHTML = `
        <p class="empty-message">No orders found.</p>
        <div class="orders-actions">
          <button class="btn btn-primary" onclick="uiManager.showOrderForm()">Create New Order</button>
        </div>
      `;
      return;
    }

    let ordersHtml = `
      <div class="orders-actions">
        <button class="btn btn-primary" onclick="uiManager.showOrderForm()">Create New Order</button>
        <button class="btn btn-secondary" onclick="uiManager.loadAllOrders()">Refresh</button>
      </div>
      <table class="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    `;

    orders.forEach(order => {
      const orderDate = new Date(order.orderDate).toLocaleDateString();
      const statusClass = `status-${order.orderStatus.toLowerCase()}`;
      
      ordersHtml += `
        <tr class="order-row" data-order-id="${order.orderId}">
          <td class="order-id">${order.orderId}</td>
          <td class="order-customer">${this.escapeHtml(order.customerName)}</td>
          <td class="order-date">${orderDate}</td>
          <td class="order-status"><span class="status-badge ${statusClass}">${order.orderStatus}</span></td>
          <td class="order-total">${order.totalAmount.toFixed(2)}</td>
          <td class="order-actions">
            <button class="btn-icon btn-view" onclick="uiManager.displayOrderDetails(${order.orderId})" title="View">👁️</button>
            <button class="btn-icon btn-delete" onclick="uiManager.confirmDeleteOrder(${order.orderId})" title="Delete">🗑️</button>
          </td>
        </tr>
      `;
    });

    ordersHtml += `
        </tbody>
      </table>
    `;

    ordersListContainer.innerHTML = ordersHtml;
  }

  /**
   * Display orders in a table
   * @param {Array} orders - Array of order objects
   */
  displayOrders(orders) {
    const ordersListContainer = document.getElementById('orders-list-container');
    
    if (!ordersListContainer) {
      // If container doesn't exist, initialize the section first
      this.initializeOrdersSection();
      return;
    }

    this.displayOrdersInContainer(orders);
  }

  /**
   * Load all orders from API
   */
  async loadAllOrders() {
    try {
      this.showLoading(true);
      const orders = await this.apiClient.getAllOrders();
      this.displayOrders(orders);
      this.showLoading(false);
    } catch (error) {
      this.showLoading(false);
      this.showError(`Failed to load orders: ${error.message}`);
    }
  }

  /**
   * Display order details in a modal
   * @param {number} orderId - Order ID
   */
  async displayOrderDetails(orderId) {
    try {
      this.showLoading(true);
      const order = await this.apiClient.getOrderById(orderId);
      this.showLoading(false);

      const orderDate = new Date(order.orderDate).toLocaleDateString();
      const statusClass = `status-${order.orderStatus.toLowerCase()}`;

      let orderItemsHtml = '';
      if (order.orderItems && order.orderItems.length > 0) {
        orderItemsHtml = `
          <div class="order-items-section">
            <h4>Order Items</h4>
            <table class="order-items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
        `;
        
        order.orderItems.forEach(item => {
          const subtotal = (item.priceAtOrder || 0) * item.quantity;
          orderItemsHtml += `
            <tr>
              <td>${this.escapeHtml(item.product.productName)}</td>
              <td>${(item.priceAtOrder || 0).toFixed(2)}</td>
              <td>${item.quantity}</td>
              <td>${subtotal.toFixed(2)}</td>
            </tr>
          `;
        });

        orderItemsHtml += `
              </tbody>
            </table>
          </div>
        `;
      }

      const modalHtml = `
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">Order Details - #${order.orderId}</h3>
            <button class="modal-close" onclick="uiManager.closeModal()">&times;</button>
          </div>
          <div class="modal-body">
            <div class="order-detail-grid">
              <div class="detail-section">
                <h4>Customer Information</h4>
                <div class="detail-row">
                  <span class="detail-label">Name</span>
                  <span class="detail-value">${this.escapeHtml(order.customerName)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email</span>
                  <span class="detail-value">${this.escapeHtml(order.customerEmail)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Phone</span>
                  <span class="detail-value">${this.escapeHtml(order.customerPhone)}</span>
                </div>
              </div>

              <div class="detail-section">
                <h4>Shipping Address</h4>
                <div class="detail-row">
                  <span class="detail-label">Address</span>
                  <span class="detail-value">${this.escapeHtml(order.shippingAddress)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">City</span>
                  <span class="detail-value">${this.escapeHtml(order.shippingCity)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">State</span>
                  <span class="detail-value">${this.escapeHtml(order.shippingState)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Postal Code</span>
                  <span class="detail-value">${this.escapeHtml(order.shippingPostalCode)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Country</span>
                  <span class="detail-value">${this.escapeHtml(order.shippingCountry)}</span>
                </div>
              </div>

              <div class="detail-section">
                <h4>Order Information</h4>
                <div class="detail-row">
                  <span class="detail-label">Order Date</span>
                  <span class="detail-value">${orderDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status</span>
                  <span class="detail-value"><span class="status-badge ${statusClass}">${order.orderStatus}</span></span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Payment Method</span>
                  <span class="detail-value">${this.escapeHtml(order.paymentMethod)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Total Amount</span>
                  <span class="detail-value price">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            ${orderItemsHtml}

            <div class="order-status-update">
              <h4>Update Status</h4>
              <div class="form-group">
                <label class="form-label" for="order-status-select">New Status</label>
                <select id="order-status-select" class="form-select">
                  <option value="">Select new status...</option>
                  <option value="PENDING" ${order.orderStatus === 'PENDING' ? 'selected' : ''}>PENDING</option>
                  <option value="CONFIRMED" ${order.orderStatus === 'CONFIRMED' ? 'selected' : ''}>CONFIRMED</option>
                  <option value="SHIPPED" ${order.orderStatus === 'SHIPPED' ? 'selected' : ''}>SHIPPED</option>
                  <option value="DELIVERED" ${order.orderStatus === 'DELIVERED' ? 'selected' : ''}>DELIVERED</option>
                  <option value="CANCELLED" ${order.orderStatus === 'CANCELLED' ? 'selected' : ''}>CANCELLED</option>
                </select>
              </div>
              <button class="btn btn-primary" onclick="uiManager.updateOrderStatus(${order.orderId})">Update Status</button>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="uiManager.closeModal()">Close</button>
          </div>
        </div>
      `;

      const modalContainer = document.getElementById('modal-container');
      modalContainer.innerHTML = modalHtml;
      modalContainer.classList.remove('hidden');

      // Close modal when clicking outside
      modalContainer.onclick = (e) => {
        if (e.target === modalContainer) {
          this.closeModal();
        }
      };
    } catch (error) {
      this.showLoading(false);
      this.showError(`Failed to load order details: ${error.message}`);
    }
  }

  /**
   * Confirm order deletion
   * @param {number} orderId - Order ID to delete
   */
  confirmDeleteOrder(orderId) {
    const modalHtml = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Confirm Delete</h3>
          <button class="modal-close" onclick="uiManager.closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this order? This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="uiManager.closeModal()">Cancel</button>
          <button class="btn btn-danger" onclick="uiManager.deleteOrder(${orderId})">Delete</button>
        </div>
      </div>
    `;

    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = modalHtml;
    modalContainer.classList.remove('hidden');

    // Close modal when clicking outside
    modalContainer.onclick = (e) => {
      if (e.target === modalContainer) {
        this.closeModal();
      }
    };
  }

  /**
   * Delete an order
   * @param {number} orderId - Order ID to delete
   */
  async deleteOrder(orderId) {
    try {
      this.showLoading(true);
      await this.apiClient.deleteOrder(orderId);
      this.showSuccess('Order deleted successfully');
      this.closeModal();
      await this.loadAllOrders();
      this.showLoading(false);
    } catch (error) {
      this.showLoading(false);
      this.showError(`Failed to delete order: ${error.message}`);
    }
  }

  /**
   * Update order status
   * @param {number} orderId - Order ID
   */
  async updateOrderStatus(orderId) {
    const statusSelect = document.getElementById('order-status-select');
    const newStatus = statusSelect.value.trim();

    if (!newStatus) {
      this.showError('Please select a new status');
      return;
    }

    try {
      this.showLoading(true);
      const updatedOrder = await this.apiClient.updateOrderStatus(orderId, newStatus);
      this.showSuccess(`Order status updated to ${newStatus}`);
      
      // Refresh the order details
      this.closeModal();
      this.displayOrderDetails(orderId);
      
      this.showLoading(false);
    } catch (error) {
      this.showLoading(false);
      this.showError(`Failed to update order status: ${error.message}`);
    }
  }

  /**
   * Show order creation form
   */
  showOrderForm() {
    // Create product options
    const productOptions = this.allProducts.map(product => 
      `<option value="${product.productId}" data-price="${product.price}" data-max-quantity="${product.quantity}">
        ${this.escapeHtml(product.productName)} - $${product.price.toFixed(2)} (Stock: ${product.quantity})
      </option>`
    ).join('');

    const modalHtml = `
      <div class="modal modal-large">
        <div class="modal-header">
          <h3 class="modal-title">Create New Order</h3>
          <button class="modal-close" onclick="uiManager.closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          <form id="order-form">
            <div class="form-section">
              <h4>Customer Information</h4>
              <div class="form-group">
                <label class="form-label required" for="order-customer-name">Customer Name</label>
                <input type="text" id="order-customer-name" class="form-input" required>
                <div class="form-error" id="order-customer-name-error"></div>
              </div>

              <div class="form-group">
                <label class="form-label required" for="order-customer-email">Customer Email</label>
                <input type="email" id="order-customer-email" class="form-input" required>
                <div class="form-error" id="order-customer-email-error"></div>
              </div>

              <div class="form-group">
                <label class="form-label required" for="order-customer-phone">Customer Phone</label>
                <input type="tel" id="order-customer-phone" class="form-input" required>
                <div class="form-error" id="order-customer-phone-error"></div>
              </div>
            </div>

            <div class="form-section">
              <h4>Shipping Address</h4>
              <div class="form-group">
                <label class="form-label required" for="order-address">Address</label>
                <input type="text" id="order-address" class="form-input" required>
                <div class="form-error" id="order-address-error"></div>
              </div>

              <div class="form-group">
                <label class="form-label required" for="order-city">City</label>
                <input type="text" id="order-city" class="form-input" required>
                <div class="form-error" id="order-city-error"></div>
              </div>

              <div class="form-group">
                <label class="form-label required" for="order-state">State</label>
                <input type="text" id="order-state" class="form-input" required>
                <div class="form-error" id="order-state-error"></div>
              </div>

              <div class="form-group">
                <label class="form-label required" for="order-postal-code">Postal Code</label>
                <input type="text" id="order-postal-code" class="form-input" required>
                <div class="form-error" id="order-postal-code-error"></div>
              </div>

              <div class="form-group">
                <label class="form-label required" for="order-country">Country</label>
                <input type="text" id="order-country" class="form-input" required>
                <div class="form-error" id="order-country-error"></div>
              </div>
            </div>

            <div class="form-section">
              <h4>Payment Method</h4>
              <div class="form-group">
                <label class="form-label required" for="order-payment-method">Payment Method</label>
                <select id="order-payment-method" class="form-select" required>
                  <option value="">Select payment method...</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="DEBIT_CARD">Debit Card</option>
                  <option value="PAYPAL">PayPal</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
                </select>
                <div class="form-error" id="order-payment-method-error"></div>
              </div>
            </div>

            <div class="form-section">
              <h4>Order Items</h4>
              <div id="order-items-container">
                <div class="order-item-row" data-item-index="0">
                  <div class="form-group">
                    <label class="form-label required">Product</label>
                    <select class="form-select order-product-select" data-item-index="0" required>
                      <option value="">Select a product...</option>
                      ${productOptions}
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label required">Quantity</label>
                    <input type="number" class="form-input order-quantity-input" data-item-index="0" min="1" value="1" required>
                  </div>
                  <button type="button" class="btn btn-danger btn-sm" onclick="uiManager.removeOrderItem(0)">Remove</button>
                </div>
              </div>
              <button type="button" class="btn btn-secondary btn-sm" onclick="uiManager.addOrderItem()">Add Another Item</button>
              <div class="form-error" id="order-items-error"></div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="uiManager.closeModal()">Cancel</button>
          <button class="btn btn-primary" onclick="uiManager.submitOrderForm()">Create Order</button>
        </div>
      </div>
    `;

    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = modalHtml;
    modalContainer.classList.remove('hidden');

    // Close modal when clicking outside
    modalContainer.onclick = (e) => {
      if (e.target === modalContainer) {
        this.closeModal();
      }
    };

    // Initialize product select change handlers
    this.initializeOrderItemHandlers();
  }

  /**
   * Initialize order item event handlers
   */
  initializeOrderItemHandlers() {
    const productSelects = document.querySelectorAll('.order-product-select');
    productSelects.forEach(select => {
      select.addEventListener('change', () => {
        const itemIndex = select.getAttribute('data-item-index');
        const selectedOption = select.options[select.selectedIndex];
        const maxQuantity = selectedOption.getAttribute('data-max-quantity');
        const quantityInput = document.querySelector(`.order-quantity-input[data-item-index="${itemIndex}"]`);
        if (maxQuantity && quantityInput) {
          quantityInput.max = maxQuantity;
        }
      });
    });
  }

  /**
   * Add another item to the order form
   */
  addOrderItem() {
    const container = document.getElementById('order-items-container');
    const itemCount = container.children.length;
    
    const productOptions = this.allProducts.map(product => 
      `<option value="${product.productId}" data-price="${product.price}" data-max-quantity="${product.quantity}">
        ${this.escapeHtml(product.productName)} - $${product.price.toFixed(2)} (Stock: ${product.quantity})
      </option>`
    ).join('');

    const itemHtml = `
      <div class="order-item-row" data-item-index="${itemCount}">
        <div class="form-group">
          <label class="form-label required">Product</label>
          <select class="form-select order-product-select" data-item-index="${itemCount}" required>
            <option value="">Select a product...</option>
            ${productOptions}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label required">Quantity</label>
          <input type="number" class="form-input order-quantity-input" data-item-index="${itemCount}" min="1" value="1" required>
        </div>
        <button type="button" class="btn btn-danger btn-sm" onclick="uiManager.removeOrderItem(${itemCount})">Remove</button>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', itemHtml);
    this.initializeOrderItemHandlers();
  }

  /**
   * Remove an item from the order form
   * @param {number} itemIndex - Index of the item to remove
   */
  removeOrderItem(itemIndex) {
    const container = document.getElementById('order-items-container');
    const itemRow = container.querySelector(`[data-item-index="${itemIndex}"]`);
    
    if (itemRow) {
      itemRow.remove();
    }

    // Ensure at least one item remains
    if (container.children.length === 0) {
      this.addOrderItem();
    }
  }

  /**
   * Submit order form
   */
  async submitOrderForm() {
    // Validate customer information
    const customerName = document.getElementById('order-customer-name').value.trim();
    const customerEmail = document.getElementById('order-customer-email').value.trim();
    const customerPhone = document.getElementById('order-customer-phone').value.trim();
    const address = document.getElementById('order-address').value.trim();
    const city = document.getElementById('order-city').value.trim();
    const state = document.getElementById('order-state').value.trim();
    const postalCode = document.getElementById('order-postal-code').value.trim();
    const country = document.getElementById('order-country').value.trim();
    const paymentMethod = document.getElementById('order-payment-method').value.trim();

    let hasError = false;

    // Validate required fields
    if (!customerName) {
      document.getElementById('order-customer-name-error').textContent = 'Customer name is required';
      document.getElementById('order-customer-name').classList.add('error');
      hasError = true;
    } else {
      document.getElementById('order-customer-name-error').textContent = '';
      document.getElementById('order-customer-name').classList.remove('error');
    }

    if (!customerEmail || !this.isValidEmail(customerEmail)) {
      document.getElementById('order-customer-email-error').textContent = 'Valid email is required';
      document.getElementById('order-customer-email').classList.add('error');
      hasError = true;
    } else {
      document.getElementById('order-customer-email-error').textContent = '';
      document.getElementById('order-customer-email').classList.remove('error');
    }

    if (!customerPhone) {
      document.getElementById('order-customer-phone-error').textContent = 'Phone number is required';
      document.getElementById('order-customer-phone').classList.add('error');
      hasError = true;
    } else {
      document.getElementById('order-customer-phone-error').textContent = '';
      document.getElementById('order-customer-phone').classList.remove('error');
    }

    if (!address) {
      document.getElementById('order-address-error').textContent = 'Address is required';
      document.getElementById('order-address').classList.add('error');
      hasError = true;
    } else {
      document.getElementById('order-address-error').textContent = '';
      document.getElementById('order-address').classList.remove('error');
    }

    if (!city) {
      document.getElementById('order-city-error').textContent = 'City is required';
      document.getElementById('order-city').classList.add('error');
      hasError = true;
    } else {
      document.getElementById('order-city-error').textContent = '';
      document.getElementById('order-city').classList.remove('error');
    }

    if (!state) {
      document.getElementById('order-state-error').textContent = 'State is required';
      document.getElementById('order-state').classList.add('error');
      hasError = true;
    } else {
      document.getElementById('order-state-error').textContent = '';
      document.getElementById('order-state').classList.remove('error');
    }

    if (!postalCode) {
      document.getElementById('order-postal-code-error').textContent = 'Postal code is required';
      document.getElementById('order-postal-code').classList.add('error');
      hasError = true;
    } else {
      document.getElementById('order-postal-code-error').textContent = '';
      document.getElementById('order-postal-code').classList.remove('error');
    }

    if (!country) {
      document.getElementById('order-country-error').textContent = 'Country is required';
      document.getElementById('order-country').classList.add('error');
      hasError = true;
    } else {
      document.getElementById('order-country-error').textContent = '';
      document.getElementById('order-country').classList.remove('error');
    }

    if (!paymentMethod) {
      document.getElementById('order-payment-method-error').textContent = 'Payment method is required';
      document.getElementById('order-payment-method').classList.add('error');
      hasError = true;
    } else {
      document.getElementById('order-payment-method-error').textContent = '';
      document.getElementById('order-payment-method').classList.remove('error');
    }

    // Validate order items
    const itemRows = document.querySelectorAll('.order-item-row');
    const orderItems = [];

    itemRows.forEach(row => {
      const productSelect = row.querySelector('.order-product-select');
      const quantityInput = row.querySelector('.order-quantity-input');
      
      const productId = parseInt(productSelect.value);
      const quantity = parseInt(quantityInput.value);

      if (!productId || isNaN(quantity) || quantity < 1) {
        hasError = true;
      } else {
        orderItems.push({
          productId: productId,
          quantity: quantity
        });
      }
    });

    if (orderItems.length === 0) {
      document.getElementById('order-items-error').textContent = 'At least one item is required';
      hasError = true;
    } else {
      document.getElementById('order-items-error').textContent = '';
    }

    if (hasError) {
      return;
    }

    // Prepare order data
    const orderData = {
      customerName: customerName,
      customerEmail: customerEmail,
      customerPhone: customerPhone,
      shippingAddress: address,
      shippingCity: city,
      shippingState: state,
      shippingPostalCode: postalCode,
      shippingCountry: country,
      paymentMethod: paymentMethod,
      orderItems: orderItems
    };

    try {
      this.showLoading(true);
      const createdOrder = await this.apiClient.createOrder(orderData);
      this.showSuccess(`Order created successfully (ID: ${createdOrder.orderId})`);
      this.closeModal();
      
      // Refresh orders list
      await this.loadAllOrders();
      
      this.showLoading(false);
    } catch (error) {
      this.showLoading(false);
      this.showError(`Failed to create order: ${error.message}`);
    }
  }
}


// Global variables for easy access
let apiClient;
let uiManager;

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize API client
  apiClient = new DokanAPIClient('http://localhost:8080/api/public');
  
  // Initialize UI manager
  uiManager = new UIManager(apiClient);
  
  // Initialize product controls
  uiManager.initializeProductControls();
  
  // Initialize category controls
  uiManager.initializeCategoryControls();
  
  // Initialize order controls
  uiManager.initializeOrderControls();
  
  // Hide loading modal immediately
  uiManager.showLoading(false);
  
  // Load initial data in background (don't block UI)
  try {
    await uiManager.loadCategories();
    await uiManager.loadProducts();
  } catch (error) {
    console.error('Failed to load initial data:', error);
    uiManager.showError('Failed to load initial data. Please refresh the page.');
  }
});
