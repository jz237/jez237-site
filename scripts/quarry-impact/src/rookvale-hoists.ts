import * as T from 'three';
/** Slow working-yard lifts. Decorative rigging stays high above racing space. */
export function createRookvaleHoists(){
 const root=new T.Group();root.name='rookvale_hoists';
 const geometry={box:new T.BoxGeometry(),cable:new T.CylinderGeometry(1,1,1,6),hook:new T.TorusGeometry(.38,.09,6,12)};
 const material=new T.MeshStandardMaterial({roughness:.85,metalness:.18}),object=new T.Object3D();
 const poses=[-1,1].flatMap(side=>[-85,85].map(z=>({x:side*194,z})));
 const rows:{shape:keyof typeof geometry;x:number;y:number;z:number;w:number;h:number;d:number;color:number;lift:number;cable?:boolean;rx?:number}[]=[];
 for(const [lift,p]of poses.entries()){
  const add=(shape:keyof typeof geometry,x:number,y:number,z:number,w:number,h:number,d:number,color:number,cable=false,rx=0)=>rows.push({shape,x:p.x+x,y,z:p.z+z,w,h,d,color,lift,cable,rx});
  add('cable',0,0,0,.045,1,.045,0x303b3b,true);add('hook',0,.5,0,1,1,1,0xbfa66a);
  add('box',0,-.05,0,3.8,.22,.35,0xc8a04e);
  for(const side of [-1,1]){add('cable',side*1.65,-.95,0,.035,1.6,.035,0x434c48);add('box',side*1.65,-1.8,0,.12,.16,3,0xaca58b);}
  // Strapped pallet load, readable as industrial cargo from the circuit.
  for(const z of [-1.25,0,1.25])add('box',0,-2,z,4,.2,.28,0x776047);
  for(let i=0;i<7;i++)add('box',-1.8+i*.6,-1.8,0,.5,.16,2.8,0x9c845b);
  for(const x of [-.95,.95])add('box',x,-1.15,0,1.75,1.1,2.4,0x7e725b);
  for(const x of [-1.65,1.65]){add('box',x,-.57,0,.12,.06,2.55,0x414943);for(const z of [-1.25,1.25])add('box',x,-1.2,z,.12,1.3,.06,0x414943);}
 }
 const batches=(Object.keys(geometry)as (keyof typeof geometry)[]).map(shape=>{
  const selected=rows.filter(r=>r.shape===shape),mesh=new T.InstancedMesh(geometry[shape],material,selected.length);mesh.name='rookvale_hoist_'+shape;mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);selected.forEach((r,i)=>mesh.setColorAt(i,new T.Color(r.color)));mesh.castShadow=mesh.receiveShadow=true;
  // Bounds cover both travel endpoints; no culling pop during replay seeking.
  mesh.boundingBox=new T.Box3(new T.Vector3(-197,8,-88),new T.Vector3(197,27,88));mesh.boundingSphere=mesh.boundingBox.getBoundingSphere(new T.Sphere());root.add(mesh);return{mesh,selected};
 });
 let disposed=false;
 function update(time:number){if(disposed||!Number.isFinite(time))return;for(const {mesh,selected}of batches){selected.forEach((r,i)=>{const height=15+3*Math.sin((time%48)/48*Math.PI*2+r.lift*Math.PI/2);object.position.set(r.x,r.cable?(26+height+1)/2:height+r.y,r.z);object.rotation.set(r.rx??0,0,0);object.scale.set(r.w,r.cable?26-height-1:r.h,r.d);object.updateMatrix();mesh.setMatrixAt(i,object.matrix);});mesh.instanceMatrix.needsUpdate=true;}}
 update(0);return{root,update,dispose(){if(disposed)return;disposed=true;root.removeFromParent();batches.forEach(b=>b.mesh.dispose());Object.values(geometry).forEach(g=>g.dispose());material.dispose();root.clear();}};
}
