import React from "react";
import Sidebar from "../components/Sidebar";

const HomePage = () => {
    return (
        <div className="flex h-screen bg-gray-900">
            {/* Sidebar */}
            <Sidebar />
            {/* Main Content */}
        </div>
    );
};

export default HomePage;
