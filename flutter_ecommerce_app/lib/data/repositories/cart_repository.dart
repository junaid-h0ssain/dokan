import 'package:flutter_ecommerce_app/data/models/cart_model.dart';

/// Abstract repository interface for cart operations
abstract class CartRepository {
  /// Adds a product to the cart with specified quantity
  /// 
  /// [productId] - The ID of the product to add
  /// [quantity] - The quantity to add (default: 1)
  /// Returns the updated [Cart]
  /// Throws [NetworkException] if network error occurs
  /// Throws [ServerException] if server error occurs
  /// Throws [AuthenticationException] if user is not authenticated
  Future<Cart> addToCart(String productId, {int quantity = 1});

  /// Removes a product from the cart
  /// 
  /// [productId] - The ID of the product to remove
  /// Returns the updated [Cart]
  /// Throws [NetworkException] if network error occurs
  /// Throws [ServerException] if server error occurs
  /// Throws [AuthenticationException] if user is not authenticated
  Future<Cart> removeFromCart(String productId);

  /// Updates the quantity of a product in the cart
  /// 
  /// [productId] - The ID of the product to update
  /// [quantity] - The new quantity (must be > 0)
  /// Returns the updated [Cart]
  /// Throws [NetworkException] if network error occurs
  /// Throws [ServerException] if server error occurs
  /// Throws [AuthenticationException] if user is not authenticated
  /// Throws [ValidationException] if quantity is invalid
  Future<Cart> updateQuantity(String productId, int quantity);

  /// Fetches the current cart
  /// 
  /// Returns the current [Cart] with all items
  /// Throws [NetworkException] if network error occurs
  /// Throws [ServerException] if server error occurs
  /// Throws [AuthenticationException] if user is not authenticated
  Future<Cart> getCart();

  /// Clears all items from the cart
  /// 
  /// Returns an empty [Cart]
  /// Throws [NetworkException] if network error occurs
  /// Throws [ServerException] if server error occurs
  /// Throws [AuthenticationException] if user is not authenticated
  Future<Cart> clearCart();

  /// Syncs the local cart with the server
  /// 
  /// Returns the synchronized [Cart]
  /// Throws [NetworkException] if network error occurs
  /// Throws [ServerException] if server error occurs
  /// Throws [AuthenticationException] if user is not authenticated
  Future<Cart> syncWithServer();
}
