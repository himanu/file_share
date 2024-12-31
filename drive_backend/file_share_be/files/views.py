from django.http import JsonResponse
from rest_framework.views import APIView
from .models import File, FileAccess
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
from custom_auth.models import User  # Import get_user_model instead of User
from django.utils.timezone import localtime,  timedelta, datetime
from django.utils import timezone

import base64
from rest_framework.exceptions import PermissionDenied, NotFound

@method_decorator(csrf_exempt, name='dispatch')
class FileUploadView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        """Handle file upload."""
        if 'encrypted_data' in request.FILES:
            encrypted_file = request.FILES['encrypted_data']
            filename = request.POST.get('filename', 'unknown_file')
            fileType = request.POST.get('file_type', '')
            print(f"FileType {fileType}")
            if not fileType or not filename:
                return JsonResponse({'error': 'File type and FileName are required'}, status=400)
            email = request.user.email
            user = User.objects.filter(email=email).first()
            # Save 
            file = File.objects.create(
                filename=filename,
                encrypted_data=encrypted_file.read(),
                user = user,
                filetype = fileType
            )
            
            return JsonResponse({'message': 'Encrypted file uploaded successfully', 'filename': filename, 'id': file.id, 'upload_date': file.upload_date})

        return JsonResponse({'error': 'Invalid request'}, status=400)

    def get(self, request, *args, **kwargs):
        fileId = request.GET.get('file_id')
        if (fileId is None):
            files = File.objects.filter(user_id = request.user.id)
            files_data = [{'id': file.id, 'filename': file.filename, 'upload_date': file.upload_date, 'fileType': file.filetype} for file in files]
            return JsonResponse({'files': files_data})
        else:
            file = File.objects.filter(id = fileId).first()
            if (file.user == request.user or self.hasFileAccess(user = request.user, file=file)):
                file_data = {'id': file.id, 'youAreOwner': file.user == request.user, 'fileType': file.filetype, 'filename': file.filename, 'upload_date': file.upload_date, 'encrypted_content': base64.b64encode(file.encrypted_data).decode('utf-8')}
                return JsonResponse({'files': file_data})
            else:
                return JsonResponse({'error': 'You dont have access to the file'}, status=401)

    def hasFileAccess(self, user, file):
        if (file.user == user):
            return True
        fileAccess = FileAccess.objects.filter(user_id = user.id, file_id = file.id).first()
        if (not fileAccess):
            return False
        return fileAccess.is_access_valid()

class FileAccessView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        # Get file ID from query parameters
        file_id = request.GET.get('file_id')
        
        # Ensure the file exists and belongs to the requesting user
        file = File.objects.filter(id=file_id, user=request.user).first()
        if not file:
            return JsonResponse({'error': 'File not found or access denied'}, status=404)

        # Get all users with access to the file
        file_accesses = FileAccess.objects.filter(file=file).select_related('user')
        
        # Prepare the response data
        access_list = []
        for access in file_accesses:
            access_list.append({
                'user_id': access.user.id,
                'user_email': access.user.email,
                'expiration_time': access.expiration_time.isoformat() if access.expiration_time else None
            })

        # Return the response
        return JsonResponse({'file_id': file.id, 'access_list': access_list}, status=200)

    def post(self, request, *args, **kwargs):
        """
        Handle actions related to file access: grant, edit, or remove.
        Request payload:
        - Grant: {"action": "grant", "file_id": 1, "user_email": "user@example.com", "expiration_time": 7 (optional)}
        - Edit: {"action": "edit", "file_id": 1, "user_email": "user@example.com", "expiration_time": 7}
        - Remove: {"action": "remove", "file_id": 1, "user_email": "user@example.com"}
        """
        action = request.data.get("action")
        file_id = request.data.get("file_id")
        user_email = request.data.get("user_email")
        expiration_days = request.data.get("expiration_time", None)

        print(f"email {user_email} {file_id} {action} ")
        # Validate input
        if not action or not file_id or not user_email:
            return JsonResponse({'error': 'Missing required fields: action, file_id, or user_email'}, status=400)

        # Check if the file exists and the authenticated user owns it
        file = File.objects.filter(id=file_id, user=request.user).first()
        if not file:
            raise PermissionDenied("You do not have permission to manage access to this file.")

        # Grant Access
        if action == "grant":
            # Check if the user to grant access exists
            target_user = User.objects.filter(email=user_email).first()
            if not target_user:
                return JsonResponse({"error": "User not found"}, status=404)

            expiration_time = None
            if expiration_days:
                try:
                    expiration_days = int(expiration_days)
                    if expiration_days not in [1, 7, 30]:
                        return JsonResponse({'error': 'Invalid expiration time'}, status=400)
                    expiration_time = datetime.now() + timedelta(days=expiration_days)
                except ValueError:
                    return JsonResponse({'error': 'Invalid expiration time format'}, status=400)

            file_access, created = FileAccess.objects.get_or_create(
                file=file, user=target_user,
                defaults={"expiration_time": expiration_time}
            )

            if not created:
                return JsonResponse({"message": "Access already exists for this user."}, status=400)

            return JsonResponse({
                "message": "Access granted successfully.",
                "file_access_id": file_access.id,
                "expiration_time": file_access.expiration_time
            }, status=201)

        # Edit Access
        elif action == "edit":
            file_access = FileAccess.objects.filter(file=file, user__email=user_email).first()
            if not file_access:
                raise NotFound("Access for this user and file not found.")

            if expiration_days:
                try:
                    expiration_days = int(expiration_days)
                    if expiration_days not in [1, 7, 30]:
                        return JsonResponse({'error': 'Invalid expiration time'}, status=400)
                    expiration_time = timezone.now() + timedelta(days=expiration_days)
                except ValueError:
                    return JsonResponse({'error': 'Invalid expiration time format'}, status=400)
            else:
                expiration_time = None  # No expiration time provided

            file_access.expiration_time = expiration_time
            file_access.save()

            return JsonResponse({
                "message": "Access expiration time updated successfully.",
                "expiration_time": file_access.expiration_time
            }, status=200)

        # Remove Access
        elif action == "remove":
            file_access = FileAccess.objects.filter(file=file, user__email=user_email).first()
            if not file_access:
                raise NotFound("Access for this user and file not found.")

            file_access.delete()
            return JsonResponse({"message": "Access removed successfully."}, status=200)

        # Invalid action
        else:
            return JsonResponse({'error': 'Invalid action. Use "grant", "edit", or "remove".'}, status=400)

