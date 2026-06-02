from django.urls import path
from . import views

urlpatterns = [
    path('teams/',views.TeamListCreateView.as_view()),
    path('teams/<int:pk>',views.TeamRetrieveUpdateDestroyView.as_view()),
      path('team-members/', views.TeamMemberListCreateView.as_view()),
    path('team-members/<int:pk>/',views.TeamMemberRetrieveUpdateDestroyView.as_view()),
]

