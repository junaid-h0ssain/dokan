class AppConfig {
  static const String apiBaseUrl = 'http://localhost:8080/api';
  static const String apiTimeout = '30';
  
  // Platform-specific configurations
  static const String iosMinVersion = '12.0';
  static const String androidMinSdk = '21';

  static Future<void> initialize() async {
    // Initialize app configuration
    // This can be extended to load from environment files or remote config
  }

  static String getApiBaseUrl() {
    return apiBaseUrl;
  }
}
