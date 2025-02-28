import random
import os
import django
from django.utils import timezone


# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "happylungs.settings")
django.setup()
from django.contrib.auth import get_user_model
from apps.forum.models import Post, Comment
from apps.dashboard.models import UserStats

User = get_user_model()

def clear_existing_data():
    """Delete all existing users, posts, comments, and stats."""
    print("Clearing existing data...")
    Comment.objects.all().delete()
    Post.objects.all().delete()
    UserStats.objects.all().delete()
    User.objects.exclude(is_superuser=True).delete()  # Keep superusers
    print("All non-superuser data deleted!")

def generate_test_data():
    # Create 10 test users
    for i in range(1, 11):
        username = f"testuser{i}"
        email = f"testuser{i}@example.com"
        password = f"password{i}"
        
        user, created = User.objects.get_or_create(
            username=username,
            email=email,
        )
        if created:
            user.set_password(password)
            user.save()
        
        # Create user stats
        stats, stats_created = UserStats.objects.get_or_create(
            user=user,
            defaults={
                "quit_date": timezone.now() - timezone.timedelta(days=random.randint(1, 365)),
                "cigs_per_day": random.randint(10, 30),
                "cost_per_pack": random.uniform(5, 12),
                "cigs_in_pack": 20,
            }
        )

        if stats_created:
            stats.save()
        
        print(f"Created User: {username} / Password: {password}")
        print(f"Stats -> Quit Date: {stats.quit_date}, Cigs/Day: {stats.cigs_per_day}, Cost/Pack: ${stats.cost_per_pack:.2f}")

        # Create 3-5 posts per user
        for j in range(random.randint(3, 5)):
            post = Post.objects.create(
                user=user,
                title=f"Post {j+1} by {username}",
                content=f"This is some content for post {j+1} by {username}.",
                created_at=timezone.now()
            )
            
            # Create 2-4 comments per post
            for k in range(random.randint(2, 4)):
                Comment.objects.create(
                    user=user,
                    post=post,
                    content=f"This is a comment {k+1} on post {j+1} by {username}.",
                    created_at=timezone.now()
                )

    print("Test data generated successfully!")

if __name__ == "__main__":
    clear_existing_data()
    generate_test_data()
