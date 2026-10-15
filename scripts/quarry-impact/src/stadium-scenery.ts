import * as T from 'three';
import {HOLLOWAY} from './stadium-reservoir-courses';
/** Holloway's decorative venue furniture never participates in racing physics. */
export function createStadiumScenery(){
 const root=new T.Group();root.name='holloway-venue';
 const palette={steel:0x3b4548,roof:0xb3b5ab,red:0x984637,cream:0xd1c7a6,blue:0x45687a,glass:0x34474d,skin:0xae8c6b};
 type Finish=keyof typeof palette;
 const geometry=new T.BoxGeometry(1,1,1),materials=Object.fromEntries(Object.entries(palette).map(([k,color])=>[k,new T.MeshStandardMaterial({color,roughness:k==='glass'?.3:.87,metalness:k==='steel'?.35:0})])) as Record<Finish,T.MeshStandardMaterial>;
 const batches=new Map<Finish,T.Matrix4[]>(),placements:{x:number;z:number;w:number;d:number;kind:string}[]=[],textures:T.Texture[]=[];
 function box(f:Finish,x:number,y:number,z:number,w:number,h:number,d:number){const a=batches.get(f)??[];a.push(new T.Matrix4().compose(new T.Vector3(x,y,z),new T.Quaternion(),new T.Vector3(w,h,d)));batches.set(f,a);}
 function reserve(x:number,z:number,w:number,d:number,kind:string){
  for(let dx=-w/2;dx<=w/2;dx+=Math.min(2,w/2))for(let dz=-d/2;dz<=d/2;dz+=Math.min(2,d/2))if(HOLLOWAY.distance(x+dx,z+dz)<23)return false;
  placements.push({x,z,w,d,kind});return true;
 }
 // Existing stepped terraces get canopies, structural posts, aisles and spectators.
 for(const z of [-145,117])for(const x of [-110,-55,0,55,110]){
  const sign=Math.sign(z);if(!reserve(x,z+sign*6,52,18,'covered-stand'))continue;
  box('roof',x,17,z+sign*6,52,.45,18);
  for(const dx of [-24,24]){box('steel',x+dx,8,z+sign*13,.4,16,.4);box('steel',x+dx,16,z+sign*6,.35,.7,18);}
  box('red',x,16.3,z-sign*3,52,1.3,.3);
  for(let tier=0;tier<5;tier++){
   const zz=z+sign*tier*3,yy=2.5+tier*2.4;
   for(let seat=0;seat<34;seat++){
    // Deterministic empty seats and varied clothes avoid full uniform rows.
    if((seat*17+tier*7+Math.abs(x))%11<3)continue;
    const xx=x-22+seat*1.33;
    box((seat+tier)%3===0?'cream':(seat+tier)%3===1?'red':'blue',xx,yy+.6,zz,.48,.85,.45);
    box('skin',xx,yy+1.17,zz,.35,.35,.35);
   }
   box('steel',x-24,yy+1.3,zz,.12,.12,3);
  }
 }
 // Low infield pits leave the racing and recovery corridors completely clear.
 if(reserve(0,-48,86,18,'pit-garages')){
  box('cream',0,3,-48,84,6,16);box('roof',0,6.3,-48,87,.6,19);
  for(let x=-35;x<=35;x+=10){
   box('steel',x,2.4,-56.1,7,4.7,.15);
   for(let y=.5;y<4.7;y+=.45)box('roof',x,y,-56.2,6.7,.07,.12);
   box('red',x,5.2,-56.3,8,.65,.15);
  }
  box('blue',0,8.1,-47,25,3,13);box('glass',0,8.2,-53.6,23,1.8,.15);box('roof',0,9.9,-47,27,.5,15);
  for(let x=-10;x<=10;x+=5)box('cream',x,8.2,-53.8,.15,2,.18);
 }
 for(const x of [-171,171])if(reserve(x,145,30,16,'stadium-entry')){
  box('red',x,3,145,28,6,14);box('roof',x,6.4,145,30,.7,16);
  for(const dx of [-9,0,9]){box('glass',x+dx,2.9,137.9,5,4.5,.15);box('cream',x+dx,5.5,137.7,6,.4,.2);}
 }
 // A legible original board replaces the arbitrary vertical placeholder stripes.
 function sign(text:string,sub:string,x:number,y:number,z:number,w:number,h:number){
  if(typeof document==='undefined')return;
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256;const ctx=canvas.getContext('2d');if(!ctx)return;
  ctx.fillStyle='#18262a';ctx.fillRect(0,0,1024,256);ctx.strokeStyle='#dba84b';ctx.lineWidth=12;ctx.strokeRect(6,6,1012,244);ctx.textAlign='center';ctx.fillStyle='#ece4cc';ctx.font='bold 68px sans-serif';ctx.fillText(text,512,112,940);ctx.fillStyle='#dba84b';ctx.font='bold 37px sans-serif';ctx.fillText(sub,512,193,940);
  const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;textures.push(texture);
  const material=new T.MeshBasicMaterial({map:texture,side:T.DoubleSide});const mesh=new T.Mesh(new T.PlaneGeometry(w,h),material);mesh.position.set(x,y,z);mesh.rotation.y=Math.PI;mesh.name='holloway-sign';root.add(mesh);
 }
 sign('HOLLOWAY MOTOR STADIUM','FULL CONTACT / HALF THE RESALE VALUE',0,8,-6.4,31,10);
 sign('PANEL BEATERS CLUB','PIT SERVICE / DENT COLLECTION',0,11,-54,25,4);
 for(const [finish,matrices]of batches){const mesh=new T.InstancedMesh(geometry,materials[finish],matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.placements=placements;
 let disposed=false;return {root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();else if(o instanceof T.Mesh){o.geometry.dispose();(o.material as T.Material).dispose();}});geometry.dispose();Object.values(materials).forEach(m=>m.dispose());textures.forEach(t=>t.dispose());root.clear();}};
}
