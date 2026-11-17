// Diffs the C++ port against the JS reference: node crosscheck.js < output-of-crosscheck.cpp
const K = require('../js/water_waves.js');
const cpp = JSON.parse(require('fs').readFileSync(0, 'utf8'));
const winds = [2.5, 9.0, 14.0, 21.0];
let worst = 0, worstName = '', worstF = 0;
function cmp(name, a, b) { for (let i = 0; i < a.length; i++) { const d = Math.abs(a[i] - b[i]) / Math.max(1, Math.abs(a[i])); if (name.startsWith('gpu')) { if (!(d <= worstF)) worstF = d; } else if (!(d <= worst)) { worst = d; worstName = name + '[' + i + ']'; } } if (a.length !== b.length) { worst = Infinity; worstName = name + ' length'; } }
for (let c = 0; c < 4; c++) {
  const w = new K.WaveSet(40, 24);
  w.generate({ windSpeed: winds[c], windDirection: 0.61, choppiness: 0.9 + 0.03 * c, swellHeight: 0.3 + c * 0.7, swellLength: 60 + c * 40, swellDirection: 1.4, foamAmount: 1.0 + 0.2 * c, seed: 1337 + c });
  w.setTime(123.456 + c); w.advance(0.25); w.packForGpu(1234.5, -987.25);
  const o = cpp[c];
  for (const key of ['dirX', 'dirZ', 'k', 'amp', 'ampH', 'omega', 'phase', 'timePhase', 'tailVariance']) cmp(key, Array.from(w[key]), o[key]);
  cmp('gpuA', Array.from(w.gpuA), o.gpuA); cmp('gpuB', Array.from(w.gpuB), o.gpuB);
  cmp('scalars', [w.significantHeight, w.peakPeriod, w.peakWavelength, w.foamThreshold, w.foamGain, w.windStreaks, w.slopeVariance], o.scalars);
  const s = {};
  for (let i = 0; i < 40; i++) {
    w.sample(-300 + i * 17.3, 120 - i * 9.1, i % 3 === 0 ? 1.0 : 6.0, i % 4 === 0 ? 3.0 : 1e9, s);
    cmp('sample' + i, [s.height, s.nx, s.ny, s.nz, s.vx, s.vy, s.vz, s.ax, s.ay, s.az, s.jacobian], o.samples[i]);
  }
  const f = new Float64Array(12);
  const wet = w.buoyancy(new Float64Array([0, -0.2, 0, 1, 0.1, 0.5, -2, 0.4, 3, 5, -1.0, -4]), new Float64Array([0.1, -0.5, 0, 0, 0, 0, 1, 2, -1, 0, 0.3, 0]), 4,
    { pointVolume: 0.05, pointRadius: 0.18, pointArea: 0.13, waterDensity: 1025, linearDrag: 1.1, quadDrag: 1.0, minWavelength: 1.3 }, null, f);
  cmp('buoyancy', [wet, ...f], o.buoyancy);
  console.log(`case ${c}: wind ${winds[c]} m/s, Hs ${w.significantHeight.toFixed(3)} m, foam threshold ${w.foamThreshold.toFixed(4)}`);
}
console.log('largest relative difference C++ vs JS, double-precision outputs:', worst.toExponential(2), worstName ? 'at ' + worstName : '');
console.log('largest relative difference, float32 GPU tables (printed to 9 digits):', worstF.toExponential(2));
process.exit(worst < 1e-10 && worstF < 1e-6 ? 0 : 1);
