import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useCommunityStore = create((set, get) => ({
    posts: [],
    comments: {},
    isLoadingPosts: false,
    isLoadingComments: false,
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,

    // Fetch posts with pagination
    getPosts: async (query = "", page = 1) => {
        set({ isLoadingPosts: true });
        try {
            const response = await axiosInstance.get(
                `/forum/posts/?q=${query}&page=${page}`
            );

            console.log("Pagination response:", response.data);

            set({
                posts: response.data.results,
                currentPage: page,
                hasNextPage: !!response.data.next,
                hasPrevPage: !!response.data.previous,
                totalPages: Math.ceil(response.data.count / 10),
            });
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to load posts"
            );
        } finally {
            set({ isLoadingPosts: false });
        }
    },

    // Go to next page
    nextPage: () => {
        const { currentPage, hasNextPage } = get();
        if (hasNextPage) {
            get().getPosts("", currentPage + 1);
        }
    },

    // Go to previous page
    prevPage: () => {
        const { currentPage, hasPrevPage } = get();
        if (hasPrevPage) {
            get().getPosts("", currentPage - 1);
        }
    },

    // Create a new post
    createPost: async (data) => {
        try {
            await axiosInstance.post("/forum/posts/create/", data);
            toast.success("Post created successfully!");
            get().getPosts("", 1); // Refresh to first page
        } catch (error) {
            console.error("Create post error:", error.response?.data);
            toast.error(error.response?.data?.message || "Error creating post");
        }
    },

    // Update an existing post
    updatePost: async (postId, data) => {
        try {
            await axiosInstance.put(`/forum/posts/${postId}/update/`, data);
            toast.success("Post updated successfully!");
            const { currentPage } = get();
            get().getPosts("", currentPage); // Refresh the current page
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating post");
        }
    },

    // Delete a post
    deletePost: async (postId) => {
        const { currentPage } = get();
        try {
            await axiosInstance.delete(`/forum/posts/${postId}/delete/`);
            toast.success("Post deleted successfully!");
            get().getPosts("", 1); // Refresh to first page
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting post");
        }
    },

    // Fetch comments for a specific post
    getComments: async (postId) => {
        set({ isLoadingComments: true });
        try {
            const response = await axiosInstance.get(
                `/forum/posts/${postId}/comments/`
            );
            set((state) => ({
                comments: { ...state.comments, [postId]: response.data },
            }));
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to load comments"
            );
        } finally {
            set({ isLoadingComments: false });
        }
    },

    // Create a comment on a post
    createComment: async (postId, data) => {
        try {
            await axiosInstance.post(
                `/forum/posts/${postId}/comments/create/`,
                data
            );
            toast.success("Comment created successfully!");
            await get().getComments(postId);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Error creating comment"
            );
        }
    },

    // Update a comment
    updateComment: async (commentId, postId, data) => {
        try {
            await axiosInstance.put(
                `/forum/comments/${commentId}/update/`,
                data
            );
            toast.success("Comment updated successfully!");
            await get().getComments(postId);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Error updating comment"
            );
        }
    },

    // Delete a comment
    deleteComment: async (commentId, postId) => {
        try {
            await axiosInstance.delete(`/forum/comments/${commentId}/delete/`);
            toast.success("Comment deleted successfully!");
            await get().getComments(postId);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Error deleting comment"
            );
        }
    },

    // Toggle like on a post
    likePost: async (postId) => {
        try {
            const response = await axiosInstance.post(
                `/forum/posts/${postId}/like/`
            );
            // Get liked flag from response.data.data instead of response.data.liked
            const liked = response.data.data;
            toast.success(response.data.message);
            set((state) => ({
                posts: state.posts.map((p) =>
                    p.id === postId
                        ? {
                              ...p,
                              total_likes: liked
                                  ? p.total_likes + 1
                                  : p.total_likes - 1,
                          }
                        : p
                ),
            }));
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Error toggling like on post"
            );
        }
    },

    // Toggle like on a comment
    likeComment: async (commentId, postId) => {
        try {
            const response = await axiosInstance.post(
                `/forum/comments/${commentId}/like/`
            );
            toast.success(response.data.message);
            await get().getComments(postId);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Error toggling like on comment"
            );
        }
    },
}));
