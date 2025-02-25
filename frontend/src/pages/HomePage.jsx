import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Stats from "../components/Stats";

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
