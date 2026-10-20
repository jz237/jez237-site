import * as T from 'three';
import type R from '@dimforge/rapier3d-compat';
import {tagImpactMaterial} from './impact-material';
/** Loose tyre stacks and oil drums for the offline-only arenas: light rigid bodies that cars send
 * flying, reset for every event and recorded in replays like the Quarry's barrels and tyres. */
export type PropSpot={kind:'tyres'|'drum';x:number;z:number};
export type ArenaProp={mesh:T.Mesh;body:R.RigidBody;start:T.Vector3};
const ring=(r:number,n:number,phase=0)=>Array.from({length:n},(_,i)=>{const a=phase+i/n*Math.PI*2;return{x:Math.sin(a)*r,z:Math.cos(a)*r};});
/** Spots kept clear of the spawn rings (Kestrel/Gullhaven 32 m, Moorfield 26 m). */
export const ARENA_PROP_SPOTS:Record<string,readonly PropSpot[]>={
  'kestrel-ring-v1':[...ring(17.5,6,Math.PI/6).map(p=>({kind:'tyres' as const,...p})),...ring(45,8).map(p=>({kind:'drum' as const,...p}))],
  'gullhaven-yard-v1':[...[-40,-20,0,20,40].flatMap(x=>[{kind:'drum' as const,x,z:40},{kind:'drum' as const,x,z:-40}]),...[-20,0,20].flatMap(z=>[{kind:'tyres' as const,x:54,z},{kind:'tyres' as const,x:-54,z}])],
  // Flat classic bowls (floor + ring wall only). They also host online derbies, where props are switched off.
  'harrow-bowl-v1':[...ring(8,4,Math.PI/4).map(p=>({kind:'tyres' as const,...p})),...ring(43,10).map(p=>({kind:'drum' as const,...p}))],
  'wrenford-pit-v1':[...ring(7,3).map(p=>({kind:'tyres' as const,...p})),...ring(35,8,Math.PI/8).map(p=>({kind:'drum' as const,...p}))],
  // Heightfield arenas, placed on their flat bands (Foundry yard r < 38, Briarhill between crest and banks 20–40 m).
  'foundry-yard-v1':[...ring(10,4,Math.PI/4).map(p=>({kind:'tyres' as const,...p})),...ring(24,8,Math.PI/8).map(p=>({kind:'drum' as const,...p}))],
  'briarhill-bowl-v1':[...ring(22,5).map(p=>({kind:'tyres' as const,...p})),...ring(28,8,Math.PI/8).map(p=>({kind:'drum' as const,...p}))],
  'moorfield-speedbowl-v1':[...[-24,-12,0,12,24].flatMap(x=>[{kind:'drum' as const,x,z:31},{kind:'drum' as const,x,z:-31}]),...[[60,8],[60,-8],[-60,8],[-60,-8]].map(([x,z])=>({kind:'tyres' as const,x,z}))],
};
export const TYRES_PER_STACK=3;
const TYRE={radius:.46,half:.13,mass:10},DRUM={radius:.3,half:.44,mass:18};
const DRUM_COLORS=[0xb3362c,0x2f5d8c,0xc9a227,0x3f6b3a];
export function createArenaProps(api:typeof R,world:R.World,root:T.Object3D,spots:readonly PropSpot[],height:(x:number,z:number)=>number=()=>0){
  const tyreGeometry=new T.TorusGeometry(TYRE.radius-TYRE.half,TYRE.half*1.05,8,18);tyreGeometry.rotateX(Math.PI/2);
  const drumGeometry=new T.CylinderGeometry(DRUM.radius,DRUM.radius,DRUM.half*2,16);
  const rubber=new T.MeshStandardMaterial({color:0x1b1b1a,roughness:.95});
  const paints=DRUM_COLORS.map(color=>new T.MeshStandardMaterial({color,roughness:.6,metalness:.35}));
  const props:ArenaProp[]=[];
  const add=(mesh:T.Mesh,x:number,y:number,z:number,collider:R.ColliderDesc,material:'rubber'|'metal')=>{
    const body=world.createRigidBody(api.RigidBodyDesc.dynamic().setTranslation(x,y,z).setLinearDamping(.15).setAngularDamping(.25));
    tagImpactMaterial(world.createCollider(collider,body),material);
    mesh.castShadow=mesh.receiveShadow=true;mesh.position.set(x,y,z);root.add(mesh);props.push({mesh,body,start:new T.Vector3(x,y,z)});
  };
  spots.forEach((s,i)=>{
    const ground=height(s.x,s.z);
    if(s.kind==='tyres')for(let k=0;k<TYRES_PER_STACK;k++)add(new T.Mesh(tyreGeometry,rubber),s.x,ground+TYRE.half+k*TYRE.half*2.02,s.z,api.ColliderDesc.cylinder(TYRE.half,TYRE.radius).setMass(TYRE.mass).setFriction(.9).setRestitution(.3),'rubber');
    else add(new T.Mesh(drumGeometry,paints[i%paints.length]),s.x,ground+DRUM.half,s.z,api.ColliderDesc.cylinder(DRUM.half,DRUM.radius).setMass(DRUM.mass).setFriction(.6).setRestitution(.2),'metal');
  });
  return{props,
    update(){for(const p of props){p.mesh.position.copy(p.body.translation() as T.Vector3Like);p.mesh.quaternion.copy(p.body.rotation() as T.QuaternionLike);}},
    /** enabled=false (online events) hides the props and takes them out of the simulation. */
    reset(enabled=true){for(const p of props){p.body.setEnabled(enabled);p.mesh.visible=enabled;p.body.setRotation({x:0,y:0,z:0,w:1},true);p.body.setTranslation(p.start,true);p.body.setLinvel({x:0,y:0,z:0},true);p.body.setAngvel({x:0,y:0,z:0},true);p.mesh.position.copy(p.start);p.mesh.quaternion.identity();}},
    dispose(){for(const p of props)p.mesh.removeFromParent();tyreGeometry.dispose();drumGeometry.dispose();rubber.dispose();paints.forEach(m=>m.dispose());props.length=0;}};
}
/** How many prop bodies an arena records in replays (0 for arenas without loose props). */
export function arenaPropCount(arenaId:string|undefined){const spots=arenaId?ARENA_PROP_SPOTS[arenaId]:undefined;return spots?spots.reduce((n,s)=>n+(s.kind==='tyres'?TYRES_PER_STACK:1),0):0;}
/** Tyre stacks in the run-off of a circuit's sharpest corners: only where a ray from the centreline
 * finds at least RUNOFF metres beyond the track edge before the barrier, so they never sit on the road. */
export const RUNOFF=3;
export function courseCornerSpots(api:typeof R,world:R.World,course:{samples:readonly {x:number;z:number}[];halfWidth:number;height:(x:number,z:number)=>number},max=6):PropSpot[]{
  const s=course.samples,n=s.length;if(n<24)return [];
  const turns:{i:number;k:number;nx:number;nz:number}[]=[];
  for(let i=0;i<n;i++){
    const a=s[(i-3+n)%n],b=s[i],c=s[(i+3)%n],v1x=b.x-a.x,v1z=b.z-a.z,v2x=c.x-b.x,v2z=c.z-b.z,len=Math.hypot(v1x,v1z)*Math.hypot(v2x,v2z);if(len<1e-6)continue;
    const k=Math.abs(v1x*v2z-v1z*v2x)/len,mx=(a.x+c.x)/2-b.x,mz=(a.z+c.z)/2-b.z,ml=Math.hypot(mx,mz);if(ml<1e-6)continue;
    turns.push({i,k,nx:-mx/ml,nz:-mz/ml});
  }
  const picked:typeof turns=[],gap=Math.floor(n/(max*2));
  for(const t of turns.sort((p,q)=>q.k-p.k)){if(picked.length>=max||t.k<.05)break;if(picked.every(p=>Math.min(Math.abs(p.i-t.i),n-Math.abs(p.i-t.i))>=gap))picked.push(t);}
  const spots:PropSpot[]=[];
  for(const t of picked.sort((p,q)=>p.i-q.i)){
    const b=s[t.i],y=course.height(b.x,b.z)+.6,hit=world.castRay(new api.Ray({x:b.x,y,z:b.z},{x:t.nx,y:0,z:t.nz}),18,true),d=hit?hit.timeOfImpact:18;
    if(d<course.halfWidth+RUNOFF)continue;
    const at=Math.min(d-1.5,course.halfWidth+4);spots.push({kind:'tyres',x:b.x+t.nx*at,z:b.z+t.nz*at});
  }
  return spots;
}
