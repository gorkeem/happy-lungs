import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import DancingIcon from "./DancingIcon";
import { motion } from "framer-motion";
import Milestones from "./Milestones";

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.3 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0 },
};

const Stats = () => {
    const { authUser, isLoadingStats, stats, isCheckingAuth } = useAuthStore();

    return (
        <div className="flex flex-col min-h-screen">
            {/* header */}
            <header className="p-4 shadow-md">
                <div className="flex items-center space-x-4">
                    <DancingIcon w="50" h="50" />
                    <h1 className="text-3xl font-bold">
                        {authUser?.username}'s stats
                    </h1>
                </div>
            </header>

            {/* main content */}
            <main className="flex-1 overflow-y-auto p-4">
                {isLoadingStats || isCheckingAuth ? (
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
                        {/* stats card */}
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

                        {/* co level card */}
                        <motion.div
                            className={`card shadow-xl p-4 ${
                                stats.current_co_level === 0 ? "hidden" : ""
                            }`}
                            variants={itemVariants}
                        >
                            <div className="card-body">
                                <h2 className="card-title text-lg">
                                    Co level status
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

                        {/* mini stats using flex-wrap */}
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
                                <div className="stat-desc text-xs">
                                    Bank boost
                                </div>
                            </div>
                            <div className="stat flex-1 min-w-[150px]">
                                <div className="stat-title text-sm">
                                    Cigarettes avoided
                                </div>
                                <div className="stat-value text-lg">
                                    {stats.cigarettes_avoided}
                                </div>
                                <div className="stat-desc text-xs">
                                    Health wins
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

                        {/* healing milestones */}
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

            {/* footer */}
            <footer className="p-2 text-center">
                &copy; {new Date().getFullYear()} HappyLungs
            </footer>
        </div>
    );
};

export default Stats;
