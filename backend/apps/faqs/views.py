from rest_framework import permissions, viewsets

from .models import FAQ
from .serializers import FAQSerializer


class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FAQ.objects.filter(is_visible=True).order_by("category", "order")
    serializer_class = FAQSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ("category",)