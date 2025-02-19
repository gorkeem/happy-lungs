import React, { useState } from "react";
import { BsFillLungsFill } from "react-icons/bs";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { VscAccount } from "react-icons/vsc";
import { MdForum } from "react-icons/md";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";
import { useAuthStore } from "../store/useAuthStore";

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
            href: "/login",
            icon: <FiLogIn size={24} />,
            label: "Login",
        },
        {
            href: "/signup",
            icon: <VscAccount size={24} />,
            label: "Create Account",
        },
    ];

    const sidebarElementsAuthenticated = [
        {
            href: "/",
            icon: <BsFillLungsFill size={24} />,
            label: "HappyLungs",
        },
        {
            href: "/forum",
            icon: <MdForum size={24} />,
            label: "Community",
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
                className={` text-white flex flex-col mt-5 p-4 transition-all duration-300 ${
                    isOpen ? "w-48" : "w-24"
                }`}
            >
                <nav
                    className={`flex flex-col space-y-6 mt-6 ${
                        isOpen ? "items-start" : "items-center"
                    }`}
                >
                    {sidebarContent.map(({ href, icon, label, onClick }) => (
                        <div
                            key={href}
                            className="group flex items-center w-full px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gray-700 hover:scale-105"
                        >
                            <a
                                href={href}
                                className="flex items-center space-x-2 text-white"
                                onClick={onClick}
                            >
                                {icon}
                                {isOpen && (
                                    <span className="group-hover:text-gray-300">
                                        {label}
                                    </span>
                                )}
                            </a>
                        </div>
                    ))}
                </nav>
            </div>
            <div className="divider lg:divider-horizontal">
                <button
                    className="mt-8 sm:m-4 p-4 rounded-lg transition-all duration-300 hover:bg-gray-700 hover:scale-105"
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
