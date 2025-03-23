"use client";

import { Sphere, MeshDistortMaterial } from "@react-three/drei";

const SphereObject = () => {
  return (
    <Sphere args={[1, 64, 64]} position={[0, 0, 0]}>
      <MeshDistortMaterial color="blue" distort={0.5} speed={2} />
    </Sphere>
  );
};

export default SphereObject;
