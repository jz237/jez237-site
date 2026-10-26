import * as T from 'three';
import {GRID,decalGeometry,restIn} from './decal-geometry';

/** Exhaust soot (offline): the back of a car goes black round its tailpipes. An old banger arrives sooted already (from
 * SOOT.age of its age, SOOT.start of the way, more the older), and every car sooted further as it is driven: held flat out
 * (past SOOT.full throttle) SOOT.flat a second, each oil-burning puff SOOT.puff, a crushed pipe's rich smoke SOOT.crushed a
 * second under throttle, up to 1. The stain is laid over the rear panels within SOOT.reach m of each tip — darkest at the
 * outlet, SOOT.radius m across it, smeared up to SOOT.rise m above and fading SOOT.depth m forward of it, streaky, on the faces
 * looking back — and goes with the panel it is on. */
export const SOOT={age:.2,start:[.3,.85],full:.92,flat:.004,puff:.012,crushed:.012,reach:.45,radius:.2,rise:.34,depth:.4,dark:0x0a0908,max:.95} as const;
/** How sooted a car this old (0–1) arrives. */
export const startingSoot=(age:number)=>Number.isFinite(age)&&age>=SOOT.age?SOOT.start[0]+(SOOT.start[1]-SOOT.start[0])*Math.min(1,(age-SOOT.age)/(1-SOOT.age)):0;
/** More soot after dt s at this throttle, with these oil-burning puffs and a crushed pipe or not. */
export function sootStep(soot:number,throttle:number,dt:number,puffs:number,crushed:boolean){
  const t=Number.isFinite(dt)?Math.max(0,Math.min(.25,dt)):0,pedal=Number.isFinite(throttle)?throttle:0,s=Number.isFinite(soot)?soot:0;
  const add=(pedal>=SOOT.full?SOOT.flat*t:0)+(Number.isFinite(puffs)&&puffs>0?puffs*SOOT.puff:0)+(crushed&&pedal>.3?SOOT.crushed*t:0);
  return Math.max(0,Math.min(1,s+add));
}
/** Each model's tailpipe outlets (the back end of its own exhaust pipes, two at most) in the model's frame, measured from the
 * model files: named exhaust pipes where a model has them (not the manifolds); the BrightRetro classics' paired pipes each side,
 * checked by eye.
 * The names are gone once a model is loaded (its parts are batched), hence the table. */
export const TIPS:Record<string,readonly (readonly [number,number,number])[]>={alder:[[-.42,.31,-2.42]],buggy:[[.36,.46,-1.74]],compact:[[-.43,.33,-1.82],[.43,.33,-1.82]],cornet:[[.46,.3,-2.4]],
  coupe:[[-.57,.34,-1.96],[.57,.34,-1.96]],fernleigh:[[.37,.3,-2.2]],hatch:[[-.27,.33,-1.56],[.27,.33,-1.56]],hollins:[[.46,.34,-2.5]],kite:[[.34,.32,-1.91]],linnet:[[-.32,.24,-2]],
  marten:[[-.33,.34,-2.08]],morrow:[[-.42,.31,-2.42],[.42,.31,-2.42]],muscle:[[-.42,.42,-2.41],[.42,.42,-2.41]],pipit:[[-.18,.29,-1.53]],ravenhill:[[-.46,.28,-2.88]],
  regent:[[-.42,.31,-2.64],[.42,.31,-2.64]],saber:[[-.37,.24,-2.18]],sedan:[[-.28,.32,-1.9],[.28,.32,-1.9]],shuttle:[[.49,.35,-3]],starfin:[[-.46,.28,-2.7]],tern:[[-.32,.28,-1.82]],
  tordal:[[-.4,.27,-2.45]],trail:[[.4,.38,-2.2]],utility:[[-.42,.42,-2.9],[.42,.42,-2.9]],van:[[-.42,.33,-2.22]],wagon:[[-.42,.42,-2.41],[.42,.42,-2.41]]};
/** A car's tailpipe outlets in its root's frame: its model's (`model` placed under `root`), or `fallback` for a model not in
 * the table. */
export function exhaustTips(kind:string,model:T.Object3D,root:T.Object3D,fallback:T.Vector3){
  const tips=TIPS[kind];if(!tips?.length)return [fallback.clone()];
  root.updateMatrixWorld(true);const toRoot=root.matrixWorld.clone().invert().multiply(model.matrixWorld);
  return tips.map(t=>new T.Vector3(...t).applyMatrix4(toRoot));
}
const vertexShader='attribute vec3 wreckPosition;uniform mat4 toRoot;varying vec3 vRoot;varying float vBack;void main(){vRoot=(toRoot*vec4(wreckPosition,1.)).xyz;vBack=normalize(mat3(toRoot)*normal).z;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
const fragmentShader=`uniform vec3 tips[2];uniform int count;uniform float soot;uniform vec3 dark;varying vec3 vRoot;varying float vBack;
void main(){float s=0.;for(int i=0;i<2;i++){if(i>=count)break;vec3 d=vRoot-tips[i];float up=d.y>0.?d.y/${SOOT.rise.toFixed(3)}:-d.y/${(SOOT.radius*.6).toFixed(3)};
  float r=length(vec2(d.x/${SOOT.radius.toFixed(3)},up))+abs(d.z)*${(1/SOOT.depth).toFixed(3)};s=max(s,1.-smoothstep(.45,1.15,r));}
  float cell=vRoot.x*60.+sin(vRoot.y*23.)*.6,a=fract(sin(floor(cell)*12.9898)*43758.5),b=fract(sin((floor(cell)+1.)*12.9898)*43758.5),streak=.72+.28*mix(a,b,smoothstep(0.,1.,fract(cell)));s*=soot*streak*(1.-smoothstep(-.35,.1,vBack));if(s<.01)discard;gl_FragColor=vec4(dark,s*${SOOT.max.toFixed(2)});}`;
/** Lays the soot over the rear panels near the tips (children of the panels): over just the triangles within reach of a tip
 * that look back, drawn from the panel's own vertex buffers. Returns the shared soot level (0–1) the stains show, or null when
 * no panel is near. */
export function fitSoot(root:T.Object3D,panels:readonly T.Mesh[],tips:readonly T.Vector3[]){
  root.updateMatrixWorld(true);const inv=root.matrixWorld.clone().invert(),level={value:0},box=new T.Box3();let n=0;
  const tipList=[0,1].map(i=>(tips[i]??tips[0]).clone());
  for(const p of panels){
    if(!p.geometry.attributes.wreckPosition||!p.geometry.attributes.normal||/interior|inner/i.test(p.name))continue;
    const toRoot=inv.clone().multiply(p.matrixWorld);p.geometry.computeBoundingBox();box.copy(p.geometry.boundingBox!).applyMatrix4(toRoot);
    if(!tips.some(t=>box.distanceToPoint(t)<SOOT.reach))continue;
    const at=restIn(p.geometry,toRoot),turn=new T.Matrix3().getNormalMatrix(toRoot),normals=p.geometry.attributes.normal,n3=new T.Vector3();
    const near=(i:number)=>tips.some(t=>Math.hypot(at[i*3]-t.x,at[i*3+1]-t.y,at[i*3+2]-t.z)<SOOT.reach+GRID),back=(i:number)=>n3.fromBufferAttribute(normals,i).applyMatrix3(turn).normalize().z<-.35;
    const patch=decalGeometry(p.geometry,(a,b,c)=>(near(a)||near(b)||near(c))&&(back(a)||back(b)||back(c)));if(!patch)continue;
    const material=new T.ShaderMaterial({name:'Exhaust soot',transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-4,
      uniforms:{tips:{value:tipList},count:{value:Math.min(2,tips.length)},soot:level,dark:{value:new T.Color(SOOT.dark)},toRoot:{value:toRoot}},vertexShader,fragmentShader});
    const mesh=new T.Mesh(patch,material);mesh.name='exhaust_soot';mesh.renderOrder=3;mesh.castShadow=mesh.receiveShadow=false;mesh.frustumCulled=false;p.add(mesh);n++;
  }
  return n?level:null;
}
