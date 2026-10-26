import * as T from 'three';
import {measureTyreVisual} from './tyre-visual';

/** Rolling hubcaps (offline): a hubcap knocked off a wheel flies off, lands on its rim and rolls away across the floor
 * like a coin — slowing by ROLL.drag m/s², leaning over more the slower it goes (from ROLL.upright m/s, up to ROLL.lean
 * rad) so it curves round to the side it leans, and once it is down to ROLL.settle m/s it wobbles down flat over
 * ROLL.wobble s, its lean circling faster and faster, and lies there. A floor rising by more than its radius ahead (a
 * wall, a car) stops it dead. It bounces once on landing (ROLL.bounce of its fall) and clanks on landing and lying down.
 * At most ROLL.max are left about (the oldest go). */
export const ROLL={drag:.9,upright:4,lean:.7,turn:3,settle:.45,wobble:1.3,bounce:.25,max:16,spin:30} as const;
type Phase='flying'|'rolling'|'settling'|'flat';
export type RollingCap={mesh:T.Mesh;radius:number;thickness:number;p:T.Vector3;v:T.Vector3;yaw:number;speed:number;lean:number;spin:number;phase:Phase;settle:number;from:number};
/** Height of a coin's middle above the floor, radius r and thickness t, leaning `lean` rad from upright. */
export const capHeight=(r:number,t:number,lean:number)=>r*Math.cos(lean)+t/2*Math.sin(Math.abs(lean));
/** One step of a cap rolling on its rim at `speed` m/s: slower, leaning more, turning toward its lean. */
export function rollStep(c:{speed:number;lean:number;yaw:number;spin:number},radius:number,dt:number){
  const t=Number.isFinite(dt)?Math.max(0,Math.min(.05,dt)):0;
  c.speed=Math.max(0,c.speed-ROLL.drag*t);
  const target=ROLL.lean*Math.max(0,1-c.speed/ROLL.upright);c.lean+=(target-c.lean)*Math.min(1,t*4);
  // A leaning disc rolls round a curve: turn rate g·tan(lean)/speed, within reason.
  c.yaw+=Math.min(ROLL.turn,9.81*Math.tan(c.lean)/Math.max(.5,c.speed))*t;
  c.spin+=c.speed/Math.max(.02,radius)*t;
  return c;
}
const euler=new T.Euler(0,0,0,'YZX');
export class RollingCaps{
  readonly caps:RollingCap[]=[];
  rolled=0;
  constructor(private parent:T.Object3D,private floor:(x:number,z:number,near:number)=>number,private clank?:(at:T.Vector3,loud:number)=>void){}
  /** Takes the cap mesh off its wheel (hidden there) and sends a copy of it rolling: its axle is the wheel's (`axle`, a
   * world direction), and it leaves at `velocity`. */
  launch(source:T.Mesh,axle:T.Vector3,velocity:T.Vector3){
    source.updateWorldMatrix(true,false);
    // The cap in its own frame: centred, its axle along x (the wheel's), measured as a coin.
    const toAxle=new T.Matrix4().makeBasis(...frameOf(axle)).invert(),geometry=source.geometry.clone().applyMatrix4(new T.Matrix4().multiplyMatrices(toAxle,source.matrixWorld));
    geometry.computeBoundingBox();const box=geometry.boundingBox!,centre=box.getCenter(new T.Vector3());geometry.translate(-centre.x,-centre.y,-centre.z);geometry.computeBoundingBox();
    const size=geometry.boundingBox!.getSize(new T.Vector3()),radius=Math.max(.03,Math.max(size.y,size.z)/2),thickness=Math.max(.005,size.x);
    const mesh=new T.Mesh(geometry,source.material);mesh.name='rolling_hubcap';mesh.castShadow=true;this.parent.add(mesh);source.visible=false;
    const p=centre.applyMatrix4(new T.Matrix4().makeBasis(...frameOf(axle)));
    const cap:RollingCap={mesh,radius,thickness,p,v:velocity.clone(),yaw:Math.atan2(-axle.z,axle.x),speed:0,lean:.15,spin:0,phase:'flying',settle:0,from:0};
    if(this.caps.length>=ROLL.max){const old=this.caps.shift()!;old.mesh.removeFromParent();old.mesh.geometry.dispose();}
    this.caps.push(cap);this.rolled++;this.pose(cap);return cap;
  }
  step(dt:number){
    const t=Number.isFinite(dt)?Math.max(0,Math.min(.05,dt)):0;if(t<=0)return;
    for(const c of this.caps){
      if(c.phase==='flat')continue;
      const ground=this.floor(c.p.x,c.p.z,c.p.y);
      if(c.phase==='flying'){
        c.v.y-=9.81*t;c.p.addScaledVector(c.v,t);c.spin+=ROLL.spin*t;
        // It leaves square to the wheel and swings round to roll the way it is flying.
        if(Math.hypot(c.v.x,c.v.z)>.1){const turn=Math.atan2(Math.sin(Math.atan2(c.v.x,c.v.z)-c.yaw),Math.cos(Math.atan2(c.v.x,c.v.z)-c.yaw));c.yaw+=turn*Math.min(1,t*6);}
        const rest=ground+capHeight(c.radius,c.thickness,c.lean);
        if(c.p.y<=rest&&c.v.y<0){
          c.p.y=rest;const fall=-c.v.y;c.speed=Math.hypot(c.v.x,c.v.z)*.75;if(c.speed>.1)c.yaw=Math.atan2(c.v.x,c.v.z);
          this.clank?.(c.p,Math.min(1,fall/6));
          if(fall*ROLL.bounce>1){c.v.set(c.v.x*.75,fall*ROLL.bounce,c.v.z*.75);}else{c.v.set(0,0,0);c.phase=c.speed>ROLL.settle?'rolling':'settling';c.from=c.lean;}
        }
      }else if(c.phase==='rolling'){
        rollStep(c,c.radius,t);
        const nx=c.p.x+Math.sin(c.yaw)*c.speed*t,nz=c.p.z+Math.cos(c.yaw)*c.speed*t,ahead=this.floor(nx,nz,c.p.y);
        // A wall or a car in the way stops it dead; otherwise it rolls on over the floor.
        if(ahead-ground>c.radius){c.speed=0;}else{c.p.x=nx;c.p.z=nz;}
        c.p.y=this.floor(c.p.x,c.p.z,c.p.y)+capHeight(c.radius,c.thickness,c.lean);
        if(c.speed<=ROLL.settle){c.phase='settling';c.from=c.lean;c.settle=0;}
      }else{
        // Down it goes like a spun coin: the lean eases over to flat while it circles faster and faster.
        c.settle+=t;const k=Math.min(1,c.settle/ROLL.wobble),ease=k*k*(3-2*k);
        c.lean=c.from+(Math.PI/2-c.from)*ease;c.yaw+=(2+14*k)*t;c.spin+=c.speed/c.radius*t*(1-k);
        c.p.y=ground+capHeight(c.radius,c.thickness,c.lean);
        if(k>=1){c.phase='flat';c.lean=Math.PI/2;this.clank?.(c.p,.35);}
      }
      this.pose(c);
    }
  }
  private pose(c:RollingCap){
    // Heading about y, the lean tips its axle up about the heading, and it spins about its axle.
    euler.set(c.spin,c.yaw,c.lean,'YZX');c.mesh.quaternion.setFromEuler(euler);c.mesh.position.copy(c.p);
  }
  /** How many caps are still moving (QA). */
  get moving(){return this.caps.filter(c=>c.phase!=='flat').length;}
  reset(){for(const c of this.caps){c.mesh.removeFromParent();c.mesh.geometry.dispose();}this.caps.length=0;}
}
/** An orthonormal frame whose x is this axle and whose y is as near up as it can be. */
function frameOf(axle:T.Vector3):[T.Vector3,T.Vector3,T.Vector3]{
  const x=axle.clone().normalize();if(!Number.isFinite(x.x)||x.lengthSq()<.5)x.set(1,0,0);
  const up=Math.abs(x.y)>.95?new T.Vector3(1,0,0):new T.Vector3(0,1,0),z=new T.Vector3().crossVectors(x,up).normalize(),y=new T.Vector3().crossVectors(z,x).normalize();
  return [x,y,z];
}

/** Chrome hubcaps (offline) for wheels on classic tyres built without one: a domed dish CAP.size of the rim's radius,
 * pressed on the wheel's outer face CAP.inset of the tyre's half width out from its middle. Named as a hubcap, it pops off
 * in a knock like any other (vehicle HUBCAP_POP) and rolls away. */
export const CAP={size:.94,inset:.78,dome:.035,segments:28,colour:0xdfe3e6} as const;
const capMaterial=new T.MeshStandardMaterial({name:'Fitted hubcap chrome',color:CAP.colour,metalness:1,roughness:.34,side:T.DoubleSide});
export function fitHubcaps(root:T.Object3D,wheels:readonly (T.Object3D|undefined)[]){
  root.updateMatrixWorld(true);let fitted=0;const toRoot=root.matrixWorld.clone().invert();
  for(const w of wheels){
    if(!w)continue;let classic=false,capped=false;
    w.traverse(o=>{if(!(o instanceof T.Mesh))return;const name=`${o.name} ${(o.material as T.Material)?.name??''}`;if(/classic tire/i.test(name))classic=true;if(/brushed chrome|wheel trim|hub ?cap|centre ?cap|domed ?cap/i.test(name))capped=true;});
    if(!classic||capped)continue;
    const {profile}=measureTyreVisual(w);if(!(profile.rimRadius>.05)||!(profile.halfWidth>.02))continue;
    // Out is away from the car's middle: which way the wheel's own x axis points from there.
    const side=Math.sign(w.getWorldPosition(new T.Vector3()).applyMatrix4(toRoot).x)||1,axis=new T.Vector3(1,0,0).transformDirection(w.matrixWorld).transformDirection(toRoot),out=Math.sign(axis.x*side)||1;
    const r=profile.rimRadius*CAP.size,points=[[0,CAP.dome],[r*.22,CAP.dome*.95],[r*.32,CAP.dome*.62],[r*.7,CAP.dome*.5],[r*.9,CAP.dome*.3],[r,0]].map(([x,y])=>new T.Vector2(x,y));
    const geometry=new T.LatheGeometry(points,CAP.segments).rotateZ(-Math.PI/2*out);
    const cap=new T.Mesh(geometry,capMaterial);cap.name='hubcap_fitted';cap.castShadow=false;
    const scale=w.getWorldScale(new T.Vector3());cap.scale.set(1/scale.x,1/scale.y,1/scale.z);cap.position.set(out*profile.halfWidth*CAP.inset/scale.x,0,0);
    w.add(cap);fitted++;
  }
  return fitted;
}
