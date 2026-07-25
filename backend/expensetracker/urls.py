from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    ProfileView,
    LogoutView,
    CategoryView,
    TransactionView,
)

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("profile/", ProfileView.as_view()),
    path("logout/", LogoutView.as_view()),

    path("categories/", CategoryView.as_view()),
    path("categories/<int:category_id>/", CategoryView.as_view()),

    path("transactions/", TransactionView.as_view()),
    path("transactions/<int:transaction_id>/", TransactionView.as_view()),
]