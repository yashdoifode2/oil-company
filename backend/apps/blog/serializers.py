from rest_framework import serializers
from taggit.serializers import TagListSerializerField, TaggitSerializer

from .models import Article, BlogCategory


class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ("id", "name", "slug", "description")


class ArticleListSerializer(serializers.ModelSerializer):
    category = BlogCategorySerializer(read_only=True)
    author_name = serializers.CharField(source="author.username", read_only=True)

    class Meta:
        model = Article
        fields = (
            "id", "title", "slug", "excerpt", "featured_image", "image_alt",
            "category", "author_name", "published_at",
        )


class ArticleDetailSerializer(TaggitSerializer, serializers.ModelSerializer):
    category = BlogCategorySerializer(read_only=True)
    tags = TagListSerializerField()
    author_name = serializers.CharField(source="author.username", read_only=True)

    class Meta:
        model = Article
        exclude = ("related_products", "related_articles")