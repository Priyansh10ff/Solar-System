# 🌌 Solar System Observer

A real-time interactive 3D solar system built with Next.js, Three.js, and React Three Fiber. Every planet is positioned where it actually is in space **right now**, using real Keplerian orbital mechanics.

---

## ✨ Features

- **Real orbital positions** — Every planet's position is calculated from actual NASA JPL Keplerian elements relative to the J2000 epoch. Not fake circular orbits.
- **Real rotation speeds** — Mercury takes 58 days to rotate once. Jupiter takes under 10 hours. All of it is accurate.
- **Real axial tilts** — Uranus is tilted 97.7° and literally rolls around the Sun. Venus spins backwards (retrograde). All modeled correctly.
- **Procedural planet textures** — No downloads or external assets. Every surface (Earth's continents, Jupiter's storm bands, the Great Red Spot, Saturn's Cassini division) is generated live in your browser using the Canvas API.
- **Earth cloud layer** — Rotates independently from the surface.
- **Saturn's ring system** — Rendered with the Cassini and Enke divisions baked in.
- **Live telemetry panel** — Click any planet to see its current orbit angle, rotation angle, orbit completion %, atmospheric composition, gravity, escape velocity, and more — updating in real time.
- **Speed control** — Slide from 0.1× slow motion to 100× fast-forward. Watch 100 years of orbits in seconds.
- **Asteroid belt** — 450 particles orbiting between Mars and Jupiter.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/solar-system.git
cd solar-system

# Install dependencies (pinned for React 18 compatibility)
npm install three@0.166.1 @react-three/fiber@8.17.6 @react-three/drei@9.108.3 --legacy-peer-deps

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you're in space.

### Optional: Real NASA Textures

The app ships with procedurally generated textures. If you want actual NASA photo textures (~60MB), run this once:

```bash
node scripts/download-textures.mjs
```

This downloads 2K textures from [Solar System Scope](https://www.solarsystemscope.com/textures/) (CC BY 4.0) into `public/textures/`. The app automatically uses downloaded textures over procedural ones, and gracefully falls back if any file is missing.

---

## 🏗️ Tech Stack

| Tech | Purpose |
|---|---|
| [Next.js 14](https://nextjs.org) | React framework, App Router |
| [Three.js](https://threejs.org) | 3D rendering engine |
| [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) | React renderer for Three.js |
| [React Three Drei](https://github.com/pmndrs/drei) | R3F helpers (OrbitControls, Stars, Line) |
| Canvas API | Procedural planet texture generation |
| Keplerian Orbital Mechanics | Real planetary position math |

---

## 📁 Project Structure

```
solar-system/
├── app/
│   ├── page.jsx          # Entry point (SSR disabled for Three.js)
│   ├── layout.jsx        # Root layout + Google Fonts
│   └── globals.css       # Global resets
│
├── components/
│   ├── SolarSystem.jsx   # Main scene + HUD + controls
│   ├── Planet.jsx        # Individual planet with orbit, rotation, glow
│   ├── Sun.jsx           # Sun with procedural texture + corona
│   ├── AsteroidBelt.jsx  # Particle-based asteroid belt
│   ├── PlanetList.jsx    # Left sidebar planet selector
│   └── InfoPanel.jsx     # Right panel with live telemetry
│
├── data/
│   ├── planets.js        # Orbital elements + physical data for all 8 planets
│   ├── orbital.js        # Keplerian math utilities (J2000, mean longitude, IAU rotation)
│   └── PlanetTextures.js # Procedural canvas texture generators
│
└── scripts/
    └── download-textures.mjs  # Optional NASA texture downloader
```

---

## 🔭 How the Orbital Math Works

Planet positions are calculated using **Keplerian mean longitude**:

```
L = L₀ + n × d
```

Where:
- `L₀` = mean longitude at J2000 (Jan 1, 2000 12:00 UTC)
- `n` = mean daily motion in degrees/day
- `d` = days elapsed since J2000

Rotation angles use the **IAU WGCCRE prime meridian formula**:

```
W = W₀ + Wₙ × d
```

This means when you load the app, every planet is at its actual position in the solar system at the current UTC time.

---

## 🎮 Controls

| Control | Action |
|---|---|
| Scroll | Zoom in / out |
| Left drag | Orbit the camera |
| Right drag | Pan |
| Click planet | Open info panel |
| Speed slider | 0.1× → 100× time acceleration |
| Pause button | Freeze the simulation |
| Sidebar | Click any planet to select it |

---

## 🪐 Planet Data Sources

- **Orbital elements**: Meeus, *Astronomical Algorithms* (2nd ed.) / NASA JPL
- **Rotation rates**: IAU Working Group on Cartographic Coordinates and Rotational Elements (WGCCRE)
- **Physical data**: NASA Solar System Exploration

---

## 🛣️ Roadmap

- [ ] Moon system (at least Earth's Moon)
- [ ] Pluto + dwarf planets
- [ ] Comet trails
- [ ] Date picker — jump to any date in history
- [ ] Planet-follow camera mode
- [ ] Actual elliptical orbits (currently circular)
- [ ] Mobile touch controls

---

## 📄 License

MIT — do whatever you want with it.

---

## 🙏 Credits

- [Solar System Scope](https://www.solarsystemscope.com/textures/) for the optional NASA textures (CC BY 4.0)
- Johannes Kepler for figuring out the math in 1609