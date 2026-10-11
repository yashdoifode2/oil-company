from django.contrib import admin

from .models import FAQ


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ("question", "category", "order", "is_visible")
    list_filter = ("category", "is_visible")
    list_editable = ("order", "is_visible")
    search_fields = ("question", "answer")