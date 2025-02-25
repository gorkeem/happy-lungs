import React, { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

const Leaderboard = () => {
    const { isLoadingLeaderboard, leaderboard_list, leaderboard } =
        useAuthStore();

    useEffect(() => {
        leaderboard();
    }, [leaderboard]);

    return (
        <div className="w-full">
            {isLoadingLeaderboard ? (
                <div className="flex items-center justify-center h-screen">
                    <span className="loading loading-spinner loading-md"></span>
                </div>
            ) : (
                <div className="p-5">
                    <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
                    <div className="overflow-x-auto">
                        <table className="w-full table-fixed divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rank
                                    </th>
                                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Days Since Quit
                                    </th>
                                    <th className="px-2 py-2 hidden sm:table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Money Saved
                                    </th>
                                    <th className="px-2 py-2 hidden md:table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Member Since
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {leaderboard_list.map((item, index) => (
                                    <tr key={`${item.user.id}-${index}`}>
                                        <td className="px-2 py-2">
                                            {index + 1}
                                        </td>
                                        <td className="px-2 py-2">
                                            {item.user.username}
                                        </td>
                                        <td className="px-2 py-2">
                                            {item.days_since_quit}
                                        </td>
                                        <td className="px-2 py-2 hidden sm:table-cell">
                                            {item.money_saved}€
                                        </td>
                                        <td className="px-2 py-2 hidden md:table-cell">
                                            {item.user.date_joined}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
