"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";

const Roadmap = () => {
  return (
    <div className="bg-gray-800 min-h-screen text-white">
      <Navbar />
      <main className="p-6">
        <h1 className="text-3xl font-bold mb-4">Project Roadmap</h1>
        <p className="mb-6">Here’s what we have planned for the future:</p>

        <ul className="space-y-4">
          <li className="p-4 bg-gray-700 rounded-lg">
            ✅ Phase 1: Initial Launch
          </li>
          <li className="p-4 bg-gray-700 rounded-lg">
            🚧 Phase 2: Feature Enhancements
          </li>
          <li className="p-4 bg-gray-700 rounded-lg">
            🔜 Phase 3: Community Feedback
          </li>
        </ul>

        <div className="mt-6">
          <Link href="/" className="text-blue-400 hover:underline">
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Roadmap;
