// The conifer skyline: crossed cards painted once on a canvas (a spruce in layered jagged tiers), a
// dense band along the waterline and taller ones on the crests, instanced in 64 m bins, tinted per
// tree, swaying with the wind, in the planar reflection. Backlit at dawn they read as the black
// serrated tree line of the concept art; by day the tiers and the tint keep them from reading flat.
import {backlight,setBacklight} from './backlight.js';
import * as T from './vendor/three.module.js';
import {planTreeline} from './treeline-plan.js';
import {windSway,rng} from './botany.js';
import {noise} from './lake-shape.js';
function spruceTexture(){
 const W=128,H=256,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');const r=rng(31);
 g.clearRect(0,0,W,H);
 // trunk
 g.fillStyle='#2a1d14';g.fillRect(W/2-2.5,H*.55,5,H*.45);
 // tiers from the bottom up, each a jagged triangle narrower than the last
 const tiers=11;
 for(let i=0;i<tiers;i++){const t=i/(tiers-1);const yBase=H*(.98-.86*t),yTop=yBase-H*.16,half=W*.47*(1-t*.82)+3;
  const shade=.55+.45*r();g.fillStyle=`rgb(${Math.round(24+18*shade)},${Math.round(44+26*shade)},${Math.round(30+16*shade)})`;
  g.beginPath();g.moveTo(W/2,yTop);
  for(let k=0;k<=8;k++){const f=k/8;const x=W/2+half*f,y=yTop+(yBase-yTop)*f+(k%2?-3:3)*r();g.lineTo(x,y);}
  g.lineTo(W/2,yBase+4);for(let k=8;k>=0;k--){const f=k/8;const x=W/2-half*f,y=yTop+(yBase-yTop)*f+(k%2?-3:3)*r();g.lineTo(x,y);}
  g.closePath();g.fill();}
 // a pointed top
 g.fillStyle='#233a2b';g.beginPath();g.moveTo(W/2,H*.02);g.lineTo(W/2+6,H*.14);g.lineTo(W/2-6,H*.14);g.closePath();g.fill();
 const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=8;tex.wrapS=tex.wrapT=T.ClampToEdgeWrapping;return tex;
}
// two crossed unit planes, base at the origin, 1 tall and .38 wide before the instance scale
function cardGeometry(){const w=.38;const pos=[],uv=[],idx=[];const quad=(ax,az)=>{const b=pos.length/3;pos.push(-ax*w/2,0,-az*w/2, ax*w/2,0,az*w/2, ax*w/2,1,az*w/2, -ax*w/2,1,-az*w/2);uv.push(0,0,1,0,1,1,0,1);idx.push(b,b+1,b+2,b,b+2,b+3);};quad(1,0);quad(0,1);
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;}
export function makeTreeline(scene,bathy){
 const root=new T.Group();scene.add(root);const random=rng(9137);
 const plan=planTreeline({height:(x,z)=>bathy.height(x,z),shoreDistance:(x,z)=>bathy.shoreDistance(x,z),span:bathy.span,random,noise});
 const tex=spruceTexture(),geo=cardGeometry();
 const mat=new T.MeshStandardMaterial({map:tex,alphaTest:.5,side:T.DoubleSide,vertexColors:true,roughness:.92,metalness:0,color:0xffffff});windSway(mat,.05);
 // backlit silhouettes come with windSway (botany.js); setSun feeds the shared uniforms for every swaying material at once
 const meshes=[];
 function bins(points,shadow){const map=new Map();for(const p of points){const k=Math.floor(p.x/64)+','+Math.floor(p.z/64);if(!map.has(k))map.set(k,[]);map.get(k).push(p);}
  for(const pts of map.values()){const mesh=new T.InstancedMesh(geo,mat,pts.length),d=new T.Object3D();
   pts.forEach((p,i)=>{d.position.set(p.x,p.y,p.z);d.rotation.set(0,p.angle,0);d.scale.set(p.h,p.h,p.h);d.updateMatrix();mesh.setMatrixAt(i,d.matrix);mesh.setColorAt(i,new T.Color().setScalar(.62+p.tint*.45));});
   mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();mesh.castShadow=shadow;mesh.receiveShadow=false;mesh.userData.skipReflection=!shadow;root.add(mesh);meshes.push(mesh);}}
 bins(plan.shore,true);bins(plan.crest,false);
 const counts={shore:plan.shore.length,crest:plan.crest.length,bins:meshes.length};
 return {root,counts,setSun(dir,backlit){setBacklight(dir,backlit);},backlit:()=>backlight.amount.value,update(quality,camera){const reach=quality==='high'?520:quality==='medium'?400:300;for(const m of meshes){const c=m.boundingSphere.center,r=m.boundingSphere.radius;m.visible=Math.hypot(camera.x-c.x,camera.z-c.z)<reach+r;}}};
}
