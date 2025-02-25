import React from "react";
import Leaderboard from "../components/Leaderboard";
import Sidebar from "../components/Sidebar";

const LeaderboardPage = () => {
    return (
        <div className="flex h-screen">
            {/* sidebar */}
            <Sidebar />
            {/* main content */}
            <Leaderboard />
        </div>
    );
};

export default LeaderboardPage;
