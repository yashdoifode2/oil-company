from django.contrib import admin

from .models import CompanyProfile, MediaAsset, SiteSettings, SocialLink, ThemeSettings


@admin.register(CompanyProfile)
class CompanyProfileAdmin(admin.ModelAdmin):
    fieldsets = (
        ("Identity", {"fields": ("business_name", "legal_name", "tagline", "logo", "logo_alt", "favicon")}),
        ("Description", {"fields": ("description", "about_content")}),
        ("Mission / Vision / Values", {"fields": ("mission", "vision", "values")}),
        ("Contact", {
            "fields": (
                "email",
                "phone_primary",
                "phone_secondary",
                "whatsapp",
                "address",
                "address_short",
                "business_hours",
                "country",
                "service_regions",
            )
        }),
        ("Business Details", {"fields": ("registration_details", "certifications")}),
    )

    def has_add_permission(self, request):
        return not CompanyProfile.objects.exists()


@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ("platform", "url", "order", "is_visible")
    list_editable = ("order", "is_visible")


@admin.register(ThemeSettings)
class ThemeSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ("Colors", {"fields": ("primary_color", "secondary_color", "accent_color", "background_color", "text_color", "button_color", "button_text_color", "link_color")}),
        ("Style", {"fields": ("radius_preset", "button_style", "content_width")}),
        ("Typography", {"fields": ("heading_font", "body_font")}),
    )

    def has_add_permission(self, request):
        return not ThemeSettings.objects.exists()


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ("General", {"fields": ("site_name", "site_url", "default_language", "default_locale", "timezone")}),
        ("SEO Defaults", {"fields": ("default_meta_title", "default_meta_description", "default_social_image", "allow_indexing")}),
        ("Announcement Bar", {"fields": ("announcement_text", "announcement_url", "announcement_visible")}),
        ("Maintenance", {"fields": ("maintenance_mode", "maintenance_message")}),
        ("Analytics", {"fields": ("analytics_id",)}),
    )

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()


@admin.register(MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    list_display = ("title", "file", "mime_type", "size_bytes", "uploaded_at")
    search_fields = ("title", "alt_text", "description")
    readonly_fields = ("mime_type", "size_bytes", "uploaded_at")

    def save_model(self, request, obj, form, change):
        if obj.file:
            obj.size_bytes = obj.file.size
            name = obj.file.name.lower()
            if name.endswith((".jpg", ".jpeg")):
                obj.mime_type = "image/jpeg"
            elif name.endswith(".png"):
                obj.mime_type = "image/png"
            elif name.endswith(".webp"):
                obj.mime_type = "image/webp"
            elif name.endswith(".svg"):
                obj.mime_type = "image/svg+xml"
            elif name.endswith(".pdf"):
                obj.mime_type = "application/pdf"
            else:
                obj.mime_type = "application/octet-stream"
        super().save_model(request, obj, form, change)

from .models import CompanyProfile, MediaAsset, PageBanner, SiteSettings, SocialLink, ThemeSettings


@admin.register(PageBanner)
class PageBannerAdmin(admin.ModelAdmin):
    list_display = ("key", "title", "heading", "is_active", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("key", "title", "heading")
    list_editable = ("is_active",)
    fieldsets = (
        ("Identification", {
            "fields": ("key", "title"),
            "description": "The 'key' is a stable identifier used by the frontend. "
                           "Do not change it after creating the banner.",
        }),
        ("Content", {"fields": ("eyebrow", "heading", "description")}),
        ("Image", {"fields": ("image", "image_alt", "overlay_opacity")}),
        ("Status", {"fields": ("is_active", "updated_at")}),
    )
    readonly_fields = ("updated_at",)