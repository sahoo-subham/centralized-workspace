from django.urls import path
from . import views

urlpatterns = [
    path('document-types/',          views.DocumentTypeListCreateView.as_view()),
    path('document-types/<int:pk>/', views.DocumentTypeRetrieveUpdateDestroyView.as_view()),
    path('documents/',          views.DocumentListCreateView.as_view()),
    path('documents/<int:pk>/', views.DocumentRetrieveDestroyView.as_view()),
    path('documents/<int:pk>/view/',     views.DocumentViewFileView.as_view()),
    path('documents/<int:pk>/download/', views.DocumentDownloadFileView.as_view()),
]