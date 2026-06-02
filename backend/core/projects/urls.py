from django.urls import path
from . import views

urlpatterns = [
    path('projects/',views.ProjectListCreateView.as_view()),
    path('projects/<int:pk>/',views.ProjectRetrieveUpdateDestroyView.as_view())
]
