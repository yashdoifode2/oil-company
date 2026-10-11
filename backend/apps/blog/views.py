from django.utils import timezone
from rest_framework import permissions, viewsets

from .models import Article, BlogCategory
from .serializers import ArticleDetailSerializer, ArticleListSerializer, BlogCategorySerializer


class BlogCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogCategory.objects.filter(is_visible=True).order_by("order")
    serializer_class = BlogCategorySerializer
    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]


class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Article.objects.filter(
        status=Article.Status.PUBLISHED,
        published_at__lte=timezone.now(),
    ).order_by("-published_at")
    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]
    filterset_fields = ("category__slug",)
    search_fields = ("title", "excerpt", "body")

    def get_serializer_class(self):
        return ArticleDetailSerializer if self.action == "retrieve" else ArticleListSerializer