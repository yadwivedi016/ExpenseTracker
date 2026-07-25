import jwt
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password

from .db import ExpenseTrackerDb
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    CategorySerializer,
    TransactionSerializer,
)

db = ExpenseTrackerDb()


# -------------------------------------------------------------------
# Custom Authentication Class for Non-ORM / Custom Database setup
# -------------------------------------------------------------------
class CustomJWTUser:
    """A minimal mock user object to satisfy DRF's request.user expectations."""
    def __init__(self, user_id, username):
        self.id = user_id
        self.username = username
        self.is_authenticated = True


class CustomJWTAuthentication(BaseAuthentication):
    """
    Decodes the Bearer token manually and attaches user_id to request.user / request.auth
    without needing Django's default auth_user ORM table.
    """
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return None  # Pass through to DRF permissions check

        token = auth_header.split(" ")[1]

        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=["HS256"]
            )
            user_id = payload.get("user_id")
            username = payload.get("username", "")

            if not user_id:
                raise AuthenticationFailed("Invalid token payload.")

            user = CustomJWTUser(user_id=user_id, username=username)
            return (user, payload)

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token has expired.")
        except jwt.DecodeError:
            raise AuthenticationFailed("Invalid token format.")


# -------------------------------------------------------------------
# Views
# -------------------------------------------------------------------
class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = db.register_user(**serializer.validated_data)

        if result["success"]:
            return Response(
                {"success": True, "message": "User registered successfully."},
                status=status.HTTP_201_CREATED,
            )

        return Response(result, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        login = serializer.validated_data["login"]
        password = serializer.validated_data["password"]

        user = db.get_user_by_login(login)

        if user is None or not check_password(password, user["password"]):
            return Response(
                {"success": False, "message": "Invalid username/email or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Generate JWT Token
        refresh = RefreshToken()
        refresh["user_id"] = user["user_id"]
        refresh["username"] = user["username"]

        return Response(
            {
                "success": True,
                "message": "Login successful.",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_200_OK,
        )


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def get(self, request):
        user_id = request.user.id
        user = db.get_user_by_id(user_id)

        if user is None:
            return Response(
                {"success": False, "message": "User not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            {
                "success": True,
                "user": {
                    "user_id": user["user_id"],
                    "first_name": user.get("first_name", ""),
                    "last_name": user.get("last_name", ""),
                    "username": user["username"],
                    "email": user["email"],
                    "created_at": user.get("created_at", ""),
                },
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def post(self, request):
        return Response(
            {"success": True, "message": "Logout successful."},
            status=status.HTTP_200_OK,
        )


class CategoryView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def get(self, request):
        user_id = request.user.id
        categories = db.get_categories(user_id)

        return Response(
            {"success": True, "categories": categories},
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        user_id = request.user.id
        serializer = CategorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = db.create_category(
            user_id=user_id,
            category_name=serializer.validated_data["category_name"],
            category_type=serializer.validated_data["type"],
        )

        return Response(
            result,
            status=status.HTTP_201_CREATED if result["success"] else status.HTTP_400_BAD_REQUEST,
        )

    def put(self, request, category_id):
        user_id = request.user.id
        serializer = CategorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = db.update_category(
            user_id=user_id,
            category_id=category_id,
            category_name=serializer.validated_data["category_name"],
            category_type=serializer.validated_data["type"],
        )

        return Response(
            result,
            status=status.HTTP_200_OK if result["success"] else status.HTTP_404_NOT_FOUND,
        )

    def delete(self, request, category_id):
        user_id = request.user.id
        result = db.delete_category(
            user_id=user_id,
            category_id=category_id,
        )

        return Response(
            result,
            status=status.HTTP_200_OK if result["success"] else status.HTTP_404_NOT_FOUND,
        )


class TransactionView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def get(self, request):
        user_id = request.user.id
        date = request.GET.get("date")

        if date:
            try:
                year, month = date.split("-")
                transactions = db.get_transactions(user_id=user_id, year=year, month=month)
            except ValueError:
                return Response(
                    {"success": False, "message": "Invalid date format."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            transactions = db.get_transactions(user_id=user_id)

        return Response(
            {"success": True, "transactions": transactions},
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        user_id = request.user.id
        serializer = TransactionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = db.create_transaction(
            user_id=user_id,
            **serializer.validated_data,
        )

        return Response(
            result,
            status=status.HTTP_201_CREATED if result["success"] else status.HTTP_400_BAD_REQUEST,
        )

    def put(self, request, transaction_id):
        user_id = request.user.id
        serializer = TransactionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = db.update_transaction(
            user_id=user_id,
            transaction_id=transaction_id,
            **serializer.validated_data,
        )

        return Response(
            result,
            status=status.HTTP_200_OK if result["success"] else status.HTTP_404_NOT_FOUND,
        )

    def delete(self, request, transaction_id):
        user_id = request.user.id
        result = db.delete_transaction(
            user_id=user_id,
            transaction_id=transaction_id,
        )

        return Response(
            result,
            status=status.HTTP_200_OK if result["success"] else status.HTTP_404_NOT_FOUND,
        )