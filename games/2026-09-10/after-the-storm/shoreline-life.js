import * as T from './vendor/three.module.js';
import {barkMaterial,rockMaterial} from './land-materials.js';
import {wave} from './simulation.js';
import {cloudMaterial} from './weather-light.js';
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export function retainedPool(depth,crest,bed,dt){return Math.max(0,Math.min(.19,Math.max(depth,crest-bed-.035))-.0025*Math.max(0,dt));}
export function shoreSites(course){
 if(['city','port','ice'].includes(course.theme))return [];
 const floor=course.renderGround||course.ground,sites=[];
 for(let z=-220;z<220;z+=9)for(let x=-220;x<220;x+=9){
  const y=floor(x,z),gx=(floor(x+1,z)-floor(x-1,z))*.5,gz=(floor(x,z+1)-floor(x,z-1))*.5,slope=Math.hypot(gx,gz);
  if(y<.06||y>1.65||slope>.7||slope<.025||Math.sin(x*1.7+z*3.1)<.25)continue;
  if(sites.some(p=>Math.hypot(p.x-x,p.z-z)<14))continue;
  sites.push({x,z,y,nx:gx/slope,nz:gz/slope,seed:Math.abs(Math.sin(x*23.7+z*17.1))});
 }
 return sites.sort((a,b)=>a.seed-b.seed).slice(0,48);
}
export function makeShorelineLife(root,course){
 const group=new T.Group();group.userData.dynamic=true;root.add(group);const sites=shoreSites(course),dummy=new T.Object3D(),up=new T.Vector3(0,1,0);
 const wood=barkMaterial();wood.color.setHex(0xc8be9f);const stone=rockMaterial(),weed=new T.MeshStandardMaterial({color:0x4d5130,roughness:.52,side:T.DoubleSide});
 const woodGeo=new T.CylinderGeometry(.7,1,1,7),rockGeo=new T.IcosahedronGeometry(1,1),weedGeo=new T.PlaneGeometry(.10,1,1,5);
 const logs=new T.InstancedMesh(woodGeo,wood,Math.max(1,sites.length*12)),rocks=new T.InstancedMesh(rockGeo,stone,Math.max(1,sites.length*18)),wrack=new T.InstancedMesh(weedGeo,weed,Math.max(1,sites.length*18));
 for(const m of [logs,rocks,wrack]){m.receiveShadow=true;group.add(m);cloudMaterial(m.material);}let nl=0,nr=0,nw=0;const pools=[];
 function branch(a,b,r){const delta=new T.Vector3(...b).sub(new T.Vector3(...a));dummy.position.fromArray(a).addScaledVector(delta,.5);dummy.quaternion.setFromUnitVectors(up,delta.clone().normalize());dummy.scale.set(r,delta.length(),r);dummy.updateMatrix();logs.setMatrixAt(nl++,dummy.matrix);}
 for(let i=0;i<sites.length;i++){
  const p=sites[i],angle=p.seed*6.28,dx=Math.cos(angle),dz=Math.sin(angle),floor=course.renderGround||course.ground;
  // Fallen salt-bleached timber has tapered branches, rather than box props.
  const a=[p.x-dx*1.5,p.y+.16,p.z-dz*1.5],b=[p.x+dx*1.5,p.y+.22,p.z+dz*1.5];branch(a,b,.18);
  for(let j=0;j<3;j++){const f=(j+1)/4,base=a.map((v,k)=>v+(b[k]-v)*f);branch(base,[base[0]+Math.cos(angle+j*1.9)*.8,base[1]+.12,base[2]+Math.sin(angle+j*1.9)*.8],.065);}
  // Exposed bank roots emerge on the dry/uphill side and follow the terrain.
  for(let j=0;j<4;j++){const x=p.x+p.nx*2,z=p.z+p.nz*2,tipX=x-p.nx*(1.4+j*.18)+p.nz*(j-1.5)*.4,tipZ=z-p.nz*(1.4+j*.18)-p.nx*(j-1.5)*.4;branch([x,floor(x,z)+.12,z],[tipX,floor(tipX,tipZ)+.035,tipZ],.055+j*.014);}
  for(let j=0;j<18;j++){const x=p.x+Math.cos(j*2.4)*(.5+j*.12),z=p.z+Math.sin(j*2.4)*(.5+j*.12),y=floor(x,z);dummy.position.set(x,y+.025,z);dummy.rotation.set(-Math.PI/2,0,j*2.4);dummy.scale.set(.6+p.seed, .45+(j%5)*.13,1);dummy.updateMatrix();wrack.setMatrixAt(nw++,dummy.matrix);}
  // Layered rock rims enclose a shallow basin; water remains visibly below its lip.
  if(i%3===0&&p.y<1.1){const x=p.x+p.nx*.8,z=p.z+p.nz*.8,bed=floor(x,z),radius=1.2+p.seed*.6;
   const outline=new T.Shape();
   for(let j=0;j<=28;j++){const a=(j%28)/28*Math.PI*2,r=radius*(1+.12*Math.sin(a*3+p.seed*6)+.08*Math.cos(a*5));const px=Math.cos(a)*r,pz=Math.sin(a)*r*.72;if(j===0)outline.moveTo(px,pz);else outline.lineTo(px,pz);}
   for(let j=0;j<16;j++){const a=j/16*Math.PI*2,r=radius*(1+.12*Math.sin(a*3+p.seed*6)+.08*Math.cos(a*5)),variation=.7+.45*Math.abs(Math.sin(j*5.3+p.seed));dummy.position.set(x+Math.cos(a)*r,bed+.045+variation*.04,z+Math.sin(a)*r*.72);dummy.rotation.set(.1*Math.sin(j),a+j*.31,.13*Math.cos(j));dummy.scale.set(.43*variation,.12*variation,.36*variation);dummy.updateMatrix();rocks.setMatrixAt(nr++,dummy.matrix);}
   const basin=new T.Mesh(new T.ShapeGeometry(outline),new T.MeshStandardMaterial({color:0x5e7771,roughness:.065,metalness:.2,transparent:true,opacity:.45,side:T.DoubleSide,depthWrite:false}));basin.rotation.x=-Math.PI/2;basin.position.set(x,bed+.04,z);basin.userData.skipRefraction=true;basin.visible=false;group.add(basin);cloudMaterial(basin.material);pools.push({mesh:basin,x,z,bed,depth:0});
  }
 }
 for(const [m,n] of [[logs,nl],[rocks,nr],[wrack,nw]]){m.count=n;m.instanceMatrix.needsUpdate=true;m.computeBoundingSphere();}
 root.userData.shorelineLife={sites:sites.length,roots:sites.length*4,driftwood:sites.length,seaweed:nw,pools:pools.length};let previous=null;
 return {update(t,storm,quality,camera){const dt=previous===null?0:clamp(t-previous,0,.2);previous=t;for(const p of pools){if(camera&&Math.hypot(camera.x-p.x,camera.z-p.z)>110)continue;p.depth=retainedPool(p.depth,wave(p.x,p.z,t,storm),p.bed,dt);p.mesh.visible=p.depth>.008;p.mesh.position.y=p.bed+.035+p.depth;p.mesh.material.opacity=.25+Math.min(1,p.depth/.12)*.25;}root.userData.shorelineLife.filledPools=pools.filter(p=>p.depth>.008).length;},dispose(){for(const p of pools){p.mesh.geometry.dispose();p.mesh.material.dispose();}for(const m of [logs,rocks,wrack]){m.geometry.dispose();m.material.dispose();}group.removeFromParent();}};
}
