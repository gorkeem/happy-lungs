from django.urls import path
from .views import dashboard_data, register_user, login_user, logout_user, delete_user, update_user, get_user, get_all_users

urlpatterns = [
    path('dashboard/', dashboard_data, name='dashboard_data'),
    path('register/', register_user, name='register_user'),
    path('login/', login_user, name='login_user'),
    path('logout/', logout_user, name='logout_user'),
    path("delete-user/", delete_user, name="delete_user"),
    path("update-user/", update_user, name="update_user"),
    path("user/<int:user_id>/", get_user, name="get_user"),
    path("users/", get_all_users, name="get_all_users"),
]
