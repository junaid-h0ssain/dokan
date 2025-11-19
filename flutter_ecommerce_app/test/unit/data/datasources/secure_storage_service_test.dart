import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_ecommerce_app/data/datasources/local/secure_storage_service_impl.dart';
import 'package:flutter_ecommerce_app/data/datasources/local/storage_keys.dart';

class MockFlutterSecureStorage extends Mock implements FlutterSecureStorage {}

void main() {
  late SecureStorageServiceImpl secureStorageService;
  late MockFlutterSecureStorage mockSecureStorage;

  setUp(() {
    mockSecureStorage = MockFlutterSecureStorage();
    secureStorageService = SecureStorageServiceImpl(
      secureStorage: mockSecureStorage,
    );
  });

  group('SecureStorageService', () {
    group('saveToken', () {
      test('should save token to secure storage', () async {
        // Arrange
        const key = StorageKeys.authToken;
        const token = 'test_jwt_token_12345';
        when(() => mockSecureStorage.write(key: key, value: token))
            .thenAnswer((_) async => null);

        // Act
        await secureStorageService.saveToken(key, token);

        // Assert
        verify(() => mockSecureStorage.write(key: key, value: token)).called(1);
      });

      test('should throw exception when save fails', () async {
        // Arrange
        const key = StorageKeys.authToken;
        const token = 'test_token';
        when(() => mockSecureStorage.write(key: key, value: token))
            .thenThrow(Exception('Storage error'));

        // Act & Assert
        expect(
          () => secureStorageService.saveToken(key, token),
          throwsException,
        );
      });
    });

    group('getToken', () {
      test('should retrieve token from secure storage', () async {
        // Arrange
        const key = StorageKeys.authToken;
        const token = 'test_jwt_token_12345';
        when(() => mockSecureStorage.read(key: key))
            .thenAnswer((_) async => token);

        // Act
        final result = await secureStorageService.getToken(key);

        // Assert
        expect(result, equals(token));
        verify(() => mockSecureStorage.read(key: key)).called(1);
      });

      test('should return null when token does not exist', () async {
        // Arrange
        const key = StorageKeys.authToken;
        when(() => mockSecureStorage.read(key: key))
            .thenAnswer((_) async => null);

        // Act
        final result = await secureStorageService.getToken(key);

        // Assert
        expect(result, isNull);
      });

      test('should throw exception when retrieval fails', () async {
        // Arrange
        const key = StorageKeys.authToken;
        when(() => mockSecureStorage.read(key: key))
            .thenThrow(Exception('Storage error'));

        // Act & Assert
        expect(
          () => secureStorageService.getToken(key),
          throwsException,
        );
      });
    });

    group('deleteToken', () {
      test('should delete token from secure storage', () async {
        // Arrange
        const key = StorageKeys.authToken;
        when(() => mockSecureStorage.delete(key: key))
            .thenAnswer((_) async => null);

        // Act
        await secureStorageService.deleteToken(key);

        // Assert
        verify(() => mockSecureStorage.delete(key: key)).called(1);
      });

      test('should throw exception when deletion fails', () async {
        // Arrange
        const key = StorageKeys.authToken;
        when(() => mockSecureStorage.delete(key: key))
            .thenThrow(Exception('Storage error'));

        // Act & Assert
        expect(
          () => secureStorageService.deleteToken(key),
          throwsException,
        );
      });
    });

    group('clearAll', () {
      test('should clear all data from secure storage', () async {
        // Arrange
        when(() => mockSecureStorage.deleteAll())
            .thenAnswer((_) async => null);

        // Act
        await secureStorageService.clearAll();

        // Assert
        verify(() => mockSecureStorage.deleteAll()).called(1);
      });

      test('should throw exception when clear fails', () async {
        // Arrange
        when(() => mockSecureStorage.deleteAll())
            .thenThrow(Exception('Storage error'));

        // Act & Assert
        expect(
          () => secureStorageService.clearAll(),
          throwsException,
        );
      });
    });
  });
}
