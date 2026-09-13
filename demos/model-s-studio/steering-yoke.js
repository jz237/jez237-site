import * as THREE from 'three';

// Independently modeled from the silhouette in Tesla's Model S manual.
// Local +Z faces the driver; this basis follows the source steering column.
const origin=new THREE.Vector3(.376,.922,.411);
const basis=new THREE.Matrix4().makeBasis(new THREE.Vector3(-1,0,0),new THREE.Vector3(0,.9624,.2715),new THREE.Vector3(0,.2715,-.9624));
const rotation=new THREE.Quaternion().setFromRotationMatrix(basis).normalize();

// The source combines the yoke and other cabin surfaces in material meshes.
// Remove only triangles inside the old yoke envelope, retaining the column.
function replaceOldFaces(model){
 const inverse=new THREE.Matrix4().compose(origin,rotation,new THREE.Vector3(1,1,1)).invert();let removed=0;
 const p=new THREE.Vector3(),center=new THREE.Vector3();
 model.updateMatrixWorld(true);
 model.traverse(mesh=>{
  if(!mesh.isMesh||mesh.isInstancedMesh)return;const g=mesh.geometry,position=g.attributes.position,index=g.index,keep=[],count=index?index.count:position.count;let cut=0;
  for(let i=0;i<count;i+=3){center.set(0,0,0);for(let j=0;j<3;j++){p.fromBufferAttribute(position,index?index.getX(i+j):i+j).applyMatrix4(mesh.matrixWorld).applyMatrix4(inverse);center.add(p);}center.multiplyScalar(1/3);
   if(Math.abs(center.x)<.208&&center.y>-.145&&center.y<.112&&center.z>-.038&&center.z<.075){cut++;continue;}
   for(let j=0;j<3;j++)keep.push(index?index.getX(i+j):i+j);
  }
  if(cut){g.setIndex(keep);g.clearGroups();g.setDrawRange(0,keep.length);removed+=cut;if(!keep.length)mesh.visible=false;}
 });return removed;
}
function shapeMesh(shape,depth,material,bevel=.003){const g=new THREE.ExtrudeGeometry(shape,{depth,steps:1,bevelEnabled:true,bevelSegments:6,bevelSize:bevel,bevelThickness:bevel,curveSegments:24});g.computeVertexNormals();return new THREE.Mesh(g,material);}
function rimGeometry(curve){
 const positions=[],indices=[],uv=[],segments=180,sides=24;
 for(let i=0;i<=segments;i++){const t=i/segments,p=curve.getPoint(t),tangent=curve.getTangent(t).normalize(),side=new THREE.Vector3(tangent.y,-tangent.x,0).normalize(),grip=Math.pow(Math.abs(t-.5)*2,1.7),width=.0115+.006*grip,depth=.016+.003*grip;
  for(let j=0;j<=sides;j++){const a=j/sides*Math.PI*2,v=p.clone().addScaledVector(side,Math.cos(a)*width);v.z+=Math.sin(a)*depth;positions.push(...v.toArray());uv.push(t*12,j/sides);if(i<segments&&j<sides){const k=i*(sides+1)+j;indices.push(k,k+sides+1,k+1,k+1,k+sides+1,k+sides+2);}}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;
}
function roundedPanel(x,y,w,h,r){const s=new THREE.Shape();s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;}

export function installSteeringYoke(model){
 const removedTriangles=replaceOldFaces(model),group=new THREE.Group();group.name='Refined Model S steering yoke';group.position.copy(origin);group.quaternion.copy(rotation);
 const leather=new THREE.MeshPhysicalMaterial({color:'#181b1e',roughness:.7,metalness:0,sheen:.18,sheenColor:new THREE.Color('#6c747a'),sheenRoughness:.85,envMapIntensity:.45});
 const plastic=new THREE.MeshStandardMaterial({color:'#111519',roughness:.5,metalness:.12});
 const trim=new THREE.MeshStandardMaterial({color:'#717b83',roughness:.3,metalness:.85});
 const controls=new THREE.MeshStandardMaterial({color:'#151a1f',roughness:.42,metalness:.12});
 const path=[[-.165,.057],[-.173,.028],[-.175,-.024],[-.168,-.078],[-.15,-.101],[-.103,-.113],[0,-.117],[.103,-.113],[.15,-.101],[.168,-.078],[.175,-.024],[.173,.028],[.165,.057]].map(([x,y])=>new THREE.Vector3(x,y,0));
 const curve=new THREE.CatmullRomCurve3(path,false,'centripetal');group.add(new THREE.Mesh(rimGeometry(curve),leather));
 for(const p of [path[0],path.at(-1)]){const cap=new THREE.Mesh(new THREE.SphereGeometry(1,32,20),leather);cap.scale.set(.0175,.0175,.019);cap.position.copy(p);group.add(cap);}
 const spoke=new THREE.Shape();spoke.moveTo(-.167,.052);spoke.bezierCurveTo(-.148,.062,-.097,.08,-.068,.082);spoke.quadraticCurveTo(0,.098,.068,.082);spoke.bezierCurveTo(.097,.08,.148,.062,.167,.052);spoke.quadraticCurveTo(.166,.025,.151,.005);spoke.lineTo(.074,-.001);spoke.lineTo(.031,-.106);spoke.quadraticCurveTo(0,-.113,-.031,-.106);spoke.lineTo(-.074,-.001);spoke.lineTo(-.151,.005);spoke.quadraticCurveTo(-.166,.025,-.167,.052);
 const back=shapeMesh(spoke,.02,plastic,.004);back.position.z=-.014;group.add(back);
 const pad=new THREE.Shape();pad.moveTo(-.061,.07);pad.bezierCurveTo(-.048,.084,.048,.084,.061,.07);pad.bezierCurveTo(.069,.062,.057,.001,.043,-.027);pad.quadraticCurveTo(.035,-.041,0,-.042);pad.quadraticCurveTo(-.035,-.041,-.043,-.027);pad.bezierCurveTo(-.057,.001,-.069,.062,-.061,.07);
 const center=shapeMesh(pad,.025,leather,.006);center.position.z=.004;group.add(center);
 const accent=new THREE.CatmullRomCurve3([[-.149,.003],[-.112,.002],[-.075,-.002],[-.054,-.052],[-.029,-.107],[0,-.112],[.029,-.107],[.054,-.052],[.075,-.002],[.112,.002],[.149,.003]].map(([x,y])=>new THREE.Vector3(x,y,.011)),false,'centripetal');group.add(new THREE.Mesh(new THREE.TubeGeometry(accent,120,.0012,8,false),trim));
 for(const side of [-1,1]){
  const panel=shapeMesh(roundedPanel(side*.117-.035,.011,.07,.047,.009),.004,controls,.0015);panel.position.z=.011;group.add(panel);
  const scroll=new THREE.Mesh(new THREE.CylinderGeometry(.0075,.0075,.013,40),plastic);scroll.rotation.z=Math.PI/2;scroll.position.set(side*.108,.033,.024);group.add(scroll);
  for(let i=-4;i<=4;i++){const ridge=new THREE.Mesh(new THREE.TorusGeometry(.00755,.00035,6,32),trim);ridge.rotation.y=Math.PI/2;ridge.position.set(side*.108+i*.0013,.033,.024);group.add(ridge);}
 }
 const mark=(draw,w,h,x,y,z)=>{const c=document.createElement('canvas');c.width=1024;c.height=256;draw(c.getContext('2d'));const map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}));m.position.set(x,y,z);group.add(m);};
 mark(c=>{c.fillStyle='#51575b';c.font='500 103px Arial';c.textAlign='center';c.fillText('T E S L A',512,163);},.068,.017,0,.029,.0352);
 for(const side of [-1,1])mark(c=>{c.strokeStyle='#bcc5ca';c.fillStyle='#bcc5ca';c.lineWidth=5;c.lineCap='round';c.lineJoin='round';
  if(side<0){for(const [x,d] of [[155,-1],[870,1]]){c.beginPath();c.moveTo(x-d*45,64);c.lineTo(x+d*22,64);c.lineTo(x,43);c.moveTo(x+d*22,64);c.lineTo(x,85);c.stroke();}c.beginPath();c.arc(160,187,24,-Math.PI/2,Math.PI/2);c.lineTo(160,163);c.stroke();for(const y of [167,187,207]){c.beginPath();c.moveTo(120,y);c.lineTo(142,y);c.stroke();}}
  else{c.beginPath();c.roundRect(135,40,30,48,14);c.stroke();c.beginPath();c.arc(150,69,28,0,Math.PI);c.moveTo(150,97);c.lineTo(150,112);c.stroke();c.beginPath();c.arc(850,90,40,Math.PI*1.15,Math.PI*1.85);c.moveTo(850,90);c.lineTo(870,63);c.stroke();c.beginPath();c.moveTo(830,185);c.lineTo(850,173);c.lineTo(873,173);c.lineTo(873,209);c.lineTo(850,209);c.closePath();c.stroke();}
 },.064,.031,side*.117,.034,.019);
 group.traverse(mesh=>{if(mesh.isMesh){mesh.castShadow=true;mesh.receiveShadow=true;}});model.add(group);
 return {removedTriangles,rimSegments:180,scrollWheels:2};
}
