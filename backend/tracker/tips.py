from datetime import timedelta
from django.utils import timezone
from .models import MealEntry, TripEntry


def get_environmental_tip(user):

    today = timezone.localdate()
    start_date = today - timedelta(days=6)

    meals = MealEntry.objects.filter(
        user=user,
        created_at__date__range=[start_date, today]
    )

    trips = TripEntry.objects.filter(
        user=user,
        date__range=[start_date, today]
    )

    food_categories = {}
    travel_categories = {}

    for meal in meals:
        food_categories[meal.food] = (
            food_categories.get(meal.food, 0) + meal.co2_impact
        )

    for trip in trips:
        travel_categories[trip.transport] = (
            travel_categories.get(trip.transport, 0) + trip.co2_impact
        )

    candidates = []

    for category, impact in food_categories.items():
        if impact > 14:
            candidates.append((category, impact))

    for category, impact in travel_categories.items():
        if impact > 5:
            candidates.append((category, impact))

    if not candidates:
        return None

    highest_category, highest_impact = max(
        candidates,
        key=lambda item: item[1]
    )

    tips = {
        'Carne de res': 'Considera reducir el consumo de carne de res y probar alternativas con menor impacto ambiental.',
        'Pollo': 'Considera alternar el consumo de pollo con opciones de menor impacto ambiental.',
        'Pescado': 'Considera incorporar más opciones vegetales en tus comidas.',
        'Vegetariana': '¡Muy bien! Las comidas vegetarianas tienen un impacto ambiental reducido.',
        'Vegana': '¡Excelente! Las opciones veganas tienen un impacto ambiental muy bajo.',
        'Carro': 'Considera usar bicicleta, caminar o transporte público cuando sea posible.',
        'Bus': 'Cuando sea posible, considera caminar o usar bicicleta para trayectos cortos.',
        'Bici': '¡Excelente! La bicicleta es una alternativa de muy bajo impacto ambiental.',
        'A pie': '¡Excelente! Caminar es una alternativa de impacto ambiental muy bajo.'
    }

    return {
        'category': highest_category,
        'impact': highest_impact,
        'tip': tips[highest_category]
    }