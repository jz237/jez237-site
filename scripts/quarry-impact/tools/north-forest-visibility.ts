// Short CPU-only diagnostic: compare crown visibility against the exact wall.
// This measures wall occlusion, not alpha overlap or final photographic quality.
import * as T from 'three';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { captureForestCards } from './forest-card-audit';
import { terrainGeometry } from '../src/quarry-layout';

const output = process.argv[2];
if (!output) throw new Error('Pass a new JSON output path');
const baseline = JSON.parse(readFileSync(new URL('../tests/fixtures/north-forest-before.json', import.meta.url), 'utf8'));
const collisionBytes = readFileSync(new URL('../src/quarry-headwall-collision.json', import.meta.url));
const data = JSON.parse(collisionBytes.toString('utf8'));
const mesh = (positions: ArrayLike<number>, indices: ArrayLike<number>) => {
    const geometry = new T.BufferGeometry();
    geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
    geometry.setIndex(Array.from(indices));
    return new T.Mesh(geometry, new T.MeshBasicMaterial({ side: T.DoubleSide }));
};
const terrain = terrainGeometry(), blockers = [mesh(data.positions, data.indices), mesh(terrain.positions, terrain.indices)];
blockers.forEach(m => m.updateMatrixWorld());
const ray = new T.Raycaster(), direction = new T.Vector3(), target = new T.Vector3();
const cards = (await captureForestCards()).cards;
const views = [{ name: 'rear-centre', p: new T.Vector3(0, 1.25, -25.8) }, { name: 'rear-chase', p: new T.Vector3(0, 3.7, -28) }];
const report = views.map(view => ({ name: view.name, cards: cards.flatMap((card, index) => {
    const old = baseline.cards[index], a = (Math.atan2(old.matrix[12] / 1.08, old.matrix[14]) * 180 / Math.PI + 360) % 360;
    if (a > 25 && a < 350) return [];
    const [x, y, z] = card.matrix.slice(12, 15), h = card.matrix[5];
    const exposed = [.4, .5, .6, .7, .8, .9, 1].filter(fraction => {
        target.set(x, y + h * fraction, z); direction.subVectors(target, view.p);
        ray.set(view.p, direction.clone().normalize()); ray.far = direction.length() - .01;
        return ray.intersectObjects(blockers, false).length === 0;
    });
    return [{ index, kind: card.kind, x, y, z, height: h, exposed }];
}) }));
writeFileSync(output, JSON.stringify({ headwallCollisionSha256: createHash('sha256').update(collisionBytes).digest('hex'),
    note: 'CPU centre-line crown samples test wall/terrain occlusion only; photographic alpha overlap and final visual quality need matched images.', views: report }, null, 2) + '\n');
console.log(JSON.stringify(report.map(v => ({ view: v.name, total: v.cards.length,
    visibleTips: v.cards.filter(c => c.exposed.includes(1)).length,
    visibleUpperHalf: v.cards.filter(c => c.exposed.includes(.6)).length,
    visibleCrownSamples: v.cards.reduce((sum, c) => sum + c.exposed.length, 0) }))));
for (const object of blockers) { object.geometry.dispose(); object.material.dispose(); }
