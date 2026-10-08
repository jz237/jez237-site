import type R from '@dimforge/rapier3d-compat';
import {registerTerrainContacts} from './terrain-collision';
import type {CourseId} from './course-id';
type Point={x:number;z:number};
export type CountyCourseConfig={id:CourseId;name:string;controls:number[][];startZ:number;height(x:number,z:number):number;asphalt(x:number,z:number):boolean};
export function createCountyCourse(config:CountyCourseConfig){
const controls=config.controls;
const wrap=(n:number,p:number)=>((n%p)+p)%p;
function curve(t:number):Point{
 const u=wrap(t,1)*controls.length,i=Math.floor(u),f=u-i;
 const p=[-1,0,1,2].map(k=>controls[wrap(i+k,controls.length)]);
 const axis=(a:number)=>.5*((2*p[1][a])+(-p[0][a]+p[2][a])*f+(2*p[0][a]-5*p[1][a]+4*p[2][a]-p[3][a])*f*f+(-p[0][a]+3*p[1][a]-3*p[2][a]+p[3][a])*f*f*f);
 return{x:axis(0),z:axis(1)};
}
const path=Array.from({length:1025},(_,i)=>curve(i/1024)),distances=[0];
for(let i=1;i<path.length;i++)distances.push(distances[i-1]+Math.hypot(path[i].x-path[i-1].x,path[i].z-path[i-1].z));
const length=distances.at(-1)!;
// Arc-length sampling keeps checkpoint spacing and both starting grids consistent.
const start=(()=>{let best=Infinity,at=0;path.forEach((p,i)=>{const d=Math.hypot(p.x,p.z-config.startZ);if(d<best){best=d;at=distances[i];}});return at;})();
function point(t:number):Point{
 const distance=wrap(start+t*length,length);let lo=0,hi=distances.length-1;
 while(hi-lo>1){const mid=(lo+hi)>>1;if(distances[mid]<=distance)lo=mid;else hi=mid;}
 const mix=(distance-distances[lo])/(distances[hi]-distances[lo]),a=path[lo],b=path[hi];return{x:a.x+(b.x-a.x)*mix,z:a.z+(b.z-a.z)*mix};
}
const samples=Array.from({length:256},(_,i)=>point(i/256));
function distance(x:number,z:number){
 let nearest=Infinity;
 for(let i=0;i<samples.length;i++){const a=samples[i],b=samples[(i+1)%samples.length],dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz)));nearest=Math.min(nearest,(x-a.x-dx*t)**2+(z-a.z-dz*t)**2);}
 return Math.sqrt(nearest);
}
const terrain = { spanX: 440, spanZ: 360, step: 2, columns: 221, rows: 181 };
const { spanX, spanZ, step, columns, rows } = terrain;
const heights=Float32Array.from({length:columns*rows},(_,i)=>config.height(i%columns*step-spanX/2,Math.floor(i/columns)*step-spanZ/2));
/** Interpolate the actual shared terrain triangles, including their diagonal.
 * Spawn, camera and tyre effects use precisely the rendered/collidable height. */
function height(x: number, z: number) { const gx = Math.max(0, Math.min(columns - 1 - 1e-7, (x + spanX / 2) / step)), gz = Math.max(0, Math.min(rows - 1 - 1e-7, (z + spanZ / 2) / step)), ix = Math.floor(gx), iz = Math.floor(gz), u = gx - ix, v = gz - iz, a = heights[iz * columns + ix], b = heights[iz * columns + ix + 1], c = heights[(iz + 1) * columns + ix], d = heights[(iz + 1) * columns + ix + 1]; return u + v <= 1 ? a + (b - a) * u + (c - a) * v : d + (c - d) * (1 - u) + (b - d) * (1 - v); }
/** Identical vertices and diagonals serve rendering and independently owned
 * 32m CCD tiles. Triangle winding faces up and no second floor hides the hills. */
function terrainPatch(x0 = 0, z0 = 0, nx = columns - 1, nz = rows - 1) { const positions = new Float32Array((nx + 1) * (nz + 1) * 3), uv = new Float32Array((nx + 1) * (nz + 1) * 2), indices = new Uint32Array(nx * nz * 6); for (let z = 0; z <= nz; z++)
    for (let x = 0; x <= nx; x++) {
        const i = z * (nx + 1) + x, gx = x + x0, gz = z + z0;
        positions.set([gx * step - spanX / 2, heights[gz * columns + gx], gz * step - spanZ / 2], i * 3);
        uv.set([gx / (columns - 1), 1 - gz / (rows - 1)], i * 2);
    } let k = 0; for (let z = 0; z < nz; z++)
    for (let x = 0; x < nx; x++) {
        const a = z * (nx + 1) + x, b = a + 1, c = a + nx + 1, d = c + 1;
        indices.set([a, c, b, b, c, d], k);
        k += 6;
    } return { positions, uv, indices }; }
type CountySolid={id:string;x:number;y:number;z:number;half:readonly[number,number,number];yaw:number;material:'concrete'|'stripe'|'steel';collision:boolean};
const solids:readonly CountySolid[]=(()=>{
 const solids:CountySolid[]=[];
 for(const side of [-1,1]){
  const edge=Array.from({length:256},(_,i)=>{const p=point(i/256),a=point(i/256-.0001),b=point(i/256+.0001),yaw=Math.atan2(b.x-a.x,b.z-a.z);return{x:p.x+Math.cos(yaw)*side*17.5,z:p.z-Math.sin(yaw)*side*17.5};});
  edge.forEach((a,i)=>{const b=edge[(i+1)%edge.length];solids.push({id:`barrier_${side}_${i}`,x:(a.x+b.x)/2,y:height((a.x+b.x)/2,(a.z+b.z)/2)+.65,z:(a.z+b.z)/2,half:[.3,.85,Math.hypot(b.x-a.x,b.z-a.z)/2+.05],yaw:Math.atan2(b.x-a.x,b.z-a.z),material:i%12<6?'concrete':'stripe',collision:true});});
 }
 const p=point(0);
 for(const side of [-1,1])solids.push({id:'start_post_'+side,x:p.x,y:4,z:p.z+side*18,half:[.25,4,.25],yaw:0,material:'steel',collision:true});
 solids.push({id:'start_gantry',x:p.x,y:8.2,z:p.z,half:[.3,.2,18.25],yaw:0,material:'steel',collision:true});
 return solids;
})();
return {
 id:config.id,name:config.name,length,halfWidth:12,checkpointRadius:15,mapExtent:215,
 point,distance,samples,solids,terrain,terrainPatch,checkpoints:Array.from({length:24},(_,i)=>point(i/24)),height,
 surface:(x:number,z:number):'asphalt'|'gravel'=>config.asphalt(x,z)&&distance(x,z)<=12?'asphalt':'gravel',
 outside:(x:number,y:number,z:number)=>Math.abs(x)>210||Math.abs(z)>170||y< -8,
 isDrivingObstacle:(collider:R.Collider)=>(collider.parent()?.userData as {courseSurface?:string}|undefined)?.courseSurface!==config.id,
    buildPhysics(api: typeof R, world: R.World): number[] { const owned: number[] = []; try {
        const ground = world.createRigidBody(api.RigidBodyDesc.fixed());
        ground.userData={courseSurface:config.id};
        owned.push(ground.handle);
        const tiles: R.Collider[] = [];
        for (let z = 0; z < rows - 1; z += 16)
            for (let x = 0; x < columns - 1; x += 16) {
                const p = terrainPatch(x, z, Math.min(16, columns - 1 - x), Math.min(16, rows - 1 - z));
                tiles.push(world.createCollider(api.ColliderDesc.trimesh(p.positions, p.indices).setFriction(.85), ground));
            }
        registerTerrainContacts(world, tiles);
        for (const solid of solids) {
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

}
