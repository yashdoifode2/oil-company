from django.db import models


class SingletonModel(models.Model):
    """Base for models that should have exactly one row."""

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_solo(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class CompanyProfile(SingletonModel):
    business_name = models.CharField(max_length=200, default="Premium Oil Co.")
    legal_name = models.CharField(max_length=200, blank=True)
    tagline = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    about_content = models.TextField(blank=True)

    mission = models.TextField(blank=True)
    vision = models.TextField(blank=True)
    values = models.TextField(blank=True)

    email = models.EmailField(blank=True)
    phone_primary = models.CharField(max_length=50, blank=True)
    phone_secondary = models.CharField(max_length=50, blank=True)
    whatsapp = models.CharField(max_length=50, blank=True)

    address_short = models.CharField(
        max_length=200,
        blank=True,
        help_text="Short address for header (e.g. 'Houston, TX')",
    )
    business_hours = models.CharField(max_length=255, blank=True)
    country = models.CharField(max_length=100, blank=True)
    service_regions = models.CharField(max_length=255, blank=True)

    registration_details = models.TextField(blank=True)
    certifications = models.TextField(blank=True)

    logo = models.ImageField(upload_to="branding/", blank=True, null=True)
    logo_alt = models.ImageField(upload_to="branding/", blank=True, null=True)
    favicon = models.ImageField(upload_to="branding/", blank=True, null=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Company Profile"
        verbose_name_plural = "Company Profile"

    def __str__(self):
        return self.business_name


class SocialLink(models.Model):
    platform = models.CharField(max_length=50)
    url = models.URLField()
    order = models.PositiveIntegerField(default=0)
    is_visible = models.BooleanField(default=True)

    class Meta:
        ordering = ("order", "platform")

    def __str__(self):
        return f"{self.platform}: {self.url}"


class ThemeSettings(SingletonModel):
    primary_color = models.CharField(max_length=9, default="#0B3D91")
    secondary_color = models.CharField(max_length=9, default="#F5A623")
    accent_color = models.CharField(max_length=9, default="#1E88E5")
    background_color = models.CharField(max_length=9, default="#FFFFFF")
    text_color = models.CharField(max_length=9, default="#1A1A1A")
    button_color = models.CharField(max_length=9, default="#0B3D91")
    button_text_color = models.CharField(max_length=9, default="#FFFFFF")
    link_color = models.CharField(max_length=9, default="#0B3D91")

    radius_preset = models.CharField(
        max_length=20,
        choices=(("none", "None"), ("sm", "Small"), ("md", "Medium"), ("lg", "Large")),
        default="md",
    )
    button_style = models.CharField(
        max_length=20,
        choices=(("solid", "Solid"), ("outline", "Outline"), ("ghost", "Ghost")),
        default="solid",
    )

    heading_font = models.CharField(max_length=80, default="Inter")
    body_font = models.CharField(max_length=80, default="Inter")
    content_width = models.CharField(
        max_length=20,
        choices=(("narrow", "Narrow"), ("default", "Default"), ("wide", "Wide")),
        default="default",
    )

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "Theme Settings"


class SiteSettings(SingletonModel):
    site_name = models.CharField(max_length=200, default="Premium Oil")
    site_url = models.URLField(default="http://localhost:3000")
    default_language = models.CharField(max_length=10, default="en")
    default_locale = models.CharField(max_length=20, default="en_US")
    timezone = models.CharField(max_length=64, default="UTC")

    default_meta_title = models.CharField(max_length=200, blank=True)
    default_meta_description = models.TextField(blank=True)
    default_social_image = models.ImageField(upload_to="seo/", blank=True, null=True)

    allow_indexing = models.BooleanField(default=True)

    announcement_text = models.CharField(max_length=255, blank=True)
    announcement_url = models.URLField(blank=True)
    announcement_visible = models.BooleanField(default=False)

    maintenance_message = models.TextField(blank=True)
    maintenance_mode = models.BooleanField(default=False)

    analytics_id = models.CharField(max_length=80, blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return "Site Settings"


class MediaAsset(models.Model):
    file = models.FileField(upload_to="media/%Y/%m/")
    title = models.CharField(max_length=200, blank=True)
    alt_text = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    mime_type = models.CharField(max_length=100, blank=True)
    size_bytes = models.PositiveBigIntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-uploaded_at",)

    def __str__(self):
        return self.title or self.file.name