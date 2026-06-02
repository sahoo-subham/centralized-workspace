from django.urls import path
from . import views

urlpatterns = [
      path('documents/', views.DocumentListCreateView.as_view()),
    path('documents/<int:pk>/',views.DocumentRetrieveUpdateDestroyView.as_view()),
    path('document-types/', views.DocumentTypeListCreateView.as_view()),
    path('document-types/<int:pk>/',views.DocumentTypeRetrieveUpdateDestroyView.as_view()),
]
