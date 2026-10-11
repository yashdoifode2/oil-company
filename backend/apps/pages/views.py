from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Page
from .serializers import PageDetailSerializer, PageListSerializer


class PageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Page.objects.filter(status=Page.Status.PUBLISHED).order_by("order")
    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return PageDetailSerializer
        return PageListSerializer