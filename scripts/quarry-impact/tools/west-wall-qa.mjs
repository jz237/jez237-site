// Keep all eleven accepted material views, adding ordinary north/south approach
// and two flank inspections for the western -85..-35 degree geometry milestone.
process.env.QUARRY_CLIFF_PHASE = process.env.QUARRY_WEST_PHASE || 'baseline';
process.env.QUARRY_CLIFF_OUTPUT = process.env.QUARRY_WEST_OUTPUT || 'outputs/west-wall';
process.env.QUARRY_CLIFF_EXPECTED_BUNDLE = process.env.QUARRY_WEST_EXPECTED_BUNDLE || './assets/index-Dew9mhki.js';
if (process.env.QUARRY_CLIFF_PHASE === 'baseline')
  process.env.QUARRY_CLIFF_EXPECTED_SHA256 = 'b51476a668aafc2e0d3ed072a7528261647393a2bab0f21f7921e09bb8446d60';
process.env.QUARRY_CLIFF_ADDITIONAL_VIEWS = JSON.stringify([
  { name: 'west-north-approach', degrees: -38 },
  { name: 'west-south-approach', degrees: -82 },
  { name: 'west-north-oblique', position: [-81, 3.5, 78], aim: [-138, 16, 110] },
  { name: 'west-south-oblique', position: [-100, 3.5, 8], aim: [-163, 17, 44] },
]);
await import('./cliff-material-qa.mjs');
