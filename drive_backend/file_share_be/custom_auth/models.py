from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils.timezone import now
from datetime import timedelta
from django.contrib import admin

# User Manager
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, role='guest'):
        if not email:
            raise ValueError("The Email field must be set.")
        email = self.normalize_email(email)
        user = self.model(email=email, role=role)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        return self.create_user(email, password, role='admin')

# User Model
class User(AbstractBaseUser):
    ROLE_CHOICES = [
        ('guest', 'Guest'),
        ('normal', 'Normal'),
        ('admin', 'Admin'),
    ]

    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128, unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='normal')

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

def default_expiration_time():
    return now() + timedelta(minutes=5)
# OTP Model
class OTP(models.Model):
    FLOW_CHOICES = [
        ('signup', 'Signup'),
        ('login', 'Login'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="otps")
    flow = models.CharField(max_length=10, choices=FLOW_CHOICES)
    otp = models.CharField(max_length=6)
    expiration_time = models.DateTimeField(default=default_expiration_time)
    remaining_attempts = models.PositiveIntegerField(default=3)

    def __str__(self):
        return f"OTP for {self.user.email} ({self.flow})"


