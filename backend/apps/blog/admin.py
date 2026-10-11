from django.contrib import admin

from .models import Article, BlogCategory


@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "order", "is_visible")
    list_editable = ("order", "is_visible")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "author", "status", "published_at", "updated_at")
    list_filter = ("status", "category", "author")
    search_fields = ("title", "excerpt", "body")
    prepopulated_fields = {"slug": ("title",)}
    filter_horizontal = ("related_products", "related_articles")
    fieldsets = (
        ("Basic", {"fields": ("title", "slug", "excerpt", "body")}),
        ("Media", {"fields": ("featured_image", "image_alt")}),
        ("Meta", {"fields": ("author", "category", "tags")}),
        ("Publishing", {"fields": ("status", "published_at")}),
        ("SEO", {"fields": ("seo_title", "meta_description", "canonical_url", "og_image")}),
        ("Related", {"fields": ("related_products", "related_articles")}),
    )