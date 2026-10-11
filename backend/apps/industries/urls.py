from rest_framework.routers import DefaultRouter

from .views import IndustryViewSet

router = DefaultRouter()
router.register("industries", IndustryViewSet, basename="industry")

urlpatterns = router.urls