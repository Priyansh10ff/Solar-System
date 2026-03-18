// Run this ONCE from your project root:
//   node scripts/download-textures.mjs
//
// Downloads planet textures from Solar System Scope (CC BY 4.0)
// into public/textures/ so Next.js can serve them.

import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const TEXTURES_DIR = path.join(process.cwd(), "public", "textures");

const TEXTURES = [
  {
    url: "https://www.solarsystemscope.com/textures/download/2k_sun.jpg",
    file: "sun.jpg",
  },
  {
    url: "https://www.solarsystemscope.com/textures/download/2k_mercury.jpg",
    file: "mercury.jpg",
  },
  {
    url: "https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg",
    file: "venus.jpg",
  },
  {
    url: "https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg",
    file: "earth.jpg",
  },
  {
    url: "https://www.solarsystemscope.com/textures/download/2k_earth_clouds.jpg",
    file: "earth-clouds.jpg",
  },
  {
    url: "https://www.solarsystemscope.com/textures/download/2k_mars.jpg",
    file: "mars.jpg",
  },
  {
    url: "https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg",
    file: "jupiter.jpg",
  },
  {
    url: "https://www.solarsystemscope.com/textures/download/2k_saturn.jpg",
    file: "saturn.jpg",
  },
  {
    url: "https://www.solarsystemscope.com/textures/download/2k_saturn_ring_alpha.png",
    file: "saturn-ring.png",
  },
  {
    url: "https://www.solarsystemscope.com/textures/download/2k_uranus.jpg",
    file: "uranus.jpg",
  },
  {
    url: "https://www.solarsystemscope.com/textures/download/2k_neptune.jpg",
    file: "neptune.jpg",
  },
  {
    url: "https://www.solarsystemscope.com/textures/download/2k_stars_milky_way.jpg",
    file: "stars.jpg",
  },
];

async function download(url, file) {
  const dest = path.join(TEXTURES_DIR, file);
  if (existsSync(dest)) {
    console.log(`  ✓ ${file} already exists — skipping`);
    return;
  }
  process.stdout.write(`  ↓ Downloading ${file} ...`);
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  console.log(` done (${(buf.length / 1024).toFixed(0)} KB)`);
}

async function main() {
  console.log("\n🌍 Solar System Texture Downloader\n");
  await mkdir(TEXTURES_DIR, { recursive: true });

  for (const t of TEXTURES) {
    try {
      await download(t.url, t.file);
    } catch (e) {
      console.error(`  ✗ Failed ${t.file}: ${e.message}`);
    }
  }
  console.log("\n✅ Done! Textures saved to public/textures/\n");
}

main();
