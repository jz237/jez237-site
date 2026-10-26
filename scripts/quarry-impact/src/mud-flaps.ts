import * as T from 'three';
import {measureTyreVisual} from './tyre-visual';

/** Mud flaps (offline): a rubber flap hangs behind each wheel from the arch — FLAP.wide times the tyre's width across,
 * from FLAP.top of the wheel's radius above its hub down to FLAP.clear m off the ground, FLAP.gap m behind the tread. It
 * swings on its top edge as a damped pendulum (FLAP.omega rad/s, damping FLAP.damping) in the car's own frame:
 * accelerating throws it back, braking forward, cornering sideways, and the oncoming air (FLAP.air·v²) streams it back
 * off the tyre — never forward into the tread (FLAP.tuck rad at most) nor past FLAP.max. A wheel wrecked past FLAP.tear
 * or lost tears its flap away. A flap catches the stones its spinning tyre throws: FLAP.catch of them hit it and drop just
 * behind (thrown at FLAP.drop of their speed), each kicking the flap back FLAP.kick rad/s. */
export const FLAP={wide:1.2,top:.35,clear:.09,gap:.05,thick:.008,omega:8,damping:.22,air:.012,tuck:.05,max:1.1,roll:.5,maxAccel:150,tear:.55,catch:.65,drop:.18,kick:2.2,stripe:.035,colour:0x151515,stripes:[0xd8241c,0xf0f0f0,0xf2c21a] as const} as const;
export type FlapSwing={pitch:number;pitchV:number;roll:number;rollV:number};
/** One step of a flap's swing (car acceleration and velocity in its own frame, x left z forward). Pitch is back off the
 * tyre (its bottom swinging toward the rear), roll toward the car's +x side. */
export function swingFlap(s:FlapSwing,accel:{x:number;z:number},velocity:{x:number;z:number},dt:number){
  const t=Number.isFinite(dt)?Math.max(0,Math.min(.05,dt)):0,clip=(a:number)=>Number.isFinite(a)?Math.max(-FLAP.maxAccel,Math.min(FLAP.maxAccel,a)):0;
  const vx=Number.isFinite(velocity.x)?velocity.x:0,vz=Number.isFinite(velocity.z)?velocity.z:0,v=Math.hypot(vx,vz);
  const px=clip(-accel.x-FLAP.air*vx*v),pz=clip(-accel.z-FLAP.air*vz*v),w=FLAP.omega,c=2*FLAP.damping*w;
  const back=Math.atan2(-pz,9.81),side=Math.atan2(px,9.81);
  s.pitchV+=(-w*w*(s.pitch-back)-c*s.pitchV)*t;s.pitch+=s.pitchV*t;s.rollV+=(-w*w*(s.roll-side)-c*s.rollV)*t;s.roll+=s.rollV*t;
  if(s.pitch< -FLAP.tuck){s.pitch=-FLAP.tuck;s.pitchV=Math.max(0,s.pitchV)*.3;}
  if(s.pitch>FLAP.max){s.pitch=FLAP.max;s.pitchV=Math.min(0,s.pitchV);}
  s.roll=Math.max(-FLAP.roll,Math.min(FLAP.roll,s.roll));
  return s;
}
export const flapTears=(wheelDamage:number,lost:boolean)=>lost||(Number.isFinite(wheelDamage)&&wheelDamage>FLAP.tear);
const rubber=new T.MeshStandardMaterial({name:'Mud flap rubber',color:FLAP.colour,roughness:.9,metalness:0,side:T.DoubleSide});
/** A flap `width` by `height` m hanging down from its top edge at the origin (its face across the car), with a stripe
 * along its foot; 'mud_flap_swing' swings it. */
export function mudFlap(width:number,height:number,stripe:number){
  const group=new T.Group();group.name='mud_flap';const swing=new T.Group();swing.name='mud_flap_swing';group.add(swing);
  const sheet=new T.Mesh(new T.BoxGeometry(width,height,FLAP.thick).translate(0,-height/2,0),rubber);sheet.name='mud_flap_sheet';
  const band=new T.Mesh(new T.BoxGeometry(width*.96,FLAP.stripe,FLAP.thick*1.3).translate(0,-height+FLAP.stripe*1.4,0),new T.MeshStandardMaterial({name:'Mud flap stripe',color:stripe,roughness:.7}));band.name='mud_flap_stripe';
  swing.add(sheet,band);group.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=false;o.receiveShadow=true;}});
  return group;
}
type Hung={group:T.Group;swing:T.Object3D;sheet:T.Mesh;wheel:number;state:FlapSwing;torn:boolean};
/** Hangs a flap behind each of a car's wheels and swings them. */
export class MudFlaps{
  readonly flaps:Hung[]=[];
  torn=0;
  private before=new T.Vector3();private seen=false;private accel=new T.Vector3();private local=new T.Vector3();private localV=new T.Vector3();private inverse=new T.Quaternion();
  constructor(private root:T.Object3D,wheels:readonly (T.Object3D|undefined)[],radius:number,colour:number,private tear:(sheet:T.Mesh)=>void){
    root.updateMatrixWorld(true);const inverse=root.matrixWorld.clone().invert(),stripe=FLAP.stripes[Math.abs(Math.round(colour))%FLAP.stripes.length];
    wheels.forEach((wheel,i)=>{
      // Sized to its own wheel: the tyre's width across, from over the hub down to just off the ground under it.
      if(!wheel)return;const hub=wheel.getWorldPosition(new T.Vector3()).applyMatrix4(inverse),top=hub.y+radius*FLAP.top,height=top-(hub.y-radius+FLAP.clear);if(height<.08)return;
      const tyre=measureTyreVisual(wheel).profile.halfWidth*2,group=mudFlap((tyre>.05?tyre:.22)*FLAP.wide,height,stripe);group.position.set(hub.x,top,hub.z-radius-FLAP.gap);root.add(group);
      this.flaps.push({group,swing:group.getObjectByName('mud_flap_swing')!,sheet:group.getObjectByName('mud_flap_sheet') as T.Mesh,wheel:i,state:{pitch:0,pitchV:0,roll:0,rollV:0},torn:false});
    });
  }
  /** Does a whole flap hang behind this wheel (0–3) to catch its stones? If so the stone kicks it back. */
  catchStone(wheel:number){const f=this.flaps.find(x=>x.wheel===wheel&&!x.torn);if(!f)return false;f.state.pitchV+=FLAP.kick;this.caught++;return true;}
  caught=0;
  /** Flap swing angles back off the tyres (QA, radians), in wheel order. */
  get swings(){return this.flaps.filter(f=>!f.torn).map(f=>+f.state.pitch.toFixed(3));}
  update(velocity:T.Vector3,wheelDamage:ArrayLike<number>,wheelLost:ArrayLike<boolean|number>,dt:number){
    const t=Number.isFinite(dt)?Math.max(0,Math.min(.05,dt)):0;if(t<=0)return;
    if(!this.seen){this.before.copy(velocity);this.seen=true;}
    this.accel.copy(velocity).sub(this.before).divideScalar(t);this.before.copy(velocity);
    this.root.getWorldQuaternion(this.inverse).invert();this.local.copy(this.accel).applyQuaternion(this.inverse);this.localV.copy(velocity).applyQuaternion(this.inverse);
    for(const f of this.flaps){
      const lost=!!wheelLost[f.wheel],d=wheelDamage[f.wheel]??0;
      if(f.torn){if(!lost&&d<FLAP.tear/2){f.torn=false;f.group.visible=f.sheet.visible=true;f.state.pitch=f.state.pitchV=f.state.roll=f.state.rollV=0;}continue;}
      if(flapTears(d,lost)){f.torn=true;this.torn++;this.tear(f.sheet);f.group.visible=false;continue;}
      swingFlap(f.state,{x:this.local.x,z:this.local.z},{x:this.localV.x,z:this.localV.z},t);
      // Back off the tyre is the foot toward −z: a positive turn about +x.
      f.swing.rotation.set(f.state.pitch,0,f.state.roll);
    }
  }
  dispose(){for(const f of this.flaps)f.group.removeFromParent();this.flaps.length=0;}
}
