import * as T from './vendor/three.module.js';
import {planVenueDressing} from './venue-dressing.js';
import {rockMaterial,barkMaterial} from './land-materials.js';
import {dressMaterial} from './venue-materials.js';

export function makeVenueScenery(root,course){
 const plan=planVenueDressing(course),group=new T.Group();group.userData.dynamic=true;root.add(group);
 const geos=[],mats=[],meshes=[],cold=course.theme==='ice',night=course.theme==='city';
 const material=m=>{mats.push(m);return m;};
 const stone=material(cold?dressMaterial(new T.MeshStandardMaterial({color:0xc1dbe0,roughness:.72}),'ice'):rockMaterial());
 const wood=material(barkMaterial()),leaf=material(new T.MeshStandardMaterial({color:course.theme==='lake'?0x647043:0x6b7835,roughness:.94,side:T.DoubleSide,vertexColors:true}));
 const metal=material(dressMaterial(new T.MeshStandardMaterial({color:0x414b4b,roughness:.64,metalness:.35}),'metal'));
 const lamp=material(new T.MeshStandardMaterial({color:0xd6d0a8,emissive:0xffc782,emissiveIntensity:night?2:.08,roughness:.4}));
 const dummy=new T.Object3D();
 function batch(g,m,rows,scale=(p)=>[p.scale,p.scale,p.scale],height=0){
  geos.push(g);if(!rows.length)return;
  const bins=new Map();for(const p of rows){const k=Math.floor(p.x/100)+','+Math.floor(p.z/100);if(!bins.has(k))bins.set(k,[]);bins.get(k).push(p);}
  for(const points of bins.values()){
   const mesh=new T.InstancedMesh(g,m,points.length);
   points.forEach((p,i)=>{dummy.position.set(p.x,p.y+height,p.z);dummy.rotation.set(0,p.angle,0);dummy.scale.fromArray(scale(p));dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);mesh.setColorAt(i,new T.Color().setScalar(.8+p.tint*.28));});
   mesh.computeBoundingSphere();mesh.castShadow=!cold&&m!==leaf;mesh.receiveShadow=true;group.add(mesh);meshes.push(mesh);
  }
 }
 const rock=new T.IcosahedronGeometry(1,1),rp=rock.attributes.position;
 for(let i=0;i<rp.count;i++){const x=rp.getX(i),y=rp.getY(i),z=rp.getZ(i),k=.85+.13*Math.sin(x*6+z*3)*Math.cos(y*7);rp.setXYZ(i,x*k,y*k*.75,z*k);}rock.computeVertexNormals();
 batch(rock,stone,plan.rocks,p=>[p.scale,p.scale*(cold?.9:.65),p.scale*.8],-.12);
 // Curved overlapping leaf blades form three-dimensional fern/grass clumps.
 function blades(reed=false){const positions=[],colors=[];for(let i=0;i<(reed?32:44);i++){
  const a=i*2.3999,r=(i%7)/7*.6,x=Math.cos(a)*r,z=Math.sin(a)*r,h=reed?1.4+(i%5)*.19:.32+(i%9)*.065,w=reed?.018:.035;
  let last=[x,0,z];for(let j=1;j<=3;j++){const t=j/3,next=[x+Math.cos(a)*t*t*(reed?.15:.45),h*t,z+Math.sin(a)*t*t*(reed?.15:.45)],side=[-Math.sin(a)*w*(1-t*.75),Math.cos(a)*w*(1-t*.75)];
   const verts=[[last[0]-side[0],last[1],last[2]-side[1]],[last[0]+side[0],last[1],last[2]+side[1]],[next[0],next[1],next[2]]];
   for(const v of verts){positions.push(...v);const shade=.55+.35*t+(i%3)*.05;colors.push(shade,shade,shade);}last=next;
  }
 }const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.computeVertexNormals();return g;}
 batch(blades(),leaf,plan.plants);batch(blades(true),leaf,plan.reeds);
 const log=new T.CylinderGeometry(.19,.30,3.7,9);log.rotateZ(Math.PI/2);batch(log,wood,plan.logs,p=>[p.scale,p.scale,p.scale],.14);
 const post=new T.CylinderGeometry(.18,.27,.8,10);batch(post,metal,plan.bollards,p=>[1,1,1],.4);
 const cap=new T.SphereGeometry(.25,8,5);cap.scale(1,.45,1);batch(cap,metal,plan.bollards,p=>[1,1,1],.80);
 const pole=new T.CylinderGeometry(.07,.10,5.5,7);batch(pole,metal,plan.lamps,p=>[1,1,1],2.75);
 batch(new T.BoxGeometry(.65,.22,.8),lamp,plan.lamps,p=>[1,1,1],5.5);
 root.userData.venueDressing=Object.fromEntries(Object.entries(plan).map(([k,v])=>[k,v.length]));
 return {update(camera,quality,secondCamera){if(!camera)return;const limit=quality==='low'?170:quality==='medium'?240:330;for(const m of meshes){const b=m.boundingSphere;m.visible=Math.hypot(camera.x-b.center.x,camera.z-b.center.z)<limit+b.radius||!!secondCamera&&Math.hypot(secondCamera.x-b.center.x,secondCamera.z-b.center.z)<limit+b.radius;}},dispose(){group.removeFromParent();for(const m of meshes)m.dispose();for(const g of geos)g.dispose();for(const m of mats)m.dispose();}};
}
