import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import WelcomePage from "./pages/WelcomePage";
import Leaderboard from "./pages/Leaderboard";
import { useAuthStore } from "./store/useAuthStore";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";
import CommunityPage from "./pages/CommunityPage";

const App = () => {
    const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
    const { lightTheme } = useThemeStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    console.log("authUser is:", { authUser });

    if (isCheckingAuth && !authUser) {
        return (
            <div className="flex items-center justify-center h-screen">
                <span className="loading loading-spinner loading-md"></span>
            </div>
        );
    }

    return (
        <div data-theme={lightTheme ? "pastel" : "dark"} className="font-mono">
            <Routes>
                <Route
                    path="/"
                    element={
                        authUser ? <HomePage /> : <Navigate to="/welcome" />
                    }
                />
                <Route
                    path="/signup"
                    element={!authUser ? <SignupPage /> : <Navigate to="/" />}
                />
                <Route
                    path="/login"
                    element={!authUser ? <LoginPage /> : <Navigate to="/" />}
                />
                {/* <Route
                    path="/profile"
                    element={
                        authUser ? <ProfilePage /> : <Navigate to="/welcome" />
                    }
                /> */}
                <Route
                    path="/community"
                    element={
                        authUser ? (
                            <CommunityPage />
                        ) : (
                            <Navigate to="/welcome" />
                        )
                    }
                />
                <Route
                    path="/leaderboard"
                    element={
                        authUser ? <Leaderboard /> : <Navigate to="/welcome" />
                    }
                />
                <Route
                    path="/welcome"
                    element={!authUser ? <WelcomePage /> : <Navigate to="/" />}
                />
            </Routes>
            <Toaster />
        </div>
    );
};

export default App;
