import * as T from 'three';
/** Dangling lamps (offline): a lamp smashed past DANGLE.pop of damage pops DANGLE.out m out of its socket and hangs
 * DANGLE.slack m below it on two wires that run to its middle, tipped out to DANGLE.hang rad, its chrome reflector housing
 * (DANGLE.housing m deep) behind it now showing. It swings as a damped pendulum (DANGLE.omega rad/s, damping
 * DANGLE.damping) the car's acceleration drives like a pendulum's (DANGLE.respond of the full lean a free pendulum would
 * take: braking throws it forward, accelerating back, cornering sideways), never past DANGLE.max from hanging. Lenses wider
 * than DANGLE.width m (a light bar) or narrower than DANGLE.narrow m (a sliver of a cluster) stay put. Past DANGLE.tear it
 * tears off its wires. */
export const DANGLE={pop:12,tear:24,out:.1,slack:.12,housing:.09,hang:.9,omega:7.5,damping:.22,respond:.75,max:.8,maxAccel:120,width:.8,narrow:.1,wire:.004} as const;
export const lampPops=(damage:number,visible:boolean)=>visible&&Number.isFinite(damage)&&damage>DANGLE.pop;
export const lampTears=(damage:number)=>Number.isFinite(damage)&&damage>DANGLE.tear;
/** One step of a hanging lamp's swing: pitch out from the socket and roll to the side, given the car's acceleration in its
 * own frame (x right, z forward; m/s²) and which end the lamp is on (1 front, -1 back). */
export function swingLamp(s:{pitch:number;pitchV:number;roll:number;rollV:number},accel:{x:number;z:number},end:number,dt:number){
  const t=Number.isFinite(dt)?Math.max(0,Math.min(.05,dt)):0,clip=(a:number)=>Number.isFinite(a)?Math.max(-DANGLE.maxAccel,Math.min(DANGLE.maxAccel,a)):0;
  const ax=clip(accel.x),az=clip(accel.z),w=DANGLE.omega,c=2*DANGLE.damping*w,k=w*w*DANGLE.respond/9.81;
  // Braking (az < 0) flings a front lamp further out; accelerating swings it back toward the car.
  s.pitchV+=(-w*w*(s.pitch-DANGLE.hang)-c*s.pitchV-k*az*end)*t;s.pitch+=s.pitchV*t;
  s.rollV+=(-w*w*s.roll-c*s.rollV+k*ax)*t;s.roll+=s.rollV*t;
  s.pitch=Math.max(DANGLE.hang-DANGLE.max,Math.min(DANGLE.hang+DANGLE.max,s.pitch));s.roll=Math.max(-DANGLE.max,Math.min(DANGLE.max,s.roll));
  return s;
}
type Hanging={mesh:T.Mesh;parent:T.Object3D;position:T.Vector3;quaternion:T.Quaternion;pivot:T.Group;housing:T.Mesh;wires:T.Mesh[];socket:T.Vector3;top:number;end:number;drop:number;pitch:number;pitchV:number;roll:number;rollV:number;torn:boolean};
const wireMaterial=new T.MeshStandardMaterial({color:0x151515,roughness:.7,name:'Lamp wiring'}),housingMaterial=new T.MeshStandardMaterial({color:0xd4d8dc,metalness:1,roughness:.22,name:'Lamp reflector'}),wireGeometry=new T.CylinderGeometry(1,1,1,5).translate(0,-.5,0),DOWN=new T.Vector3(0,-1,0);
/** Watches a car's lamps and hangs the smashed ones out of their sockets. */
export class LampDangle{
  private hanging=new Map<T.Mesh,Hanging>();
  // Lenses too wide to hang (a light bar across the car).
  private skip=new Set<T.Mesh>();
  private before=new T.Vector3();private seen=false;
  private box=new T.Box3();private local=new T.Vector3();private accel=new T.Vector3();private inverse=new T.Quaternion();private span=new T.Vector3();private from=new T.Vector3();
  /** Lamps hanging and torn away so far (QA). */
  popped=0;torn=0;
  constructor(private root:T.Object3D,private lamps:readonly {mesh:T.Mesh;end:number}[],private tear:(mesh:T.Mesh)=>void){}
  get count(){return this.hanging.size;}
  /** Lamps now hanging (QA): how far each has swung out from its socket (radians). */
  get swings(){return [...this.hanging.values()].filter(h=>!h.torn).map(h=>+h.pitch.toFixed(3));}
  update(velocity:T.Vector3,dt:number){
    const t=Number.isFinite(dt)?Math.max(0,Math.min(.05,dt)):0;if(t<=0)return;
    // The car's acceleration in its own frame.
    if(!this.seen){this.before.copy(velocity);this.seen=true;}
    this.accel.copy(velocity).sub(this.before).divideScalar(t);this.before.copy(velocity);
    this.root.getWorldQuaternion(this.inverse).invert();this.local.copy(this.accel).applyQuaternion(this.inverse);
    for(const {mesh,end} of this.lamps){
      const damage=mesh.userData.damage??0;let h=this.hanging.get(mesh);
      if(!h){if(this.skip.has(mesh)||!lampPops(damage,mesh.visible)||!mesh.parent)continue;h=this.pop(mesh,end)??undefined;if(!h){this.skip.add(mesh);continue;}}
      // A repaired car has its lamps back in their sockets.
      if(damage<DANGLE.pop/2&&mesh.visible){this.put(h);continue;}
      if(h.torn)continue;
      if(lampTears(damage)||!mesh.visible){this.cut(h,lampTears(damage)&&mesh.visible);continue;}
      swingLamp(h,{x:this.local.x,z:this.local.z},h.end,t);
      // It drops out of the socket onto the end of its wires, its foot swung out away from the car.
      h.drop=Math.min(DANGLE.slack,h.drop+t*DANGLE.slack*6);
      const k=h.drop/DANGLE.slack;h.pivot.position.set(h.socket.x,h.socket.y-h.drop,h.socket.z+h.end*DANGLE.out*k);h.pivot.rotation.set(-h.pitch*h.end,0,h.roll);
      // Its wires run from the top of the socket, just inside it, to the lamp's middle.
      for(const [i,w] of h.wires.entries()){const side=i?1:-1;this.from.set(h.socket.x+side*.04,h.socket.y+h.top,h.socket.z-h.end*.03);this.span.copy(h.pivot.position).sub(this.from);this.span.x+=side*.04;
        const length=Math.max(.01,this.span.length());w.position.copy(this.from);w.quaternion.setFromUnitVectors(DOWN,this.span.divideScalar(length));w.scale.set(DANGLE.wire,length,DANGLE.wire);}
    }
  }
  private pop(mesh:T.Mesh,end:number):Hanging|null{
    const parent=mesh.parent!;mesh.updateWorldMatrix(true,false);this.box.setFromObject(mesh);
    const lo=parent.worldToLocal(this.box.min.clone()),hi=parent.worldToLocal(this.box.max.clone());
    const width=Math.abs(hi.x-lo.x);if(width>DANGLE.width||width<DANGLE.narrow)return null;
    // It hangs by its middle, its wires running from the top of the socket at the outer end of the car.
    const socket=new T.Vector3((lo.x+hi.x)/2,(lo.y+hi.y)/2,end>0?Math.max(lo.z,hi.z):Math.min(lo.z,hi.z)),top=Math.abs(hi.y-lo.y)/2;
    const pivot=new T.Group();pivot.name='dangling_lamp';pivot.position.copy(socket);parent.add(pivot);pivot.updateWorldMatrix(true,false);
    // The reflector housing the lens sat in, now out in the open behind it.
    const housing=new T.Mesh(new T.BoxGeometry(Math.max(.05,Math.abs(hi.x-lo.x)*.9),Math.max(.06,top*2),DANGLE.housing),housingMaterial);housing.name='lamp_housing';housing.position.z=-end*DANGLE.housing/2;housing.castShadow=true;pivot.add(housing);
    const h:Hanging={mesh,parent,position:mesh.position.clone(),quaternion:mesh.quaternion.clone(),pivot,housing,wires:[],socket,top,end,drop:0,pitch:0,pitchV:0,roll:0,rollV:0,torn:false};
    pivot.attach(mesh);
    for(let i=0;i<2;i++){const w=new T.Mesh(wireGeometry,wireMaterial);w.name='lamp_wire';w.castShadow=false;parent.add(w);h.wires.push(w);}
    this.hanging.set(mesh,h);this.popped++;return h;
  }
  private cut(h:Hanging,flying:boolean){
    h.torn=true;for(const w of h.wires)w.removeFromParent();h.wires.length=0;
    if(flying){this.torn++;this.tear(h.mesh);this.tear(h.housing);}else h.housing.visible=false;
  }
  private put(h:Hanging){for(const w of h.wires)w.removeFromParent();h.housing.geometry.dispose();h.parent.add(h.mesh);h.mesh.position.copy(h.position);h.mesh.quaternion.copy(h.quaternion);h.pivot.removeFromParent();this.hanging.delete(h.mesh);}
  /** Every lamp back in its socket. */
  restore(){for(const h of [...this.hanging.values()])this.put(h);this.seen=false;}
  dispose(){this.restore();}
}
