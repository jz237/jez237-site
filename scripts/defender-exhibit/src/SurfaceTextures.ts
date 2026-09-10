import * as T from 'three';

/** Surface aging only: no fictional traces, legends or components. */
export function surfaceTextures(){
 const make=(kind:'board'|'rough'|'plastic'|'paper'|'metal'|'plywood')=>{
  const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const c=canvas.getContext('2d')!,pixels=c.createImageData(512,512);let seed=198104;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  for(let y=0;y<512;y++)for(let x=0;x<512;x++){
   const n=random(),weave=(Math.sin(x*2.3)+Math.sin(y*2.1))*2,stain=Math.sin(x*.029+Math.cos(y*.021))*Math.cos(y*.014)*10,edge=Math.min(x,y,511-x,511-y)/256;
   const v=kind==='metal'?170+Math.sin(y*2.1)*18+stain*2+n*24:kind==='plywood'?184+Math.sin(y*.42+Math.sin(x*.018)*.8)*27+stain+n*13:kind==='board'?206+weave+stain+n*22-edge*9:kind==='rough'?160+stain*3+n*47:kind==='plastic'?173+stain+n*36:224+weave+n*17;
   const i=(y*512+x)*4;pixels.data[i]=v;pixels.data[i+1]=kind==='board'?v-3:kind==='plywood'?v-24:v;pixels.data[i+2]=kind==='board'?v-13:kind==='paper'?v-7:kind==='plywood'?v-54:v;pixels.data[i+3]=255;
  }c.putImageData(pixels,0,0);
  if(kind==='rough'||kind==='metal'){for(let i=0;i<100;i++){c.strokeStyle=i%2?'#9c9c9c44':'#e1e1e166';c.lineWidth=.4;const x=random()*512,y=random()*512;c.beginPath();c.moveTo(x,y);c.lineTo(x+random()*33,y+random()*4);c.stroke();}}
  const t=new T.CanvasTexture(canvas);t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;if(kind==='board'||kind==='paper'||kind==='plywood')t.colorSpace=T.SRGBColorSpace;return t;
 };return {board:make('board'),rough:make('rough'),plastic:make('plastic'),paper:make('paper'),metal:make('metal'),plywood:make('plywood')};
}
