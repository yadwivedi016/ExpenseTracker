from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from .db import ExpenseTrackerDb
from .serializers import RegisterSerializer, LoginSerializer,CategorySerializer,TransactionSerializer


db = ExpenseTrackerDb()


class RegisterView(APIView):

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

        # GENERATE JWT TOKEN
        refresh = RefreshToken()
        refresh["user_id"] = user["user_id"]
        refresh["username"] = user["username"]

        return Response(
            {
                "success": True,
                "message": "Login successful.",
                "access": str(refresh.access_token),  # <-- Front-end ISKO dhoond raha hai!
                "refresh": str(refresh),
            },
            status=status.HTTP_200_OK
        )


class ProfileView(APIView):

    def get(self, request):

        # print("PROFILE SESSION:", dict(request.session))
        # print("SESSION KEY:", request.session.session_key)

        user_id = request.session.get("user_id")

        if user_id is None:
            return Response(
                {
                    "success": False,
                    "message": "Authentication required."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        user = db.get_user_by_id(user_id)
        # print(user)

        if user is None:
            request.session.flush()

            return Response(
                {
                    "success": False,
                    "message": "User not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            {
                "success": True,
                "user": {
                    "user_id": user["user_id"],
                    "first_name": user["first_name"],
                    "last_name": user["last_name"],
                    "username": user["username"],
                    "email": user["email"],
                    "created_at": user["created_at"],
                }
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):

    def post(self, request):

        if request.session.get("user_id") is None:
            return Response(
                {
                    "success": False,
                    "message": "You are not logged in."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        request.session.flush()

        return Response(
            {
                "success": True,
                "message": "Logout successful."
            },
            status=status.HTTP_200_OK
        )
        
                         
class CategoryView(APIView):

    def get(self, request):

        user_id = request.session.get("user_id")

        if user_id is None:
            return Response(
                {
                    "success": False,
                    "message": "Authentication required."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        categories = db.get_categories(user_id)

        return Response(
            {
                "success": True,
                "categories": categories
            },
            status=status.HTTP_200_OK
        )

    def post(self, request):

        user_id = request.session.get("user_id")

        if user_id is None:
            return Response(
                {
                    "success": False,
                    "message": "Authentication required."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = CategorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = db.create_category(
            user_id=user_id,
            category_name=serializer.validated_data["category_name"],
            category_type=serializer.validated_data["type"],
        )

        if result["success"]:
            return Response(
                result,
                status=status.HTTP_201_CREATED
            )

        return Response(
            result,
            status=status.HTTP_400_BAD_REQUEST
        )

class TransactionView(APIView):

    def get(self, request):

        user_id = request.session.get("user_id")

        if user_id is None:
            return Response(
                {
                    "success": False,
                    "message": "Authentication required."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        date = request.GET.get("date")

        if date:
            try:
                year, month = date.split("-")
            except ValueError:
                return Response(
                    {
                        "success": False,
                        "message": "Invalid date format."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            transactions = db.get_transactions(
                user_id=user_id,
                year=year,
                month=month,
            )

        else:
            transactions = db.get_transactions(user_id=user_id)

        return Response(
            {
                "success": True,
                "transactions": transactions,
            },
            status=status.HTTP_200_OK
        )

    def post(self, request):

        user_id = request.session.get("user_id")

        if user_id is None:
            return Response(
                {
                    "success": False,
                    "message": "Authentication required."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = TransactionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = db.create_transaction(
            user_id=user_id,
            category_id=serializer.validated_data["category_id"],
            amount=serializer.validated_data["amount"],
            description=serializer.validated_data["description"],
            transaction_date=serializer.validated_data["transaction_date"],
        )

        if result["success"]:
            return Response(result, status=status.HTTP_201_CREATED)

        return Response(result, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):

        user_id = request.session.get("user_id")

        if user_id is None:
            return Response(
                {
                    "success": False,
                    "message": "Authentication required."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = TransactionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = db.create_transaction(
            user_id=user_id,
            category_id=serializer.validated_data["category_id"],
            amount=serializer.validated_data["amount"],
            description=serializer.validated_data["description"],
            transaction_date=serializer.validated_data["transaction_date"],
        )

        if result["success"]:
            return Response(
                result,
                status=status.HTTP_201_CREATED
            )

        return Response(
            result,
            status=status.HTTP_400_BAD_REQUEST
        )
        
class CategoryView(APIView):

    def get(self, request):

        user_id = request.session.get("user_id")

        if user_id is None:
            return Response(
                {
                    "success": False,
                    "message": "Authentication required."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        categories = db.get_categories(user_id)

        return Response(
            {
                "success": True,
                "categories": categories
            },
            status=status.HTTP_200_OK
        )

    def post(self, request):

        user_id = request.session.get("user_id")

        if user_id is None:
            return Response(
                {
                    "success": False,
                    "message": "Authentication required."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

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

        user_id = request.session.get("user_id")

        if user_id is None:
            return Response(
                {
                    "success": False,
                    "message": "Authentication required."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

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

        user_id = request.session.get("user_id")

        if user_id is None:
            return Response(
                {
                    "success": False,
                    "message": "Authentication required."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        result = db.delete_category(
            user_id=user_id,
            category_id=category_id,
        )

        return Response(
            result,
            status=status.HTTP_200_OK if result["success"] else status.HTTP_404_NOT_FOUND
        )

class TransactionView(APIView):

    def get(self, request):

        user_id = request.session.get("user_id")

        if user_id is None:
            return Response(
                {
                    "success": False,
                    "message": "Authentication required."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        transactions = db.get_transactions(user_id)

        return Response(
            {
                "success": True,
                "transactions": transactions
            }
        )

    def post(self, request):

        user_id = request.session.get("user_id")

        if user_id is None:
            return Response(
                {
                    "success": False,
                    "message": "Authentication required."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

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

        user_id = request.session.get("user_id")

        if user_id is None:
            return Response(
                {
                    "success": False,
                    "message": "Authentication required."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

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

        user_id = request.session.get("user_id")

        if user_id is None:
            return Response(
                {
                    "success": False,
                    "message": "Authentication required."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        result = db.delete_transaction(
            user_id=user_id,
            transaction_id=transaction_id,
        )

        return Response(
            result,
            status=status.HTTP_200_OK if result["success"] else status.HTTP_404_NOT_FOUND
        )