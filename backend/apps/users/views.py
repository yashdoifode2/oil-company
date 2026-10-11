from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets

from .models import User
from .serializers import UserSerializer


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all().order_by("username")
    serializer_class = UserSerializer
    search_fields = ("username", "email")
    filterset_fields = ("role", "is_active")