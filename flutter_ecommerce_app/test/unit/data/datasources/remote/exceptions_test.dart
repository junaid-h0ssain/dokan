import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_ecommerce_app/data/datasources/remote/exceptions.dart';

void main() {
  group('Exception Classes', () {
    test('NetworkException should store message', () {
      const message = 'Network error occurred';
      final exception = NetworkException(message);
      
      expect(exception.message, equals(message));
      expect(exception.toString(), equals(message));
    });

    test('AuthenticationException should store message', () {
      const message = 'Authentication failed';
      final exception = AuthenticationException(message);
      
      expect(exception.message, equals(message));
    });

    test('ValidationException should store message', () {
      const message = 'Validation failed';
      final exception = ValidationException(message);
      
      expect(exception.message, equals(message));
    });

    test('ServerException should store message and status code', () {
      const message = 'Server error';
      const statusCode = 500;
      final exception = ServerException(message, statusCode: statusCode);
      
      expect(exception.message, equals(message));
      expect(exception.statusCode, equals(statusCode));
    });

    test('TimeoutException should store message', () {
      const message = 'Request timeout';
      final exception = TimeoutException(message);
      
      expect(exception.message, equals(message));
    });

    test('All exceptions should be AppException instances', () {
      expect(NetworkException('test'), isA<AppException>());
      expect(AuthenticationException('test'), isA<AppException>());
      expect(ValidationException('test'), isA<AppException>());
      expect(ServerException('test'), isA<AppException>());
      expect(TimeoutException('test'), isA<AppException>());
    });
  });
}
