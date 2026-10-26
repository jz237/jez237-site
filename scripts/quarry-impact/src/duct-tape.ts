import * as T from 'three';
import {GRID,decalGeometry,restIn} from './decal-geometry';

/** Duct tape (offline rivals): on TAPE.share of the old bangers (from TAPE.age of their age) a cracked bumper corner is held
 * together with silver duct tape — TAPE.strips strips, TAPE.width m wide, each wrapped round the corner from the end of the car
 * onto its side, up to TAPE.reach m from the corner each way and a little askew, with torn ends; sometimes both corners of an end.
 * Laid over the bumper's own panels (and what lies under the tape), so it dents and falls off with them. */
export const TAPE={age:.4,share:.45,both:.3,strips:3,width:.05,reach:.2,inset:.1,lift:.04,colour:0x9da2a6} as const;
const hash=(n:number,salt:number)=>Math.abs(Math.sin(n*37.19+salt*13.73)*43758.5453)%1;
/** Where car `id` of this age is taped: which end (1 front, −1 rear) and which corners (−1 the car's left, 1 its right), or null. */
export function tapeFor(id:number,age:number){
  const n=Number.isFinite(id)?id:0;if(!(age>=TAPE.age)||hash(n,1)>=TAPE.share)return null;
  const end=hash(n,2)<.5?1:-1,side=hash(n,3)<.5?-1:1;return {end,corners:hash(n,4)<TAPE.both?[-1,1]:[side]};
}
/** Each strip as (height above the corner's middle, slope up along the wrap, reach), different for every car. */
export function strips(id:number){
  const n=Number.isFinite(id)?id:0;
  return Array.from({length:TAPE.strips},(_,k)=>new T.Vector3((k-(TAPE.strips-1)/2)*TAPE.width*1.15+(hash(n,10+k)-.5)*.02,(hash(n,20+k)-.5)*.5,TAPE.reach*(.7+.3*hash(n,30+k))));
}
/** The corner of this end of the car (in the root's frame): at the outer end of its bumper panels (named for bumpers; a valance
 * where a car has no bumper, not its seals, lamps or grille), TAPE.inset in from the side, TAPE.lift above their top edge (over it onto the body, where tape shows; a chrome bar
 * would hide silver tape) and on the body's surface there — or null. */
export function bumperCorner(root:T.Object3D,panels:readonly T.Mesh[],end:number,side:number){
  root.updateMatrixWorld(true);const inv=root.matrixWorld.clone().invert(),b=new T.Box3();
  const span=(named:RegExp)=>{const box=new T.Box3();for(const p of panels){
    if(!named.test(p.name)||/seal|lamp|indicator|grille|light|plate/i.test(p.name))continue;p.geometry.computeBoundingBox();b.copy(p.geometry.boundingBox!).applyMatrix4(inv.clone().multiply(p.matrixWorld));
    if(Math.sign(b.getCenter(new T.Vector3()).z)===end)box.union(b);}return box;};
  let box=span(/bumper/i);if(box.isEmpty())box=span(/valance/i);
  if(box.isEmpty())return null;
  const corner=new T.Vector3(side>0?box.max.x-TAPE.inset:box.min.x+TAPE.inset,box.max.y+TAPE.lift,end>0?box.max.z:box.min.z);
  // Back to the body's own surface at that height (a bar bumper stands out from it), where the tape is stuck.
  const v=new T.Vector3();let reach=-Infinity;
  for(const p of panels){const rest=p.geometry.attributes.wreckPosition;if(!rest||/interior|inner|glass/i.test(p.name))continue;const toRoot=inv.clone().multiply(p.matrixWorld);
    for(let i=0;i<rest.count;i++){v.fromBufferAttribute(rest,i).applyMatrix4(toRoot);if(v.y>box.max.y+.005&&v.y<corner.y+TAPE.width&&Math.abs(v.x-corner.x)<TAPE.inset&&v.z*end>reach)reach=v.z*end;}}
  if(Number.isFinite(reach))corner.z=reach*end;
  return corner;
}
const vertexShader='attribute vec3 wreckPosition;uniform mat4 toRoot;varying vec3 vRoot;varying vec3 vNormal;void main(){vRoot=(toRoot*vec4(wreckPosition,1.)).xyz;vNormal=normalize(mat3(toRoot)*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
const fragmentShader=`uniform vec3 corner;uniform vec3 strips[${TAPE.strips}];uniform vec3 tint;varying vec3 vRoot;varying vec3 vNormal;
void main(){vec3 d=vRoot-corner;float h=length(d.xz);
  // Along the wrap: negative across the end of the car, positive along its side.
  float u=abs(d.z)>abs(d.x)?h:-h,on=0.;
  for(int i=0;i<${TAPE.strips};i++){vec3 s=strips[i];float y=s.x+s.y*u,torn=s.z+.012*sin(d.y*157.+float(i)*2.1);
    on=max(on,(1.-smoothstep(${(TAPE.width/2-.003).toFixed(4)},${(TAPE.width/2).toFixed(4)},abs(d.y-y)))*(1.-smoothstep(torn-.004,torn,abs(u))));}
  if(on<.02)discard;float lit=.72+.28*max(0.,dot(vNormal,normalize(vec3(.3,.85,.4)))),crease=.9+.05*sin(u*230.)+.05*sin((d.y+u)*900.)*sin((d.y-u)*900.);
  gl_FragColor=vec4(tint*lit*crease,on);}`;
/** Tapes this corner: an overlay on every panel within reach of it (children of the panels), over just the triangles the strips
 * can cover, drawn from the panel's own vertex buffers. Returns how many panels. */
export function fitTape(root:T.Object3D,panels:readonly T.Mesh[],corner:T.Vector3,id:number){
  root.updateMatrixWorld(true);const inv=root.matrixWorld.clone().invert(),box=new T.Box3(),list=strips(id);let n=0;
  for(const p of panels){
    if(!p.geometry.attributes.wreckPosition||!p.geometry.attributes.normal||/interior|inner|glass/i.test(p.name))continue;
    const toRoot=inv.clone().multiply(p.matrixWorld);p.geometry.computeBoundingBox();box.copy(p.geometry.boundingBox!).applyMatrix4(toRoot);
    if(box.distanceToPoint(corner)>TAPE.reach+TAPE.width)continue;
    const at=restIn(p.geometry,toRoot),high=TAPE.width*TAPE.strips,near=(i:number)=>Math.hypot(at[i*3]-corner.x,at[i*3+2]-corner.z)<TAPE.reach+TAPE.width+GRID&&Math.abs(at[i*3+1]-corner.y)<high+GRID;
    const patch=decalGeometry(p.geometry,(a,b,c)=>near(a)||near(b)||near(c));if(!patch)continue;
    const material=new T.ShaderMaterial({name:'Duct tape',transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-4,
      uniforms:{toRoot:{value:toRoot},corner:{value:corner.clone()},strips:{value:list},tint:{value:new T.Color(TAPE.colour)}},vertexShader,fragmentShader});
    const mesh=new T.Mesh(patch,material);mesh.name='duct_tape';mesh.renderOrder=3;mesh.castShadow=mesh.receiveShadow=false;mesh.frustumCulled=false;p.add(mesh);n++;
  }
  return n;
}
