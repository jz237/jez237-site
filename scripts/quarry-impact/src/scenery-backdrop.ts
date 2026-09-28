import { landscapeHeight, quarryRim, seededRandom } from './quarry-layout';
import firs from './quarry-backdrop-trees.json';

export type BackdropCard = {
    kind: string; x: number; z: number; height: number; ground: number;
    color: readonly [number, number, number]; width?: number;
};

// This narrow sector is visible above the new south-eastern extraction face.
// Everything outside it keeps its original transform and random sequence.
export const BACKDROP_SECTOR = { start: 133, end: 178 };
export const BACKDROP_CENTER = {
    x: firs.reduce((sum, p) => sum + p.x, 0) / firs.length,
    z: firs.reduce((sum, p) => sum + p.z, 0) / firs.length,
};
const stands = [
    { angle: 136.8, spread: 5.1, rise: .88 },
    { angle: 148.0, spread: 6.1, rise: 1.08 },
    { angle: 159.1, spread: 5.7, rise: .95 },
    { angle: 170.2, spread: 6.2, rise: 1.03 },
];

/** Seat the root on the same Float32 triangles used by the terrain renderer and physics. */
export function backdropGroundHeight(x: number, z: number) {
    const step = 640 / 192, ix = Math.floor((x + 320) / step), iz = Math.floor((z + 320) / step);
    const x0 = Math.fround(ix * step - 320), x1 = Math.fround((ix + 1) * step - 320);
    const z0 = Math.fround(iz * step - 320), z1 = Math.fround((iz + 1) * step - 320);
    const u = (x - x0) / (x1 - x0), v = (z - z0) / (z1 - z0);
    const a = Math.fround(landscapeHeight(x0, z0)), b = Math.fround(landscapeHeight(x0, z1));
    const c = Math.fround(landscapeHeight(x1, z0)), d = Math.fround(landscapeHeight(x1, z1));
    return u + v <= 1 ? a * (1 - u - v) + b * v + c * u : b * (1 - u) + c * (1 - v) + d * (u + v - 1);
}

function position(degrees: number, depth: number) {
    const a = degrees * Math.PI / 180, r = quarryRim(a).r + depth;
    const x = Math.sin(a) * r * 1.08, z = Math.cos(a) * r;
    return { x, z, ground: backdropGroundHeight(x, z) - .025 };
}

export function composeForestBackdrop(original: readonly BackdropCard[]): BackdropCard[] {
    const random = seededRandom(8093816);
    let localIndex = 0;
    const cards = original.map(card => {
        const angle = (Math.atan2(card.x / 1.08, card.z) * 180 / Math.PI + 360) % 360;
        if (angle < BACKDROP_SECTOR.start || angle > BACKDROP_SECTOR.end) return card;
        const stand = stands[localIndex % stands.length], layer = Math.floor(localIndex / stands.length) % 3;
        // A triangular distribution overlaps crowns near each stand's heart,
        // with thinner shoulders and unequal gaps between neighbouring stands.
        let degrees = stand.angle + (random() + random() - 1) * stand.spread;
        let depth = [5, 12, 24][layer] + random() * [6, 11, 12][layer];
        const species = card.kind === 'maple' ? .8 : card.kind === 'hemlock' ? .92 : 1;
        const growth = ([12, 17, 22][layer] + random() * [4, 6, 7][layer]) * stand.rise * species;
        const height = card.kind === 'maple' ? Math.min(20, growth) : growth;
        // Twelve existing crowns bridge the exposed hillside wedges rather
        // than spending all of their overlap inside already dense stand cores.
        const cohort = Math.floor(localIndex / 16), within = localIndex % 16;
        if (cohort < 3 && within % 5 === 0) {
            const shoulder = [142, 153.5, 165, 175][within / 5];
            degrees = shoulder + (cohort - 1) * .9 + (degrees - stand.angle) * .22;
            depth = 14 + cohort * 7 + depth % 5;
        }
        localIndex++;
        return { ...card, ...position(degrees, depth), height, width: .91 + random() * .16 };
    });
    // Most of the eastern cohorts were still concealed behind the tall wall.
    // Reuse all fourteen as overlapping low crowns across the central visible
    // lawn: two staggered depths, with narrow gaps between unequal-height trees.
    const lowShoulders = [166.4, 168.0, 169.2, 170.4, 172.0, 173.4, 175.2];
    for (let i = 0; i < 14; i++) {
        const rear = Math.floor(i / lowShoulders.length);
        const degrees = lowShoulders[i % lowShoulders.length] + (rear ? .55 : -.35) + (random() - .5) * .65;
        const kind = ['hemlock', 'spruce', 'pine'][i % 3];
        cards.push({ kind, ...position(degrees, 29 + rear * 12 + random() * 3.6), height: 4.8 + random() * 3.2,
            width: .94 + random() * .22, color: [.86, .94, .88] });
    }
    return cards;
}

/** Three visible shared solid trunks use the existing 40k-triangle far fir meshes. */
export function backdropFirs(variant: number) {
    return firs.filter(tree => tree.variant === variant).map(tree => ({ ...tree, ground: tree.y, backdrop: true }));
}
