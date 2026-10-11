from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import FooterColumn, FooterSettings, HeaderSettings, MenuItem
from .serializers import (
    FooterColumnSerializer,
    FooterSettingsSerializer,
    HeaderSettingsSerializer,
    RecursiveMenuItemSerializer,
)


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def navigation_bootstrap(request):
    return Response({
        "header": HeaderSettingsSerializer(HeaderSettings.get_solo()).data,
        "menu": RecursiveMenuItemSerializer(
            MenuItem.objects.filter(location="header", parent=None, is_visible=True).order_by("order"),
            many=True,
        ).data,
        "footer": {
            "settings": FooterSettingsSerializer(FooterSettings.get_solo()).data,
            "columns": FooterColumnSerializer(
                FooterColumn.objects.filter(is_visible=True).order_by("order"), many=True
            ).data,
        },
    })