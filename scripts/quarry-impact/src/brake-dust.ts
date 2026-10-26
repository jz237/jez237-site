import * as T from 'three';

/** Brake dust (offline): braking wears the pads to a fine black-brown dust that coats the wheels — the rims darken and
 * dull as a car brakes (BRAKE_DUST.rate of the way to BRAKE_DUST.max a second per m/s at full pedal), and only a downpour
 * slowly rinses it (BRAKE_DUST.rinse of it a second). Every old banger starts with some (BRAKE_DUST.start, its own). The
 * tyres are left out (they carry the body's dirt already); so are hubcaps and the shared fitted ones. */
export const BRAKE_DUST={rate:.004,max:.6,rinse:.01,start:[.08,.25],tint:'.07,.06,.05',mix:1.5} as const;
export const startingBrakeDust=(id:number)=>{const n=Number.isFinite(id)?id:0,r=Math.abs(Math.sin(n*91.73+2.19)*43758.5453)%1;return BRAKE_DUST.start[0]+r*(BRAKE_DUST.start[1]-BRAKE_DUST.start[0]);};
/** The dust after dt seconds braking at this pedal (0–1) and speed (m/s), in this hard a rain (0–1). */
export function brakeDustStep(level:number,dt:number,brake:number,speed:number,rain:number){
  const t=Number.isFinite(dt)?Math.max(0,Math.min(1,dt)):0,b=Number.isFinite(brake)?Math.max(0,Math.min(1,brake)):0,v=Number.isFinite(speed)?Math.abs(speed):0,r=Number.isFinite(rain)?Math.max(0,Math.min(1,rain)):0;
  let l=Number.isFinite(level)?Math.max(0,Math.min(BRAKE_DUST.max,level)):0;
  l+=(BRAKE_DUST.max-l)*(1-Math.exp(-BRAKE_DUST.rate*b*v*t));l*=Math.exp(-BRAKE_DUST.rinse*r*t);return l;
}
const RIM_SKIP=/tire|tyre|blocker|disc|brake|hose|brushed chrome|hub ?cap|wheel trim|centre ?cap|domed ?cap/i;
/** Gives a car's rims their own copies of their materials (shader work kept) that darken with `dust`. Returns how many. */
export function dirtyRims(wheels:readonly (T.Object3D|undefined)[],dust:{value:number}){
  const copies=new Map<T.Material,T.Material>();
  for(const w of wheels)w?.traverse(o=>{
    if(!(o instanceof T.Mesh)||Array.isArray(o.material))return;const old=o.material as T.MeshStandardMaterial;
    if(RIM_SKIP.test(`${old.name} ${o.name}`)||o.name==='hubcap_fitted')return;
    let m=copies.get(old) as T.MeshStandardMaterial|undefined;
    if(!m){m=old.clone();const base=old.onBeforeCompile,key=old.customProgramCacheKey();
      m.onBeforeCompile=(s,renderer)=>{base.call(m,s,renderer);s.uniforms.rimDust=dust;
        s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vRimPos;').replace('#include <begin_vertex>','#include <begin_vertex>\nvRimPos=position;');
        s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vRimPos;uniform float rimDust;')
          .replace('#include <color_fragment>',`#include <color_fragment>
// Brake dust: the pads' black-brown dust caked over the wheel, mottled.
float rimSpeck=fract(sin(dot(floor(vRimPos*40.),vec3(12.9898,78.233,37.719)))*43758.5453);
diffuseColor.rgb=mix(diffuseColor.rgb,vec3(${BRAKE_DUST.tint}),clamp(rimDust*${BRAKE_DUST.mix}*(.7+.3*rimSpeck),0.,1.));`)
          // Duller, but still metal: the dark grime dulls and darkens what it reflects.
          .replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(roughnessFactor,.6,rimDust*.5);')
          .replace('#include <lights_physical_fragment>','#include <lights_physical_fragment>\n#ifdef USE_CLEARCOAT\nmaterial.clearcoat*=1.-rimDust;\n#endif')
          .replace('#include <lights_fragment_end>','#include <lights_fragment_end>\nreflectedLight.indirectSpecular*=1.-rimDust*.8;reflectedLight.directSpecular*=1.-rimDust*.6;');};
      m.customProgramCacheKey=()=>key+'-brake-dust-v4';copies.set(old,m);}
    o.material=m;
  });
  return copies.size;
}
