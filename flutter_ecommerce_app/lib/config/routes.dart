import 'package:go_router/go_router.dart';

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
      // Routes will be added during implementation
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
