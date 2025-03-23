// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { Canvas, useThree } from "@react-three/fiber";
// import { OrbitControls, TransformControls, Plane } from "@react-three/drei";
// import * as THREE from "three";

// // Define Object Types
// type ShapeType = "box" | "sphere" | "cylinder";

// interface ObjectProps {
//   id: number;
//   shapeType: ShapeType;
//   position: [number, number, number];
// }

// interface ShapeProps extends ObjectProps {
//   onSelect: (id: number) => void;
//   isSelected: boolean;
// }

// // Shape Component
// const Shape: React.FC<ShapeProps> = ({
//   id,
//   shapeType,
//   position,
//   onSelect,
//   isSelected,
// }) => {
//   const ref = useRef<THREE.Mesh>(null);

//   useEffect(() => {
//     if (isSelected && ref.current) {
//       (window as any).selectedMesh = ref.current;
//     }
//   }, [isSelected]);

//   return (
//     <mesh
//       ref={ref}
//       position={position}
//       onClick={(e) => {
//         e.stopPropagation();
//         onSelect(id);
//       }}
//     >
//       {shapeType === "box" && <boxGeometry />}
//       {shapeType === "sphere" && <sphereGeometry args={[0.5, 32, 32]} />}
//       {shapeType === "cylinder" && (
//         <cylinderGeometry args={[0.5, 0.5, 1.5, 32]} />
//       )}
//       <meshStandardMaterial color={isSelected ? "yellow" : "hotpink"} />
//     </mesh>
//   );
// };

// // Scene Component
// interface SceneProps {
//   addObject: (point: THREE.Vector3) => void;
//   objects: ObjectProps[];
//   selectedObject: number | null;
//   setSelectedObject: (id: number | null) => void;
// }

// const SceneContent: React.FC<SceneProps> = ({
//   addObject,
//   objects,
//   selectedObject,
//   setSelectedObject,
// }) => {
//   const { camera, gl } = useThree();
//   const [transformRef, setTransformRef] = useState<THREE.Object3D | null>(null);

//   // Create a ref for the ground plane
//   const planeRef = useRef<THREE.Mesh>(null);

//   // Handle ground click to add an object at the clicked position
//   const handleGroundClick = (e: any) => {
//     e.stopPropagation();

//     // Raycasting to determine the position of the click
//     const raycaster = new THREE.Raycaster();
//     const mouse = new THREE.Vector2();
//     const rect = gl.domElement.getBoundingClientRect();
//     mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
//     mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

//     raycaster.setFromCamera(mouse, camera);

//     // Check if the planeRef is valid
//     if (planeRef.current) {
//       const intersects = raycaster.intersectObject(planeRef.current);

//       if (intersects.length > 0) {
//         const point = intersects[0].point;
//         addObject(point); // Add object at the click point
//         setSelectedObject(null); // Deselect after adding
//       }
//     } else {
//       console.error("Ground plane not found in the scene.");
//     }
//   };

//   useEffect(() => {
//     if (selectedObject !== null && (window as any).selectedMesh) {
//       setTransformRef((window as any).selectedMesh);
//     } else {
//       setTransformRef(null);
//     }
//   }, [selectedObject, objects]);

//   return (
//     <>
//       <ambientLight intensity={0.5} />
//       <directionalLight position={[5, 5, 5]} intensity={1} />

//       {/* Ground Plane */}
//       <Plane
//         ref={planeRef} // Set ref here
//         args={[100, 100]}
//         rotation={[-Math.PI / 2, 0, 0]}
//         position={[0, -1, 0]}
//         onClick={handleGroundClick}
//       >
//         <meshStandardMaterial color="gray" side={THREE.DoubleSide} />
//       </Plane>

//       {/* Render Shapes */}
//       {objects.map((obj) => (
//         <Shape
//           key={obj.id}
//           {...obj}
//           onSelect={setSelectedObject}
//           isSelected={selectedObject === obj.id}
//         />
//       ))}

//       <OrbitControls makeDefault />
//       {transformRef && <TransformControls object={transformRef} />}
//     </>
//   );
// };

// // Main Component
// const ThreeDCanvas: React.FC = () => {
//   const [objects, setObjects] = useState<ObjectProps[]>([]);
//   const [selectedObject, setSelectedObject] = useState<number | null>(null);
//   const [shape, setShape] = useState<ShapeType>("box");

//   // Add object at a specific point
//   const addObject = (point: THREE.Vector3) => {
//     const newId = objects.length;
//     setObjects([
//       ...objects,
//       { id: newId, shapeType: shape, position: [point.x, point.y, point.z] },
//     ]);
//     setSelectedObject(newId); // Select the object after adding
//   };

//   return (
//     <div className="w-full h-screen bg-black relative">
//       <Canvas camera={{ position: [5, 5, 5], fov: 75 }}>
//         <SceneContent
//           addObject={addObject}
//           objects={objects}
//           selectedObject={selectedObject}
//           setSelectedObject={setSelectedObject}
//         />
//       </Canvas>

//       {/* Shape Selector */}
//       <div className="absolute top-5 left-5 bg-gray-800 p-2 rounded-lg flex space-x-2">
//         {["box", "sphere", "cylinder"].map((type) => (
//           <button
//             key={type}
//             onClick={() => setShape(type as ShapeType)}
//             className={`text-white px-2 py-1 rounded ${shape === type ? "bg-blue-500" : "bg-gray-600"} cursor-pointer`}
//           >
//             {type.charAt(0).toUpperCase() + type.slice(1)}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ThreeDCanvas;
