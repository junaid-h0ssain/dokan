import 'package:flutter_ecommerce_app/data/models/auth_response_model.dart';

/// Abstract repository interface for authentication operations
abstract class AuthRepository {
  /// Authenticates a user with email and password
  /// 
  /// Returns [AuthResponse] containing JWT token and user data
  /// Throws [AuthenticationException] if credentials are invalid
  /// Throws [NetworkException] if network error occurs
  Future<AuthResponse> login(String email, String password);

  /// Registers a new user with email and password
  /// 
  /// Returns [AuthResponse] containing JWT token and user data
  /// Throws [ValidationException] if input is invalid
  /// Throws [ServerException] if email already exists
  /// Throws [NetworkException] if network error occurs
  Future<AuthResponse> register(String email, String password);

  /// Logs out the current user
  /// 
  /// Clears stored authentication token and user data
  Future<void> logout();

  /// Retrieves the stored JWT token
  /// 
  /// Returns the token string or null if not authenticated
  Future<String?> getStoredToken();

  /// Saves the JWT token to secure storage
  /// 
  /// [token] - The JWT token to store
  Future<void> saveToken(String token);

  /// Checks if a user is currently authenticated
  /// 
  /// Returns true if a valid token exists in storage
  Future<bool> isAuthenticated();
}
