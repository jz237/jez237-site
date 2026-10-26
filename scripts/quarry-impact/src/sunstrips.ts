import * as T from 'three';

/** Sunstrips (offline rivals): most bangers run a dark band across the top of the windscreen with the driver's name on it —
 * SUNSTRIP.share of the rivals, each its own name (SUNSTRIP.names, fictional nicknames) in its own colours, over the top
 * SUNSTRIP.band of the windscreen's height (at least SUNSTRIP.least m). It is part of the glass: it dents and crazes with it and
 * goes when the windscreen goes. */
export const SUNSTRIP={share:.8,band:.3,least:.09,names:['BAZZA','GAZ','DAZ','SHAZ','TEL','KEV','SPUD','TOMMO','MO','DEL','BIG DAVE','MAD MICK','WOZZA','JONESY','TINA','RAZ'],
  bands:[0x10233f,0x0c0c0c,0x1d3b1f,0x5a0d0d,0x2b2b2b] as const,inks:[0xffffff,0xf2c21a,0xffffff,0xf0f0f0,0xf26a1b] as const} as const;
const hash=(n:number,salt:number)=>Math.abs(Math.sin(n*19.91+salt*57.31)*43758.5453)%1;
/** Car `id`'s sunstrip — name, band and ink colours — or null if it runs without one. */
export function sunstripFor(id:number):{name:string;band:number;ink:number}|null{
  const n=Number.isFinite(id)?id:0;if(hash(n,1)>=SUNSTRIP.share)return null;const c=Math.floor(hash(n,3)*SUNSTRIP.bands.length);
  return{name:SUNSTRIP.names[Math.floor(hash(n,2)*SUNSTRIP.names.length)],band:SUNSTRIP.bands[c],ink:SUNSTRIP.inks[c]};
}
/** The strip's lettering: the name in its ink on its band (a canvas, so only where there is a document). */
function lettering(name:string,band:number,ink:number){
  if(typeof document==='undefined')return null;const canvas=document.createElement('canvas');canvas.width=512;canvas.height=64;const g=canvas.getContext('2d');if(!g)return null;
  g.fillStyle=`#${band.toString(16).padStart(6,'0')}`;g.fillRect(0,0,512,64);g.fillStyle=`#${ink.toString(16).padStart(6,'0')}`;
  g.font='900 46px Montserrat, "Arial Black", sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(name,256,35,470);
  const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;return map;
}
/** Where the band lies on a windscreen, from its rest shape (model frame): across its width (reading from its −x side, as seen
 * from in front), the top SUNSTRIP.band of its height. */
export function stripBounds(rest:T.BufferAttribute){
  const box=new T.Box3().setFromBufferAttribute(rest),band=Math.max(SUNSTRIP.least,(box.max.y-box.min.y)*SUNSTRIP.band);
  return{left:box.min.x,right:box.max.x,top:box.max.y,band};
}
/** Lays the strip on this windscreen (a child of the glass, sharing its geometry). Returns the strip, or null. */
export function fitSunstrip(screen:T.Mesh,strip:{name:string;band:number;ink:number}){
  const rest=screen.geometry.attributes.wreckPosition as T.BufferAttribute|undefined;if(!rest)return null;
  const map=lettering(strip.name,strip.band,strip.ink),b=stripBounds(rest);
  // Read from in front: the windscreen's −x side is on the left as you face it.
  const material=new T.ShaderMaterial({name:'Sunstrip',transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-4,side:T.DoubleSide,
    uniforms:{map:{value:map},ink:{value:new T.Color(strip.ink)},band:{value:new T.Color(strip.band)},bounds:{value:new T.Vector4(b.left,b.right,b.top,b.band)}},
    vertexShader:'attribute vec3 wreckPosition;uniform vec4 bounds;varying vec2 vStrip;void main(){vStrip=vec2((bounds.x-wreckPosition.x)/(bounds.x-bounds.y),(wreckPosition.y-(bounds.z-bounds.w))/bounds.w);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:`uniform sampler2D map;uniform vec3 band;varying vec2 vStrip;void main(){if(vStrip.y<0.||vStrip.y>1.||vStrip.x<0.||vStrip.x>1.)discard;${map?'vec4 c=texture2D(map,vStrip);':'vec4 c=vec4(band,1.);'}gl_FragColor=vec4(c.rgb,.94);}`});
  const mesh=new T.Mesh(screen.geometry,material);mesh.name='sunstrip';mesh.renderOrder=3;mesh.castShadow=mesh.receiveShadow=false;mesh.frustumCulled=false;screen.add(mesh);return mesh;
}
