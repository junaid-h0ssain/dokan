import 'package:flutter/foundation.dart';
import 'package:flutter_ecommerce_app/data/datasources/remote/exceptions.dart';
import 'package:flutter_ecommerce_app/data/models/category_model.dart' as models;
import 'package:flutter_ecommerce_app/data/models/product_model.dart';
import 'package:flutter_ecommerce_app/data/repositories/product_repository.dart';

/// Product state enum
enum ProductState {
  initial,
  loading,
  loaded,
  error,
}

/// Provider for managing product state
class ProductProvider extends ChangeNotifier {
  final ProductRepository _productRepository;

  ProductState _state = ProductState.initial;
  List<models.Category> _categories = [];
  List<Product> _products = [];
  Product? _selectedProduct;
  String? _errorMessage;
  String? _currentCategoryId;

  ProductProvider({required ProductRepository productRepository})
      : _productRepository = productRepository;

  /// Current product state
  ProductState get state => _state;

  /// List of all categories
  List<models.Category> get categories => _categories;

  /// List of products (filtered by category or search)
  List<Product> get products => _products;

  /// Currently selected product
  Product? get selectedProduct => _selectedProduct;

  /// Error message if state is error
  String? get errorMessage => _errorMessage;

  /// Current category ID being viewed
  String? get currentCategoryId => _currentCategoryId;

  /// Whether products are loading
  bool get isLoading => _state == ProductState.loading;

  /// Fetches all product categories
  Future<void> fetchCategories() async {
    try {
      _setState(ProductState.loading);
      _clearError();

      _categories = await _productRepository.getCategories();

      _setState(ProductState.loaded);
    } on NetworkException catch (e) {
      _setError(e.message);
    } on ServerException catch (e) {
      _setError(e.message);
    } catch (e) {
      _setError('Failed to load categories: ${e.toString()}');
    }
  }

  /// Fetches products by category ID
  Future<void> fetchProductsByCategory(String categoryId) async {
    try {
      _setState(ProductState.loading);
      _clearError();
      _currentCategoryId = categoryId;

      _products = await _productRepository.getProductsByCategory(categoryId);

      _setState(ProductState.loaded);
    } on NetworkException catch (e) {
      _setError(e.message);
    } on ServerException catch (e) {
      _setError(e.message);
    } catch (e) {
      _setError('Failed to load products: ${e.toString()}');
    }
  }

  /// Fetches detailed information for a specific product
  Future<void> fetchProductDetail(String productId) async {
    try {
      _setState(ProductState.loading);
      _clearError();

      _selectedProduct = await _productRepository.getProductDetail(productId);

      _setState(ProductState.loaded);
    } on NetworkException catch (e) {
      _setError(e.message);
    } on ServerException catch (e) {
      _setError(e.message);
    } catch (e) {
      _setError('Failed to load product details: ${e.toString()}');
    }
  }

  /// Searches for products by query string
  Future<void> searchProducts(String query) async {
    try {
      _setState(ProductState.loading);
      _clearError();
      _currentCategoryId = null; // Clear category filter when searching

      _products = await _productRepository.searchProducts(query);

      _setState(ProductState.loaded);
    } on NetworkException catch (e) {
      _setError(e.message);
    } on ServerException catch (e) {
      _setError(e.message);
    } catch (e) {
      _setError('Failed to search products: ${e.toString()}');
    }
  }

  /// Clears the selected product
  void clearSelectedProduct() {
    _selectedProduct = null;
    notifyListeners();
  }

  /// Clears the product list
  void clearProducts() {
    _products = [];
    _currentCategoryId = null;
    notifyListeners();
  }

  /// Clears any error messages
  void clearError() {
    _clearError();
    notifyListeners();
  }

  /// Sets the product state
  void _setState(ProductState newState) {
    _state = newState;
    notifyListeners();
  }

  /// Sets an error message and updates state to error
  void _setError(String message) {
    _errorMessage = message;
    _state = ProductState.error;
    notifyListeners();
  }

  /// Clears the error message
  void _clearError() {
    _errorMessage = null;
  }
}
