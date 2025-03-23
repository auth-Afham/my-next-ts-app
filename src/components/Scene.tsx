"use client";

import { Canvas } from "@react-three/fiber";
import SphereObject from "./SphereObject";
import Controls from "./Controls";

const Scene = () => {
  return (
    <Canvas>
      <Controls />
      <SphereObject />
    </Canvas>
  );
};

export default Scene;
