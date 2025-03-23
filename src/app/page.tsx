"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, TransformControls, Plane } from "@react-three/drei";
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
  FaFileAlt,
} from "react-icons/fa";

// Define Object Types
type ShapeType = "box" | "sphere" | "cylinder";

interface ObjectProps {
  id: number;
  shapeType: ShapeType;
  position: [number, number, number];
}

interface ShapeProps extends ObjectProps {
  onSelect: (id: number) => void;
  isSelected: boolean;
}

// Shape Component
const Shape: React.FC<ShapeProps> = ({
  id,
  shapeType,
  position,
  onSelect,
  isSelected,
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (isSelected && ref.current) {
      (window as any).selectedMesh = ref.current;
    }
  }, [isSelected]);

  return (
    <mesh
      ref={ref}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id); // Trigger onSelect when clicked
      }}
    >
      {shapeType === "box" && <boxGeometry />}
      {shapeType === "sphere" && <sphereGeometry args={[0.5, 32, 32]} />}
      {shapeType === "cylinder" && (
        <cylinderGeometry args={[0.5, 0.5, 1.5, 32]} />
      )}
      <meshStandardMaterial color={isSelected ? "yellow" : "hotpink"} />
    </mesh>
  );
};

// Scene Component
interface SceneProps {
  addObject: (point: THREE.Vector3) => void;
  objects: ObjectProps[];
  selectedObject: number | null;
  setSelectedObject: React.Dispatch<React.SetStateAction<number | null>>;  // Specify the type for the setter
}

const SceneContent: React.FC<SceneProps> = ({
  addObject,
  objects,
  selectedObject,
  setSelectedObject,
}) => {
  const { camera, gl } = useThree();
  const [transformRef, setTransformRef] = useState<THREE.Object3D | null>(null);
  const [isInteracting, setIsInteracting] = useState(false); // Track interaction
  const planeRef = useRef<THREE.Mesh>(null);

  const handleGroundClick = (e: any) => {
    e.stopPropagation();
    console.log(isInteracting);

    // Allow adding objects only when not interacting with any selected object
    if (isInteracting) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const rect = gl.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    if (planeRef.current) {
      const intersects = raycaster.intersectObject(planeRef.current);
      if (intersects.length > 0) {
        const point = intersects[0].point;
        addObject(point);
        setSelectedObject(null); // Deselect any object after adding
      }
    }
  };

  const handlePointerDown = (e: any) => {
    if (selectedObject !== null) {
      // Interaction with the selected object only
      setIsInteracting(true); // Interaction started
    }
  };

  const handlePointerUp = () => {
    setIsInteracting(false); // Interaction ended
  };

  useEffect(() => {
    if (selectedObject !== null && (window as any).selectedMesh) {
      setTransformRef((window as any).selectedMesh);
    } else {
      setTransformRef(null);
    }
  }, [selectedObject, objects]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Plane
        ref={planeRef}
        args={[100, 100]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1, 0]}
        onClick={handleGroundClick}
        onPointerDown={handlePointerDown} // Track when the user starts interaction
        onPointerUp={handlePointerUp} // Track when the user ends interaction
      >
        <meshStandardMaterial color="gray" side={THREE.DoubleSide} />
      </Plane>

      {objects.map((obj) => (
        <Shape
          key={obj.id}
          {...obj}
          onSelect={(id) => {
            // Toggle selection by checking if the clicked object is already selected
            setSelectedObject(prevSelected => (prevSelected === id ? null : id));
          }}
          isSelected={selectedObject === obj.id}
        />
      ))}

      <OrbitControls makeDefault />
      {transformRef && <TransformControls object={transformRef} />}
    </>
  );
};

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
              <img
                src={items[currentIndex]?.image || "/fallback-image.jpg"} // Use a fallback image
                alt={`Item ${currentIndex + 1}`}
                className="w-full h-full object-contain"
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

const ThreeDCanvas: React.FC = () => {
  const [objects, setObjects] = useState<ObjectProps[]>([]);
  const [selectedObject, setSelectedObject] = useState<number | null>(null);
  const [shape, setShape] = useState<ShapeType>("box");
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  // const [searchQuery, setSearchQuery] = useState(""); // Search state
  const [reactions, setReactions] = useState({
    like: 10,
    love: 5,
    fire: 3,
  });
  const [viewers, setViewers] = useState(0); // Initialize with 0
  const [modelTitle] = useState("3D Rotating Cube");

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

        <div className="flex w-full h-full bg-gray-900 rounded-xl">
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
