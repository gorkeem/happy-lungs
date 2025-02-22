import React, { useState } from "react";
import { BsFillLungsFill } from "react-icons/bs";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { IoPersonAddSharp } from "react-icons/io5";
import { MdForum, MdLeaderboard } from "react-icons/md";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";
import { useAuthStore } from "../store/useAuthStore";
import ThemeToggle from "./ThemeToggle";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const { authUser, logout } = useAuthStore();

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
    };

    const sidebarElementsWelcome = [
        {
            href: "/",
            icon: <BsFillLungsFill size={24} />,
            label: "HappyLungs",
        },
        {
            href: "/leaderboard",
            icon: <MdLeaderboard size={24} />,
            label: "Leaderboard",
        },
        {
            href: "/login",
            icon: <FiLogIn size={24} />,
            label: "Login",
        },

        {
            href: "/signup",
            icon: <IoPersonAddSharp size={24} />,
            label: "Sign Up",
        },
    ];

    const sidebarElementsAuthenticated = [
        {
            href: "/",
            icon: <BsFillLungsFill size={24} />,
            label: "HappyLungs",
        },
        {
            href: "/community",
            icon: <MdForum size={24} />,
            label: "Community",
        },
        {
            href: "/leaderboard",
            icon: <MdLeaderboard size={24} />,
            label: "Leaderboard",
        },
        {
            href: "",
            icon: <FiLogOut size={24} />,
            label: "Logout",
            onClick: handleLogout,
        },
    ];

    const sidebarContent = authUser
        ? sidebarElementsAuthenticated
        : sidebarElementsWelcome;

    return (
        <div className="flex h-screen">
            <div
                className={`flex flex-col mt-5 p-4 transition-all duration-300 ${
                    isOpen ? "w-48" : "w-24"
                }`}
            >
                <div className="flex flex-col h-full justify-between">
                    <nav
                        className={`flex flex-col space-y-6 ${
                            isOpen ? "items-start" : "items-center"
                        }`}
                    >
                        {sidebarContent.map(
                            ({ href, icon, label, onClick }) => (
                                <div
                                    key={href}
                                    className="group flex items-center w-full px-4 py-2 rounded-lg transition-all duration-300 hover:scale-110"
                                >
                                    <a
                                        href={href}
                                        className="flex items-center space-x-2"
                                        onClick={onClick}
                                    >
                                        {icon}
                                        {isOpen && <span>{label}</span>}
                                    </a>
                                </div>
                            )
                        )}
                    </nav>
                    {/* bottom element */}
                    <div
                        className={
                            isOpen ? "flex justify-end" : "flex justify-center"
                        }
                    >
                        <ThemeToggle />
                    </div>
                </div>
            </div>
            <div className="divider lg:divider-horizontal">
                <button
                    className="mt-8 sm:m-4 p-2 rounded-lg transition-all duration-300 hover:scale-110"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? (
                        <LuPanelLeftClose size={20} />
                    ) : (
                        <LuPanelLeftOpen size={20} />
                    )}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
