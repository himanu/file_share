from datetime import timedelta
from django.utils.timezone import now
import random
from .models import OTP

def generate_otp():
    """Generate a random 6-digit OTP."""
    return f"{random.randint(100000, 999999)}"

def create_and_send_otp(user, flow):
    """Generate OTP, save to database, and send via email."""
    otp_code = generate_otp()
    expiration_time = now() + timedelta(minutes=5)
    # delete previous otp entries
    OTP.objects.filter(user_id=user.id).delete()
    # Create OTP entry
    OTP.objects.create(
        user=user,
        flow=flow,
        otp=otp_code,
        expiration_time=expiration_time,
        remaining_attempts=3,
    )
    
    # Send OTP via email
    from django.core.mail import send_mail
    send_mail(
        subject="Your OTP Code",
        message=f"Your OTP code is {otp_code}. It is valid for 5 minutes.",
        from_email="noreply@example.com",
        recipient_list=[user.email],
        fail_silently=False,
    )
    return otp_code
