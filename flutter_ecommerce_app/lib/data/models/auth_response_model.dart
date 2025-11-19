import 'package:json_annotation/json_annotation.dart';
import 'package:flutter_ecommerce_app/data/models/user_model.dart';

part 'auth_response_model.g.dart';

/// Authentication response model containing token and user data
@JsonSerializable()
class AuthResponse {
  final String token;
  final User user;

  AuthResponse({
    required this.token,
    required this.user,
  });

  /// Creates an AuthResponse instance from JSON
  factory AuthResponse.fromJson(Map<String, dynamic> json) =>
      _$AuthResponseFromJson(json);

  /// Converts AuthResponse instance to JSON
  Map<String, dynamic> toJson() => _$AuthResponseToJson(this);

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AuthResponse &&
          runtimeType == other.runtimeType &&
          token == other.token &&
          user == other.user;

  @override
  int get hashCode => token.hashCode ^ user.hashCode;

  @override
  String toString() => 'AuthResponse(token: ${token.substring(0, 10)}..., user: $user)';
}
