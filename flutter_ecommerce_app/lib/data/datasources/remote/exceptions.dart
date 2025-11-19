/// Base exception class for all API-related exceptions
abstract class AppException implements Exception {
  final String message;

  AppException(this.message);

  @override
  String toString() => message;
}

/// Exception thrown when a network error occurs
class NetworkException extends AppException {
  NetworkException(super.message);
}

/// Exception thrown when authentication fails
class AuthenticationException extends AppException {
  AuthenticationException(super.message);
}

/// Exception thrown when validation fails
class ValidationException extends AppException {
  ValidationException(super.message);
}

/// Exception thrown when server returns an error
class ServerException extends AppException {
  final int? statusCode;

  ServerException(super.message, {this.statusCode});
}

/// Exception thrown when a request times out
class TimeoutException extends AppException {
  TimeoutException(super.message);
}
