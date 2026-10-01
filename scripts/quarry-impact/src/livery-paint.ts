import * as T from 'three';
import {LIVERY_FACES,drawLivery,normalizeLivery,type LiveryLayer} from './livery';
/** Immutable body-space coordinates keep paint attached to denting and detached panels. */
export class LiveryPaint {
 readonly atlas={value:null as T.Texture|null};readonly finishAtlas={value:null as T.Texture|null};readonly enabled={value:0};
 readonly minimum={value:new T.Vector3()};readonly size={value:new T.Vector3(1,1,1)};
 private canvas?:HTMLCanvasElement;private finishCanvas?:HTMLCanvasElement;private signature='';private prepared=false;
 constructor(private root:T.Group){}
 private prepare(root:T.Group){
  const meshes:T.Mesh[]=[],bounds=new T.Box3();
  root.traverse(o=>{if(!(o instanceof T.Mesh)||!o.name.startsWith('panel_')||!(o.material as T.Material).name.startsWith('paint')||(o.material as T.Material).name.includes('Paint 2'))return;const rest=o.geometry.getAttribute('wreckPosition');if(!rest)return;meshes.push(o);bounds.union(new T.Box3().setFromBufferAttribute(rest as T.BufferAttribute));});
  if(!meshes.length)return;bounds.getSize(this.size.value);this.minimum.value.copy(bounds.min);this.size.value.max(new T.Vector3(.01,.01,.01));
  const seen=new Set<T.Material>();
  for(const mesh of meshes){const g=mesh.geometry,normal=(g.getAttribute('normal') as T.BufferAttribute).clone();normal.applyNormalMatrix(new T.Matrix3().getNormalMatrix(mesh.userData.wreckToModel));g.setAttribute('liveryNormal',normal);
   const m=mesh.material as T.MeshPhysicalMaterial;if(seen.has(m))continue;seen.add(m);const base=m.onBeforeCompile,key=m.customProgramCacheKey();
   m.onBeforeCompile=(s,r)=>{base.call(m,s,r);s.uniforms.liveryAtlas=this.atlas;s.uniforms.liveryFinish=this.finishAtlas;s.uniforms.liveryEnabled=this.enabled;s.uniforms.liveryMinimum=this.minimum;s.uniforms.liverySize=this.size;
    s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nattribute vec3 liveryNormal;varying vec3 vLiveryNormal;varying vec3 vLiveryPosition;'+(s.vertexShader.includes('attribute vec3 wreckPosition;')?'':'\nattribute vec3 wreckPosition;')).replace('#include <begin_vertex>','#include <begin_vertex>\nvLiveryNormal=liveryNormal;vLiveryPosition=wreckPosition;');
    s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>
uniform sampler2D liveryAtlas;uniform sampler2D liveryFinish;uniform float liveryEnabled;uniform vec3 liveryMinimum;uniform vec3 liverySize;varying vec3 vLiveryNormal;varying vec3 vLiveryPosition;
`).replace('#include <color_fragment>',`#include <color_fragment>
float liveryRust=0.,liveryChip=0.;
if(liveryEnabled>.5){
 vec3 p=clamp((vLiveryPosition-liveryMinimum)/liverySize,0.,1.),n=normalize(vLiveryNormal),a=abs(n);vec2 uv;float face;
 if(a.x>=a.y&&a.x>=a.z){face=n.x<0.?0.:1.;uv=vec2(n.x<0.?p.z:1.-p.z,1.-p.y);}
 else if(a.y>=a.z){face=2.;uv=vec2(p.x,p.z);}
 else {face=n.z>0.?3.:4.;uv=vec2(n.z>0.?1.-p.x:p.x,1.-p.y);}
 // Half-texel inset isolates each of the five atlas tiles at their seams.
 uv=clamp(uv,vec2(.001),vec2(.999));uv=(uv+vec2(mod(face,3.),floor(face/3.)))/vec2(3.,2.);
 vec4 wear=texture2D(liveryFinish,vec2(uv.x,1.-uv.y));float outward=a.y>=a.x&&a.y>=a.z&&n.y<0.?0.:1.;liveryRust=wear.r*wear.a*outward;liveryChip=wear.g*wear.a*outward;
 vec4 ink=texture2D(liveryAtlas,vec2(uv.x,1.-uv.y));diffuseColor.rgb=mix(diffuseColor.rgb,ink.rgb,ink.a*(a.y>=a.x&&a.y>=a.z&&n.y<0.?0.:1.));
}
`).replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(roughnessFactor,.92,liveryRust);roughnessFactor=mix(roughnessFactor,.58,liveryChip);').replace('#include <metalnessmap_fragment>','#include <metalnessmap_fragment>\nmetalnessFactor=mix(metalnessFactor,.02,liveryRust);metalnessFactor=mix(metalnessFactor,.8,liveryChip);').replace('#include <lights_physical_fragment>','#include <lights_physical_fragment>\n#ifdef USE_CLEARCOAT\nmaterial.clearcoat*=1.-max(liveryRust,liveryChip);\n#endif');
   };m.customProgramCacheKey=()=>key+'-livery-atlas-v2';m.needsUpdate=true;
  }
 }
 set(input:readonly LiveryLayer[]){const layers=normalizeLivery(input),signature=JSON.stringify(layers);if(signature===this.signature)return;this.signature=signature;
  if(!layers.some(l=>!l.hidden&&l.opacity>0)){this.enabled.value=0;this.atlas.value?.dispose();this.atlas.value=null;this.canvas=undefined;this.finishAtlas.value?.dispose();this.finishAtlas.value=null;this.finishCanvas=undefined;return;}
  if(!this.prepared){this.prepare(this.root);this.prepared=true;}
  // Headless physics tests do not instantiate a renderer or browser canvas.
  if(typeof document==='undefined')return;
  if(!this.canvas){this.canvas=document.createElement('canvas');this.canvas.width=1536;this.canvas.height=1024;const t=new T.CanvasTexture(this.canvas);t.colorSpace=T.SRGBColorSpace;t.generateMipmaps=false;t.minFilter=T.LinearFilter;t.magFilter=T.LinearFilter;this.atlas.value=t;this.finishCanvas=document.createElement('canvas');this.finishCanvas.width=768;this.finishCanvas.height=512;const wear=new T.CanvasTexture(this.finishCanvas);wear.generateMipmaps=false;wear.minFilter=T.LinearFilter;wear.magFilter=T.LinearFilter;this.finishAtlas.value=wear;}
  const ctx=this.canvas.getContext('2d')!;ctx.clearRect(0,0,1536,1024);
  LIVERY_FACES.forEach((face,i)=>{ctx.save();ctx.translate(i%3*512,Math.floor(i/3)*512);ctx.beginPath();ctx.rect(0,0,512,512);ctx.clip();drawLivery(ctx,layers,face,512,512);ctx.restore();});
  const finish=this.finishCanvas!.getContext('2d')!;finish.clearRect(0,0,768,512);LIVERY_FACES.forEach((face,i)=>{finish.save();finish.translate(i%3*256,Math.floor(i/3)*256);finish.beginPath();finish.rect(0,0,256,256);finish.clip();drawLivery(finish,layers,face,256,256,true);finish.restore();});
  this.atlas.value!.needsUpdate=true;this.finishAtlas.value!.needsUpdate=true;this.enabled.value=1;
 }
 dispose(){this.finishAtlas.value?.dispose();this.finishAtlas.value=null;this.finishCanvas=undefined;this.atlas.value?.dispose();this.atlas.value=null;this.canvas=undefined;this.enabled.value=0;}
}
