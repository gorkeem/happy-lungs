from rest_framework import serializers
from .models import Post, Comment, Like

class PostSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    likes = serializers.StringRelatedField(many=True)
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
    user = serializers.StringRelatedField()
    post = serializers.StringRelatedField()
    likes = serializers.StringRelatedField(many=True)
    total_likes = serializers.IntegerField(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'

    def get_total_likes(self, obj):
        return obj.likes.count()

class LikeSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Like
        fields = '__all__'