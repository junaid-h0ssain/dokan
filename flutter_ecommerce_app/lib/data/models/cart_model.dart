import 'package:json_annotation/json_annotation.dart';
import 'package:flutter_ecommerce_app/data/models/product_model.dart';

part 'cart_model.g.dart';

/// CartItem data model representing a product in the cart with quantity
@JsonSerializable()
class CartItem {
  final String productId;
  final Product product;
  final int quantity;

  CartItem({
    required this.productId,
    required this.product,
    required this.quantity,
  });

  /// Creates a CartItem instance from JSON
  factory CartItem.fromJson(Map<String, dynamic> json) =>
      _$CartItemFromJson(json);

  /// Converts CartItem instance to JSON
  Map<String, dynamic> toJson() => _$CartItemToJson(this);

  /// Calculate the total price for this cart item
  double get totalPrice => product.price * quantity;

  /// Create a copy of this CartItem with updated fields
  CartItem copyWith({
    String? productId,
    Product? product,
    int? quantity,
  }) {
    return CartItem(
      productId: productId ?? this.productId,
      product: product ?? this.product,
      quantity: quantity ?? this.quantity,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CartItem &&
          runtimeType == other.runtimeType &&
          productId == other.productId &&
          product == other.product &&
          quantity == other.quantity;

  @override
  int get hashCode =>
      productId.hashCode ^ product.hashCode ^ quantity.hashCode;

  @override
  String toString() =>
      'CartItem(productId: $productId, quantity: $quantity, totalPrice: $totalPrice)';
}

/// Cart data model representing a user's shopping cart
@JsonSerializable()
class Cart {
  final String id;
  final List<CartItem> items;

  Cart({
    required this.id,
    required this.items,
  });

  /// Creates a Cart instance from JSON
  factory Cart.fromJson(Map<String, dynamic> json) => _$CartFromJson(json);

  /// Converts Cart instance to JSON
  Map<String, dynamic> toJson() => _$CartToJson(this);

  /// Calculate the total price of all items in the cart
  double get totalPrice {
    return items.fold(0.0, (sum, item) => sum + item.totalPrice);
  }

  /// Get the total number of items in the cart
  int get itemCount => items.length;

  /// Get the total quantity of all products in the cart
  int get totalQuantity {
    return items.fold(0, (sum, item) => sum + item.quantity);
  }

  /// Check if the cart is empty
  bool get isEmpty => items.isEmpty;

  /// Check if the cart contains a specific product
  bool containsProduct(String productId) {
    return items.any((item) => item.productId == productId);
  }

  /// Get a cart item by product ID
  CartItem? getItemByProductId(String productId) {
    try {
      return items.firstWhere((item) => item.productId == productId);
    } catch (e) {
      return null;
    }
  }

  /// Create a copy of this Cart with updated fields
  Cart copyWith({
    String? id,
    List<CartItem>? items,
  }) {
    return Cart(
      id: id ?? this.id,
      items: items ?? this.items,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Cart &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          _listEquals(items, other.items);

  @override
  int get hashCode => id.hashCode ^ items.hashCode;

  @override
  String toString() =>
      'Cart(id: $id, itemCount: $itemCount, totalPrice: $totalPrice)';

  /// Helper method to compare lists
  bool _listEquals(List<CartItem> a, List<CartItem> b) {
    if (a.length != b.length) return false;
    for (int i = 0; i < a.length; i++) {
      if (a[i] != b[i]) return false;
    }
    return true;
  }
}
