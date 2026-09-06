from django.urls import path
from .views import MealListCreateView, TripListCreateView

urlpatterns = [
    path('meals/', MealListCreateView.as_view(), name = 'meals'),
    path('trips/', TripListCreateView.as_view(), name='trips'),
]
