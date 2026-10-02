// Global explode choreography, keyed by top-level part id (mirrored -l parts follow their -r source). Entries win over the
// assemblies' own defaults. Vectors are bee space (mm at full explode): +X head, +Y up, +Z bee-right. The composition follows
// the blueprint sheet: head assembly forward along +X, abdomen / stabilizer / stinger back along -X around the power core,
// thorax armor lifted straight up over the flight machinery, wings out and up, pollination module and the six legs fanning below.
// delay/span place each assembly on the shared 0..1 timeline (sub-assemblies and fine parts follow on their own LEVEL timing).
const SCALE = 0.78;
const T = (v, delay = 0, span = 0.45, rot) => {
  const dist = Math.hypot(v[0], v[1], v[2]) * SCALE;
  return { dir: dist > 0 ? [v[0] / (dist / SCALE), v[1] / (dist / SCALE), v[2] / (dist / SCALE)] : null, dist, delay, span, space: 'bee', ...(rot ? { rot } : {}) };
};

export const LAYOUT = {
  // head -------------------------------------------------------------------------------------------------------------
  'neck-joint': T([4.5, -0.3, 0], 0.00),
  'head-frame': T([9.5, 0.2, 0], 0.02),
  'neural-processor': T([6.5, 11, 0], 0.04),
  'head-shell': T([17, 2.5, 0], 0.00),
  'mandibles': T([9.5, -9.5, 0], 0.04),
  'eye-r': T([6.5, 2.5, 13], 0.02),
  'ocelli': T([5, 14, 0], 0.06),
  'antenna-r': T([11, -9, 14], 0.06),

  // thorax / flight --------------------------------------------------------------------------------------------------
  'thorax-armor': T([0, 16.5, 0], 0.04),
  'thorax-chassis': T([0, 0, 0], 0.00),
  'flight-motor': T([0, 8.5, 0], 0.05),
  'wing-mount-r': T([-1, 5, 14], 0.06),
  'wing-r': T([-7, 8, 33], 0.10, 0.5),

  // abdomen / tail ---------------------------------------------------------------------------------------------------
  'petiole-joint': T([-5, 0, 0], 0.00),
  'abdomen-frame': T([-12.5, -0.6, 0], 0.03),
  'abdomen-shell': T([-21, -2, 0], 0.00),
  'stabilizer': T([-31, -3, 0], 0.06),
  'stinger': T([-37, -10, 0], 0.08),

  // power + pollination ----------------------------------------------------------------------------------------------
  'power-core': T([-1.5, -2.5, 0], 0.00),
  'pollination-module': T([2, -19, 0], 0.08),

  // legs: fan outward and down, front leg forward, rear leg back ------------------------------------------------------
  'leg-front-r': T([9, -15, 15], 0.12, 0.5),
  'leg-mid-r': T([0.5, -17, 19], 0.12, 0.5),
  'leg-rear-r': T([-9, -15, 15], 0.12, 0.5),
};
