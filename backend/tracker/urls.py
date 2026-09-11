from django.urls import path
from .views import (
    DashboardView,
    MealDetailView,
    MealListCreateView,
    RankingView,
    TipsView,
    TripDetailView,
    TripListCreateView,
)

urlpatterns = [
    path("meals/", MealListCreateView.as_view(), name="meals"),
    path("meals/<int:pk>/", MealDetailView.as_view(), name="meal-detail"),
    path("trips/", TripListCreateView.as_view(), name="trips"),
    path("trips/<int:pk>/", TripDetailView.as_view(), name="trip-detail"),
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
    path("tips/", TipsView.as_view(), name="tips"),
    path("ranking/", RankingView.as_view(), name="ranking"),
]
