import 'package:flutter_ecommerce_app/data/datasources/remote/dokan_api_client.dart';
import 'package:flutter_ecommerce_app/data/models/category_model.dart';
import 'package:flutter_ecommerce_app/data/models/product_model.dart';
import 'package:flutter_ecommerce_app/data/repositories/product_repository.dart';

/// Implementation of ProductRepository using DokanApiClient
class ProductRepositoryImpl implements ProductRepository {
  final DokanApiClient _apiClient;

  ProductRepositoryImpl({
    required DokanApiClient apiClient,
  }) : _apiClient = apiClient;

  @override
  Future<List<Category>> getCategories() async {
    final response = await _apiClient.get<List<Category>>(
      '/categories',
      fromJson: (json) {
        if (json is List) {
          return json
              .map((item) => Category.fromJson(item as Map<String, dynamic>))
              .toList();
        }
        return [];
      },
    );

    return response;
  }

  @override
  Future<List<Product>> getProductsByCategory(String categoryId) async {
    final response = await _apiClient.get<List<Product>>(
      '/products/category/$categoryId',
      fromJson: (json) {
        if (json is List) {
          return json
              .map((item) => Product.fromJson(item as Map<String, dynamic>))
              .toList();
        }
        return [];
      },
    );

    return response;
  }

  @override
  Future<Product> getProductDetail(String productId) async {
    final response = await _apiClient.get<Product>(
      '/products/$productId',
      fromJson: (json) => Product.fromJson(json as Map<String, dynamic>),
    );

    return response;
  }

  @override
  Future<List<Product>> searchProducts(String query) async {
    final response = await _apiClient.get<List<Product>>(
      '/products/search?q=$query',
      fromJson: (json) {
        if (json is List) {
          return json
              .map((item) => Product.fromJson(item as Map<String, dynamic>))
              .toList();
        }
        return [];
      },
    );

    return response;
  }
}
