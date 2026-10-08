import type R from '@dimforge/rapier3d-compat';
import { registerTerrainContacts } from './terrain-collision';
type Point = {
    x: number;
    z: number;
};
const HALF_STRAIGHT=50,RADIUS=42;
const length=4*HALF_STRAIGHT+Math.PI*2*RADIUS;
const wrap=(n:number,period:number)=>((n%period)+period)%period;
/** Arc-length stadium with a flat southern grid and a bidirectional northern jump. */
function point(t:number):Point{
 let s=wrap(t*length+HALF_STRAIGHT,length);
 if(s<2*HALF_STRAIGHT)return{x:-HALF_STRAIGHT+s,z:-RADIUS};
 s-=2*HALF_STRAIGHT;
 if(s<Math.PI*RADIUS){const a=s/RADIUS-Math.PI/2;return{x:HALF_STRAIGHT+RADIUS*Math.cos(a),z:RADIUS*Math.sin(a)};}
 s-=Math.PI*RADIUS;
 if(s<2*HALF_STRAIGHT)return{x:HALF_STRAIGHT-s,z:RADIUS};
 const a=(s-2*HALF_STRAIGHT)/RADIUS+Math.PI/2;return{x:-HALF_STRAIGHT+RADIUS*Math.cos(a),z:RADIUS*Math.sin(a)};
}
const samples=Array.from({length:384},(_,i)=>point(i/384));
const signedDistance=(x:number,z:number)=>Math.hypot(Math.max(0,Math.abs(x)-HALF_STRAIGHT),z)-RADIUS;
export function redbankGroundSample(x:number,z:number){return{distance:Math.abs(signedDistance(x,z)),asphalt:false};}
export const REDBANK_TERRAIN = { spanX: 280, spanZ: 200, step: 1, columns: 281, rows: 201 };
const { spanX, spanZ, step, columns, rows } = REDBANK_TERRAIN;
const smooth = (v: number) => { const t = Math.max(0, Math.min(1, v)); return t * t * (3 - 2 * t); };
/** Smooth ramp entries and a flat landing deck work in both race directions.
 * Outside banking rises across the turn, while the starting straight stays flat. */
export function redbankAuthoredHeight(x:number,z:number){
 const ramp=3.2*smooth((22-Math.abs(x))/17)*smooth((z-17)/10);
 const bank=Math.max(0,Math.min(18,signedDistance(x,z)+3))*.10*smooth((Math.abs(x)-43)/14);
 return ramp+bank;
}
export const REDBANK_HEIGHTS=Float32Array.from({length:columns*rows},(_,i)=>redbankAuthoredHeight(i%columns*step-spanX/2,Math.floor(i/columns)*step-spanZ/2));
/** Interpolate the actual shared terrain triangles, including their diagonal.
 * Spawn, camera and tyre effects use precisely the rendered/collidable height. */
function height(x: number, z: number) { const gx = Math.max(0, Math.min(columns - 1 - 1e-7, (x + spanX / 2) / step)), gz = Math.max(0, Math.min(rows - 1 - 1e-7, (z + spanZ / 2) / step)), ix = Math.floor(gx), iz = Math.floor(gz), u = gx - ix, v = gz - iz, a = REDBANK_HEIGHTS[iz * columns + ix], b = REDBANK_HEIGHTS[iz * columns + ix + 1], c = REDBANK_HEIGHTS[(iz + 1) * columns + ix], d = REDBANK_HEIGHTS[(iz + 1) * columns + ix + 1]; return u + v <= 1 ? a + (b - a) * u + (c - a) * v : d + (c - d) * (1 - u) + (b - d) * (1 - v); }
/** Identical vertices and diagonals serve rendering and independently owned
 * 16m CCD tiles. Triangle winding faces up and no second floor hides the hills. */
export function redbankTerrainPatch(x0 = 0, z0 = 0, nx = columns - 1, nz = rows - 1) { const positions = new Float32Array((nx + 1) * (nz + 1) * 3), uv = new Float32Array((nx + 1) * (nz + 1) * 2), indices = new Uint32Array(nx * nz * 6); for (let z = 0; z <= nz; z++)
    for (let x = 0; x <= nx; x++) {
        const i = z * (nx + 1) + x, gx = x + x0, gz = z + z0;
        positions.set([gx * step - spanX / 2, REDBANK_HEIGHTS[gz * columns + gx], gz * step - spanZ / 2], i * 3);
        uv.set([gx / (columns - 1), 1 - gz / (rows - 1)], i * 2);
    } let k = 0; for (let z = 0; z < nz; z++)
    for (let x = 0; x < nx; x++) {
        const a = z * (nx + 1) + x, b = a + 1, c = a + nx + 1, d = c + 1;
        indices.set([a, c, b, b, c, d], k);
        k += 6;
    } return { positions, uv, indices }; }
export type RedbankSolid = {
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
export const REDBANK_SOLIDS: readonly RedbankSolid[] = (() => { const result: RedbankSolid[] = []; for (let i = 0; i < 192; i++)
    for (const side of [-1, 1]) {
        const edge = (t: number) => { const p = point(t), q = point(t + .00001), yaw = Math.atan2(q.x - p.x, q.z - p.z); return { x: p.x + Math.cos(yaw) * 17.5 * side, z: p.z - Math.sin(yaw) * 17.5 * side }; };
        const a = edge(i / 192), b = edge((i + 1) / 192), x = (a.x + b.x) / 2, z = (a.z + b.z) / 2;
        result.push({ id: 'redbank_barrier_' + i + '_' + side, x, y: height(x, z) + .65, z, half: [.32, .85, (Math.hypot(b.x - a.x, b.z - a.z) + .12) / 2], yaw: Math.atan2(b.x - a.x, b.z - a.z), material: i % 8 < 4 ? 'concrete' : 'stripe' });
    } for (const side of [-1, 1])
    result.push({ id: 'redbank_finish_' + side, x: 0, y: 3.6, z: -42 + 20 * side, half: [.22, 3.6, .22], yaw: 0, material: 'steel' }); result.push({ id: 'redbank_bridge', x: 0, y: 7.3, z: -42, half: [.3, .3, 20.22], yaw: 0, material: 'steel' }); return result; })();
export const REDBANK = { isDrivingObstacle:(collider:R.Collider)=>(collider.parent()?.userData as {courseSurface?:string}|undefined)?.courseSurface!=='redbank-jump-v1', id: 'redbank-jump-v1' as const, name: 'Redbank Jump Circuit', length, halfWidth: 14, checkpointRadius: 16, point, samples, checkpoints: Array.from({ length: 24 }, (_, i) => point(i / 24)), height, distance: (x: number, z: number) => Math.abs(signedDistance(x,z)),
    surface(x: number, z: number): 'asphalt' | 'gravel' { return redbankGroundSample(x, z).asphalt ? 'asphalt' : 'gravel'; },
    outside: (x: number, y: number, z: number) => Math.abs(x) > 132 || Math.abs(z) > 92 || y < -8,
    buildPhysics(api: typeof R, world: R.World): number[] { const owned: number[] = []; try {
        const ground = world.createRigidBody(api.RigidBodyDesc.fixed());
        ground.userData={courseSurface:'redbank-jump-v1'};
        owned.push(ground.handle);
        const tiles: R.Collider[] = [];
        for (let z = 0; z < rows - 1; z += 16)
            for (let x = 0; x < columns - 1; x += 16) {
                const p = redbankTerrainPatch(x, z, Math.min(16, columns - 1 - x), Math.min(16, rows - 1 - z));
                tiles.push(world.createCollider(api.ColliderDesc.trimesh(p.positions, p.indices).setFriction(.85), ground));
            }
        registerTerrainContacts(world, tiles);
        for (const solid of REDBANK_SOLIDS) {
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
