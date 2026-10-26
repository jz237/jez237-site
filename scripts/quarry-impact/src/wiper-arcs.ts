import * as T from 'three';
import {WIPERS,type WiperArm} from './windscreen-wipers';

/** Wiper arcs (offline rivals): an old banger's windscreen is filmed with dust (from ARCS.age of its age, ARCS.film opaque at
 * most, more the older) except where its wipers have swept it — a clean fan for each arm, from ARCS.inner of the arm's length
 * out to its tip, across the arm's whole stroke (WIPERS.sweep from its parked line, or ARCS.sweep for a fused pair) — with a darker ridge of grime left at the
 * fan's edges. Part of the glass: it goes when the screen goes. */
export const ARCS={age:.35,film:[.3,.62],inner:.3,ridge:.35,dust:0xcfc2a6,pivots:[-.3,.04],reach:.52,tall:.9,sweep:1.75} as const;
/** How thick the dust on a car this old (0–1) lies, 0 for a younger one. */
export const dustFilm=(age:number)=>Number.isFinite(age)&&age>=ARCS.age?ARCS.film[0]+(ARCS.film[1]-ARCS.film[0])*Math.min(1,(age-ARCS.age)/(1-ARCS.age)):0;
/** A front wiper's sweep in the root's frame: its pivot, its parked direction (unit), the glass normal it turns about (unit,
 * signed so a positive turn is its stroke) and its length. */
export type Sweep={pivot:T.Vector3;along:T.Vector3;axis:T.Vector3;length:number;sweep:number};
export function sweeps(arms:readonly WiperArm[],root:T.Object3D):Sweep[]{
  root.updateMatrixWorld(true);const inv=root.matrixWorld.clone().invert(),out:Sweep[]=[];
  for(const arm of arms){
    if(arm.rear||!arm.parent)continue;const g=arm.mesh.geometry;if(!g.boundingBox)g.computeBoundingBox();
    // The arm reaches from its pivot to twice its middle (parked, in its parent's space), as the rig found it.
    const local=new T.Matrix4().compose(arm.position,arm.rest,arm.mesh.scale),centre=g.boundingBox!.getCenter(new T.Vector3()).applyMatrix4(local);
    const toRoot=inv.clone().multiply(arm.parent.matrixWorld),pivot=arm.pivot.clone().applyMatrix4(toRoot),tip=centre.multiplyScalar(2).sub(arm.pivot).applyMatrix4(toRoot);
    const axis=arm.axis.clone().transformDirection(toRoot).multiplyScalar(arm.sign),along=tip.clone().sub(pivot),length=along.length();
    if(!(length>.05))continue;out.push({pivot,along:along.normalize(),axis,length,sweep:WIPERS.sweep});
  }
  return out.slice(0,2);
}
/** Two fans for a windscreen whose wipers are one fused mesh: pivots on its bottom edge (ARCS.pivots of its width from the
 * middle), parked across the car, ARCS.reach of its width long but no more than ARCS.tall of its height up the glass (so the top stays grimy), sweeping
 * ARCS.sweep up its face. */
export function defaultSweeps(pane:T.Mesh,root:T.Object3D):Sweep[]{
  root.updateMatrixWorld(true);const toRoot=root.matrixWorld.clone().invert().multiply(pane.matrixWorld),box=new T.Box3(),g=pane.geometry,normals=g.attributes.normal;
  g.computeBoundingBox();box.copy(g.boundingBox!).applyMatrix4(toRoot);if(box.isEmpty()||!normals)return [];
  const turn=new T.Matrix3().getNormalMatrix(toRoot),n=new T.Vector3(),axis=new T.Vector3();
  for(let i=0;i<normals.count;i++){n.fromBufferAttribute(normals,i).applyMatrix3(turn).normalize();if(n.z<0)n.negate();axis.add(n);}
  if(axis.lengthSq()<1e-8)return [];axis.normalize();const along=new T.Vector3(1,0,0).addScaledVector(axis,-axis.x).normalize();
  if(new T.Vector3().crossVectors(axis,along).y<0)axis.negate();
  const w=box.max.x-box.min.x,c=(box.min.x+box.max.x)/2,up=Math.hypot(box.max.y-box.min.y,box.max.z-box.min.z),length=Math.min(ARCS.reach*w,ARCS.tall*up);
  return ARCS.pivots.map(f=>({pivot:new T.Vector3(c+f*w,box.min.y+.03,box.max.z-.03),along:along.clone(),axis:axis.clone(),length,sweep:ARCS.sweep}));
}
const vertexShader='attribute vec3 wreckPosition;uniform mat4 toRoot;varying vec3 vRoot;void main(){vRoot=(toRoot*vec4(wreckPosition,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
const fragmentShader=`uniform vec3 pivots[2];uniform vec3 alongs[2];uniform vec3 axes[2];uniform float lengths[2];uniform float sweeps[2];uniform int count;uniform vec3 tint;uniform float film;uniform vec4 bounds;varying vec3 vRoot;
void main(){float clean=0.,ridge=0.;for(int i=0;i<2;i++){if(i>=count)break;vec3 r=vRoot-pivots[i],n=axes[i];r-=n*dot(r,n);float len=length(r);vec3 e=cross(n,alongs[i]);float a=atan(dot(r,e),dot(r,alongs[i]));
  float inA=smoothstep(-.04,.02,a)*(1.-smoothstep(sweeps[i]-.02,sweeps[i]+.04,a)),inR=smoothstep(lengths[i]*${ARCS.inner.toFixed(2)}-.02,lengths[i]*${ARCS.inner.toFixed(2)}+.01,len)*(1.-smoothstep(lengths[i]-.01,lengths[i]+.03,len));
  float fan=inA*inR;clean=max(clean,fan);float near=(1.-smoothstep(0.,.05,abs(len-lengths[i]-.03)))*inA+(1.-smoothstep(0.,.06,abs(a-sweeps[i]-.05)))*inR;ridge=max(ridge,near*(1.-fan));}
  vec2 uv=(vRoot.xy-bounds.xy)/(bounds.zw-bounds.xy);float edge=smoothstep(0.,.05,uv.x)*smoothstep(0.,.05,1.-uv.x)*smoothstep(0.,.07,uv.y)*smoothstep(0.,.07,1.-uv.y);
  float grain=.8+.2*fract(sin(dot(floor(vRoot.xy*90.),vec2(12.9898,78.233)))*43758.5);
  float alpha=film*edge*grain*(1.-clean*.94)+ridge*${ARCS.ridge.toFixed(2)}*film;if(alpha<.01)discard;gl_FragColor=vec4(tint*(1.-ridge*.35),min(.9,alpha));}`;
/** Films this windscreen with dust except for its wipers' fans (a child of the glass, sharing its geometry). Returns it. */
export function fitWiperArcs(pane:T.Mesh,root:T.Object3D,arcs:readonly Sweep[],film:number){
  const rest=pane.geometry.attributes.wreckPosition as T.BufferAttribute|undefined;if(!rest||!(film>0))return null;
  root.updateMatrixWorld(true);const toRoot=root.matrixWorld.clone().invert().multiply(pane.matrixWorld),box=new T.Box3().setFromBufferAttribute(rest).applyMatrix4(toRoot);
  const pick=<V>(f:(s:Sweep)=>V,none:V)=>[0,1].map(i=>arcs[i]?f(arcs[i]):none);
  const material=new T.ShaderMaterial({name:'Wiper arcs',transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-4,side:T.DoubleSide,
    uniforms:{toRoot:{value:toRoot},pivots:{value:pick(s=>s.pivot.clone(),new T.Vector3())},alongs:{value:pick(s=>s.along.clone(),new T.Vector3(1,0,0))},axes:{value:pick(s=>s.axis.clone(),new T.Vector3(0,0,1))},
      lengths:{value:pick(s=>s.length,0)},sweeps:{value:pick(s=>s.sweep,0)},count:{value:Math.min(2,arcs.length)},tint:{value:new T.Color(ARCS.dust)},film:{value:film},bounds:{value:new T.Vector4(box.min.x,box.min.y,box.max.x,box.max.y)}},vertexShader,fragmentShader});
  const mesh=new T.Mesh(pane.geometry,material);mesh.name='wiper_arcs';mesh.renderOrder=3;mesh.castShadow=mesh.receiveShadow=false;mesh.frustumCulled=false;pane.add(mesh);return mesh;
}
