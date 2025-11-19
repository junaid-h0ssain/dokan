import 'package:flutter_ecommerce_app/data/models/category_model.dart';
import 'package:flutter_ecommerce_app/data/models/product_model.dart';

/// Abstract repository interface for product operations
abstract class ProductRepository {
  /// Fetches all product categories
  /// 
  /// Returns a list of [Category] objects
  /// Throws [NetworkException] if network error occurs
  /// Throws [ServerException] if server error occurs
  Future<List<Category>> getCategories();

  /// Fetches products by category ID
  /// 
  /// [categoryId] - The ID of the category to fetch products for
  /// Returns a list of [Product] objects in the specified category
  /// Throws [NetworkException] if network error occurs
  /// Throws [ServerException] if server error occurs
  Future<List<Product>> getProductsByCategory(String categoryId);

  /// Fetches detailed information for a specific product
  /// 
  /// [productId] - The ID of the product to fetch
  /// Returns a [Product] object with detailed information
  /// Throws [NetworkException] if network error occurs
  /// Throws [ServerException] if product not found or server error occurs
  Future<Product> getProductDetail(String productId);

  /// Searches for products by query string
  /// 
  /// [query] - The search query string
  /// Returns a list of [Product] objects matching the search query
  /// Throws [NetworkException] if network error occurs
  /// Throws [ServerException] if server error occurs
  Future<List<Product>> searchProducts(String query);
}
