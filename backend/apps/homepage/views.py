from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import HomepageSection
from .serializers import HomepageSectionSerializer


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def homepage(request):
    qs = HomepageSection.objects.filter(is_visible=True).order_by("order")
    return Response({"sections": HomepageSectionSerializer(qs, many=True).data})