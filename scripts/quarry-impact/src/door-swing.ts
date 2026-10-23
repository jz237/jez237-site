/** Sprung doors (offline events): once a battered door's latch has gone (loose past DOOR_SWING.latch) it hangs on its
 * front hinge like a pendulum (a side knock past DOOR_SWING.latchDamage also springs it) in the car's frame. Braking and the outside of a corner swing it open, accelerating and
 * the airflow at speed push it back shut; it bangs against the body and against its hinge stop, and a door that slams
 * into the stop hard enough, with the hinges already half torn, comes off; every hard slam tears the hinges a little more. An open door catches the air (drag). */
export const DOOR_SWING={latch:.5,latchDamage:4,ajar:.04,slam:3,fatigue:.05,arm:.5,max:1.15,wind:.025,damp:1.4,close:.3,stop:.25,tear:5.5,tearLoose:.7,drag:.7,accel:60} as const;
export type DoorState={swing:number;rate:number};
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,Number.isFinite(v)?v:0));
/** Angular acceleration of the door (rad/s²) at total opening angle `angle`: side −1 left, +1 right; accelerations in
 * the car's frame (forward, rightward, m/s²). */
export function doorTorque(angle:number,side:number,forward:number,lateral:number,speed:number){
  const f=clamp(forward,-DOOR_SWING.accel,DOOR_SWING.accel),l=clamp(lateral,-DOOR_SWING.accel,DOOR_SWING.accel),v=Math.abs(Number.isFinite(speed)?speed:0);
  return (-l*side*Math.cos(angle)-f*Math.sin(angle))/DOOR_SWING.arm-DOOR_SWING.wind*v*v*Math.sin(angle);
}
/** Advance one door by dt from its ajar base angle; returns the speed (rad/s) it hit the hinge stop with, or 0. */
export function stepDoor(door:DoorState,base:number,side:number,forward:number,lateral:number,speed:number,dt:number){
  if(!(dt>0))return 0;
  const accel=doorTorque(base+door.swing,side,forward,lateral,speed)-DOOR_SWING.damp*door.rate;
  door.rate+=accel*dt;door.swing+=door.rate*dt;
  if(door.swing<0){door.swing=0;if(door.rate<0)door.rate=-door.rate*DOOR_SWING.close;}
  const top=DOOR_SWING.max-base;
  if(door.swing>top){door.swing=top;if(door.rate>0){const hit=door.rate;door.rate=-door.rate*DOOR_SWING.stop;return hit;}}
  return 0;
}
/** Where the door settles for steady accelerations: replays seek, so they show this instead of integrating. */
export function doorRest(base:number,side:number,forward:number,lateral:number,speed:number){
  const top=DOOR_SWING.max-base;if(doorTorque(base,side,forward,lateral,speed)<=0)return 0;
  for(let i=1;i<=48;i++){const s=top*i/48;if(doorTorque(base+s,side,forward,lateral,speed)<=0)return s-top/96;}
  return top;
}
/** Air resistance of an open door (newtons) at speed: none shut, most when it stands square to the flow. */
export const doorDrag=(angle:number,speed:number)=>DOOR_SWING.drag*speed*speed*Math.max(0,Math.sin(clamp(angle,0,Math.PI/2)));
/** Has this door's latch gone, and the angle it hangs ajar at. */
export const doorUnlatched=(loose:number,damage:number)=>loose>=DOOR_SWING.latch||damage>=DOOR_SWING.latchDamage;
export const doorBase=(loose:number)=>Math.max(DOOR_SWING.ajar,loose*.075);
/** Caught open (offline events): a door swung out past DOOR_CATCH.open that meets another car, a wall or a prop along its
 * length is torn off its hinges. */
export const DOOR_CATCH={open:.5} as const;
/** The trailing edge of a front-hinged door opened by `open` radians, in the car's frame: `side` −1 left, +1 right. */
export function doorTip(hinge:{x:number;y:number;z:number},side:number,length:number,open:number){
  return{x:hinge.x+side*length*Math.sin(open),y:hinge.y,z:hinge.z-length*Math.cos(open)};
}
/** Van barn doors, top-hinged tailgates and pickup drop-tailgates swing the same way once their latch goes. Barn doors
 * (hinged at the rear corners) and tailgates open under acceleration — the barn doors also round the outside of a
 * corner — and braking shuts them; gravity pulls a tailgate down shut, but tips a drop-tailgate open. A drop off a bump
 * (less weight on the car) floats a tailgate open. `ajar` is how far a loose one already hangs open per unit looseness. */
export type LidKind='cargo'|'tailgate'|'drop'|'boot';
export const LID={cargo:{max:1.5,ajar:.45},tailgate:{max:1.25,ajar:.38},drop:{max:1.55,ajar:1.05},boot:{max:1.25,ajar:.3},friction:3} as const;
/** A saloon's boot lid, hinged at its front edge: gravity and acceleration hold it down, braking and a drop lift it, and at
 * speed the air flowing over it lifts it (`lift`·v²) while the flow onto a raised lid pushes it back (`push`·v²), so an
 * unlatched lid flaps open above about 80 km/h. */
export const BOOT_AIR={lift:.06,push:.025} as const;
export const lidKind=(name:string):LidKind|null=>name.startsWith('cargo-')?'cargo':name==='tailgate'?'tailgate':name==='drop-tailgate'?'drop':name==='boot'?'boot':null;
export const lidBase=(kind:LidKind,loose:number)=>Math.max(DOOR_SWING.ajar,clamp(loose,0,1)*LID[kind].ajar);
/** Angular acceleration (rad/s²) at opening angle `angle`; `up` is the car's weight per unit mass along its own up axis
 * (9.81 standing level, less in a drop, more on landing). */
export function lidTorque(kind:LidKind,angle:number,side:number,forward:number,lateral:number,up:number,speed=0){
  const f=clamp(forward,-DOOR_SWING.accel,DOOR_SWING.accel),l=clamp(lateral,-DOOR_SWING.accel,DOOR_SWING.accel),g=clamp(up,-DOOR_SWING.accel,DOOR_SWING.accel);
  const c=Math.cos(angle),s=Math.sin(angle);
  if(kind==='boot'){const v=Math.min(60,Math.abs(Number.isFinite(speed)?speed:0));return (-f*s-g*c)/DOOR_SWING.arm+(BOOT_AIR.lift*c-BOOT_AIR.push*s)*v*v;}
  return (kind==='cargo'?f*c-l*side*s:kind==='tailgate'?f*c-g*s:f*c+g*s)/DOOR_SWING.arm;
}
export function stepLid(kind:LidKind,lid:DoorState,base:number,side:number,forward:number,lateral:number,up:number,dt:number,speed=0){
  if(!(dt>0))return 0;
  // Bent hinges bind: a lid at rest stays put until something shoves it harder than the friction.
  const torque=lidTorque(kind,base+lid.swing,side,forward,lateral,up,speed);
  if(Math.abs(lid.rate)<.05&&Math.abs(torque)<=LID.friction){lid.rate=0;return 0;}
  const accel=torque-DOOR_SWING.damp*lid.rate-Math.sign(lid.rate||torque)*LID.friction;
  lid.rate+=accel*dt;lid.swing+=lid.rate*dt;
  if(lid.swing<0){lid.swing=0;if(lid.rate<0)lid.rate=-lid.rate*DOOR_SWING.close;}
  const top=LID[kind].max-base;
  if(lid.swing>top){lid.swing=top;if(lid.rate>0){const hit=lid.rate;lid.rate=-lid.rate*DOOR_SWING.stop;return hit;}}
  return 0;
}
export function lidRest(kind:LidKind,base:number,side:number,forward:number,lateral:number,up:number,speed=0){
  const top=LID[kind].max-base;if(lidTorque(kind,base,side,forward,lateral,up,speed)<=LID.friction)return 0;
  for(let i=1;i<=48;i++){const s=top*i/48;if(lidTorque(kind,base+s,side,forward,lateral,up,speed)<=LID.friction)return s-top/96;}
  return top;
}
/** Cargo spills out of a wide-open back (offline events): crates from a van's barn doors, luggage past a lifted tailgate,
 * loose kit off a dropped pickup tailgate — one piece every CARGO.gap seconds while it stands open past `open`, until the
 * load (`load` pieces) is gone. The pieces are real debris bodies, so other cars hit them. A saloon's boot throws its spare
 * wheel out first, then the luggage. */
export const CARGO={gap:.7,cargo:{open:.9,load:5,size:[.55,.45,.6],color:0x8a6a3e},tailgate:{open:.75,load:2,size:[.45,.3,.6],color:0x2e3b4c},drop:{open:1.2,load:3,size:[.5,.4,.5],color:0x6f5a3a},boot:{open:.8,load:3,size:[.5,.28,.68],color:0x5c3b2e}} as const;
export const cargoSpills=(kind:LidKind,opening:number)=>Number.isFinite(opening)&&opening>=CARGO[kind].open;
