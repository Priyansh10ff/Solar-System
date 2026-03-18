"use client";

export function PlanetList({ planets, selectedId, onSelect }) {
  return (
    <div className="pl-wrap">
      <div className="pl-head">SOLAR SYSTEM</div>
      <div className="pl-sub">Sol · Heliocentric View</div>

      <div className="pl-sun">
        <div className="pl-sun-orb" />
        <div className="pl-sun-info">
          <span className="pl-sun-name">☉ The Sun</span>
          <span className="pl-sun-type">G-type main-sequence</span>
        </div>
      </div>

      <div className="pl-divider" />

      {planets.map((p, i) => {
        const active = p.id === selectedId;
        return (
          <button key={p.id} className={`pl-row ${active ? "pl-active" : ""}`}
            onClick={() => onSelect(active ? null : p)}
            style={{ "--c": p.color, animationDelay: `${i * 0.05}s` }}>
            <div className="pl-dot" style={{ background: p.color, boxShadow: active ? `0 0 10px ${p.color}88` : "none" }} />
            <div className="pl-meta">
              <span className="pl-pname">{p.name}</span>
              <span className="pl-ptype">{p.realData.type}</span>
            </div>
            <div className="pl-dist">{p.realData.distanceFromSun.split("M")[0].split("B")[0]}<span className="pl-unit">{p.realData.distanceFromSun.includes("B") ? "B" : "M"}</span></div>
          </button>
        );
      })}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700&family=Share+Tech+Mono&display=swap');
        .pl-wrap {
          position:absolute; top:70px; left:14px;
          width:198px; z-index:10;
          font-family:'Exo 2',sans-serif;
          animation: fadeLeft .4s ease both;
        }
        @keyframes fadeLeft { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:none} }
        .pl-head { font-size:.6rem; letter-spacing:.28em; color:rgba(240,165,0,.75); font-weight:700; margin-bottom:2px; }
        .pl-sub  { font-size:.56rem; letter-spacing:.12em; color:rgba(255,255,255,.22); margin-bottom:12px; }
        .pl-sun  { display:flex; align-items:center; gap:9px; padding:7px 9px; border-radius:7px;
          background:rgba(255,150,0,.06); border:1px solid rgba(255,150,0,.12); margin-bottom:7px; }
        .pl-sun-orb { width:14px;height:14px;border-radius:50%;flex-shrink:0;
          background:radial-gradient(circle at 38% 35%,#fff8cc,#ffa500,#ff5500);
          box-shadow:0 0 12px #ff880066; }
        .pl-sun-info { display:flex;flex-direction:column;gap:1px; }
        .pl-sun-name { font-size:.7rem;color:rgba(255,195,70,.9);font-weight:600; }
        .pl-sun-type { font-size:.54rem;color:rgba(255,150,0,.4);letter-spacing:.06em; }
        .pl-divider  { height:1px;background:rgba(255,255,255,.06);margin:6px 0; }
        .pl-row {
          display:flex;align-items:center;gap:8px;width:100%;
          padding:6px 9px;border-radius:6px;border:1px solid transparent;
          background:transparent;cursor:pointer;text-align:left;margin-bottom:1px;
          transition:all .18s;animation:fadeLeft .35s ease both;
        }
        .pl-row:hover { background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.07); }
        .pl-active { background:rgba(255,255,255,.07)!important;border-color:rgba(255,255,255,.13)!important; }
        .pl-dot { width:10px;height:10px;border-radius:50%;flex-shrink:0;transition:transform .2s; }
        .pl-row:hover .pl-dot,.pl-active .pl-dot { transform:scale(1.35); }
        .pl-meta { flex:1;display:flex;flex-direction:column;gap:1px;min-width:0; }
        .pl-pname { font-size:.7rem;font-weight:600;color:rgba(255,255,255,.8);letter-spacing:.04em; }
        .pl-active .pl-pname { color:#fff; }
        .pl-ptype { font-size:.54rem;color:rgba(255,255,255,.28);letter-spacing:.08em; }
        .pl-dist  { font-size:.58rem;font-family:'Share Tech Mono',monospace;color:rgba(255,255,255,.22);flex-shrink:0; }
        .pl-unit  { font-size:.5rem;color:rgba(255,255,255,.14); }
        .pl-active .pl-dist { color:rgba(255,255,255,.4); }
      `}</style>
    </div>
  );
}
