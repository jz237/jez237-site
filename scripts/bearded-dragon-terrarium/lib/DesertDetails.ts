import * as THREE from 'three';
import {mulberry32} from './Textures';
import {groundHeight} from './Ground';

const noise=(x:number,y:number,z:number)=>Math.sin(x*37+z*19+y*63)*Math.sin(x*71-z*43+y*97);

/** An open-bottom stone arch with an actual chamber, extruded into the enclosure. */
export function archGeometry(width:number,height:number,openingWidth:number,openingHeight:number,depth:number,seed:number) {
  const shape=new THREE.Shape(),half=width/2,inner=openingWidth/2;
  shape.moveTo(-inner,0);shape.lineTo(-half,0);
  for(let i=0;i<=48;i++){const a=Math.PI-i/48*Math.PI,rough=1+.022*Math.sin(a*17+seed)+.012*Math.sin(a*31);shape.lineTo(Math.cos(a)*half*rough,Math.sin(a)*height*rough);}
  shape.lineTo(inner,0);
  for(let i=0;i<=48;i++){const a=i/48*Math.PI;shape.lineTo(Math.cos(a)*inner,Math.sin(a)*openingHeight);}
  const geo=new THREE.ExtrudeGeometry(shape,{depth,steps:12,bevelEnabled:true,bevelThickness:.004,bevelSize:.004,bevelSegments:2});
  const p=geo.attributes.position as THREE.BufferAttribute;
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),n=noise(x*2+seed,y*2,z*2)*.009,relief=.004*Math.sin(x*141+y*103+seed);p.setXYZ(i,x+n,y+Math.min(1,y/.02)*n*.55,z+n*.5+relief);}
  geo.computeVertexNormals();return geo;
}

export function cactus(x:number,z:number,height:number,radius:number,seed:number,flower=false) {
  const group=new THREE.Group(),rnd=mulberry32(seed),N=96,R=40,vertices:number[]=[],indices:number[]=[],spines:number[]=[];
  group.position.set(x,groundHeight(x,z),z);
  for(let j=0;j<=R;j++){const t=j/R,tip=Math.sqrt(Math.max(.006,1-Math.max(0,(t-.81)/.19)**2)),r=radius*tip*(.91+.09*Math.sin(t*4));for(let i=0;i<=N;i++){const a=i/N*Math.PI*2,rib=1+.14*Math.cos(a*12);vertices.push(Math.cos(a)*r*rib,t*height,Math.sin(a)*r*rib);}}
  for(let j=0;j<R;j++)for(let i=0;i<N;i++){const k=j*(N+1)+i;indices.push(k,k+1,k+N+1,k+1,k+N+2,k+N+1);}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setIndex(indices);geo.computeVertexNormals();
  const material=new THREE.MeshStandardMaterial({color:0x3e7150,roughness:.82});
  material.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vCactus;').replace('#include <begin_vertex>','#include <begin_vertex>\nvCactus=position;');s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vCactus;').replace('#include <color_fragment>','#include <color_fragment>\nfloat rib=cos(atan(vCactus.z,vCactus.x)*12.); diffuseColor.rgb*=.76+.24*rib;');};
  const mesh=new THREE.Mesh(geo,material);mesh.castShadow=mesh.receiveShadow=true;group.add(mesh);
  for(let j=1;j<19;j++)for(let k=0;k<12;k++){const t=j/20,a=k/12*Math.PI*2,r=radius*1.13*(t>.81?Math.sqrt(Math.max(.006,1-((t-.81)/.19)**2)):1),y=height*t;for(let s=0;s<5;s++){const b=a+(s-2)*.32,len=.005+rnd()*.004;spines.push(Math.cos(a)*r,y,Math.sin(a)*r,Math.cos(a)*r+Math.cos(b)*len,y+(s-2)*.002,Math.sin(a)*r+Math.sin(b)*len);}}
  const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(spines,3));group.add(new THREE.LineSegments(sg,new THREE.LineBasicMaterial({color:0xdad9b7,transparent:true,opacity:.85})));
  if(flower){const petals=new THREE.MeshStandardMaterial({color:0xbe5470,roughness:.78});for(let i=0;i<11;i++){const p=new THREE.Mesh(new THREE.SphereGeometry(.005,7,5),petals);p.position.set(Math.cos(i*2.4)*.011,height*.83,Math.sin(i*2.4)*.011);group.add(p);}}
  return group;
}

export function dryShrub(x:number,z:number,height:number,seed:number) {
  const group=new THREE.Group(),rnd=mulberry32(seed),material=new THREE.MeshStandardMaterial({color:0x8a8551,roughness:.91});
  group.position.set(x,groundHeight(x,z),z);
  for(let i=0;i<32;i++){
    const a=rnd()*Math.PI*2,h=height*(.44+rnd()*.56),spread=h*.42,path=new THREE.CatmullRomCurve3([new THREE.Vector3(),new THREE.Vector3(Math.cos(a)*spread*.4,h*.48,Math.sin(a)*spread*.4),new THREE.Vector3(Math.cos(a)*spread,h,Math.sin(a)*spread)]);
    const stem=new THREE.Mesh(new THREE.TubeGeometry(path,7,.0008,4,false),material);stem.castShadow=true;group.add(stem);
    for(let j=1;j<6;j++){const leaf=new THREE.Mesh(new THREE.ConeGeometry(.0028,.019,4),material);leaf.position.copy(path.getPoint(j/7));leaf.rotation.set(a+j,.6,a-j);group.add(leaf);}
  }
  return group;
}

/** Forked pale deadwood: separate geometry, not a log painted onto the back wall. */
export function driftwood(material:THREE.MeshStandardMaterial) {
  const meshes:THREE.Mesh[]=[],v=(x:number,y:number,z:number)=>new THREE.Vector3(x,y,z);
  material.color.set(0xbfb29e);material.roughness=.96;
  material.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
float value=dot(diffuseColor.rgb,vec3(.30,.59,.11));
diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.55,.47,.37)*(value*.48+.70),.08);`);};
  material.customProgramCacheKey=()=> 'sun-bleached-driftwood-v2';
  const branch=(points:THREE.Vector3[],r0:number,r1:number,seed:number)=>{
    const curve=new THREE.CatmullRomCurve3(points),N=90,S=24,frames=curve.computeFrenetFrames(N,false),verts:number[]=[],uv:number[]=[],idx:number[]=[];
    for(let i=0;i<=N;i++){const t=i/N,p=curve.getPoint(t),r=THREE.MathUtils.lerp(r0,r1,t)*(1+.12*Math.sin(t*17+seed));for(let j=0;j<=S;j++){const a=j/S*Math.PI*2,ridge=1+.085*Math.sin(a*13+t*3)+.045*Math.sin(a*23-t*8),q=p.clone().addScaledVector(frames.normals[i],Math.cos(a)*r*ridge).addScaledVector(frames.binormals[i],Math.sin(a)*r*ridge);verts.push(q.x,q.y,q.z);uv.push(j/S,t*3.2);}}
    for(let i=0;i<N;i++)for(let j=0;j<S;j++){const k=i*(S+1)+j;idx.push(k,k+1,k+S+1,k+1,k+S+2,k+S+1);}
    // Closed ends make the visible timber a solid collider, including the cut base.
    const start=verts.length/3,end=start+1;
    verts.push(points[0].x,points[0].y,points[0].z,points[points.length-1].x,points[points.length-1].y,points[points.length-1].z);uv.push(.5,0,.5,3.2);
    for(let j=0;j<S;j++){idx.push(start,j+1,j);const k=N*(S+1)+j;idx.push(end,k,k+1);}
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();
    const mesh=new THREE.Mesh(geo,material);mesh.castShadow=mesh.receiveShadow=true;mesh.name='branching-pale-driftwood';meshes.push(mesh);
    const tip=new THREE.ConeGeometry(r1,.032,9,1),positions=tip.attributes.position as THREE.BufferAttribute;
    for(let i=0;i<positions.count;i++)positions.setY(i,positions.getY(i)+.008*Math.sin(positions.getX(i)*341+positions.getZ(i)*221+seed));
    tip.computeVertexNormals();const cap=new THREE.Mesh(tip,material);cap.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),curve.getTangent(1));cap.position.copy(points[points.length-1]);cap.castShadow=cap.receiveShadow=true;meshes.push(cap);
  };
  branch([v(.33,.089,.153),v(.20,.171,.10),v(.08,.277,.01),v(-.070,.371,-.082),v(-.120,.507,-.108)],.046,.022,11);
  branch([v(.030,.315,-.02),v(.10,.376,-.075),v(.245,.402,-.094)],.033,.019,15);
  branch([v(-.041,.349,-.064),v(-.188,.435,-.092),v(-.227,.489,-.111)],.032,.012,16);
  branch([v(-.085,.402,-.082),v(-.035,.466,-.105),v(.029,.501,-.113)],.024,.010,17);
  branch([v(.132,.230,.049),v(.221,.120,.048),v(.352,.077,.061)],.031,.012,18);
  branch([v(.272,.122,.135),v(.395,.084,.176),v(.432,.076,.163)],.024,.008,19);
  return meshes;
}
