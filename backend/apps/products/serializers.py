from rest_framework import serializers

from .models import Product, ProductCategory, ProductDocument, ProductImage


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = ("id", "name", "slug", "description", "image", "order")


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ("id", "image", "alt_text", "order")


class ProductDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductDocument
        fields = ("id", "title", "file", "description", "is_public", "order")


class ProductListSerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = ("id", "name", "slug", "category", "short_description", "main_image", "is_featured")


class ProductDetailSerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    documents = serializers.SerializerMethodField()

    class Meta:
        model = Product
        exclude = ()

    def get_documents(self, obj):
        qs = obj.documents.filter(is_public=True).order_by("order")
        return ProductDocumentSerializer(qs, many=True).data