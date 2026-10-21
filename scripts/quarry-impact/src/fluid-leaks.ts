import * as T from 'three';
import {RADIATOR} from './damage-handling';
/** Fluid leaks (offline events only): a crushed radiator drips coolant, a badly damaged engine drips oil
 * and a crushed fuel tank drips fuel. Drips leave spots on the ground that pool while the car sits still,
 * fade with time and cost grip under any tyre that rolls over them: oil a lot, fuel and coolant a little.
 * Fuel catches from sparks; fuel and oil catch from a burning car; fire runs along touching puddles. */
const clamp01=(v:number)=>Math.max(0,Math.min(1,Number.isFinite(v)?v:0));
export const LEAK={oilOnset:.5,slowest:1.6,fastest:.3,merge:.8,maxRadius:1.1} as const;
export type FluidKind=0|1|2; // 0 oil, 1 coolant, 2 fuel
export const SLICK={oil:{grip:.5,life:300,radius:.2},coolant:{grip:.82,life:45,radius:.16},fuel:{grip:.85,life:50,radius:.2}} as const;
const slickKind=(kind:number)=>kind===0?SLICK.oil:kind===1?SLICK.coolant:SLICK.fuel;
/** The fuel tank leaks once its end of the car is crushed past FUEL.onset. */
export const FUEL={onset:.2,span:.5,spacing:.8,sparse:1.8} as const;
/** Metres between fuel drops on the move: a badly split tank lays a touching trail, a weep leaves spaced drops. */
export const fuelSpacing=(severity:number)=>FUEL.spacing+FUEL.sparse*(1-clamp01(severity));
/** Burning: fuel flares fast and spreads quickly, oil burns longer and creeps; a scorch mark stays. */
export const BURN={fuel:{base:6,perRadius:7,spread:.3},oil:{base:14,perRadius:10,spread:1.1},reach:.45,rise:.4,fade:1.8,scorch:150} as const;
export const burnDuration=(kind:number,radius:number)=>kind===2?BURN.fuel.base+BURN.fuel.perRadius*radius:BURN.oil.base+BURN.oil.perRadius*radius;
/** Standing in flames: health lost per second at full strength, and seconds of exposure before the car catches. */
export const FLAME={damage:4,ignite:1.4,cool:.5} as const;
export type GroundFire={x:number;y:number;z:number;radius:number;start:number;end:number;kind:number;seed:number};
/** Flame strength 0..1 of a fire at time t: flares over BURN.rise, dies over the last BURN.fade seconds. */
export function burnLevel(f:Pick<GroundFire,'start'|'end'>,t:number){
  if(!(t>=f.start)||!(t<f.end))return 0;
  return Math.min(1,(t-f.start)/BURN.rise,(f.end-t)/BURN.fade);
}
/** Leak severity 0..1 from front compression (radiator), engine damage (oil) and tank-end compression (fuel). */
export function leakRates(frontCompression:number,engineDamage:number,tankCompression=0){
  return{coolant:clamp01((frontCompression-RADIATOR.onset)/(1-RADIATOR.onset)),oil:clamp01((engineDamage-LEAK.oilOnset)/(1-LEAK.oilOnset)),fuel:clamp01((tankCompression-FUEL.onset)/FUEL.span)};
}
/** Seconds between drips at this severity (0 = no leak). */
export function dripInterval(severity:number){const s=clamp01(severity);return s>0?LEAK.slowest-(LEAK.slowest-LEAK.fastest)*s:Infinity;}
/** Grip multiplier for a tyre at distance d from a spot of this kind, radius and remaining strength. */
export function slickGrip(kind:FluidKind,d:number,radius:number,strength:number){
  if(!(d<radius)||!(strength>0))return 1;
  const cover=1-T.MathUtils.smoothstep(d/radius,.55,1),loss=1-slickKind(kind).grip;
  return 1-loss*cover*clamp01(strength);
}
/** HUD line: what is leaking, and whether the tyres are on (or carrying) oil. */
export function fluidWarning(rates:{oil:number;coolant:number;fuel?:number},slickGrip:ArrayLike<number>,oily:ArrayLike<number>,flames=0){
  const parts:string[]=[];
  if(flames>0)parts.push('IN FLAMES');
  if((rates.fuel??0)>0)parts.push('FUEL LEAK');if(rates.oil>0)parts.push('OIL LEAK');if(rates.coolant>0)parts.push('COOLANT LEAK');
  if(Math.min(...Array.from(slickGrip))<.9)parts.push('ON OIL');else if(Math.max(0,...Array.from(oily))>.3)parts.push('OILY TYRES');
  return parts.join(' · ');
}
/** Spot layout: x, z, radius, kind, born, strength, seed, ignited (-1 = never), burnEnd, ground y, owner (car that lit it, -1). */
const S=11;
export class FluidSlicks{
  readonly capacity=384;
  readonly mesh:T.InstancedMesh;
  readonly spots=new Float32Array(this.capacity*S);
  /** Fire runs from a burning spot to touching ones. Replays turn this off and apply the recorded ignitions. */
  spread=true;
  /** Called for every ignition (centre of the spot), for replay recording and sound. */
  onIgnite?:(x:number,y:number,z:number,kind:FluidKind,owner:number)=>void;
  private readonly data=new Float32Array(this.capacity*4);
  private readonly fire=new Float32Array(this.capacity*2);
  private cursor=0;private count=0;private time={value:0};private pose=new T.Object3D();private burning=0;
  /** Burning spots that have already passed their fire on to the puddles touching them. */
  private readonly spreadDone=new Uint8Array(this.capacity);
  constructor(scene:T.Scene){
    for(let i=0;i<this.capacity;i++){this.spots[i*S+7]=-1;this.spots[i*S+10]=-1;this.fire[i*2]=-1;}
    const geometry=new T.CircleGeometry(1,28);geometry.rotateX(-Math.PI/2);
    geometry.setAttribute('slickData',new T.InstancedBufferAttribute(this.data,4).setUsage(T.DynamicDrawUsage));
    geometry.setAttribute('slickFire',new T.InstancedBufferAttribute(this.fire,2).setUsage(T.DynamicDrawUsage));
    const material=new T.MeshPhysicalMaterial({color:0xffffff,roughness:.05,metalness:0,clearcoat:1,clearcoatRoughness:.03,iridescence:1,iridescenceIOR:1.45,iridescenceThicknessRange:[180,520],
      transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-3});
    material.onBeforeCompile=s=>{
      s.uniforms.slickClock=this.time;
      s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nattribute vec4 slickData;attribute vec2 slickFire;varying vec4 vSlick;varying vec2 vSlickFire;varying vec2 vSlickUv;')
        .replace('#include <begin_vertex>','#include <begin_vertex>\nvSlick=slickData;vSlickFire=slickFire;vSlickUv=position.xz;');
      s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>
uniform float slickClock;varying vec4 vSlick;varying vec2 vSlickFire;varying vec2 vSlickUv;
float slickHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float slickNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(slickHash(i),slickHash(i+vec2(1,0)),f.x),mix(slickHash(i+vec2(0,1)),slickHash(i+vec2(1,1)),f.x),f.y);}`)
        .replace('#include <alphamap_fragment>',`#include <alphamap_fragment>
// A splash, not a disc: the rim wanders with the angle and small satellite drops sit near it.
float slickR=length(vSlickUv),slickA=atan(vSlickUv.y,vSlickUv.x);
float slickRim=.72+.2*slickNoise(vec2(slickA*2.2+vSlick.w*13.,vSlick.w*7.))+.08*slickNoise(vSlickUv*7.+vSlick.w*5.);
float slickBody=1.-smoothstep(slickRim-.06,slickRim,slickR);
float slickDots=step(.8,slickNoise(vSlickUv*9.+vSlick.w*17.))*(1.-smoothstep(.88,1.,slickR));
float slickStrength=clamp(vSlick.z,0.,1.);
// Burning (from the clock, so replays and live play match): a flickering glow, then a sooty scorch mark.
float slickLit=vSlickFire.x>=0.&&slickClock>=vSlickFire.x?1.:0.;
float slickBurn=slickLit*clamp(min((slickClock-vSlickFire.x)/.4,(vSlickFire.y-slickClock)/1.8),0.,1.);
float slickChar=slickLit*clamp((slickClock-vSlickFire.x)/max(.1,vSlickFire.y-vSlickFire.x),0.,1.)*(1.-clamp((slickClock-vSlickFire.y-${BURN.scorch.toFixed(1)})/30.,0.,1.));
float slickScorch=1.-smoothstep(slickRim+.02,slickRim+.16+.1*slickNoise(vSlickUv*5.),slickR);
float slickFluid=max(slickBody,slickDots)*slickStrength*(vSlick.x<.5?.88:vSlick.x<1.5?.62:.5)*(1.-slickChar);
diffuseColor.a*=max(slickFluid,slickChar*slickScorch*(.72+.2*slickNoise(vSlickUv*11.)));
diffuseColor.rgb=mix(vSlick.x<.5?vec3(.018,.015,.012):vSlick.x<1.5?vec3(.025,.075,.04):vec3(.06,.05,.035),vec3(.022,.018,.015),slickChar);`)
        .replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(roughnessFactor,.93,slickChar);')
        .replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\ntotalEmissiveRadiance+=vec3(1.,.36,.07)*slickBurn*slickBody*(2.4+.9*sin(slickClock*23.+vSlick.w*40.)+.6*slickNoise(vSlickUv*6.+slickClock*3.));')
        .replace('#include <lights_physical_fragment>','#include <lights_physical_fragment>\n#ifdef USE_IRIDESCENCE\nmaterial.iridescence*=(vSlick.x<.5?.85:vSlick.x<1.5?0.:1.)*(1.-slickChar);\n#endif\n#ifdef USE_CLEARCOAT\nmaterial.clearcoat*=1.-slickChar;\n#endif');
    };
    material.customProgramCacheKey=()=>'fluid-slicks-v2';
    this.mesh=new T.InstancedMesh(geometry,material,this.capacity);this.mesh.name='fluid-slicks';this.mesh.count=0;this.mesh.frustumCulled=false;this.mesh.receiveShadow=true;this.mesh.renderOrder=1;
    this.mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);scene.add(this.mesh);
  }
  get clock(){return this.time.value;}
  private lit(i:number){return this.spots[i*S+7]>=0;}
  /** A slot can be reused once its fluid has faded and any scorch mark has gone. */
  private spent(i:number){const o=i*S;return this.spots[o+5]<=0&&(this.spots[o+7]<0||this.time.value>this.spots[o+8]+BURN.scorch+30);}
  /** Add one drip at a ground point; a drip landing on a fresh spot of the same fluid grows it into a pool. */
  drip(x:number,y:number,z:number,kind:FluidKind,seed:number){
    if(![x,y,z].every(Number.isFinite))return;
    const base=slickKind(kind).radius,s=this.spots;
    for(let i=0;i<this.count;i++){
      const o=i*S;if(s[o+3]!==kind||s[o+5]<.05||this.lit(i))continue;
      const r=s[o+2];if(Math.hypot(s[o]-x,s[o+1]-z)>r*LEAK.merge+.1)continue;
      // Pooling: area adds up, so the radius grows by the square root.
      s[o+2]=Math.min(LEAK.maxRadius,Math.sqrt(r*r+base*base*.6));s[o+4]=this.time.value;s[o+5]=1;this.write(i);return;
    }
    // Once full, reuse a spent spot before overwriting the oldest one still showing.
    let slot=-1;if(this.count===this.capacity)for(let i=0;i<this.capacity;i++)if(this.spent(i)){slot=i;break;}
    if(slot<0)slot=this.cursor++%this.capacity;const o=slot*S;
    if(this.lit(slot)&&this.time.value<s[o+8])this.burning=Math.max(0,this.burning-1);
    s.set([x,z,base*(.8+.4*(seed%1)),kind,this.time.value,1,seed%1,-1,0,y,-1],o);this.spreadDone[slot]=0;
    this.count=Math.min(this.capacity,this.count+1);this.mesh.count=this.count;this.write(slot);
    // Fuel or oil landing on a fire flares straight away.
    if(this.spread&&kind!==1&&this.burning)for(let i=0;i<this.count;i++){
      const q=i*S;if(i===slot||s[q+7]<0||this.time.value>=s[q+8])continue;
      if(Math.hypot(s[q]-x,s[q+1]-z)<=s[q+2]+s[o+2]+BURN.reach){this.ignite(slot,s[q+10]);break;}
    }
  }
  private write(i:number){
    const o=i*S,s=this.spots;
    this.pose.position.set(s[o],s[o+9]+.014,s[o+1]);this.pose.rotation.set(0,s[o+6]*Math.PI*2,0);this.pose.scale.setScalar(s[o+2]);this.pose.updateMatrix();
    this.mesh.setMatrixAt(i,this.pose.matrix);this.mesh.instanceMatrix.needsUpdate=true;
    this.data.set([s[o+3],s[o+4],s[o+5],s[o+6]],i*4);this.mesh.geometry.attributes.slickData.needsUpdate=true;
    this.fire[i*2]=s[o+7];this.fire[i*2+1]=s[o+8];this.mesh.geometry.attributes.slickFire.needsUpdate=true;
  }
  private ignite(i:number,owner=-1){
    const o=i*S,s=this.spots;if(this.lit(i)||s[o+3]===1||s[o+5]<.05)return false;
    s[o+7]=this.time.value;s[o+8]=this.time.value+burnDuration(s[o+3],s[o+2]);s[o+10]=owner;this.burning++;this.write(i);
    this.onIgnite?.(s[o],s[o+9],s[o+1],s[o+3] as FluidKind,owner);return true;
  }
  /** Light the flammable spots touching (x, z) within reach. Sparks light fuel only; flames light fuel and oil.
   * The owner (the car whose sparks or flames did it) is passed on to the puddles the fire spreads to. */
  igniteAt(x:number,z:number,reach:number,fuelOnly:boolean,owner=-1){
    let lit=0;const s=this.spots;
    for(let i=0;i<this.count;i++){
      const o=i*S,kind=s[o+3];if(kind===1||(fuelOnly&&kind!==2)||this.lit(i)||s[o+5]<.05)continue;
      if(Math.hypot(s[o]-x,s[o+1]-z)<=s[o+2]+reach&&this.ignite(i,owner))lit++;
    }
    return lit;
  }
  /** Burning spots now (for flames, lights and sound). */
  fires(){
    const out:GroundFire[]=[],s=this.spots,t=this.time.value;if(!this.burning)return out;
    for(let i=0;i<this.count;i++){const o=i*S;if(s[o+7]>=0&&t<s[o+8])out.push({x:s[o],y:s[o+9],z:s[o+1],radius:s[o+2],start:s[o+7],end:s[o+8],kind:s[o+3],seed:s[o+6]});}
    return out;
  }
  /** Flame strength 0..1 at (x, z): how hard the fire under a tyre or a car is burning. */
  heatAt(x:number,z:number){
    let heat=0;const s=this.spots,t=this.time.value;if(!this.burning)return 0;
    for(let i=0;i<this.count;i++){
      const o=i*S;if(s[o+7]<0||t>=s[o+8])continue;
      if(Math.hypot(s[o]-x,s[o+1]-z)<=s[o+2]*1.1)heat=Math.max(heat,burnLevel({start:s[o+7],end:s[o+8]},t));
    }
    return heat;
  }
  /** The car whose fire is burning hardest at (x, z), or -1. */
  ownerAt(x:number,z:number){
    let best=0,owner=-1;const s=this.spots,t=this.time.value;if(!this.burning)return -1;
    for(let i=0;i<this.count;i++){
      const o=i*S;if(s[o+7]<0||t>=s[o+8]||Math.hypot(s[o]-x,s[o+1]-z)>s[o+2]*1.1)continue;
      const level=burnLevel({start:s[o+7],end:s[o+8]},t);if(level>best){best=level;owner=s[o+10];}
    }
    return owner;
  }
  /** Grip multiplier (≤ 1) for a tyre at (x, z): the worst spot under it wins. */
  gripAt(x:number,z:number){
    let grip=1;const s=this.spots;
    for(let i=0;i<this.count;i++){
      const o=i*S,dx=s[o]-x;if(dx>1.2||dx< -1.2)continue;const dz=s[o+1]-z;if(dz>1.2||dz< -1.2)continue;
      grip=Math.min(grip,slickGrip(s[o+3] as FluidKind,Math.hypot(dx,dz),s[o+2],s[o+5]));
    }
    return grip;
  }
  /** Spots fade (oil slowly, fuel and coolant soon), fire spreads to touching puddles, burnt spots dry out. */
  advance(dt:number){
    if(!(dt>0)||!Number.isFinite(dt))return;const before=this.time.value;this.time.value+=dt;const t=this.time.value,s=this.spots;
    if(this.burning){

      for(let i=0;i<this.count;i++){
        const o=i*S;if(s[o+7]<0)continue;
        if(t>=s[o+8]){if(s[o+5]>0){s[o+5]=0;this.data[i*4+2]=0;this.mesh.geometry.attributes.slickData.needsUpdate=true;}continue;}
        if(!this.spread||this.spreadDone[i]||t-s[o+7]<(s[o+3]===2?BURN.fuel.spread:BURN.oil.spread))continue;
        this.spreadDone[i]=1;
        for(let j=0;j<this.count;j++){
          if(j===i||this.lit(j))continue;const q=j*S;if(s[q+3]===1||s[q+5]<.05)continue;
          if(Math.hypot(s[o]-s[q],s[o+1]-s[q+1])<=s[o+2]+s[q+2]+BURN.reach)this.ignite(j,s[o+10]);
        }
      }
      let burning=0;for(let i=0;i<this.count;i++){const o=i*S;if(s[o+7]>=0&&t<s[o+8])burning++;}this.burning=burning;
    }
    // Fade once per whole second crossed, so one long step (a replay seek) fades like many short ones.
    const seconds=Math.floor(t)-Math.floor(before);if(seconds<=0)return;
    let changed=false;
    for(let i=0;i<this.count;i++){const o=i*S;if(s[o+5]<=0||this.lit(i))continue;s[o+5]=Math.max(0,s[o+5]-seconds/slickKind(s[o+3]).life);this.data[i*4+2]=s[o+5];changed=true;}
    if(changed)this.mesh.geometry.attributes.slickData.needsUpdate=true;
  }
  dispose(){this.mesh.removeFromParent();this.mesh.geometry.dispose();(this.mesh.material as T.Material).dispose();this.mesh.dispose();}
  reset(){
    this.cursor=this.count=this.burning=0;this.time.value=0;this.spots.fill(0);this.data.fill(0);this.spreadDone.fill(0);
    for(let i=0;i<this.capacity;i++){this.spots[i*S+7]=-1;this.spots[i*S+10]=-1;this.fire[i*2]=-1;this.fire[i*2+1]=0;}
    this.mesh.count=0;this.mesh.geometry.attributes.slickData.needsUpdate=true;this.mesh.geometry.attributes.slickFire.needsUpdate=true;
  }
  get stats(){
    let oil=0,coolant=0,fuel=0,burning=0,burnt=0;const t=this.time.value;
    for(let i=0;i<this.count;i++){const o=i*S;if(this.spots[o+7]>=0){if(t<this.spots[o+8])burning++;else burnt++;continue;}if(this.spots[o+5]<=0)continue;const k=this.spots[o+3];if(k===0)oil++;else if(k===1)coolant++;else fuel++;}
    return{count:this.count,oil,coolant,fuel,burning,burnt};
  }
}
