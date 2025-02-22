import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Stats from "../components/Stats";
import { useAuthStore } from "../store/useAuthStore";

const HomePage = () => {
    return (
        <div className="flex h-screen">
            {/* sidebar */}
            <Sidebar />
            {/* main content */}
            <Stats />
        </div>
    );
};

export default HomePage;
