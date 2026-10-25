import * as T from 'three';
/** The seated driver sways with the car (cosmetic): a spring-damper about the hips, driven by the car's own acceleration in
 * its frame, leans the figure out of corners, pitches it forward under braking and back under power, and whips it on hard
 * hits. omega/damping set the body's springiness, gain the lean per m/s², max* the seat's reach (pitchBack is the seat back).
 * Steps above maxAccel are clamped, moves over teleport metres in one frame (recoveries, resets) re-prime the state and frames
 * without any movement (the simulation frozen) hold it. */
export const SWAY={omega:9,damping:.55,gain:1.65,maxRoll:.3,maxPitch:.42,pitchBack:.12,maxRate:6,maxAccel:400,teleport:5,hip:.48} as const;
export type DriverSway={roll:number;rollRate:number;pitch:number;pitchRate:number;velocity:T.Vector3;position:T.Vector3;frames:number};
export const newDriverSway=():DriverSway=>({roll:0,rollRate:0,pitch:0,pitchRate:0,velocity:new T.Vector3(),position:new T.Vector3(),frames:0});
/** One spring step from the car-frame acceleration (x sideways, z forward, m/s²). The head is thrown opposite the acceleration,
 * as a body in a seat is: roll is the z turn (head towards -x for +roll), pitch the x turn (head forward for +pitch). */
export function stepDriverSway(s:DriverSway,ax:number,az:number,dt:number){
  if(!(dt>0))return s;const h=Math.min(dt,1/20),k=SWAY.omega*SWAY.omega,c=2*SWAY.damping*SWAY.omega,clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
  const length=Math.hypot(ax,az),scale=length>SWAY.maxAccel?SWAY.maxAccel/length:1;ax*=scale;az*=scale;
  s.rollRate=clamp(s.rollRate+(-k*s.roll-c*s.rollRate+SWAY.gain*ax)*h,-SWAY.maxRate,SWAY.maxRate);
  s.pitchRate=clamp(s.pitchRate+(-k*s.pitch-c*s.pitchRate-SWAY.gain*az)*h,-SWAY.maxRate,SWAY.maxRate);
  s.roll+=s.rollRate*h;s.pitch+=s.pitchRate*h;
  if(Math.abs(s.roll)>SWAY.maxRoll){s.roll=Math.sign(s.roll)*SWAY.maxRoll;s.rollRate*=-.3;}
  if(s.pitch>SWAY.maxPitch||s.pitch<-SWAY.pitchBack){s.pitch=clamp(s.pitch,-SWAY.pitchBack,SWAY.maxPitch);s.pitchRate*=-.3;}
  return s;
}
const local=new T.Vector3(),now=new T.Vector3(),speed=new T.Vector3(),turn=new T.Quaternion(),hip=new T.Vector3(),moved=new T.Vector3();
/** Sways a driver figure seated at figure.userData.seat inside car (the car's root group), from the root's world motion. */
export function swayDriver(figure:T.Object3D,car:T.Object3D,dt:number){
  if(!(dt>0))return;const s:DriverSway=figure.userData.sway??=newDriverSway(),seat:T.Vector3=figure.userData.seat??=figure.position.clone();
  car.getWorldPosition(now);
  // Two frames to settle after a (re)start: the first takes the position, the second the speed, then acceleration counts.
  if(s.frames===0||now.distanceTo(s.position)>SWAY.teleport){s.position.copy(now);s.frames=1;return;}
  // A car that has not moved at all is frozen (paused, results, a wreck hold), not braked to a dead stop: hold everything.
  if(now.equals(s.position))return;
  speed.copy(now).sub(s.position).divideScalar(dt);local.copy(speed).sub(s.velocity).divideScalar(dt);s.velocity.copy(speed);s.position.copy(now);
  if(s.frames++<2)return;
  car.getWorldQuaternion(turn);local.applyQuaternion(turn.invert());
  stepDriverSway(s,local.x,local.z,dt);
  figure.rotation.set(s.pitch,0,s.roll);
  // Turn about the hips, not the helmet: shift the figure so the hip point stays where it sits.
  hip.set(0,-SWAY.hip,0);moved.copy(hip).applyEuler(figure.rotation);figure.position.copy(seat).add(hip).sub(moved);
}
/** A crushed roof comes down on the driver: they slump down and in, as the cab camera ducks (ROOF_DUCK). The slump is the more
 * of two measures: crush·the roof's structural crush (0..1), so a caved roof pushes them down even where its glass has gone, and
 * the clearance left over the helmet, measured on the car's own body by rays cast down from above metres over five points across
 * the helmet (its centre and spread either way) onto the first skin or glass they meet (interior trim is left out); head is the
 * helmet radius and margin covers the skin's thickness; only clearance lost since the first measure (the intact cabin) counts.
 * They lean in by inward of the slump, and never slump more than max. */
export const DRIVER_DUCK={above:1.2,spread:.1,margin:.06,max:.32,head:.12,crush:.35,inward:.5} as const;
const ray=new T.Raycaster(),from=new T.Vector3(),downward=new T.Vector3(),facing=new T.Quaternion(),point=new T.Vector3();
/** The helmet's clearance under car's skin and glass at seat (car frame), or Infinity with nothing over it. */
function clearance(seat:T.Vector3,car:T.Object3D,body:readonly T.Object3D[]){
  car.updateWorldMatrix(true,true);downward.set(0,-1,0).applyQuaternion(car.getWorldQuaternion(facing));
  const shell=body.filter(m=>m.visible&&!m.name.startsWith('panel_inner')),d=DRIVER_DUCK.spread;let least=Infinity;
  for(const [x,z] of [[0,0],[d,0],[-d,0],[0,d],[0,-d]]){
    from.copy(point.set(seat.x+x,seat.y,seat.z+z).applyMatrix4(car.matrixWorld)).addScaledVector(downward,-DRIVER_DUCK.above);
    ray.set(from,downward);ray.near=0;ray.far=DRIVER_DUCK.above;const hit=ray.intersectObjects(shell,false)[0];
    if(hit)least=Math.min(least,DRIVER_DUCK.above-hit.distance);
  }
  return least;
}
/** Lowers (and draws in) the figure's seat (figure.userData.seat, from its first seat) under car's crushed roof, given the roof's
 * structural crush; returns the slump (metres). */
export function duckDriver(figure:T.Object3D,car:T.Object3D,body:readonly T.Object3D[],roofCrush:number){
  const base:T.Vector3=figure.userData.seatBase??=(figure.userData.seat??figure.position).clone(),room=clearance(base,car,body);
  // Only what the roof has lost since the first measure counts: some cabins seat the helmet snug under the glass by design.
  const short=(r:number)=>Number.isFinite(r)?Math.max(0,DRIVER_DUCK.head+DRIVER_DUCK.margin-r):0,rest:number=figure.userData.restRoom??=room;
  const measured=short(room)-short(rest),crushed=DRIVER_DUCK.crush*(Number.isFinite(roofCrush)?Math.max(0,roofCrush):0);
  const drop=Math.min(DRIVER_DUCK.max,Math.max(0,measured,crushed));
  figure.userData.seat=base.clone();figure.userData.seat.y-=drop;figure.userData.seat.x-=Math.sign(base.x)*drop*DRIVER_DUCK.inward;
  if(!figure.userData.sway?.frames)figure.position.copy(figure.userData.seat);
  return drop;
}
