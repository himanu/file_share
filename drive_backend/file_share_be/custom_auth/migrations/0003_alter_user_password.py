# Generated by Django 5.1.4 on 2024-12-29 02:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('custom_auth', '0002_alter_user_role'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='password',
            field=models.CharField(max_length=128, unique=True),
        ),
    ]
