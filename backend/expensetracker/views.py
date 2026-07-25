from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password

from .db import ExpenseTrackerDb
from .serializers import RegisterSerializer, LoginSerializer, CategorySerializer, TransactionSerializer

db = ExpenseTrackerDb()


class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = db.register_user(**serializer.validated_data)

        if result["success"]:
            return Response(
                {
                    "success": True,
                    "message": "User registered successfully."
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            result,
            status=status.HTTP_400_BAD_REQUEST
        )


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
                status=status.HTTP_401_UNAUTHORIZED
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
            status=status.HTTP_200_OK
        )


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        # Read user_id directly from the authenticated JWT token payload
        user_id = request.user.id if hasattr(request.user, 'id') else request.auth.get("user_id")

        if not user_id:
            return Response(
                {"success": False, "message": "Authentication required."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        user = db.get_user_by_id(user_id)

        if user is None:
            return Response(
                {"success": False, "message": "User not found."},
                status=status.HTTP_404_NOT_FOUND
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
                }
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        return Response(
            {"success": True, "message": "Logout successful."},
            status=status.HTTP_200_OK
        )


class CategoryView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def _get_user_id(self, request):
        return request.user.id if hasattr(request.user, 'id') else request.auth.get("user_id")

    def get(self, request):
        user_id = self._get_user_id(request)
        categories = db.get_categories(user_id)

        return Response(
            {"success": True, "categories": categories},
            status=status.HTTP_200_OK
        )

    def post(self, request):
        user_id = self._get_user_id(request)
        serializer = CategorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = db.create_category(
            user_id=user_id,
            category_name=serializer.validated_data["category_name"],
            category_type=serializer.validated_data["type"],
        )

        return Response(
            result,
            status=status.HTTP_201_CREATED if result["success"] else status.HTTP_400_BAD_REQUEST
        )

    def put(self, request, category_id):
        user_id = self._get_user_id(request)
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
            status=status.HTTP_200_OK if result["success"] else status.HTTP_404_NOT_FOUND
        )

    def delete(self, request, category_id):
        user_id = self._get_user_id(request)
        result = db.delete_category(
            user_id=user_id,
            category_id=category_id,
        )

        return Response(
            result,
            status=status.HTTP_200_OK if result["success"] else status.HTTP_404_NOT_FOUND
        )


class TransactionView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def _get_user_id(self, request):
        return request.user.id if hasattr(request.user, 'id') else request.auth.get("user_id")

    def get(self, request):
        user_id = self._get_user_id(request)
        date = request.GET.get("date")

        if date:
            try:
                year, month = date.split("-")
                transactions = db.get_transactions(user_id=user_id, year=year, month=month)
            except ValueError:
                return Response(
                    {"success": False, "message": "Invalid date format."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            transactions = db.get_transactions(user_id=user_id)

        return Response(
            {"success": True, "transactions": transactions},
            status=status.HTTP_200_OK
        )

    def post(self, request):
        user_id = self._get_user_id(request)
        serializer = TransactionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = db.create_transaction(
            user_id=user_id,
            **serializer.validated_data
        )

        return Response(
            result,
            status=status.HTTP_201_CREATED if result["success"] else status.HTTP_400_BAD_REQUEST
        )

    def put(self, request, transaction_id):
        user_id = self._get_user_id(request)
        serializer = TransactionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = db.update_transaction(
            user_id=user_id,
            transaction_id=transaction_id,
            **serializer.validated_data
        )

        return Response(
            result,
            status=status.HTTP_200_OK if result["success"] else status.HTTP_404_NOT_FOUND
        )

    def delete(self, request, transaction_id):
        user_id = self._get_user_id(request)
        result = db.delete_transaction(
            user_id=user_id,
            transaction_id=transaction_id,
        )

        return Response(
            result,
            status=status.HTTP_200_OK if result["success"] else status.HTTP_404_NOT_FOUND
        )