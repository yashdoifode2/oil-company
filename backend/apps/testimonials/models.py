from django.db import models


class Testimonial(models.Model):
    customer_name = models.CharField(max_length=150)
    company = models.CharField(max_length=150, blank=True)
    text = models.TextField()
    image = models.ImageField(upload_to="testimonials/", blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_visible = models.BooleanField(default=True)

    class Meta:
        ordering = ("order", "id")

    def __str__(self):
        return f"{self.customer_name} — {self.company}".strip(" —")