/// Base exception class for all API-related exceptions
abstract class AppException implements Exception {
  final String message;

  AppException(this.message);

  @override
  String toString() => message;
}

/// Exception thrown when a network error occurs
class NetworkException extends AppException {
  NetworkException(String message) : super(message);
}

/// Exception thrown when authentication fails
class AuthenticationException extends AppException {
  AuthenticationException(String message) : super(message);
}

/// Exception thrown when validation fails
class ValidationException extends AppException {
  ValidationException(String message) : super(message);
}

/// Exception thrown when server returns an error
class ServerException extends AppException {
  final int? statusCode;

  ServerException(String message, {this.statusCode}) : super(message);
}

/// Exception thrown when a request times out
class TimeoutException extends AppException {
  TimeoutException(String message) : super(message);
}
