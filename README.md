# Solar System Observer

<p align="center">
  Interactive 3D heliocentric solar system built with Next.js + React Three Fiber.
</p>

<p align="center">
  <a href="https://github.com/Priyansh10ff/Solar-System">Source Code</a>
</p>

---

## Overview

This project renders a stylized, interactive Solar System scene with real-data-seeded start angles, live telemetry, and simulation speed controls.

## Features

- Sun + 8 planets (Mercury to Neptune)
- Circular orbit tracks with animated orbital motion
- Planet self-rotation with axial tilt
- Earth cloud layer
- Saturn rings
- Asteroid belt particle field
- Planet sidebar selector + telemetry info panel
- Pause/Resume + speed control (`0.1x` to `100x`)
- UTC live clock in the HUD
- In-app `Source Code` button linking to this repository

## Time And Accuracy

- Initial orbit and rotation angles are seeded from current UTC time using J2000-based formulas:
  - `L = L0 + n * d` (mean longitude)
  - `W = W0 + Wn * d` (prime meridian rotation)
- Orbits are rendered as circular visual paths at fixed radii.
- Simulation is intentionally accelerated:
  - At `speed = 1`, about **1 simulated Earth day passes per real second**
  - Motion is therefore **not 1:1 real-time with the physical universe**

## Textures

- Active rendering uses procedural textures from `data/PlanetTextures.js`.
- `public/textures/*` and `scripts/download-textures.mjs` are present, but not currently used by the active planet material path.

## Quick Start

### Requirements

- Node.js 18+
- npm

### Run Locally

```bash
cd solar-system
npm install
npm run dev
```

Open: `http://localhost:3000`

## Controls

| Input | Action |
|---|---|
| Scroll | Zoom camera |
| Left drag | Orbit camera |
| Right drag | Pan camera |
| Click planet | Open telemetry/info panel |
| Speed slider | Adjust simulation speed |
| Pause button | Pause/Resume simulation |

## Tech Stack

- Next.js 14
- React 18
- Three.js
- `@react-three/fiber`
- `@react-three/drei`

## Project Structure

```text
solar-system/
├── app/
│   ├── globals.css
│   ├── layout.jsx
│   └── page.jsx
├── components/
│   ├── AsteroidBelt.jsx
│   ├── InfoPanel.jsx
│   ├── Planet.jsx
│   ├── PlanetList.jsx
│   ├── SolarSystem.jsx
│   └── Sun.jsx
├── data/
│   ├── orbital.js
│   ├── PlanetTextures.js
│   └── planets.js
└── scripts/
    └── download-textures.mjs
```

## License

MIT
