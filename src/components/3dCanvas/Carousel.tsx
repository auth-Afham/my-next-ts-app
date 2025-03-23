"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

// Carousel Component
const Carousel: React.FC<{
  items: { id: number; image: string; title: string }[];
  onSelectLevel: (levelId: number) => void; // New prop to handle level selection
}> = ({ items, onSelectLevel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1,
    );
  };

  return (
    <div className="dark flex flex-col items-center w-full h-full">
      <div className="absolute bottom-0 ">
        {/* Carousel Item */}
        <div className="w-full flex items-center justify-center">
          {items.length > 0 && (
            <div
              className="relative w-48 h-48 cursor-pointer"
              onClick={() => onSelectLevel(items[currentIndex]?.id)} // Safe check with ?
            >
              <Image
                src={items[currentIndex]?.image || "/fallback-image.jpg"}
                alt={`Item ${currentIndex + 1}`}
                width={500}
                height={500}
              />
            </div>
          )}
        </div>

        {/* Centered Text */}
        <div className="flex flex-col items-center justify-center mt-10 w-full bg-opacity-50 text-white text-center py-2">
          <p className="text-lg font-semibold">Select Your Level</p>
          <p className="text-sm italic">
            {items[currentIndex]?.title || "Loading..."}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center items-center my-10">
          <button
            onClick={handlePrev}
            className="bg-gray-700 text-white px-4 py-2 rounded-l-lg"
          >
            Prev
          </button>
          <button
            onClick={handleNext}
            className="bg-gray-700 text-white px-4 py-2 rounded-r-lg"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
