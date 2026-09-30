import * as T from 'three';
import type {Part} from './model.ts';

type XYZ=[number,number,number];
type Palette={white:T.Material;dark:T.Material;rubber:T.Material;metal:T.Material;teal:T.Material;shell:T.MeshPhysicalMaterial};
const TAU=Math.PI*2;
const seeded=(seed:number)=>()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
function canvas(draw:(c:CanvasRenderingContext2D,n:number)=>void,n=1024){const e=document.createElement('canvas');e.width=e.height=n;draw(e.getContext('2d')!,n);const t=new T.CanvasTexture(e);t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;return t;}
function mesh(p:T.Object3D,g:T.BufferGeometry,m:T.Material,xyz:XYZ=[0,0,0]){const o=new T.Mesh(g,m);o.position.set(...xyz);p.add(o);return o;}
function pipe(p:T.Object3D,points:XYZ[],r:number,m:T.Material){return mesh(p,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(a=>new T.Vector3(...a))),40,r,12,false),m);}
function ring(p:T.Object3D,xyz:XYZ,r:number,t:number,m:T.Material,axis='y'){const o=mesh(p,new T.TorusGeometry(r,t,8,64),m,xyz);if(axis==='y')o.rotation.x=Math.PI/2;else if(axis==='x')o.rotation.y=Math.PI/2;return o;}
function band(p:T.Object3D,xyz:XYZ,r:number,h:number,m:T.Material,inner=r-.02){return mesh(p,new T.LatheGeometry([new T.Vector2(inner,-h/2),new T.Vector2(r,-h/2),new T.Vector2(r,h/2),new T.Vector2(inner,h/2)],64),m,xyz);}
function lettering(text:string,sub:string){const t=canvas((c,n)=>{c.fillStyle='#161e22';c.fillRect(0,0,n,n);c.strokeStyle='#91a2a6';c.lineWidth=4;c.strokeRect(14,14,n-28,n-28);c.fillStyle='#d5dddd';c.font='600 94px Arial';c.fillText(text,56,190);c.font='40px Arial';c.fillStyle='#a0b1b4';c.fillText(sub,56,295);for(let y=380;y<690;y+=60){c.fillStyle='#819296';c.fillRect(56,y,n*(y%120? .68:.49),13);}c.fillStyle='#c4d1d4';c.font='33px Arial';c.fillText('EDUCATIONAL MODEL',56,890);});t.colorSpace=T.SRGBColorSpace;return new T.MeshStandardMaterial({map:t,roughness:.44,metalness:.12});}

export function addSurfaceDetail(parts:Part[],groups:Record<string,T.Group>,m:Palette){
 const get=(id:string)=>parts.find(p=>p.id===id)!.group;
 const detail=(id:string)=>{const g=new T.Group();get(id).add(g);return g;};
 const sump=detail('sump');for(const z of [-1.73,1.73])mesh(sump,new T.BoxGeometry(11.7,.012,.03),m.rubber,[0,.12,z]);
 const rp=detail('return-pipe');band(rp,[.35,1.8,0],.165,.27,m.white,.097);mesh(rp,new T.BoxGeometry(.41,.055,.10),m.dark,[.35,1.995,0]);mesh(rp,new T.CylinderGeometry(.04,.04,.12,24),m.metal,[.35,1.91,0]);
 const waterParts:T.Object3D[]=[];
 return {visibility:(v:boolean)=>waterParts.forEach(p=>p.visible=v),update:(_time:number)=>{}};
}

export function studioEnvironment(){const env=new T.Scene();env.background=new T.Color(0x24272b);const panel=(xyz:XYZ,size:XYZ,intensity:number)=>{const m=new T.MeshBasicMaterial({color:new T.Color().setRGB(intensity,intensity*.98,intensity*.94),side:T.DoubleSide});const o=mesh(env,new T.BoxGeometry(...size),m,xyz);o.lookAt(0,1,0);};panel([-4,4,5],[3,7,.05],5);panel([5,4,0],[1.2,8,.05],7);panel([0,7,-5],[6,2,.05],3);panel([-5,1,-4],[1,6,.05],2);return env;}
