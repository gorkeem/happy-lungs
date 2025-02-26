import React from "react";
import Sidebar from "../components/Sidebar";
import Settings from "../components/Settings";
const SettingsPage = () => {
    return (
        <div className="flex min-h-screen">
            {/* sidebar */}
            <Sidebar />
            {/* settings */}
            <Settings />
        </div>
    );
};

export default SettingsPage;
