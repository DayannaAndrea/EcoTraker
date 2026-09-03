from rest_framework import serializers
from .models import MealEntry

class MealEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = MealEntry
        fields = ['id', 'food', 'portions', 'co2_impact', 'created_at']
        read_only_fields = ['id', 'co2_impact', 'created_at']

    def create(self, validated_data):
        factors = {
            'Carne de res': 6.0,
            'Pollo': 1.5,
            'Pescado': 1.2,
            'Vegetariana': 0.7,
            'Vegana': 0.4,
        }

        food = validated_data['food']
        portions = validated_data['portions']

        co2_impact = factors[food] * portions

        return MealEntry.objects.create(
            co2_impact=co2_impact, 
            **validated_data
        )