import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import DancingIcon from "./DancingIcon";
import { motion } from "framer-motion";
import Milestones from "./Milestones";

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.2 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

const Stats = () => {
    const { authUser, isLoadingStats, stats, isCheckingAuth } = useAuthStore();

    return (
        <div className="flex flex-col p-4 h-screen">
            {/* header */}
            <header className="p-4 shadow-md">
                <div className="flex items-center space-x-4">
                    <DancingIcon w="50" h="50" />
                    <h1 className="text-3xl font-bold">
                        <span>{authUser?.username}'s stats</span>
                    </h1>
                </div>
            </header>

            {/* main content */}
            <main className="flex-1 overflow-y-auto p-10">
                {isLoadingStats || isCheckingAuth ? (
                    <span className="loading loading-spinner loading-md"></span>
                ) : stats ? (
                    <motion.div
                        className="space-y-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                    >
                        {/* stats cards */}
                        <motion.div
                            className="stats shadow-xl"
                            variants={itemVariants}
                        >
                            <div className="stat">
                                <div className="stat-title">smoke free for</div>
                                <div className="stat-value">
                                    {stats.time_since_quit}
                                </div>
                                <div className="stat-desc">progress made</div>
                            </div>
                        </motion.div>

                        {/* co level card */}
                        <motion.div
                            className={`card shadow-xl ${
                                stats.current_co_level === 0 ? "hidden" : ""
                            }`}
                            variants={itemVariants}
                        >
                            <div className="card-body">
                                <h2 className="card-title">co level status</h2>
                                <p>{stats.co_level_status}</p>
                                <div className="w-full mt-4">
                                    <progress
                                        className="progress progress-info w-full"
                                        value={stats.current_co_level}
                                        max="100"
                                    ></progress>
                                </div>
                            </div>
                        </motion.div>

                        {/* mini stats */}
                        <motion.div
                            className="stats shadow-xl p-4"
                            variants={itemVariants}
                        >
                            <div className="stat">
                                <div className="stat-title">money saved</div>
                                <div className="stat-value">
                                    {stats.money_saved}€
                                </div>
                                <div className="stat-desc">bank boost</div>
                            </div>
                            <div className="stat">
                                <div className="stat-title">cigs avoided</div>
                                <div className="stat-value">
                                    {stats.cigarettes_avoided}
                                </div>
                                <div className="stat-desc">health wins</div>
                            </div>
                            <div className="stat">
                                <div className="stat-title">cigs per day</div>
                                <div className="stat-value">
                                    {stats.cigs_per_day}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="stat-title">cost per pack</div>
                                <div className="stat-value">
                                    {stats.cost_per_pack}€
                                </div>
                            </div>
                        </motion.div>

                        {/* healing milestones */}
                        <Milestones milestones={stats.get_healing_milestones} />
                    </motion.div>
                ) : (
                    <h1 className="text-xl text-gray-700">
                        No stats available
                    </h1>
                )}
            </main>

            {/* footer */}
            <footer className=" p-2 text-center">
                &copy; {new Date().getFullYear()} HappyLungs
            </footer>
        </div>
    );
};

export default Stats;
