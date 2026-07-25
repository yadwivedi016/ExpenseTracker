import re

from rest_framework import serializers


class RegisterSerializer(serializers.Serializer):

    email = serializers.EmailField()

    first_name = serializers.CharField(
        max_length=50,
        min_length=2
    )

    last_name = serializers.CharField(
        max_length=50,
        min_length=2
    )

    username = serializers.CharField(
        max_length=30,
        min_length=4
    )

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    def validate_username(self, value):

        value = value.strip()

        if " " in value:
            raise serializers.ValidationError(
                "Username cannot contain spaces."
            )

        if not re.fullmatch(r"[a-z][a-z0-9_.]*", value):
            raise serializers.ValidationError(
                "Username must start with a lowercase letter and contain only lowercase letters, numbers, underscores (_) and dots (.)."
            )

        return value

    def validate_password(self, value):

        if " " in value:
            raise serializers.ValidationError(
                "Password cannot contain spaces."
            )

        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError(
                "Password must contain at least one uppercase letter."
            )

        if not re.search(r"[a-z]", value):
            raise serializers.ValidationError(
                "Password must contain at least one lowercase letter."
            )

        if not re.search(r"\d", value):
            raise serializers.ValidationError(
                "Password must contain at least one number."
            )

        if not re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>/?]", value):
            raise serializers.ValidationError(
                "Password must contain at least one special character."
            )

        return value


class LoginSerializer(serializers.Serializer):

    login = serializers.CharField(
        max_length=100
    )

    password = serializers.CharField(
        write_only=True
    )

    def validate_login(self, value):

        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Username or email is required."
            )

        if " " in value:
            raise serializers.ValidationError(
                "Username or email cannot contain spaces."
            )

        if "@" in value:

            email_pattern = r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"

            if not re.fullmatch(email_pattern, value):
                raise serializers.ValidationError(
                    "Enter a valid email address."
                )

        else:

            username_pattern = r"^[a-z][a-z0-9_.]*$"

            if not re.fullmatch(username_pattern, value):
                raise serializers.ValidationError(
                    "Invalid username format."
                )

        return value


class CategorySerializer(serializers.Serializer):

    category_name = serializers.CharField(
        max_length=50,
        min_length=2,
    )

    type = serializers.ChoiceField(
        choices=["Income", "Expense"]
    )

    def validate_category_name(self, value):

        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Category name cannot be empty."
            )

        if not re.fullmatch(r"[A-Za-z0-9&_\- ]+", value):
            raise serializers.ValidationError(
                "Category name can contain only letters, numbers, spaces, hyphens (-), underscores (_) and ampersands (&)."
            )

        return value


class TransactionSerializer(serializers.Serializer):

    category_id = serializers.IntegerField(
        min_value=1
    )

    amount = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        min_value=0.01
    )

    description = serializers.CharField(
        max_length=500,
        required=False,
        allow_blank=True
    )

    transaction_date = serializers.DateField()

    def validate_description(self, value):

        return value.strip()

    def validate_amount(self, value):

        if value <= 0:
            raise serializers.ValidationError(
                "Amount must be greater than zero."
            )

        return value
    
