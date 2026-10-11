from rest_framework import permissions, viewsets

from .models import Industry
from .serializers import IndustrySerializer


class IndustryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Industry.objects.filter(status=Industry.Status.PUBLISHED).order_by("order")
    serializer_class = IndustrySerializer
    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]
    search_fields = ("name", "description")