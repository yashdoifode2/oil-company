from django.db import models


class Document(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to="documents/")
    is_public = models.BooleanField(default=False, help_text="Public documents appear in listings.")
    order = models.PositiveIntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("order", "title")

    def __str__(self):
        return self.title