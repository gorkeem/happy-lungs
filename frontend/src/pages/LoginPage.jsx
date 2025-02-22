import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DancingIcon from "../components/DancingIcon";
import { LuEye } from "react-icons/lu";
import { LuEyeClosed } from "react-icons/lu";
import { IoIosMail } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";
import { useAuthStore } from "../store/useAuthStore";
import { FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const { isLoggingIn, login } = useAuthStore();

    const validateForm = () => {
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!formData.password) return toast.error("Password is required");
        return true;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const success = validateForm();
        if (success === true) {
            login(formData);
        }
    };
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col items-center justify-center flex-grow">
                <DancingIcon w="50" h="50" />
                <form
                    onSubmit={handleSubmit}
                    className="p-6 rounded-lg shadow-md space-y-4 w-80"
                >
                    <h2 className="text-2xl font-bold text-center">
                        Welcome to HappyLungs
                    </h2>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">
                                Email
                            </span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <IoIosMail className="size-5 text-base-content/40" />
                            </div>
                            <input
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="input input-bordered w-full pl-10"
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">
                                Password
                            </span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <RiLockPasswordFill className="size-5 text-base-content/40" />
                            </div>
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className="input input-bordered w-full pl-10"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <LuEyeClosed className="size-5 text-base-content/40" />
                                ) : (
                                    <LuEye className="size-5 text-base-content/40" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={isLoggingIn}
                    >
                        {isLoggingIn ? (
                            <>
                                <FiLoader className="h-5 w-5 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>
                <div className="text-center mt-4">
                    <p className="text-base-content/60">
                        Don&apos;t have an account?{" "}
                        <Link to="/signup" className="link link-primary">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
