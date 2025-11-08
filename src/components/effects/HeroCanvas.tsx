"use client";
import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Points, PointMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

function Particles() {
  const positions = useMemo(() => {
    const num = 1500;
    const arr = new Float32Array(num * 3);
    for (let i = 0; i < num; i++) {
      const i3 = i * 3;
      arr[i3 + 0] = (Math.random() - 0.5) * 10;
      arr[i3 + 1] = (Math.random() - 0.5) * 6;
      arr[i3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);
  return (
    <Points positions={positions} stride={3} frustumCulled>
      <PointMaterial size={0.02} sizeAttenuation color="#67e8f9" transparent opacity={0.9} />
    </Points>
  );
}

export default function HeroCanvas({ isDark }: { isDark: boolean }) {
  return (
    <div className="absolute inset-0 -z-10" aria-hidden>
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }} dpr={[1, 2]}>        
        <color attach="background" args={[isDark ? '#0b0f19' : '#f8fafc']} />
        <ambientLight intensity={0.2} />
        <Particles />
        <EffectComposer>
          <Bloom intensity={0.6} luminanceThreshold={0.1} luminanceSmoothing={0.3} mipmapBlur />
        </EffectComposer>
        {/* Controls disabled by default; enable for dev: */}
        {/* <OrbitControls enableZoom={false} /> */}
      </Canvas>
    </div>
  );
}


