import * as T from 'three';
import {fenwickLandscapeHeight} from './fenwick-landscape';
/** Rural boundary outside both racing layouts, with open service entrances. */
export function createFenwickBoundary(){
 const root=new T.Group();root.name='fenwick_boundary';
 let seed=81725;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 const positions:number[]=[],colors:number[]=[];
 // Overlapping leaf sprays retain a broken silhouette instead of solid hedge boxes.
 for(let i=0;i<64;i++){
  const a=random()*Math.PI*2,r=Math.sqrt(random()),x=Math.cos(a)*r,z=Math.sin(a)*r,y=.25+random()*1.45;
  for(let plane=0;plane<3;plane++){
   const angle=a+plane*Math.PI/3,dx=Math.cos(angle)*(.19+random()*.17),dz=Math.sin(angle)*(.19+random()*.17),h=.18+random()*.18;
   const c=new T.Color().setHSL(.20+random()*.07,.25+random()*.2,.17+random()*.13);
   for(const p of [[x-dx,y,z-dz],[x,y+h,z],[x+dx,y,z+dz],[x-dx,y,z-dz],[x+dx,y,z+dz],[x,y-h,z]]){positions.push(...p);colors.push(c.r,c.g,c.b);}
  }
 }
 const foliage=new T.BufferGeometry();foliage.setAttribute('position',new T.Float32BufferAttribute(positions,3));foliage.setAttribute('color',new T.Float32BufferAttribute(colors,3));foliage.computeVertexNormals();
 const leafMaterial=new T.MeshStandardMaterial({vertexColors:true,side:T.DoubleSide,roughness:1});
 const woodGeometry=new T.BoxGeometry(),woodMaterial=new T.MeshStandardMaterial({color:0x74654d,roughness:1});
 const leaves:T.Matrix4[]=[],wood:T.Matrix4[]=[],object=new T.Object3D();
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,yaw=0)=>{object.position.set(x,y,z);object.rotation.set(0,yaw,0);object.scale.set(w,h,d);object.updateMatrix();wood.push(object.matrix.clone());};
 function edge(ax:number,az:number,bx:number,bz:number){
  const length=Math.hypot(bx-ax,bz-az),steps=Math.ceil(length/4),yaw=Math.atan2(bx-ax,bz-az);
  for(let i=0;i<=steps;i++){
   const t=i/steps,x=ax+(bx-ax)*t,z=az+(bz-az)*t,y=fenwickLandscapeHeight(x,z);
   box(x,y+.9,z,.18,1.8,.18,yaw);
   if(i<steps){const next=(i+1)/steps,nx=ax+(bx-ax)*next,nz=az+(bz-az)*next,ny=fenwickLandscapeHeight(nx,nz);for(const h of [.65,1.25])box((x+nx)/2,(y+ny)/2+h,(z+nz)/2,.12,.16,length/steps+.12,yaw);}
   for(let j=0;j<2;j++){
    const px=x+Math.cos(yaw)*(1.1+random()*.8)+Math.sin(yaw)*(random()-.5)*3,pz=z-Math.sin(yaw)*(1.1+random()*.8)+Math.cos(yaw)*(random()-.5)*3;
    object.position.set(px,fenwickLandscapeHeight(px,pz),pz);object.rotation.set(0,random()*Math.PI*2,0);object.scale.set(1.1+random()*.7,.75+random()*.65,1.1+random()*.7);object.updateMatrix();leaves.push(object.matrix.clone());
   }
  }
 }
 for(const side of [-1,1])edge(side*216,-116,side*216,116);
 // Deliberate central gaps serve the fairground access and wheel sightline.
 for(const z of [-186,186]){edge(-205,z,-42,z);edge(42,z,205,z);}
 for(const [name,geometry,material,rows]of [['fenwick_hedgerows',foliage,leafMaterial,leaves],['fenwick_field_fence',woodGeometry,woodMaterial,wood]]as const){const mesh=new T.InstancedMesh(geometry,material,rows.length);mesh.name=name;rows.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.computeBoundingSphere();mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);}
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});for(const r of [foliage,woodGeometry,leafMaterial,woodMaterial])r.dispose();root.clear();}};
}
