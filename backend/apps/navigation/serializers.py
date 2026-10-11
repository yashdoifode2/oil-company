from rest_framework import serializers

from .models import FooterColumn, FooterLink, FooterSettings, HeaderSettings, MenuItem


class RecursiveMenuItemSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = MenuItem
        fields = ("id", "label", "url", "order", "is_visible", "open_in_new_tab", "children")

    def get_children(self, obj):
        qs = obj.children.filter(is_visible=True).order_by("order")
        return RecursiveMenuItemSerializer(qs, many=True).data


class HeaderSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeaderSettings
        exclude = ()


class FooterLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = FooterLink
        fields = ("id", "label", "url", "order", "is_visible", "open_in_new_tab")


class FooterColumnSerializer(serializers.ModelSerializer):
    links = serializers.SerializerMethodField()

    class Meta:
        model = FooterColumn
        fields = ("id", "title", "order", "is_visible", "links")

    def get_links(self, obj):
        qs = obj.links.filter(is_visible=True).order_by("order")
        return FooterLinkSerializer(qs, many=True).data


class FooterSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FooterSettings
        exclude = ()