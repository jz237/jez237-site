import * as T from 'three';

/** Illustrative outlet stream: short threads separate into drops under gravity. */
export class FilterReturnWater extends T.Group{
 private drops:T.InstancedMesh;
 private threads:T.InstancedMesh;
 private dummy=new T.Object3D();
 private direction=new T.Vector3();
 private axis=new T.Vector3(0,1,0);
 constructor(){
  super();
  const material=new T.MeshPhysicalMaterial({color:0xb9e2e1,roughness:.12,metalness:.08,transparent:true,opacity:.34,depthWrite:false,clearcoat:1});
  this.drops=new T.InstancedMesh(new T.SphereGeometry(1,6,4),material,360);
  this.threads=new T.InstancedMesh(new T.CylinderGeometry(1,1,1,4),material,64);
  for(const mesh of [this.drops,this.threads]){mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.frustumCulled=false;mesh.renderOrder=3;this.add(mesh);}
  this.update(0);
 }
 update(time:number){
  const d=this.dummy;
  for(let i=0;i<360;i++){
   const a=i*2.399963,r=.245*Math.sqrt(((i*73)%359+.5)/360),age=(time*(.8+(i%7)*.035)+((Math.imul(i^0x45d9f3b,1597334677)>>>0)/4294967296))%1;
   const spread=1+age*.9;
   d.position.set(2.8+Math.cos(a)*r*spread+age*.33,3.695-age*.72-age*age*.38,Math.sin(a)*r*spread);
   const width=.0035+(i%5)*.0006,fade=Math.min(1,(1-age)*5);
   d.scale.set(width*fade,(.011+age*.018)*fade,width*fade);d.quaternion.identity();d.updateMatrix();this.drops.setMatrixAt(i,d.matrix);
  }
  for(let i=0;i<64;i++){
   const a=i*2.399963,r=.245*Math.sqrt((i+.5)/64),length=.11+.16*(.5+.5*Math.sin(time*5+i*1.71));
   this.direction.set(Math.cos(a)*.10+.12,-1,Math.sin(a)*.10).normalize();
   d.position.set(2.8+Math.cos(a)*r,3.696,Math.sin(a)*r).addScaledVector(this.direction,length*.5);
   d.quaternion.setFromUnitVectors(this.axis,this.direction);d.scale.set(.0018,length,.0018);d.updateMatrix();this.threads.setMatrixAt(i,d.matrix);
  }
  this.drops.instanceMatrix.needsUpdate=true;this.threads.instanceMatrix.needsUpdate=true;
 }
}
