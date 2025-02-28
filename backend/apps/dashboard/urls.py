from django.urls import path
from .views import (
    public_stats,
    check,
    register_user, 
    login_user, 
    logout_user, 
    delete_user, 
    update_user,
    relapse, 
    search_user, 
    leaderboard,
    refresh_token
)

urlpatterns = [
    path('stats/<int:user_id>/', public_stats, name='public_stats'),
    
    # Authentication & User management endpoints
    path('auth/check/', check, name='check'),
    path('auth/refresh/', refresh_token, name='token_refresh'),
    path('auth/register/', register_user, name='register_user'),
    path('auth/login/', login_user, name='login_user'),
    path('auth/logout/', logout_user, name='logout_user'),
    path('auth/update/', update_user, name='update_user'),
    path('auth/delete/', delete_user, name='delete_user'),
    path('auth/relapse/', relapse, name='relapse'),

    # Public endpoints
    path('leaderboard/', leaderboard, name='leaderboard'),
    path('users/search/', search_user, name='search_user'),
]
