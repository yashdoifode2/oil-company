from rest_framework import permissions, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import CompanyProfile, MediaAsset, SiteSettings, SocialLink, ThemeSettings
from .serializers import (
    CompanyProfileSerializer,
    MediaAssetSerializer,
    SiteSettingsSerializer,
    SocialLinkSerializer,
    ThemeSettingsSerializer,
)


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def site_bootstrap(request):
    """One-shot endpoint returning global site config for the frontend."""
    return Response({
        "company": CompanyProfileSerializer(CompanyProfile.get_solo()).data,
        "site": SiteSettingsSerializer(SiteSettings.get_solo()).data,
        "theme": ThemeSettingsSerializer(ThemeSettings.get_solo()).data,
        "social": SocialLinkSerializer(
            SocialLink.objects.filter(is_visible=True), many=True
        ).data,
    })


class MediaAssetViewSet(viewsets.ModelViewSet):
    queryset = MediaAsset.objects.all()
    serializer_class = MediaAssetSerializer
    search_fields = ("title", "alt_text")

from .models import CompanyProfile, MediaAsset, PageBanner, SiteSettings, SocialLink, ThemeSettings
from .serializers import (
    CompanyProfileSerializer,
    MediaAssetSerializer,
    PageBannerSerializer,
    SiteSettingsSerializer,
    SocialLinkSerializer,
    ThemeSettingsSerializer,
)


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def page_banner(request, key: str):
    """Return a single banner by key, or 404."""
    try:
        banner = PageBanner.objects.get(key=key, is_active=True)
    except PageBanner.DoesNotExist:
        return Response({"detail": "Not found"}, status=404)
    return Response(PageBannerSerializer(banner).data)