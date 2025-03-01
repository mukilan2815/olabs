import React, { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  TransformControls,
} from "@react-three/drei";
import { useDrag } from "@use-gesture/react";

// Define available components for the sidebar
const availableComponents = [
  { type: "sphere", label: "Sphere" },
  { type: "cube", label: "Cube" },
  { type: "cylinder", label: "Cylinder" },
];

// Draggable 3D object component
function DraggableObject({ type, position, onDrag, onSelect }) {
  const meshRef = useRef();

  // Handle dragging with useDrag
  const bind = useDrag(({ offset: [x, y] }) => {
    const newPosition = [x / 50, position[1], y / 50]; // Scale movement for smoothness
    onDrag(newPosition);
  });

  // Define geometry based on object type
  let geometry;
  switch (type) {
    case "sphere":
      geometry = <sphereGeometry args={[1, 32, 32]} />;
      break;
    case "cube":
      geometry = <boxGeometry args={[2, 2, 2]} />;
      break;
    case "cylinder":
      geometry = <cylinderGeometry args={[1, 1, 2, 32]} />;
      break;
    default:
      geometry = <boxGeometry args={[2, 2, 2]} />;
  }

  return (
    <mesh
      ref={meshRef}
      position={position}
      {...bind()}
      onClick={(e) => {
        e.stopPropagation(); // Prevent click from affecting other objects
        onSelect(meshRef.current);
      }}
    >
      {geometry}
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

// Main ModelBuilder component
function ModelBuilder() {
  const [objects, setObjects] = useState([]); // State for objects in the scene
  const [selectedObject, setSelectedObject] = useState(null); // State for selected object

  // Add a new object to the scene
  const addObject = (type) => {
    const newObject = { type, position: [0, 0, 0] }; // Spawn at origin
    setObjects([...objects, newObject]);
  };

  // Update object position when dragged
  const handleDrag = (index, newPosition) => {
    const updatedObjects = [...objects];
    updatedObjects[index].position = newPosition;
    setObjects(updatedObjects);
  };

  // Handle object selection for transformation
  const handleSelect = (mesh) => {
    setSelectedObject(mesh);
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* Sidebar for adding components */}
      <div
        style={{
          width: "200px",
          backgroundColor: "#f0f0f0",
          padding: "20px",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ margin: "0 0 20px 0" }}>Add Components</h3>
        {availableComponents.map((comp, index) => (
          <div
            key={index}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              marginBottom: "10px",
              cursor: "pointer",
              backgroundColor: "#fff",
              textAlign: "center",
            }}
            onClick={() => addObject(comp.type)}
          >
            {comp.label}
          </div>
        ))}
      </div>

      {/* 3D Canvas */}
      <div style={{ flex: 1 }}>
        <Canvas style={{ width: "100%", height: "100%" }}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />

          {/* Camera controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
          />

          {/* Render all draggable objects */}
          {objects.map((obj, index) => (
            <DraggableObject
              key={index}
              type={obj.type}
              position={obj.position}
              onDrag={(newPos) => handleDrag(index, newPos)}
              onSelect={handleSelect}
            />
          ))}

          {/* Transform controls for selected object */}
          {selectedObject && (
            <TransformControls object={selectedObject} mode="translate" />
          )}

          {/* Grid for reference */}
          <gridHelper args={[20, 20]} />
        </Canvas>
      </div>
    </div>
  );
}

export default ModelBuilder;
