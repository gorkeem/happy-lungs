import React, { useState } from "react";
import { useCommunityStore } from "../store/useCommunityStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import Comment from "./Comment";
import ConfirmModal from "./ConfirmModal";
import { motion, AnimatePresence } from "framer-motion";

const commentSectionVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
};

const Post = ({ post }) => {
    const { authUser } = useAuthStore();
    const {
        likePost,
        getComments,
        comments,
        createComment,
        likeComment,
        updatePost,
        deletePost,
    } = useCommunityStore();

    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [editing, setEditing] = useState(false);
    const [editedPost, setEditedPost] = useState({
        title: post.title,
        content: post.content,
    });
    const [showConfirm, setShowConfirm] = useState(false);

    const handleLike = async () => {
        await likePost(post.id);
    };

    const handleToggleComments = async () => {
        if (!showComments) {
            await getComments(post.id);
        }
        setShowComments((prev) => !prev);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) {
            toast.error("Comment cannot be empty");
            return;
        }
        await createComment(post.id, { content: newComment });
        setNewComment("");
    };

    const handleLikeComment = async (commentId) => {
        await likeComment(commentId, post.id);
    };

    const handleUpdatePost = async (e) => {
        e.preventDefault();
        if (!editedPost.title.trim() || !editedPost.content.trim()) return;
        await updatePost(post.id, editedPost);
        setEditing(false);
    };

    const handleDeletePost = () => {
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        await deletePost(post.id, post.currentPage);
        setShowConfirm(false);
    };

    const cancelDelete = () => {
        setShowConfirm(false);
    };

    const postComments = comments[post.id] || [];

    return (
        <motion.div
            className="border p-4 mb-4 rounded shadow-sm bg-base-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
        >
            {showConfirm && (
                <ConfirmModal
                    message="Are you sure you want to delete this post?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
            {/* Post Header */}
            <div className="mb-2 flex justify-between items-center">
                {editing ? (
                    <form onSubmit={handleUpdatePost} className="flex-1">
                        <input
                            type="text"
                            value={editedPost.title}
                            onChange={(e) =>
                                setEditedPost({
                                    ...editedPost,
                                    title: e.target.value,
                                })
                            }
                            className="input input-bordered w-full mb-2"
                            required
                        />
                    </form>
                ) : (
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold">{post.title}</h2>
                        <p className="text-xs text-base-content/60">
                            by {post.user} on{" "}
                            {new Date(post.created_at).toLocaleString()}
                        </p>
                    </div>
                )}
                {authUser?.username === post.user && !editing && (
                    <div className="flex space-x-2">
                        <button
                            className="btn btn-xs btn-outline"
                            onClick={() => setEditing(true)}
                        >
                            Edit
                        </button>
                        <button
                            className="btn btn-xs btn-error"
                            onClick={handleDeletePost}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
            {editing ? (
                <textarea
                    value={editedPost.content}
                    onChange={(e) =>
                        setEditedPost({
                            ...editedPost,
                            content: e.target.value,
                        })
                    }
                    className="textarea textarea-bordered w-full mb-2"
                    rows="3"
                    required
                />
            ) : (
                <div className="mb-2">
                    <p>{post.content}</p>
                </div>
            )}
            {editing && (
                <div className="flex justify-end space-x-2 mb-2">
                    <button
                        className="btn btn-xs btn-success"
                        onClick={handleUpdatePost}
                    >
                        Save
                    </button>
                    <button
                        className="btn btn-xs btn-outline"
                        onClick={() => setEditing(false)}
                    >
                        Cancel
                    </button>
                </div>
            )}
            {/* Post Meta & Actions */}
            <div className="flex items-center space-x-4 text-sm text-base-content/80">
                <button onClick={handleLike} className="btn btn-sm btn-primary">
                    Like
                </button>
                <span>{post.total_likes} Likes</span>
                <button
                    onClick={handleToggleComments}
                    className="btn btn-sm btn-secondary"
                >
                    {showComments ? "Hide Comments" : "Show Comments"}
                </button>
                <span>{post.total_comments} Comments</span>
            </div>
            <AnimatePresence>
                {showComments && (
                    <motion.div
                        className="mt-4 border-t pt-4"
                        variants={commentSectionVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        <form onSubmit={handleCommentSubmit} className="mb-4">
                            <textarea
                                className="textarea textarea-bordered w-full"
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="btn btn-sm btn-primary mt-2"
                            >
                                Post Comment
                            </button>
                        </form>
                        {postComments.length > 0 ? (
                            postComments.map((comment) => (
                                <Comment
                                    key={comment.id}
                                    comment={comment}
                                    onLike={handleLikeComment}
                                    postId={post.id}
                                />
                            ))
                        ) : (
                            <p className="text-base-content/60">
                                No comments yet.
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

function areEqual(prevProps, nextProps) {
    return (
        prevProps.post.id === nextProps.post.id &&
        prevProps.post.total_likes === nextProps.post.total_likes &&
        prevProps.post.total_comments === nextProps.post.total_comments &&
        prevProps.post.title === nextProps.post.title &&
        prevProps.post.content === nextProps.post.content &&
        prevProps.post.user === nextProps.post.user
    );
}

export default React.memo(Post, areEqual);
