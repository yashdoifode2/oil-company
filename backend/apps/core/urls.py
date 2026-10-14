from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import MediaAssetViewSet, page_banner, site_bootstrap

router = DefaultRouter()
router.register("media", MediaAssetViewSet, basename="media")

urlpatterns = [
    path("site/", site_bootstrap, name="site-bootstrap"),
    path("banners/<slug:key>/", page_banner, name="page-banner"),
] + router.urls