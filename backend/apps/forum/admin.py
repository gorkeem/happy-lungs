from django.contrib import admin
from .models import Post, Comment, Like

# Register your models here.
admin.site.register(Post) # Register Post model
admin.site.register(Comment) # Register Comment model
admin.site.register(Like) # Register Like model
