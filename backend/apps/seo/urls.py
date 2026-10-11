from rest_framework.routers import DefaultRouter

from .views import RedirectViewSet

router = DefaultRouter()
router.register("redirects", RedirectViewSet, basename="redirect")

urlpatterns = router.urls