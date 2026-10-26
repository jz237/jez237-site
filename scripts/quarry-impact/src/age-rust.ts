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
/** Tired suspension (offline, with the rust): an old banger's dampers are worn, up to TIRED.damper less damping, so it wallows
 * and bounces over the bumps; and one of its springs (its own corner, a rear one TIRED.rear of the time) has sagged, up to
 * TIRED.sag of that corner's ride height, so it sits down on that corner. */
export const TIRED={damper:.4,sag:.22,rear:.7} as const;
export const tiredDamper=(age:number)=>1-TIRED.damper*clampAge(age);
/** The corner (0–3, front left first) whose spring has sagged on car `id`. */
export const tiredCorner=(id:number)=>{const n=Number.isFinite(id)?id:0,r=Math.abs(Math.sin(n*39.17+1.31)*43758.5453)%1;return (r<TIRED.rear?2:0)+(Math.floor(r*977)%2);};
export const tiredSag=(age:number,corner:number,wheel:number)=>wheel===corner?1-TIRED.sag*clampAge(age):1;
/** Pitted chrome (with the rust, the same age): an old car's brightwork — bumpers, grille surrounds, trim — dulls (up to
 * PITTING.dull rougher) and freckles with rust pits, more and larger the older (PITTING.pits of it at its oldest), with
 * blooms of rust where the plating has lifted. */
export const PITTING={dull:.55,pits:.5,bloom:.5} as const;
/** Is this material chrome brightwork (not a fitted hubcap)? */
export const chromed=(name:string)=>/chrome/i.test(name)&&!/hubcap/i.test(name);
/** Worn engines (offline, with the rust): an old banger's tired engine stumbles under load — from WORN_ENGINE.from of its age
 * it misfires as an engine damaged to WORN_ENGINE.onset would, rising to WORN_ENGINE.most at its oldest (the misfire's own onset
 * is 0.3: a power cut for a moment, the body kicking on its mounts, now and then a backfire). Real damage beyond it still counts. */
export const WORN_ENGINE={from:.5,onset:.3,most:.45} as const;
/** The engine damage an old car's misfires behave as, by its age (0 when it is not that old). */
export const wornEngine=(age:number)=>{const a=clampAge(age);return a<WORN_ENGINE.from?0:WORN_ENGINE.onset+(WORN_ENGINE.most-WORN_ENGINE.onset)*(a-WORN_ENGINE.from)/(1-WORN_ENGINE.from);};
/** Brake pull (offline, with the rust): one front caliper of an old banger is half seized — its own side — and grips up to
 * BRAKE_PULL.loss less than the other from BRAKE_PULL.from of its age, so under hard braking the wheel tugs toward the
 * stronger side (up to BRAKE_PULL.tug of full lock at full pedal, from BRAKE_PULL.speed m/s up) and the driver has to hold it
 * straight. */
export const BRAKE_PULL={from:.5,loss:.38,tug:.12,speed:8} as const;
/** The front wheel (0 or 1) with the weak caliper on car `id`. */
export const weakCaliper=(id:number)=>Math.abs(Math.sin((Number.isFinite(id)?id:0)*53.71+.83)*43758.5453)%1<.5?0:1;
/** How much of its braking this wheel (0–3) keeps on car `id` of this age. */
export function caliperGrip(age:number,id:number,wheel:number){const a=clampAge(age);if(a<BRAKE_PULL.from||wheel!==weakCaliper(id))return 1;return 1-BRAKE_PULL.loss*(a-BRAKE_PULL.from)/(1-BRAKE_PULL.from);}
/** The steering after an old car's brakes tug it, from the driver's steer (−1–1) at this brake pedal and speed (m/s). */
export function brakePull(steer:number,brake:number,speed:number,age:number,id:number){
  const s=Number.isFinite(steer)?steer:0,a=clampAge(age),b=Number.isFinite(brake)?Math.max(0,Math.min(1,brake)):0,v=Number.isFinite(speed)?Math.abs(speed):0;
  if(a<BRAKE_PULL.from||b<=0)return s;
  const pull=BRAKE_PULL.tug*b*Math.min(1,v/BRAKE_PULL.speed)*(a-BRAKE_PULL.from)/(1-BRAKE_PULL.from);
  return Math.max(-1,Math.min(1,s+(weakCaliper(id)===0?1:-1)*pull));
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
