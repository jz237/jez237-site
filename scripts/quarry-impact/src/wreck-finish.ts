import * as T from 'three';

/** One persistent burn state per car; impact chips stay in the panel buffers. */
export class WreckFinish {
  readonly soot = {value:0};
  readonly bay: {value:T.Vector3};
  constructor(root:T.Group, halfLength:number) {
    this.bay={value:new T.Vector3(0,1.0,halfLength*.55)};
    const seen=new Set<T.Material>();
    root.traverse(o=>{
      if(!(o instanceof T.Mesh)||!o.name.startsWith('panel_'))return;
      const m=o.material as T.MeshPhysicalMaterial;
      if(seen.has(m))return;seen.add(m);
      const painted=m.name.startsWith('paint'),lamp=/Headlight|Brakelight/.test(m.name);
      const base=m.onBeforeCompile,key=m.customProgramCacheKey();
      m.onBeforeCompile=(s,renderer)=>{
        base.call(m,s,renderer);
        s.uniforms.wreckSoot=this.soot;s.uniforms.wreckBay=this.bay;
        s.vertexShader=s.vertexShader
          .replace('#include <common>','#include <common>\nattribute vec3 wreckPosition; varying vec3 vWreckRest; varying vec2 vWreckWear;'+(s.vertexShader.includes('attribute vec2 impactWear;')?'':'\nattribute vec2 impactWear;'))
          .replace('#include <begin_vertex>','#include <begin_vertex>\nvWreckRest=wreckPosition;vWreckWear=impactWear;');
        s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>
uniform float wreckSoot;uniform vec3 wreckBay;varying vec3 vWreckRest;varying vec2 vWreckWear;
float wreckHash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,73.3)))*43758.5453);}
float wreckNoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(mix(wreckHash(i),wreckHash(i+vec3(1,0,0)),f.x),mix(wreckHash(i+vec3(0,1,0)),wreckHash(i+vec3(1,1,0)),f.x),f.y),mix(mix(wreckHash(i+vec3(0,0,1)),wreckHash(i+vec3(1,0,1)),f.x),mix(wreckHash(i+vec3(0,1,1)),wreckHash(i+vec3(1,1,1)),f.x),f.y),f.z);}
`)
          .replace('#include <alphamap_fragment>',`#include <alphamap_fragment>
float wreckChip=0.,wreckChar=0.;
float wreckDamage=clamp(vWreckWear.x,0.,1.);
if(wreckDamage>.015||wreckSoot>.001){
 float broken=wreckNoise(vWreckRest*28.)*.65+wreckNoise(vWreckRest*73.)*.35;
 float chipMask=smoothstep(.3,.95,wreckDamage);
 wreckChip=chipMask*smoothstep(.68,.86,broken+vWreckWear.y*.035);
 ${painted?`float primer=chipMask*smoothstep(.60,.81,broken);
 diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.115,.123,.125),primer*.85);
 diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.31,.33,.35),wreckChip);`:''}
 vec3 heatDistance=(vWreckRest-wreckBay)*vec3(1.05,.68,.9);
 float scorch=wreckSoot*(1.-smoothstep(.3,1.8,length(heatDistance)))*step(.0001,dot(vWreckRest,vWreckRest));
 wreckChar=smoothstep(.025,.56,scorch)*(.72+broken*.28);
 diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.09,.038,.017),scorch*(1.-wreckChar)*.8);
 diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.014,.012,.011),wreckChar);
 ${lamp?`float shattered=smoothstep(.22,.82,wreckDamage);
 if(shattered>.72&&broken>.64)discard;
 diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.04,.046,.05),shattered*.85);`:''}
}
`)
          .replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
roughnessFactor=mix(roughnessFactor,.57,wreckChip);roughnessFactor=mix(roughnessFactor,.96,wreckChar);`)
          .replace('#include <metalnessmap_fragment>',`#include <metalnessmap_fragment>
${painted?'metalnessFactor=mix(metalnessFactor,.82,wreckChip);':''}
metalnessFactor*=1.-wreckChar*.97;`)
          .replace('#include <lights_physical_fragment>',`#include <lights_physical_fragment>
#ifdef USE_CLEARCOAT
material.clearcoat*=1.-max(wreckChip,wreckChar);
#endif`);
        if(lamp)s.fragmentShader=s.fragmentShader.replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\ntotalEmissiveRadiance*=1.-smoothstep(.12,.7,wreckDamage);');
      };
      m.customProgramCacheKey=()=>key+'-wreck-scars-v1-'+Number(painted)+'-'+Number(lamp);
      m.needsUpdate=true;
    });
  }
  advance(heat:number,dt:number){if(dt>0&&Number.isFinite(dt)&&Number.isFinite(heat))this.soot.value=Math.min(1,this.soot.value+Math.max(0,heat)*dt*.13);}
  reset(){this.soot.value=0;}
}
