"use client";

import { useEffect, useState } from "react";
import Scene from "@/components/home/Scene";
import Navbar from "@/components/Navbar";

type DataType = {
  message: string; // Fallback message
} | null; // Allow null if no data

export default function Home() {
  const [data, setData] = useState<DataType>(null);
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000/" ||
    "https://jsonplaceholder.typicode.com/todos/1"; // Fake API

  useEffect(() => {
    const fetchData = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5 sec timeout

        const response = await fetch(`${API_URL}`, {
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!response.ok) throw new Error("Failed to fetch");

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);

        // Dummy fallback response
        setData({
          message: "Using fallback data since the backend is unavailable.",
        });
      }
    };

    fetchData();
  }, []);

  const renderData = () => {
    if (!data) return <p>Loading...</p>;
    if (data.message) return <p className="text-red-500">{data.message}</p>;

    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  };

  return (
    <div className="w-screen h-screen bg-white overflow-hidden flex flex-col">
      {/* Navbar - Fixed at the Top */}
      <div className="w-full fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Main Content - Fills Remaining Space */}
      <div className="flex flex-row w-full h-full pt-[60px]">
        {/* Scene on the left, Fetched Data on the right */}
        <div className="w-1/2 h-full flex items-center justify-center">
          <Scene />
        </div>
        <div className="w-1/2 h-full flex items-center justify-center bg-gray-100">
          <div className="p-4 rounded text-black w-3/4">
            <h1 className="text-center text-2xl font-bold">Fetched Data:</h1>
            <div className="bg-gray-200 p-4 rounded text-black text-sm w-full h-48 overflow-hidden">
              {renderData()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
