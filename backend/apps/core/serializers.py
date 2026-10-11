from rest_framework import serializers

from .models import CompanyProfile, MediaAsset, SiteSettings, SocialLink, ThemeSettings


class CompanyProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProfile
        exclude = ()


class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ("id", "platform", "url", "order", "is_visible")


class ThemeSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThemeSettings
        exclude = ()


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        exclude = ()


class MediaAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaAsset
        fields = ("id", "file", "title", "alt_text", "description", "mime_type", "size_bytes", "uploaded_at")
        read_only_fields = ("mime_type", "size_bytes", "uploaded_at")