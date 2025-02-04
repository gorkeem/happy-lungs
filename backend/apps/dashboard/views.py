# from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import DashboardStats
from .serializers import DashboardStatsSerializer, RegisterSerializer
from rest_framework import status
# Create your views here.

# Get dashboard data
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_data(request):
    quit_data = get_object_or_404(DashboardStats, user=request.user)
    serializer = DashboardStatsSerializer(quit_data)
    return Response(serializer.data)

# Register a user
@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User created successfully!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Update user's dashboard data
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_dashboard_stats(request):
    user = request.user
    try:
        user_stats = DashboardStats.objects.get(user=user)
    except DashboardStats.DoesNotExist:
        return Response({"error": "User's dashboard stats not found"}, status=status.HTTP_404_NOT_FOUND)
    
    user_stats = request.user.dashboardstats  # Get user's dashboard stats
    serializer = DashboardStatsSerializer(user_stats, data=request.data, partial=True)

    new_username = request.data.get("username")
    new_password = request.data.get("password")
    new_email = request.data.get("email")

    if serializer.is_valid():
        serializer.save()

        if new_username:
            user.username = new_username

        # Eğer kullanıcı şifresini değiştirmek istiyorsa
        if new_password:
            if len(new_password) < 6:
                return Response({"error": "Password should at least have 6 characters"}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(new_password)
        
        # Eğer e-posta değiştiriliyorsa
        if new_email:
            user.email = new_email

        user.save()

        return Response({"message": "Update successful!"}, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
