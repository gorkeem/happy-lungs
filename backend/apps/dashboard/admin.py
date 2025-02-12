from django.contrib import admin
from .models import UserStats, User

# Register your models here.
admin.site.register(UserStats) # Register UserStats model
admin.site.register(User) # Register User model