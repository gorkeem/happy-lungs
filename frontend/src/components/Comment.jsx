import React, { useState } from "react";
import { useCommunityStore } from "../store/useCommunityStore";
import { useAuthStore } from "../store/useAuthStore";
import ConfirmModal from "./ConfirmModal";

const Comment = ({ comment, onLike, postId }) => {
    const { updateComment, deleteComment } = useCommunityStore();
    const { authUser } = useAuthStore();
    const [editing, setEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editedContent.trim()) return;
        await updateComment(comment.id, postId, { content: editedContent });
        setEditing(false);
    };

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
        <div>
            {showConfirm && (
                <ConfirmModal
                    message="Are you sure you want to delete this comment?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
            <div className="border p-2 rounded mb-2 flex flex-col bg-base-200">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{comment.user}</span>
                    <span className="text-xs text-base-content/60">
                        {new Date(comment.created_at).toLocaleString()}
                    </span>
                </div>
                {editing ? (
                    <form onSubmit={handleUpdate}>
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="textarea textarea-bordered w-full mb-1"
                            rows="2"
                            required
                        />
                        <div className="flex space-x-2 pb-2">
                            <button
                                type="submit"
                                className="btn btn-xs btn-success"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditing(false)}
                                className="btn btn-xs btn-outline"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className="mb-1">{comment.content}</p>
                )}
                <div className="flex items-center text-xs">
                    <button
                        onClick={() => onLike(comment.id)}
                        className="btn btn-xs btn-accent"
                    >
                        Like
                    </button>
                    <span className="ml-4">
                        {comment.total_likes <= 1
                            ? comment.total_likes + " " + " Like"
                            : comment.total_likes + " " + " Likes"}
                    </span>
                    {authUser?.username === comment.user && !editing && (
                        <div className="flex space-x-2 ml-auto">
                            <button
                                onClick={() => setEditing(true)}
                                className="btn btn-xs btn-outline"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="btn btn-xs btn-error"
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
