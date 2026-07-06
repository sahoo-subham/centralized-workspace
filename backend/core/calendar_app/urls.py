from django.urls import path
from . import views

urlpatterns = [
    path('events/', views.CalendarEventsView.as_view()),
]