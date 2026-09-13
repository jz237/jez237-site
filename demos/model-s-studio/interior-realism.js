import * as THREE from 'three';

// Small, repeatable material textures; no additional image downloads.
function pattern(draw,size=512){const c=document.createElement('canvas');c.width=c.height=size;draw(c.getContext('2d'),size);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;return t;}
let seed=237;const rand=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
const leather=pattern((c,s)=>{c.fillStyle='#b2b2b2';c.fillRect(0,0,s,s);for(let i=0;i<28000;i++){const v=100+rand()*90;c.fillStyle=`rgb(${v} ${v} ${v})`;c.beginPath();c.ellipse(rand()*s,rand()*s,.4+rand()*1.3,.3+rand(),rand()*Math.PI,0,Math.PI*2);c.fill();}});
const perforated=pattern((c,s)=>{c.drawImage(leather.image,0,0);for(let y=8;y<s;y+=16)for(let x=8;x<s;x+=16){c.fillStyle='#666';c.beginPath();c.arc(x+(y%32?0:8),y,2.1,0,Math.PI*2);c.fill();c.fillStyle='#292929';c.beginPath();c.arc(x+(y%32?0:8),y-.5,1.2,0,Math.PI*2);c.fill();}});
const fabric=pattern((c,s)=>{c.fillStyle='#aaa';c.fillRect(0,0,s,s);for(let i=0;i<45000;i++){const v=75+rand()*120;c.strokeStyle=`rgb(${v} ${v} ${v})`;c.beginPath();const x=rand()*s,y=rand()*s;c.moveTo(x,y);c.lineTo(x+rand()*4,y+rand()*3);c.stroke();}});
const brushed=pattern((c,s)=>{c.fillStyle='#bcbcbc';c.fillRect(0,0,s,s);for(let y=0;y<s;y++){const v=140+rand()*75;c.strokeStyle=`rgb(${v} ${v} ${v})`;c.beginPath();c.moveTo(0,y);c.lineTo(s,y);c.stroke();}});
const grille=pattern((c,s)=>{c.fillStyle='#a4a4a4';c.fillRect(0,0,s,s);for(let y=0;y<s;y+=12)for(let x=0;x<s;x+=12){c.fillStyle='#121212';c.beginPath();c.arc(x+(y%24?6:0),y,3.3,0,Math.PI*2);c.fill();}});
const carbon=pattern((c,s)=>{c.fillStyle='#777';c.fillRect(0,0,s,s);for(let y=0;y<s;y+=16)for(let x=0;x<s;x+=16){const vertical=(x/16+y/16)%2===0;c.fillStyle=vertical?'#aaa':'#666';c.fillRect(x,y,15,15);c.strokeStyle=vertical?'#858585':'#505050';for(let a=2;a<15;a+=3){c.beginPath();c.moveTo(x+(vertical?a:0),y+(vertical?0:a));c.lineTo(x+(vertical?a:15),y+(vertical?15:a));c.stroke();}}});

function surfaceUV(mesh,tile){const g=mesh.geometry,p=g.attributes.position,n=g.attributes.normal,uv=new Float32Array(p.count*2);for(let i=0;i<p.count;i++){const x=Math.abs(n.getX(i)),y=Math.abs(n.getY(i)),z=Math.abs(n.getZ(i));uv[i*2]=(x>y&&x>z?p.getZ(i):p.getX(i))/tile;uv[i*2+1]=(y>x&&y>z?p.getZ(i):p.getY(i))/tile;}g.setAttribute('uv',new THREE.BufferAttribute(uv,2));}
function softenUpholstery(mesh){
 const g=mesh.geometry,p=g.attributes.position,n=g.attributes.normal,buckets=new Map(),out=new Float32Array(n.count*3);
 for(let i=0;i<p.count;i++){const key=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*10000)).join(',');if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(i);}
 const a=new THREE.Vector3(),b=new THREE.Vector3(),sum=new THREE.Vector3();
 for(const indices of buckets.values())for(const i of indices){a.fromBufferAttribute(n,i);sum.set(0,0,0);for(const j of indices){b.fromBufferAttribute(n,j);if(a.dot(b)>.65)sum.add(b);}sum.normalize().toArray(out,i*3);}
 g.setAttribute('normal',new THREE.BufferAttribute(out,3));
}

export function refineInterior(model){
 let refined=0;const replaced=new Set();
 model.traverse(mesh=>{
  if(!mesh.isMesh)return;const name=mesh.userData.sourceMaterial||'',id=Number(mesh.name.split('_')[1]);let settings,tile=.09;
  if(id===23){settings={color:'#a1a9b1',roughness:.4,metalness:.85,bumpMap:brushed,bumpScale:.000035};tile=.1;
  }else if([68,84].includes(id)){settings={color:'#282b31',roughness:.3,metalness:.4,map:carbon,bumpMap:carbon,bumpScale:.00015,clearcoat:.55,clearcoatRoughness:.23};tile=.045;
  }else if(/Interior|koja/.test(name)){
   const seat=id>=50&&id<=63,center=id===50||id===51;
   if(seat)softenUpholstery(mesh);
   settings={color:center?'#39393b':seat?'#292a2d':'#25292d',roughness:seat?.82:.8,metalness:0,bumpMap:center?perforated:leather,bumpScale:center?.00032:.00018,map:center?perforated:null,sheen:.12,sheenColor:new THREE.Color('#58616b'),sheenRoughness:.8};
   if(center)tile=.0768;
  }else if(/carpet|alc__/.test(name)){tile=.055;settings={color:/carpet/.test(name)?'#202228':'#34363a',roughness:1,metalness:0,bumpMap:fabric,bumpScale:.00065,sheen:.45,sheenColor:new THREE.Color('#89929b'),sheenRoughness:1};
  }else if(/speakers/.test(name)){tile=.055;settings={color:'#3a4148',roughness:.46,metalness:.65,bumpMap:grille,bumpScale:.0006,map:grille};
  }else if(/Stitch/.test(name)){settings={color:'#3c4346',roughness:.82,metalness:0,bumpMap:fabric,bumpScale:.00012};tile=.03;
  }else if(/27__/.test(name)&&[34,35,36,37,48].includes(id)){settings={color:'#89949d',roughness:.32,metalness:.88,bumpMap:brushed,bumpScale:.000025};tile=.12;
  }
  if(settings){surfaceUV(mesh,tile);const old=mesh.material;mesh.material=new THREE.MeshPhysicalMaterial({envMapIntensity:.55,...settings});replaced.add(old);mesh.userData.refinedInterior=true;refined++;}
 });
 const used=new Set();model.traverse(mesh=>{if(mesh.isMesh)used.add(mesh.material);});for(const material of replaced)if(!used.has(material))material.dispose();
 return refined;
}

// Surface-following decorative stitches. Rays attach each dash to the existing
// seat shell, preserving its shape instead of floating a straight line above it.
export function interiorDetails(model){
 const group=new THREE.Group();group.name='Cabin finish details';
 const thread=new THREE.MeshStandardMaterial({color:'#8b8b80',roughness:.93});
 const dash=new THREE.CylinderGeometry(.00055,.00055,.0023,4),matrix=new THREE.Matrix4(),q=new THREE.Quaternion(),up=new THREE.Vector3(0,1,0),ray=new THREE.Raycaster();
 const points=[];
 for(const side of [-1,1]){
  const seat=model.getObjectByName(side===1?'Surface_051':'Surface_050');if(!seat)continue;
  for(const edge of [-1,1])for(let y=.62;y<1.085;y+=.0042){const x=side*.384+edge*.137;ray.set(new THREE.Vector3(x,y,.38),new THREE.Vector3(0,0,-1));const hit=ray.intersectObject(seat,false)[0];if(hit){const normal=hit.face.normal.clone().transformDirection(seat.matrixWorld);points.push({p:hit.point.clone().addScaledVector(normal,.001),direction:new THREE.Vector3(0,1,0)});}}
 }
 const armrest=model.getObjectByName('Surface_071');
 if(armrest)for(const x of [-.094,.094])for(let z=-.074;z<.22;z+=.0042){ray.set(new THREE.Vector3(x,1.1,z),new THREE.Vector3(0,-1,0));const hit=ray.intersectObject(armrest,false)[0];if(hit)points.push({p:hit.point.clone().add(new THREE.Vector3(0,.001,0)),direction:new THREE.Vector3(0,0,1)});}
 const pedals=model.getObjectByName('Surface_023'),grip=new THREE.MeshStandardMaterial({color:'#111519',roughness:.95});let grips=0;
 if(pedals)for(const [x,width,y0,y1] of [[.444,.073,.413,.478],[.28,.022,.409,.51]])for(let y=y0;y<y1;y+=.012){ray.set(new THREE.Vector3(x,y,.6),new THREE.Vector3(0,0,1));const hit=ray.intersectObject(pedals,false)[0];if(hit){const n=hit.face.normal.clone().transformDirection(pedals.matrixWorld);const strip=new THREE.Mesh(new THREE.BoxGeometry(width,.0038,.0018),grip);strip.position.copy(hit.point).addScaledVector(n,.0015);strip.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),n);group.add(strip);grips++;}}
 const stitches=new THREE.InstancedMesh(dash,thread,points.length);points.forEach(({p,direction},i)=>{q.setFromUnitVectors(up,direction);matrix.compose(p,q,new THREE.Vector3(1,1,1));stitches.setMatrixAt(i,matrix);});stitches.instanceMatrix.needsUpdate=true;group.add(stitches);
 model.add(group);return {group,stitches:points.length,grips};
}
