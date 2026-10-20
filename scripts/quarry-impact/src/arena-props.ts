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
  'moorfield-speedbowl-v1':[...[-24,-12,0,12,24].flatMap(x=>[{kind:'drum' as const,x,z:31},{kind:'drum' as const,x,z:-31}]),...[[60,8],[60,-8],[-60,8],[-60,-8]].map(([x,z])=>({kind:'tyres' as const,x,z}))],
};
export const TYRES_PER_STACK=3;
const TYRE={radius:.46,half:.13,mass:10},DRUM={radius:.3,half:.44,mass:18};
const DRUM_COLORS=[0xb3362c,0x2f5d8c,0xc9a227,0x3f6b3a];
export function createArenaProps(api:typeof R,world:R.World,root:T.Object3D,spots:readonly PropSpot[]){
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
    if(s.kind==='tyres')for(let k=0;k<TYRES_PER_STACK;k++)add(new T.Mesh(tyreGeometry,rubber),s.x,TYRE.half+k*TYRE.half*2.02,s.z,api.ColliderDesc.cylinder(TYRE.half,TYRE.radius).setMass(TYRE.mass).setFriction(.9).setRestitution(.3),'rubber');
    else add(new T.Mesh(drumGeometry,paints[i%paints.length]),s.x,DRUM.half,s.z,api.ColliderDesc.cylinder(DRUM.half,DRUM.radius).setMass(DRUM.mass).setFriction(.6).setRestitution(.2),'metal');
  });
  return{props,
    update(){for(const p of props){p.mesh.position.copy(p.body.translation() as T.Vector3Like);p.mesh.quaternion.copy(p.body.rotation() as T.QuaternionLike);}},
    /** enabled=false (online events) hides the props and takes them out of the simulation. */
    reset(enabled=true){for(const p of props){p.body.setEnabled(enabled);p.mesh.visible=enabled;p.body.setRotation({x:0,y:0,z:0,w:1},true);p.body.setTranslation(p.start,true);p.body.setLinvel({x:0,y:0,z:0},true);p.body.setAngvel({x:0,y:0,z:0},true);p.mesh.position.copy(p.start);p.mesh.quaternion.identity();}},
    dispose(){for(const p of props)p.mesh.removeFromParent();tyreGeometry.dispose();drumGeometry.dispose();rubber.dispose();paints.forEach(m=>m.dispose());props.length=0;}};
}
/** How many prop bodies an arena records in replays (0 for arenas without loose props). */
export function arenaPropCount(arenaId:string|undefined){const spots=arenaId?ARENA_PROP_SPOTS[arenaId]:undefined;return spots?spots.reduce((n,s)=>n+(s.kind==='tyres'?TYRES_PER_STACK:1),0):0;}
