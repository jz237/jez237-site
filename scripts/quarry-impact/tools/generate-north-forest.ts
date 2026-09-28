import { readFileSync, writeFileSync } from 'node:fs';
import { quarryRim, seededRandom } from '../src/quarry-layout';
import { backdropGroundHeight } from '../src/scenery-backdrop';

// Engineering placement data. This private seed never consumes the world RNG.
const random = seededRandom(7362501);
const measured = JSON.parse(readFileSync(new URL('../source/models/quarry-north-fir-proxies.json', import.meta.url), 'utf8')).variants as
    { variant: number; normalizedStemRadius: number; normalizedStemHeight: number; parts: number[][]; bands: number[][];
        groundPlate: { maxNormalizedY: number; supportDirections: number; selection: string; points: number[][] } }[];
const radians = Math.PI / 180;
const polar = (degrees: number, depth: number) => {
    const a = degrees * radians, radius = quarryRim(a).r + depth;
    const x = Math.sin(a) * radius * 1.08, z = Math.cos(a) * radius;
    return { x, z, y: backdropGroundHeight(x, z) - .025 };
};
const definitions = [
    { angle: 352.4, depth: 23, majorRadius: 20, minorRadius: 14, variant: 0 },
    { angle: 360.8, depth: 30, majorRadius: 23, minorRadius: 17, variant: 1 },
    { angle: 366.1, depth: 24, majorRadius: 20, minorRadius: 14, variant: 0 },
    { angle: 378.5, depth: 24, majorRadius: 25, minorRadius: 15, variant: 1 },
    { angle: 389.0, depth: 27, majorRadius: 27, minorRadius: 17, variant: 0 },
    { angle: 400.0, depth: 24, majorRadius: 24, minorRadius: 15, variant: 1 },
];
const stands = definitions.map((s, i) => {
    const p = polar(s.angle, s.depth), a = s.angle * radians;
    return { id: 'stand-' + i, x: p.x, z: p.z, majorRadius: s.majorRadius,
        minorRadius: s.minorRadius, yaw: Math.atan2(-Math.sin(a), Math.cos(a) * 1.08),
        groundWeight: [.92, 1, .86, .96, 1, .9][i], angleDegrees: s.angle % 360,
        depth: s.depth, variant: s.variant };
});
const trees: { id: string; stand: string; variant: number; x: number; y: number; z: number;
    height: number; width: number; yaw: number; trunkRadius: number; trunkHeight: number;
    seating?: { centerGroundY: number; centerBaseline: number; burialHeight: number } }[] = [];
const understory: { id: string; stand: string; variant: number; x: number; y: number; z: number;
    height: number; width: number; yaw: number }[] = [];
const mediumTrees: typeof trees = [];
for (const [i, definition] of definitions.entries()) {
    const angles = [-3.35, -1.15, 1.15, 3.3, -2.7, -.25, 2.25, .8];
    const depths = [-9, -12, -8, -5, 4, 5, 7, 14];
    for (let j = 0; j < 8; j++) {
        let angle = definition.angle + angles[j] + (random() - .5) * .65;
        angle = Math.max(350.2, Math.min(404.6, angle));
        if (i === 2) angle = Math.min(angle, 367.65);
        if (i === 3) angle = Math.max(angle, 376.2);
        const depth = definition.depth + depths[j] + (random() - .5) * 2.8;
        const p = polar(angle, depth), height = [21.4, 23.1, 19.2, 22.3, 20.8, 23.6, 21.1, 18.8][j] + (random() - .5) * 1.3;
        const variant = i === 5 && j === 7 ? 2 : definition.variant;
        const width = 1.12 + random() * .22;
        const yaw = random() * Math.PI * 2, centerBaseline = p.y;
        for (const vertex of measured[variant].groundPlate.points) {
            const x = p.x + (Math.cos(yaw) * vertex[0] + Math.sin(yaw) * vertex[2]) * height * width;
            const z = p.z + (-Math.sin(yaw) * vertex[0] + Math.cos(yaw) * vertex[2]) * height * width;
            p.y = Math.min(p.y, backdropGroundHeight(x, z) - vertex[1] * height - .025);
        }
        trees.push({ id: `${i}-${j}`, stand: stands[i].id, variant, ...p,
            height, width, yaw,
            trunkRadius: height * width * measured[variant].normalizedStemRadius,
            trunkHeight: height * measured[variant].normalizedStemHeight,
            seating: { centerGroundY: centerBaseline + .025, centerBaseline, burialHeight: centerBaseline - p.y } });
    }
    for (let j = 0; j < 6; j++) {
        let angle = definition.angle + [-3.4, -1.7, -.25, 1.3, 2.9, .65][j] + (random() - .5) * .6;
        angle = Math.max(350.3, Math.min(404.5, angle));
        if (i === 2) angle = Math.min(angle, 367.6);
        if (i === 3) angle = Math.max(angle, 376.3);
        const p = polar(angle, definition.depth - 15 + [2, -1, 1, 4, 2, 9][j] + random() * 2);
        const height = 6.4 + random() * 3.5, width = 1.05 + random() * .18;
        mediumTrees.push({ id: `${i}-${j}`, stand: stands[i].id, variant: i % 3, ...p,
            height, width, yaw: random() * Math.PI * 2, trunkRadius: height * .014 * width, trunkHeight: height * .85 });
    }
    // Unequal little regeneration groups fill the forest floor while leaving
    // mineral gaps between stands. Existing plants and their RNG stay untouched.
    for (let j = 0; j < 8; j++) {
        const cluster = j < 5 ? 0 : 1;
        const p = polar(definition.angle + (cluster ? 2.05 : -.7) + (random() - .5) * 1.5,
            definition.depth - 11 + cluster * 6 + random() * 4.5);
        understory.push({ id: `${i}-${j}`, stand: stands[i].id, variant: i % 3, ...p,
            height: 1.15 + random() * 1.9, width: 1.3 + random() * .4, yaw: random() * Math.PI * 2 });
    }
}
const notch = polar(371.5, 29);
const data = {
    version: 1,
    units: 'metres; world Y up; ellipse yaw radians, major axis (cos(yaw), sin(yaw)) in world XZ',
    sector: { startDegrees: 350, endDegrees: 45 },
    rootConvention: 'Mature y is the minimum exact terrain support under its rotated/scaled low Trunk plate, buried0.025m; medium and small plants retain center terrain minus0.025m',
    rootSeating: { burialMetres: .025, source: 'source/models/quarry-north-fir-proxies.json',
        footprints: measured.map(source => ({ variant: source.variant, ...source.groundPlate })) },
    lod: { nearDistance: 55, hysteresis: .15, cellConvention: 'one spatial batch per authored stand' },
    stands,
    openings: [{ id: 'headwall-notch', x: notch.x, z: notch.z, majorRadius: 34,
        minorRadius: 8, yaw: Math.PI / 2 - 371.5 * radians, strength: 1 }],
    trees, mediumTrees, understory,
    rootHulls: measured.map(source => ({ variant: source.variant, parts: source.parts, bands: source.bands })),
};
writeFileSync(new URL('../src/quarry-north-forest.json', import.meta.url), JSON.stringify(data, null, 2) + '\n');
console.log(JSON.stringify({ stands: stands.length, trees: trees.length, understory: understory.length,
    bounds: trees.reduce((b, p) => [Math.min(b[0], p.x), Math.min(b[1], p.z), Math.max(b[2], p.x), Math.max(b[3], p.z)], [Infinity, Infinity, -Infinity, -Infinity]) }));
