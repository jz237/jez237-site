import * as T from './vendor/three.module.js';

// Independently authored launch artwork for recovered, static shore contours.
// Only the horizontal outline comes from collision evidence. Vertical dimensions,
// deck, cabin and fittings are visual choices and never create collision surfaces.
export function makeSourceMooredCraft(parent,craft,materials){
 const root=new T.Group(),geometries=[];root.name=craft.id;
 const xs=craft.outline.map(p=>p[0]),zs=craft.outline.map(p=>p[1]);
 const minX=Math.min(...xs),maxX=Math.max(...xs),minZ=Math.min(...zs),maxZ=Math.max(...zs);
 const cx=(minX+maxX)/2,cz=(minZ+maxZ)/2,width=maxX-minX,length=maxZ-minZ;
 const outline=craft.outline.map(([x,z])=>[x-cx,z-cz]);root.position.set(cx,0,cz);parent.add(root);
 root.userData.sourceMooredCraft={id:craft.id,sourceStatic:true,sourceHeight:craft.sourceHeight,
  visualProfile:'authored launch; no collision deck or wave pose',lowerY:-1.1,deckY:.65};
 const add=(geometry,material,x=0,y=0,z=0)=>{geometries.push(geometry);const mesh=new T.Mesh(geometry,material);mesh.position.set(x,y,z);mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);return mesh;};
 const box=(x,y,z,w,h,d,m)=>add(new T.BoxGeometry(w,h,d),m,x,y,z);
 const roundedBox=(x,y,z,w,h,d,r,m)=>{const shape=new T.Shape(),a=w/2-r,b=h/2-r;
  shape.moveTo(-a,-b);shape.lineTo(a,-b);shape.lineTo(a,b);shape.lineTo(-a,b);shape.closePath();
  const geometry=new T.ExtrudeGeometry(shape,{depth:d-2*r,steps:1,bevelEnabled:true,bevelSize:r,bevelThickness:r,bevelSegments:5});
  geometry.translate(0,0,-(d-2*r)/2);return add(geometry,m,x,y,z);};
 const rod=(a,b,r,m)=>{const start=new T.Vector3(...a),end=new T.Vector3(...b),delta=end.clone().sub(start);
  const mesh=add(new T.CylinderGeometry(r,r,delta.length(),16),m);mesh.position.copy(start.add(end).multiplyScalar(.5));mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());return mesh;};
 const shape=new T.Shape();outline.forEach(([x,z],i)=>i?shape.lineTo(x,-z):shape.moveTo(x,-z));shape.closePath();
 // The lower hull tapers inward. Its widest station retains the measured shore
 // footprint; visual fittings never create a second collision boundary.
 const hull=new T.ExtrudeGeometry(shape,{depth:1.75,steps:8,bevelEnabled:false});hull.rotateX(-Math.PI/2);
 const positions=hull.attributes.position;
 for(let i=0;i<positions.count;i++){
  const y=positions.getY(i)-1.1,scale=y<0?1-.22*Math.pow(-y/1.1,2):1;
  positions.setXYZ(i,positions.getX(i)*scale,y,positions.getZ(i)*scale);
 }
 hull.computeVertexNormals();const hullMesh=add(hull,materials.hull);hullMesh.name='static-source-hull';
 const deck=new T.ShapeGeometry(shape,12);deck.rotateX(-Math.PI/2);add(deck,materials.deck,0,.662,0).name='static-source-deck';
 const span=z=>{const hits=[];for(let i=0;i<outline.length;i++){const a=outline[i],b=outline[(i+1)%outline.length];
  if((a[1]<=z&&b[1]>z)||(b[1]<=z&&a[1]>z))hits.push(a[0]+(b[0]-a[0])*(z-a[1])/(b[1]-a[1]));}
  return hits.length>=2?[Math.min(...hits),Math.max(...hits)]:null;};
 for(let z=-length/2+.35;z<length/2-.25;z+=.48){const bounds=span(z);if(bounds&&bounds[1]-bounds[0]>.4)box((bounds[0]+bounds[1])/2,.674,z,bounds[1]-bounds[0]-.2,.012,.016,materials.rubber);}
 const cabinZ=.4,cabinWidth=width*.69,cabinLength=length*.28;
 roundedBox(0,1.3,cabinZ,cabinWidth,1.28,cabinLength,.08,materials.cabin);
 roundedBox(0,1.98,cabinZ,cabinWidth+.22,.15,cabinLength+.35,.055,materials.cabin);
 box(0,1.6,cabinZ-cabinLength/2-.012,cabinWidth*.85,.53,.026,materials.glass);
 box(0,1.57,cabinZ+cabinLength/2+.012,cabinWidth*.76,.52,.026,materials.glass);
 for(const side of [-1,1]){
  box(side*(cabinWidth/2+.012),1.6,cabinZ,.026,.53,cabinLength*.85,materials.glass);
  for(const z of [-.3,.3])box(side*(cabinWidth/2+.03),1.6,cabinZ+z*cabinLength,.035,.56,.06,materials.cabin);
  for(const z of [-length*.21,length*.22]){
   const f=add(new T.CapsuleGeometry(.13,.48,6,16),materials.rubber,side*(width/2+.08),.3,z);f.rotation.z=side*.1;
   rod([side*(width/2-.06),.81,z],[side*(width/2+.08),.55,z],.018,materials.metal);
  }
 }
 for(let i=0;i<outline.length;i++){
  const a=outline[i],b=outline[(i+1)%outline.length],distance=Math.hypot(b[0]-a[0],b[1]-a[1]),posts=Math.ceil(distance/1.8);
  rod([a[0],.66,a[1]],[b[0],.66,b[1]],.065,materials.rubber);
  rod([a[0],1.3,a[1]],[b[0],1.3,b[1]],.026,materials.metal);
  for(let j=0;j<posts;j++){const f=j/posts,x=a[0]+(b[0]-a[0])*f,z=a[1]+(b[1]-a[1])*f;rod([x,.68,z],[x,1.3,z],.022,materials.metal);}
 }
 rod([0,2.06,cabinZ],[0,3.1,cabinZ],.025,materials.metal);
 rod([-.35,2.8,cabinZ],[.35,2.8,cabinZ],.018,materials.metal);
 let disposed=false;return {root,dispose(){if(disposed)return;disposed=true;parent.remove(root);for(const geometry of geometries)geometry.dispose();}};
}
