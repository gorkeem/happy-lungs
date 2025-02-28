import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            when: "beforeChildren",
            staggerChildren: 0.1,
        },
    },
};

const rowVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const Leaderboard = () => {
    const { isLoadingLeaderboard, leaderboard_list, leaderboard } =
        useAuthStore();
    const [search, setSearch] = useState("");
    const [filteredLeaderboard, setFilteredLeaderboard] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        leaderboard();
    }, [leaderboard]);

    useEffect(() => {
        if (search === "") {
            const rankedList = leaderboard_list.map((item, index) => ({
                ...item,
                rank: index + 1,
            }));
            setFilteredLeaderboard(rankedList);
        } else {
            const filtered = leaderboard_list
                .map((item, index) => ({
                    ...item,
                    rank: index + 1,
                }))
                .filter((item) =>
                    item.user.username
                        .toLowerCase()
                        .includes(search.toLowerCase())
                );
            setFilteredLeaderboard(filtered);
        }
    }, [search, leaderboard_list]);

    const handleSearch = (e) => {
        setSearch(e.target.value.trim());
    };

    const goToProfile = (userId) => {
        navigate(`/profile/${userId}`);
    };

    return (
        <div className="w-full">
            <div className="p-5">
                <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>

                <div className="mb-6">
                    <SearchBar
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search for a user..."
                    />
                </div>
            </div>

            {isLoadingLeaderboard ? (
                <div className="flex items-center justify-center h-screen">
                    <span className="loading loading-spinner loading-md"></span>
                </div>
            ) : (
                <motion.div
                    className="p-5"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full table-fixed divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                        Rank
                                    </th>
                                    <th className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                        Days Since Quit
                                    </th>
                                    <th className="px-2 py-2 hidden sm:table-cell text-left text-xs font-medium uppercase tracking-wider">
                                        Money Saved
                                    </th>
                                    <th className="px-2 py-2 hidden md:table-cell text-left text-xs font-medium uppercase tracking-wider">
                                        Member Since
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredLeaderboard.length > 0 ? (
                                    filteredLeaderboard.map((item, index) => (
                                        <motion.tr
                                            key={`${item.user.id}-${index}`}
                                            variants={rowVariants}
                                        >
                                            <td className="px-2 py-2 text-black">
                                                {item.rank === 1
                                                    ? "🥇"
                                                    : item.rank === 2
                                                    ? "🥈"
                                                    : item.rank === 3
                                                    ? "🥉"
                                                    : item.rank}
                                            </td>
                                            <td className="px-2 py-2 text-black">
                                                <button
                                                    onClick={() =>
                                                        goToProfile(
                                                            item.user.id
                                                        )
                                                    }
                                                    className="btn btn-link text-blue-500 hover:text-blue-700"
                                                >
                                                    {item.user.username}
                                                </button>
                                            </td>
                                            <td className="px-2 py-2 text-black">
                                                {item.days_since_quit}
                                            </td>
                                            <td className="px-2 py-2 text-black hidden sm:table-cell">
                                                {item.money_saved}€
                                            </td>
                                            <td className="px-2 py-2 text-black hidden md:table-cell">
                                                {new Date(
                                                    item.user.date_joined
                                                ).toDateString()}
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="text-center py-4 text-gray-500"
                                        >
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Leaderboard;
