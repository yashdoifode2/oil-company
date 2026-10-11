from django.contrib import admin

from .models import Inquiry


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "company", "status", "email_notified", "created_at")
    list_filter = ("status", "email_notified", "created_at")
    search_fields = ("name", "email", "company", "message")
    readonly_fields = ("created_at", "updated_at", "email_notified", "email_error")
    fieldsets = (
        ("Contact", {"fields": ("name", "email", "phone", "company")}),
        ("Request", {"fields": ("product_of_interest", "quantity", "message")}),
        ("Workflow", {"fields": ("status", "internal_notes")}),
        ("Notification", {"fields": ("email_notified", "email_error", "created_at", "updated_at")}),
    )