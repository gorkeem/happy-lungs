import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useAuthStore } from "../store/useAuthStore";

const HomePage = () => {
    const { authUser, isLoadingStats, stats } = useAuthStore();

    useEffect(() => {
        if (authUser) {
            console.log("And the stats are:", { stats });
        }
    }, [authUser]);
    return (
        <div className="flex h-screen bg-gray-900">
            {/* Sidebar */}
            <Sidebar />
            {/* Main Content */}
            <div className="flex-1 p-10 bg-gray-500">
                {isLoadingStats ? (
                    <span className="loading loading-spinner loading-md"></span>
                ) : stats ? (
                    <h1>{stats.money_saved}</h1>
                ) : (
                    <h1>No stats available</h1>
                )}
            </div>
        </div>
    );
};

export default HomePage;
