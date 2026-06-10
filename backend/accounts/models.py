from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        CUSTOMER = "customer", "Customer"

    role = models.CharField(
        max_length=10, choices=Role.choices, default=Role.CUSTOMER
    )
    stripe_customer_id = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = "auth_user"

    def __str__(self):
        return self.email or self.username


class Profile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="profile"
    )
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Profile of {self.user.email}"
