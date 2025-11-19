import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_ecommerce_app/config/app_config.dart';
import 'package:flutter_ecommerce_app/data/datasources/remote/exceptions.dart';

/// HTTP client for communicating with the Dokan API
class DokanApiClient {
  final http.Client _httpClient;
  final String _baseUrl;
  String? _authToken;

  DokanApiClient({
    http.Client? httpClient,
    String? baseUrl,
  })  : _httpClient = httpClient ?? http.Client(),
        _baseUrl = baseUrl ?? AppConfig.getApiBaseUrl();

  /// Set the authentication token for subsequent requests
  void setAuthToken(String token) {
    _authToken = token;
  }

  /// Clear the authentication token
  void clearAuthToken() {
    _authToken = null;
  }

  /// Perform a GET request
  Future<T> get<T>(
    String endpoint, {
    required T Function(dynamic) fromJson,
  }) async {
    try {
      final response = await _httpClient
          .get(
            _buildUri(endpoint),
            headers: _buildHeaders(),
          )
          .timeout(
            Duration(seconds: int.parse(AppConfig.apiTimeout)),
            onTimeout: () => throw TimeoutException(
              'Request timeout: GET $endpoint',
            ),
          );

      return _handleResponse<T>(response, fromJson);
    } on AppException {
      rethrow;
    } catch (e) {
      throw NetworkException('Network error: ${e.toString()}');
    }
  }

  /// Perform a POST request
  Future<T> post<T>(
    String endpoint, {
    required dynamic body,
    required T Function(dynamic) fromJson,
  }) async {
    try {
      final response = await _httpClient
          .post(
            _buildUri(endpoint),
            headers: _buildHeaders(),
            body: jsonEncode(body),
          )
          .timeout(
            Duration(seconds: int.parse(AppConfig.apiTimeout)),
            onTimeout: () => throw TimeoutException(
              'Request timeout: POST $endpoint',
            ),
          );

      return _handleResponse<T>(response, fromJson);
    } on AppException {
      rethrow;
    } catch (e) {
      throw NetworkException('Network error: ${e.toString()}');
    }
  }

  /// Perform a PUT request
  Future<T> put<T>(
    String endpoint, {
    required dynamic body,
    required T Function(dynamic) fromJson,
  }) async {
    try {
      final response = await _httpClient
          .put(
            _buildUri(endpoint),
            headers: _buildHeaders(),
            body: jsonEncode(body),
          )
          .timeout(
            Duration(seconds: int.parse(AppConfig.apiTimeout)),
            onTimeout: () => throw TimeoutException(
              'Request timeout: PUT $endpoint',
            ),
          );

      return _handleResponse<T>(response, fromJson);
    } on AppException {
      rethrow;
    } catch (e) {
      throw NetworkException('Network error: ${e.toString()}');
    }
  }

  /// Perform a DELETE request
  Future<T> delete<T>(
    String endpoint, {
    required T Function(dynamic) fromJson,
  }) async {
    try {
      final response = await _httpClient
          .delete(
            _buildUri(endpoint),
            headers: _buildHeaders(),
          )
          .timeout(
            Duration(seconds: int.parse(AppConfig.apiTimeout)),
            onTimeout: () => throw TimeoutException(
              'Request timeout: DELETE $endpoint',
            ),
          );

      return _handleResponse<T>(response, fromJson);
    } on AppException {
      rethrow;
    } catch (e) {
      throw NetworkException('Network error: ${e.toString()}');
    }
  }

  /// Build the full URI from endpoint
  Uri _buildUri(String endpoint) {
    final cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/$endpoint';
    return Uri.parse('$_baseUrl$cleanEndpoint');
  }

  /// Build request headers with authentication token
  Map<String, String> _buildHeaders() {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (_authToken != null) {
      headers['Authorization'] = 'Bearer $_authToken';
    }

    return headers;
  }

  /// Handle HTTP response and parse JSON
  T _handleResponse<T>(
    http.Response response,
    T Function(dynamic) fromJson,
  ) {
    try {
      final decodedBody = jsonDecode(response.body);

      switch (response.statusCode) {
        case 200:
        case 201:
          return fromJson(decodedBody);
        case 204:
          // No content response
          return fromJson(null);
        case 400:
          throw ValidationException(
            _extractErrorMessage(decodedBody) ??
                'Invalid request. Please check your input.',
          );
        case 401:
          throw AuthenticationException(
            _extractErrorMessage(decodedBody) ??
                'Authentication failed. Please log in again.',
          );
        case 403:
          throw AuthenticationException(
            _extractErrorMessage(decodedBody) ??
                'Access denied. You do not have permission.',
          );
        case 404:
          throw ServerException(
            _extractErrorMessage(decodedBody) ?? 'Resource not found.',
            statusCode: response.statusCode,
          );
        case 500:
        case 502:
        case 503:
          throw ServerException(
            _extractErrorMessage(decodedBody) ??
                'Server error. Please try again later.',
            statusCode: response.statusCode,
          );
        default:
          throw ServerException(
            _extractErrorMessage(decodedBody) ??
                'An error occurred. Status code: ${response.statusCode}',
            statusCode: response.statusCode,
          );
      }
    } on AppException {
      rethrow;
    } catch (e) {
      throw ServerException('Failed to parse response: ${e.toString()}');
    }
  }

  /// Extract error message from response body
  String? _extractErrorMessage(dynamic decodedBody) {
    if (decodedBody is Map<String, dynamic>) {
      // Try common error message fields
      return decodedBody['message'] ??
          decodedBody['error'] ??
          decodedBody['errorMessage'] ??
          decodedBody['detail'];
    }
    return null;
  }
}
