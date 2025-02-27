import React, { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useParams, useNavigate } from "react-router-dom";
import Stats from "../components/Stats";
import Sidebar from "../components/Sidebar";

const ProfilePage = () => {
    const { users_public_stats, public_stats, isLoadingStats, authUser } =
        useAuthStore();
    const { userId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            if (authUser && authUser.id === parseInt(userId)) {
                navigate("/"); // Redirect to home page if IDs match
            } else {
                console.log("Fetching profile for userId:", userId);
                public_stats(userId);
            }
        }
    }, [userId, authUser, navigate, public_stats]);

    return (
        <div className="flex h-screen">
            <Sidebar />
            <Stats
                user={users_public_stats?.user}
                stats={users_public_stats}
                isLoading={isLoadingStats}
                isAuthUser={authUser?.id === parseInt(userId)}
            />
        </div>
    );
};

export default ProfilePage;
