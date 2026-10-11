from django.db import models
from django.utils.text import slugify


class Page(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    short_description = models.TextField(blank=True)
    content = models.TextField(blank=True)
    featured_image = models.ImageField(upload_to="pages/", blank=True, null=True)

    seo_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)
    canonical_url = models.URLField(blank=True)
    og_image = models.ImageField(upload_to="pages/og/", blank=True, null=True)
    allow_indexing = models.BooleanField(default=True)

    status = models.CharField(max_length=16, choices=Status.choices, default=Status.DRAFT)
    published_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    show_in_navigation = models.BooleanField(default=False)
    show_in_footer = models.BooleanField(default=False)
    show_breadcrumbs = models.BooleanField(default=True)

    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ("order", "title")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)[:220]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class PageSection(models.Model):
    class SectionType(models.TextChoices):
        HERO = "hero", "Hero"
        TEXT_IMAGE = "text_image", "Text & Image"
        RICH_TEXT = "rich_text", "Rich Text"
        GALLERY = "gallery", "Image Gallery"
        PRODUCT_GRID = "product_grid", "Product Grid"
        CATEGORY_GRID = "category_grid", "Category Grid"
        BLOG_GRID = "blog_grid", "Blog Grid"
        STATISTICS = "statistics", "Statistics"
        TESTIMONIALS = "testimonials", "Testimonials"
        FAQ = "faq", "FAQ"
        CONTACT = "contact", "Contact Details"
        CTA = "cta", "Call to Action"
        DOCUMENTS = "documents", "Document Downloads"

    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name="sections")
    section_type = models.CharField(max_length=32, choices=SectionType.choices)

    title = models.CharField(max_length=200, blank=True)
    subtitle = models.CharField(max_length=200, blank=True)
    heading = models.CharField(max_length=255, blank=True)
    body = models.TextField(blank=True)

    image = models.ImageField(upload_to="pages/sections/", blank=True, null=True)
    image_alt = models.CharField(max_length=255, blank=True)

    button_text = models.CharField(max_length=100, blank=True)
    button_url = models.CharField(max_length=500, blank=True)

    order = models.PositiveIntegerField(default=0)
    is_visible = models.BooleanField(default=True)

    config = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ("order", "id")

    def __str__(self):
        return f"{self.page.title} — {self.get_section_type_display()} #{self.pk}"