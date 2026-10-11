from rest_framework import permissions, viewsets

from .models import Product, ProductCategory
from .serializers import (
    ProductCategorySerializer,
    ProductDetailSerializer,
    ProductListSerializer,
)


class ProductCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductCategory.objects.filter(is_visible=True).order_by("order")
    serializer_class = ProductCategorySerializer
    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(status=Product.Status.PUBLISHED).order_by("order")
    lookup_field = "slug"                    # ← must be here
    permission_classes = [permissions.AllowAny]
    filterset_fields = ("category__slug", "is_featured")
    search_fields = ("name", "short_description", "full_description")

    def get_serializer_class(self):
        return ProductDetailSerializer if self.action == "retrieve" else ProductListSerializer