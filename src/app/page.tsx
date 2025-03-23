"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  FaComments,
  FaCog,
  FaHome,
  FaTimes,
  FaCube,
  FaSearch,
  FaInfoCircle,
  FaCrosshairs,
  FaThumbsUp,
  FaHeart,
  FaFire,
  FaUsers,
} from "react-icons/fa";

import SceneContent, {
  ShapeType,
  ObjectProps,
} from "../components/3dCanvas/SceneContent";
import Carousel from "../components/3dCanvas/Carousel";
import Topics from "../components/3dCanvas/Topics";

declare global {
  interface Window {
    selectedMesh?: THREE.Mesh;
  }
}

const ThreeDCanvas: React.FC = () => {
  const [objects, setObjects] = useState<ObjectProps[]>([]);
  const [selectedObject, setSelectedObject] = useState<number | null>(null);
  const [shape, setShape] = useState<ShapeType>("box");
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [reactions, setReactions] = useState({
    like: 10,
    love: 5,
    fire: 3,
  });
  const [viewers, setViewers] = useState(0); // Initialize with 0

  // Define static carousel items with fixed titles
  const [carouselItems, setCarouselItems] = useState<
    { id: number; image: string; title: string }[]
  >([]);

  useEffect(() => {
    setCarouselItems([
      { id: 1, image: "/static-image-1.jpg", title: "Beginner-Level" },
      { id: 2, image: "/static-image-2.jpg", title: "Intermediate-Level" },
      { id: 3, image: "/static-image-3.jpg", title: "Advanced-Level" },
      { id: 4, image: "/static-image-4.jpg", title: "Expert-Level" },
    ]);
  }, []);

  useEffect(() => {
    setViewers(Math.floor(Math.random() * 100) + 1);
  }, []); // Runs only on the client

  const addObject = (point: THREE.Vector3) => {
    const newId = objects.length;
    setObjects([
      ...objects,
      { id: newId, shapeType: shape, position: [point.x, point.y, point.z] },
    ]);
    setSelectedObject(newId);
  };

  return (
    <div className="dark flex w-full h-screen overflow-hidden text-gray-100 relative">
      {/* 3D Canvas */}
      <div className="h-full" style={{ width: "100%" }}>
        <Canvas camera={{ position: [5, 5, 5], fov: 75 }} style={{ zIndex: 0 }}>
          <SceneContent
            addObject={addObject}
            objects={objects}
            selectedObject={selectedObject}
            setSelectedObject={setSelectedObject}
          />
        </Canvas>
      </div>

      {/* Left Side Overlay - Title */}
      <div
        className="absolute top-5 left-5 bg-gray-800 px-4 py-2 rounded-lg flex items-center space-x-3"
        style={{ zIndex: 10 }}
      >
        <FaCube className="text-white text-2xl" />
        <h2 className="text-lg font-semibold">3D Model Viewer</h2>
      </div>

      {/* Right Sidebar Overlay */}
      <div
        className="absolute top-0 right-0 h-5/6 my-10 mb-20 rounded-l-xl  flex flex-col"
        style={{
          width: "33.33%",
          boxSizing: "border-box",
          zIndex: 10, // Ensure the sidebar is above the canvas
        }}
      >
        <header className="bg-gray-800 p-4 rounded-tl-xl flex items-center justify-between">
          <div></div>
          <button className="text-white text-lg cursor-pointer">
            <FaTimes />
          </button>
        </header>

        <div className="flex w-full h-full bg-gray-900 rounded-bl-xl">
          {/* Conditional rendering for Carousel or Topics */}
          <div className="flex w-full h-full">
            {selectedLevel === null ? (
              <Carousel
                items={carouselItems}
                onSelectLevel={(levelId) => setSelectedLevel(levelId)}
              />
            ) : (
              <Topics
                levelId={selectedLevel}
                onBack={() => setSelectedLevel(null)}
              />
            )}
          </div>

          {/* Decorative Circles Below */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex gap-4">
            <Link href="/contact" passHref>
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                <FaComments className="text-white text-md" />
              </div>
            </Link>
            <Link href="/home" passHref>
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer">
                <FaHome className="text-white text-lg" />
              </div>
            </Link>
            <Link href="/about" passHref>
              <div className="w-9 h-9 bg-gray-500 rounded-full flex items-center justify-center">
                <FaCog className="text-white text-md" />
              </div>
            </Link>
          </div>
        </div>
      </div>
      {/* 🔍 Search Engine with Reactions */}
      <div
        className="absolute bottom-4 flex items-center space-x-4"
        style={{ zIndex: 20 }}
      >
        <div className="bg-gray-800 p-3 rounded-r-lg flex items-center space-x-2 shadow-lg w-max">
          {/* Search Icon */}
          <FaSearch className="text-gray-400" />

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => {
              const newShape = e.target.value as ShapeType;
              if (["box", "sphere", "cylinder"].includes(newShape)) {
                setShape(newShape);
              }
            }}
            className="bg-transparent outline-none text-white placeholder-gray-500 flex-1 w-100"
          />

          {/* Info Button */}
          <button className="text-white hover:text-gray-400">
            <FaInfoCircle />
          </button>

          {/* Center Button */}
          <button className="text-white hover:text-gray-400">
            <FaCrosshairs />
          </button>
        </div>

        {/* Reaction Counter */}
        <div className="flex items-center space-x-3 bg-gray-700 p-2 rounded-lg shadow-md">
          <div
            className="flex items-center space-x-1 cursor-pointer"
            onClick={() =>
              setReactions((prev) => ({ ...prev, like: prev.like + 1 }))
            }
          >
            <FaThumbsUp className="text-blue-400" />
            <span className="text-white">{reactions.like}</span>
          </div>
          <div
            className="flex items-center space-x-1 cursor-pointer"
            onClick={() =>
              setReactions((prev) => ({ ...prev, love: prev.love + 1 }))
            }
          >
            <FaHeart className="text-red-400" />
            <span className="text-white">{reactions.love}</span>
          </div>
          <div
            className="flex items-center space-x-1 cursor-pointer"
            onClick={() =>
              setReactions((prev) => ({ ...prev, fire: prev.fire + 1 }))
            }
          >
            <FaFire className="text-orange-400" />
            <span className="text-white">{reactions.fire}</span>
          </div>
        </div>

        {/* Live Viewers Info */}
        <div
          className=" top-5 right-5 flex items-center bg-gray-700 px-4 py-2 rounded-lg text-white"
          style={{ zIndex: 20 }}
        >
          <FaUsers className="text-green-400 mr-2" />
          <span>{viewers} Live Viewers</span>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div
        className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex gap-4"
        style={{ zIndex: 20 }}
      >
        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
          <FaComments className="text-white text-md" />
        </div>
        <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer">
          <FaHome className="text-white text-lg" />
        </div>
        <div className="w-9 h-9 bg-gray-500 rounded-full flex items-center justify-center">
          <FaCog className="text-white text-md" />
        </div>
      </div>
    </div>
  );
};

export default ThreeDCanvas;
