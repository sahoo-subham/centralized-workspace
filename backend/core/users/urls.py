from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView 

urlpatterns = [
    path('users/',              views.UserListCreateView.as_view()),
    path('users/<int:pk>/',     views.UserRetrieveUpdateDestroyView.as_view()),
    path('register/',           views.RegisterView.as_view()),
    path('login/',              views.LoginView.as_view()),
    path('logout/',             views.LogoutView.as_view()),
    path('token/refresh/',      TokenRefreshView.as_view()),  
    path('auth/forgot-password/', views.ForgotPasswordView.as_view()),
    path('auth/reset-password/',  views.ResetPasswordView.as_view()),
]