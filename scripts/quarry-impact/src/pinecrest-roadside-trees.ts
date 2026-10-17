import * as T from 'three';
import {createConiferSpray} from './conifer-spray';
import {PINECREST} from './pinecrest-course';
/** Branch-whorl conifers at the original roadside tree sites. */
export function createPinecrestRoadsideTrees(){
 const root=new T.Group();root.name='pinecrest_roadside_trees';
 const places:{x:number;z:number;y:number;height:number}[]=[];
 const add=(x:number,z:number)=>places.push({x,z,y:PINECREST.height(x,z),height:7.8+1.8*(.5+.5*Math.sin(x*12.31+z*7.17))});
 for(let x=-160;x<=160;x+=16)for(const z of [-155,143]){if(z<0&&Math.abs(x)<85)continue;add(x,z);}
 for(let z=-110;z<=115;z+=16)for(const x of [-165,165])add(x,z);
 const trunkGeometry=new T.CylinderGeometry(.13,.34,1,7),branchGeometry=new T.CylinderGeometry(.035,.09,1,5),foliageGeometry=createConiferSpray();
 const wood=new T.MeshStandardMaterial({color:0x66523c,roughness:1}),foliage=new T.MeshStandardMaterial({vertexColors:true,side:T.DoubleSide,roughness:1});
 const trunks=new T.InstancedMesh(trunkGeometry,wood,places.length),branches=new T.InstancedMesh(branchGeometry,wood,places.length*42),needles=new T.InstancedMesh(foliageGeometry,foliage,places.length*42);
 trunks.name='pinecrest_roadside_trunks';branches.name='pinecrest_roadside_branches';needles.name='pinecrest_roadside_needles';
 const obj=new T.Object3D(),up=new T.Vector3(0,1,0),start=new T.Vector3(),end=new T.Vector3();
 places.forEach((p,i)=>{
  obj.position.set(p.x,p.y+p.height*.5,p.z);obj.quaternion.identity();obj.scale.set(1,p.height,1);obj.updateMatrix();trunks.setMatrixAt(i,obj.matrix);
  for(let tier=0;tier<7;tier++)for(let arm=0;arm<6;arm++){
   const index=i*42+tier*6+arm,angle=arm*Math.PI/3+tier*.71+i*1.31,length=(2.55-tier*.31)*(.87+.13*Math.sin(i*3+arm*7+tier)),y=p.y+p.height*(.23+tier*.103);
   start.set(p.x,y,p.z);end.set(p.x+Math.cos(angle)*length,y-.16+length*.12,p.z+Math.sin(angle)*length);
   obj.position.copy(start).add(end).multiplyScalar(.5);obj.quaternion.setFromUnitVectors(up,end.clone().sub(start).normalize());obj.scale.set(1,start.distanceTo(end),1);obj.updateMatrix();branches.setMatrixAt(index,obj.matrix);
   obj.position.copy(start).lerp(end,.67).add(new T.Vector3(0,.18,0));obj.rotation.set(.05*Math.sin(i+arm),-angle,0);obj.scale.set(length*.68,.4+length*.18,.35+length*.16);obj.updateMatrix();needles.setMatrixAt(index,obj.matrix);
   needles.setColorAt(index,new T.Color([0x345344,0x496448,0x3d5d48,0x586f4c][i%4]).multiplyScalar(.84+tier*.035+(arm%3)*.035));
  }
 });
 for(const mesh of [trunks,branches,needles]){mesh.computeBoundingSphere();mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);}
 root.userData.treePlaces=places;
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();for(const mesh of [trunks,branches,needles])mesh.dispose();for(const g of [trunkGeometry,branchGeometry,foliageGeometry])g.dispose();wood.dispose();foliage.dispose();root.clear();}};
}
