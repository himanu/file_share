from django.contrib import admin
from .models import File, FileAccess

admin.site.register(File)
admin.site.register(FileAccess)