from rest_framework import permissions, viewsets

from .models import Testimonial
from .serializers import TestimonialSerializer


class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Testimonial.objects.filter(is_visible=True).order_by("order")
    serializer_class = TestimonialSerializer
    permission_classes = [permissions.AllowAny]