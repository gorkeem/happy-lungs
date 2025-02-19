from django.urls import path
from .views import (
    public_stats,
    check,
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
    path('stats/<int:user_id>/', public_stats, name='public_stats'),

    # Authentication & User management endpoints
    path('auth/check/', check, name='check'),
    path('auth/register/', register_user, name='register_user'),
    path('auth/login/', login_user, name='login_user'),
    path('auth/logout/', logout_user, name='logout_user'),
    path('auth/update/', update_user, name='update_user'),
    path('auth/delete/', delete_user, name='delete_user'),

    # User endpoints (admin only or public depending on your use-case)
    path('users/', get_all_users, name='get_all_users'),
    path('users/search/', search_user, name='search_user'),
]
