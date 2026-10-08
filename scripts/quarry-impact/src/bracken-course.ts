import type R from '@dimforge/rapier3d-compat';
import { registerTerrainContacts } from './terrain-collision';
type Point = {
    x: number;
    z: number;
};
const wrap = (t: number) => ((t % 1) + 1) % 1;
// An original woodland rallycross loop: the southern grid straight leads into
// an eastern hairpin, an elevated gravel return and a broad western S-bend.
const controls: readonly Point[] = [{ x: 0, z: -82 }, { x: 72, z: -82 }, { x: 116, z: -52 }, { x: 106, z: 6 }, { x: 70, z: 42 }, { x: 33, z: 87 }, { x: -35, z: 87 }, { x: -102, z: 53 }, { x: -116, z: 0 }, { x: -105, z: -42 }, { x: -70, z: -82 }];
function raw(t: number): Point {
    const f = wrap(t) * controls.length, i = Math.floor(f), u = f - i, n = controls.length, p0 = controls[(i + n - 1) % n], p1 = controls[i], p2 = controls[(i + 1) % n], p3 = controls[(i + 2) % n];
    const axis = (k: 'x' | 'z') => .5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * u + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * u * u + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * u * u * u);
    return { x: axis('x'), z: axis('z') };
}
const dense = Array.from({ length: 4097 }, (_, i) => raw(i / 4096)), lengths = [0];
for (let i = 1; i < dense.length; i++)
    lengths.push(lengths[i - 1] + Math.hypot(dense[i].x - dense[i - 1].x, dense[i].z - dense[i - 1].z));
const length = lengths.at(-1)!;
function point(t: number): Point { const s = wrap(t) * length; let lo = 0, hi = 4096; while (lo + 1 < hi) {
    const m = (lo + hi) >> 1;
    if (lengths[m] <= s)
        lo = m;
    else
        hi = m;
} const f = (s - lengths[lo]) / (lengths[hi] - lengths[lo]); return { x: dense[lo].x + (dense[hi].x - dense[lo].x) * f, z: dense[lo].z + (dense[hi].z - dense[lo].z) * f }; }
const samples = Array.from({ length: 512 }, (_, i) => point(i / 512));
// Bucket every segment into an expanded cell range. Distant queries fall back
// to the full loop; track/surface queries normally inspect just nearby pieces.
const buckets = new Map<string, number[]>(), cell = 24;
for (let i = 0; i < samples.length; i++) {
    const a = samples[i], b = samples[(i + 1) % samples.length];
    for (let x = Math.floor((Math.min(a.x, b.x) - 24) / cell); x <= Math.floor((Math.max(a.x, b.x) + 24) / cell); x++)
        for (let z = Math.floor((Math.min(a.z, b.z) - 24) / cell); z <= Math.floor((Math.max(a.z, b.z) + 24) / cell); z++) {
            const key = x + ',' + z, indices = buckets.get(key) ?? [];
            indices.push(i);
            buckets.set(key, indices);
        }
}
function nearest(x: number, z: number) { let d2 = Infinity, station = 0; const indices = buckets.get(Math.floor(x / cell) + ',' + Math.floor(z / cell)); const visit = (i: number) => { const a = samples[i], b = samples[(i + 1) % samples.length], dx = b.x - a.x, dz = b.z - a.z, u = Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / (dx * dx + dz * dz))), v = (x - a.x - dx * u) ** 2 + (z - a.z - dz * u) ** 2; if (v < d2) {
    d2 = v;
    station = (i + u) / samples.length;
} }; if (indices)
    for (const i of indices)
        visit(i); if (!indices || d2 > 24 * 24)
    for (let i = 0; i < samples.length; i++)
        visit(i); return { distance: Math.sqrt(d2), station }; }
export function brackenGroundSample(x: number, z: number) { const n = nearest(x, z); return { distance: n.distance, asphalt: n.distance <= 12 && (n.station < .3 || n.station > .86) }; }
export const BRACKEN_TERRAIN = { spanX: 360, spanZ: 280, step: 2, columns: 181, rows: 141 };
const { spanX, spanZ, step, columns, rows } = BRACKEN_TERRAIN;
const smooth = (v: number) => { const t = Math.max(0, Math.min(1, v)); return t * t * (3 - 2 * t); };
const hill = (x: number, z: number) => 4.5 * Math.exp(-(((x - 42) / 90) ** 2 + ((z - 76) / 40) ** 2)) + 2.5 * Math.exp(-(((x + 20) / 12) ** 2 + ((z - 88) / 22) ** 2));
export const BRACKEN_HEIGHTS = Float32Array.from({ length: columns * rows }, (_, i) => { const x = i % columns * step - spanX / 2, z = Math.floor(i / columns) * step - spanZ / 2; return hill(x, z) * smooth((z + 40) / 30); });
/** Interpolate the actual shared terrain triangles, including their diagonal.
 * Spawn, camera and tyre effects use precisely the rendered/collidable height. */
function height(x: number, z: number) { const gx = Math.max(0, Math.min(columns - 1 - 1e-7, (x + spanX / 2) / step)), gz = Math.max(0, Math.min(rows - 1 - 1e-7, (z + spanZ / 2) / step)), ix = Math.floor(gx), iz = Math.floor(gz), u = gx - ix, v = gz - iz, a = BRACKEN_HEIGHTS[iz * columns + ix], b = BRACKEN_HEIGHTS[iz * columns + ix + 1], c = BRACKEN_HEIGHTS[(iz + 1) * columns + ix], d = BRACKEN_HEIGHTS[(iz + 1) * columns + ix + 1]; return u + v <= 1 ? a + (b - a) * u + (c - a) * v : d + (c - d) * (1 - u) + (b - d) * (1 - v); }
/** Identical vertices and diagonals serve rendering and independently owned
 * 32m CCD tiles. Triangle winding faces up and no second floor hides the hills. */
export function brackenTerrainPatch(x0 = 0, z0 = 0, nx = columns - 1, nz = rows - 1) { const positions = new Float32Array((nx + 1) * (nz + 1) * 3), uv = new Float32Array((nx + 1) * (nz + 1) * 2), indices = new Uint32Array(nx * nz * 6); for (let z = 0; z <= nz; z++)
    for (let x = 0; x <= nx; x++) {
        const i = z * (nx + 1) + x, gx = x + x0, gz = z + z0;
        positions.set([gx * step - spanX / 2, BRACKEN_HEIGHTS[gz * columns + gx], gz * step - spanZ / 2], i * 3);
        uv.set([gx / (columns - 1), 1 - gz / (rows - 1)], i * 2);
    } let k = 0; for (let z = 0; z < nz; z++)
    for (let x = 0; x < nx; x++) {
        const a = z * (nx + 1) + x, b = a + 1, c = a + nx + 1, d = c + 1;
        indices.set([a, c, b, b, c, d], k);
        k += 6;
    } return { positions, uv, indices }; }
export type BrackenSolid = {
    id: string;
    x: number;
    y: number;
    z: number;
    half: readonly [
        number,
        number,
        number
    ];
    yaw: number;
    material: 'concrete' | 'stripe' | 'steel';
};
export const BRACKEN_SOLIDS: readonly BrackenSolid[] = (() => { const result: BrackenSolid[] = []; for (let i = 0; i < 192; i++)
    for (const side of [-1, 1]) {
        const edge = (t: number) => { const p = point(t), q = point(t + .00001), yaw = Math.atan2(q.x - p.x, q.z - p.z); return { x: p.x + Math.cos(yaw) * 15.8 * side, z: p.z - Math.sin(yaw) * 15.8 * side }; };
        const a = edge(i / 192), b = edge((i + 1) / 192), x = (a.x + b.x) / 2, z = (a.z + b.z) / 2;
        result.push({ id: 'bracken_barrier_' + i + '_' + side, x, y: height(x, z) + .65, z, half: [.32, .85, (Math.hypot(b.x - a.x, b.z - a.z) + .12) / 2], yaw: Math.atan2(b.x - a.x, b.z - a.z), material: i % 8 < 4 ? 'concrete' : 'stripe' });
    } for (const side of [-1, 1])
    result.push({ id: 'bracken_finish_' + side, x: 0, y: 3.6, z: -82 + 18 * side, half: [.22, 3.6, .22], yaw: 0, material: 'steel' }); result.push({ id: 'bracken_bridge', x: 0, y: 7.3, z: -82, half: [.3, .3, 18.22], yaw: 0, material: 'steel' }); return result; })();
export const BRACKEN = { isDrivingObstacle:(collider:R.Collider)=>(collider.parent()?.userData as {courseSurface?:string}|undefined)?.courseSurface!=='bracken-rallycross-v1', id: 'bracken-rallycross-v1' as const, name: 'Bracken Rallycross', length, halfWidth: 12, checkpointRadius: 16, point, samples, checkpoints: Array.from({ length: 24 }, (_, i) => point(i / 24)), height, distance: (x: number, z: number) => nearest(x, z).distance,
    surface(x: number, z: number): 'asphalt' | 'gravel' { return brackenGroundSample(x, z).asphalt ? 'asphalt' : 'gravel'; },
    outside: (x: number, y: number, z: number) => Math.abs(x) > 172 || Math.abs(z) > 132 || y < -8,
    buildPhysics(api: typeof R, world: R.World): number[] { const owned: number[] = []; try {
        const ground = world.createRigidBody(api.RigidBodyDesc.fixed());
        ground.userData={courseSurface:'bracken-rallycross-v1'};
        owned.push(ground.handle);
        const tiles: R.Collider[] = [];
        for (let z = 0; z < rows - 1; z += 16)
            for (let x = 0; x < columns - 1; x += 16) {
                const p = brackenTerrainPatch(x, z, Math.min(16, columns - 1 - x), Math.min(16, rows - 1 - z));
                tiles.push(world.createCollider(api.ColliderDesc.trimesh(p.positions, p.indices).setFriction(.85), ground));
            }
        registerTerrainContacts(world, tiles);
        for (const solid of BRACKEN_SOLIDS) {
            const b = world.createRigidBody(api.RigidBodyDesc.fixed().setTranslation(solid.x, solid.y, solid.z).setRotation({ x: 0, y: Math.sin(solid.yaw / 2), z: 0, w: Math.cos(solid.yaw / 2) }));
            owned.push(b.handle);
            world.createCollider(api.ColliderDesc.cuboid(...solid.half).setFriction(.35), b);
        }
        return owned;
    }
    catch (error) {
        for (const h of owned) {
            const b = world.getRigidBody(h);
            if (b)
                world.removeRigidBody(b);
        }
        throw error;
    } }
};
