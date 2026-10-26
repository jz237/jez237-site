import * as T from 'three';

/** Age rust (offline): an old banger rots where the water sits, along its sills and round the lips of its wheel arches, in
 * mottled orange-brown scale with a stained fringe of blistered paint, dull and bare of lacquer. How far gone it is (0–1) is
 * each rival's own (RUST.age); the player's car is left as it was painted. A little rot shows only in the worst spots; a lot
 * spreads up the flanks. The sills are the bottom RUST.sill m of the painted steel flanks (outside RUST.flank of the car's
 * half width); the lips a band RUST.lip m wide about each arch, RUST.gap m out from its edge. Plastic trim never rusts. */
export const RUST={age:[.25,1],sill:[.04,.26],lip:.06,gap:.03,flank:[.6,.86],orange:'.25,.075,.02',scale:'.085,.032,.012',stain:'.62,.47,.36'} as const;
/** Sun fade (with the rust, the same age): an old car's roof, bonnet and boot lid (the faces of its own top, FADE.top of
 * straight up, from FADE.above m over its sills) are sun-bleached toward a chalky grey (FADE.bleach of the way at its oldest,
 * mottled), and the lacquer has lifted off in blotches (more of it the older, FADE.peel) — dull matte paint inside, a ragged
 * white edge of flaking lacquer round each. */
export const FADE={top:[.55,.85],above:[.35,.6],bleach:.55,chalk:.62,peel:.34,matte:.82,flake:.75} as const;
/** Rotten shells (offline, with the rust): rust has eaten the steel, so a rusty car's body gives way sooner. Up to ROT.crush
 * more of each blow reaches its structure (it bends, and drives worse, sooner) and its panels dent up to ROT.dent deeper (so
 * they tear off sooner), in step with its age. A hard knock (ROT.min damage on) landing low on a rotten flank (within ROT.low m
 * of its sills) shakes loose a shower of rust flakes — up to ROT.count of them, more the older the car and the harder the blow
 * (all of them from ROT.full damage) — once the car is ROT.flakes gone. */
export const ROT={crush:.35,dent:.3,min:6,low:.5,flakes:.3,count:[4,14],full:30,colour:0x7a3a16} as const;
const clampAge=(age:number)=>Number.isFinite(age)?Math.max(0,Math.min(1,age)):0;
/** How much more a blow does to a shell this rusty (1 when sound), up to 1 + most. */
export const rotFactor=(age:number,most:number)=>1+most*clampAge(age);
/** Rust flakes shaken loose by a blow of this damage landing this high over the sills (model frame m) on a car this rusty. */
export function rustFlakes(age:number,damage:number,height:number){
  const a=clampAge(age);if(a<ROT.flakes||!(damage>=ROT.min)||!(height<=ROT.low))return 0;
  return Math.round(ROT.count[0]+(ROT.count[1]-ROT.count[0])*a*Math.min(1,damage/ROT.full));
}
/** Does a body material rust? Painted steel does; the plastic trim, hoses and cabin do not. */
export const rusts=(name:string)=>name.startsWith('paint')&&!/Paint 2|hoses|Interior|Panel Sides/.test(name);
export const startingRust=(id:number)=>{const n=Number.isFinite(id)?id:0,r=Math.abs(Math.sin(n*57.31+4.77)*43758.5453)%1;return RUST.age[0]+r*(RUST.age[1]-RUST.age[0]);};
/** Where a car rots, in its model frame: the foot of its painted flanks under the doors, its half width, and its arches —
 * the front and rear axle along the car, the hub height, and each arch's edge (its radius about the hub). */
export type RustFit={bottom:number;halfWidth:number;front:number;rear:number;hub:number;frontArch:number;rearArch:number};
export function fitRust(model:T.Object3D,panels:readonly T.Mesh[],wheels:readonly (T.Object3D|undefined)[],wheelRadius:number):RustFit|null{
  const points:number[]=[];
  for(const p of panels){const m=p.material as T.Material,rest=p.geometry.attributes.wreckPosition;if(Array.isArray(m)||!rusts(m.name)||!rest)continue;
    for(let i=0;i<rest.count;i++)points.push(rest.getX(i),rest.getY(i),rest.getZ(i));}
  if(points.length<9)return null;
  let halfWidth=0,minZ=Infinity,maxZ=-Infinity,minY=Infinity;
  for(let i=0;i<points.length;i+=3){halfWidth=Math.max(halfWidth,Math.abs(points[i]));minZ=Math.min(minZ,points[i+2]);maxZ=Math.max(maxZ,points[i+2]);minY=Math.min(minY,points[i+1]);}
  // The sills: the lowest paint on the flanks in the middle of the car, clear of the bumpers.
  const mid=(minZ+maxZ)/2,reach=(maxZ-minZ)*.18;let bottom=Infinity;
  for(let i=0;i<points.length;i+=3)if(Math.abs(points[i+2]-mid)<reach&&Math.abs(points[i])>halfWidth*.55)bottom=Math.min(bottom,points[i+1]);
  if(!Number.isFinite(bottom))bottom=minY;
  model.updateMatrixWorld(true);const hubs=wheels.map(w=>w?model.worldToLocal(w.getWorldPosition(new T.Vector3())):null);
  // The tyre's radius in the model's own frame (it may be scaled).
  const first=wheels.find(w=>!!w),at=first?.getWorldPosition(new T.Vector3()),tyre=at?model.worldToLocal(at.clone()).distanceTo(model.worldToLocal(at.clone().add(new T.Vector3(0,wheelRadius,0)))):NaN;
  const axle=(a:number,b:number)=>{const h=[hubs[a],hubs[b]].filter((x):x is T.Vector3=>!!x);return h.length?h.reduce((s,x)=>s+x.z,0)/h.length:NaN;};
  const front=axle(0,1),rear=axle(2,3),all=hubs.filter((x):x is T.Vector3=>!!x);
  if(!Number.isFinite(front)||!Number.isFinite(rear)||!all.length||!(tyre>0))return null;
  // Each arch's edge: the nearest painted flank above its hub, outside the tyre.
  const hub=all.reduce((s,x)=>s+x.y,0)/all.length,edge=(z:number)=>{let r=Infinity;
    for(let i=0;i<points.length;i+=3){if(Math.abs(points[i])<halfWidth*RUST.flank[0]||points[i+1]<hub+.05)continue;const d=Math.hypot(points[i+2]-z,points[i+1]-hub);if(d>tyre&&d<r)r=d;}
    return Number.isFinite(r)?r:NaN;};
  const frontArch=edge(front),rearArch=edge(rear);if(!Number.isFinite(frontArch)||!Number.isFinite(rearArch))return null;
  return{bottom,halfWidth,front,rear,hub,frontArch,rearArch};
}
