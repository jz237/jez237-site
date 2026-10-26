import * as T from 'three';
import {measureTyreVisual} from './tyre-visual';

/** Tyre lettering (offline): every tyre carries its maker's name and size moulded into the outer sidewall, LETTERS.repeat
 * times round, in a band from LETTERS.band[0] to LETTERS.band[1] of the way out from rim to tread — subtle, a shade lighter
 * than the rubber, on most cars; raised white letters on the muscle car and now and then (LETTERS.white of them) another
 * classic. Each car its own make (made up). Drawn in the tyre's own shader, so it costs no draw call. */
export const LETTERS={repeat:2,band:[.3,.86],white:.25,moulded:0x8f8c86,whiteInk:0xe9e5d8,strength:[.55,.95],
  makes:['QUARRYGRIP','STONEHOLD','GRITLINE','HAULWELL','DUSTMASTER','RIDGEWAY'] as const,
  lines:['RADIAL','ALL SEASON','STEEL BELTED','M+S'] as const,sizes:['185/70 R14','195/65 R15','205/70 R14','215/60 R15'] as const} as const;
const hash=(n:number,salt:number)=>Math.abs(Math.sin(n*19.31+salt*47.13)*43758.5453)%1;
/** Car `id`'s tyres (of this kind): the text round them and whether it is raised white. */
export function letteringFor(id:number,kind:string){
  const n=Number.isFinite(id)?id:0,pick=<V>(list:readonly V[],s:number)=>list[Math.floor(hash(n,s)*list.length)%list.length];
  const classic=/^(muscle|wagon|utility)$/.test(kind),white=kind==='muscle'||classic&&hash(n,4)<LETTERS.white;
  return {text:`${pick(LETTERS.makes,1)}  ·  ${pick(LETTERS.lines,2)}  ·  ${pick(LETTERS.sizes,3)}`,white};
}
/** The strip of lettering round half the tyre (a canvas: white letters on nothing; only where there is a document). */
function strip(text:string){
  if(typeof document==='undefined')return null;const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=64;const g=canvas.getContext('2d');if(!g)return null;
  g.fillStyle='#fff';g.font='800 40px "Arial Narrow", Montserrat, "Arial Black", sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(text,512,34,980);
  const map=new T.CanvasTexture(canvas);map.anisotropy=4;return map;
}
/** Letters this car's tyres (`wheels`, their materials each the wheel's own): returns how many tyre materials. */
export function letterTyres(wheels:readonly T.Object3D[],kind:string,id:number,root:T.Object3D){
  const {text,white}=letteringFor(id,kind),map=strip(text);if(!map)return 0;let n=0;
  root.updateMatrixWorld(true);const inv=root.matrixWorld.clone().invert();
  for(const wheel of wheels){
    const {profile,meshes}=measureTyreVisual(wheel),out=Math.sign(new T.Vector3().setFromMatrixPosition(wheel.matrixWorld).applyMatrix4(inv).x)||1;
    const band=new T.Vector2(profile.rimRadius+(profile.outerRadius-profile.rimRadius)*LETTERS.band[0],profile.rimRadius+(profile.outerRadius-profile.rimRadius)*LETTERS.band[1]);
    for(const {mesh,toWheel} of meshes){
      const m=mesh.material as T.MeshStandardMaterial;if(Array.isArray(m)||!/tire|tyre/i.test(m.name)||m.userData.lettered)continue;m.userData.lettered=true;
      const uniforms={letterMap:{value:map},letterBand:{value:band},letterOut:{value:out},letterTint:{value:new T.Color(white?LETTERS.whiteInk:LETTERS.moulded)},
        letterStrength:{value:white?LETTERS.strength[1]:LETTERS.strength[0]},letterToWheel:{value:toWheel},letterNormalToWheel:{value:new T.Matrix3().getNormalMatrix(toWheel)}};
      const base=m.onBeforeCompile,key=m.customProgramCacheKey();
      m.onBeforeCompile=(s,renderer)=>{
        base.call(m,s,renderer);Object.assign(s.uniforms,uniforms);
        s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nuniform mat4 letterToWheel;uniform mat3 letterNormalToWheel;varying vec3 vLetter;varying float vLetterSide;')
          .replace('#include <begin_vertex>','#include <begin_vertex>\nvLetter=(letterToWheel*vec4(position,1.)).xyz;vLetterSide=normalize(letterNormalToWheel*objectNormal).x;');
        s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nuniform sampler2D letterMap;uniform vec2 letterBand;uniform float letterOut;uniform vec3 letterTint;uniform float letterStrength;varying vec3 vLetter;varying float vLetterSide;')
          .replace('#include <color_fragment>',`#include <color_fragment>
{float lr=length(vLetter.yz),lv=(lr-letterBand.x)/(letterBand.y-letterBand.x);
 if(lv>0.&&lv<1.&&vLetter.x*letterOut>0.&&vLetterSide*letterOut>.6){float lu=fract(-atan(vLetter.z,vLetter.y)/6.2831853*${LETTERS.repeat.toFixed(1)}*letterOut);
  diffuseColor.rgb=mix(diffuseColor.rgb,letterTint,texture2D(letterMap,vec2(lu,lv)).a*letterStrength);}}`);
      };
      m.customProgramCacheKey=()=>key+'-lettered-v1';m.needsUpdate=true;n++;
    }
  }
  return n;
}
