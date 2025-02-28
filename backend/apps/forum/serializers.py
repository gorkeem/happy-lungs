from rest_framework import serializers
from .models import Post, Comment, Like
from django.contrib.auth import get_user_model

User = get_user_model()

class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class PostSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer(read_only=True)
    likes = serializers.StringRelatedField(many=True, read_only=True)
    total_likes = serializers.IntegerField(read_only=True)
    total_comments = serializers.IntegerField(read_only=True)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = '__all__'

    def get_total_likes(self, obj):
        return obj.likes.count()
    
    def get_is_liked(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

    def get_total_comments(self, obj):
        return obj.comments.count()

class CommentSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer(read_only=True)
    post = serializers.PrimaryKeyRelatedField(read_only=True)
    likes = serializers.StringRelatedField(many=True, read_only=True)
    total_likes = serializers.IntegerField(read_only=True)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = '__all__'

    def get_total_likes(self, obj):
        return obj.likes.count()
    
    def get_is_liked(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

class LikeSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer(read_only=True)

    class Meta:
        model = Like
        fields = '__all__'
