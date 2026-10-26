import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

/** Mirror danglers (offline): something hangs from the rear-view mirror of most cars — a pair of fuzzy dice (DANGLE.dice of
 * them) or a pine-tree air freshener (DANGLE.tree), each car its own and in its own colour — on a cord DANGLE.cord m long, from
 * just under the roof behind the top of the windscreen. It swings as a lightly damped pendulum (DANGLE.omega rad/s, damping
 * DANGLE.damping) in the car's own frame: accelerating throws it back, braking forward, cornering out, never past DANGLE.max. */
export const DANGLE={dice:.6,tree:.3,cord:.13,die:.055,omega:8.5,damping:.07,max:1.2,maxAccel:120,above:.06,back:.07,
  diceColours:[0xf06aa8,0xf2f2f2,0xd8241c,0x222222,0x3fbf4a] as const,treeColours:[0x2f9e44,0xf2c21a,0xd8241c] as const} as const;
export type DangleKind='dice'|'tree'|'none';
const hash=(n:number,salt:number)=>Math.abs(Math.sin(n*31.41+salt*27.18)*43758.5453)%1;
/** What hangs in car `id`, and its colour. */
export function dangleFor(id:number):{kind:DangleKind;colour:number}{
  const n=Number.isFinite(id)?id:0,r=hash(n,1),c=hash(n,2);
  if(r<DANGLE.dice)return{kind:'dice',colour:DANGLE.diceColours[Math.floor(c*DANGLE.diceColours.length)]};
  if(r<DANGLE.dice+DANGLE.tree)return{kind:'tree',colour:DANGLE.treeColours[Math.floor(c*DANGLE.treeColours.length)]};
  return{kind:'none',colour:0};
}
export type Pendulum={pitch:number;pitchV:number;roll:number;rollV:number};
/** One step of the pendulum (car acceleration in its own frame, x left z forward). Pitch is the foot swinging back. */
export function swingDangler(s:Pendulum,accel:{x:number;z:number},dt:number){
  const t=Number.isFinite(dt)?Math.max(0,Math.min(.05,dt)):0,clip=(a:number)=>Number.isFinite(a)?Math.max(-DANGLE.maxAccel,Math.min(DANGLE.maxAccel,a)):0;
  const w=DANGLE.omega,c=2*DANGLE.damping*w,back=Math.atan2(clip(accel.z),9.81),side=Math.atan2(-clip(accel.x),9.81);
  s.pitchV+=(-w*w*(s.pitch-back)-c*s.pitchV)*t;s.pitch+=s.pitchV*t;s.rollV+=(-w*w*(s.roll-side)-c*s.rollV)*t;s.roll+=s.rollV*t;
  for(const k of ['pitch','roll'] as const){if(Math.abs(s[k])>DANGLE.max){s[k]=Math.sign(s[k])*DANGLE.max;s[k==='pitch'?'pitchV':'rollV']*=-.3;}}
  return s;
}
/** The ornament's one geometry, hanging down from the origin: the cord and, at its foot, the dice or the tree (vertex coloured). */
export function danglerGeometry(kind:DangleKind,colour:number){
  const parts:T.BufferGeometry[]=[],paint=(g:T.BufferGeometry,hex:number)=>{const c=new T.Color(hex),n=g.attributes.position.count,a=new Float32Array(n*3);for(let i=0;i<n;i++)c.toArray(a,i*3);g.setAttribute('color',new T.BufferAttribute(a,3));return g.toNonIndexed();};
  parts.push(paint(new T.BoxGeometry(.004,DANGLE.cord,.004).translate(0,-DANGLE.cord/2,0),0x1a1a1a));
  if(kind==='dice')for(const [x,y,turn] of [[-.024,-DANGLE.cord-.02,.4],[.026,-DANGLE.cord-.045,-.3]] as const)parts.push(paint(new T.BoxGeometry(DANGLE.die,DANGLE.die,DANGLE.die).rotateY(turn).rotateX(.3).translate(x,y,0),colour));
  else if(kind==='tree'){const s=new T.Shape([[0,0],[.035,-.035],[.015,-.035],[.045,-.075],[.02,-.075],[.05,-.115],[-.05,-.115],[-.02,-.075],[-.045,-.075],[-.015,-.035],[-.035,-.035]].map(([x,y])=>new T.Vector2(x,y)));
    parts.push(paint(new T.ShapeGeometry(s).translate(0,-DANGLE.cord,0),colour));}
  const merged=mergeGeometries(parts.map(p=>{p.deleteAttribute('uv');return p;}))!;merged.computeVertexNormals();return merged;
}
const material=new T.MeshStandardMaterial({name:'Mirror dangler',vertexColors:true,roughness:.95,metalness:0,side:T.DoubleSide});
/** Hangs a car's ornament behind its windscreen and swings it. */
export class Danglers{
  readonly group=new T.Group();readonly swing=new T.Group();readonly state:Pendulum={pitch:0,pitchV:0,roll:0,rollV:0};
  private before=new T.Vector3();private seen=false;private accel=new T.Vector3();private inverse=new T.Quaternion();
  /** The ornament of this kind and colour in `root`, hung from `at` (the root's frame). */
  constructor(private root:T.Object3D,readonly kind:Exclude<DangleKind,'none'>,colour:number,at:T.Vector3){
    this.group.name='mirror_dangler';this.group.position.copy(at);this.swing.add(new T.Mesh(danglerGeometry(kind,colour),material));this.group.add(this.swing);
    this.group.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=false;o.receiveShadow=false;o.name='mirror_dangler_mesh';}});root.add(this.group);
  }
  update(velocity:T.Vector3,dt:number){
    const t=Number.isFinite(dt)?Math.max(0,Math.min(.05,dt)):0;if(t<=0)return;
    if(!this.seen){this.before.copy(velocity);this.seen=true;}
    this.accel.copy(velocity).sub(this.before).divideScalar(t);this.before.copy(velocity);
    this.root.getWorldQuaternion(this.inverse).invert();this.accel.applyQuaternion(this.inverse);
    swingDangler(this.state,{x:this.accel.x,z:this.accel.z},t);
    // The foot swinging back (toward −z) is a positive turn about +x.
    this.swing.rotation.set(this.state.pitch,0,this.state.roll);
  }
  dispose(){this.group.removeFromParent();(this.swing.children[0] as T.Mesh).geometry.dispose();}
}
/** Where a car's mirror hangs, in its root's frame: on its centre line DANGLE.above m under the roof found above the driver
 * (`helmet`, root frame) among `surfaces`, DANGLE.back m behind the windscreen found ahead at that height (the roof 0.25 m over
 * the helmet, and the windscreen 0.55 m ahead, if none is found). */
export function mirrorPoint(root:T.Object3D,helmet:T.Vector3,surfaces:readonly T.Mesh[]){
  root.updateMatrixWorld(true);const ray=new T.Raycaster(),hits:T.Intersection[]=[];
  const room=(from:T.Vector3,along:T.Vector3)=>{ray.set(from.clone().applyMatrix4(root.matrixWorld),along.clone().transformDirection(root.matrixWorld));ray.far=2.5;hits.length=0;
    for(const m of surfaces)m.raycast(ray,hits);return hits.reduce((d,h)=>Math.min(d,h.distance),Infinity);};
  const up=room(new T.Vector3(0,helmet.y,helmet.z+.2),new T.Vector3(0,1,0)),y=helmet.y+(Number.isFinite(up)?up:.25)-DANGLE.above;
  const ahead=room(new T.Vector3(0,y,helmet.z),new T.Vector3(0,0,1));
  return new T.Vector3(0,y,helmet.z+(Number.isFinite(ahead)?Math.max(.2,ahead-DANGLE.back):.55));
}
