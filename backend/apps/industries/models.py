from django.db import models
from django.utils.text import slugify


class Industry(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"

    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=170, unique=True, blank=True)
    description = models.TextField(blank=True)
    technical_information = models.TextField(blank=True)

    featured_image = models.ImageField(upload_to="industries/", blank=True, null=True)
    image_alt = models.CharField(max_length=255, blank=True)

    related_products = models.ManyToManyField("products.Product", blank=True, related_name="industries")
    related_articles = models.ManyToManyField("blog.Article", blank=True, related_name="industries")

    seo_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)

    status = models.CharField(max_length=16, choices=Status.choices, default=Status.DRAFT)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ("order", "name")
        verbose_name_plural = "Industries"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)[:170]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name