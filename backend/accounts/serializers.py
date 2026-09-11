from django.contrib.auth.models import User
from rest_framework import serializers
import re


class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    username = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ["username", "name", "email", "password"]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": True},
        }

    def validate_email(self, value):
        value = value.strip().lower()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Ya existe una cuenta con este correo.")
        return value

    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("La contraseña debe tener al menos 6 caracteres.")
        return value

    def validate_username(self, value):
        return value.strip()

    def create(self, validated_data):
        name = validated_data.pop("name", "").strip()
        email = validated_data["email"]
        username = validated_data.get("username", "").strip()
        if not username:
            base_username = email.split("@")[0].strip() or "usuario"
            username = re.sub(r"[^a-zA-Z0-9_.-]", "", base_username) or "usuario"
            candidate = username
            suffix = 1
            while User.objects.filter(username=candidate).exists():
                suffix += 1
                candidate = f"{username}{suffix}"
            username = candidate
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({"username": "El nombre de usuario ya existe."})

        first_name = name
        last_name = ""
        parts = name.split()
        if len(parts) > 1:
            first_name = parts[0]
            last_name = " ".join(parts[1:])

        user = User.objects.create_user(
            username=username,
            email=email,
            password=validated_data["password"],
            first_name=first_name,
            last_name=last_name,
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "name"]

    def get_name(self, obj):
        full_name = f"{obj.first_name} {obj.last_name}".strip()
        return full_name or obj.username
