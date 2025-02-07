from django.urls import path
from .views import dashboard_data, register_user, update_user_data, login_user, logout_user

urlpatterns = [
    path('dashboard/', dashboard_data, name='dashboard_data'),
    path('register/', register_user, name='register_user'),
    path('update-stats/', update_user_data, name='update_user_data'),
    path('login/', login_user, name='login_user'),
    path('logout/', logout_user, name='logout_user'),
]
