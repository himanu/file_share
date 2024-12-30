from django.urls import path
from .views import FileUploadView, FileAccessView

urlpatterns = [
    path('', FileUploadView.as_view(), name='file_upload'),
    path('/access', FileAccessView.as_view(), name='file_access'),
]
