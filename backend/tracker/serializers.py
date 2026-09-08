from rest_framework import serializers
from .models import MealEntry
from .models import TripEntry


#validaciones para las comidas
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

#validaciones para los viajes
class TripEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = TripEntry
        fields = ['id', 'transport', 'distance', 'date', 'co2_impact']
        read_only_fields = ['id', 'co2_impact']

    def create(self, validate_data):
        factors = {
            'Carro': 0.22,
            'Bus': 0.79,
            'Bici': 0.0,
            'A pie': 0.0
        }

        transport = validate_data['transport']
        distance = validate_data['distance']

        co2_impact = factors[transport] * distance

        return TripEntry.objects.create(
            co2_impact=co2_impact,
            **validate_data
        )


#serializer de los rankings
class RankingSerializer(serializers.Serializer):
    username = serializers.CharField()
    weekly_footprint = serializers.FloatField()