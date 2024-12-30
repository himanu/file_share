from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed

import jwt
from django.conf import settings
from .models import User
from rest_framework.permissions import AllowAny


class JWTAuthenticationFromCookie(JWTAuthentication):
    def authenticate(self, request):
        # Get the token from the cookies
        print(f"is public view {self._is_public_view(request=request)}")
        if self._is_public_view(request=request):
            return
        token = request.COOKIES.get('token')

        if not token:
            raise AuthenticationFailed('No token found in cookies')

        try:
            # Decode and verify the token using custom logic
            # Use the secret key from Django settings (ensure it matches the one used during token creation)
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            print(f"decoded_token {decoded_token}")
            # Ensure the token has the necessary claims
            email = decoded_token.get('email')
            print(f"email {email}")
            if not email:
                raise AuthenticationFailed('Token does not contain user ID')

            # Fetch the user from the database
            user = User.objects.get(email=email)

            print(f"user {user}")

            if not user:
                raise AuthenticationFailed('User not found')

            return (user, token)  # Return the user and token for further processing

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')

        except jwt.DecodeError:
            raise AuthenticationFailed('Token is malformed')

        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Token is invalid')

        except Exception as e:
            print(f"exception {str(e)}")
            raise AuthenticationFailed(f'Error decoding token: {str(e)}')

    def _is_public_view(self, request):
        """
        Check if the view has the AllowAny permission class.
        This skips authentication for public views like login, register, etc.
        """
        # Check if the view has the AllowAny permission class
        view = request.resolver_match.func.view_class

        if hasattr(view, 'permission_classes'):
            permissions = view.permission_classes
            print(f"permissions {permissions}")
            # If the view allows any permission, authentication should be skipped
            if AllowAny in permissions:
                return True
        return False
