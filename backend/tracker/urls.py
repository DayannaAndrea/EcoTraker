from django.urls import path
from .views import MealListCreateView

urlpatterns = [
    path('meals/', MealListCreateView.as_view(), name = 'meals'),
]
