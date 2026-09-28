import { quarryRim, seededRandom } from './quarry-layout';
import { backdropGroundHeight, type BackdropCard } from './scenery-backdrop';

/** Reuse only the existing silhouettes behind the 350°–25° headwall. */
export function composeNorthHeadwallBackdrop(original: readonly BackdropCard[]): BackdropCard[] {
    const random = seededRandom(529731);
    let local = 0;
    const stands = [
        { angle: 355, spread: 3.2, growth: 1.04 },
        { angle: 6.2, spread: 2.5, growth: .95 },
        { angle: 19.5, spread: 3.6, growth: 1 },
    ];
    // Unequal assignment breaks the repeated width/height rhythm. Depth layers
    // interleave species already present in the cards, keeping every draw group.
    const assignment = [0, 2, 1, 2, 0, 1, 2, 1, 0];
    return original.map(card => {
        const oldAngle = (Math.atan2(card.x / 1.08, card.z) * 180 / Math.PI + 360) % 360;
        if (oldAngle > 25 && oldAngle < 350) return card;
        const standIndex = assignment[local % assignment.length];
        const stand = stands[standIndex], layer = Math.floor(local / 3) % 3;
        let degrees = stand.angle + (random() + random() - 1) * stand.spread;
        // The authored collapse is9.5°–13.5°. Keep a genuine gap through that
        // notch, including crown width rather than merely separating trunks.
        if (standIndex === 1) degrees = Math.min(degrees, 7.7);
        if (standIndex === 2) degrees = Math.max(degrees, 16);
        // Short trees just behind the crest were entirely concealed by the
        // extraction face. Reuse those cards as mature crowns on the rising
        // outer terrain; the unequal depths expose overlapping silhouettes.
        const depth = [18, 32, 47][layer] + random() * [7, 10, 10][layer];
        const growth = ([17, 19, 20][layer] + random() * [5, 6, 5][layer]) * stand.growth;
        const limit = card.kind === 'pine' ? 26 : card.kind === 'spruce' ? 24 : card.kind === 'hemlock' ? 22 : 20;
        const height = Math.min(limit, growth);
        const a = degrees * Math.PI / 180, radius = quarryRim(a).r + depth;
        const x = Math.sin(a) * radius * 1.08, z = Math.cos(a) * radius;
        local++;
        return { ...card, x, z, ground: backdropGroundHeight(x, z) - .025,
            height, width: .93 + random() * .13 };
    });
}
