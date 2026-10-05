// Quality tiers. Composition never changes between tiers; only resolution,
// sample counts, shadow resolution, instancing density and selective effects.

export function detectQuality(params) {
  const forced = params.get('quality');
  const w = Math.min(window.innerWidth, window.innerHeight * 2);
  const mobile = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && w < 1100);
  let tier = forced || (mobile ? 'low' : 'high');
  if (!['low', 'med', 'high'].includes(tier)) tier = 'high';
  const tiers = {
    high: { tier: 'high', pixelRatio: Math.min(window.devicePixelRatio || 1, 2), msaa: 4, shadowSize: 4096, dof: true, dofSteps: 110, bloom: true, texSize: 512 },
    med: { tier: 'med', pixelRatio: Math.min(window.devicePixelRatio || 1, 1.5), msaa: 4, shadowSize: 2048, dof: true, dofSteps: 60, bloom: true, texSize: 512 },
    low: { tier: 'low', pixelRatio: Math.min(window.devicePixelRatio || 1, 1.25), msaa: 2, shadowSize: 1024, dof: false, dofSteps: 0, bloom: true, texSize: 256 },
  };
  const q = tiers[tier];
  if (params.get('dpr')) q.pixelRatio = parseFloat(params.get('dpr'));
  return q;
}
