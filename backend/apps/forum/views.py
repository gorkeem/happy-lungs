from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Post, Comment, Like
from .serializers import PostSerializer, CommentSerializer, LikeSerializer
from rest_framework import status

# Get all posts
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_posts(request):
    posts = Post.objects.all()
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Get a single post
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_post(request, post_id):
    if post_id:
        post = get_object_or_404(Post, id=post_id)
        serializer = PostSerializer(post)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"error": "Invalid search parameter"}, status=status.HTTP_400_BAD_REQUEST)

# Create a post
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Update a post
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    if post.user != request.user:
        return Response({"error": "You are not authorized to update this post"}, status=status.HTTP_403_FORBIDDEN)
    serializer = PostSerializer(post, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# Delete a post
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    if post.user != request.user:
        return Response({"error": "You are not authorized to delete this post"}, status=status.HTTP_403_FORBIDDEN)
    post.delete()
    return Response({"message": "Post deleted successfully!"}, status=status.HTTP_200_OK)

# Get comments belonging to a post
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_comments(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    comments = post.comments.all()
    if comments:
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response([], status=status.HTTP_200_OK)

# Create a comment on a post
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_comment(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user, post=post)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Update a comment
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_comment(request, comment_id):
    comment = get_object_or_404(Comment, id=comment_id)
    if comment.user != request.user:
        return Response({"error": "You are not authorized to update this comment"}, status=status.HTTP_403_FORBIDDEN)
    serializer = CommentSerializer(comment, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Delete a comment
@api_view(['DELETE'])
@permission_classes(IsAuthenticated)
def delete_comment(request, comment_id):
    comment = get_object_or_404(Comment, id=comment_id)
    if comment.user != request.user:
        return Response({"error": "You are not authorized to delete this comment"}, status=status.HTTP_403_FORBIDDEN)
    comment.delete()
    return Response({"message": "Comment deleted successfully!"}, status=status.HTTP_200_OK)

# Like a post, if already liked, unlike the post
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    user = request.user

    # Check if the user already liked the post
    if user in post.likes.all():
        # Unlike
        post.likes.remove(user)
        message = "Post unliked"
    else:
        # Like
        post.likes.add(user)
        message = "Post liked"
    
    return Response({"message": message}, status=status.HTTP_200_OK)

# Like a comment, if already liked, unlike the comment
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_comment(request, comment_id):
    comment = get_object_or_404(Comment, id=comment_id)
    user = request.user

    # Check if the user already liked the comment
    if user in comment.likes.all():
        # Unlike
        comment.likes.remove(user)
        message = "Comment unliked"
    else:
        # Like
        comment.likes.add(user)
        message = "Comment liked"

    return Response({"message": message}, status=status.HTTP_200_OK)

# Get post like count
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_post_likes(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    like_count = post.total_likes
    return Response({"Like Count":like_count}, status=status.HTTP_200_OK)

# Get comment like count
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_comment_likes(request, comment_id):
    comment = get_object_or_404(Comment, id=comment_id)
    like_count = comment.total_likes
    return Response({"Like Count":like_count}, status=status.HTTP_200_OK)