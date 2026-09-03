from django.db import models
from django.contrib.auth.models import User



class MealEntry(models.Model):

    FOOD_CHOICES = [
        ('Carne de res', 'Carne de res'),
        ('Pollo','Pollo'),
        ('Pescado', 'Pescado'),
        ('Vegetariana', 'Vegetariana'),
        ('Vegana', 'Vegana'),
    ]


    user = models.ForeignKey(User, on_delete=models.CASCADE)
    food = models.CharField(max_length = 50, choices=FOOD_CHOICES)
    portions = models.PositiveBigIntegerField()
    co2_impact = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
