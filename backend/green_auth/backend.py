from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.models import User


class EmailOrUsernameModelBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            # Check if the user is trying to login with an email address
            user = User.objects.get(email=username)
        except User.DoesNotExist:
            try:
                # Check if the user is trying to login with a username
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return None

        if user.check_password(password):
            return user

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
