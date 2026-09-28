import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { captureForestCards } from '../tools/forest-card-audit';
import { composeNorthHeadwallBackdrop } from '../src/scenery-north-backdrop';
import { type BackdropCard } from '../src/scenery-backdrop';
import { quarryRim, terrainGeometry } from '../src/quarry-layout';
import { createSurfaceSampler } from '../src/quarry-surface-sampler';

const baseline = JSON.parse(readFileSync(new URL('./fixtures/north-forest-before.json', import.meta.url), 'utf8')) as Awaited<ReturnType<typeof captureForestCards>>;
const angle = (x: number, z: number) => (Math.atan2(x / 1.08, z) * 180 / Math.PI + 360) % 360;
const local = (x: number, z: number) => { const a = angle(x, z); return a >= 350 || a <= 25; };

test('actual forest renderer keeps all384 cards/four draws, original RNG and every off-sector transform/color', async () => {
    const current = await captureForestCards();
    assert.equal(baseline.cards.length, 384); assert.equal(current.cards.length, baseline.cards.length);
    assert.equal(current.draws, baseline.draws); assert.equal(current.draws, 4);
    assert.equal(current.finalRandom, baseline.finalRandom, 'regrouping must not change later grass random draws');
    let moved = 0;
    for (let i = 0; i < baseline.cards.length; i++) {
        const before = baseline.cards[i], after = current.cards[i];
        assert.equal(after.kind, before.kind); assert.deepEqual(after.color, before.color);
        if (!local(before.matrix[12], before.matrix[14])) assert.deepEqual(after, before, `off-sector card${i}`);
        else { assert.notDeepEqual(after.matrix, before.matrix); moved++; }
    }
    assert.equal(moved, baseline.cards.filter(c => local(c.matrix[12], c.matrix[14])).length);
    assert.equal(moved, 31, 'measured from actual frozen renderer, not an approximate requested count');
});

test('north regrouping is pure/deterministic and seats roots on actual terrain triangles behind the crest', () => {
    const input: BackdropCard[] = baseline.cards.map(c => ({ kind: c.kind, x: c.matrix[12], z: c.matrix[14],
        ground: c.matrix[13], height: c.matrix[5], color: c.color as [number, number, number], width: c.matrix[0] / c.matrix[5] }));
    const frozen = structuredClone(input), first = composeNorthHeadwallBackdrop(input), second = composeNorthHeadwallBackdrop(input);
    assert.deepEqual(first, second); assert.deepEqual(input, frozen);
    const ground = createSurfaceSampler(terrainGeometry());
    const layers = [0, 0, 0];
    for (let i = 0; i < input.length; i++) {
        const tree = first[i];
        if (!local(input[i].x, input[i].z)) { assert.equal(tree, input[i]); continue; }
        assert.ok(Object.values(tree).filter(v => typeof v === 'number').every(Number.isFinite));
        const degrees = angle(tree.x, tree.z), depth = Math.hypot(tree.x / 1.08, tree.z) - quarryRim(degrees * Math.PI / 180).r;
        assert.ok(depth >= 17.999 && depth <= 57.001, 'cards remain on the undisturbed terrain beyond the exact crest');
        layers[depth < 26 ? 0 : depth < 43 ? 1 : 2]++;
        assert.ok(Math.abs(tree.ground - (ground.height(tree.x, tree.z)! - .025)) < 1e-5, 'root seating must match rendered triangle interpolation');
        assert.ok(tree.height >= 16 && tree.height <= 26.1); if (tree.kind === 'maple') assert.ok(tree.height <= 20);
        assert.ok(degrees < 9.5 || degrees > 13.5, 'the collapse notch retains an opening');
    }
    assert.ok(layers.every(count => count >= 8), 'three populated depth layers rather than a single evenly spaced row');
});
