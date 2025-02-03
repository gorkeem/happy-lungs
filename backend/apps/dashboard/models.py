from django.db import models
from django.contrib.auth.models import User

from django.forms import ValidationError
from django.utils import timezone
from decimal import Decimal

# Create your models here.

class DashboardStats(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE) # User
    quit_date = models.DateField() # Quit smoking date
    # money_saved = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) # Money saved
    # cigarettes_avoided = models.IntegerField(default=0) # Cigarettes avoided

    cigs_per_day = models.PositiveIntegerField(default=20)
    cost_per_pack = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    cigs_in_pack = models.PositiveIntegerField(default=20)
    baseline_co_level = models.DecimalField(max_digits=5, decimal_places=2, default=10.00)

    # co_level = models.DecimalField(max_digits=5, decimal_places=2, default=0.00) # CO level  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.quit_date}"
    
    @property
    def days_since_quit(self):
        if not self.quit_date:
            return 0
        return (timezone.now().date() - self.quit_date).days

    @property
    def money_saved(self):
        if self.days_since_quit <= 0:
            return Decimal('0.00')
        daily_cost = (Decimal(self.cigs_per_day) / self.cigs_in_pack) * self.cost_per_pack
        return round(daily_cost * self.days_since_quit, 2)

    @property
    def cigarettes_avoided(self):
        return self.days_since_quit * self.cigs_per_day

    @property
    def current_co_level(self):
        if self.days_since_quit <= 0 or self.baseline_co_level <= 0:
            return Decimal('0.00')
        hours_since_quit = self.days_since_quit * 24
        decay_factor = 2 ** (hours_since_quit / 5)  # CO half-life of 5 hours
        return round(self.baseline_co_level / Decimal(decay_factor), 2)

    def get_healing_milestones(self):
        milestones = [
            (0.0208333, "20 minutes", "Heart rate drops to normal levels"),
            (0.5, "12 hours", "Carbon monoxide levels normalize"),
            (2, "2 days", "Nicotine leaves your system"),
            (14, "2 weeks", "Circulation improves"),
            (30, "1 month", "Lung function improves"),
            (90, "3 months", "Cilia regeneration"),
            (180, "6 months", "Reduced infection risk"),
            (365, "1 year", "Heart disease risk halves"),
            (1825, "5 years", "Stroke risk reduces"),
            (3650, "10 years", "Lung cancer risk halves")
        ]
        
        achieved = []
        next_milestone = None

        for days_threshold, title, description in milestones:
            if self.days_since_quit >= days_threshold:
                achieved.append({'title': title, 'description': description})
            else:
                if not next_milestone:
                    days_left = days_threshold - self.days_since_quit
                    next_milestone = {
                        'title': title,
                        'description': description,
                        'days_left': round(days_left, 1)
                    }
        return {
            'achieved': achieved,
            'next_milestone': next_milestone
        }
    
def save(self, *args, **kwargs):
    """Set default CO baseline only once"""
    # Set baseline CO level if not provided
    if not self.baseline_co_level:
        # More accurate formula: 0.5ppm per cigarette (medical approximation)
        self.baseline_co_level = Decimal(self.cigs_per_day) * Decimal('0.5')
    
    # Ensure quit_date is not in the future
    if self.quit_date > timezone.now().date():
        raise ValidationError("Quit date cannot be in the future")
    
    super().save(*args, **kwargs)