import * as T from 'three';

/** Wash me (offline rivals): the rear window of a grubby old banger has been written on in the grime — on WASH.share of the
 * rivals from WASH.age of their age, a pale film of dust (WASH.dust, WASH.film opaque) over the pane with the words wiped clean through it by a
 * finger, so they show dark (each car its own words, WASH.words). Part of the glass: it goes when the window goes. */
export const WASH={age:.4,share:.5,film:.7,dust:0xd9ccb2,words:['WASH ME','CLEAN ME','ALSO IN WHITE','WASH ME PLEASE','MY OTHER CAR IS CLEAN','TEST DIRT ONLY'] as const} as const;
const hash=(n:number,salt:number)=>Math.abs(Math.sin(n*29.17+salt*43.91)*43758.5453)%1;
/** What is written on car `id`'s rear window at this age, or null. */
export function washWords(id:number,age:number){const n=Number.isFinite(id)?id:0;if(!(age>=WASH.age)||hash(n,1)>=WASH.share)return null;return WASH.words[Math.floor(hash(n,2)*WASH.words.length)];}
/** The rear window among a car's glass: the most rearward pane across the middle of the car (in the root's space). */
export function rearWindow(glass:readonly T.Mesh[],root:T.Object3D){
  root.updateMatrixWorld(true);const inverse=root.matrixWorld.clone().invert(),box=new T.Box3(),c=new T.Vector3();let best:T.Mesh|undefined,z=Infinity;
  for(const g of glass){box.setFromObject(g).getCenter(c).applyMatrix4(inverse);if(Math.abs(c.x)<.35&&c.z<z){z=c.z;best=g;}}
  return best;
}
/** The film: dust with the words wiped out of it (a canvas, so only where there is a document; alpha is the dust). */
function film(words:string){
  if(typeof document==='undefined')return null;const canvas=document.createElement('canvas');canvas.width=512;canvas.height=192;const g=canvas.getContext('2d');if(!g)return null;
  g.fillStyle=`#${WASH.dust.toString(16).padStart(6,'0')}`;g.fillRect(0,0,512,192);
  // Fingers wipe the words out of it, a little unevenly.
  g.globalCompositeOperation='destination-out';g.font='700 54px "Comic Sans MS", "Marker Felt", Montserrat, sans-serif';g.textAlign='center';g.textBaseline='middle';
  const lines=words.length>14?[words.slice(0,words.lastIndexOf(' ',words.length/2+3)),words.slice(words.lastIndexOf(' ',words.length/2+3)+1)]:[words];
  lines.forEach((line,k)=>{g.save();g.translate(256,96+(k-(lines.length-1)/2)*60);g.rotate(-.04+.03*k);g.fillText(line,0,0,480);g.restore();});
  const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;return map;
}
/** Lays the written film on this rear window (a child of the glass, sharing its geometry). Returns it, or null. */
export function fitWashMe(pane:T.Mesh,words:string){
  const rest=pane.geometry.attributes.wreckPosition as T.BufferAttribute|undefined;if(!rest)return null;
  const box=new T.Box3().setFromBufferAttribute(rest),map=film(words);
  // Read from behind: the pane's +x side is on the left as you face the back of the car.
  const material=new T.ShaderMaterial({name:'Wash me',transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-4,side:T.DoubleSide,
    uniforms:{map:{value:map},tint:{value:new T.Color(WASH.dust)},bounds:{value:new T.Vector4(box.max.x,box.min.x,box.min.y,box.max.y)},film:{value:WASH.film}},
    vertexShader:'attribute vec3 wreckPosition;uniform vec4 bounds;varying vec2 vWash;void main(){vWash=vec2((bounds.x-wreckPosition.x)/(bounds.x-bounds.y),(wreckPosition.y-bounds.z)/(bounds.w-bounds.z));gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:`uniform sampler2D map;uniform vec3 tint;uniform float film;varying vec2 vWash;void main(){vec2 uv=clamp(vWash,0.,1.);${map?'vec4 c=texture2D(map,uv);':'vec4 c=vec4(tint,1.);'}float edge=smoothstep(0.,.06,uv.x)*smoothstep(0.,.06,1.-uv.x)*smoothstep(0.,.08,uv.y)*smoothstep(0.,.08,1.-uv.y);gl_FragColor=vec4(c.rgb,c.a*film*(.55+.45*edge));}`});
  const mesh=new T.Mesh(pane.geometry,material);mesh.name='wash_me';mesh.renderOrder=3;mesh.castShadow=mesh.receiveShadow=false;mesh.frustumCulled=false;pane.add(mesh);return mesh;
}
