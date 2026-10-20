import * as T from 'three';
import {RADIATOR} from './damage-handling';
/** Fluid leaks (offline events only): a crushed radiator drips coolant and a badly damaged engine
 * drips oil. Drips leave spots on the ground that pool while the car sits still, fade with time and
 * cost grip under any tyre that rolls over them: oil a lot, coolant a little. */
const clamp01=(v:number)=>Math.max(0,Math.min(1,Number.isFinite(v)?v:0));
export const LEAK={oilOnset:.5,slowest:1.6,fastest:.3,merge:.8,maxRadius:1.1} as const;
export type FluidKind=0|1; // 0 oil, 1 coolant
export const SLICK={oil:{grip:.5,life:300,radius:.2},coolant:{grip:.82,life:45,radius:.16}} as const;
/** Leak severity 0..1 from front compression (radiator) and engine damage (oil). */
export function leakRates(frontCompression:number,engineDamage:number){
  return{coolant:clamp01((frontCompression-RADIATOR.onset)/(1-RADIATOR.onset)),oil:clamp01((engineDamage-LEAK.oilOnset)/(1-LEAK.oilOnset))};
}
/** Seconds between drips at this severity (0 = no leak). */
export function dripInterval(severity:number){const s=clamp01(severity);return s>0?LEAK.slowest-(LEAK.slowest-LEAK.fastest)*s:Infinity;}
/** Grip multiplier for a tyre at distance d from a spot of this kind, radius and remaining strength. */
export function slickGrip(kind:FluidKind,d:number,radius:number,strength:number){
  if(!(d<radius)||!(strength>0))return 1;
  const cover=1-T.MathUtils.smoothstep(d/radius,.55,1),loss=1-(kind===0?SLICK.oil.grip:SLICK.coolant.grip);
  return 1-loss*cover*clamp01(strength);
}
/** HUD line: what is leaking, and whether the tyres are on (or carrying) oil. */
export function fluidWarning(rates:{oil:number;coolant:number},slickGrip:ArrayLike<number>,oily:ArrayLike<number>){
  const parts:string[]=[];
  if(rates.oil>0)parts.push('OIL LEAK');if(rates.coolant>0)parts.push('COOLANT LEAK');
  if(Math.min(...Array.from(slickGrip))<.9)parts.push('ON OIL');else if(Math.max(0,...Array.from(oily))>.3)parts.push('OILY TYRES');
  return parts.join(' · ');
}
export class FluidSlicks{
  readonly capacity=256;
  readonly mesh:T.InstancedMesh;
  /** x, z, radius, kind, born, strength, seed per spot. */
  readonly spots=new Float32Array(this.capacity*7);
  private readonly data=new Float32Array(this.capacity*4);
  private cursor=0;private count=0;private time={value:0};private pose=new T.Object3D();
  constructor(scene:T.Scene){
    const geometry=new T.CircleGeometry(1,28);geometry.rotateX(-Math.PI/2);
    geometry.setAttribute('slickData',new T.InstancedBufferAttribute(this.data,4).setUsage(T.DynamicDrawUsage));
    const material=new T.MeshPhysicalMaterial({color:0xffffff,roughness:.05,metalness:0,clearcoat:1,clearcoatRoughness:.03,iridescence:1,iridescenceIOR:1.45,iridescenceThicknessRange:[180,520],
      transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-3});
    material.onBeforeCompile=s=>{
      s.uniforms.slickClock=this.time;
      s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nattribute vec4 slickData;varying vec4 vSlick;varying vec2 vSlickUv;')
        .replace('#include <begin_vertex>','#include <begin_vertex>\nvSlick=slickData;vSlickUv=position.xz;');
      s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>
uniform float slickClock;varying vec4 vSlick;varying vec2 vSlickUv;
float slickHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float slickNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(slickHash(i),slickHash(i+vec2(1,0)),f.x),mix(slickHash(i+vec2(0,1)),slickHash(i+vec2(1,1)),f.x),f.y);}`)
        .replace('#include <alphamap_fragment>',`#include <alphamap_fragment>
// A splash, not a disc: the rim wanders with the angle and small satellite drops sit near it.
float slickR=length(vSlickUv),slickA=atan(vSlickUv.y,vSlickUv.x);
float slickRim=.72+.2*slickNoise(vec2(slickA*2.2+vSlick.w*13.,vSlick.w*7.))+.08*slickNoise(vSlickUv*7.+vSlick.w*5.);
float slickBody=1.-smoothstep(slickRim-.06,slickRim,slickR);
float slickDots=step(.8,slickNoise(vSlickUv*9.+vSlick.w*17.))*(1.-smoothstep(.88,1.,slickR));
float slickStrength=clamp(vSlick.z,0.,1.);
diffuseColor.a*=max(slickBody,slickDots)*slickStrength*(vSlick.x<.5?.88:.62);
diffuseColor.rgb=vSlick.x<.5?vec3(.018,.015,.012):vec3(.025,.075,.04);`)
        .replace('#include <lights_physical_fragment>','#include <lights_physical_fragment>\n#ifdef USE_IRIDESCENCE\nmaterial.iridescence*=vSlick.x<.5?.85:.0;\n#endif');
    };
    material.customProgramCacheKey=()=>'fluid-slicks-v1';
    this.mesh=new T.InstancedMesh(geometry,material,this.capacity);this.mesh.name='fluid-slicks';this.mesh.count=0;this.mesh.frustumCulled=false;this.mesh.receiveShadow=true;this.mesh.renderOrder=1;
    this.mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);scene.add(this.mesh);
  }
  /** Add one drip at a ground point; a drip landing on a fresh spot of the same fluid grows it into a pool. */
  drip(x:number,y:number,z:number,kind:FluidKind,seed:number){
    if(![x,y,z].every(Number.isFinite))return;
    const base=kind===0?SLICK.oil.radius:SLICK.coolant.radius,s=this.spots;
    for(let i=0;i<this.count;i++){
      const o=i*7;if(s[o+3]!==kind||s[o+5]<.05)continue;
      const r=s[o+2];if(Math.hypot(s[o]-x,s[o+1]-z)>r*LEAK.merge+.1)continue;
      // Pooling: area adds up, so the radius grows by the square root.
      s[o+2]=Math.min(LEAK.maxRadius,Math.sqrt(r*r+base*base*.6));s[o+4]=this.time.value;s[o+5]=1;this.write(i,y);return;
    }
    const slot=this.cursor++%this.capacity,o=slot*7;
    s.set([x,z,base*(.8+.4*(seed%1)),kind,this.time.value,1,seed%1],o);
    this.count=Math.min(this.capacity,this.count+1);this.mesh.count=this.count;this.write(slot,y);
  }
  private write(i:number,y:number){
    const o=i*7,s=this.spots;
    this.pose.position.set(s[o],y+.014,s[o+1]);this.pose.rotation.set(0,s[o+6]*Math.PI*2,0);this.pose.scale.setScalar(s[o+2]);this.pose.updateMatrix();
    this.mesh.setMatrixAt(i,this.pose.matrix);this.mesh.instanceMatrix.needsUpdate=true;
    this.data.set([s[o+3],s[o+4],s[o+5],s[o+6]],i*4);this.mesh.geometry.attributes.slickData.needsUpdate=true;
  }
  /** Grip multiplier (≤ 1) for a tyre at (x, z): the worst spot under it wins. */
  gripAt(x:number,z:number){
    let grip=1;const s=this.spots;
    for(let i=0;i<this.count;i++){
      const o=i*7,dx=s[o]-x;if(dx>1.2||dx< -1.2)continue;const dz=s[o+1]-z;if(dz>1.2||dz< -1.2)continue;
      grip=Math.min(grip,slickGrip(s[o+3] as FluidKind,Math.hypot(dx,dz),s[o+2],s[o+5]));
    }
    return grip;
  }
  /** Spots fade: oil slowly, coolant soon evaporates. */
  advance(dt:number){
    if(!(dt>0)||!Number.isFinite(dt))return;const before=this.time.value;this.time.value+=dt;
    // Fade once per whole second crossed, so one long step (a replay seek) fades like many short ones.
    const seconds=Math.floor(this.time.value)-Math.floor(before);if(seconds<=0)return;
    const s=this.spots;let changed=false;
    for(let i=0;i<this.count;i++){const o=i*7;if(s[o+5]<=0)continue;s[o+5]=Math.max(0,s[o+5]-seconds*(s[o+3]===0?1/SLICK.oil.life:1/SLICK.coolant.life));this.data[i*4+2]=s[o+5];changed=true;}
    if(changed)this.mesh.geometry.attributes.slickData.needsUpdate=true;
  }
  dispose(){this.mesh.removeFromParent();this.mesh.geometry.dispose();(this.mesh.material as T.Material).dispose();this.mesh.dispose();}
  reset(){this.cursor=this.count=0;this.time.value=0;this.spots.fill(0);this.data.fill(0);this.mesh.count=0;this.mesh.geometry.attributes.slickData.needsUpdate=true;}
  get stats(){let oil=0,coolant=0;for(let i=0;i<this.count;i++){if(this.spots[i*7+5]<=0)continue;if(this.spots[i*7+3]===0)oil++;else coolant++;}return{count:this.count,oil,coolant};}
}
