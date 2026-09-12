import * as THREE from 'three';

function texture(draw,size=256){const canvas=document.createElement('canvas');canvas.width=canvas.height=size;draw(canvas.getContext('2d'),size);const tex=new THREE.CanvasTexture(canvas);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.anisotropy=4;return tex;}
let seed=237;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
const grain=texture((c,s)=>{const data=c.createImageData(s,s);for(let i=0;i<data.data.length;i+=4){const v=100+random()*70;data.data.set([v,v,v,255],i);}c.putImageData(data,0,0);});
const weave=texture((c,s)=>{c.fillStyle='#444';c.fillRect(0,0,s,s);for(let y=0;y<s;y+=8)for(let x=0;x<s;x+=8){const even=(x/8+y/8)%2===0;c.fillStyle=even?'#777':'#333';c.fillRect(x,y,7,7);c.fillStyle=even?'#999':'#555';c.fillRect(x,y,even?1:7,even?7:1);}});
const rubber=texture((c,s)=>{c.fillStyle='#999';c.fillRect(0,0,s,s);c.strokeStyle='#333';c.lineWidth=5;for(let x=18;x<s;x+=55){c.beginPath();c.moveTo(x,0);c.lineTo(x,s);c.stroke();}c.lineWidth=2;for(let y=-s;y<s*2;y+=26){c.beginPath();c.moveTo(0,y);c.lineTo(s,y+70);c.stroke();}});

function projectedUV(mesh,materialName){
 const g=mesh.geometry;g.computeBoundingBox();const box=g.boundingBox,size=box.getSize(new THREE.Vector3()),p=g.attributes.position,uv=new Float32Array(p.count*2);
 const axes=size.x<size.y&&size.x<size.z?[2,1]:size.y<size.z?[0,2]:[0,1],mins=box.min.toArray(),dims=size.toArray();
 for(let i=0;i<p.count;i++){
  const v=[p.getX(i),p.getY(i),p.getZ(i)];
  if(/tires/.test(materialName)){const center=box.getCenter(new THREE.Vector3());uv[i*2]=(v[0]-mins[0])/Math.max(dims[0],.0001);uv[i*2+1]=Math.atan2(v[2]-center.z,v[1]-center.y)/(Math.PI*2)*10;}
  else{uv[i*2]=(v[axes[0]]-mins[axes[0]])/Math.max(dims[axes[0]],.0001)*4;uv[i*2+1]=(v[axes[1]]-mins[axes[1]])/Math.max(dims[axes[1]],.0001)*4;}
 }
 g.setAttribute('uv',new THREE.BufferAttribute(uv,2));
}
export function finishMaterial(mesh,part,paint){
 const name=part.material,group=part.group;let mat=mesh.material;
 if(group==='Body'){
  projectedUV(mesh,name);mat=new THREE.MeshPhysicalMaterial({color:paint,metalness:.88,roughness:.27,clearcoat:1,clearcoatRoughness:.14,envMapIntensity:.8,bumpMap:grain,bumpScale:.00005});
 }else if(group==='Glass'){
  mat=new THREE.MeshPhysicalMaterial({color:'#7d9ca8',metalness:0,roughness:.09,clearcoat:1,clearcoatRoughness:.04,transparent:true,opacity:.43,side:THREE.DoubleSide,depthWrite:false,envMapIntensity:1.2});
 }else if(/tires/.test(name)){
  projectedUV(mesh,name);mat=new THREE.MeshStandardMaterial({color:'#121519',roughness:.94,metalness:.01,bumpMap:rubber,bumpScale:.0012,envMapIntensity:.22});
 }else if(/Rims|ceramic_brake|gris__/.test(name)){
  projectedUV(mesh,name);mat=new THREE.MeshStandardMaterial({color:/Rims/.test(name)?'#8c97a3':'#595d65',metalness:.9,roughness:/Rims/.test(name)?.24:.46,bumpMap:grain,bumpScale:.00007,envMapIntensity:.85});
 }else if(/Interior|koja|alc__|carpet|Stitch|carbon/.test(name)){
  projectedUV(mesh,name);mat=new THREE.MeshStandardMaterial({color:/carbon/.test(name)?'#1a2025':/koja|Interior/.test(name)?'#272c30':'#171c21',roughness:/carbon/.test(name)?.42:.85,metalness:/carbon/.test(name)?.35:0,bumpMap:/carbon/.test(name)?weave:grain,bumpScale:/carbon/.test(name)?.0002:.0007,envMapIntensity:.4});
 }else if(/scrn|speedomet/.test(name)){
  mat.color.set('#061217');mat.emissive.set('#243d48');mat.emissiveIntensity=.3;mat.roughness=.18;mat.metalness=.12;
 }
 mesh.material=mat;
 return mat;
}
export function studioEnvironment(renderer){
 const room=new THREE.Scene();room.background=new THREE.Color('#181e27');
 const panel=(position,scale,intensity)=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(...scale),new THREE.MeshBasicMaterial({color:new THREE.Color(intensity,intensity,intensity),side:THREE.DoubleSide}));p.position.set(...position);p.lookAt(0,.7,0);room.add(p);};
 panel([0,5,0],[8,2],5);panel([-5,2,1],[1.3,7],3);panel([5,3,-2],[2,7],4);panel([0,2,-6],[7,1.1],2);panel([1,1,6],[4,1],1.2);
 const pmrem=new THREE.PMREMGenerator(renderer),target=pmrem.fromScene(room,.025);pmrem.dispose();room.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});return target.texture;
}
