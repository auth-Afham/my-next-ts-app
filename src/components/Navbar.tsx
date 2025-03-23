"use client";

import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="p-4 bg-gray-900 text-white flex gap-4">
      <Link href="/" className="hover:text-blue-400">Home</Link>
      <Link href="/about" className="hover:text-blue-400">About</Link>
      <Link href="/contact" className="hover:text-blue-400">Contact</Link>
      <Link href="/roadmap" className="hover:text-blue-400">Roadmap</Link>
    </nav>
  );
};

export default Navbar;
