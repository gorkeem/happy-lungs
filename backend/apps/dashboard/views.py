# from django.shortcuts import render
from datetime import timezone
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .models import UserStats, User
from .serializers import UserStatsSerializer, RegisterSerializer, UserSerializer
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from django.db import transaction
from django.contrib.auth.hashers import make_password

# Get dashboard data
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_data(request, user_id):
    user = get_object_or_404(User, id=user_id)
    dashboard = get_object_or_404(UserStats, user=user)
    serializer = UserStatsSerializer(dashboard)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Register a user
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User created successfully!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login user
@api_view(["POST"])
@permission_classes([AllowAny])
def login_user(request):
    email = request.data.get("email")
    password = request.data.get("password")

    try:
        user = get_user_model().objects.get(email=email)
    except get_user_model().DoesNotExist:
        return Response({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)

    user = authenticate(username=user.username, password=password)

    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "message": "Login successful!"
        }, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# Logout user
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Logout successful!"}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
    

# Delete user
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_user(request):
    user = request.user
    if user:
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
        except Exception:
            pass

        user.delete()
        return Response({"message": "User deleted successfully!"}, status=status.HTTP_204_NO_CONTENT)

    return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

# Update user
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user(request):
    user = request.user # Get the logged in user
    data = request.data # Get the data from the request

    try:
        with transaction.atomic():
            # Update User fields
            if "username" in data:
                user.username = data["username"]
            if "email" in data:
                user.email = data["email"]
            if "password" in data:
                user.password = make_password(data["password"])
            
            # Update UserStats fields
            user_stats = user.userstats  # Get the UserStats instance
            if "quit_date" in data:
                user_stats.quit_date = data["quit_date"]
            if "relapse" in data and data["relapse"] is True:
                user_stats.quit_date = timezone.now()
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

# Get user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request, user_id):
    user = get_object_or_404(User, id=user_id)
    user_stats = get_object_or_404(UserStats, user=user)
    
    user_serializer = UserSerializer(user)
    stats_serializer = UserStatsSerializer(user_stats)
    
    response_data = {
        'user': user_serializer.data,
        'stats': stats_serializer.data
    }
    return Response(response_data, status=status.HTTP_200_OK)
 
# Get all users
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all_users(request):
    users = User.objects.all().order_by("-quit_date") # Get all users and order by quit date   
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)