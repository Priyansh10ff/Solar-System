"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Sun() {
  const coreRef  = useRef();
  const halo1Ref = useRef();
  const halo2Ref = useRef();
  const [tex, setTex] = useState(null);

  useEffect(() => {
    // Generate procedural sun texture on client only
    import("../data/PlanetTextures").then(({ getPlanetTexture }) => {
      setTex(getPlanetTexture("sun", 512));
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (coreRef.current)  coreRef.current.rotation.y = t * 0.035;
    if (halo1Ref.current) halo1Ref.current.scale.setScalar(1 + Math.sin(t * 1.4) * 0.025);
    if (halo2Ref.current) halo2Ref.current.scale.setScalar(1 + Math.sin(t * 0.9 + 1) * 0.04);
  });

  return (
    <group>
      {/* Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[4.5, 64, 64]} />
        <meshStandardMaterial
          map={tex}
          color={tex ? "#ffffff" : "#ffcc44"}
          emissive={tex ? "#ff6600" : "#ff9900"}
          emissiveMap={tex}
          emissiveIntensity={tex ? 0.7 : 2}
          roughness={1} metalness={0}
        />
      </mesh>

      {/* Halos */}
      <mesh ref={halo1Ref}>
        <sphereGeometry args={[5.6, 32, 32]} />
        <meshBasicMaterial color="#ff7700" transparent opacity={0.09} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      <mesh ref={halo2Ref}>
        <sphereGeometry args={[7.5, 32, 32]} />
        <meshBasicMaterial color="#ff5500" transparent opacity={0.045} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[11, 32, 32]} />
        <meshBasicMaterial color="#ff8800" transparent opacity={0.015} side={THREE.BackSide} depthWrite={false} />
      </mesh>
    </group>
  );
}
