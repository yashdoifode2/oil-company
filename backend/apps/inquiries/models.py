from django.db import models

# Create your models here.
from django.db import models


class Inquiry(models.Model):
    class Status(models.TextChoices):
        NEW = "new", "New"
        CONTACTED = "contacted", "Contacted"
        IN_PROGRESS = "in_progress", "In Progress"
        RESOLVED = "resolved", "Resolved"
        SPAM = "spam", "Spam"

    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    company = models.CharField(max_length=150, blank=True)
    product_of_interest = models.CharField(max_length=200, blank=True)
    quantity = models.CharField(max_length=150, blank=True)
    message = models.TextField()

    status = models.CharField(max_length=16, choices=Status.choices, default=Status.NEW)
    internal_notes = models.TextField(blank=True)

    email_notified = models.BooleanField(default=False)
    email_error = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-created_at",)
        verbose_name = "Inquiry"
        verbose_name_plural = "Inquiries"

    def __str__(self):
        return f"{self.name} <{self.email}> ({self.get_status_display()})"