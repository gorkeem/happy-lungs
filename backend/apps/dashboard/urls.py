from django.urls import path
from .views import (
    dashboard_data, 
    register_user, 
    login_user, 
    logout_user, 
    delete_user, 
    update_user, 
    search_user, 
    get_all_users
)

urlpatterns = [
    # Dashboard - if you plan on allowing admins to see others' dashboards, keep the <user_id> parameter.
    # Otherwise, you can simply use request.user and remove the parameter.
    path('dashboard/<int:user_id>/', dashboard_data, name='dashboard_data'),

    # Authentication & User management endpoints
    path('auth/register/', register_user, name='register_user'),
    path('auth/login/', login_user, name='login_user'),
    path('auth/logout/', logout_user, name='logout_user'),
    path('auth/update/', update_user, name='update_user'),
    path('auth/delete/', delete_user, name='delete_user'),

    # User endpoints (admin only or public depending on your use-case)
    path('users/', get_all_users, name='get_all_users'),
    path('users/search/', search_user, name='search_user'),
]
