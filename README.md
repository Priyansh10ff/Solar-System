# Solar System Observer

Interactive 3D solar system built with Next.js, Three.js, and React Three Fiber.

## What Is Implemented

- Sun + 8 planets (Mercury to Neptune)
- Circular orbit rings and animated orbital motion
- Planet self-rotation with axial tilt
- Earth cloud layer
- Saturn rings
- Asteroid belt particle field
- Left planet list and right info panel with live angles/progress
- Pause/Resume + speed slider (`0.1` to `100`)
- UTC clock in the HUD

## Time And Accuracy Notes

- Planet start angles are seeded from current UTC time using J2000 formulas:
  - Mean longitude: `L = L0 + n * d`
  - Prime meridian: `W = W0 + Wn * d`
- Orbits are rendered as circular paths at fixed visual radii (not full N-body or ellipse rendering).
- Simulation speed is accelerated:
  - `speed = 1` means about **1 simulated Earth day per 1 real second**
  - So this is **not 1:1 real-time motion like the real universe**

## Textures

- Current rendering path uses procedural textures from `data/PlanetTextures.js`.
- `public/textures/*` files and `scripts/download-textures.mjs` exist in the repo, but they are not currently wired into the active planet material pipeline.

## Getting Started

Requirements:

- Node.js 18+
- npm

Run:

```bash
cd solar-system
npm install
npm run dev
```

Open `http://localhost:3000`.

## Tech Stack

- Next.js 14
- React 18
- Three.js
- @react-three/fiber
- @react-three/drei

## Project Structure

```text
solar-system/
  app/
    layout.jsx
    page.jsx
    globals.css
  components/
    SolarSystem.jsx
    Planet.jsx
    Sun.jsx
    AsteroidBelt.jsx
    PlanetList.jsx
    InfoPanel.jsx
  data/
    planets.js
    orbital.js
    PlanetTextures.js
  scripts/
    download-textures.mjs
```

## Controls

- Scroll: zoom
- Left drag: orbit camera
- Right drag: pan
- Click planet: open telemetry/info panel
- Speed slider: change simulation speed
- Pause button: pause/resume simulation

## License

MIT
