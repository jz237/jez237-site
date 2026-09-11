import * as T from 'three';
export type LeafSurfaceKind='fine'|'round'|'sword';
/** Chlorophyll, vein relief and cuticle roughness are separate material channels. */
export function leafSurfaceMaps(kind:LeafSurfaceKind,seed=2731){
 const make=()=>{const canvas=document.createElement('canvas');canvas.width=512;canvas.height=1024;return canvas;};
 const color=make(),relief=make(),cuticle=make(),contexts=[color,relief,cuticle].map(c=>c.getContext('2d')!);
 const pixels=contexts.map(c=>c.createImageData(512,1024));
 let state=seed;const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
 for(let y=0;y<1024;y++)for(let x=0;x<512;x++){
  const u=x/512,v=y/1024,index=(y*512+x)*4,edge=Math.abs(u*2-1);
  const tissue=Math.sin(x*.087+Math.sin(y*.031)*2.2)*Math.sin(y*.063+Math.sin(x*.053));
  const broad=Math.sin(u*17+Math.sin(v*14))*Math.sin(v*22);
  const cells=Math.sin(u*39+Math.sin(v*24)*1.8)*Math.sin(v*67+Math.sin(u*21));
  const grain=(random()-.5),tone=210+14*Math.sin(v*Math.PI)-edge*edge*8+tissue*2+broad*3+cells*2+grain*5;
  const values=[tone,128+tissue*3+cells*4+grain*3,215+broad*15+cells*8+tissue*5+grain*4];
  for(let channel=0;channel<3;channel++){
   const data=pixels[channel].data;data[index]=data[index+1]=data[index+2]=values[channel];
   if(channel===0){data[index]+=broad*2;data[index+1]+=2;data[index+2]-=3+edge*3;}
   data[index+3]=255;
  }
 }
 contexts.forEach((context,i)=>context.putImageData(pixels[i],0,0));
 const vein=(path:(context:CanvasRenderingContext2D)=>void,width:number,major=false)=>{
  contexts.forEach((context,i)=>{
   context.strokeStyle=i===0?`rgba(239,249,211,${major?.55:.22})`:i===1?`rgba(230,230,230,${major?.78:.42})`:`rgba(172,172,172,${major?.50:.26})`;
   context.lineWidth=width*(i===1?1.3:1);context.beginPath();path(context);context.stroke();
  });
 };
 if(kind==='sword'){
  // Longitudinal ribs follow the blade outline through its normalized UV width.
  for(const x of [82,165,256,347,430])vein(c=>{c.moveTo(x,1010);c.bezierCurveTo(x-8,730,x+9,290,x,8);},x===256?6.2:2.6,true);
  for(let row=0;row<28;row++){
   const y=35+row*35;
   vein(c=>{c.moveTo(6,y+18);c.quadraticCurveTo(256,y-12,506,y+18);},.65);
  }
 }else{
  const count=kind==='round'?8:13;
  for(let row=0;row<count;row++)for(const sign of [-1,1]){
   const base=80+row*(870/count)+(random()-.5)*18,reach=kind==='round'?145:105;
   vein(c=>{c.moveTo(256,base);c.bezierCurveTo(256+sign*65,base-12,256+sign*177,base-reach,256+sign*250,base-reach-10);},kind==='round'?3.2:2.4,true);
   for(let j=1;j<6;j++){
    const x=256+sign*j*36,y=base-j*reach/6;
    vein(c=>{c.moveTo(x,y);c.quadraticCurveTo(x+sign*20,y-22,x+sign*28,y-46);},.65);
   }
  }
  vein(c=>{c.moveTo(256,1024);c.quadraticCurveTo(252,530,256,0);},6.2,true);
 }
 const texture=(canvas:HTMLCanvasElement,srgb=false)=>{const map=new T.CanvasTexture(canvas);if(srgb)map.colorSpace=T.SRGBColorSpace;map.anisotropy=8;return map;};
 return {color:texture(color,true),bump:texture(relief),roughness:texture(cuticle)};
}
