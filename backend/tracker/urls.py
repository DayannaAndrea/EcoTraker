from django.urls import path
from .views import MealListCreateView, TripListCreateView, DashboardView

urlpatterns = [
    path('meals/', MealListCreateView.as_view(), name = 'meals'),
    path('trips/', TripListCreateView.as_view(), name='trips'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
]
