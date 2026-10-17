import * as T from 'three';
import {SABLE} from './sable-course';
import {url} from './assets';
/** Reserved infield footprint, clear of the existing weigh-station approach. */
export function settlingWorksReserved(x:number,z:number,radius=0){return x>=-91-radius&&x<=-23+radius&&z>=-28-radius&&z<=31+radius;}
/** Original quarry water-treatment compound, outside the enclosed racing corridor. */
export function createSableSettlingWorks(){
 const root=new T.Group();root.name='sable-settling-works';
 const geometries={box:new T.BoxGeometry(1,1,1),pipe:new T.CylinderGeometry(.5,.5,1,12),tank:new T.CylinderGeometry(.5,.5,1,24)};
 const colors={concrete:0xa59b80,steel:0x485450,rust:0x84513a,cream:0xc0b189,dark:0x303834,water:0x536c57,ochre:0xb78b3d,glass:0x3b514e};
 type Finish=keyof typeof colors;type Shape=keyof typeof geometries;
 const materials=Object.fromEntries(Object.entries(colors).map(([k,color])=>[k,new T.MeshStandardMaterial({color,roughness:k==='water'?.23:k==='glass'?.3:.88,metalness:k==='steel'?.45:k==='water'?.25:0})])) as Record<Finish,T.MeshStandardMaterial>;
 const textures:T.Texture[]=[],extras:T.Mesh[]=[];
 if(typeof document!=='undefined')for(const [finish,file]of [['concrete','workyard/concrete_layers_02-diff'],['rust','workyard/rusty_painted_metal-diff']] as const){const t=new T.TextureLoader().load(url('assets/'+file+'.jpg'));t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(3,2);t.colorSpace=T.SRGBColorSpace;textures.push(t);materials[finish].map=t;}
 const batches=new Map<string,{shape:Shape;finish:Finish;matrices:T.Matrix4[]}>(),dummy=new T.Object3D();
 function part(shape:Shape,finish:Finish,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0){const key=shape+'-'+finish,b=batches.get(key)??{shape,finish,matrices:[]};dummy.position.set(x,y,z);dummy.rotation.set(rx,ry,rz);dummy.scale.set(w,h,d);dummy.updateMatrix();b.matrices.push(dummy.matrix.clone());batches.set(key,b);}
 const box=(f:Finish,x:number,y:number,z:number,w:number,h:number,d:number)=>part('box',f,x,y,z,w,h,d);
 function pipe(f:Finish,a:T.Vector3,b:T.Vector3,width:number){const delta=b.clone().sub(a),key='pipe-'+f,batch=batches.get(key)??{shape:'pipe' as Shape,finish:f,matrices:[]};const q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),delta.clone().normalize());batch.matrices.push(new T.Matrix4().compose(a.clone().add(b).multiplyScalar(.5),q,new T.Vector3(width,delta.length(),width)));batches.set(key,batch);}
 const bed=Math.max(...[-86,-24].flatMap(x=>[-26,29].map(z=>SABLE.height(x,z))))+.12;
 // Retained platform is sunk into the hillside; the equipment remains level.
 box('concrete',-55,bed-1.6,1.5,64,3.2,55);
 for(const cx of [-66,-40]){
  const floor=bed+.15;
  box('dark',cx,floor,0,20,.2,38);
  box('water',cx,floor+.3,0,18.7,.08,36.7);
  for(const x of [cx-10,cx+10])box('concrete',x,floor+.65,0,.65,1.5,39);
  for(const z of [-19,19])box('concrete',cx,floor+.65,z,20.6,1.5,.65);
  // Baffles split the stilling tank; lower overflow slots remain visible.
  for(const z of [-6,6]){box('concrete',cx,floor+.55,z,18.8,.75,.38);for(const x of [cx-6,cx,cx+6])box('dark',x,floor+.49,z-.2,1.2,.35,.06);}
  for(const z of [-12,0,12]){
   box('steel',cx,floor+1.15,z,21,.16,1.1);
   for(const side of [-.65,.65]){for(let x=cx-10;x<=cx+10;x+=2.5)box('ochre',x,floor+1.7,z+side,.07,1.2,.07);box('ochre',cx,floor+2.3,z+side,20,.07,.07);box('ochre',cx,floor+1.8,z+side,20,.06,.06);}
  }
  // Feed manifold, flanges and drop pipes make the water's route legible.
  pipe('rust',new T.Vector3(cx-8,floor+2.6,17),new T.Vector3(cx+8,floor+2.6,17),.55);
  for(const x of [cx-7,cx,cx+7]){pipe('steel',new T.Vector3(x,floor+2.6,17),new T.Vector3(x,floor+.4,17),.28);part('pipe','ochre',x,floor+2.6,17,.82,.12,.82,0,0,Math.PI/2);}
 }
 // Service building with corrugated roof, shutter, window and rooftop vent.
 const sx=-81,sz=23;box('cream',sx,bed+2,sz,9,4,10);box('rust',sx,bed+4.2,sz,10,.3,11);
 for(let x=sx-5;x<=sx+5;x+=.5)box('steel',x,bed+4.4,sz,.06,.12,11);
 box('dark',sx,bed+1.7,sz-5.05,4,3.3,.12);for(let y=.3;y<3.2;y+=.3)box('steel',sx,bed+y,sz-5.14,3.9,.055,.06);
 box('glass',sx+4.55,bed+2.4,sz, .08,1.5,4);for(const z of [sz-2,sz,sz+2])box('steel',sx+4.62,bed+2.4,z,.1,1.7,.07);
 part('pipe','steel',sx-2,bed+5,sz+2,1.2,1.6,1.2);part('tank','rust',sx-2,bed+5.9,sz+2,1.8,.2,1.8);
 // Paired pump skids, motor cooling fins, valves, and a header between tanks.
 for(const z of [-17,-2,13]){
  box('steel',-53,bed+.35,z,3.2,.3,3);part('pipe','cream',-53,bed+1,z,1.3,2.5,1.3,Math.PI/2);
  for(let dz=-.9;dz<=.9;dz+=.3)part('pipe','steel',-53,bed+1,z+dz,1.45,.06,1.45,Math.PI/2);
  pipe('rust',new T.Vector3(-53,bed+1,z-2),new T.Vector3(-53,bed+1,z-4),.35);
  part('tank','ochre',-53,bed+1.7,z-3,1.1,.1,1.1);box('steel',-53,bed+1.35,z-3,.1,.7,.1);
 }
 for(let i=0;i<5;i++)box('concrete',-26,bed+.12+i*.16,-24+i*.5,3,.22, .55);
 if(typeof document!=='undefined'){
  const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d')!;ctx.fillStyle='#b9ad89';ctx.fillRect(0,0,1024,256);ctx.fillStyle='#713e28';ctx.fillRect(0,0,1024,18);ctx.fillRect(0,238,1024,18);ctx.textAlign='center';ctx.fillStyle='#28352d';ctx.font='900 65px sans-serif';ctx.fillText('SABLE SETTLING WORKS',512,110,980);ctx.font='bold 34px sans-serif';ctx.fillText('WE LET THE DUST SETTLE. YOU SHOULD TOO.',512,185,980);
  const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;textures.push(texture);const sign=new T.Mesh(new T.PlaneGeometry(22,5.5),new T.MeshStandardMaterial({map:texture,roughness:.9,side:T.DoubleSide}));sign.position.set(-55,bed+5,-19.8);root.add(sign);extras.push(sign);
 }
 for(const x of [-66,-44])box('steel',x,bed+2.6,-20,.15,5.2,.15);
 for(const [key,b]of batches){const mesh=new T.InstancedMesh(geometries[b.shape],materials[b.finish],b.matrices.length);b.matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name='settling-'+key;mesh.castShadow=b.finish!=='water';mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});Object.values(geometries).forEach(g=>g.dispose());Object.values(materials).forEach(m=>m.dispose());extras.forEach(m=>{m.geometry.dispose();(m.material as T.Material).dispose();});textures.forEach(t=>t.dispose());root.clear();}};
}
