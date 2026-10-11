from django.contrib import admin

from .models import Page, PageSection


class PageSectionInline(admin.StackedInline):
    model = PageSection
    extra = 0
    fieldsets = (
        ("Type & visibility", {"fields": ("section_type", "order", "is_visible")}),
        ("Content", {"fields": ("title", "subtitle", "heading", "body")}),
        ("Media", {"fields": ("image", "image_alt")}),
        ("Button", {"fields": ("button_text", "button_url")}),
        ("Advanced (JSON)", {"fields": ("config",), "classes": ("collapse",)}),
    )


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "status", "show_in_navigation", "show_in_footer", "updated_at")
    list_filter = ("status", "show_in_navigation", "show_in_footer")
    search_fields = ("title", "slug", "short_description")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [PageSectionInline]
    fieldsets = (
        ("Basic", {"fields": ("title", "slug", "short_description", "featured_image", "content")}),
        ("SEO", {"fields": ("seo_title", "meta_description", "canonical_url", "og_image", "allow_indexing")}),
        ("Publishing", {"fields": ("status", "published_at", "order")}),
        ("Placement", {"fields": ("show_in_navigation", "show_in_footer", "show_breadcrumbs")}),
    )