from django.db import models  # Import the User model
from custom_auth.models import User  # Import get_user_model instead of User
from django.utils.timezone import now

class File(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='files') 
    filename = models.CharField(max_length=255)
    filetype = models.CharField(max_length=255, default='unknown')
    encrypted_data = models.BinaryField()
    upload_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.filename

# File Link Access
class FileAccess(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="file_access")
    file = models.ForeignKey(File, on_delete=models.CASCADE, related_name="file_access")
    expiration_time = models.DateTimeField(null=True,default=None)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Access for {self.user.username} to {self.file.filename}"
    
    def is_access_valid(self):
        if self.expiration_time and self.expiration_time < now():
            return False
        return True
    
    class Meta:
        unique_together = ('user', 'file')
