"use client";

import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { ObjectProps } from "./SceneContent";

interface ShapeProps extends ObjectProps {
  onSelect: (id: number) => void;
  isSelected: boolean;
}

// Shape Component
const Shape: React.FC<ShapeProps> = ({
  id,
  shapeType,
  position,
  onSelect,
  isSelected,
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (isSelected && ref.current) {
      window.selectedMesh = ref.current; // Set the selected mesh on window
    }
  }, [isSelected]);

  return (
    <mesh
      ref={ref}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id); // Trigger onSelect when clicked
      }}
    >
      {shapeType === "box" && <boxGeometry />}
      {shapeType === "sphere" && <sphereGeometry args={[0.5, 32, 32]} />}
      {shapeType === "cylinder" && (
        <cylinderGeometry args={[0.5, 0.5, 1.5, 32]} />
      )}
      <meshStandardMaterial color={isSelected ? "yellow" : "hotpink"} />
    </mesh>
  );
};

export default Shape;
