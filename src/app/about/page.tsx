"use client";

import Navbar from "@/components/Navbar";

export default function About() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100">
      <Navbar />
      <h1 className="text-4xl font-bold text-gray-800">About Us</h1>
      <p className="text-lg text-gray-600 mt-2 max-w-lg text-center">
        We are a team passionate about 3D web development and interactive experiences.
      </p>
    </div>
  );
}
