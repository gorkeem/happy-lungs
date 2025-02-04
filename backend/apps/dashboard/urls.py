from django.urls import path
from .views import dashboard_data, register_user, update_dashboard_stats, login_user

urlpatterns = [
    path('dashboard/', dashboard_data, name='dashboard_data'),
    path('register/', register_user, name='register_user'),
    path('settings/', update_dashboard_stats, name='update_dashboard_stats'),
    path('login/', login_user, name='login_user'),
]
