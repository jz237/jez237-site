/** Shedding weight (offline destruction only): every door, lid, bumper, wheel and screen that leaves the car takes its mass
 * with it, so a stripped wreck accelerates harder and its balance moves toward the end that still carries its parts. */
export const SHED={
  kg:{door:24,'door-rear':20,hood:16,'engine-lid':14,tailgate:16,'drop-tailgate':20,hatch:10,cargo:18,bumper:9,mirror:1.5,wheel:21,exhaust:9},
  /** Laminated/toughened screen glass, kg per square metre. */
  glassPerM2:12,
  /** A stripped car never loses more than this share of its mass (the shell, engine and axles stay). */
  cap:.2,
  /** Seconds between re-weighs; the body only changes when the total moves by at least `step` kg. */
  every:.25,step:.5,
} as const;
type Vec={x:number;y:number;z:number};
export type ShedPart=Vec&{kg:number};
/** Mass of a whole wreck assembly by its name (door-left, door-rear-right, hood, front-bumper, mirror-left, cargo-right …). */
export function assemblyMass(name:string){
  if(name.startsWith('door-rear'))return SHED.kg['door-rear'];
  if(name.startsWith('door'))return SHED.kg.door;
  if(name.endsWith('bumper'))return SHED.kg.bumper;
  if(name.startsWith('mirror'))return SHED.kg.mirror;
  if(name.startsWith('cargo'))return SHED.kg.cargo;
  return (SHED.kg as Record<string,number>)[name]??0;
}
/** A pane's mass from its bounding box: the two largest extents are the sheet. */
export function glassMass(size:Vec){
  const [a,b]=[Math.abs(size.x),Math.abs(size.y),Math.abs(size.z)].sort((p,q)=>q-p);
  return Number.isFinite(a*b)?a*b*SHED.glassPerM2:0;
}
/** The body's mass properties with the shed parts taken out: mass drops (capped), the centre of mass moves away from where
 * they were, and the principal inertia shrinks with the mass. */
export function shedMassProperties(base:{mass:number;com:Vec;inertia:Vec},parts:readonly ShedPart[]){
  let kg=0,mx=0,my=0,mz=0;
  for(const p of parts){if(!(p.kg>0)||![p.x,p.y,p.z].every(Number.isFinite))continue;kg+=p.kg;mx+=p.kg*p.x;my+=p.kg*p.y;mz+=p.kg*p.z;}
  const limit=base.mass*SHED.cap,scale=kg>limit?limit/kg:1;kg*=scale;mx*=scale;my*=scale;mz*=scale;
  const mass=base.mass-kg,ratio=mass/base.mass;
  return {kg,mass,
    com:{x:(base.mass*base.com.x-mx)/mass,y:(base.mass*base.com.y-my)/mass,z:(base.mass*base.com.z-mz)/mass},
    inertia:{x:base.inertia.x*ratio,y:base.inertia.y*ratio,z:base.inertia.z*ratio}};
}
