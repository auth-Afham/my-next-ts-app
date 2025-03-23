<!doctype html>
<html lang="en">
  <head>
    <script src="https://unpkg.com/react-scan/dist/auto.global.js"></script>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ThreeDCanvas from "./pages/3DCanvas";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/3d" element={<ThreeDCanvas />} />
      </Routes>
    </Router>
  );
};

export default App;

import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

const Home: React.FC = () => {
  return (
    <div className="p-4">
      <Header />
      <p className="text-lg font-semibold mt-4">Welcome to Quantum Learning!</p>
      <Link to="/3d">
        <button className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
          Go to 3D Scene
        </button>
      </Link>
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  FaComments,
  FaCog,
  FaHome,
  FaFileAlt,
  FaThumbsUp,
  FaHeart,
  FaFire,
  FaUsers,
  FaTimes,
  FaCube,
  FaSearch,
  FaInfoCircle,
  FaCrosshairs,
} from "react-icons/fa";
import { faker } from "@faker-js/faker"; // Import faker

// Box component using THREE
const Shape: React.FC<{ shapeType: string }> = ({ shapeType }) => {
  const { scene } = useThree();
  const meshRef = React.useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    let geometry: THREE.BufferGeometry | null = null; // Explicitly declare type

    if (shapeType.toLowerCase() === "sphere") {
      geometry = new THREE.SphereGeometry(0.7, 32, 32);
    } else if (shapeType.toLowerCase() === "box") {
      geometry = new THREE.BoxGeometry(1, 1, 1);
    } else if (shapeType.toLowerCase() === "cylinder") {
      geometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32);
    }

    if (!geometry) return; // Guard clause to prevent null usage

    const material = new THREE.MeshStandardMaterial({ color: "hotpink" });
    const mesh = new THREE.Mesh(geometry, material);
    meshRef.current = mesh;
    scene.add(mesh);

    return () => {
      scene.remove(mesh);
      geometry?.dispose(); // Use optional chaining to avoid errors
      material.dispose();
    };
  }, [scene, shapeType]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return null;
};

const Lights: React.FC = () => {
  const { scene } = useThree();

  useEffect(() => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    return () => {
      scene.remove(ambientLight);
      scene.remove(directionalLight);
    };
  }, [scene]);

  return null;
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
          <div
            className="relative w-48 h-48 cursor-pointer"
            onClick={() => onSelectLevel(items[currentIndex].id)} // Select level
          >
            <img
              src={items[currentIndex].image}
              alt={`Item ${currentIndex + 1}`}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Centered Text */}
        <div className="flex flex-col items-center justify-center mt-10 w-full bg-opacity-50 text-white text-center py-2">
          <p className="text-lg font-semibold">Select Your Level</p>
          <p className="text-sm italic">{items[currentIndex].title}</p>
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
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  // const [searchQuery, setSearchQuery] = useState(""); // Search state
  const [reactions, setReactions] = useState({
    like: 10,
    love: 5,
    fire: 3,
  });
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 100) + 1);
  const [modelTitle] = useState("3D Rotating Cube");
  const [shape, setShape] = useState("box"); // Default to cube

  // Define static carousel items with fixed titles
  const carouselItems = [
    {
      id: 1,
      image: faker.image.url({ width: 150, height: 150 }),
      title: "Beginner-Level",
    },
    {
      id: 2,
      image: faker.image.url({ width: 150, height: 150 }),
      title: "Intermediate-Level",
    },
    {
      id: 3,
      image: faker.image.url({ width: 150, height: 150 }),
      title: "Advanced-Level",
    },
    {
      id: 4,
      image: faker.image.url({ width: 150, height: 150 }),
      title: "Expert-Level",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers((prev) => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dark flex w-full h-screen overflow-hidden bg-black text-gray-100 relative">
      {/* Left section for the 3D Canvas */}
      <div className="h-full" style={{ width: "calc(100% - 33.33%)" }}>
        <Canvas gl={{ antialias: true }} style={{ backgroundColor: "black" }}>
          <Lights />
          <Shape shapeType={shape} />
        </Canvas>
        <div className="absolute top-5 left-5 bg-gray-800 px-4 py-2 rounded-lg flex items-center space-x-3">
          {/* Logo Icon */}
          <FaCube className="text-white text-2xl" />
          {/* <img src="https://via.placeholder.com/40" alt="Logo" className="w-10 h-10" /> */}
          {/* 3D Model Title */}
          <h2 className="text-lg font-semibold">{modelTitle}</h2>
        </div>
      </div>

      {/* Right section for text, assets, and content */}
      <div
        className="my-10 mb-20 rounded-l-xl bg-gray-900 flex flex-col relative"
        style={{ width: "33.33%", boxSizing: "border-box" }}
      >
        {/* Header */}
        <header className="bg-gray-800 p-4 rounded-tl-xl flex items-center justify-between">
          <div></div> {/* Empty div to balance flex space */}
          <button className="text-white text-lg cursor-pointer">
            <FaTimes />
          </button>
        </header>

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
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            <FaComments className="text-white text-md" />
          </div>
          <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
            <FaHome className="text-white text-lg" />
          </div>
          <div className="w-9 h-9 bg-gray-500 rounded-full flex items-center justify-center">
            <FaCog className="text-white text-md" />
          </div>
        </div>
      </div>

      {/* 🔍 Search Engine with Reactions */}
      <div className="absolute bottom-4 flex items-center space-x-4">
        <div className="bg-gray-800 p-3 rounded-r-lg flex items-center space-x-2 shadow-lg w-max">
          {/* Search Icon */}
          <FaSearch className="text-gray-400" />

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search..."
            // value={searchQuery}
            onChange={(e) => setShape(e.target.value)}
            // onChange={(e) => setSearchQuery(e.target.value)}
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
        <div className=" top-5 right-5 flex items-center bg-gray-700 px-4 py-2 rounded-lg text-white">
          <FaUsers className="text-green-400 mr-2" />
          <span>{viewers} Live Viewers</span>
        </div>
      </div>
    </div>
  );
};

export default ThreeDCanvas;

import React from "react";

const Header: React.FC = () => {
  return (
    <header>
      <h1>Quantum Learning</h1>
    </header>
  );
};

export default Header;

GitHub\afham.irfan.aiman@gmail.com\Public\Quantum-Mechanics\my-next-ts-app
GitHub\afham.irfan.aiman@gmail.com\Public\Quantum-Mechanics\my-next-ts-app\.next
GitHub\afham.irfan.aiman@gmail.com\Public\Quantum-Mechanics\my-next-ts-app\node_modules
GitHub\afham.irfan.aiman@gmail.com\Public\Quantum-Mechanics\my-next-ts-app\public
GitHub\afham.irfan.aiman@gmail.com\Public\Quantum-Mechanics\my-next-ts-app\public\file.svg
GitHub\afham.irfan.aiman@gmail.com\Public\Quantum-Mechanics\my-next-ts-app\public\globe.svg
GitHub\afham.irfan.aiman@gmail.com\Public\Quantum-Mechanics\my-next-ts-app\public\next.svg
GitHub\afham.irfan.aiman@gmail.com\Public\Quantum-Mechanics\my-next-ts-app\public\vercel.svg
GitHub\afham.irfan.aiman@gmail.com\Public\Quantum-Mechanics\my-next-ts-app\public\window.svg
GitHub\afham.irfan.aiman@gmail.com\Public\Quantum-Mechanics\my-next-ts-app\src
GitHub\afham.irfan.aiman@gmail.com\Public\Quantum-Mechanics\my-next-ts-app\src\app
GitHub\afham.irfan.aiman@gmail.com\Public\Quantum-Mechanics\my-next-ts-app\src\app\favicon.ico
GitHub\afham.irfan.aiman@gmail.com\Public\Quantum-Mechanics\my-next-ts-app\src\app\globals.css
GitHub\afham.irfan.aiman@gmail.com\Public\Quantum-Mechanics\my-next-ts-app\src\app\layout.tsx
GitHub\afham.irfan.aiman@gmail.com\Public\Quantum-Mechanics\my-next-ts-app\src\app\page copy.tsx
GitHub\afham.irfan.aiman@gmail.com\Public\Quantum-Mechanics\my-next-ts-app\src\app\page.tsx
GitHub\afham.irfan.aiman@gmail.com\Public\Quantum-Mechanics\my-next-ts-app\.gitignore
GitHub\afham.irfan.aiman@gmail.com\Public\Quantum-Mechanics\my-next-ts-app\eslint.config.mjs
GitHub\afham.irfan.aiman@gmail.com\Public\Quantum-Mechanics\my-next-ts-app\next-env.d.ts
GitHub\afham.irfan.aiman@gmail.com\Public\Quantum-Mechanics\my-next-ts-app\next.config.ts
GitHub\afham.irfan.aiman@gmail.com\Public\Quantum-Mechanics\my-next-ts-app\package-lock.json
GitHub\afham.irfan.aiman@gmail.com\Public\Quantum-Mechanics\my-next-ts-app\package.json
GitHub\afham.irfan.aiman@gmail.com\Public\Quantum-Mechanics\my-next-ts-app\postcss.config.mjs
GitHub\afham.irfan.aiman@gmail.com\Public\Quantum-Mechanics\my-next-ts-app\README.md
GitHub\afham.irfan.aiman@gmail.com\Public\Quantum-Mechanics\my-next-ts-app\tsconfig.json

// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
//           <li className="mb-2 tracking-[-.01em]">
//             Get started by editing{" "}
//             <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
//               src/app/page.tsx
//             </code>
//             .
//           </li>
//           <li className="tracking-[-.01em]">
//             Save and see your changes instantly.
//           </li>
//         </ol>

//         <div className="flex gap-4 items-center flex-col sm:flex-row">
//           <a
//             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }
