"use client";

import Navbar from "@/components/Navbar";

export default function Contact() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100">
      <Navbar />
      <h1 className="text-4xl font-bold text-gray-800">Contact Us</h1>
      <p className="text-lg text-gray-600 mt-2">Email: contact@3dexperience.com</p>
      <p className="text-lg text-gray-600">Phone: +1 234 567 890</p>
    </div>
  );
}
