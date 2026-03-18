import * as THREE from "three";

// Seeded pseudo-random for deterministic textures
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Simple 2D value noise
function makeNoise(rand) {
  const TABLE = new Float32Array(512);
  for (let i = 0; i < 512; i++) TABLE[i] = rand();
  const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a, b, t) => a + (b - a) * t;
  return function noise(x, y) {
    const xi = Math.floor(x) & 255, yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x), yf = y - Math.floor(y);
    const u = fade(xf), v = fade(yf);
    const aa = TABLE[(xi + TABLE[yi & 255]) & 255];
    const ab = TABLE[(xi + TABLE[(yi + 1) & 255]) & 255];
    const ba = TABLE[(xi + 1 + TABLE[yi & 255]) & 255];
    const bb = TABLE[(xi + 1 + TABLE[(yi + 1) & 255]) & 255];
    return lerp(lerp(aa, ba, u), lerp(ab, bb, u), v);
  };
}

// Fractal Brownian Motion
function fbm(noise, x, y, octaves = 6) {
  let val = 0, amp = 0.5, freq = 1, max = 0;
  for (let i = 0; i < octaves; i++) {
    val += noise(x * freq, y * freq) * amp;
    max += amp; amp *= 0.5; freq *= 2.1;
  }
  return val / max;
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function mix(a, b, t) { return a + (b - a) * clamp(t, 0, 1); }

// ── Texture painters ─────────────────────────────────────────

function paintMercury(ctx, W, H, noise) {
  // Gray cratered surface
  const img = ctx.createImageData(W, H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const nx = x / W * 6, ny = y / H * 3;
      const v = fbm(noise, nx, ny, 7);
      const v2 = fbm(noise, nx * 3 + 10, ny * 3 + 10, 4);
      const base = mix(100, 165, v);
      const detail = mix(0, 40, v2);
      const c = clamp(base + detail * (v > 0.55 ? -1 : 1) * 30, 60, 200);
      const i = (y * W + x) * 4;
      img.data[i] = c; img.data[i+1] = c - 5; img.data[i+2] = c - 12; img.data[i+3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

function paintVenus(ctx, W, H, noise) {
  // Thick cloud bands, orange-yellow
  const img = ctx.createImageData(W, H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const nx = x / W * 4, ny = y / H * 4;
      const band = Math.sin(y / H * Math.PI * 6 + fbm(noise, nx, ny, 4) * 2) * 0.5 + 0.5;
      const v = fbm(noise, nx, ny, 5);
      const r = clamp(mix(200, 240, band) + v * 30 - 15, 160, 255);
      const g = clamp(mix(160, 210, band) + v * 20 - 10, 120, 220);
      const b = clamp(mix(60, 100, band) + v * 15, 40, 120);
      const i = (y * W + x) * 4;
      img.data[i] = r; img.data[i+1] = g; img.data[i+2] = b; img.data[i+3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

function paintEarth(ctx, W, H, noise) {
  const img = ctx.createImageData(W, H);
  for (let y = 0; y < H; y++) {
    const lat = (y / H - 0.5) * Math.PI; // -π/2 to π/2
    for (let x = 0; x < W; x++) {
      const nx = x / W * 5, ny = y / H * 5;
      const land = fbm(noise, nx, ny, 8);
      const moisture = fbm(noise, nx + 30, ny + 30, 5);
      const poleCap = Math.abs(lat) > 1.1;
      const nearPole = Math.abs(lat) > 0.9;

      let r, g, b;

      if (poleCap) {
        // Ice caps
        r = 230; g = 240; b = 255;
      } else if (land > 0.54) {
        // Land
        if (nearPole) { r = 200; g = 220; b = 230; }         // tundra
        else if (moisture < 0.42) { r = 194; g = 178; b = 128; } // desert
        else if (land > 0.68) { r = 110; g = 100; b = 80; }   // mountains
        else { r = 60; g = 120; b = 50; }                      // forest
        // variation
        r = clamp(r + (land - 0.6) * 80, 0, 255);
        g = clamp(g + moisture * 20, 0, 255);
      } else {
        // Ocean - depth-based
        const depth = (0.54 - land) / 0.54;
        r = clamp(mix(30, 15, depth), 0, 80);
        g = clamp(mix(100, 50, depth), 40, 130);
        b = clamp(mix(180, 120, depth), 100, 210);
      }
      const i = (y * W + x) * 4;
      img.data[i] = r; img.data[i+1] = g; img.data[i+2] = b; img.data[i+3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

function paintMars(ctx, W, H, noise) {
  const img = ctx.createImageData(W, H);
  for (let y = 0; y < H; y++) {
    const lat = (y / H - 0.5) * Math.PI;
    for (let x = 0; x < W; x++) {
      const nx = x / W * 5, ny = y / H * 5;
      const v = fbm(noise, nx, ny, 7);
      const v2 = fbm(noise, nx * 2 + 5, ny * 2 + 5, 4);
      const pole = Math.abs(lat) > 1.25;
      let r, g, b;
      if (pole) { r = 230; g = 220; b = 215; }
      else {
        r = clamp(mix(160, 210, v) + v2 * 30, 120, 230);
        g = clamp(mix(60, 100, v) + v2 * 10, 40, 120);
        b = clamp(mix(40, 70, v), 30, 90);
        // darker lava plains
        if (v < 0.4) { r = clamp(r - 30, 80, 255); g = clamp(g - 15, 20, 255); }
      }
      const i = (y * W + x) * 4;
      img.data[i] = r; img.data[i+1] = g; img.data[i+2] = b; img.data[i+3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

function paintJupiter(ctx, W, H, noise) {
  const img = ctx.createImageData(W, H);
  const BANDS = [
    [0.00, [180, 130, 80]],  [0.08, [220, 185, 130]],
    [0.15, [165, 110, 65]],  [0.22, [210, 175, 120]],
    [0.28, [190, 140, 90]],  [0.35, [225, 195, 145]],
    [0.40, [155, 105, 60]],  [0.48, [215, 180, 125]],
    [0.55, [175, 125, 75]],  [0.62, [205, 170, 115]],
    [0.68, [160, 115, 70]],  [0.75, [220, 188, 138]],
    [0.82, [170, 120, 72]],  [0.90, [210, 178, 125]],
    [1.00, [180, 130, 80]],
  ];
  for (let y = 0; y < H; y++) {
    const fy = y / H;
    let bandColor = BANDS[0][1];
    for (let k = 0; k < BANDS.length - 1; k++) {
      if (fy >= BANDS[k][0] && fy < BANDS[k+1][0]) {
        const t = (fy - BANDS[k][0]) / (BANDS[k+1][0] - BANDS[k][0]);
        bandColor = BANDS[k][1].map((c, i) => mix(c, BANDS[k+1][1][i], t));
        break;
      }
    }
    for (let x = 0; x < W; x++) {
      const nx = x / W * 8, ny = y / H * 8;
      const turb = fbm(noise, nx, ny, 5) - 0.5;
      const wavy = fbm(noise, nx + turb * 0.8, ny * 0.3, 4);
      const [r, g, b] = bandColor;
      const d = (wavy - 0.5) * 55;
      const i = (y * W + x) * 4;
      img.data[i]   = clamp(r + d, 80, 255);
      img.data[i+1] = clamp(g + d * 0.7, 50, 255);
      img.data[i+2] = clamp(b + d * 0.4, 30, 180);
      img.data[i+3] = 255;
    }
  }
  // Great Red Spot
  const spotX = Math.floor(W * 0.3), spotY = Math.floor(H * 0.62);
  for (let dy = -22; dy <= 22; dy++) {
    for (let dx = -38; dx <= 38; dx++) {
      const t = (dx / 38) ** 2 + (dy / 22) ** 2;
      if (t > 1) continue;
      const sx = clamp(spotX + dx, 0, W - 1), sy = clamp(spotY + dy, 0, H - 1);
      const fi = (sy * W + sx) * 4;
      const blend = 1 - t;
      img.data[fi]   = clamp(img.data[fi]   * (1 - blend) + 180 * blend, 0, 255);
      img.data[fi+1] = clamp(img.data[fi+1] * (1 - blend) + 60  * blend, 0, 255);
      img.data[fi+2] = clamp(img.data[fi+2] * (1 - blend) + 40  * blend, 0, 255);
    }
  }
  ctx.putImageData(img, 0, 0);
}

function paintSaturn(ctx, W, H, noise) {
  const img = ctx.createImageData(W, H);
  for (let y = 0; y < H; y++) {
    const fy = y / H;
    const band = Math.sin(fy * Math.PI * 7) * 0.5 + 0.5;
    for (let x = 0; x < W; x++) {
      const nx = x / W * 7, ny = fy * 7;
      const v = fbm(noise, nx, ny, 4);
      const r = clamp(mix(195, 240, band) + v * 25, 140, 255);
      const g = clamp(mix(170, 215, band) + v * 20, 120, 235);
      const b = clamp(mix(100, 150, band) + v * 15, 70, 180);
      const i = (y * W + x) * 4;
      img.data[i] = r; img.data[i+1] = g; img.data[i+2] = b; img.data[i+3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

function paintUranus(ctx, W, H, noise) {
  const img = ctx.createImageData(W, H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const nx = x / W * 3, ny = y / H * 3;
      const v = fbm(noise, nx, ny, 4) * 0.35 + 0.65;
      const r = clamp(100 * v, 50, 140);
      const g = clamp(210 * v, 150, 240);
      const b = clamp(220 * v, 170, 255);
      const i = (y * W + x) * 4;
      img.data[i] = r; img.data[i+1] = g; img.data[i+2] = b; img.data[i+3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

function paintNeptune(ctx, W, H, noise) {
  const img = ctx.createImageData(W, H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const nx = x / W * 5, ny = y / H * 5;
      const v = fbm(noise, nx, ny, 6);
      const storm = fbm(noise, nx * 2 + 20, ny * 2, 5);
      const r = clamp(mix(20, 60, v) + storm * 20, 10, 90);
      const g = clamp(mix(50, 110, v) + storm * 15, 30, 130);
      const b = clamp(mix(160, 220, v) + storm * 25, 120, 255);
      const i = (y * W + x) * 4;
      img.data[i] = r; img.data[i+1] = g; img.data[i+2] = b; img.data[i+3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

function paintSun(ctx, W, H, noise) {
  const img = ctx.createImageData(W, H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const nx = x / W * 6, ny = y / H * 6;
      const v = fbm(noise, nx, ny, 6);
      const v2 = fbm(noise, nx * 3 + 10, ny * 3, 4);
      const granule = v > 0.55;
      const r = clamp(granule ? mix(255, 230, v2) : mix(200, 255, v), 180, 255);
      const g = clamp(granule ? mix(180, 140, v2) : mix(120, 180, v), 80, 200);
      const b = clamp(granule ? 20 : mix(10, 40, v), 0, 60);
      const i = (y * W + x) * 4;
      img.data[i] = r; img.data[i+1] = g; img.data[i+2] = b; img.data[i+3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

const PAINTERS = {
  sun:     paintSun,
  mercury: paintMercury,
  venus:   paintVenus,
  earth:   paintEarth,
  mars:    paintMars,
  jupiter: paintJupiter,
  saturn:  paintSaturn,
  uranus:  paintUranus,
  neptune: paintNeptune,
};

const SEEDS = {
  sun: 1, mercury: 2, venus: 3, earth: 4,
  mars: 5, jupiter: 6, saturn: 7, uranus: 8, neptune: 9,
};

// Cache textures so we don't regenerate every render
const _cache = {};

export function getPlanetTexture(id, size = 512) {
  if (_cache[id]) return _cache[id];

  const canvas = document.createElement("canvas");
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext("2d");

  const rand = mulberry32(SEEDS[id] || 42);
  const noise = makeNoise(rand);
  const painter = PAINTERS[id];
  if (painter) painter(ctx, size, size, noise);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  _cache[id] = texture;
  return texture;
}

// Earth clouds procedural
export function getCloudTexture(size = 512) {
  if (_cache["clouds"]) return _cache["clouds"];
  const canvas = document.createElement("canvas");
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext("2d");

  const rand = mulberry32(99);
  const noise = makeNoise(rand);
  const img = ctx.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / size * 6, ny = y / size * 6;
      const v = fbm(noise, nx, ny, 7);
      const alpha = clamp((v - 0.45) * 3.5, 0, 1);
      const i = (y * size + x) * 4;
      img.data[i] = 255; img.data[i+1] = 255; img.data[i+2] = 255;
      img.data[i+3] = Math.floor(alpha * 200);
    }
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  _cache["clouds"] = tex;
  return tex;
}

// Saturn ring texture
export function getSaturnRingTexture(W = 512, H = 64) {
  if (_cache["saturn-ring"]) return _cache["saturn-ring"];
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");

  const img = ctx.createImageData(W, H);
  const rand = mulberry32(77);
  const noise = makeNoise(rand);

  for (let x = 0; x < W; x++) {
    const t = x / W; // 0 = inner, 1 = outer
    // Ring divisions (Cassini division etc)
    const cassini = t > 0.44 && t < 0.52;
    const enke = t > 0.28 && t < 0.31;
    const v = noise(t * 40, 0.5) * 0.5 + 0.5;

    for (let y = 0; y < H; y++) {
      const i = (y * W + x) * 4;
      if (cassini || enke) {
        img.data[i] = img.data[i+1] = img.data[i+2] = 0;
        img.data[i+3] = 0;
      } else {
        const density = clamp((1 - Math.abs(t - 0.5) * 2) * 1.4 + (v - 0.5) * 0.3, 0, 1);
        const brightness = clamp(mix(160, 220, t) + (v - 0.5) * 40, 100, 255);
        img.data[i]   = brightness;
        img.data[i+1] = clamp(brightness * 0.92, 0, 255);
        img.data[i+2] = clamp(brightness * 0.72, 0, 255);
        img.data[i+3] = Math.floor(density * 210);
      }
    }
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  _cache["saturn-ring"] = tex;
  return tex;
}
