import 'package:flutter/foundation.dart';
import 'package:flutter_ecommerce_app/data/datasources/remote/exceptions.dart';
import 'package:flutter_ecommerce_app/data/models/user_model.dart';
import 'package:flutter_ecommerce_app/data/services/auth_service.dart';

/// Authentication state enum
enum AuthState {
  initial,
  loading,
  authenticated,
  unauthenticated,
  error,
}

/// Provider for managing authentication state
class AuthProvider extends ChangeNotifier {
  final AuthService _authService;

  AuthState _state = AuthState.initial;
  User? _user;
  String? _errorMessage;

  AuthProvider({required AuthService authService})
      : _authService = authService;

  /// Current authentication state
  AuthState get state => _state;

  /// Currently authenticated user
  User? get user => _user;

  /// Error message if state is error
  String? get errorMessage => _errorMessage;

  /// Whether user is authenticated
  bool get isAuthenticated => _state == AuthState.authenticated;

  /// Whether authentication is in progress
  bool get isLoading => _state == AuthState.loading;

  /// Initializes authentication state on app startup
  /// 
  /// Checks for stored token and restores session if valid
  Future<void> initialize() async {
    try {
      _setState(AuthState.loading);
      
      final hasSession = await _authService.initializeSession();
      
      if (hasSession) {
        _user = _authService.currentUser;
        _setState(AuthState.authenticated);
      } else {
        _setState(AuthState.unauthenticated);
      }
    } catch (e) {
      _setError('Failed to initialize session: ${e.toString()}');
    }
  }

  /// Logs in a user with email and password
  /// 
  /// Updates state to authenticated on success
  /// Updates state to error on failure
  Future<void> login(String email, String password) async {
    try {
      _setState(AuthState.loading);
      _clearError();

      final response = await _authService.login(email, password);
      _user = response.user;
      
      _setState(AuthState.authenticated);
    } on AuthenticationException catch (e) {
      _setError(e.message);
    } on ValidationException catch (e) {
      _setError(e.message);
    } on NetworkException catch (e) {
      _setError(e.message);
    } catch (e) {
      _setError('An unexpected error occurred: ${e.toString()}');
    }
  }

  /// Registers a new user with email and password
  /// 
  /// Updates state to authenticated on success
  /// Updates state to error on failure
  Future<void> register(String email, String password) async {
    try {
      _setState(AuthState.loading);
      _clearError();

      final response = await _authService.register(email, password);
      _user = response.user;
      
      _setState(AuthState.authenticated);
    } on ValidationException catch (e) {
      _setError(e.message);
    } on ServerException catch (e) {
      _setError(e.message);
    } on NetworkException catch (e) {
      _setError(e.message);
    } catch (e) {
      _setError('An unexpected error occurred: ${e.toString()}');
    }
  }

  /// Logs out the current user
  /// 
  /// Clears session and updates state to unauthenticated
  Future<void> logout() async {
    try {
      _setState(AuthState.loading);
      
      await _authService.clearSession();
      _user = null;
      _clearError();
      
      _setState(AuthState.unauthenticated);
    } catch (e) {
      _setError('Failed to logout: ${e.toString()}');
    }
  }

  /// Clears any error messages
  void clearError() {
    _clearError();
    notifyListeners();
  }

  /// Sets the authentication state
  void _setState(AuthState newState) {
    _state = newState;
    notifyListeners();
  }

  /// Sets an error message and updates state to error
  void _setError(String message) {
    _errorMessage = message;
    _state = AuthState.error;
    notifyListeners();
  }

  /// Clears the error message
  void _clearError() {
    _errorMessage = null;
  }
}
