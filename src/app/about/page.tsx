"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function About() {
  return (
    <div className="w-screen h-screen bg-white overflow-hidden flex flex-col items-center justify-center">
      {/* Navbar - Fixed at the Top */}
      <div className="w-full fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Centered Content (Adjusted for No Scroll) */}
      <div className="flex flex-col items-center justify-center w-full h-full pt-[80px] px-6">
        {/* Profile or Platform Logo */}
        <Image
          src="/profile.jpg"
          alt="Your Profile"
          width={150}
          height={150}
          className="rounded-full shadow-lg mb-4"
        />

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-900">
          About Me & This Platform
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-700 mt-2 max-w-lg text-center">
          Hi, I'm <span className="font-semibold">[Your Name]</span>, a
          passionate
          <span className="text-blue-600 font-medium">
            {" "}
            developer and innovator in 3D web technologies
          </span>
          . I built this platform to{" "}
          <span className="font-semibold">
            redefine the way we search and explore the digital world
          </span>
          .
        </p>

        <p className="text-lg text-gray-700 mt-4 max-w-lg text-center">
          Welcome to <span className="font-semibold">[Platform Name]</span>, a
          next-gen
          <span className="text-blue-600 font-medium">
            {" "}
            3D sandbox search engine
          </span>
          . Unlike traditional search engines, this platform lets you
          <span className="font-semibold">
            {" "}
            discover, interact, and experience content in a fully immersive 3D
            space
          </span>
          . My goal is to create an{" "}
          <span className="text-blue-600 font-medium">
            intuitive and dynamic way for users to navigate the web
          </span>
          , making information not just searchable, but truly{" "}
          <span className="font-semibold">explorable</span>.
        </p>
      </div>
    </div>
  );
}
