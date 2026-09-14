import * as T from 'three';
/** Softboxes supply shaped reflections, instead of an evenly bright room. */
export function canisterStudio(){
 const scene=new T.Scene();scene.background=new T.Color(.012,.017,.015);
 const panels:[number,number,number,number,number,number,number,number][]=[
  [-4,3,4,1.4,7,7.5,7.7,7.4],
  [4,4,2,.65,8,9,10,11],
  [0,8,0,5,2.5,5,5.2,5.1],
  [-3,3,-4,2,5,3.2,2.1,1.15],
  [0,2,7,4,5,1.0,1.15,1.1]
 ];
 for(const [x,y,z,w,h,r,g,b] of panels){const panel=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:new T.Color(r,g,b),side:T.DoubleSide,toneMapped:false}));panel.position.set(x,y,z);panel.lookAt(0,2.7,0);scene.add(panel);}
 return {scene,dispose(){scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();(o.material as T.Material).dispose();}});}};
}
/** Grain and micropores are shared by the media stack and magnified specimen. */
export function ceramicSurface(){
 const size=1024,color=document.createElement('canvas'),height=document.createElement('canvas');color.width=color.height=height.width=height.height=size;
 const c=color.getContext('2d')!,h=height.getContext('2d')!;let seed=7249;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 c.fillStyle='#e7ddc6';c.fillRect(0,0,size,size);h.fillStyle='#b8b8b8';h.fillRect(0,0,size,size);
 for(let i=0;i<70000;i++){const x=random()*size,y=random()*size,v=Math.floor(135+random()*110),r=.25+random()*1.1;c.fillStyle=`rgba(${v},${v-7},${v-18},.34)`;c.fillRect(x,y,r,r);h.fillStyle=`rgb(${v},${v},${v})`;h.fillRect(x,y,r,r);}
 for(let i=0;i<2200;i++){const x=random()*size,y=random()*size,r=1+random()*4.8;for(const [ctx,shade] of [[c,'rgba(138,122,95,.38)'],[h,'#262626']] as const){const gradient=ctx.createRadialGradient(x,y,0,x,y,r);gradient.addColorStop(0,shade);gradient.addColorStop(.4,shade);gradient.addColorStop(1,'transparent');ctx.fillStyle=gradient;ctx.fillRect(x-r,y-r,r*2,r*2);}}
 const map=new T.CanvasTexture(color),bumpMap=new T.CanvasTexture(height);map.colorSpace=T.SRGBColorSpace;for(const t of [map,bumpMap]){t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;}return {map,bumpMap};
}

/** Fine mottled stone anchors the cutaway without another reflection capture. */
export function canisterFloor(){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
 const ctx=canvas.getContext('2d')!,pixels=ctx.createImageData(512,512);let seed=928;
 for(let y=0;y<512;y++)for(let x=0;x<512;x++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const noise=seed/4294967296,v=78+noise*35+2*Math.sin(x*.045+Math.sin(y*.028)*3),i=(y*512+x)*4;pixels.data[i]=v*.78;pixels.data[i+1]=v;pixels.data[i+2]=v*.89;pixels.data[i+3]=255;}
 ctx.putImageData(pixels,0,0);const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;map.wrapS=map.wrapT=T.RepeatWrapping;map.repeat.set(50,50);map.anisotropy=8;
 return new T.MeshStandardMaterial({color:0x26392f,map,roughness:.90,metalness:0,envMapIntensity:.10,bumpMap:map,bumpScale:.0015});
}
