"use client";

import { useEffect, useState } from "react";
import Scene from "@/components/Scene";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/");
        if (!response.ok) throw new Error("Failed to fetch");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-screen h-screen">
      <Navbar />
      <Scene />
      <div className="p-4 bg-">
        <h1 className="text-2xl font-bold">Fetched Data:</h1>
        <pre className="bg-gray-200 p-4 rounded text-black">
          {data ? JSON.stringify(data, null, 2) : "Loading..."}
        </pre>
      </div>
    </div>
  );
}
