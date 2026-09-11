import * as T from 'three';

export function serviceLabel(lines:string[]){
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=512;
 const c=canvas.getContext('2d')!;c.fillStyle='#c7ba98';c.fillRect(0,0,1024,512);
 c.strokeStyle='#746c58';c.lineWidth=3;c.strokeRect(22,22,980,468);
 c.textAlign='left';c.textBaseline='middle';
 lines.forEach((line,i)=>{c.fillStyle=i===0?'#3d3a30':'#595342';c.font=`${i===0?'bold ':''}${i===0?55:38}px monospace`;c.fillText(line,48,76+i*88,926);});
 for(let i=0;i<70;i++){c.fillStyle=i%2?'#e0d4b622':'#65574018';c.fillRect((i*173)%1024,(i*97)%512,2+i%9,1+i%3);}
 const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;return texture;
}

/** Clear surface reflections, with the game/print still rendered on a separate rear layer. */
export function coverGlass(){
 return new T.MeshPhysicalMaterial({name:'cover_glass',color:'#35413d',roughness:.21,metalness:0,
  transparent:true,opacity:.018,depthWrite:false,clearcoat:.12,clearcoatRoughness:.20,
  ior:1.49,specularIntensity:.08,envMapIntensity:.12,side:T.FrontSide});
}

/** Fluorescent falloff behind the print: softly bright across the center, shaded by retainers. */
export function marqueeDiffuser(material:T.MeshStandardMaterial){
 material.onBeforeCompile=shader=>{
  shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
   float endFalloff=smoothstep(0.0,.16,vEmissiveMapUv.x)*smoothstep(0.0,.16,1.0-vEmissiveMapUv.x);
   float tubeFalloff=.74+.26*exp(-pow((vEmissiveMapUv.y-.52)*2.1,2.0));
   totalEmissiveRadiance*=tubeFalloff*(.78+.22*endFalloff);
  `);
 };
 material.customProgramCacheKey=()=> 'marquee-diffuser-v1';
}
