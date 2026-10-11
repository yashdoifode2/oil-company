from rest_framework import viewsets

from .models import Redirect
from .serializers import RedirectSerializer


class RedirectViewSet(viewsets.ModelViewSet):
    queryset = Redirect.objects.all().order_by("-created_at")
    serializer_class = RedirectSerializer
    filterset_fields = ("is_active",)
    search_fields = ("old_path", "new_path")