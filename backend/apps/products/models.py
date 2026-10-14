from django.db import models
from django.utils.text import slugify


class ProductCategory(models.Model):
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=170, unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="products/categories/", blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_visible = models.BooleanField(default=True)

    seo_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)

    class Meta:
        ordering = ("order", "name")
        verbose_name_plural = "Product Categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)[:170]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    category = models.ForeignKey(
        ProductCategory, null=True, blank=True, on_delete=models.SET_NULL, related_name="products"
    )
    short_description = models.TextField(blank=True)
    hero_tagline = models.CharField(
        max_length=255,
        blank=True,
        help_text="Short tagline for the product detail page hero",
    )
    full_description = models.TextField(blank=True)

    main_image = models.ImageField(upload_to="products/", blank=True, null=True)
    image_alt = models.CharField(max_length=255, blank=True)

    specifications = models.JSONField(default=dict, blank=True)
    applications = models.TextField(blank=True)
    packaging_options = models.TextField(blank=True)
    availability = models.CharField(max_length=200, blank=True)

    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    status = models.CharField(max_length=16, choices=Status.choices, default=Status.DRAFT)

    seo_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)
    canonical_url = models.URLField(blank=True)
    og_image = models.ImageField(upload_to="products/og/", blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("order", "name")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)[:220]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/gallery/")
    alt_text = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ("order", "id")


class ProductDocument(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="documents")
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to="products/documents/")
    description = models.TextField(blank=True)
    is_public = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ("order", "title")