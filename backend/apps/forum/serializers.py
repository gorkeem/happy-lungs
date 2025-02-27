from rest_framework import serializers
from .models import Post, Comment, Like
from django.contrib.auth import get_user_model

User = get_user_model()

class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class PostSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer(read_only=True)  # Include user ID and username
    likes = serializers.StringRelatedField(many=True, read_only=True)
    total_likes = serializers.IntegerField(read_only=True)
    total_comments = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = '__all__'

    def get_total_likes(self, obj):
        return obj.likes.count()

    def get_total_comments(self, obj):
        return obj.comments.count()

class CommentSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer(read_only=True)  # Include user ID and username
    post = serializers.PrimaryKeyRelatedField(read_only=True)
    likes = serializers.StringRelatedField(many=True, read_only=True)
    total_likes = serializers.IntegerField(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'

    def get_total_likes(self, obj):
        return obj.likes.count()

class LikeSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer(read_only=True)  # Include user ID and username

    class Meta:
        model = Like
        fields = '__all__'
