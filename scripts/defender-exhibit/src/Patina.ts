import * as T from 'three';

/** Localized contact wear. Transparent pixels leave the underlying printed art intact. */
export function cabinetPatina(){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=1024;const c=canvas.getContext('2d')!;let seed=198104;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 // Dust settles at the base and collects at seams; rubbed chips are clustered, not uniform noise.
 for(const [x,y,r] of [[75,900,130],[940,930,155],[100,80,90],[950,120,75],[360,990,140]]){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'#92794d35');g.addColorStop(1,'#92794d00');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
 for(let i=0;i<850;i++){const edge=random()<.65;const x=edge?(random()<.5?random()*34:990+random()*34):random()*1024,y=edge?random()*1024:820+random()*204;const w=.5+random()*5,h=.4+random()*2;c.fillStyle=i%3?'#b09a6f65':'#14181580';c.beginPath();c.moveTo(x,y);c.lineTo(x+w,y-h);c.lineTo(x+w*.8,y+h);c.lineTo(x-.5,y+h*.4);c.fill();}
 for(let i=0;i<95;i++){const x=random()*1024,y=random()*1024;c.strokeStyle=i%4?'#c6baa52a':'#0c100f40';c.lineWidth=.35+random()*.55;c.beginPath();c.moveTo(x,y);c.lineTo(x+random()*12-6,y+4+random()*40);c.stroke();}
 const t=new T.CanvasTexture(canvas);t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;return t;
}
export function panelContactRoughness(){
 const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=640;const c=canvas.getContext('2d')!;c.fillStyle='#ededed';c.fillRect(0,0,1536,640);
 const px=(x:number)=>(x+.645)/1.29*1536,py=(z:number)=>(z-.3585)/.505*640;
 for(const [x,z] of [[-.48,.57],[-.36,.73],[.32,.49],[.46,.49],[.24,.65],[0,.80]]){const X=px(x),Y=py(z);const g=c.createRadialGradient(X,Y,25,X,Y,112);g.addColorStop(0,'#929292');g.addColorStop(.48,'#c9c9c9');g.addColorStop(1,'#ededed');c.fillStyle=g;c.fillRect(X-112,Y-112,224,224);}
 // Partial overlapping fingerprint ridges, visible only in a grazing highlight.
 for(const [x,y,angle] of [[380,475,-.4],[1130,320,.25],[1370,280,-.2]]){c.save();c.translate(x,y);c.rotate(angle);c.strokeStyle='#a6a6a621';c.lineWidth=1;for(let i=0;i<13;i++){c.beginPath();c.ellipse(0,0,8+i*2,13+i*3,0,.25,4.9);c.stroke();}c.restore();}
 const t=new T.CanvasTexture(canvas);t.anisotropy=8;return t;
}
export function applyPatina(material:T.MeshStandardMaterial,texture:T.Texture,strength=.65){
 material.onBeforeCompile=shader=>{shader.uniforms.surfacePatina={value:texture};shader.uniforms.patinaAmount={value:strength};shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nuniform sampler2D surfacePatina;uniform float patinaAmount;');shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\nvec4 wear=texture2D(surfacePatina,vMapUv);diffuseColor.rgb=mix(diffuseColor.rgb,wear.rgb,wear.a*patinaAmount);');};
 material.customProgramCacheKey=()=> 'cabinet-local-patina-v1';
}
