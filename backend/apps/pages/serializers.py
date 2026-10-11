from rest_framework import serializers

from .models import Page, PageSection


class PageSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageSection
        fields = "__all__"


class PageListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ("id", "title", "slug", "short_description", "featured_image", "updated_at")


class PageDetailSerializer(serializers.ModelSerializer):
    sections = serializers.SerializerMethodField()

    class Meta:
        model = Page
        exclude = ()

    def get_sections(self, obj):
        qs = obj.sections.filter(is_visible=True).order_by("order")
        return PageSectionSerializer(qs, many=True).data