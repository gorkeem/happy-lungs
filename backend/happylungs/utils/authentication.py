from rest_framework_simplejwt.authentication import JWTAuthentication

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        raw_token = request.COOKIES.get("access")
        if raw_token is None:
            # Fallback: check header if needed
            header = self.get_header(request)
            if header:
                raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None
        try:
            validated_token = self.get_validated_token(raw_token)
        except Exception as e:
            print("Token validation error:", e)
            return None
        return self.get_user(validated_token), validated_token
