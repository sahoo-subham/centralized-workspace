from django.urls import path
from . import views

urlpatterns = [
    path('users/',views.UserListCreateView.as_view()),
    path('users/<int:pk>/',views.UserRetrieveUpdateDestroyView.as_view()),
    path('auth/register/', views.RegisterView.as_view()),
    path('auth/login/', views.LoginView.as_view()),
    path('auth/logout/',views.LogoutView.as_view()),
]
