import 'package:json_annotation/json_annotation.dart';

part 'product_model.g.dart';

/// Product data model representing a product available for purchase
@JsonSerializable()
class Product {
  final String id;
  final String name;
  final String description;
  final double price;
  final String categoryId;
  final String? imageUrl;
  final int stock;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.categoryId,
    this.imageUrl,
    required this.stock,
  });

  /// Creates a Product instance from JSON
  factory Product.fromJson(Map<String, dynamic> json) =>
      _$ProductFromJson(json);

  /// Converts Product instance to JSON
  Map<String, dynamic> toJson() => _$ProductToJson(this);

  /// Whether the product is in stock
  bool get isInStock => stock > 0;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Product &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          name == other.name &&
          description == other.description &&
          price == other.price &&
          categoryId == other.categoryId &&
          imageUrl == other.imageUrl &&
          stock == other.stock;

  @override
  int get hashCode =>
      id.hashCode ^
      name.hashCode ^
      description.hashCode ^
      price.hashCode ^
      categoryId.hashCode ^
      imageUrl.hashCode ^
      stock.hashCode;

  @override
  String toString() =>
      'Product(id: $id, name: $name, price: $price, stock: $stock)';
}
