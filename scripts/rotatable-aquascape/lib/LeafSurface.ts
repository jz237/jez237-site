import * as T from 'three';
/** Fine leaf tissue and curved venation, evaluated on the modeled blade UVs. */
export function leafSurfaceTexture(seed=2731){
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=1024;const context=canvas.getContext('2d')!;
 const pixels=context.createImageData(512,1024);let state=seed;const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
 for(let y=0;y<1024;y++)for(let x=0;x<512;x++){
  const u=x/512,v=y/1024,index=(y*512+x)*4;
  const tissue=Math.sin(x*.087+Math.sin(y*.031)*2.2)*Math.sin(y*.063+Math.sin(x*.053))*5;
  const broad=Math.sin(u*17.+Math.sin(v*14.))*Math.sin(v*22.)*6;
  const tone=180+26*Math.sin(v*Math.PI)+tissue+broad+(random()-.5)*16;
  pixels.data[index]=pixels.data[index+1]=pixels.data[index+2]=tone;pixels.data[index+3]=255;
 }
 context.putImageData(pixels,0,0);
 // Paired secondary veins curve toward the tip, with fine tertiary branching.
 for(let row=0;row<18;row++){
  const base=80+row*49+(random()-.5)*15;
  for(const sign of [-1,1]){
   context.strokeStyle='rgba(245,249,220,.28)';context.lineWidth=1.6;context.beginPath();context.moveTo(256,base);context.bezierCurveTo(256+sign*60,base-18,256+sign*157,base-95,256+sign*255,base-118);context.stroke();
   for(let j=1;j<7;j++){
    const x=256+sign*j*32,y=base-j*15;context.strokeStyle='rgba(230,238,213,.12)';context.lineWidth=.6;context.beginPath();context.moveTo(x,y);context.quadraticCurveTo(x+sign*18,y-22,x+sign*25,y-50);context.stroke();
   }
  }
 }
 context.strokeStyle='rgba(94,105,65,.4)';context.lineWidth=5;context.beginPath();context.moveTo(258,1024);context.quadraticCurveTo(256,512,256,0);context.stroke();
 context.strokeStyle='rgba(249,250,223,.62)';context.lineWidth=2;context.beginPath();context.moveTo(255,1024);context.quadraticCurveTo(254,512,256,0);context.stroke();
 const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;map.anisotropy=8;return map;
}
