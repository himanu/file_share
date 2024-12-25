# Generated by Django 5.1.4 on 2024-12-25 06:34

import custom_auth.models
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('password', models.CharField(max_length=128)),
                ('role', models.CharField(choices=[('guest', 'Guest'), ('normal', 'Normal'), ('admin', 'Admin')], default='guest', max_length=10)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='OTP',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('flow', models.CharField(choices=[('signup', 'Signup'), ('login', 'Login')], max_length=10)),
                ('otp', models.CharField(max_length=6)),
                ('expiration_time', models.DateTimeField(default=custom_auth.models.default_expiration_time)),
                ('remaining_attempts', models.PositiveIntegerField(default=3)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='otps', to='custom_auth.user')),
            ],
        ),
    ]