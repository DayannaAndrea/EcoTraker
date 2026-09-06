from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import MealEntry, TripEntry
from .serializers import MealEntrySerializer, TripEntrySerializer
from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum


#vista para las comidas
class MealListCreateView(generics.ListCreateAPIView):
    serializer_class = MealEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MealEntry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

#vista para los viajes
class TripListCreateView(generics.ListCreateAPIView):
    serializer_class = TripEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TripEntry.objects.filter(user=self.request.user)

    def perform_create(self, seiralizer):
        seiralizer.save(user=self.request.user)

#vista para calculos de registros de los ultimos 7 dias
class DashboardView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.localdate()
        start_date = today - timedelta(days = 6)

        meals = MealEntry.objects.filter(
            user=request.user,
            created_at__date__range=[start_date, today]
        )

        trips = TripEntry.objects.filter(
            user=request.user,
            date__range=[start_date, today]
        )


        food_total = meals.aggregate(
            total=Sum('co2_impact')
        )['total'] or 0

        travel_total = trips.aggregate(
            total=Sum('co2_impact')
        )['total'] or 0

        total_impact = food_total + travel_total

        food_records = [
            {
                'id': meal.id,
                'co2': meal.co2_impact,
                'createdAt': meal.created_at,
                'type': 'food'
            }
            for meal in meals
        ]

        travel_records = [
            {
                'id': trip.id,
                'co2': trip.co2_impact,
                'createdAt': trip.date,
                'type': 'travel'
            }
            for trip in trips
        ]

        return Response({
            'foodTotal': food_total,
            'travelTotal': travel_total,
            'totalImpact': total_impact,
            'foodRecords': food_records,
            'travelRecords': travel_records,
        })