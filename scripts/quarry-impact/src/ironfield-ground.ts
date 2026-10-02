import * as T from 'three';
import {IRONFIELD} from './ironfield-course';

/** Original venue texture, created only when its world is constructed. Road
 * coverage uses the same segment union as the mechanical surface sampler.
 * Noise is one bounded image pass, with no per-pixel path-distance search. */
export function createIronfieldGround(){
 const width=2048,height=1536,spanX=360,spanZ=270,sx=width/spanX,sz=height/spanZ;
 const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
 const ctx=canvas.getContext('2d',{willReadFrequently:true})!;
 const mask=document.createElement('canvas');mask.width=width;mask.height=height;
 const coverage=mask.getContext('2d',{willReadFrequently:true})!;
 // A plane rotated -PI/2 maps image top to negative world Z. Keep this sign
 // explicit: the figure-eight is symmetric, but the finish marker is not.
 const px=(x:number)=>(x+spanX/2)*sx,pz=(z:number)=>(z+spanZ/2)*sz;
 const trace=(target:CanvasRenderingContext2D)=>{target.beginPath();IRONFIELD.samples.forEach((p,i)=>i?target.lineTo(px(p.x),pz(p.z)):target.moveTo(px(p.x),pz(p.z)));target.closePath();};
 coverage.lineJoin=coverage.lineCap='round';trace(coverage);coverage.strokeStyle='#fff';coverage.lineWidth=IRONFIELD.halfWidth*2*sx;coverage.stroke();
 const road=coverage.getImageData(0,0,width,height).data;
 // The wider aggregate shoulder is visible run-off, not an extra grip lane.
 coverage.clearRect(0,0,width,height);trace(coverage);coverage.lineWidth=23*sx;coverage.stroke();const shoulder=coverage.getImageData(0,0,width,height).data;
 const pixels=ctx.createImageData(width,height);let seed=826;
 const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 const noiseSide=128,noise=Float32Array.from({length:noiseSide*noiseSide},()=>random());
 const field=(x:number,y:number)=>{
  const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy),at=(a:number,b:number)=>noise[(b&127)*noiseSide+(a&127)];
  return T.MathUtils.lerp(T.MathUtils.lerp(at(ix,iy),at(ix+1,iy),u),T.MathUtils.lerp(at(ix,iy+1),at(ix+1,iy+1),u),v)-.5;
 };
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const i=(y*width+x)*4,a=road[i+3]/255,b=shoulder[i+3]/255,grain=(random()-.5)*15;
  const broad=field(x/230,y/230),medium=field(x/53+37,y/53+11),fine=field(x/7+15,y/7+71),mottling=broad*19+medium*9+fine*3;
  const earth=T.MathUtils.smoothstep(broad+medium*.55,-.20,.25),edge=b*(.84+medium*.23),roadTone=medium*3+fine*2;
  const red=T.MathUtils.lerp(105,131,earth)+mottling,green=T.MathUtils.lerp(111,121,earth)+mottling,blue=T.MathUtils.lerp(82,95,earth)+mottling;
  pixels.data[i]=T.MathUtils.lerp(T.MathUtils.lerp(red,150+mottling,edge),61+roadTone,a)+grain;
  pixels.data[i+1]=T.MathUtils.lerp(T.MathUtils.lerp(green,142+mottling,edge),66+roadTone,a)+grain;
  pixels.data[i+2]=T.MathUtils.lerp(T.MathUtils.lerp(blue,121+mottling,edge),66+roadTone,a)+grain;
  pixels.data[i+3]=255;
 }
 ctx.putImageData(pixels,0,0);ctx.lineCap='round';
 const wear=document.createElement('canvas');wear.width=width;wear.height=height;const marks=wear.getContext('2d')!;
 // Repairs follow the road heading. Every road mark is clipped to the same
 // asphalt mask; none can appear across the infield or gravel run-off.
 for(let i=0;i<26;i++){
  const t=random(),p=IRONFIELD.point(t),q=IRONFIELD.point(t+.001),yaw=Math.atan2(q.x-p.x,q.z-p.z),offset=(random()-.5)*8;
  marks.save();marks.translate(px(p.x+Math.cos(yaw)*offset),pz(p.z-Math.sin(yaw)*offset));marks.rotate(-yaw);
  const w=(1.7+random()*2.9)*sx,h=(2.2+random()*6)*sx;
  marks.beginPath();marks.moveTo(-w/2,-h/2);marks.lineTo(w/2,-h/2+.15*sx);marks.lineTo(w/2+.10*sx,h/2);marks.lineTo(-w/2-.12*sx,h/2-.12*sx);marks.closePath();marks.fillStyle=i%3?'rgba(28,34,35,.19)':'rgba(120,122,116,.16)';marks.fill();marks.strokeStyle='rgba(21,26,27,.27)';marks.lineWidth=.055*sx;marks.stroke();marks.restore();
 }
 // Paired tyre wear follows several stations around each bend rather than
 // drawing disconnected straight lines across the road.
 for(let i=0;i<115;i++){
  const t=random(),length=.004+random()*.018,offset=(random()-.5)*10;
  for(const track of [-.65,.65]){
   marks.beginPath();for(let j=0;j<=8;j++){const at=t+j*length/8,p=IRONFIELD.point(at),q=IRONFIELD.point(at+.0001),yaw=Math.atan2(q.x-p.x,q.z-p.z),x=px(p.x+Math.cos(yaw)*(offset+track)),z=pz(p.z-Math.sin(yaw)*(offset+track));if(j)marks.lineTo(x,z);else marks.moveTo(x,z);}
   marks.strokeStyle=`rgba(15,22,23,${.045+random()*.075})`;marks.lineWidth=(.14+random()*.07)*sx;marks.stroke();
  }
 }
 for(let i=0;i<34;i++){
  const t=random(),offset=(random()-.5)*12;marks.beginPath();
  for(let j=0;j<5;j++){const p=IRONFIELD.point(t+j*.0018),q=IRONFIELD.point(t+j*.0018+.0001),yaw=Math.atan2(q.x-p.x,q.z-p.z),shift=offset+(random()-.5)*.25,x=px(p.x+Math.cos(yaw)*shift),z=pz(p.z-Math.sin(yaw)*shift);if(j)marks.lineTo(x,z);else marks.moveTo(x,z);}
  marks.strokeStyle='rgba(28,33,32,.3)';marks.lineWidth=.065*sx;marks.stroke();
 }
 const roadCanvas=document.createElement('canvas');roadCanvas.width=width;roadCanvas.height=height;roadCanvas.getContext('2d')!.putImageData(new ImageData(road,width,height),0,0);marks.globalCompositeOperation='destination-in';marks.drawImage(roadCanvas,0,0);ctx.drawImage(wear,0,0);
 // Paint ends before the crossing instead of falsely marking one branch as
 // a bridge. Only this small edge-station pass queries route distance.
 for(let i=0;i<512;i++)for(const side of [-1,1]){
  const a=IRONFIELD.point(i/512),b=IRONFIELD.point((i+1)/512),yaw=Math.atan2(b.x-a.x,b.z-a.z);
  const ax=a.x+Math.cos(yaw)*8.05*side,az=a.z-Math.sin(yaw)*8.05*side,bx=b.x+Math.cos(yaw)*8.05*side,bz=b.z-Math.sin(yaw)*8.05*side;
  if(IRONFIELD.distance((ax+bx)/2,(az+bz)/2)<7.6)continue;
  ctx.beginPath();ctx.moveTo(px(ax),pz(az));ctx.lineTo(px(bx),pz(bz));ctx.strokeStyle='#c6c5b4';ctx.lineWidth=.16*sx;ctx.stroke();
 }
 const start=IRONFIELD.point(0),ahead=IRONFIELD.point(.0001),yaw=Math.atan2(ahead.x-start.x,ahead.z-start.z);
 ctx.save();ctx.translate(px(start.x),pz(start.z));ctx.rotate(-yaw);
 for(let row=0;row<2;row++)for(let col=0;col<16;col++){ctx.fillStyle=(row+col)%2?'#d5d2bd':'#252928';ctx.fillRect((col-8)*sx,(row-.5)*sx,sx,sx);}
 ctx.restore();
 const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;map.anisotropy=8;
 // A2m repeat gives millimetre-scale aggregate independently of the venue map.
 // Red is bump height; green varies roughness, so one small owned texture serves
 // both channels without geometric displacement or an extra rendered surface.
 const detailBytes=new Uint8Array(256*256*4);for(let i=0;i<detailBytes.length;i+=4){const grain=random();detailBytes[i]=108+grain*40;detailBytes[i+1]=220+grain*35;detailBytes[i+2]=128;detailBytes[i+3]=255;}
 const detail=new T.DataTexture(detailBytes,256,256,T.RGBAFormat);detail.wrapS=detail.wrapT=T.RepeatWrapping;detail.repeat.set(spanX/2,spanZ/2);detail.generateMipmaps=true;detail.minFilter=T.LinearMipmapLinearFilter;detail.magFilter=T.LinearFilter;detail.anisotropy=8;detail.needsUpdate=true;
 const ground=new T.Mesh(new T.PlaneGeometry(spanX,spanZ),new T.MeshStandardMaterial({map,roughness:1,roughnessMap:detail,bumpMap:detail,bumpScale:.008}));ground.name='ironfield_ground';ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;
 let disposed=false;return{ground,coverage:{width,height,spanX,spanZ,road},dispose(){if(disposed)return;disposed=true;ground.geometry.dispose();(ground.material as T.Material).dispose();map.dispose();detail.dispose();}};
}
