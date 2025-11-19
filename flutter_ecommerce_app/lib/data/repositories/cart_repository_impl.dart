import 'package:flutter_ecommerce_app/data/datasources/remote/dokan_api_client.dart';
import 'package:flutter_ecommerce_app/data/models/cart_model.dart';
import 'package:flutter_ecommerce_app/data/repositories/cart_repository.dart';

/// Implementation of CartRepository using DokanApiClient
class CartRepositoryImpl implements CartRepository {
  final DokanApiClient _apiClient;

  CartRepositoryImpl({
    required DokanApiClient apiClient,
  }) : _apiClient = apiClient;

  @override
  Future<Cart> addToCart(String productId, {int quantity = 1}) async {
    final response = await _apiClient.post<Cart>(
      '/cart/items',
      body: {
        'productId': productId,
        'quantity': quantity,
      },
      fromJson: (json) => Cart.fromJson(json as Map<String, dynamic>),
    );

    return response;
  }

  @override
  Future<Cart> removeFromCart(String productId) async {
    final response = await _apiClient.delete<Cart>(
      '/cart/items/$productId',
      fromJson: (json) => Cart.fromJson(json as Map<String, dynamic>),
    );

    return response;
  }

  @override
  Future<Cart> updateQuantity(String productId, int quantity) async {
    final response = await _apiClient.put<Cart>(
      '/cart/items/$productId',
      body: {
        'quantity': quantity,
      },
      fromJson: (json) => Cart.fromJson(json as Map<String, dynamic>),
    );

    return response;
  }

  @override
  Future<Cart> getCart() async {
    final response = await _apiClient.get<Cart>(
      '/cart',
      fromJson: (json) => Cart.fromJson(json as Map<String, dynamic>),
    );

    return response;
  }

  @override
  Future<Cart> clearCart() async {
    final response = await _apiClient.delete<Cart>(
      '/cart',
      fromJson: (json) => Cart.fromJson(json as Map<String, dynamic>),
    );

    return response;
  }

  @override
  Future<Cart> syncWithServer() async {
    // Sync is essentially fetching the latest cart from the server
    return await getCart();
  }
}
