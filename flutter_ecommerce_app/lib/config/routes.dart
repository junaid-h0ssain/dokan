import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_ecommerce_app/presentation/screens/auth/login_screen.dart';
import 'package:flutter_ecommerce_app/presentation/screens/auth/register_screen.dart';
import 'package:flutter_ecommerce_app/presentation/screens/home/home_screen.dart';

class AppRoutes {
  static const String login = '/login';
  static const String register = '/register';
  static const String home = '/home';
  static const String products = '/products';
  static const String productDetail = '/product-detail';
  static const String cart = '/cart';
  static const String checkout = '/checkout';
  static const String orderHistory = '/order-history';
  static const String orderDetail = '/order-detail';

  static final GoRouter router = GoRouter(
    initialLocation: login,
    routes: [
      GoRoute(
        path: login,
        name: 'login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: register,
        name: 'register',
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: home,
        name: 'home',
        builder: (context, state) => const HomeScreen(),
      ),
      // Additional routes will be added during implementation
    ],
    errorBuilder: (context, state) {
      return Scaffold(
        appBar: AppBar(title: const Text('Error')),
        body: Center(
          child: Text('Route not found: ${state.uri}'),
        ),
      );
    },
  );
}
