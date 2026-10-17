import * as T from 'three';
import {BRACKEN} from './bracken-course';
/** Unreachable wooded ridges frame the club circuit without altering its physics. */
export function createBrackenWoodland(){
 const root=new T.Group();root.name='bracken_woodland';
 let seed=37021;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 const crown=new T.IcosahedronGeometry(1,1),trunk=new T.CylinderGeometry(.45,.7,1,5),ridge=new T.IcosahedronGeometry(1,2);
 // Shared uneven ridge silhouette, with lighter exposed upper facets.
 const rp=ridge.attributes.position;const colors:number[]=[];
 for(let i=0;i<rp.count;i++){const x=rp.getX(i),y=rp.getY(i),z=rp.getZ(i),r=1+.07*Math.sin(x*12+z*9)+.04*Math.cos(z*17-y*11);rp.setXYZ(i,x*r,y*r,z*r);const c=new T.Color(y>.45?0x7e8666:0x536a4f).multiplyScalar(.9+random()*.18);colors.push(c.r,c.g,c.b);}
 ridge.setAttribute('color',new T.Float32BufferAttribute(colors,3));ridge.computeVertexNormals();
 const foliage=new T.MeshStandardMaterial({roughness:1}),wood=new T.MeshStandardMaterial({color:0x655342,roughness:1}),rock=new T.MeshStandardMaterial({vertexColors:true,roughness:1,flatShading:true});
 const treePlaces:{x:number;y:number;z:number;radius:number;height:number}[]=[];
 // Keep the southern paddock open; the forest wraps the other three sides.
 for(let i=0;i<280;i++){
  const angle=random()*Math.PI*2,x=Math.cos(angle)*(197+random()*53),z=Math.sin(angle)*(157+random()*43);
  if(z< -120&&Math.abs(x)<155)continue;
  const h=8+random()*12,r=3+random()*2.5;
  if(Math.abs(x)-r*1.5<178&&Math.abs(z)-r*1.5<138)continue;
  // Apron ground uses corner interpolation, not the track's clamped sampler.
  const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
  let y:number;
  if(Math.abs(x)>180){const a=x<0?-290:180,b=x<0?-180:290,t=(x-a)/(b-a),u=(z+230)/460;y=mix(mix(BRACKEN.height(a,-230),BRACKEN.height(b,-230),t),mix(BRACKEN.height(a,230),BRACKEN.height(b,230),t),u);}
  else{const a=z<0?-230:140,b=z<0?-140:230,t=(x+180)/360,u=(z-a)/(b-a);y=mix(mix(BRACKEN.height(-180,a),BRACKEN.height(180,a),t),mix(BRACKEN.height(-180,b),BRACKEN.height(180,b),t),u);}
  treePlaces.push({x,y,z,radius:r*1.5,height:h});
 }
 const trunks=new T.InstancedMesh(trunk,wood,treePlaces.length),crowns=new T.InstancedMesh(crown,foliage,treePlaces.length*3),obj=new T.Object3D();trunks.name='bracken_outer_trunks';crowns.name='bracken_outer_canopies';
 treePlaces.forEach((p,i)=>{obj.position.set(p.x,p.y+p.height*.38,p.z);obj.rotation.set(0,random()*6.28,0);obj.scale.set(1,p.height*.76,1);obj.updateMatrix();trunks.setMatrixAt(i,obj.matrix);
  for(let j=0;j<3;j++){const a=j*2.094+i*.7,r=p.radius/1.5;obj.position.set(p.x+Math.cos(a)*r*.45,p.y+p.height*(.58+j*.12),p.z+Math.sin(a)*r*.45);obj.rotation.set(random()*.3,a,random()*.2);obj.scale.set(r,r*(.85+random()*.5),r*.85);obj.updateMatrix();crowns.setMatrixAt(i*3+j,obj.matrix);crowns.setColorAt(i*3+j,new T.Color([0x456448,0x667a4b,0x73824e,0x395c46][i%4]).multiplyScalar(.85+random()*.3));}
 });
 const hills=new T.InstancedMesh(ridge,rock,13);hills.name='bracken_distant_ridges';const hillPlaces:{x:number;z:number;rx:number;rz:number}[]=[];
 for(let i=0;i<13;i++){const a=i/13*Math.PI*2,x=Math.cos(a)*410,z=Math.sin(a)*340,rx=82+random()*28,rz=65+random()*25,h=36+random()*55;obj.position.set(x,-h*.25,z);obj.rotation.set(0,a,0);obj.scale.set(rx,h,rz);obj.updateMatrix();hills.setMatrixAt(i,obj.matrix);hillPlaces.push({x,z,rx,rz});}
 for(const mesh of [trunks,crowns,hills]){mesh.computeBoundingSphere();mesh.receiveShadow=true;root.add(mesh);}trunks.castShadow=crowns.castShadow=true;
 root.userData.treePlaces=treePlaces;root.userData.hillPlaces=hillPlaces;
 let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();for(const mesh of [trunks,crowns,hills])mesh.dispose();for(const g of [crown,trunk,ridge])g.dispose();for(const m of [foliage,wood,rock])m.dispose();root.clear();}};
}
