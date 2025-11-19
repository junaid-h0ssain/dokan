import 'package:json_annotation/json_annotation.dart';

part 'user_model.g.dart';

/// User data model representing an authenticated user
@JsonSerializable()
class User {
  final String id;
  final String email;
  final String? name;

  User({
    required this.id,
    required this.email,
    this.name,
  });

  /// Creates a User instance from JSON
  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);

  /// Converts User instance to JSON
  Map<String, dynamic> toJson() => _$UserToJson(this);

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is User &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          email == other.email &&
          name == other.name;

  @override
  int get hashCode => id.hashCode ^ email.hashCode ^ name.hashCode;

  @override
  String toString() => 'User(id: $id, email: $email, name: $name)';
}
