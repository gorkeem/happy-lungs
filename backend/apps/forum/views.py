from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Post, Comment, Like
from django.db.models import Count
from .serializers import PostSerializer, CommentSerializer, LikeSerializer
from rest_framework import status
from django.db.models import Q
from happylungs.utils.paginator import CustomPagination



# Get all posts (optionally with a query)
VALID_SORT_FIELDS = {"created_at", "total_likes", "total_comments"}
VALID_SORT_ORDERS = {"asc", "desc"}

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_posts(request):
    query = request.query_params.get("q", "").strip()
    sort_field = request.GET.get("sort", "created_at") or "created_at"
    sort_order = request.GET.get("order", "desc") or "desc"

    # Default params
    if sort_field not in VALID_SORT_FIELDS:
        sort_field = "created_at"
    if sort_order not in VALID_SORT_ORDERS:
        sort_order = "desc"

    # Handle annotated fields
    sort_field_mapping = {
        "total_likes": "like_count",
        "total_comments": "comment_count",
    }
    db_sort_field = sort_field_mapping.get(sort_field, sort_field)

    sort_by = f"-{db_sort_field}" if sort_order == "desc" else db_sort_field

    try:
        posts = (
            Post.objects.annotate(
                like_count=Count("likes"),
                comment_count=Count("comments")
            ).order_by(sort_by)
        )
    except Exception as e:
        return Response({"error": f"Invalid sorting: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    if query:
        posts = posts.filter(
            Q(title__icontains=query) |
            Q(content__icontains=query) |
            Q(user__username__icontains=query) |
            Q(comments__content__icontains=query)
        ).distinct()

    paginator = CustomPagination()
    paginated_posts = paginator.paginate_queryset(posts, request)
    serializer = PostSerializer(paginated_posts, many=True, context={"request": request})
    return paginator.get_paginated_response(serializer.data)

# Get a single post
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_post(request, post_id):
    if post_id:
        post = get_object_or_404(Post, id=post_id)
        serializer = PostSerializer(post, context={"request": request})
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
        serializer = CommentSerializer(comments, many=True, context={"request": request})
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
@permission_classes([IsAuthenticated])
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
        post.likes.remove(user)
        message = "Post unliked"
        flag = False
    else:
        post.likes.add(user)
        message = "Post liked"
        flag = True

    # Return the updated like status
    return Response(
        {"message": message, "data": flag, "is_liked": flag},
        status=status.HTTP_200_OK
    )


# Like a comment, if already liked, unlike the comment
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_comment(request, comment_id):
    comment = get_object_or_404(Comment, id=comment_id)
    user = request.user

    if user in comment.likes.all():
        comment.likes.remove(user)
        message = "Comment unliked"
        flag = False
    else:
        comment.likes.add(user)
        message = "Comment liked"
        flag = True

    return Response(
        {"message": message, "data": flag, "is_liked": flag},
        status=status.HTTP_200_OK
    )

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