from rest_framework import permissions, viewsets

from .models import Document
from .serializers import DocumentSerializer


class DocumentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Document.objects.filter(is_public=True).order_by("order")
    serializer_class = DocumentSerializer
    permission_classes = [permissions.AllowAny]