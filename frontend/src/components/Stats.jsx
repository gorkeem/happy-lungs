import React, { useState } from "react";
import { motion } from "framer-motion";
import DancingIcon from "./DancingIcon";
import Milestones from "./Milestones";
import RelapseModal from "./RelapseModal";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.3 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0 },
};

const Stats = ({ user, stats, isLoading, isAuthUser }) => {
    const navigate = useNavigate();
    const { relapse } = useAuthStore();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleRelapse = () => {
        setShowConfirm(true);
    };
    const confirmRelapse = async () => {
        await relapse();
        setShowConfirm(false);
    };

    const cancelRelapse = () => {
        setShowConfirm(false);
    };

    const goToSettings = () => navigate("/settings");

    return (
        <div className="flex flex-col min-h-screen">
            {showConfirm && (
                <RelapseModal
                    message="Are you sure you want to start over?"
                    onConfirm={confirmRelapse}
                    onCancel={cancelRelapse}
                />
            )}

            {/* Header */}
            <header className="p-6 shadow-md">
                <div className="flex justify-between items-center">
                    <div className="flex flex-row items-center space-x-4">
                        <DancingIcon w="50" h="50" />
                        <h1 className="text-3xl font-bold">
                            {user?.username || "User"}'s stats
                        </h1>
                    </div>

                    {/* Action buttons (only for auth user) */}
                    {isAuthUser && (
                        <div className="flex space-x-4">
                            <button
                                className="btn btn-error btn-sm"
                                onClick={handleRelapse}
                            >
                                Relapse
                            </button>
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={goToSettings}
                            >
                                Settings
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <span className="loading loading-spinner loading-md"></span>
                    </div>
                ) : stats ? (
                    <motion.div
                        className="space-y-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                    >
                        {/* Stats card */}
                        <motion.div
                            className="stats shadow-xl p-4"
                            variants={itemVariants}
                        >
                            <div className="stat">
                                <div className="stat-title text-sm">
                                    Smoke free for
                                </div>
                                <div className="stat-value text-xl">
                                    {stats.time_since_quit}
                                </div>
                                <div className="stat-desc text-xs">
                                    Progress made
                                </div>
                            </div>
                        </motion.div>

                        {/* CO level card */}
                        {stats.current_co_level !== 0 && (
                            <motion.div
                                className="card shadow-xl p-4"
                                variants={itemVariants}
                            >
                                <div className="card-body">
                                    <h2 className="card-title text-lg">
                                        CO level status
                                    </h2>
                                    <p className="text-sm">
                                        {stats.co_level_status}
                                    </p>
                                    <div className="w-full mt-4">
                                        <progress
                                            className="progress progress-info w-full"
                                            value={stats.current_co_level}
                                            max="100"
                                        ></progress>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Mini stats */}
                        <motion.div
                            className="stats shadow-xl p-4 flex flex-wrap gap-4"
                            variants={itemVariants}
                        >
                            <div className="stat flex-1 min-w-[150px]">
                                <div className="stat-title text-sm">
                                    Money saved
                                </div>
                                <div className="stat-value text-lg">
                                    {stats.money_saved}€
                                </div>
                            </div>
                            <div className="stat flex-1 min-w-[150px]">
                                <div className="stat-title text-sm">
                                    Cigarettes avoided
                                </div>
                                <div className="stat-value text-lg">
                                    {stats.cigarettes_avoided}
                                </div>
                            </div>
                            <div className="stat flex-1 min-w-[150px]">
                                <div className="stat-title text-sm">
                                    Cigarettes per day
                                </div>
                                <div className="stat-value text-lg">
                                    {stats.cigs_per_day}
                                </div>
                            </div>
                            <div className="stat flex-1 min-w-[150px]">
                                <div className="stat-title text-sm">
                                    Cost per pack
                                </div>
                                <div className="stat-value text-lg">
                                    {stats.cost_per_pack}€
                                </div>
                            </div>
                        </motion.div>

                        {/* Healing milestones */}
                        <motion.div
                            className="stats shadow-xl p-4 flex flex-wrap gap-4"
                            variants={itemVariants}
                        >
                            <Milestones
                                milestones={stats.get_healing_milestones}
                            />
                        </motion.div>
                    </motion.div>
                ) : (
                    <h1 className="text-xl text-gray-700">
                        No stats available
                    </h1>
                )}
            </main>

            {/* Footer */}
            <footer className="p-2 text-center">
                &copy; {new Date().getFullYear()} HappyLungs
            </footer>
        </div>
    );
};

export default Stats;
