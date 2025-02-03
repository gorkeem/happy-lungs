# from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import DashboardStats
from .serializers import DashboardStatsSerializer

# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_data(request):
    quit_data = get_object_or_404(DashboardStats, user=request.user)
    serializer = DashboardStatsSerializer(quit_data)
    return Response(serializer.data)


