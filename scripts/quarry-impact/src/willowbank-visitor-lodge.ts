import {url} from './assets';
import * as T from 'three';
import {WILLOWBANK as course} from './willowbank-course';
/** A recognisable visitor centre, replacing only the old lodge's instance footprint. */
export function createVisitorLodge(){
 const root=new T.Group();root.name='willowbank-visitor-lodge';
 const ox=-45,oz=-10,ground=Math.max(...[-19,19].flatMap(x=>[-12,18].map(z=>course.height(ox+x,oz+z))))+.1;
 const geometry=new T.BoxGeometry(1,1,1),textures:T.Texture[]=[],extras:T.Mesh[]=[],placements:T.Box3[]=[];
 const palette={timber:0x73634b,trim:0xcfc6a2,roof:0x39443d,glass:0x263f43,stone:0x8b8872,red:0x953d27,dark:0x252c27};
 type Finish=keyof typeof palette;
 const materials=Object.fromEntries(Object.entries(palette).map(([k,color])=>[k,new T.MeshStandardMaterial({color,roughness:k==='glass'?.23:.95})])) as Record<Finish,T.MeshStandardMaterial>;
 if(typeof document!=='undefined')for(const [finish,file]of [['timber','cladding_diff'],['stone','workyard/concrete_layers_02-diff'],['roof','asphalt_diff']]as const){const t=new T.TextureLoader().load(url('assets/'+file+'.jpg'));t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(finish==='timber'?4:3,2);t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;textures.push(t);materials[finish].map=t;materials[finish].color.set(finish==='roof'?0xa3b3a4:0xe0cfaf);}
 const batches=new Map<Finish,T.Matrix4[]>(),dummy=new T.Object3D();
 function box(f:Finish,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0){dummy.position.set(ox+x,ground+y,oz+z);dummy.rotation.set(rx,ry,rz);dummy.scale.set(w,h,d);dummy.updateMatrix();const list=batches.get(f)??[];list.push(dummy.matrix.clone());batches.set(f,list);placements.push(new T.Box3(new T.Vector3(-.5,-.5,-.5),new T.Vector3(.5,.5,.5)).applyMatrix4(dummy.matrix));}
 function sign(title:string,sub:string,x:number,y:number,z:number,w:number,h:number){if(typeof document==='undefined')return;const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d')!;ctx.fillStyle='#243c32';ctx.fillRect(0,0,1024,256);ctx.strokeStyle='#d9c896';ctx.lineWidth=12;ctx.strokeRect(10,10,1004,236);ctx.fillStyle='#eadbb7';ctx.textAlign='center';ctx.font='bold 64px sans-serif';ctx.fillText(title,512,109,970);ctx.font='28px sans-serif';ctx.fillText(sub,512,179,970);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;textures.push(t);const mesh=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:t,roughness:1}));mesh.position.set(ox+x,ground+y,oz+z);root.add(mesh);extras.push(mesh);}
 // A low retaining plinth seats the building and deck on the sloping ground.
 box('stone',0,-1.45,1,37,3,25);box('timber',0,.1,7.5,36,.3,11);
 box('timber',0,2.55,-2,28,4.8,15);
 for(let x=-13.5;x<=13.5;x+=1.5){box('trim',x,2.6,5.57,.08,4.7,.09);box('trim',x,2.6,-9.57,.08,4.7,.09);}
 // Pitched metal roof, ridge cap and gable infill, rather than the old cone.
 const pitch=Math.atan2(3,8.6);
 for(const side of [-1,1]){box('roof',0,6.5,-2+side*4.3,30,.32,Math.hypot(8.6,3),side*pitch);box('trim',0,4.95,-2+side*8.6,30,.24,.22);for(let x=-14.5;x<=14.5;x+=1.25)box('roof',x,6.69,-2+side*4.3,.065,.08,Math.hypot(8.6,3),side*pitch);}
 box('roof',0,8.09,-2,30,.2,.42);
 for(const side of [-1,1]){
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute([ox+side*14,ground+4.95,oz-10.6,ox+side*14,ground+4.95,oz+6.6,ox+side*14,ground+8,oz-2],3));g.computeVertexNormals();const m=materials.timber.clone();m.side=T.DoubleSide;const mesh=new T.Mesh(g,m);mesh.castShadow=true;root.add(mesh);extras.push(mesh);
 }
 // Framed windows, opening door and porch canopy.
 for(const x of [-9,-4.5,4.5,9]){box('trim',x,2.8,5.66,3.5,2.4,.18);box('glass',x,2.8,5.79,3.1,2,.10);box('trim',x,2.8,5.87,.09,2.1,.08);box('trim',x,2.8,5.87,3.2,.09,.08);box('trim',x,1.51,5.85,3.8,.18,.48);}
 box('trim',0,1.9,5.7,2.5,3.7,.2);box('dark',0,1.8,5.85,2.1,3.4,.12);box('glass',0,2.4,5.94,1.65,1.55,.08);box('trim',.7,1.4,6.02,.08,.32,.1);
 box('roof',0,4.45,9.5,35,.25,8,-.05);
 for(const x of [-16,-8,8,16]){box('timber',x,2.25,12.8,.24,4.4,.24);box('trim',x,3.8,11.8,.17,2.4,.17,.65);}
 sign('WILLOWBANK RANGER STATION','PLEASE DO NOT FEED THE RACING DRIVERS',0,4.15,13,18,1.5);
 // Deck planks, railings and broad public steps.
 for(let x=-17.5;x<=17.5;x+=.55)box('timber',x,.29,8,.035,.025,10.5);
 for(const side of [-1,1]){box('trim',side*11,.95,13,13,.12,.12);for(let x=5;x<=17;x+=1.5)box('timber',side*x,.65,13,.1,1.15,.1);}
 for(let i=0;i<4;i++)box('timber',0,-.1-i*.2,13.6+i*.5,7,.25,.6);
 // Picnic tables and red recycling bins give the porch human scale.
 for(const x of [-11,11]){box('timber',x,1.15,9,4,.16,1.4);for(const side of [-1,1]){box('timber',x,.65,9+side*1.25,4,.15,.5);for(const dx of [-1.3,1.3])box('dark',x+dx,.67,9+side*.45,.1,1,.1,0,0,side*.35);}}
 for(const x of [-16,16]){box('red',x,.8,6,1,1.3,1);box('dark',x,1.5,6,1.1,.15,1.1);}
 // Masonry chimney with flashing and a weather vane.
 box('stone',10,6.5,-5,1.8,7,1.8);box('dark',10,10.1,-5,2.2,.25,2.2);box('dark',-9,9.1,-2,.08,2,.08);box('trim',-9,9.85,-2,2,.08,.08);box('red',-8.2,9.85,-2,.5,.35,.12);
 for(const [f,matrices]of batches){const mesh=new T.InstancedMesh(geometry,materials[f],matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.castShadow=true;mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 root.userData.placements=placements;root.userData.pieces=placements.length;
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});geometry.dispose();Object.values(materials).forEach(m=>m.dispose());textures.forEach(t=>t.dispose());extras.forEach(m=>{m.geometry.dispose();(m.material as T.Material).dispose();});root.clear();}};
}
export function hideOldLodge(root:T.Group){const originals:{mesh:T.InstancedMesh;index:number;matrix:T.Matrix4}[]=[];const m=new T.Matrix4();root.traverse(o=>{if(!(o instanceof T.InstancedMesh)||!o.name.includes('_dressing_'))return;for(let i=0;i<o.count;i++){o.getMatrixAt(i,m);if(Math.abs(m.elements[12]+45)>20||Math.abs(m.elements[14]+10)>14)continue;originals.push({mesh:o,index:i,matrix:m.clone()});o.setMatrixAt(i,new T.Matrix4().makeScale(0,0,0));}o.instanceMatrix.needsUpdate=true;});return()=>{for(const s of originals){s.mesh.setMatrixAt(s.index,s.matrix);s.mesh.instanceMatrix.needsUpdate=true;}};}
