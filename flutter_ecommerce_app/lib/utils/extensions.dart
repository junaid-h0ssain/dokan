import 'package:intl/intl.dart';

extension StringExtensions on String {
  bool get isValidEmail {
    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );
    return emailRegex.hasMatch(this);
  }

  bool get isNotEmpty => trim().isNotEmpty;

  String get capitalize {
    if (isEmpty) return this;
    return this[0].toUpperCase() + substring(1);
  }
}

extension DoubleExtensions on double {
  String get formattedPrice {
    return '\$${toStringAsFixed(2)}';
  }

  String get formattedCurrency {
    final formatter = NumberFormat.currency(symbol: '\$');
    return formatter.format(this);
  }
}

extension IntExtensions on int {
  String get formattedPrice {
    return '\$$this';
  }
}

extension DateTimeExtensions on DateTime {
  String get formattedDate {
    final formatter = DateFormat('MMM dd, yyyy');
    return formatter.format(this);
  }

  String get formattedDateTime {
    final formatter = DateFormat('MMM dd, yyyy - hh:mm a');
    return formatter.format(this);
  }

  bool get isToday {
    final now = DateTime.now();
    return year == now.year && month == now.month && day == now.day;
  }

  bool get isYesterday {
    final yesterday = DateTime.now().subtract(const Duration(days: 1));
    return year == yesterday.year &&
        month == yesterday.month &&
        day == yesterday.day;
  }
}

extension ListExtensions<T> on List<T> {
  bool get isNotEmpty => length > 0;

  T? get firstOrNull => isEmpty ? null : first;

  T? get lastOrNull => isEmpty ? null : last;
}
