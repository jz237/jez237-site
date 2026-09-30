// Water bodies: apparent colour seen from above (rw, sss) and the optics below the surface (beam / diffuse attenuation,
// remote-sensing reflectance). Clarity scales the attenuation and the murk of the surface colour.
export const WATER_TYPES = {
  'Open ocean':    { rw: [0.006, 0.036, 0.058], sss: [0.020, 0.150, 0.115], catt: [0.41, 0.100, 0.046], kd: [0.34, 0.078, 0.030], rrs: [0.0045, 0.0200, 0.0330] },
  'Tropical':      { rw: [0.004, 0.078, 0.092], sss: [0.020, 0.190, 0.150], catt: [0.37, 0.078, 0.048], kd: [0.31, 0.062, 0.034], rrs: [0.0038, 0.0260, 0.0340] },
  'Coastal green': { rw: [0.024, 0.078, 0.034], sss: [0.045, 0.190, 0.090], catt: [0.55, 0.190, 0.150], kd: [0.46, 0.145, 0.105], rrs: [0.0065, 0.0250, 0.0190] },
  'Arctic':        { rw: [0.010, 0.026, 0.030], sss: [0.020, 0.110, 0.100], catt: [0.46, 0.135, 0.090], kd: [0.38, 0.105, 0.062], rrs: [0.0048, 0.0170, 0.0240] },
  'Deep ocean':    { rw: [0.0015, 0.012, 0.034], sss: [0.012, 0.090, 0.120], catt: [0.42, 0.085, 0.036], kd: [0.35, 0.060, 0.022], rrs: [0.0026, 0.0130, 0.0300] },
  'Lagoon':        { rw: [0.012, 0.115, 0.108], sss: [0.030, 0.230, 0.190], catt: [0.40, 0.090, 0.068], kd: [0.33, 0.072, 0.052], rrs: [0.0062, 0.0400, 0.0420] },
  'Shallows':      { rw: [0.040, 0.125, 0.085], sss: [0.060, 0.240, 0.150], catt: [0.62, 0.230, 0.190], kd: [0.52, 0.180, 0.135], rrs: [0.0120, 0.0500, 0.0410] },
};
export const DEFAULT_WATER = 'Open ocean';
export const DEFAULT_CLARITY = 0.94;

// clarity 0..1 (1 = gin clear). 0.94 reproduces the tabulated values.
export function waterParams(type, clarity = DEFAULT_CLARITY) {
  const w = WATER_TYPES[type] || WATER_TYPES[DEFAULT_WATER];
  const c = Math.min(1, Math.max(0, clarity));
  const kmul = (1 + 2.6 * (1 - c)) / (1 + 2.6 * (1 - DEFAULT_CLARITY));
  const murk = (1 + 0.9 * (1 - c)) / (1 + 0.9 * (1 - DEFAULT_CLARITY));
  const k = a => a.map(v => v * kmul);
  const m = a => a.map(v => v * murk);
  return { rw: m(w.rw), sss: w.sss, catt: k(w.catt), kd: k(w.kd), rrs: m(w.rrs) };
}
