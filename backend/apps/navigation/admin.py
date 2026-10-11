from django.contrib import admin

from .models import FooterColumn, FooterLink, FooterSettings, HeaderSettings, MenuItem


class FooterLinkInline(admin.TabularInline):
    model = FooterLink
    extra = 1


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ("label", "location", "parent", "order", "is_visible")
    list_filter = ("location", "is_visible")
    list_editable = ("order", "is_visible")
    search_fields = ("label", "url")


@admin.register(HeaderSettings)
class HeaderSettingsAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return not HeaderSettings.objects.exists()


@admin.register(FooterColumn)
class FooterColumnAdmin(admin.ModelAdmin):
    list_display = ("title", "order", "is_visible")
    list_editable = ("order", "is_visible")
    inlines = [FooterLinkInline]


@admin.register(FooterSettings)
class FooterSettingsAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return not FooterSettings.objects.exists()