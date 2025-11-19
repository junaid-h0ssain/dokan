import 'package:flutter_ecommerce_app/data/datasources/remote/dokan_api_client.dart';
import 'package:flutter_ecommerce_app/data/models/auth_response_model.dart';
import 'package:flutter_ecommerce_app/data/models/user_model.dart';
import 'package:flutter_ecommerce_app/data/repositories/auth_repository.dart';

/// Service for managing authentication sessions and token handling
class AuthService {
  final AuthRepository _authRepository;
  final DokanApiClient _apiClient;
  
  User? _currentUser;

  AuthService({
    required AuthRepository authRepository,
    required DokanApiClient apiClient,
  })  : _authRepository = authRepository,
        _apiClient = apiClient;

  /// Gets the currently authenticated user
  User? get currentUser => _currentUser;

  /// Checks if a user is currently authenticated
  Future<bool> isAuthenticated() async {
    return await _authRepository.isAuthenticated();
  }

  /// Gets the stored authentication token
  Future<String?> getToken() async {
    return await _authRepository.getStoredToken();
  }

  /// Initializes the session by loading stored token
  /// 
  /// Should be called on app startup to restore authentication state
  /// Returns true if a valid session was restored
  Future<bool> initializeSession() async {
    final token = await getToken();
    
    if (token != null && token.isNotEmpty) {
      // Set token in API client
      _apiClient.setAuthToken(token);
      
      // TODO: Optionally fetch current user data from API
      // For now, we'll consider the session valid if token exists
      return true;
    }
    
    return false;
  }

  /// Authenticates a user with email and password
  /// 
  /// Returns [AuthResponse] containing token and user data
  /// Updates current user and session state
  Future<AuthResponse> login(String email, String password) async {
    final response = await _authRepository.login(email, password);
    _currentUser = response.user;
    return response;
  }

  /// Registers a new user with email and password
  /// 
  /// Returns [AuthResponse] containing token and user data
  /// Updates current user and session state
  Future<AuthResponse> register(String email, String password) async {
    final response = await _authRepository.register(email, password);
    _currentUser = response.user;
    return response;
  }

  /// Clears the current session
  /// 
  /// Logs out the user and clears all stored authentication data
  Future<void> clearSession() async {
    await _authRepository.logout();
    _currentUser = null;
  }

  /// Refreshes the authentication token
  /// 
  /// This method can be extended to implement token refresh logic
  /// Returns true if token was successfully refreshed
  Future<bool> refreshToken() async {
    // TODO: Implement token refresh logic if API supports it
    // For now, return false indicating refresh is not implemented
    return false;
  }
}
