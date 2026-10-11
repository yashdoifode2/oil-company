from django.contrib import admin

from .models import HomepageSection


@admin.register(HomepageSection)
class HomepageSectionAdmin(admin.ModelAdmin):
    list_display = ("__str__", "section_type", "order", "is_visible", "updated_at")
    list_filter = ("section_type", "is_visible")
    list_editable = ("order", "is_visible")
    search_fields = ("title", "heading", "description")
    fieldsets = (
        ("Type", {"fields": ("section_type", "order", "is_visible")}),
        ("Copy", {"fields": ("title", "subtitle", "heading", "description")}),
        ("Buttons", {"fields": ("button_text", "button_url", "secondary_button_text", "secondary_button_url")}),
        ("Media", {"fields": ("main_image", "background_image", "mobile_image", "image_alt")}),
        ("Layout", {"fields": ("text_alignment", "overlay_opacity", "background_style")}),
        ("Advanced config (JSON)", {"fields": ("config",), "classes": ("collapse",)}),
    )