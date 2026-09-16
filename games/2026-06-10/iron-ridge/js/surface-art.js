// Small shared procedural maps. Generated once, never painted per frame.
import * as THREE from 'three';
import { makeRng } from './noise.js?v=detail2';

export function groundRelief() {
  const n = 256, height = new Float32Array(n * n), data = new Uint8Array(n * n * 4);
  const rng = makeRng(91243);
  for (let i = 0; i < height.length; i++) height[i] = rng() * 0.15;
  for (let k = 0; k < 1100; k++) {
    const cx = rng() * n, cy = rng() * n, radius = 1 + rng() * 3.5;
    for (let y = Math.floor(cy-radius); y <= cy+radius; y++) for (let x = Math.floor(cx-radius); x <= cx+radius; x++) {
      const d = Math.hypot(x-cx, y-cy) / radius;
      if (d < 1) height[((y+n)%n)*n+(x+n)%n] += Math.sqrt(1-d*d) * 0.42;
    }
  }
  for (let y=0;y<n;y++) for(let x=0;x<n;x++) {
    const i=y*n+x;
    const dx=(height[y*n+(x+1)%n]-height[y*n+(x+n-1)%n])*1.1;
    const dy=(height[((y+1)%n)*n+x]-height[((y+n-1)%n)*n+x])*1.1;
    data[i*4]=Math.max(0,Math.min(255,128-dx*127));
    data[i*4+1]=Math.max(0,Math.min(255,128-dy*127));
    data[i*4+2]=Math.min(255,Math.max(0,height[i]*255));
    data[i*4+3]=255;
  }
  const map = new THREE.DataTexture(data,n,n);
  map.wrapS=map.wrapT=THREE.RepeatWrapping;
  map.minFilter=THREE.LinearMipmapLinearFilter;
  map.magFilter=THREE.LinearFilter; map.generateMipmaps=true;
  map.anisotropy=4; map.needsUpdate=true;
  return map;
}

export function treadTexture() {
  const c=document.createElement('canvas');c.width=128;c.height=256;
  const ctx=c.getContext('2d'), rng=makeRng(716);
  // Packed earth underneath the articulated, chevron-shaped grousers.
  ctx.fillStyle='rgba(60,49,33,0.18)';ctx.fillRect(8,0,112,256);
  for(let y=-8;y<264;y+=32){
    ctx.fillStyle='rgba(36,29,20,0.8)';ctx.beginPath();
    ctx.moveTo(10,y);ctx.lineTo(64,y+11);ctx.lineTo(118,y);
    ctx.lineTo(118,y+14);ctx.lineTo(64,y+26);ctx.lineTo(10,y+14);ctx.fill();
    ctx.strokeStyle='rgba(125,104,68,0.48)';ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(13,y+15);ctx.lineTo(64,y+27);ctx.lineTo(115,y+15);ctx.stroke();
  }
  ctx.globalCompositeOperation='destination-out';
  for(let i=0;i<650;i++){ctx.fillStyle=`rgba(0,0,0,${rng()*.5})`;ctx.fillRect(rng()*128,rng()*256,1+rng()*4,1+rng()*3);}
  const map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=4;
  return map;
}

export function barkTexture() {
  const c=document.createElement('canvas');c.width=c.height=128;
  const ctx=c.getContext('2d'),rng=makeRng(617);
  ctx.fillStyle='#a89578';ctx.fillRect(0,0,128,128);
  for(let i=0;i<230;i++) {
    const x=rng()*128,y=rng()*128;
    ctx.strokeStyle=i%3?'rgba(56,43,29,0.42)':'rgba(226,211,177,0.5)';ctx.lineWidth=.5+rng()*2;
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(rng()-.5)*5,y+7+rng()*38);ctx.stroke();
  }
  const map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;
  map.wrapS=map.wrapT=THREE.RepeatWrapping;return map;
}
