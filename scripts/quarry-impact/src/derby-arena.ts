import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {landscapeHeight} from './quarry-layout';

// Nearly twice the old 92 m arena's area. The offset keeps the quarry works
// outside the barrier, while leaving longer run-ups through the central floor.
export const DERBY_ARENA={x:18,z:14,radius:64,segments:96,spawnRadius:43,fenceRadius:70} as const;
export const LEGACY_ARENA={x:0,z:0,radius:46,segments:66,spawnRadius:29,fenceRadius:50} as const;
export type ArenaLayout={x:number;z:number;radius:number;segments:number;spawnRadius:number;fenceRadius:number;outline?:readonly {x:number;z:number}[]};
export function arenaBarrier(i:number,layout:ArenaLayout=DERBY_ARENA){
  const yaw=i/layout.segments*Math.PI*2,x=layout.x+Math.sin(yaw)*layout.radius,z=layout.z+Math.cos(yaw)*layout.radius;
  return {x,z,y:landscapeHeight(x,z),yaw};
}
export function expandedArenaFloor(){
  const segments=128,rings=20,positions:number[]=[],uv:number[]=[],indices:number[]=[];
  for(let ring=0;ring<=rings;ring++)for(let i=0;i<=segments;i++){
    const a=i/segments*Math.PI*2,r=ring/rings*(DERBY_ARENA.radius-.55),x=DERBY_ARENA.x+Math.sin(a)*r,z=DERBY_ARENA.z+Math.cos(a)*r;
    positions.push(x,landscapeHeight(x,z)+.018,z);uv.push(x/2,z/2);
    if(ring&&i<segments){const n=ring*(segments+1)+i,p=n-segments-1;indices.push(p,n,p+1,p+1,n,n+1);}
  }
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geometry.setIndex(indices);geometry.computeVertexNormals();
  const normals=geometry.attributes.normal;for(let i=0;i<=segments;i++)normals.setXYZ(i,0,1,0);return geometry;
}

/** Additive solo arena. The deployed online authority retains its exact layout. */
export class DerbyArenaPhysics {
  readonly walls:R.Collider[]=[];
  expanded=false;
  private fences:{collider:R.Collider;spec:{id:string;p:R.Vector;half:R.Vector}}[]=[];
  constructor(world:R.World,private originalWalls:R.Collider[],statics:Map<string,R.Collider>){
    for(let i=0;i<DERBY_ARENA.segments;i++){
      const p=arenaBarrier(i),q={x:0,y:Math.sin(p.yaw/2),z:0,w:Math.cos(p.yaw/2)};
      const collider=world.createCollider(R.ColliderDesc.cuboid(2.22,.58,.375).setTranslation(p.x,p.y+.58,p.z).setRotation(q).setFriction(.6).setRestitution(.02));
      collider.setEnabled(false);this.walls.push(collider);
    }
    for(const [id,collider]of statics)if(id.startsWith('fence-'))this.fences.push({collider,spec:{id,p:{...collider.translation()},half:{...collider.halfExtents()}}});
  }
  setMode(derby:boolean,online=false){
    const expanded=derby&&!online,changed=expanded!==this.expanded;
    this.originalWalls.forEach(c=>c.setEnabled(derby&&online));this.walls.forEach(c=>c.setEnabled(expanded));
    if(changed){
      const scale=DERBY_ARENA.fenceRadius/LEGACY_ARENA.fenceRadius;
      for(const {collider,spec} of this.fences){
        const x=expanded?DERBY_ARENA.x+spec.p.x*scale:spec.p.x,z=expanded?DERBY_ARENA.z+spec.p.z*scale:spec.p.z;
        collider.setTranslation({x,y:spec.p.y+(expanded?landscapeHeight(x,z):0),z});
        collider.setHalfExtents({...spec.half,z:spec.half.z*(expanded&&spec.id.startsWith('fence-wire-')?scale:1)});
      }
    }
    this.expanded=expanded;return changed;
  }
}
