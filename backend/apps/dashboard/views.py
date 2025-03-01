from django.utils import timezone
from django.utils.timezone import now
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import UserStats, User
from .serializers import UserStatsSerializer, RegisterSerializer, UserSerializer, PublicUserSerializer, PublicUserStatsSerializer
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from django.db import transaction
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt

# Get the stats of a user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def public_stats(request, user_id=None):
    target_user = get_object_or_404(User, id=user_id) if user_id else request.user

    stats_obj = UserStats.objects.filter(user=target_user).first()  # avoid raising 404
    if stats_obj:
        serializer = (
            UserStatsSerializer(stats_obj)
            if target_user == request.user
            else PublicUserStatsSerializer(stats_obj)
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    # if no stats, still return user data
    user_serializer = PublicUserSerializer(target_user)
    return Response({"user": user_serializer.data}, status=status.HTTP_200_OK)

# Check auth
@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check(request):
    user = request.user
    user_serializer = UserSerializer(user)
    try:
        user_stats = user.userstats
        stats_serializer = UserStatsSerializer(user_stats)
        data = {
            "user": user_serializer.data,
            "stats": stats_serializer.data,
        }
    except Exception:
        data = {"user": user_serializer.data}
    return Response(data, status=status.HTTP_200_OK)

@csrf_exempt
@api_view(['POST'])
@permission_classes([])  # Allow anyone to call refresh
def refresh_token(request):
    refresh_token = request.COOKIES.get("refresh")
    if not refresh_token:
        return Response({"error": "Refresh token not provided"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        refresh = RefreshToken(refresh_token)
        new_access_token = str(refresh.access_token)
        response = Response({"message": "Token refreshed"}, status=status.HTTP_200_OK)
        # Update the access token cookie
        response.set_cookie(
            key="access",
            value=new_access_token,
            httponly=True,
            secure=True,  # change to True in production
            samesite="Lax"
        )
        return response
    except Exception as e:
        return Response({"error": "Invalid refresh token"}, status=status.HTTP_400_BAD_REQUEST)


# Register a user
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    try:
        print(f"Received registration data: {request.data}")
        
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            print("Serializer is valid. Saving user...")
            user = serializer.save()
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            print("Tokens generated successfully")
            
            # Serialize the user object
            user_serializer = UserSerializer(user)
            
            response = Response({
                "message": "User created and logged in successfully!",
                "user": user_serializer.data
            }, status=status.HTTP_201_CREATED)
            
            # Set cookies
            response.set_cookie(
                key="access",
                value=access_token,
                httponly=True,
                secure=True,
                samesite="Lax"
            )
            response.set_cookie(
                key="refresh",
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite="Lax"
            )
            
            print("User created and response sent")
            return response
        
        print(f"Registration failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        print(f"Error during registration: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Login user
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    email = request.data.get("email")
    password = request.data.get("password")

    try:
        user = get_user_model().objects.get(email=email)
    except get_user_model().DoesNotExist:
        return Response({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)

    
    # Authenticate the user
    user = authenticate(username=user.username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response = Response({
            "message": "Login Successful!",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        }, status=status.HTTP_200_OK)

        # Set http-only cookies; secure flag should be true in production
        response.set_cookie(
            key="access",
            value=access_token,
            httponly=True,
            secure=True,  # Change to True when using HTTPS in production
            samesite="Lax"
        )
        response.set_cookie(
            key="refresh",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite="Lax"
        )
        return response

    # Handle invalid credentials
    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# Logout user
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    try:
        # Blacklist refresh token if provided in request data or from cookies
        refresh_token = request.data.get("refresh") or request.COOKIES.get("refresh")
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        response = Response({"message": "Logout successful!"}, status=status.HTTP_205_RESET_CONTENT)
        # Remove cookies
        response.delete_cookie("access")
        response.delete_cookie("refresh")
        return response
    except Exception as e:
        return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

    

# Delete user
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request):
    user = request.user
    refresh_token = request.data.get("refresh") or request.COOKIES.get("refresh")

    if refresh_token:
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception as e:
            print(f"Failed to blacklist token: {e}")

    user.delete()
    response = Response({"message": "User deleted successfully! Tokens invalidated."}, status=status.HTTP_204_NO_CONTENT)
    response.delete_cookie("access")
    response.delete_cookie("refresh")
    return response


# Update user
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request):
    user = request.user
    data = request.data
    
    try:
        with transaction.atomic():
        
            # Update User fields
            if "username" in data:
                user.username = data["username"]
            if "email" in data:
                user.email = data["email"]
            if "password" in data and not data["password"] == "":
                user.set_password(data["password"])

            # Update UserStats fields
            user_stats = user.userstats
            if "quit_date" in data:
                try:
                    parsed_date = timezone.make_aware(datetime.strptime(data["quit_date"], "%Y-%m-%d"))
                    user_stats.quit_date = parsed_date
                except Exception as e:
                    return Response({"error": "Invalid date format"}, status=status.HTTP_400_BAD_REQUEST)

            if "cigs_per_day" in data:
                user_stats.cigs_per_day = data["cigs_per_day"]
            if "cost_per_pack" in data:
                user_stats.cost_per_pack = data["cost_per_pack"]
            if "cigs_in_pack" in data:
                user_stats.cigs_in_pack = data["cigs_in_pack"]

            user.save()
            user_stats.save()
            return Response({"message": "User updated successfully!"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def relapse(request):
    user = request.user
    try:
        user_stats = user.userstats
        user_stats.quit_date = now()
        user_stats.save()
        return Response({"message": "Relapsed successfully. Your quit date has been reset!"}, status=status.HTTP_200_OK)
    except UserStats.DoesNotExist:
        return Response({"error": "User stats not found."}, status=status.HTTP_404_NOT_FOUND)

# Search a specific user by username and get user with stats
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_user(request):
    username = request.query_params.get("q")
    if username:
        user = get_object_or_404(User, username=username)
        user_stats = get_object_or_404(UserStats, user=user)
        
        user_serializer = UserSerializer(user)
        stats_serializer = UserStatsSerializer(user_stats)
        
        response_data = {
            'user': user_serializer.data,
            'stats': stats_serializer.data
        }
        return Response(response_data, status=status.HTTP_200_OK)
    return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

# Get the leaderboard
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def leaderboard(request):
    user_stats = UserStats.objects.all().order_by('quit_date')
    serializer = PublicUserStatsSerializer(user_stats, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)