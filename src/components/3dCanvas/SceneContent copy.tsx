"use client";

import React, { useState, useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls, TransformControls, Plane } from "@react-three/drei";
import * as THREE from "three";
import Shape from "./Shape";

// Define Object Types
export type ShapeType = "box" | "sphere" | "cylinder";

export interface ObjectProps {
  id: number;
  shapeType: ShapeType;
  position: [number, number, number];
}

// Scene Component
interface SceneProps {
  addObject: (point: THREE.Vector3) => void;
  objects: ObjectProps[];
  selectedObject: number | null;
  setSelectedObject: React.Dispatch<React.SetStateAction<number | null>>; // Specify the type for the setter
}

const SceneContent: React.FC<SceneProps> = ({
  addObject,
  objects,
  selectedObject,
  setSelectedObject,
}) => {
  const { camera, gl } = useThree();
  const [transformRef, setTransformRef] = useState<THREE.Object3D | null>(null);
  const [isInteracting, setIsInteracting] = useState(false); // Track interaction
  const planeRef = useRef<THREE.Mesh>(null);

  // Adjust the ground plane size to match pixel art units (e.g., 32x32 pixels)
  const planeSize = 8; // You can change this value to match your pixel size (e.g., 32 for 32x32)

  const handleGroundClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // If interacting with a selected object, deselect it
    if (isInteracting && selectedObject !== null) {
      setSelectedObject(null); // Deselect the selected object when clicking on the ground
      setIsInteracting(false); // Reset the interaction state after deselecting
      return;
    }

    // Allow adding objects only when not interacting with any selected object
    if (isInteracting) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const rect = gl.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    if (planeRef.current) {
      const intersects = raycaster.intersectObject(planeRef.current);
      if (intersects.length > 0) {
        const point = intersects[0].point;
        addObject(point);
        setSelectedObject(null); // Deselect any object after adding
      }
    }
  };

  const handlePointerDown = () => {
    if (selectedObject !== null) {
      // Interaction with the selected object only
      setIsInteracting(true); // Interaction started
    }
  };

  const handlePointerUp = () => {
    setIsInteracting(false); // Interaction ended
  };

  useEffect(() => {
    if (selectedObject !== null && window.selectedMesh) {
      setTransformRef(window.selectedMesh); // Set the transform reference
    } else {
      setTransformRef(null); // Clear the transform reference if no object is selected
    }
  }, [selectedObject, objects]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Plane
        ref={planeRef}
        args={[planeSize, planeSize]} // Plane size set to match pixel art resolution
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1, 0]}
        onClick={handleGroundClick}
        onPointerDown={handlePointerDown} // Track when the user starts interaction
        onPointerUp={handlePointerUp} // Track when the user ends interaction
      >
        <meshStandardMaterial color="gray" side={THREE.DoubleSide} />
      </Plane>

      {objects.map((obj) => (
        <Shape
          key={obj.id}
          {...obj}
          onSelect={(id) => {
            // Toggle selection by checking if the clicked object is already selected
            setSelectedObject((prevSelected) =>
              prevSelected === id ? null : id,
            );
          }}
          isSelected={selectedObject === obj.id}
        />
      ))}

      <OrbitControls makeDefault />
      {transformRef && <TransformControls object={transformRef} />}
    </>
  );
};

export default SceneContent;
