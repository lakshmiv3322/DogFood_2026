"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HeroFallback } from "./HeroFallback";

function isWebGLAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

// Procedural glass faceted shards
function ShardsField({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null);

  // Deterministic procedural shards data (no random per-render)
  const shards = useMemo(() => {
    const items = [];
    const count = 24;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.2 + ((i * 37) % 17) * 0.15;
      const x = Math.cos(angle) * radius;
      const y = ((i * 23) % 19) * 0.18 - 1.6;
      const z = Math.sin(angle) * (radius * 0.6) - 1.0;
      const scale = 0.22 + ((i * 13) % 11) * 0.035;
      const rotSpeedX = 0.002 + ((i * 7) % 5) * 0.001;
      const rotSpeedY = 0.003 + ((i * 11) % 7) * 0.001;
      const isTeal = i % 3 === 0;

      items.push({
        id: i,
        pos: [x, y, z] as [number, number, number],
        scale,
        rotSpeedX,
        rotSpeedY,
        isTeal,
      });
    }
    return items;
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Slow continuous global rotation
      groupRef.current.rotation.y += delta * 0.06;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }

    // Camera subtle parallax drift (max ~5.7° / 0.1 rad, damped)
    const targetX = pointer.current.x * 0.55;
    const targetY = pointer.current.y * 0.35;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.04);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
      {shards.map((s) => (
        <Shard key={s.id} {...s} />
      ))}
    </group>
  );
}

function Shard({
  pos,
  scale,
  rotSpeedX,
  rotSpeedY,
  isTeal,
}: {
  pos: [number, number, number];
  scale: number;
  rotSpeedX: number;
  rotSpeedY: number;
  isTeal: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotSpeedX;
      meshRef.current.rotation.y += rotSpeedY;
    }
  });

  return (
    <mesh ref={meshRef} position={pos} scale={scale}>
      <icosahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial
        color={isTeal ? "#00e5d0" : "#233058"}
        roughness={0.15}
        metalness={0.1}
        transmission={0.8}
        ior={1.4}
        thickness={0.8}
        wireframe={false}
        transparent
        opacity={isTeal ? 0.75 : 0.6}
      />
    </mesh>
  );
}

// Background mesh with low-cost procedural vertex wave
function FlowMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#0a0e1c") },
      uColorB: { value: new THREE.Color("#00e5d0") },
      uColorC: { value: new THREE.Color("#161f3d") },
    }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.uTime.value = state.clock.elapsedTime * 0.35;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -4]} rotation={[-Math.PI / 4, 0, 0]}>
      <planeGeometry args={[16, 12, 32, 24]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          varying vec2 vUv;
          varying float vElevation;

          void main() {
            vUv = uv;
            vec3 pos = position;
            float wave1 = sin(pos.x * 0.7 + uTime) * cos(pos.y * 0.6 + uTime * 0.8) * 0.45;
            float wave2 = sin(pos.y * 1.2 - uTime * 0.5) * 0.25;
            pos.z += wave1 + wave2;
            vElevation = pos.z;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform vec3 uColorC;
          varying vec2 vUv;
          varying float vElevation;

          void main() {
            float depthMix = smoothstep(-0.5, 0.6, vElevation);
            vec3 col = mix(uColorA, uColorC, vUv.y);
            col = mix(col, uColorB, depthMix * 0.22);
            gl_FragColor = vec4(col, 0.45);
          }
        `}
      />
    </mesh>
  );
}

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canRender3D, setCanRender3D] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Check WebGL availability
    const webglOk = isWebGLAvailable();

    if (!prefersReducedMotion && webglOk) {
      setCanRender3D(true);
    }

    // Pause when off-screen via IntersectionObserver
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Pause when tab is hidden
    const handleVisibilityChange = () => {
      setIsTabHidden(document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Pointer move listener for subtle parallax
    const handlePointerMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerRef.current = { x, y };
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* CSS Gradient poster fallback is always behind to avoid any layout shift */}
      <HeroFallback />

      {/* 3D Canvas only if WebGL available, not reduced motion */}
      {canRender3D && (
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 45 }}
          dpr={[1, 2]} // capped devicePixelRatio at 2
          frameloop={isVisible && !isTabHidden ? "always" : "never"}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          className="absolute inset-0 z-0"
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 6, 4]} intensity={1.2} color="#ffffff" />
          <pointLight position={[-4, -3, 2]} intensity={1.5} color="#00e5d0" />
          <pointLight position={[3, -2, -1]} intensity={0.8} color="#ff3d6e" />

          <FlowMesh />
          <ShardsField pointer={pointerRef} />
        </Canvas>
      )}

      {/* Gradient scrim overlay for guaranteed readability (contrast >= 4.5:1) */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(var(--bg-1), 0.72) 0%, rgba(var(--bg-1), 0.65) 45%, rgba(var(--bg-1), 0.94) 100%)",
        }}
      />
    </div>
  );
}
