import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class AppConfig {
  static const String apiTimeout = '30';
  
  // Platform-specific configurations
  static const String iosMinVersion = '12.0';
  static const String androidMinSdk = '21';

  // Base URLs for different platforms
  static const String _androidEmulatorUrl = 'http://10.0.2.2:8080/api';
  static const String _iosSimulatorUrl = 'http://localhost:8080/api';
  static const String _webUrl = 'http://localhost:8080/api';
  
  // For production, use your actual server URL
  static const String _productionUrl = 'https://your-api-domain.com/api';

  static Future<void> initialize() async {
    // Initialize app configuration
    // This can be extended to load from environment files or remote config
  }

  /// Returns the appropriate API base URL based on the platform
  static String getApiBaseUrl() {
    // Check if running on web
    if (kIsWeb) {
      return _webUrl;
    }
    
    // Check platform for mobile
    if (Platform.isAndroid) {
      // Android emulator uses 10.0.2.2 to access host machine's localhost
      return _androidEmulatorUrl;
    } else if (Platform.isIOS) {
      // iOS simulator can use localhost directly
      return _iosSimulatorUrl;
    }
    
    // Default fallback
    return _iosSimulatorUrl;
  }
}
