import { writeFileSync } from 'node:fs';
import { quarryRim } from '../src/quarry-layout';

// The original cliff mesh samples its crest at whole-degree columns. Retain
// those exact endpoints; interpolate material coverage along the same segments.
const points = Array.from({ length: 56 }, (_, i) => {
  const a = (350 + i) * Math.PI / 180, rim = quarryRim(a);
  return [Math.sin(a) * rim.r * 1.08, rim.y, Math.cos(a) * rim.r];
});
writeFileSync(new URL('../source/north-forest-crest.json', import.meta.url),
  JSON.stringify({ version: 1, generator: 'tools/export-north-crest.ts',
    source: 'quarryRim; unchanged original cliff whole-degree crest columns', points }, null, 2) + '\n');
console.log(`Exported ${points.length} exact northern crest columns.`);
