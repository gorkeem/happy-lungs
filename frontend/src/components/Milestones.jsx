import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Milestones = ({ milestones }) => {
    const [open, setOpen] = useState(false);
    const hasAchievements =
        milestones?.achieved && milestones.achieved.length > 0;

    const toggleDropdown = () => setOpen(!open);

    return (
        <div className="card">
            <div className="card-body">
                <h2 className="card-title">Healing milestones</h2>
                {milestones?.next_milestone && (
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <strong>Next milestone:</strong>{" "}
                            {milestones.next_milestone.title} -{" "}
                            {milestones.next_milestone.description} (
                            {Math.round(milestones.next_milestone.days_left)}{" "}
                            days left)
                        </div>
                        {hasAchievements && (
                            <button
                                onClick={toggleDropdown}
                                className="btn btn-xs ml-2"
                            >
                                {open ? "Hide" : "Show"} past achievements
                            </button>
                        )}
                    </div>
                )}
                {hasAchievements && (
                    <AnimatePresence>
                        {open && (
                            <motion.ul
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="list-disc pl-5 mt-4 overflow-hidden"
                            >
                                {milestones.achieved.map((milestone, index) => (
                                    <li key={index}>
                                        <strong>{milestone.title}:</strong>{" "}
                                        {milestone.description}
                                    </li>
                                ))}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default Milestones;
