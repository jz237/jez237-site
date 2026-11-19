import { GLASS_INNER } from '../render/scape/mesh.mjs';

// Radial distance, depth towards the eye, and inverse camera distance. The bowl
// has unit radius, so one profile covers every orientation and viewport size.
export const LENS_SIZE = [65, 49, 13];
export const MAX_INVERSE_DISTANCE = 0.95;
const RAYS = 192;

export function buildLensProfile() {
  const [width, height, depth] = LENS_SIZE;
  const gains = new Float32Array(width * height * depth * 2).fill(1);
  for (let k = 0; k < depth; k++) {
    const invEye = MAX_INVERSE_DISTANCE * k / (depth - 1);
    for (const [channel, medium] of [1.333, 1].entries()) {
      const rays = [];
      for (let i = 1; i <= RAYS; i++) {
        const b = Math.sin(Math.PI / 2 * i / RAYS);
        const sinEye = b * invEye, cosEye = Math.sqrt(1 - sinEye ** 2);
        const cosEntry = Math.sqrt(1 - b * b);
        const x = b * cosEye - cosEntry * sinEye, z = b * sinEye + cosEntry * cosEye;
        const sinGlass = b / 1.5, cosGlass = Math.sqrt(1 - sinGlass ** 2);
        const glassPath = cosGlass - Math.sqrt(GLASS_INNER ** 2 - sinGlass ** 2);
        const ix = x + glassPath * (sinGlass * z - cosGlass * x);
        const iz = z - glassPath * (sinGlass * x + cosGlass * z);
        const sinMedium = Math.min(1, b / (GLASS_INNER * medium));
        const cosMedium = Math.sqrt(1 - sinMedium ** 2);
        const slope = (sinMedium * iz - cosMedium * ix) / (cosMedium * iz + sinMedium * ix);
        // The outermost rays can form multiple images. Blend back to the rim
        // there so a single mesh stays continuous and inside the silhouette.
        const edge = Math.max(0, Math.min(1, (b - 0.82) / 0.175));
        const retain = 1 - edge * edge * (3 - 2 * edge);
        rays.push({ apparent: b / cosEye, ix, iz, slope, retain });
      }
      for (let j = 0; j < height; j++) {
        const z = 2 * j / (height - 1) - 1;
        const base = 2 * width * (j + height * k) + channel;
        let prevR = 0, prevApp = 0, column = 0;
        for (const ray of rays) {
          const app = ray.apparent * (1 - z * invEye);
          const r = z >= ray.iz ? app : app + ray.retain * (ray.ix + (ray.iz - z) * ray.slope - app);
          if (r <= prevR) continue;
          while (column < width && column / (width - 1) <= r) {
            const q = column / (width - 1);
            const slope = (app - prevApp) / (r - prevR);
            gains[base + 2 * column] = q ? (prevApp + (q - prevR) * slope) / q : slope;
            column++;
          }
          if (column === width) break;
          prevR = r;
          prevApp = app;
        }
      }
    }
  }
  return gains;
}
