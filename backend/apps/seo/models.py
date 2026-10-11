from django.db import models


class Redirect(models.Model):
    old_path = models.CharField(max_length=500, unique=True)
    new_path = models.CharField(max_length=500)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Redirect"
        verbose_name_plural = "Redirects"

    def __str__(self):
        return f"{self.old_path} → {self.new_path}"