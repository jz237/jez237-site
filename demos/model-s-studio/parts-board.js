import * as THREE from 'three';

const colors={Body:'#b6c7dd',Glass:'#73c7e7',Wheels:'#bca5f5',Battery:'#edb870',Cabin:'#e1b885',Lighting:'#ffe49b',Trim:'#82cbb1'};
const order=Object.keys(colors);

/** A camera-facing, non-overlapping board of independently scaled 3D parts. */
export class PartsBoard {
 constructor(parts){
  this.group=new THREE.Group();this.group.name='All visual pieces';this.entries=[];this.bounds=new THREE.Box2();
  this.group.add(new THREE.AmbientLight('#ffffff',1.8));
  this.camera=new THREE.OrthographicCamera(-20,20,15,-15,.1,200);this.camera.position.set(0,0,80);this.camera.lookAt(0,0,0);
  for(const part of [...parts].sort((a,b)=>order.indexOf(a.group)-order.indexOf(b.group)||a.id-b.id)){
   // Bake the source transform so every cell has its own geometry orientation.
   part.mesh.updateWorldMatrix(true,false);
   const geometry=part.mesh.geometry.clone().applyMatrix4(part.mesh.matrixWorld);geometry.translate(-part.center.x,-part.center.y,-part.center.z);
   const box=new THREE.Box3().setFromBufferAttribute(geometry.attributes.position),size=box.getSize(new THREE.Vector3());
   if(size.x<=size.y&&size.x<=size.z)geometry.rotateY(Math.PI/2);
   else if(size.y<=size.z&&size.y<=size.x)geometry.rotateX(Math.PI/2);
   geometry.rotateX(.13);geometry.rotateY(-.18);geometry.computeBoundingBox();
   const dimensions=geometry.boundingBox.getSize(new THREE.Vector3()),center=geometry.boundingBox.getCenter(new THREE.Vector3());
   geometry.translate(-center.x,-center.y,-center.z);
   const material=part.mesh.material.clone();material.side=THREE.DoubleSide;material.transparent=false;material.opacity=1;material.depthWrite=true;material.metalness=Math.min(material.metalness,.5);material.roughness=Math.max(material.roughness,.4);
   const mesh=new THREE.Mesh(geometry,material);mesh.scale.setScalar(1.55/Math.max(dimensions.x,dimensions.y,.001));mesh.userData.part=part;
   // Inspection lighting lifts dark surfaces and shows both sides of thin panels.
   const tile=new THREE.Group();tile.add(mesh);this.group.add(tile);
   const plane=new THREE.Mesh(new THREE.PlaneGeometry(1.86,2.08),new THREE.MeshBasicMaterial({color:'#15212d',transparent:true,opacity:.72}));plane.position.z=-8;plane.userData.part=part;tile.add(plane);
   const canvas=document.createElement('canvas');canvas.width=256;canvas.height=48;const ctx=canvas.getContext('2d');
   ctx.fillStyle=colors[part.group];ctx.font='600 24px sans-serif';ctx.fillText(`${String(part.id+1).padStart(3,'0')}  ${part.group.toUpperCase()}`,9,31);
   const label=new THREE.Mesh(new THREE.PlaneGeometry(1.72,.32),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(canvas),transparent:true,depthWrite:false}));label.position.set(0,-.86,8);tile.add(label);
   mesh.position.y=.1;
   this.entries.push({part,tile,mesh,plane,box:new THREE.Box2()});
  }
  this.select(null);this.group.visible=false;
 }
 layout(width,height,predicate=()=>true){
  const visible=this.entries.filter(e=>predicate(e.part)),aspect=width/height;
  const cols=Math.max(1,Math.ceil(Math.sqrt(visible.length*aspect*1.12))),rows=Math.max(1,Math.ceil(visible.length/cols));
  this.bounds.set(new THREE.Vector2(-cols, -rows*1.12),new THREE.Vector2(cols,rows*1.12));
  for(const e of this.entries)e.tile.visible=false;
  visible.forEach((e,i)=>{const x=(i%cols-(cols-1)/2)*2,y=((rows-1)/2-Math.floor(i/cols))*2.24;e.tile.visible=true;e.tile.position.set(x,y,0);e.box.set(new THREE.Vector2(x-.93,y-1.04),new THREE.Vector2(x+.93,y+1.04));});
  this.visible=visible;this.width=width;this.height=height;this.fit();
 }
 fit(){
  const aspect=this.width/this.height,size=this.bounds.getSize(new THREE.Vector2()),halfHeight=Math.max(size.y/2,size.x/(2*aspect))*1.055+.1;
  this.camera.left=-halfHeight*aspect;this.camera.right=halfHeight*aspect;this.camera.top=halfHeight;this.camera.bottom=-halfHeight;this.camera.zoom=1;this.camera.position.set(0,0,80);this.camera.lookAt(0,0,0);this.camera.updateProjectionMatrix();this.camera.updateMatrixWorld();
 }
 select(part){for(const e of this.entries){
  const selected=e.part===part,mat=e.mesh.material;mat.color.copy(e.part.mesh.material.color);
  if(Math.max(mat.color.r,mat.color.g,mat.color.b)<.065)mat.color.setRGB(.065,.075,.09);
  mat.emissive.copy(selected?new THREE.Color('#49c8a3'):mat.color);mat.emissiveIntensity=selected?.45:.14;
  e.plane.material.color.set(selected?'#245649':'#15212d');
 }}
 /** Screen-space geometry bounds, used to prove every part is on screen and separated. */
 rectangles(){
  this.group.updateMatrixWorld(true);this.camera.updateMatrixWorld(true);
  return this.visible.map(e=>{const b=new THREE.Box3().setFromObject(e.mesh),min=[Infinity,Infinity],max=[-Infinity,-Infinity];
   for(let i=0;i<8;i++){const v=new THREE.Vector3(i&1?b.max.x:b.min.x,i&2?b.max.y:b.min.y,i&4?b.max.z:b.min.z).project(this.camera);min[0]=Math.min(min[0],v.x);min[1]=Math.min(min[1],v.y);max[0]=Math.max(max[0],v.x);max[1]=Math.max(max[1],v.y);}
   return {id:e.part.id,min,max};
  });
 }
}
