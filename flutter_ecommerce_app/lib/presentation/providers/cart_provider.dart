import 'package:flutter/foundation.dart';
import 'package:flutter_ecommerce_app/data/datasources/remote/exceptions.dart';
import 'package:flutter_ecommerce_app/data/models/cart_model.dart';
import 'package:flutter_ecommerce_app/data/repositories/cart_repository.dart';

/// Cart state enum
enum CartState {
  initial,
  loading,
  loaded,
  error,
}

/// Provider for managing cart state
class CartProvider extends ChangeNotifier {
  final CartRepository _cartRepository;

  CartState _state = CartState.initial;
  Cart? _cart;
  String? _errorMessage;

  CartProvider({required CartRepository cartRepository})
      : _cartRepository = cartRepository;

  /// Current cart state
  CartState get state => _state;

  /// Current cart
  Cart? get cart => _cart;

  /// Error message if state is error
  String? get errorMessage => _errorMessage;

  /// Whether cart is loading
  bool get isLoading => _state == CartState.loading;

  /// Total price of items in cart
  double get totalPrice => _cart?.totalPrice ?? 0.0;

  /// Total number of items in cart
  int get itemCount => _cart?.itemCount ?? 0;

  /// Total quantity of all products in cart
  int get totalQuantity => _cart?.totalQuantity ?? 0;

  /// Whether cart is empty
  bool get isEmpty => _cart?.isEmpty ?? true;

  /// Fetches the current cart from the server
  Future<void> fetchCart() async {
    try {
      _setState(CartState.loading);
      _clearError();

      _cart = await _cartRepository.getCart();

      _setState(CartState.loaded);
    } on NetworkException catch (e) {
      _setError(e.message);
    } on ServerException catch (e) {
      _setError(e.message);
    } on AuthenticationException catch (e) {
      _setError(e.message);
    } catch (e) {
      _setError('Failed to load cart: ${e.toString()}');
    }
  }

  /// Adds a product to the cart
  Future<void> addToCart(String productId, {int quantity = 1}) async {
    try {
      _setState(CartState.loading);
      _clearError();

      _cart = await _cartRepository.addToCart(productId, quantity: quantity);

      _setState(CartState.loaded);
    } on NetworkException catch (e) {
      _setError(e.message);
    } on ServerException catch (e) {
      _setError(e.message);
    } on AuthenticationException catch (e) {
      _setError(e.message);
    } catch (e) {
      _setError('Failed to add item to cart: ${e.toString()}');
    }
  }

  /// Removes a product from the cart
  Future<void> removeFromCart(String productId) async {
    try {
      _setState(CartState.loading);
      _clearError();

      _cart = await _cartRepository.removeFromCart(productId);

      _setState(CartState.loaded);
    } on NetworkException catch (e) {
      _setError(e.message);
    } on ServerException catch (e) {
      _setError(e.message);
    } on AuthenticationException catch (e) {
      _setError(e.message);
    } catch (e) {
      _setError('Failed to remove item from cart: ${e.toString()}');
    }
  }

  /// Updates the quantity of a product in the cart
  Future<void> updateQuantity(String productId, int quantity) async {
    try {
      _setState(CartState.loading);
      _clearError();

      _cart = await _cartRepository.updateQuantity(productId, quantity);

      _setState(CartState.loaded);
    } on NetworkException catch (e) {
      _setError(e.message);
    } on ServerException catch (e) {
      _setError(e.message);
    } on AuthenticationException catch (e) {
      _setError(e.message);
    } on ValidationException catch (e) {
      _setError(e.message);
    } catch (e) {
      _setError('Failed to update quantity: ${e.toString()}');
    }
  }

  /// Clears all items from the cart
  Future<void> clearCart() async {
    try {
      _setState(CartState.loading);
      _clearError();

      _cart = await _cartRepository.clearCart();

      _setState(CartState.loaded);
    } on NetworkException catch (e) {
      _setError(e.message);
    } on ServerException catch (e) {
      _setError(e.message);
    } on AuthenticationException catch (e) {
      _setError(e.message);
    } catch (e) {
      _setError('Failed to clear cart: ${e.toString()}');
    }
  }

  /// Syncs the cart with the server
  Future<void> syncWithServer() async {
    try {
      _setState(CartState.loading);
      _clearError();

      _cart = await _cartRepository.syncWithServer();

      _setState(CartState.loaded);
    } on NetworkException catch (e) {
      _setError(e.message);
    } on ServerException catch (e) {
      _setError(e.message);
    } on AuthenticationException catch (e) {
      _setError(e.message);
    } catch (e) {
      _setError('Failed to sync cart: ${e.toString()}');
    }
  }

  /// Checks if a product is in the cart
  bool containsProduct(String productId) {
    return _cart?.containsProduct(productId) ?? false;
  }

  /// Gets the quantity of a product in the cart
  int getProductQuantity(String productId) {
    final item = _cart?.getItemByProductId(productId);
    return item?.quantity ?? 0;
  }

  /// Clears any error messages
  void clearError() {
    _clearError();
    notifyListeners();
  }

  /// Sets the cart state
  void _setState(CartState newState) {
    _state = newState;
    notifyListeners();
  }

  /// Sets an error message and updates state to error
  void _setError(String message) {
    _errorMessage = message;
    _state = CartState.error;
    notifyListeners();
  }

  /// Clears the error message
  void _clearError() {
    _errorMessage = null;
  }
}
