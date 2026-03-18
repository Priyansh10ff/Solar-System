"use client";
import { useEffect, useState } from "react";

const TYPE_COLOR = { Terrestrial: "#5aaff0", "Gas Giant": "#c8903a", "Ice Giant": "#7de8e8" };

export function InfoPanel({ planet, liveData, onClose }) {
  const [live, setLive] = useState(null);
  useEffect(() => {
    if (!planet) { setLive(null); return; }
    const id = setInterval(() => {
      const d = liveData.current[planet.id];
      if (d) setLive({...d});
    }, 80);
    return () => clearInterval(id);
  }, [planet, liveData]);

  if (!planet) return null;
  const tc = TYPE_COLOR[planet.realData.type] || "#fff";

  return (
    <div className="ip-wrap">
      <div className="ip-top" style={{ borderTopColor: planet.color }}>
        <div className="ip-ident">
          <div className="ip-globe" style={{
            background: `radial-gradient(circle at 32% 32%, ${planet.color}ee, ${planet.color}44, #000)`,
            boxShadow: `0 0 22px ${planet.color}44`,
          }} />
          <div>
            <div className="ip-name">{planet.name}</div>
            <div className="ip-type" style={{ color: tc }}>{planet.realData.type}</div>
          </div>
        </div>
        <button className="ip-close" onClick={onClose}>✕</button>
      </div>

      <div className="ip-sec">
        <div className="ip-sh"><span className="ip-live-dot" /> LIVE TELEMETRY</div>
        {[
          ["Orbit angle",    live ? `${parseFloat(live.orbitDeg).toFixed(2)}°` : "—", true],
          ["Orbit complete", live ? `${live.orbitPct}%`                         : "—", true],
          ["Rotation angle", live ? `${parseFloat(live.rotDeg).toFixed(2)}°`   : "—", true],
        ].map(([l, v, acc]) => (
          <div key={l} className="ip-row">
            <span className="ip-rl">{l}</span>
            <span className={`ip-rv ${acc ? "ip-acc" : ""}`}>{v}</span>
          </div>
        ))}
      </div>

      <div className="ip-sec">
        <div className="ip-sh">◎ ORBITAL</div>
        {[
          ["Period",    planet.realData.orbitalPeriod],
          ["Rotation",  planet.realData.rotationPeriod],
          ["Distance",  planet.realData.distanceFromSun],
          ["Gravity",   planet.realData.gravity],
        ].map(([l, v]) => (
          <div key={l} className="ip-row">
            <span className="ip-rl">{l}</span>
            <span className="ip-rv">{v}</span>
          </div>
        ))}
      </div>

      <div className="ip-sec">
        <div className="ip-sh">◈ PHYSICAL</div>
        {[
          ["Diameter",    planet.realData.diameter],
          ["Avg temp",    planet.realData.avgTemp],
          ["Escape vel",  planet.realData.escapeVel],
          ["Atmosphere",  planet.realData.atmosphere],
          ["Moons",       String(planet.realData.moons)],
        ].map(([l, v]) => (
          <div key={l} className="ip-row">
            <span className="ip-rl">{l}</span>
            <span className="ip-rv">{v}</span>
          </div>
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700&family=Share+Tech+Mono&display=swap');
        .ip-wrap {
          position:absolute;top:70px;right:14px;width:268px;
          background:rgba(3,6,18,.93);border:1px solid rgba(255,255,255,.09);
          border-radius:12px;z-index:20;font-family:'Exo 2',sans-serif;
          backdrop-filter:blur(18px);
          box-shadow:0 20px 70px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.04);
          overflow:hidden;animation:panIn .28s cubic-bezier(.16,1,.3,1) both;
        }
        @keyframes panIn { from{opacity:0;transform:translateX(20px) scale(.97)} to{opacity:1;transform:none} }
        .ip-top {
          display:flex;align-items:center;justify-content:space-between;
          padding:14px 15px;border-bottom:1px solid rgba(255,255,255,.07);
          border-top:2px solid transparent;background:rgba(255,255,255,.025);
        }
        .ip-ident { display:flex;align-items:center;gap:11px; }
        .ip-globe { width:38px;height:38px;border-radius:50%;flex-shrink:0; }
        .ip-name  { font-size:1.05rem;font-weight:700;color:#fff;letter-spacing:.04em; }
        .ip-type  { font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;margin-top:2px; }
        .ip-close { background:none;border:none;color:rgba(255,255,255,.3);cursor:pointer;
          font-size:.75rem;padding:5px 7px;border-radius:4px;transition:all .15s;font-family:inherit; }
        .ip-close:hover { color:#fff;background:rgba(255,255,255,.09); }
        .ip-sec { padding:11px 15px;border-bottom:1px solid rgba(255,255,255,.04); }
        .ip-sh  { font-size:.55rem;letter-spacing:.2em;color:rgba(255,255,255,.22);
          text-transform:uppercase;margin-bottom:7px;display:flex;align-items:center;gap:6px;font-weight:600; }
        .ip-live-dot { width:6px;height:6px;border-radius:50%;background:#4cff80;
          animation:liveBlink 1.2s infinite;flex-shrink:0; }
        @keyframes liveBlink { 0%,100%{opacity:1} 50%{opacity:.08} }
        .ip-row { display:flex;justify-content:space-between;align-items:baseline;
          padding:4px 0;border-bottom:1px solid rgba(255,255,255,.035);gap:8px; }
        .ip-rl { font-size:.59rem;letter-spacing:.1em;color:rgba(255,255,255,.32);text-transform:uppercase; }
        .ip-rv { font-size:.7rem;font-family:'Share Tech Mono',monospace;color:rgba(255,255,255,.72);text-align:right; }
        .ip-acc { color:#f0c040!important; }
      `}</style>
    </div>
  );
}
