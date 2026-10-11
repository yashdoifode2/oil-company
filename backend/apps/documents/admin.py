from django.contrib import admin

from .models import Document


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("title", "is_public", "order", "uploaded_at")
    list_filter = ("is_public",)
    list_editable = ("order",)
    search_fields = ("title", "description")