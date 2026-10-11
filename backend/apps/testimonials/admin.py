from django.contrib import admin

from .models import Testimonial


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("customer_name", "company", "order", "is_visible")
    list_editable = ("order", "is_visible")
    search_fields = ("customer_name", "company", "text")