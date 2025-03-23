"use client";

import Navbar from "@/components/Navbar";
import { FaEnvelope, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Contact() {
  return (
    <div className="w-screen h-screen bg-white overflow-hidden flex flex-col items-center justify-center">
      {/* Navbar - Fixed at the Top */}
      <div className="w-full fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Centered Contact Section */}
      <div className="flex flex-col items-center justify-center w-full h-full pt-[80px] px-6">
        <h1 className="text-4xl font-extrabold text-gray-900">Contact Me</h1>

        <p className="text-lg text-gray-700 mt-2 text-center">
          Want to reach out? Feel free to contact me formally via email or
          informally through my socials.
        </p>

        {/* Email Contact */}
        <div className="mt-4 flex items-center space-x-2">
          <FaEnvelope className="text-gray-800 text-xl" />
          <a
            href="mailto:contact@3dexperience.com"
            className="text-lg text-blue-600 font-medium hover:underline"
          >
            contact@3dexperience.com
          </a>
        </div>

        {/* Social Media Links */}
        <div className="mt-6 flex space-x-6">
          <a
            href="https://twitter.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter className="text-blue-500 text-2xl hover:scale-110 transition-transform" />
          </a>
          <a
            href="https://linkedin.com/in/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin className="text-blue-700 text-2xl hover:scale-110 transition-transform" />
          </a>
          <a
            href="https://github.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="text-gray-800 text-2xl hover:scale-110 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}
