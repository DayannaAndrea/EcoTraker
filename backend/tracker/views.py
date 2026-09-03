from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import MealEntry
from .serializers import MealEntrySerializer

class MealListCreateView(generics.ListCreateAPIView):
    serializer_class = MealEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MealEntry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


