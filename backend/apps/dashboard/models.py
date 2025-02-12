from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from decimal import Decimal
from django.conf import settings

class UserStats(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # User
    quit_date = models.DateTimeField(default=timezone.now)  # Quit smoking date

    cigs_per_day = models.PositiveIntegerField(default=20)
    cost_per_pack = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    cigs_in_pack = models.PositiveIntegerField(default=20)
    baseline_co_level = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.time_since_quit} since quit"
    
    @property
    def days_since_quit(self):
        if not self.quit_date:
            return 0
        return (timezone.now() - self.quit_date).days

    @property
    def time_since_quit(self):
        now = timezone.now()
        time_difference = now - self.quit_date
        days = time_difference.days
        seconds = time_difference.seconds
        hours = seconds // 3600
        minutes = (seconds % 3600) // 60
        seconds = seconds % 60
        return f"{days} days, {hours} hours, {minutes} minutes, {seconds} seconds"

    @property
    def money_saved(self):
        """
        Calculate the precise amount of money saved since quitting smoking.
        """
        if not self.quit_date or self.cigs_per_day == 0 or self.cost_per_pack == 0 or self.cigs_in_pack == 0:
            return Decimal('0.00')

        # Calculate the exact time elapsed since quitting
        time_diff = timezone.now() - self.quit_date
        total_hours = time_diff.total_seconds() / 3600  # Convert to hours

        # Calculate cost per cigarette
        cost_per_cigarette = self.cost_per_pack / self.cigs_in_pack

        # Calculate the number of cigarettes avoided per hour
        cigarettes_per_hour = Decimal(self.cigs_per_day) / 24

        # Calculate total money saved
        money_saved = cost_per_cigarette * cigarettes_per_hour * Decimal(total_hours)

        return round(money_saved, 2)

    @property
    def cigarettes_avoided(self):
        return self.days_since_quit * self.cigs_per_day

    @property
    def current_co_level(self):
        #Calculate current CO using precise time difference
        if not self.baseline_co_level or self.baseline_co_level <= 0:
            return Decimal('0.00')
        
        # Calculate precise hours since quitting
        time_diff = timezone.now() - self.quit_date
        total_hours = time_diff.total_seconds() / 3600
        
        # CO half-life formula (5 hours)
        decay_factor = 2 ** (total_hours / 5)
        return round(self.baseline_co_level / Decimal(decay_factor), 2)
    
    @property
    def co_level_status(self):
        if self.current_co_level >= 10:
            return "Dangerously High"
        elif self.current_co_level >= 5:
            return "Elevated"
        elif self.current_co_level >= 2:
            return "Moderate"
        else:
            return "Normal"

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
        
        now = timezone.now()
        time_difference = now - self.quit_date
        total_hours_since_quit = time_difference.total_seconds() / 3600
        days_since_quit = total_hours_since_quit / 24

        for days_threshold, title, description in milestones:
            if days_since_quit >= days_threshold:
                achieved.append({'title': title, 'description': description})
            else:
                if not next_milestone:
                    days_left = days_threshold - days_since_quit
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
            self.save()
        super().save(*args, **kwargs)

# Username field should be unique
class User(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.username