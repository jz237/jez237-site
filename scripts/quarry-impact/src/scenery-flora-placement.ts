import { nearTrees, quarryRoadsideHeight, seededRandom } from './quarry-layout';
import { trackPoint } from './rules';
import roadside from './quarry-roadside-data.json';

type Pocket = { x: number; z: number; along: number; across: number; yaw: number; trees: number; cover: number };
export type RoadsideSapling = {
    x: number; z: number; ground: number; height: number; width: number; yaw: number; variant: number;
};
export type RoadsideBlade = {
    x: number; z: number; ground: number; height: number; width: number; yaw: number; brown: boolean; shade: number;
};

// Authored sheltered pockets supplied with the roadside ground. Positive gaps
// between them keep exposed deposits and the drainage channels legible.
const pockets: Pocket[] = roadside.vegetationPockets.map((p, i) => {
    const angle = Math.atan2(p.x / 1.08, p.z);
    return { x: p.x, z: p.z, along: p.radius, across: p.radius * .73,
        yaw: Math.atan2(-Math.sin(angle), Math.cos(angle) * 1.08), trees: [1, 0, 1, 0, 2][i] ?? 0, cover: 90 };
});
// These two existing mature trees remain the composition's vertical anchors.
// Their shared placements supply exact positions; the art generator keeps a
// two-metre fragment-free root area. Young growth belongs beneath their cover.
for (const [kind, index] of [['fir-0', 10], ['fir-1', 5]] as const) {
    const tree = nearTrees(kind).find(p => p.colliderIndex === index);
    if (tree) pockets.push({ x: tree.x, z: tree.z, along: 2, across: 1.75,
        yaw: tree.yaw, trees: 3, cover: 140 });
}
const track = Array.from({ length: 481 }, (_, i) => trackPoint(i / 480));
let cached: { saplings: RoadsideSapling[]; blades: RoadsideBlade[] } | undefined;

function build() {
    if (cached) return cached;
    const random = seededRandom(3928714), saplings: RoadsideSapling[] = [], blades: RoadsideBlade[] = [];
    const solidTrees = ['fir-0', 'fir-1', 'fir-2'].flatMap(nearTrees);
    const roadDistance = (x: number, z: number) => {
        let nearest = Infinity;
        for (const p of track) nearest = Math.min(nearest, (x - p.x) ** 2 + (z - p.z) ** 2);
        return Math.sqrt(nearest);
    };
    const drainageClear = (x: number, z: number, footprint: number) => {
        for (const corridor of roadside.bareDrainageCorridors)
            for (let i = 1; i < corridor.length; i++) {
                const a = corridor[i - 1], b = corridor[i], dx = b.x - a.x, dz = b.z - a.z;
                const t = Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / (dx * dx + dz * dz || 1)));
                if (Math.hypot(x - a.x - dx * t, z - a.z - dz * t) < Math.max(a.radius, b.radius) + footprint) return false;
            }
        return true;
    };
    const site = (x: number, z: number, footprint: number, clearance: number) => {
        const y = quarryRoadsideHeight(x, z);
        if (y === undefined || roadDistance(x, z) < clearance || !drainageClear(x, z, footprint)) return;
        const support = [[footprint, 0], [-footprint, 0], [0, footprint], [0, -footprint]]
            .map(([dx, dz]) => quarryRoadsideHeight(x + dx, z + dz));
        if (support.some(h => h === undefined)) return;
        const samples = [y, ...support as number[]];
        // Plants root on sheltered ground, not on steep rock fragments. Bury
        // their roots slightly across the footprint without leaning the trunks.
        if (Math.max(...samples) - Math.min(...samples) > footprint * 1.1) return;
        return Math.min(...samples) - .018;
    };
    const point = (p: Pocket, radius: number, angle: number) => {
        const u = Math.cos(angle) * radius * p.along, v = Math.sin(angle) * radius * p.across;
        return { x: p.x + Math.cos(p.yaw) * u - Math.sin(p.yaw) * v,
            z: p.z + Math.sin(p.yaw) * u + Math.cos(p.yaw) * v };
    };
    for (const [pocketIndex, pocket] of pockets.entries()) {
        let planted = 0;
        for (let attempt = 0; attempt < 96 && planted < pocket.trees; attempt++) {
            const p = point(pocket, Math.sqrt(random()) * .72, random() * Math.PI * 2);
            const age = [2.65, 1.35, 1.85][planted % 3];
            const height = age * (.9 + random() * .18);
            const ground = site(p.x, p.z, .22, 9 + height * .3);
            if (ground === undefined || solidTrees.some(t => Math.hypot(t.x - p.x, t.z - p.z) < 1.15)
                || saplings.some(t => Math.hypot(t.x - p.x, t.z - p.z) < .7 + (t.height + height) * .19)) continue;
            saplings.push({ ...p, ground, height, width: .8 + random() * .28, yaw: random() * Math.PI * 2,
                variant: (pocketIndex + planted) % 3 });
            planted++;
        }
        // Elliptical patches contain small overlapping clumps, sparse edges and
        // internal bare holes. Low growth supports the trees instead of reading
        // as a second uniformly scattered forest layer.
        for (let clump = 0; clump < pocket.cover; clump++) {
            const radius = Math.sqrt(random()), angle = random() * Math.PI * 2;
            if (random() < radius * .34 || (radius > .26 && radius < .47 && Math.sin(angle * 2.1 + pocketIndex) > .42)) continue;
            const p = point(pocket, radius, angle), height = .10 + random() * .18;
            const brown = random() < .3, bladeCount = 11 + Math.floor(random() * 5);
            for (let blade = 0; blade < bladeCount; blade++) {
                const a = random() * Math.PI * 2, spread = Math.sqrt(random()) * .22;
                const x = p.x + Math.cos(a) * spread, z = p.z + Math.sin(a) * spread;
                const ground = site(x, z, .08, 8.65);
                if (ground === undefined) continue;
                blades.push({ x, z, ground, height: height * (.62 + random() * .65),
                    yaw: a + (random() - .5) * .5, brown, shade: .79 + random() * .24, width: 2.1 + random() * .85 });
            }
        }
    }
    cached = { saplings, blades };
    return cached;
}

export function roadsideSaplings(variant: number) {
    return build().saplings.filter(p => p.variant === variant);
}
export function roadsideGroundCover() { return build().blades; }
