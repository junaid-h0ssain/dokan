import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'config/app_config.dart';
import 'config/routes.dart';
import 'config/theme.dart';
import 'data/datasources/local/secure_storage_service_impl.dart';
import 'data/datasources/remote/dokan_api_client.dart';
import 'data/repositories/auth_repository_impl.dart';
import 'data/repositories/product_repository_impl.dart';
import 'data/services/auth_service.dart';
import 'presentation/providers/auth_provider.dart';
import 'presentation/providers/product_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await AppConfig.initialize();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Initialize dependencies
    final secureStorage = SecureStorageServiceImpl();
    final apiClient = DokanApiClient();
    final authRepository = AuthRepositoryImpl(
      apiClient: apiClient,
      secureStorage: secureStorage,
    );
    final authService = AuthService(
      authRepository: authRepository,
      apiClient: apiClient,
    );
    final productRepository = ProductRepositoryImpl(
      apiClient: apiClient,
    );

    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => AuthProvider(authService: authService)..initialize(),
        ),
        ChangeNotifierProvider(
          create: (_) => ProductProvider(productRepository: productRepository),
        ),
        // Additional providers will be added during implementation
      ],
      child: MaterialApp.router(
        title: 'Dokan Ecommerce',
        theme: AppTheme.lightTheme,
        routerConfig: AppRoutes.router,
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}
