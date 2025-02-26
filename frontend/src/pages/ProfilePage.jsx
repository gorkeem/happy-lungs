import React, { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

const ProfilePage = () => {
    const { users_public_stats, public_stats, isLoadingStats } = useAuthStore();
    const { userId } = useParams();

    useEffect(() => {
        if (userId) public_stats(userId);
    }, [userId]);

    return (
        <div className="min-h-screen p-6 bg-base-200">
            {isLoadingStats ? (
                <div className="flex items-center justify-center h-full">
                    <span className="loading loading-spinner loading-md"></span>
                </div>
            ) : users_public_stats ? (
                <motion.div
                    className="max-w-4xl mx-auto bg-base-100 p-6 rounded-lg shadow-lg"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="text-3xl font-bold mb-6">
                        {users_public_stats.user}'s Stats
                    </h1>
                    {users_public_stats.stats ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="stat">
                                <div className="stat-title">Smoke Free For</div>
                                <div className="stat-value">
                                    {users_public_stats.stats.time_since_quit}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="stat-title">Money Saved</div>
                                <div className="stat-value">
                                    {users_public_stats.stats.money_saved}€
                                </div>
                            </div>
                            <div className="stat">
                                <div className="stat-title">
                                    Cigarettes Avoided
                                </div>
                                <div className="stat-value">
                                    {
                                        users_public_stats.stats
                                            .cigarettes_avoided
                                    }
                                </div>
                            </div>
                            <div className="stat">
                                <div className="stat-title">
                                    Current CO Level
                                </div>
                                <div className="stat-value">
                                    {users_public_stats.stats.current_co_level}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            This user hasn’t tracked any stats yet.
                        </p>
                    )}
                </motion.div>
            ) : (
                <h1 className="text-xl text-gray-700">
                    User profile not found
                </h1>
            )}
        </div>
    );
};

export default ProfilePage;
