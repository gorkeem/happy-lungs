import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";
import SearchBar from "../components/SearchBar";
import { useCommunityStore } from "../store/useCommunityStore";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { staggerChildren: 0.1 },
    },
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
};

const CommunityPage = () => {
    const {
        posts,
        getPosts,
        createPost,
        isLoadingPosts,
        hasPrevPage,
        hasNextPage,
        currentPage,
        totalPages,
    } = useCommunityStore();

    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [newPost, setNewPost] = useState({ title: "", content: "" });

    // Load posts on component mount & when page/search changes
    useEffect(() => {
        getPosts(search, currentPage);
    }, [search, currentPage, getPosts]);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPost.title.trim() || !newPost.content.trim()) return;
        await createPost(newPost);
        setNewPost({ title: "", content: "" });
        setShowModal(false);
    };

    const handleNextPage = () => {
        if (hasNextPage) getPosts(search, currentPage + 1);
    };

    const handlePrevPage = () => {
        if (hasPrevPage) getPosts(search, currentPage - 1);
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 p-6">
                <h1 className="text-4xl font-bold mb-6">Community</h1>

                <div className="mb-6">
                    <SearchBar
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="mb-8">
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn btn-primary"
                    >
                        Create New Post
                    </button>
                </div>

                <AnimatePresence>
                    {showModal && (
                        <motion.div className="fixed inset-0 flex items-center justify-center z-50">
                            <motion.div
                                className="absolute inset-0 bg-base-300 opacity-50"
                                onClick={() => setShowModal(false)}
                            />
                            <motion.div
                                className="relative bg-base-100 rounded-lg shadow-lg p-6 w-full max-w-lg z-10"
                                variants={modalVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                            >
                                <h2 className="text-2xl font-bold mb-4">
                                    Create New Post
                                </h2>
                                <form onSubmit={handleCreatePost}>
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={newPost.title}
                                        onChange={(e) =>
                                            setNewPost((prev) => ({
                                                ...prev,
                                                title: e.target.value,
                                            }))
                                        }
                                        className="input input-bordered w-full mb-3"
                                        required
                                    />
                                    <textarea
                                        placeholder="Content"
                                        value={newPost.content}
                                        onChange={(e) =>
                                            setNewPost((prev) => ({
                                                ...prev,
                                                content: e.target.value,
                                            }))
                                        }
                                        className="textarea textarea-bordered w-full mb-3"
                                        rows="4"
                                        required
                                    />
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="btn btn-outline"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                        >
                                            Post
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Posts List */}
                {isLoadingPosts ? (
                    <div className="flex items-center justify-center h-screen">
                        <span className="loading loading-spinner loading-md"></span>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {posts && posts.length > 0 ? (
                            posts.map((post) => (
                                <Post key={post.id} post={post} />
                            ))
                        ) : (
                            <div className="text-center text-base-content/60">
                                No posts found.
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Pagination */}
                <div className="flex justify-center items-center mt-6 space-x-4">
                    <button
                        onClick={handlePrevPage}
                        className="btn btn-outline btn-sm"
                        disabled={!hasPrevPage || isLoadingPosts}
                    >
                        Prev
                    </button>
                    <span className="text-sm">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        className="btn btn-outline btn-sm"
                        disabled={!hasNextPage || isLoadingPosts}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommunityPage;
