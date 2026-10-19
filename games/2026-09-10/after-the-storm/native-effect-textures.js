import * as T from './vendor/three.module.js';
import {makeNativeMistTexture} from './native-ice-splash-render.js';

// Authored artwork at 16 times the original linear texture resolution.
// Source frame selection and UVs remain in the retained display consumer.
export function makeNativeEffectTextures(){
 function texture(family,frame){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=family==='wake'?1024:512;
  const ctx=canvas.getContext('2d');
  function puff(x,y,r,alpha){
   const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(245,253,255,${alpha})`);g.addColorStop(.38,`rgba(224,246,252,${alpha*.7})`);g.addColorStop(1,'rgba(224,246,252,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);
  }
  if(family==='wake'){
   // Two feathered foam trails with broken crests and a fading middle.
   for(let row=0;row<120;row++){
    const t=(row+.5)/120,fade=Math.sin(Math.PI*t)**.65,y=t*1024;
    for(const side of [-1,1]){
     const wave=Math.sin(row*.41+frame*Math.PI/2)*12,x=256+side*(40+120*t+wave);
     puff(x,y,13+(row*17%23),.65*fade);puff(x+side*(row%7),y+7,5+row%9,.7*fade);
    }
    if(row%2===0)puff(256+Math.sin(row*2.4+frame)*70,y,16+row%21,.16*fade);
   }
  }else if(family==='spray'){
   puff(256,295,112,.25);
   for(let i=0;i<90;i++){
    const a=i*2.399963229728653+frame*.21,r=175*Math.sqrt((i+.5)/90);
    puff(256+Math.cos(a)*r,270+Math.sin(a)*r*.9,5+(i*11+frame*3)%22,.3+(i%9)/16);
   }
  }else{
   puff(256,256,148,.2);puff(241,230,62,.7);puff(222,209,24,.95);
   for(let i=0;i<14;i++){const a=i*2.399963229728653;puff(256+Math.cos(a)*135,256+Math.sin(a)*135,6+i%13,.48);}
  }
  const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;map.wrapS=map.wrapT=T.ClampToEdgeWrapping;return map;
 }
 return {spray:Array.from({length:4},(_,i)=>texture('spray',i)),splash:Array.from({length:7},(_,i)=>makeNativeMistTexture(i)),wake:Array.from({length:4},(_,i)=>texture('wake',i)),droplet:[texture('droplet',0)]};
}
