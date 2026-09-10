import * as T from 'three';
export function roomSurfaces(){
 const make=(kind:'wall'|'metal'|'contact')=>{const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const c=canvas.getContext('2d')!;let seed=91591;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 if(kind==='contact'){const g=c.createRadialGradient(256,256,40,256,256,250);g.addColorStop(0,'#000b');g.addColorStop(.45,'#0007');g.addColorStop(1,'#0000');c.fillStyle=g;c.fillRect(0,0,512,512);}
 else {const d=c.createImageData(512,512);for(let y=0;y<512;y++)for(let x=0;x<512;x++){const broad=Math.sin(x*.051+Math.sin(y*.037))*Math.cos(y*.031)*15;const grain=rand()*35;const v=kind==='wall'?166+broad+grain:188+Math.sin(y*2.8)*11+grain;const i=(y*512+x)*4;d.data[i]=v;d.data[i+1]=v-3;d.data[i+2]=v-8;d.data[i+3]=255;}c.putImageData(d,0,0);for(let i=0;i<95;i++){const x=rand()*512,y=rand()*512;c.strokeStyle=kind==='wall'?'#10151125':'#ece8dc44';c.lineWidth=rand()*1.5+.3;c.beginPath();c.moveTo(x,y);c.lineTo(x+rand()*15,y+rand()*80);c.stroke();}}
 const t=new T.CanvasTexture(canvas);t.colorSpace=T.SRGBColorSpace;t.anisotropy=4;if(kind!=='contact')t.wrapS=t.wrapT=T.RepeatWrapping;return t;};return{wall:make('wall'),metal:make('metal'),contact:make('contact')};
}
