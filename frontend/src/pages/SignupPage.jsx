import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";
import DancingIcon from "../components/DancingIcon";

import { useAuthStore } from "../store/useAuthStore";
import { LuEye } from "react-icons/lu";
import { LuEyeClosed } from "react-icons/lu";
import { IoIosMail } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { FiLoader } from "react-icons/fi";

const SignupPage = () => {
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        quit_date: "",
        cigs_per_day: "",
        cigs_in_pack: "",
        cost_per_pack: "",
    });
    const { isSigningUp, signup } = useAuthStore();

    const validateForm = () => {
        if (!formData.username.trim())
            return toast.error("Username is required");
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!/\S+@\S+\.\S+/.test(formData.email))
            return toast.error("Invalid email format");
        if (!formData.password) return toast.error("Password is required");
        if (formData.password.length < 6)
            return toast.error("Password must be at least 6 characters");

        // quit_date validation: cannot be a future date
        if (!formData.quit_date.trim())
            return toast.error("Quit date is required");
        const quitDate = new Date(formData.quit_date);
        const today = new Date();
        if (quitDate > today)
            return toast.error("Quit date cannot be in the future");

        // Numeric validation for cigs_per_day, cigs_in_pack, cost_per_pack
        if (!/^\d+$/.test(formData.cigs_per_day.trim()))
            return toast.error("Cigarettes per day must be a number");
        if (!/^\d+$/.test(formData.cigs_in_pack.trim()))
            return toast.error("Cigarettes in a pack must be a number");
        if (!/^\d+(\.\d{1,2})?$/.test(formData.cost_per_pack.trim()))
            return toast.error("Cost per pack must be a valid number");

        return true;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handleBack = (e) => {
        e.preventDefault();
        setStep(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("SENDING FORM DATA:", formData);
        const success = validateForm();
        if (success === true) {
            signup(formData);
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col justify-center items-center flex-grow">
                <DancingIcon w="50" h="50" />
                <form
                    onSubmit={step === 1 ? handleNext : handleSubmit}
                    className="p-6 rounded-lg shadow-md space-y-4 w-80"
                >
                    <h2 className="text-2xl font-bold text-center">
                        Create Account
                    </h2>
                    {step === 1 && (
                        <>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">
                                        Username
                                    </span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="size-5 text-base-content/40" />
                                    </div>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full pl-10"
                                        placeholder="john_doe"
                                        value={formData.username}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                username: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

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
                                        type="email"
                                        className="input input-bordered w-full pl-10"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                email: e.target.value,
                                            })
                                        }
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
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        className="input input-bordered w-full pl-10"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                password: e.target.value,
                                            })
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
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
                            >
                                Next
                            </button>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">
                                        Quit Date
                                    </span>
                                </label>
                                <input
                                    name="quit_date"
                                    type="date"
                                    value={formData.quit_date}
                                    onChange={(e) => {
                                        handleChange(e);
                                        e.target.blur(); // closes the picker
                                    }}
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">
                                        Cigarettes per Day
                                    </span>
                                </label>
                                <input
                                    name="cigs_per_day"
                                    value={formData.cigs_per_day}
                                    placeholder="e.g. 12"
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">
                                        Cigarettes in a Pack
                                    </span>
                                </label>
                                <input
                                    name="cigs_in_pack"
                                    value={formData.cigs_in_pack}
                                    placeholder="e.g. 20"
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">
                                        Cost per Pack (€)
                                    </span>
                                </label>
                                <input
                                    name="cost_per_pack"
                                    value={formData.cost_per_pack}
                                    placeholder="e.g. 5.99"
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleBack}
                                    className="btn w-1/2"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary w-1/2"
                                    disabled={isSigningUp}
                                >
                                    {isSigningUp ? (
                                        <>
                                            <FiLoader className="size-5 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        "Submit"
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </form>
                <div className="text-center mt-4">
                    <p className="text-base-content/60">
                        Already have an account?{" "}
                        <Link to="/login" className="link link-primary">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
