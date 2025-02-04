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
    user_stats = request.user.dashboardstats  # Get user's dashboard stats
    serializer = DashboardStatsSerializer(user_stats, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Update successful!"})
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
