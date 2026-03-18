"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function AsteroidBelt({ innerRadius, outerRadius, count }) {
  const ref = useRef();
  const { speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2, r = innerRadius + Math.random() * (outerRadius - innerRadius);
      positions[i*3]   = Math.cos(a) * r;
      positions[i*3+1] = (Math.random() - 0.5) * 0.8;
      positions[i*3+2] = Math.sin(a) * r;
      speeds[i] = 0.00012 + Math.random() * 0.00012;
    }
    if (ref.current) ref.current.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { positions, speeds };
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2, r = innerRadius + Math.random() * (outerRadius - innerRadius);
      pos[i*3] = Math.cos(a)*r; pos[i*3+1] = (Math.random()-0.5)*0.8; pos[i*3+2] = Math.sin(a)*r;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count, innerRadius, outerRadius]);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      const angle = Math.atan2(z, x) + speeds[i];
      const r = Math.sqrt(x*x + z*z);
      pos.setX(i, Math.cos(angle)*r); pos.setZ(i, Math.sin(angle)*r);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#909090" size={0.1} sizeAttenuation transparent opacity={0.5} />
    </points>
  );
}
