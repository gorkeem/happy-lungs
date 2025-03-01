import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import ConfirmModal from "./ConfirmModal";

const Settings = () => {
    const {
        authUser,
        stats,
        update_profile,
        isUpdatingProfile,
        delete_account,
    } = useAuthStore();
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);

    const [formData, setFormData] = useState({
        username: authUser?.username || "",
        email: authUser?.email || "",
        password: "",
        quit_date: stats?.quit_date
            ? new Date(stats.quit_date).toISOString().split("T")[0]
            : "",
        cigs_per_day: stats?.cigs_per_day || 0,
        cost_per_pack: stats?.cost_per_pack || 0,
        cigs_in_pack: stats?.cigs_in_pack || 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await update_profile(formData);
        navigate("/");
    };

    const handleDeleteAccount = () => {
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        await delete_account();
        setShowConfirm(false);
    };

    const cancelDelete = () => {
        setShowConfirm(false);
    };

    return (
        <div className="min-h-screen flex-1 p-6 flex justify-center items-start">
            <motion.div
                className="w-full max-w-4xl bg-base-100 p-6 rounded-lg shadow-2xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {showConfirm && (
                    <ConfirmModal
                        message="Are you sure you want to delete your account?"
                        onConfirm={confirmDelete}
                        onCancel={cancelDelete}
                    />
                )}
                <button
                    className="flex items-center p-3 rounded-btn btn-outline"
                    onClick={() => navigate("/")}
                >
                    <FaChevronLeft className="w-5 h-5" />
                    Go Back
                </button>
                <h1 className="text-3xl font-bold mb-6">Settings</h1>
                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                    <div className="form-control">
                        <label className="label">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="input input-bordered"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input input-bordered"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">New Password (optional)</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input input-bordered"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">Quit Date</label>
                        <input
                            type="date"
                            name="quit_date"
                            value={formData.quit_date}
                            max={new Date().toISOString().split("T")[0]}
                            onChange={(e) => {
                                handleChange(e);
                                e.target.blur(); // closes the picker
                            }}
                            className="input input-bordered"
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="form-control">
                            <label className="label">Cigarettes Per Day</label>
                            <input
                                type="number"
                                name="cigs_per_day"
                                value={formData.cigs_per_day}
                                onChange={handleChange}
                                className="input input-bordered"
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">Cost Per Pack (€)</label>
                            <input
                                type="number"
                                name="cost_per_pack"
                                value={formData.cost_per_pack}
                                onChange={handleChange}
                                className="input input-bordered"
                                step="0.01"
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">Cigarettes in Pack</label>
                            <input
                                type="number"
                                name="cigs_in_pack"
                                value={formData.cigs_in_pack}
                                onChange={handleChange}
                                className="input input-bordered"
                            />
                        </div>
                    </div>
                    {/* <div className="flex flex-col space-y-4"> */}
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={isUpdatingProfile}
                    >
                        {isUpdatingProfile ? "Updating..." : "Save Changes"}
                    </button>

                    {/* </div> */}
                </form>
                <div className="flex justify-between items-center mt-4">
                    <button
                        className="btn btn-error btn-outline px-4 py-1 shadow-md hover:bg-red-600 hover:text-white transition"
                        onClick={handleDeleteAccount}
                    >
                        Delete Account
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Settings;
