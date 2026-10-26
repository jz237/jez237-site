import * as T from 'three';

/** Number plates (offline rivals): every rival wears its own registration — UK style, white at the front and yellow at the back,
 * black characters — instead of the one plate its model came with; now and then (PLATES.joke of them) a banger's personal plate
 * (PLATES.jokes). Laid over each plate panel, it goes when the plate goes. Registrations are made up. */
export const PLATES={joke:.15,jokes:['B4 NGR','SCR4P','W3CK ED','RU5 TY','DENT 1','CR4 SH','B1G DNT','N0 MOT'] as const,front:0xf4f4f0,rear:0xf6c419,ink:0x111111,
  letters:'ABCDEFGHJKLMNPRSTVWXY'} as const;
const hash=(n:number,salt:number)=>Math.abs(Math.sin(n*37.71+salt*11.37)*43758.5453)%1;
/** Car `id`'s registration. */
export function plateFor(id:number){
  const n=Number.isFinite(id)?id:0,L=PLATES.letters,pick=(s:number)=>L[Math.floor(hash(n,s)*L.length)];
  if(hash(n,1)<PLATES.joke)return PLATES.jokes[Math.floor(hash(n,2)*PLATES.jokes.length)];
  const digits=String(10+Math.floor(hash(n,3)*80));return `${pick(4)}${pick(5)}${digits} ${pick(6)}${pick(7)}${pick(8)}`;
}
/** The plate's face: the registration on its colour (a canvas, so only where there is a document). */
function face(text:string,colour:number){
  if(typeof document==='undefined')return null;const canvas=document.createElement('canvas');canvas.width=512;canvas.height=112;const g=canvas.getContext('2d');if(!g)return null;
  g.fillStyle=`#${colour.toString(16).padStart(6,'0')}`;g.fillRect(0,0,512,112);g.strokeStyle='#222';g.lineWidth=5;g.strokeRect(4,4,504,104);
  g.fillStyle=`#${PLATES.ink.toString(16).padStart(6,'0')}`;g.font='800 78px "Arial Narrow", Montserrat, "Arial Black", sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(text,256,60,480);
  const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;return map;
}
/** Is this panel a number plate: named for one, or made of the plate material (some models call it the licence)? */
export const isPlate=(panel:T.Mesh)=>/plate$/i.test(panel.name)||(!Array.isArray(panel.material)&&/licen[cs]e|plate backing/i.test((panel.material as T.Material).name));
/** Lays this car's registration over each of its plate panels (front white, rear yellow). Returns how many plates. */
export function fitPlates(panels:readonly T.Mesh[],text:string){
  let n=0;
  for(const plate of panels){
    if(!isPlate(plate))continue;const rest=plate.geometry.attributes.wreckPosition as T.BufferAttribute|undefined;if(!rest)continue;
    const box=new T.Box3().setFromBufferAttribute(rest),front=box.getCenter(new T.Vector3()).z>=0,map=face(text,front?PLATES.front:PLATES.rear);
    // Read the right way: from in front −x is on the left, from behind +x is.
    const [left,right]=front?[box.min.x,box.max.x]:[box.max.x,box.min.x];
    const material=new T.ShaderMaterial({name:'Number plate',polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-4,side:T.DoubleSide,
      uniforms:{map:{value:map},plain:{value:new T.Color(front?PLATES.front:PLATES.rear)},bounds:{value:new T.Vector4(left,right,box.min.y,box.max.y)}},
      vertexShader:'attribute vec3 wreckPosition;uniform vec4 bounds;varying vec2 vPlate;void main(){vPlate=vec2((wreckPosition.x-bounds.x)/(bounds.y-bounds.x),(wreckPosition.y-bounds.z)/(bounds.w-bounds.z));gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:`uniform sampler2D map;uniform vec3 plain;varying vec2 vPlate;void main(){vec2 uv=clamp(vPlate,0.,1.);${map?'gl_FragColor=vec4(texture2D(map,uv).rgb,1.);':'gl_FragColor=vec4(plain,1.);'}}`});
    const mesh=new T.Mesh(plate.geometry,material);mesh.name='number_plate';mesh.castShadow=mesh.receiveShadow=false;mesh.frustumCulled=false;plate.add(mesh);n++;
  }
  return n;
}
