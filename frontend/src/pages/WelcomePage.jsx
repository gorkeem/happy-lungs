import React from "react";

import Sidebar from "../components/Sidebar";
import DancingIcon from "../components/DancingIcon";

const WelcomePage = () => {
    return (
        <div className="flex h-screen bg-gray-900">
            {/* Sidebar */}
            <Sidebar />
            {/* Main Content */}
            <div className="flex flex-col justify-center items-center flex-grow p-6">
                <DancingIcon w="200" h="200" />
                <h1 className="text-3xl font-bold mt-4">
                    Welcome to HappyLungs
                </h1>
                <p className="text-gray-600 mt-2 max-w-md text-center">
                    Track your progress, join a community, and quit smoking for
                    good.
                </p>
            </div>
        </div>
    );
};

export default WelcomePage;
