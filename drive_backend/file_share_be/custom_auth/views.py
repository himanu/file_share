from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed

from .models import User, OTP
from .serializers import UserSerializer
from django.contrib.auth.hashers import check_password
from django.db import transaction
from .utils import create_and_send_otp
from datetime import datetime, timedelta
import jwt
from django.conf import settings
from django.utils.timezone import now
from rest_framework.permissions import AllowAny
from django.http import JsonResponse


JWT_SECRET = settings.SECRET_KEY
JWT_ALGORITHM = "HS256"

class RegisterUserView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        try:
            with transaction.atomic():
                data = request.data
                serializer = UserSerializer(data=data)
                if serializer.is_valid():
                    user = serializer.save()
                    return Response({"message": "User registered successfully. OTP sent to email."}, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response(e, status=500)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        is_guest_user = request.data.get('isGuestUser', False)
        if not email:
            return Response(
                {"error": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Search for user by email
            user = User.objects.filter(email=email).first()
            if user:
                if user.role == 'guest':
                    # Send OTP for guest user
                    create_and_send_otp(user, flow='login')
                    return Response(
                        {"message": "OTP sent to your email."},
                        status=status.HTTP_200_OK,
                    )

                # Non-guest user: validate password
                if check_password(password, user.password):
                    create_and_send_otp(user, flow='login')
                    return Response(
                        {"message": "OTP sent to your email."},
                        status=status.HTTP_200_OK,
                    )
                else:
                    return Response(
                        {"error": "Password is incorrect."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            else:
                # User doesn't exist
                if is_guest_user == True:
                    # Create guest user and send OTP
                    with transaction.atomic():
                        user = User.objects.create(
                            email=email,
                            role='guest',
                        )
                        create_and_send_otp(user, flow='login')
                        return Response(
                            {"message": "OTP sent to your email."},
                            status=status.HTTP_201_CREATED,
                        )
                else:
                    return Response(
                        {"error": "User not found."},
                        status=status.HTTP_404_NOT_FOUND,
                    )

        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class VerifyOTPView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        if not email or not otp:
            return Response(
                {"error": "Email and OTP are required.", "redirectToLogin": True},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Get the user and OTP record
            user = User.objects.filter(email=email).first()
            if not user:
                return Response(
                    {"error": "User not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            otp_record = OTP.objects.filter(user_id=user.id).first()

            if not otp_record:
                return Response(
                    {"error": "Please verify your email and password first.", "redirectToLogin": True},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Check if OTP is expired
            if otp_record.expiration_time < now():
                return Response(
                    {"error": "OTP has expired.", "redirectToLogin": True},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if otp_record.otp != otp:
                otp_record.remaining_attempts -= 1
                otp_record.save()

                if otp_record.remaining_attempts <= 0:
                    otp_record.delete()
                    return Response(
                        {"error": "Invalid OTP. No remaining attempts. Please request a new OTP.", "redirectToLogin": True},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                return Response(
                    {"error": f"Incorrect OTP. Remaining attempts: {otp_record.remaining_attempts}."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            # If OTP is valid, create a JWT token
            payload = {
                "email": user.email,
                "exp": datetime.utcnow() + timedelta(hours=1),  # Token expiry time (1 hour)
            }
            token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
            response =  Response(
                {"message": "OTP verified successfully.", "user": {
                    "email": user.email,
                    "role": user.role
                }, },
                status=status.HTTP_200_OK,
            )
            response.set_cookie(
                key='token',
                value=token,
                httponly=True,  # Prevent JavaScript access
                # secure=True,    # Use in production
                samesite='Strict', # Prevent cross-site request forgery
                max_age=3600,   # Set cookie expiration time in seconds
            )
            return response

        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
class GetUserDetailsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        if not request.user:
            raise AuthenticationFailed('Token not provided in cookies.')
        return Response({
            'email': request.user.email,
            'role': request.user.role
        })

class GetAllUserDetailsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        if not request.user:
            raise AuthenticationFailed('Token not provided in cookies.')
        users = User.objects.exclude(id=request.user.id)
        print(f"Users {users}")
        users_data = [{'email': user.email, 'role': user.role} for user in users]
        return JsonResponse({'users': users_data})

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = JsonResponse({"message": "Logged out successfully."}, status=200)
        # Clear the cookie containing the JWT
        response.delete_cookie("token")
        return response