from django.urls import path
from .views import (
    create_post,
    update_post,
    delete_post,
    get_post,
    get_posts,
    get_post_likes,
    get_comments,
    create_comment,
    update_comment,
    delete_comment,
    like_post,
    like_comment,
    get_comment_likes,
)

urlpatterns = [
    # Post endpoints
    path('posts/', get_posts, name="get_posts"),   
    path('posts/<int:post_id>/', get_post, name="get_post"),
    path('posts/create/', create_post, name="create_post"),
    path('posts/<int:post_id>/update/', update_post, name="update_post"),
    path('posts/<int:post_id>/delete/', delete_post, name="delete_post"),
    path('posts/<int:post_id>/likes/', get_post_likes, name="get_post_likes"),

    # Comment endpoints
    path('posts/<int:post_id>/comments/', get_comments, name="get_comments"),
    path('posts/<int:post_id>/comments/create/', create_comment, name="create_comment"),
    path('comments/<int:comment_id>/update/', update_comment, name="update_comment"),
    path('comments/<int:comment_id>/delete/', delete_comment, name="delete_comment"),
    path('comments/<int:comment_id>/likes/', get_comment_likes, name="get_comment_likes"),

    # Like endpoints
    path('posts/<int:post_id>/like/', like_post, name="like_post"),
    path('comments/<int:comment_id>/like/', like_comment, name="like_comment"),
]
