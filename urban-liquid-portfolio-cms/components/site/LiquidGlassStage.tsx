"use client";

import { Environment, Float } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float wave = sin((pos.x * 2.4) + uTime * 0.7) * 0.08;
    pos.z += wave + cos((pos.y * 2.0) + uTime * 0.55) * 0.06;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    vec2 mouse = uMouse * 0.22;
    float ripple = sin(distance(uv, vec2(0.5) + mouse) * 38.0 - uTime * 2.2);
    float grain = noise(uv * 280.0 + uTime);
    vec3 chrome = mix(vec3(0.02, 0.03, 0.04), vec3(0.72, 0.88, 0.94), uv.y);
    vec3 cyan = vec3(0.0, 0.91, 1.0);
    vec3 acid = vec3(0.70, 1.0, 0.24);
    vec3 signal = vec3(1.0, 0.18, 0.33);
    vec3 color = chrome + cyan * max(ripple, 0.0) * 0.18 + acid * smoothstep(0.74, 1.0, uv.x) * 0.14;
    color += signal * smoothstep(0.0, 0.22, uv.x) * smoothstep(0.25, 0.0, uv.y) * 0.16;
    color += grain * 0.05;
    float alpha = 0.58 + ripple * 0.08;
    gl_FragColor = vec4(color, alpha);
  }
`;

function LiquidPlane() {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) }
    }),
    []
  );

  useFrame(({ clock, pointer }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    materialRef.current.uniforms.uMouse.value.set(pointer.x, pointer.y);
  });

  return (
    <mesh rotation={[-0.28, 0, 0]} position={[0, 0, -0.7]}>
      <planeGeometry args={[8.2, 5.2, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

function ChromeForms() {
  const groupRef = useRef<THREE.Group | null>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.28) * 0.32;
    groupRef.current.rotation.x = Math.cos(clock.elapsedTime * 0.21) * 0.12;
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.45} floatIntensity={0.6}>
        <mesh position={[-1.8, 0.8, 0.5]}>
          <torusKnotGeometry args={[0.48, 0.15, 160, 18]} />
          <meshPhysicalMaterial
            color="#d9e2eb"
            roughness={0.18}
            metalness={0.8}
            transmission={0.3}
            thickness={0.6}
          />
        </mesh>
      </Float>
      <Float speed={1.1} rotationIntensity={0.35} floatIntensity={0.45}>
        <mesh position={[2.15, -0.55, 0.25]}>
          <icosahedronGeometry args={[0.68, 3]} />
          <meshPhysicalMaterial color="#101419" roughness={0.26} metalness={0.65} />
        </mesh>
      </Float>
    </group>
  );
}

export function LiquidGlassStage() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5.2], fov: 45 }} dpr={[1, 1.6]}>
        <color attach="background" args={["#090a0c"]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 3, 4]} intensity={2.4} color="#8ff7ff" />
        <pointLight position={[-2.5, 1.8, 2]} intensity={7} color="#ff2f55" />
        <LiquidPlane />
        <ChromeForms />
        <Environment preset="night" />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent,rgba(9,10,12,0.72)_72%)]" />
    </div>
  );
}

