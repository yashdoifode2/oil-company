from django.conf import settings
from django.db import models
from django.utils.text import slugify
from taggit.managers import TaggableManager


class BlogCategory(models.Model):
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=170, unique=True, blank=True)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    is_visible = models.BooleanField(default=True)

    class Meta:
        ordering = ("order", "name")
        verbose_name_plural = "Blog Categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)[:170]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Article(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"

    title = models.CharField(max_length=250)
    slug = models.SlugField(max_length=270, unique=True, blank=True)
    excerpt = models.TextField(blank=True)
    body = models.TextField(blank=True)

    featured_image = models.ImageField(upload_to="blog/", blank=True, null=True)
    image_alt = models.CharField(max_length=255, blank=True)

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="articles",
    )
    category = models.ForeignKey(
        BlogCategory, null=True, blank=True, on_delete=models.SET_NULL, related_name="articles"
    )
    tags = TaggableManager(blank=True)

    status = models.CharField(max_length=16, choices=Status.choices, default=Status.DRAFT)
    published_at = models.DateTimeField(blank=True, null=True)

    seo_title = models.CharField(max_length=250, blank=True)
    meta_description = models.TextField(blank=True)
    canonical_url = models.URLField(blank=True)
    og_image = models.ImageField(upload_to="blog/og/", blank=True, null=True)

    related_products = models.ManyToManyField(
        "products.Product", blank=True, related_name="related_articles"
    )
    related_articles = models.ManyToManyField("self", blank=True, symmetrical=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-published_at", "-created_at")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)[:270]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title