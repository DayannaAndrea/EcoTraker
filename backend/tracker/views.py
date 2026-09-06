from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import MealEntry, TripEntry
from .serializers import MealEntrySerializer, TripEntrySerializer


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
    