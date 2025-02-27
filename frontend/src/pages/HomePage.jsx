import React from "react";
import Sidebar from "../components/Sidebar";
import Stats from "../components/Stats";
import { useAuthStore } from "../store/useAuthStore";

const HomePage = () => {
    const { authUser, stats, isLoadingStats } = useAuthStore();

    return (
        <div className="flex h-screen">
            <Sidebar />
            <Stats
                user={authUser}
                stats={stats}
                isLoading={isLoadingStats}
                isAuthUser={true}
            />
        </div>
    );
};

export default HomePage;
