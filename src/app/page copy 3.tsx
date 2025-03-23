'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import Link from 'next/link';

const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-2xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <Header />
      <div className="text-center mt-10">
        <h1 className="text-4xl font-bold">Welcome to My Next.js App</h1>
        <p className="mt-4 text-lg">Explore the 3D Canvas and various topics</p>
        <Link href="/topics" className="mt-6 inline-block px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600">Go to Topics</Link>
      </div>
      <CanvasContainer />
    </div>
  );
};

const Header = () => (
  <header className="w-full p-4 bg-gray-800 text-center text-white text-lg font-semibold">
    My 3D Next.js App
  </header>
);

const CanvasContainer = () => (
  <div className="w-full h-96 mt-10">
    <Canvas>
      <OrbitControls enableZoom={false} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 5, 2]} intensity={1} />
      <Sphere visible args={[1, 64, 64]} scale={2}>
        <MeshDistortMaterial color="cyan" attach="material" distort={0.5} speed={2} />
      </Sphere>
    </Canvas>
  </div>
);

export default Home;
