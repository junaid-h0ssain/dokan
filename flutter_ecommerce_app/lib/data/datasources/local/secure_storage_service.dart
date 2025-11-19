/// Abstract interface for secure storage operations
abstract class SecureStorageService {
  /// Saves a token to secure storage
  /// 
  /// [key] - The key to store the token under
  /// [value] - The token value to store
  Future<void> saveToken(String key, String value);

  /// Retrieves a token from secure storage
  /// 
  /// [key] - The key of the token to retrieve
  /// Returns the token value or null if not found
  Future<String?> getToken(String key);

  /// Deletes a token from secure storage
  /// 
  /// [key] - The key of the token to delete
  Future<void> deleteToken(String key);

  /// Clears all data from secure storage
  /// Used during logout to remove all sensitive data
  Future<void> clearAll();
}
