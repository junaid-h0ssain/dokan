import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_ecommerce_app/presentation/screens/auth/login_screen.dart';
import 'package:flutter_ecommerce_app/presentation/screens/auth/register_screen.dart';
import 'package:flutter_ecommerce_app/presentation/screens/home/home_screen.dart';
import 'package:flutter_ecommerce_app/presentation/screens/products/product_list_screen.dart';
import 'package:flutter_ecommerce_app/presentation/screens/products/product_detail_screen.dart';

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
      GoRoute(
        path: products,
        name: 'products',
        builder: (context, state) {
          final categoryId = state.uri.queryParameters['categoryId'];
          final searchQuery = state.uri.queryParameters['search'];
          return ProductListScreen(
            categoryId: categoryId,
            searchQuery: searchQuery,
          );
        },
      ),
      GoRoute(
        path: productDetail,
        name: 'productDetail',
        builder: (context, state) {
          final productId = state.uri.queryParameters['productId'];
          if (productId == null) {
            return Scaffold(
              appBar: AppBar(title: const Text('Error')),
              body: const Center(
                child: Text('Product ID is required'),
              ),
            );
          }
          return ProductDetailScreen(productId: productId);
        },
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
