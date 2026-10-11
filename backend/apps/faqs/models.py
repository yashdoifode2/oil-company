from django.db import models


class FAQ(models.Model):
    class Category(models.TextChoices):
        GENERAL = "general", "General"
        PRODUCTS = "products", "Products"
        SHIPPING = "shipping", "Shipping"
        QUALITY = "quality", "Quality"
        OTHER = "other", "Other"

    question = models.CharField(max_length=300)
    answer = models.TextField()
    category = models.CharField(max_length=32, choices=Category.choices, default=Category.GENERAL)
    order = models.PositiveIntegerField(default=0)
    is_visible = models.BooleanField(default=True)

    class Meta:
        ordering = ("category", "order", "id")
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"

    def __str__(self):
        return self.question