from datetime import timedelta

from django.contrib.auth.models import User
from django.db.models import Sum
from django.utils import timezone
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import MealEntry, TripEntry
from .serializers import MealEntrySerializer, RankingSerializer, TripEntrySerializer
from .tips import get_environmental_tip


class MealListCreateView(generics.ListCreateAPIView):
    serializer_class = MealEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MealEntry.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MealDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = MealEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MealEntry.objects.filter(user=self.request.user)


class TripListCreateView(generics.ListCreateAPIView):
    serializer_class = TripEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TripEntry.objects.filter(user=self.request.user).order_by("-date", "-id")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TripDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = TripEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TripEntry.objects.filter(user=self.request.user)


class DashboardView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.localdate()
        start_date = today - timedelta(days=6)
        chart_start_date = today - timedelta(days=29)

        meals = MealEntry.objects.filter(
            user=request.user,
            created_at__date__range=[start_date, today],
        )
        trips = TripEntry.objects.filter(
            user=request.user,
            date__range=[start_date, today],
        )
        chart_meals = MealEntry.objects.filter(
            user=request.user,
            created_at__date__range=[chart_start_date, today],
        )
        chart_trips = TripEntry.objects.filter(
            user=request.user,
            date__range=[chart_start_date, today],
        )

        food_total = meals.aggregate(total=Sum("co2_impact"))["total"] or 0
        travel_total = trips.aggregate(total=Sum("co2_impact"))["total"] or 0

        food_records = [
            {
                "id": meal.id,
                "co2": meal.co2_impact,
                "createdAt": meal.created_at,
                "type": "food",
                "food": meal.food,
                "portions": meal.portions,
            }
            for meal in meals
        ]

        travel_records = [
            {
                "id": trip.id,
                "co2": trip.co2_impact,
                "createdAt": trip.date,
                "type": "travel",
                "transport": trip.transport,
                "distance": trip.distance,
                "date": trip.date,
            }
            for trip in trips
        ]

        chart_records = [
            {
                "id": f"food-{meal.id}",
                "co2": meal.co2_impact,
                "createdAt": meal.created_at,
                "type": "food",
            }
            for meal in chart_meals
        ] + [
            {
                "id": f"travel-{trip.id}",
                "co2": trip.co2_impact,
                "createdAt": trip.date,
                "type": "travel",
            }
            for trip in chart_trips
        ]

        total_impact = food_total + travel_total

        return Response({
            "foodTotal": food_total,
            "travelTotal": travel_total,
            "totalImpact": total_impact,
            "foodRecords": food_records,
            "travelRecords": travel_records,
            "chartRecords": chart_records,
        })


class TipsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tip = get_environmental_tip(request.user)
        if tip is None:
            return Response({"message": "No hay registros suficientes para generar un tip."})
        return Response(tip)


class RankingView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.localdate()
        start_date = today - timedelta(days=6)
        ranking = []

        for user in User.objects.all():
            food_total = MealEntry.objects.filter(
                user=user,
                created_at__date__range=[start_date, today],
            ).aggregate(total=Sum("co2_impact"))["total"] or 0

            travel_total = TripEntry.objects.filter(
                user=user,
                date__range=[start_date, today],
            ).aggregate(total=Sum("co2_impact"))["total"] or 0

            ranking.append({
                "username": user.username,
                "weekly_footprint": float(food_total + travel_total),
            })

        ranking.sort(key=lambda item: item["weekly_footprint"])
        return Response(RankingSerializer(ranking, many=True).data)
