"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function WireIcosahedron() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    const m = meshRef.current;
    if (!m) return;
    m.rotation.x += delta * 0.06;
    m.rotation.y += delta * 0.1;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.15, 0]} />
        <meshBasicMaterial
          color="#2dd4bf"
          wireframe
          transparent
          opacity={0.32}
        />
      </mesh>
    </Float>
  );
}

export function HeroCanvas() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-[1] opacity-90">
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        dpr={[1, 1.75]}
      >
        <ambientLight intensity={0.6} />
        <WireIcosahedron />
      </Canvas>
    </div>
  );
}
