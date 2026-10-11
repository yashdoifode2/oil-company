from rest_framework.routers import DefaultRouter

from .views import ArticleViewSet, BlogCategoryViewSet

router = DefaultRouter()
router.register("blog-categories", BlogCategoryViewSet, basename="blog-category")
router.register("articles", ArticleViewSet, basename="article")

urlpatterns = router.urls