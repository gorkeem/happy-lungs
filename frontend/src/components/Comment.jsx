import React, { useState } from "react";
import { useCommunityStore } from "../store/useCommunityStore";
import { useAuthStore } from "../store/useAuthStore";
import ConfirmModal from "./ConfirmModal";
import { useNavigate } from "react-router-dom";

const Comment = ({ comment, onLike, postId }) => {
    const { updateComment, deleteComment } = useCommunityStore();
    const { authUser } = useAuthStore();
    const navigate = useNavigate();

    const [editing, setEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const [showConfirm, setShowConfirm] = useState(false);

    // Navigation to user profile
    const goToProfile = (userId) => {
        navigate(`/profile/${userId}`);
    };

    // Handle comment update
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editedContent.trim()) return;
        await updateComment(comment.id, postId, { content: editedContent });
        setEditing(false);
    };

    // Handle comment delete
    const handleDelete = () => {
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        await deleteComment(comment.id, postId);
        setShowConfirm(false);
    };

    const cancelDelete = () => {
        setShowConfirm(false);
    };

    return (
        <div className="border p-4 rounded mb-4 bg-base-200 shadow-sm">
            {showConfirm && (
                <ConfirmModal
                    message="Are you sure you want to delete this comment?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
            <div className="flex flex-col">
                {/* Comment Header */}
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => goToProfile(comment.user.id)}
                            className="btn btn-link text-blue-500 hover:text-blue-700 p-0"
                        >
                            {comment.user?.username}
                        </button>
                        <span className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Comment Content */}
                {editing ? (
                    <form onSubmit={handleUpdate} className="space-y-2">
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="textarea textarea-bordered w-full"
                            rows="3"
                            required
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                type="submit"
                                className="btn btn-sm btn-success"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditing(false)}
                                className="btn btn-sm btn-outline"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className="mb-2">{comment.content}</p>
                )}

                {/* Comment Actions */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => onLike(comment.id)}
                        className="btn btn-sm btn-accent"
                    >
                        Like
                    </button>
                    <span className="text-sm">
                        {comment.total_likes}{" "}
                        {comment.total_likes <= 1 ? "Like" : "Likes"}
                    </span>

                    {authUser?.id === comment.user.id && !editing && (
                        <div className="flex space-x-2 ml-auto">
                            <button
                                onClick={() => setEditing(true)}
                                className="btn btn-sm btn-outline"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="btn btn-sm btn-error"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Comment;
