import 'package:flutter_ecommerce_app/data/datasources/local/secure_storage_service.dart';
import 'package:flutter_ecommerce_app/data/datasources/local/storage_keys.dart';
import 'package:flutter_ecommerce_app/data/datasources/remote/dokan_api_client.dart';
import 'package:flutter_ecommerce_app/data/models/auth_response_model.dart';
import 'package:flutter_ecommerce_app/data/repositories/auth_repository.dart';

/// Implementation of AuthRepository using DokanApiClient and SecureStorageService
class AuthRepositoryImpl implements AuthRepository {
  final DokanApiClient _apiClient;
  final SecureStorageService _secureStorage;

  AuthRepositoryImpl({
    required DokanApiClient apiClient,
    required SecureStorageService secureStorage,
  })  : _apiClient = apiClient,
        _secureStorage = secureStorage;

  @override
  Future<AuthResponse> login(String email, String password) async {
    final response = await _apiClient.post<AuthResponse>(
      '/auth/login',
      body: {
        'email': email,
        'password': password,
      },
      fromJson: (json) => AuthResponse.fromJson(json as Map<String, dynamic>),
    );

    // Save token and user data to secure storage
    await saveToken(response.token);
    await _secureStorage.saveToken(StorageKeys.userId, response.user.id);
    await _secureStorage.saveToken(StorageKeys.userEmail, response.user.email);

    // Set token in API client for subsequent requests
    _apiClient.setAuthToken(response.token);

    return response;
  }

  @override
  Future<AuthResponse> register(String email, String password) async {
    final response = await _apiClient.post<AuthResponse>(
      '/auth/register',
      body: {
        'email': email,
        'password': password,
      },
      fromJson: (json) => AuthResponse.fromJson(json as Map<String, dynamic>),
    );

    // Save token and user data to secure storage
    await saveToken(response.token);
    await _secureStorage.saveToken(StorageKeys.userId, response.user.id);
    await _secureStorage.saveToken(StorageKeys.userEmail, response.user.email);

    // Set token in API client for subsequent requests
    _apiClient.setAuthToken(response.token);

    return response;
  }

  @override
  Future<void> logout() async {
    // Clear token from API client
    _apiClient.clearAuthToken();

    // Clear all stored data
    await _secureStorage.clearAll();
  }

  @override
  Future<String?> getStoredToken() async {
    return await _secureStorage.getToken(StorageKeys.authToken);
  }

  @override
  Future<void> saveToken(String token) async {
    await _secureStorage.saveToken(StorageKeys.authToken, token);
  }

  @override
  Future<bool> isAuthenticated() async {
    final token = await getStoredToken();
    return token != null && token.isNotEmpty;
  }
}
