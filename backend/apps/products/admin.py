from django.contrib import admin

from .models import Product, ProductCategory, ProductDocument, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductDocumentInline(admin.TabularInline):
    model = ProductDocument
    extra = 0


@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "order", "is_visible")
    list_editable = ("order", "is_visible")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "status", "is_featured", "order", "updated_at")
    list_filter = ("status", "is_featured", "category")
    search_fields = ("name", "short_description", "full_description")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductImageInline, ProductDocumentInline]
    fieldsets = (
        ("Basic", {
            "fields": (
                "name",
                "slug",
                "category",
                "status",
                "is_featured",
                "order",
                "hero_tagline",
            )
        }),
        ("Content", {"fields": ("short_description", "full_description")}),
        ("Media", {"fields": ("main_image", "image_alt")}),
        ("Details", {"fields": ("specifications", "applications", "packaging_options", "availability")}),
        ("SEO", {"fields": ("seo_title", "meta_description", "canonical_url", "og_image")}),
    )

    def delete_model(self, request, obj):
        # Warn-not-block: rely on Django's confirmation page.
        super().delete_model(request, obj)