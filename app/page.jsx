import dynamic from "next/dynamic";

// Must disable SSR for Three.js (uses browser APIs)
const SolarSystem = dynamic(() => import("../components/SolarSystem"), {
  ssr: false,
  loading: () => (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "#000008",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "rgba(255,215,0,0.7)",
      fontFamily: "Courier New, monospace",
      fontSize: "0.9rem",
      letterSpacing: "0.3em",
    }}>
      ☀ INITIALIZING SOLAR SYSTEM...
    </div>
  ),
});

export default function Home() {
  return <SolarSystem />;
}
