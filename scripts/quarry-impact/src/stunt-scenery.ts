import * as T from 'three';
import {DOUBLE_LOOP,doubleLoopPoint} from './double-loop';
import {STUNT_LOOP,stuntLoopPoint} from './stunt-layout';
/** Scenic structures remain beyond the park wall; loop framing sits under its ribbon. */
export function addStuntScenery(root:T.Group){
 const geometries:T.BufferGeometry[]=[],textures:T.Texture[]=[],materials:T.Material[]=[];
 const palette={steel:0x263a40,rust:0x8d4834,cream:0xc8bfa7,red:0x9d302c,teal:0x276c70,dark:0x17262b,glass:0x739ba7,yellow:0xe0ad45,skin:0xc79570,blue:0x405e85,white:0xd8ded5};
 type Finish=keyof typeof palette;
 const mats=Object.fromEntries(Object.entries(palette).map(([key,color])=>{const m=new T.MeshStandardMaterial({color,roughness:key==='glass'?.3:.85,metalness:key==='steel'?.45:0});materials.push(m);return[key,m];})) as Record<Finish,T.MeshStandardMaterial>;
 const cube=new T.BoxGeometry();geometries.push(cube);const batches=new Map<Finish,T.Matrix4[]>();
 const place=(p:T.Vector3,size:T.Vector3,finish:Finish,q=new T.Quaternion())=>{const list=batches.get(finish)??[];list.push(new T.Matrix4().compose(p,q,size));batches.set(finish,list);};
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,finish:Finish)=>place(new T.Vector3(x,y,z),new T.Vector3(w,h,d),finish);
 const beam=(a:T.Vector3,b:T.Vector3,width:number,finish:Finish)=>{const delta=b.clone().sub(a);place(a.clone().add(b).multiplyScalar(.5),new T.Vector3(width,delta.length(),width),finish,new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize()));};
 // Longitudinal edge girders and crossmembers beneath all three loop turns.
 for(const [spec,point,turns] of [[STUNT_LOOP,stuntLoopPoint,1],[DOUBLE_LOOP,doubleLoopPoint,2]] as const){
  const samples=turns*120;
  const edge=(t:number,side:number)=>{const p=point(t),a=t*Math.PI*2*turns;return new T.Vector3(p.x+side*(spec.halfWidth+.12),p.y-.26*Math.cos(a),p.z+.26*Math.sin(a));};
  for(let i=0;i<samples;i++)for(const side of [-1,1])beam(edge(i/samples,side),edge((i+1)/samples,side),.24,'steel');
  for(let i=0;i<=samples;i+=5)beam(edge(i/samples,-1),edge(i/samples,1),.18,'rust');
 }
 box(0,-.22,222,480,.4,30,'cream');box(0,-.22,-215,480,.4,45,'cream');
 for(const x of [-141,-87])box(x,36.5,25,.4,6,.4,'steel');box(-114,39.3,25,54.4,.4,.4,'steel');
 for(const x of [-28,28])box(x,13.5,198,.45,7,.45,'steel');
 // Two spectator terraces outside the southern wall, with stepped seats and a cantilever canopy.
 for(const center of [-105,105]){
  for(let row=0;row<7;row++){
   const y=1+row*.72,z=-194-row*1.7;box(center,y-.3,z,144,.6,1.8,'cream');box(center,y+.16,z,140,.18,.5,row%2?'teal':'red');
   for(let col=0;col<65;col++){if((col*7+row*11)%9<2||col%16===0)continue;const x=center-68+col*2.1;box(x,y+.8,z,.48,.82,.4,(['blue','red','yellow','cream'] as Finish[])[(col+row*3)%4]);box(x,y+1.38,z,.34,.36,.32,'skin');}
  }
  box(center,8.3,-203,150,.35,21,'steel');box(center,8.05,-192.3,150,.7,.22,'red');
  for(let x=center-72;x<=center+72;x+=24){box(x,4,-212,.45,8,.45,'steel');beam(new T.Vector3(x,5,-212),new T.Vector3(x,8,-192),.22,'cream');}
  for(let row=0;row<7;row++)for(const offset of [-36,0,36])box(center+offset,1+row*.72,-194-row*1.7,2.2,.2,1.8,'yellow');
 }
 // Workshop bay doors, corrugated shutters, windows, vents and roof services on existing buildings.
 for(const center of [-130,-50,50,130]){
  for(const offset of [-17,0,17]){box(center+offset,3.4,187.85,12,6.8,.2,'dark');for(let row=0;row<12;row++)box(center+offset,.6+row*.48,187.68,11.6,.09,.18,'steel');box(center+offset,7.6,187.7,11,.8,.18,'glass');}
  for(const x of [center-20,center+20]){box(x,11.2,202,5,1.2,4,'cream');for(let i=0;i<5;i++)box(x-1.6+i*.8,11.85,202,.15,.12,3.5,'steel');}
  box(center,10.9,196,17,.5,3.5,'glass');
 }
 // Lighting towers stand beyond the wall; no collision-free poles inside driving space.
 for(const x of [-224,224])for(const z of [-150,0,150]){
  box(x,12,z,.65,24,.65,'steel');box(x,24,z,9,.5,.6,'steel');
  for(const dx of [-3,0,3]){box(x+dx,23.5,z,2.3,1.3,1.1,'dark');box(x+dx,23.5,z+(z>0?-.57:.57),1.9,.9,.08,'white');}
  for(let y=1;y<22;y+=.8)box(x+.6,y,z,.8,.08,.5,'cream');
 }
 // Shipping containers and equipment behind the workshops.
 for(let i=0;i<9;i++){const x=-200+i*48;box(x,2.6,226,13,5.2,6,i%2?'rust':'teal');for(let rib=0;rib<14;rib++)box(x-6+rib*.92,2.6,222.95,.13,4.8,.12,'steel');box(x+3,6,226,4,1.4,3,'cream');}
 for(const [finish,list]of batches){const mesh=new T.InstancedMesh(cube,mats[finish],list.length);list.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name='stunt_detail_'+finish;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 // A single atlas gives the facility a readable identity without per-frame canvas work.
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=512;const ctx=canvas.getContext('2d');
  if(ctx){ctx.fillStyle='#162a2e';ctx.fillRect(0,0,1024,512);const labels=['ALDERWICK MOTOR SHOW','DOUBLE JEOPARDY','NO REFUNDS GARAGE','BEND IT. SEND IT.'];
   labels.forEach((label,i)=>{const y=i*128;ctx.fillStyle=i%2?'#c7a252':'#cce0d8';ctx.fillRect(0,y,1024,6);ctx.textAlign='center';ctx.font='bold 63px sans-serif';ctx.fillText(label,512,y+85);});
   const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=4;textures.push(texture);const mat=new T.MeshStandardMaterial({map:texture,roughness:1,side:T.FrontSide});materials.push(mat);
   const sign=(label:number,x:number,y:number,z:number,width:number,height:number)=>{const g=new T.PlaneGeometry(width,height),uv=g.getAttribute('uv');for(let i=0;i<uv.count;i++)uv.setY(i,(3-label+uv.getY(i))/4);geometries.push(g);const m=new T.Mesh(g,mat);m.position.set(x,y,z);if(z>0)m.rotation.y=Math.PI;m.name='stunt_sign_'+label;root.add(m);};
   sign(0,0,13,198,60,7.5);sign(1,-114,36.5,24.4,39,4.8);sign(2,-130,9.3,187.5,45,3.7);sign(2,130,9.3,187.5,45,3.7);sign(3,-105,8,-191.9,58,3.8);sign(3,105,8,-191.9,58,3.8);
  }
 }
 return{geometries,textures,materials};
}
