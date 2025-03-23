"use client";

import React, { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Canvas, useThree } from "@react-three/fiber";
// import { OrbitControls, TransformControls, Plane } from "@react-three/drei";
// import * as THREE from "three";
import {
//   FaComments,
//   FaCog,
//   FaHome,
//   FaTimes,
//   FaCube,
//   FaSearch,
//   FaInfoCircle,
//   FaCrosshairs,
//   FaThumbsUp,
//   FaHeart,
//   FaFire,
//   FaUsers,
  FaFileAlt,
} from "react-icons/fa";

const Topics: React.FC<{ levelId: number; onBack: () => void }> = ({
    levelId,
    onBack,
  }) => {
    // Dummy topics data
    const topics: Record<number, string[]> = {
      1: ["Basics of HTML", "CSS Fundamentals", "JavaScript Intro"],
      2: ["React Basics", "State Management", "Component Lifecycle"],
      3: ["Advanced React", "Performance Optimization", "Server-Side Rendering"],
      4: ["Full Stack Development", "Scalability", "Cloud Deployment"],
    };
  
    // Pagination State
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerPage = 3;
    const totalPages = Math.ceil(topics[levelId]?.length / itemsPerPage);
  
    const handlePrev = () => {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };
  
    const handleNext = () => {
      setCurrentIndex((prev) => Math.min(prev + 1, totalPages - 1));
    };
  
    return (
      <div className="flex flex-col w-full h-full relative">
        {/* Back Button */}
        <button
          className="px-4 py-2 bg-gray-700 text-white text-sm font-semibold rounded hover:bg-gray-600 transition w-full"
          onClick={onBack}
        >
          ← Back to Levels
        </button>
  
        {/* Topic List */}
        <div className="flex flex-col flex-1 overflow-y-auto p-2">
          {topics[levelId]
            ?.slice(
              currentIndex * itemsPerPage,
              (currentIndex + 1) * itemsPerPage,
            )
            .map((topic, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition"
              >
                <FaFileAlt className="text-gray-400 text-lg" /> {/* File Icon */}
                <span className="text-white text-md font-medium">{topic}</span>
              </div>
            ))}
        </div>
  
        {/* Navigation Buttons */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
          <button
            onClick={handlePrev}
            className="bg-gray-700 text-white px-4 py-2 rounded-l-lg disabled:opacity-50"
            disabled={currentIndex === 0}
          >
            Prev
          </button>
          <span className="text-white text-md font-semibold">
            {currentIndex + 1} / {totalPages}
          </span>
          <button
            onClick={handleNext}
            className="bg-gray-700 text-white px-4 py-2 rounded-r-lg disabled:opacity-50"
            disabled={currentIndex === totalPages - 1}
          >
            Next
          </button>
        </div>
      </div>
    );
  };
  
  export default Topics;