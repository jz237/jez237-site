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
 const W=256,H=512,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');const r=rng(31);
 g.clearRect(0,0,W,H);
 // trunk
 g.fillStyle='#2a1d14';g.fillRect(W/2-4,H*.5,8,H*.5);
 // tiers from the bottom up: each a fan of drooping needle strokes, narrower and shorter toward the top, so the
 // silhouette is feathery rather than a stack of triangles
 const tiers=15;g.lineCap='round';
 for(let i=0;i<tiers;i++){const t=i/(tiers-1);const yBase=H*(.97-.86*t),half=W*.48*(1-t*.84)+4,droop=H*.05*(1-t*.5)+6;
  const shade=.5+.5*r();const col=`rgb(${Math.round(22+20*shade)},${Math.round(42+28*shade)},${Math.round(28+18*shade)})`;
  const strokes=Math.round(26*(1-t*.6)+8);
  for(let k=0;k<strokes;k++){const f=(k+.5)/strokes;const side=f<.5?-1:1;const u=Math.abs(f-.5)*2;const x0=W/2+side*u*half*.15,y0=yBase-droop*.9-H*.03*(1-u);const x1=W/2+side*(u*half+half*.06*r()),y1=yBase-droop*.9+droop*(.5+.6*u)+(r()-.5)*6;
   g.strokeStyle=col;g.lineWidth=2.2+r()*2.2;g.beginPath();g.moveTo(x0,y0);g.quadraticCurveTo((x0+x1)/2,y0+(y1-y0)*.25,x1,y1);g.stroke();
   // needle tufts along the branch
   for(let n=0;n<4;n++){const q=.3+n*.18;const bx=x0+(x1-x0)*q,by=y0+(y1-y0)*q;g.lineWidth=1.2+r();g.beginPath();g.moveTo(bx,by);g.lineTo(bx+side*(3+r()*5),by+5+r()*7);g.stroke();}}
 }
 // a pointed top
 g.fillStyle='#233a2b';g.beginPath();g.moveTo(W/2,H*.015);g.lineTo(W/2+9,H*.12);g.lineTo(W/2-9,H*.12);g.closePath();g.fill();
 const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=8;tex.wrapS=tex.wrapT=T.ClampToEdgeWrapping;return tex;
}
// two crossed unit planes, base at the origin, 1 tall and `w` wide before the instance scale
function cardGeometry(w=.38){const pos=[],uv=[],idx=[];const quad=(ax,az)=>{const b=pos.length/3;pos.push(-ax*w/2,0,-az*w/2, ax*w/2,0,az*w/2, ax*w/2,1,az*w/2, -ax*w/2,1,-az*w/2);uv.push(0,0,1,0,1,1,0,1);idx.push(b,b+1,b+2,b,b+2,b+3);};quad(1,0);quad(0,1);
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;}
// The skyline's three species are photographs: a white pine, a red spruce and a hemlock generated as
// isolated reference images and keyed off their white ground, 1024 px tall. Each has its own card
// width (the tree's real aspect); the painted spruce stands in until the photographs arrive.
// tone: the card's colour multiplier; the conifer photographs are pale blue-green in full sun and read frosty at one, the broadleaves are right near it
export const PHOTO_TREES=[{id:'pine',aspect:.45,tone:.6},{id:'spruce',aspect:.39,tone:.5},{id:'hemlock',aspect:.47,tone:.6}];
export const PHOTO_BROAD=[{id:'oak',aspect:.95,tone:.85},{id:'maple',aspect:.70,tone:.8}];
const kindCache=new Map();let photosLoaded=0;
// photographic kinds, built once per list and shared by the skyline and the shore: geometry per aspect, a material per species that carries the painted spruce until its photograph arrives
export function photoTreeKinds(base='./assets/trees/',list=PHOTO_TREES){
 const key=list.map(p=>p.id).join(',');if(kindCache.has(key))return kindCache.get(key);const tex=spruceTexture();
 const kinds=list.map(p=>{const geo=cardGeometry(p.aspect);const mat=new T.MeshStandardMaterial({map:tex,alphaTest:.5,side:T.DoubleSide,vertexColors:false,roughness:.92,metalness:0,color:0xffffff});mat.color.setScalar(p.tone??.85);windSway(mat,.05); /* vertexColors stays off: the card geometry has no colour attribute, and with it on WebGL fed the default (black) and zeroed the diffuse; instance colours still apply through USE_INSTANCING_COLOR. The photographs decode dark (overcast shade), so the colour multiplier lifts them a third */
  const sway=mat.onBeforeCompile;mat.onBeforeCompile=sh=>{sway(sh);sh.vertexShader=sh.vertexShader.replace('transformed*=farFade;','transformed*=farFade*smoothstep(28.,62.,length(cameraPosition.xz-anchor.xz));');};
  return {...p,geo,mat};});
 const loader=new T.TextureLoader();for(const k of kinds){loader.load(base+k.id+'.webp',t=>{t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;t.wrapS=t.wrapT=T.ClampToEdgeWrapping;k.mat.map=t;k.mat.needsUpdate=true;photosLoaded++;},undefined,()=>{});}
 kindCache.set(key,kinds);return kinds;}
export function photoTreesLoaded(){return photosLoaded;}
export function makeTreeline(scene,bathy,{base='./assets/trees/'}={}){
 const root=new T.Group();scene.add(root);const random=rng(9137);
 const plan=planTreeline({height:(x,z)=>bathy.height(x,z),shoreDistance:(x,z)=>bathy.shoreDistance(x,z),span:bathy.span,random,noise});
 const kinds=photoTreeKinds(base);const photos=()=>photosLoaded;
 const mat=kinds[0].mat,geo=kinds[0].geo;

 // backlit silhouettes come with windSway (botany.js); setSun feeds the shared uniforms for every swaying material at once
 const meshes=[];
 function bins(points,shadow){const map=new Map();for(const p of points){const k=Math.floor(p.x/64)+','+Math.floor(p.z/64);if(!map.has(k))map.set(k,[]);map.get(k).push(p);}
  for(const pts of map.values()){
   // each bin is one instanced mesh per species; a tree's species follows its index so the mix is even
   for(let s=0;s<kinds.length;s++){const sub=pts.filter((_,i)=>i%kinds.length===s);if(!sub.length)continue;const mesh=new T.InstancedMesh(kinds[s].geo,kinds[s].mat,sub.length),d=new T.Object3D();
    sub.forEach((p,i)=>{d.position.set(p.x,p.y,p.z);d.rotation.set(0,p.angle,0);d.scale.set(p.h,p.h,p.h);d.updateMatrix();mesh.setMatrixAt(i,d.matrix);mesh.setColorAt(i,new T.Color().setScalar(.62+p.tint*.45));});
    mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();mesh.castShadow=shadow;mesh.receiveShadow=false;mesh.userData.skipReflection=!shadow;root.add(mesh);meshes.push(mesh);}}}
 bins(plan.shore,true);bins(plan.crest,false);
 const counts={shore:plan.shore.length,crest:plan.crest.length,bins:meshes.length};
 return {root,counts,photos,setSun(dir,backlit){setBacklight(dir,backlit);},backlit:()=>backlight.amount.value,update(quality,camera){const reach=quality==='high'?520:quality==='medium'?400:300;for(const m of meshes){const c=m.boundingSphere.center,r=m.boundingSphere.radius;m.visible=Math.hypot(camera.x-c.x,camera.z-c.z)<reach+r;}}};
}
