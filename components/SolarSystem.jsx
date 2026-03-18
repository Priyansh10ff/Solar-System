"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Preload } from "@react-three/drei";
import { Suspense, useState, useRef, useEffect } from "react";
import { Sun } from "./Sun";
import { Planet } from "./Planet";
import { AsteroidBelt } from "./AsteroidBelt";
import { InfoPanel } from "./InfoPanel";
import { PlanetList } from "./PlanetList";
import { PLANETS } from "../data/planets";

function LiveClock() {
  const [t, setT] = useState(() => new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  const p = n => String(n).padStart(2,"0");
  return (
    <div style={{ textAlign:"right" }}>
      <div style={{ fontSize:".6rem", color:"rgba(255,255,255,.3)", fontFamily:"'Share Tech Mono',monospace",
        letterSpacing:".12em" }}>
        {t.toLocaleDateString("en-US",{day:"2-digit",month:"short",year:"numeric"})}
      </div>
      <div style={{ fontSize:".75rem", fontFamily:"'Share Tech Mono',monospace",
        color:"rgba(240,192,64,.85)", letterSpacing:".08em", marginTop:"1px" }}>
        {p(t.getUTCHours())}:{p(t.getUTCMinutes())}:{p(t.getUTCSeconds())} UTC
      </div>
    </div>
  );
}

export default function SolarSystem() {
  const [selected, setSelected] = useState(null);
  const [speed, setSpeed]       = useState(1);
  const [paused, setPaused]     = useState(false);
  const liveRef = useRef({});

  const handleSelect = p => setSelected(prev => prev?.id === p?.id ? null : p);
  const handleLive   = (id, d) => { liveRef.current[id] = d; };

  return (
    <div className="root">
      {/* ── HUD top ── */}
      <div className="hud">
        <div className="hud-brand">
          <div className="hud-sunball" />
          <div>
            <div className="hud-title">SOLAR SYSTEM OBSERVER</div>
            <div className="hud-sub">Heliocentric · Real-Time Keplerian Simulation</div>
          </div>
        </div>

        {/* Speed + pause */}
        <div className="hud-ctrl">
          <button className={`hud-btn ${paused ? "btn-play" : "btn-pause"}`} onClick={() => setPaused(p => !p)}>
            {paused ? "▶ RESUME" : "⏸ PAUSE"}
          </button>
          <div className="hud-speed">
            <div className="hud-speed-label">SPEED <span className="hud-speed-val">{speed < 1 ? speed.toFixed(1) : Math.round(speed)}×</span></div>
            <input type="range" min=".1" max="100" step=".1" value={speed}
              onChange={e => setSpeed(parseFloat(e.target.value))} className="hud-range" />
          </div>
        </div>

        <LiveClock />
      </div>

      {/* Sidebar */}
      <PlanetList planets={PLANETS} selectedId={selected?.id} onSelect={handleSelect} />

      {/* 3D Canvas */}
      <Canvas
        camera={{ position:[0,60,125], fov:50, near:.1, far:2000 }}
        style={{ position:"absolute", inset:0 }}
        gl={{ antialias:true, toneMapping:3, toneMappingExposure:1.1 }}
      >
        <Suspense fallback={null}>
          <Stars radius={500} depth={80} count={12000} factor={4} fade speed={.25} />
          <ambientLight intensity={0.07} />
          <pointLight position={[0,0,0]} intensity={5} distance={550} decay={1.1} color="#fff5e0" />
          <pointLight position={[0,0,0]} intensity={1.5} distance={200} decay={1.5} color="#ffe0a0" />
          <Sun />
          <AsteroidBelt innerRadius={34} outerRadius={40} count={450} />
          {PLANETS.map(p => (
            <Planet key={p.id} planet={p} speed={speed} paused={paused}
              selected={selected?.id === p.id} onSelect={handleSelect} onLiveData={handleLive} />
          ))}
          <OrbitControls enablePan enableZoom enableRotate
            minDistance={8} maxDistance={500} zoomSpeed={1.3} rotateSpeed={0.55} />
          <Preload all />
        </Suspense>
      </Canvas>

      {/* Info panel */}
      {selected && <InfoPanel planet={selected} liveData={liveRef} onClose={() => setSelected(null)} />}

      {/* Hint */}
      <div className="hint">Scroll · Drag · Click planet</div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700&family=Share+Tech+Mono&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .root {
          width:100vw;height:100vh;position:relative;overflow:hidden;
          background:radial-gradient(ellipse at 50% 38%,#060d1f 0%,#020408 55%,#000 100%);
          font-family:'Exo 2',sans-serif;
        }
        .hud {
          position:absolute;top:0;left:0;right:0;z-index:20;
          display:flex;align-items:center;justify-content:space-between;
          padding:13px 20px;gap:16px;
          background:linear-gradient(to bottom,rgba(2,4,14,.97) 0%,transparent 100%);
          border-bottom:1px solid rgba(240,165,0,.1);
        }
        .hud-brand { display:flex;align-items:center;gap:11px; }
        .hud-sunball {
          width:26px;height:26px;border-radius:50%;flex-shrink:0;
          background:radial-gradient(circle at 38% 38%,#fff8cc,#ff9900,#ff5500);
          box-shadow:0 0 16px #ff880066;
        }
        .hud-title { font-size:.7rem;font-weight:700;letter-spacing:.22em;color:rgba(240,192,64,.9); }
        .hud-sub   { font-size:.54rem;letter-spacing:.1em;color:rgba(255,255,255,.22);margin-top:1px; }
        .hud-ctrl  { display:flex;align-items:center;gap:12px; }
        .hud-btn {
          padding:5px 15px;border-radius:6px;border:1px solid rgba(255,255,255,.15);
          background:rgba(255,255,255,.07);color:#fff;cursor:pointer;
          font-family:'Exo 2',sans-serif;font-size:.68rem;letter-spacing:.1em;transition:all .15s;
        }
        .hud-btn:hover{background:rgba(255,255,255,.13);}
        .btn-play{border-color:rgba(76,255,128,.4)!important;color:#4cff80!important;}
        .btn-pause{border-color:rgba(240,192,64,.4)!important;color:#f0c040!important;}
        .hud-speed { display:flex;flex-direction:column;gap:3px;min-width:130px; }
        .hud-speed-label { font-size:.57rem;color:rgba(255,255,255,.3);letter-spacing:.14em; }
        .hud-speed-val   { color:#f0c040;font-family:'Share Tech Mono',monospace; }
        .hud-range { width:100%;accent-color:#f0c040;cursor:pointer;height:3px; }
        .hint {
          position:absolute;bottom:16px;left:50%;transform:translateX(-50%);
          z-index:10;color:rgba(255,255,255,.15);font-size:.6rem;
          letter-spacing:.18em;pointer-events:none;
        }
      `}</style>
    </div>
  );
}
