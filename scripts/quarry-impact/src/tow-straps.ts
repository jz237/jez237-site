import * as T from 'three';

/** Tow straps (offline): a loop of bright webbing hangs off each bumper, as rally and derby cars carry for a quick tow out —
 * STRAP.loop m long and STRAP.width m wide, STRAP.side m off the middle (the rear one to the right, the front one to the
 * left), on a dark steel eye STRAP.lift m up the bumper's face from its lowest edge there (searched from STRAP.low to
 * STRAP.high m above the bottom of the bodywork, and within STRAP.end of the car's half length of its end), so it hangs in
 * view in front of the bumper's lip. It swings as a pendulum (STRAP.omega rad/s, damping
 * STRAP.damping) in the car's own frame: accelerating throws a strap back, braking forward, cornering to the side, and the
 * oncoming air (STRAP.air·v² of push) streams it back off the car — the rear one out behind, the front one flat against its
 * bumper. It never swings into the bodywork (STRAP.tuck rad at most) or past STRAP.max out. When the panel it hangs off is
 * smashed past STRAP.tear or falls off, the strap is torn away with it. */
export const STRAP={loop:.2,open:.04,width:.05,thick:.002,side:.32,low:.12,high:.6,step:.03,lift:.1,end:.75,proud:.015,reach:1.2,omega:11,damping:.16,air:.019,tuck:.12,max:1.35,roll:.9,maxAccel:150,tear:16,
  colours:[0xd8241c,0xf2c21a,0x1d8fe0,0xf06a14] as const} as const;
export type StrapSwing={pitch:number;pitchV:number;roll:number;rollV:number};
/** One step of a strap's swing given the car's acceleration and its velocity in its own frame (x left, z forward; m/s² and
 * m/s) and which end it hangs off (1 front, -1 rear). Pitch is out from the bumper, roll toward the car's +x side. */
export function swingStrap(s:StrapSwing,accel:{x:number;z:number},velocity:{x:number;z:number},end:number,dt:number){
  const t=Number.isFinite(dt)?Math.max(0,Math.min(.05,dt)):0,clip=(a:number)=>Number.isFinite(a)?Math.max(-STRAP.maxAccel,Math.min(STRAP.maxAccel,a)):0;
  const vx=Number.isFinite(velocity.x)?velocity.x:0,vz=Number.isFinite(velocity.z)?velocity.z:0,v=Math.hypot(vx,vz);
  // The push on the strap in the car's frame: against the car's acceleration, and along the oncoming air.
  const px=clip(-accel.x-STRAP.air*vx*v),pz=clip(-accel.z-STRAP.air*vz*v),w=STRAP.omega,c=2*STRAP.damping*w;
  const out=Math.atan2(pz*end,9.81),side=Math.atan2(px,9.81);
  s.pitchV+=(-w*w*(s.pitch-out)-c*s.pitchV)*t;s.pitch+=s.pitchV*t;
  s.rollV+=(-w*w*(s.roll-side)-c*s.rollV)*t;s.roll+=s.rollV*t;
  if(s.pitch< -STRAP.tuck){s.pitch=-STRAP.tuck;s.pitchV=Math.max(0,s.pitchV)*.3;}
  if(s.pitch>STRAP.max){s.pitch=STRAP.max;s.pitchV=Math.min(0,s.pitchV);}
  s.roll=Math.max(-STRAP.roll,Math.min(STRAP.roll,s.roll));
  return s;
}
/** A strap tears away once the panel it hangs off is smashed past STRAP.tear or has fallen off the car. */
export const strapTears=(damage:number,attached:boolean)=>!attached||(Number.isFinite(damage)&&damage>STRAP.tear);

// The loop runs down from the eye and back up in the plane along the car (y down, z out), the webbing's flat face across
// it (x), so from behind a strap shows its full width.
const loopGeometry=new T.TubeGeometry(new T.CatmullRomCurve3(Array.from({length:16},(_,i)=>{const a=i/16*Math.PI*2;return new T.Vector3(0,-STRAP.loop/2*(1-Math.cos(a)),STRAP.open/2*Math.sin(a));}),true),40,STRAP.thick,8,true).scale(STRAP.width/(2*STRAP.thick),1,1),
  eyeGeometry=new T.TorusGeometry(.018,.005,5,10),eyeMaterial=new T.MeshStandardMaterial({color:0x26292c,metalness:.7,roughness:.42,name:'Tow eye'});
/** A strap: 'tow_strap' at its eye on the bumper; 'tow_strap_swing' carries the webbing loop 'tow_strap_loop' hanging below. */
export function towStrap(colour:number){
  const group=new T.Group();group.name='tow_strap';
  const eye=new T.Mesh(eyeGeometry,eyeMaterial);eye.rotation.y=Math.PI/2;eye.name='tow_eye';group.add(eye);
  const swing=new T.Group();swing.name='tow_strap_swing';group.add(swing);
  const loop=new T.Mesh(loopGeometry,new T.MeshStandardMaterial({color:colour,roughness:.82,name:'Tow strap'}));loop.name='tow_strap_loop';swing.add(loop);
  group.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=false;o.receiveShadow=true;}});
  return group;
}
type Hung={group:T.Group;swing:T.Object3D;loop:T.Mesh;panel:T.Mesh|null;end:number;state:StrapSwing;torn:boolean};
/** Hangs a strap off each bumper of a car and swings them. */
export class TowStraps{
  readonly straps:Hung[]=[];
  torn=0;
  private before=new T.Vector3();private seen=false;private accel=new T.Vector3();private local=new T.Vector3();private localV=new T.Vector3();private inverse=new T.Quaternion();
  constructor(private root:T.Object3D,panels:readonly T.Mesh[],halfLength:number,colour:number,private tear:(loop:T.Mesh)=>void){
    root.updateMatrixWorld(true);
    // The bottom of the bodywork (the whole car's box also holds the lamps' light on the ground).
    const box=new T.Box3();for(const panel of panels)box.expandByObject(panel);const floor=box.min.y,ray=new T.Raycaster(),local=new T.Vector3();
    for(const end of [-1,1]){
      // Find the bumper skin by casting in from beyond that end of the car, from low down up, a little off the middle; the
      // first hit near the end of the car is the bottom of the bumper (lower rays pass under it into the underbody).
      // Root +x is the car's left: the rear strap goes to the right (-x), the front one to the left.
      const x=STRAP.side*end,cast=(y:number)=>{
        const from=root.localToWorld(new T.Vector3(x,0,end*(halfLength+STRAP.reach)));from.y=floor+y;
        const toward=root.localToWorld(new T.Vector3(x,0,0));toward.y=from.y;ray.set(from,toward.sub(from).normalize());ray.far=STRAP.reach+halfLength;
        // Straight at each panel: the draw batches take the panels themselves off every layer, which intersectObjects skips.
        const hits:T.Intersection[]=[];for(const panel of panels)panel.raycast(ray,hits);hits.sort((a,b)=>a.distance-b.distance);
        return hits[0]&&root.worldToLocal(local.copy(hits[0].point)).z*end>=halfLength*STRAP.end?hits[0]:undefined;};
      let edge:number|undefined;for(let y=STRAP.low;y<=STRAP.high&&edge===undefined;y+=STRAP.step)if(cast(y))edge=y;
      if(edge===undefined)continue;const hit=cast(edge+STRAP.lift)??cast(edge)!;
      const group=towStrap(colour);group.position.copy(root.worldToLocal(hit.point.clone()));group.position.z+=end*STRAP.proud;
      if(end>0)group.rotation.y=Math.PI;root.add(group);
      this.straps.push({group,swing:group.getObjectByName('tow_strap_swing')!,loop:group.getObjectByName('tow_strap_loop') as T.Mesh,panel:hit.object instanceof T.Mesh?hit.object:null,end,state:{pitch:0,pitchV:0,roll:0,rollV:0},torn:false});
    }
  }
  /** Strap swing angles out from the bumper (QA, radians), rear first. */
  get swings(){return this.straps.filter(s=>!s.torn).map(s=>+s.state.pitch.toFixed(3));}
  update(velocity:T.Vector3,dt:number){
    const t=Number.isFinite(dt)?Math.max(0,Math.min(.05,dt)):0;if(t<=0)return;
    if(!this.seen){this.before.copy(velocity);this.seen=true;}
    this.accel.copy(velocity).sub(this.before).divideScalar(t);this.before.copy(velocity);
    this.root.getWorldQuaternion(this.inverse).invert();this.local.copy(this.accel).applyQuaternion(this.inverse);this.localV.copy(velocity).applyQuaternion(this.inverse);
    for(const s of this.straps){
      // A repaired car gets a fresh strap back on.
      if(s.torn){if(s.panel?.visible&&(s.panel.userData.damage??0)<STRAP.tear/2)this.restore(s);continue;}
      if(s.panel&&strapTears(s.panel.userData.damage??0,s.panel.visible&&!!s.panel.parent)){s.torn=true;this.torn++;this.tear(s.loop);s.group.visible=false;continue;}
      swingStrap(s.state,{x:this.local.x,z:this.local.z},{x:this.localV.x,z:this.localV.z},s.end,t);
      // The group faces out from its bumper, so out is always its own -z, and its +x is mirrored at the front.
      s.swing.rotation.set(s.state.pitch,0,s.state.roll*-s.end);
    }
  }
  private restore(s:Hung){s.state.pitch=s.state.pitchV=s.state.roll=s.state.rollV=0;s.group.visible=s.loop.visible=true;s.torn=false;s.swing.rotation.set(0,0,0);}
  dispose(){for(const s of this.straps){s.group.removeFromParent();(s.loop.material as T.Material).dispose();}this.straps.length=0;}
}
