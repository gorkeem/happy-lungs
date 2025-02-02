from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class DashboardStats(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE) # User
    quit_date = models.DateField() # Quit smoking date
    money_saved = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) # Money saved
    cigarettes_avoided = models.IntegerField(default=0) # Cigarettes avoided
    co_level = models.DecimalField(max_digits=5, decimal_places=2, default=0.00) # CO level  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)  

    def __str__(self):
        return f"{self.user.username} - {self.quit_date}"