// Keplerian orbital mechanics utilities
// Reference: Meeus "Astronomical Algorithms", IAU WGCCRE

// J2000.0 epoch = Jan 1.5, 2000 = 2000-01-01T12:00:00Z
const J2000 = new Date("2000-01-01T12:00:00Z");

/**
 * Returns decimal days elapsed since J2000 epoch
 */
export function daysSinceJ2000(date = new Date()) {
  return (date - J2000) / (1000 * 60 * 60 * 24);
}

/**
 * Current mean orbital longitude of a planet (degrees, 0-360)
 * L = L0 + n * d  where d = days since J2000
 */
export function getMeanLongitude(L0, n, date = new Date()) {
  const d = daysSinceJ2000(date);
  return ((L0 + n * d) % 360 + 360) % 360;
}

/**
 * Current prime meridian rotation angle (degrees, 0-360)
 * W = W0 + Wn * d
 */
export function getRotationAngle(W0, Wn, date = new Date()) {
  const d = daysSinceJ2000(date);
  return ((W0 + Wn * d) % 360 + 360) % 360;
}

/**
 * Convert degrees to radians
 */
export function degToRad(deg) {
  return (deg * Math.PI) / 180;
}
