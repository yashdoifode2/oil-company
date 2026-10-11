from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        SUPER_ADMIN = "super_admin", "Super Administrator"
        CONTENT_EDITOR = "content_editor", "Content Editor"
        PRODUCT_MANAGER = "product_manager", "Product Manager"
        INQUIRY_MANAGER = "inquiry_manager", "Inquiry Manager"

    role = models.CharField(max_length=32, choices=Role.choices, default=Role.CONTENT_EDITOR)

    def is_super_admin(self) -> bool:
        return self.is_superuser or self.role == self.Role.SUPER_ADMIN