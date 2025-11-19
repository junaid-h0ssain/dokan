import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'config/app_config.dart';
import 'config/routes.dart';
import 'config/theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await AppConfig.initialize();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        // Providers will be added here during implementation
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
