import React from "react";
import { motion } from "framer-motion";
import happylungsIcon from "../assets/happylungs_icon.webp";

const DancingIcon = (props) => {
    return (
        <div>
            <motion.img
                src={happylungsIcon} // Use the imported image
                alt="HappyLungs Icon"
                style={{ width: `${props.w}px`, height: `${props.h}px` }}
                className="rounded-lg mb-4"
                animate={{
                    y: [0, -15, 0],
                    rotate: [0, -5, 0, 5, 0],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5, // total timing of animation
                    ease: "easeInOut",
                }}
            />
        </div>
    );
};

export default DancingIcon;
