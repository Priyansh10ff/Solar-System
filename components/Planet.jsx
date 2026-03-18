"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, Html } from "@react-three/drei";
import * as THREE from "three";
import { getMeanLongitude, getRotationAngle, degToRad, daysSinceJ2000 } from "../data/orbital";

// ── Orbit ring ────────────────────────────────────────────────
function OrbitRing({ radius, selected, color }) {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 256; i++) {
      const a = (i / 256) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return pts;
  }, [radius]);

  return (
    <Line
      points={points}
      color={selected ? color : "#1c2e50"}
      lineWidth={selected ? 1.4 : 0.5}
      transparent
      opacity={selected ? 0.75 : 0.3}
    />
  );
}

// ── Atmospheric glow ──────────────────────────────────────────
function Atmosphere({ radius, color }) {
  return (
    <mesh>
      <sphereGeometry args={[radius * 1.09, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.13} side={THREE.BackSide} depthWrite={false} />
    </mesh>
  );
}

// ── Saturn rings ──────────────────────────────────────────────
function SaturnRings({ innerR, outerR }) {
  const [ringTex, setRingTex] = useState(null);
  useEffect(() => {
    import("../data/PlanetTextures").then(({ getSaturnRingTexture }) => {
      setRingTex(getSaturnRingTexture());
    });
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.RingGeometry(innerR, outerR, 256);
    const pos = g.attributes.position;
    const uv  = g.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      uv.setXY(i, (v.length() - innerR) / (outerR - innerR), 0.5);
    }
    return g;
  }, [innerR, outerR]);

  return (
    <mesh geometry={geo} rotation={[Math.PI / 2, 0, 0.35]}>
      <meshBasicMaterial
        map={ringTex}
        side={THREE.DoubleSide}
        transparent
        alphaMap={ringTex}
        opacity={0.85}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── Cloud layer (Earth) ───────────────────────────────────────
function CloudLayer({ radius }) {
  const ref = useRef();
  const [cloudTex, setCloudTex] = useState(null);
  useEffect(() => {
    import("../data/PlanetTextures").then(({ getCloudTexture }) => {
      setCloudTex(getCloudTexture());
    });
  }, []);

  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.003; });

  if (!cloudTex) return null;
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius * 1.016, 48, 48]} />
      <meshStandardMaterial map={cloudTex} transparent alphaMap={cloudTex} opacity={0.7} depthWrite={false} />
    </mesh>
  );
}

// ── Selection pulse ───────────────────────────────────────────
function SelectionPulse({ radius, color }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.scale.setScalar(1 + Math.sin(t * 2.5) * 0.07);
    ref.current.material.opacity = 0.45 + Math.sin(t * 2.5) * 0.3;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius * 1.55, radius * 1.68, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.45} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

// ── Main Planet ───────────────────────────────────────────────
export function Planet({ planet, speed, paused, selected, onSelect, onLiveData }) {
  const orbitRef = useRef();
  const meshRef  = useRef();
  const [tex, setTex] = useState(null);

  // Load procedural texture
  useEffect(() => {
    import("../data/PlanetTextures").then(({ getPlanetTexture }) => {
      setTex(getPlanetTexture(planet.id, 512));
    });
  }, [planet.id]);

  // Real seeded start positions
  const now = useMemo(() => new Date(), []);
  const orbitAngle = useRef(degToRad(getMeanLongitude(planet.L0, planet.n, now)));
  const rotAngle   = useRef(degToRad(getRotationAngle(planet.W0, planet.Wn, now)));
  const prevT      = useRef(null);

  // deg/day → rad/simSecond (1 sim-second = 1 Earth day at speed 1)
  const orbitRate = useMemo(() => (2 * Math.PI) / planet.orbitalPeriod, [planet.orbitalPeriod]);
  const rotRate   = useMemo(
    () => (2 * Math.PI * Math.sign(planet.Wn)) / Math.abs(planet.rotationPeriod),
    [planet.rotationPeriod, planet.Wn]
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (prevT.current === null) { prevT.current = t; return; }
    const dt = paused ? 0 : (t - prevT.current) * speed;
    prevT.current = t;

    orbitAngle.current += orbitRate * dt;
    rotAngle.current   += rotRate   * dt;

    if (orbitRef.current) orbitRef.current.rotation.y = orbitAngle.current;
    if (meshRef.current)  meshRef.current.rotation.y  = rotAngle.current;

    onLiveData(planet.id, {
      orbitDeg:  ((orbitAngle.current * 180 / Math.PI) % 360 + 360) % 360,
      rotDeg:    ((rotAngle.current   * 180 / Math.PI) % 360 + 360) % 360,
      orbitPct:  (((orbitAngle.current / (Math.PI * 2)) % 1 + 1) % 1 * 100).toFixed(2),
    });
  });

  return (
    <group>
      <OrbitRing radius={planet.orbitRadius} selected={selected} color={planet.color} />

      <group ref={orbitRef}>
        <group position={[planet.orbitRadius, 0, 0]} rotation={[0, 0, degToRad(planet.axialTilt)]}>

          {/* ── Planet sphere ── */}
          <mesh
            ref={meshRef}
            onClick={(e) => { e.stopPropagation(); onSelect(planet); }}
            onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
            onPointerOut={() => { document.body.style.cursor = "default"; }}
          >
            <sphereGeometry args={[planet.visualRadius, 64, 64]} />
            <meshStandardMaterial
              map={tex}
              color={tex ? "#ffffff" : planet.color}
              emissive={planet.color}
              emissiveIntensity={tex ? 0.04 : 0.25}
              roughness={0.9}
              metalness={0}
            />
          </mesh>

          {/* Extras */}
          {planet.id === "earth" && <CloudLayer radius={planet.visualRadius} />}
          {planet.hasRing && (
            <SaturnRings innerR={planet.visualRadius * 1.28} outerR={planet.visualRadius * 2.5} />
          )}
          <Atmosphere radius={planet.visualRadius} color={planet.glowColor} />
          {selected && <SelectionPulse radius={planet.visualRadius} color={planet.color} />}

          {/* Label */}
          <Html position={[0, planet.visualRadius + 0.85, 0]} center style={{ pointerEvents: "none" }}>
            <div style={{
              color: selected ? "#fff" : "rgba(255,255,255,0.42)",
              fontSize: "9px",
              fontFamily: "'Exo 2', monospace",
              letterSpacing: "0.2em",
              whiteSpace: "nowrap",
              fontWeight: selected ? 700 : 400,
              textShadow: selected ? `0 0 12px ${planet.color}` : "none",
              textTransform: "uppercase",
              transition: "all 0.3s",
            }}>
              {planet.name}
            </div>
          </Html>

        </group>
      </group>
    </group>
  );
}
