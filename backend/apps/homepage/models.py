from django.db import models


class HomepageSection(models.Model):
    class SectionType(models.TextChoices):
        HERO = "hero", "Hero"
        TRUST = "trust", "Trust Indicators"
        FEATURED_PRODUCTS = "featured_products", "Featured Products"
        COMPANY_INTRO = "company_intro", "Company Introduction"
        INDUSTRIES = "industries", "Industries Served"
        CAPABILITIES = "capabilities", "Business Capabilities"
        QUALITY = "quality", "Quality Information"
        TESTIMONIALS = "testimonials", "Testimonials"
        FAQ = "faq", "FAQ"
        LATEST_ARTICLES = "latest_articles", "Latest Articles"
        CTA = "cta", "Call to Action"
        CONTACT = "contact", "Contact Information"

    section_type = models.CharField(max_length=32, choices=SectionType.choices)
    title = models.CharField(max_length=200, blank=True)
    subtitle = models.CharField(max_length=200, blank=True)
    heading = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)

    button_text = models.CharField(max_length=100, blank=True)
    button_url = models.CharField(max_length=500, blank=True)
    secondary_button_text = models.CharField(max_length=100, blank=True)
    secondary_button_url = models.CharField(max_length=500, blank=True)

    main_image = models.ImageField(upload_to="homepage/", blank=True, null=True)
    background_image = models.ImageField(upload_to="homepage/", blank=True, null=True)
    mobile_image = models.ImageField(upload_to="homepage/", blank=True, null=True)
    image_alt = models.CharField(max_length=255, blank=True)

    text_alignment = models.CharField(
        max_length=10,
        choices=(("left", "Left"), ("center", "Center"), ("right", "Right")),
        default="left",
    )
    overlay_opacity = models.PositiveSmallIntegerField(default=40)
    background_style = models.CharField(max_length=50, blank=True)

    order = models.PositiveIntegerField(default=0)
    is_visible = models.BooleanField(default=True)

    # Free-form config (e.g. product IDs, article count, category filter)
    config = models.JSONField(default=dict, blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("order", "id")

    def __str__(self):
        return f"{self.get_section_type_display()} #{self.pk}"