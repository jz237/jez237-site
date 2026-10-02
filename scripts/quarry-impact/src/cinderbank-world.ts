import * as T from 'three';
import {CINDERBANK,CINDERBANK_SOLIDS} from './cinderbank-course';
import {freezeSceneryTransforms} from './render-work';

/** Bounded, original speedway scenery. One flat textured receiver avoids road
 * overlays/depth fighting; the analytical surface query also paints its grip. */
export function createCinderbankWorld(){
 const root=new T.Group();root.name='cinderbank_world';
 const width=1024,height=768,spanX=330,spanZ=220,pixels=new Uint8Array(width*height*4),road=new Uint8Array(width*height*4);
 let seed=31871;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 for(let row=0;row<height;row++)for(let column=0;column<width;column++){
  // DataTexture row0 is UV-v0, which faces positiveZ after the plane rotation.
  const x=(column+.5)/width*spanX-spanX/2,z=spanZ/2-(row+.5)/height*spanZ,d=CINDERBANK.distance(x,z),asphalt=CINDERBANK.surface(x,z)==='asphalt',infield=Math.hypot(Math.max(0,Math.abs(x)-60),z)<43,grain=(random()-.5)*12;
  let color=asphalt?[57,61,60]:d<15?[143,112,80]:infield?[112,112,73]:[122,112,89];
  if(d>11.65&&d<11.9&&Math.abs(x)<59.8)color=[210,201,167];
  if(Math.abs(x)<.8&&Math.abs(z+58)<11.3)color=(Math.floor((x+.8)*2)+Math.floor(z+70))%2?[218,211,181]:[40,43,42];
  // Grid paint stays on the start straight and does not imply grip elsewhere.
  if(x< -3&&x> -54&&Math.abs(Math.abs(z+58)-2.4)<1.05&&Math.abs(((x+3)%7+7)%7)<.32)color=[200,194,165];
  const i=(row*width+column)*4;for(let c=0;c<3;c++)pixels[i+c]=color[c]+grain;pixels[i+3]=255;road[i+3]=asphalt?255:0;
 }
 const map=new T.DataTexture(pixels,width,height);map.colorSpace=T.SRGBColorSpace;map.generateMipmaps=true;map.minFilter=T.LinearMipmapLinearFilter;map.magFilter=T.LinearFilter;map.anisotropy=8;map.needsUpdate=true;
 const groundMaterial=new T.MeshStandardMaterial({map,roughness:1}),groundGeometry=new T.PlaneGeometry(spanX,spanZ),ground=new T.Mesh(groundGeometry,groundMaterial);ground.name='cinderbank_ground';ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;root.add(ground);
 const materials={concrete:new T.MeshStandardMaterial({color:0xc1b8a0,roughness:.95}),stripe:new T.MeshStandardMaterial({color:0x965340,roughness:.91}),steel:new T.MeshStandardMaterial({color:0x3d4744,roughness:.74,metalness:.25}),roof:new T.MeshStandardMaterial({color:0x606859,roughness:.85}),earth:new T.MeshStandardMaterial({color:0x797259,roughness:1}),seat:new T.MeshStandardMaterial({color:0x8f613d,roughness:.9})};
 type Finish=keyof typeof materials;
 const batches=new Map<Finish,T.Matrix4[]>(),matrix=new T.Matrix4(),rotation=new T.Quaternion(),boxGeometry=new T.BoxGeometry(1,1,1);
 function box(x:number,y:number,z:number,w:number,h:number,d:number,material:Finish,yaw=0){rotation.setFromAxisAngle(new T.Vector3(0,1,0),yaw);matrix.compose(new T.Vector3(x,y,z),rotation,new T.Vector3(w,h,d));const instances=batches.get(material)??[];instances.push(matrix.clone());batches.set(material,instances);}
 for(const solid of CINDERBANK_SOLIDS)box(solid.x,solid.y,solid.z,solid.half[0]*2,solid.half[1]*2,solid.half[2]*2,solid.material,solid.yaw);
 // Low bleachers, a race-control cabin and tire-coloured paddock roofs sit
 // outside the continuous outer barrier, never hiding a drivable obstruction.
 for(const centre of [-38,38])for(let row=0;row<6;row++){
  const z=-85-row*1.65,top=.6+row*.55;box(centre,top/2,z,67,top,1.65,'concrete');
  for(let x=-30;x<=30;x+=2)box(centre+x,top+.23,z-.15,1.55,.18,.62,'seat');
 }
 box(0,7,-91,151,.25,18,'roof');for(const x of [-74,-37,0,37,74])for(const z of [-83,-99])box(x,3.5,z,.18,7,.18,'steel');
 box(-128,3.0,-48,13,6,17,'concrete');box(-128,6.2,-48,14,.35,18,'roof');box(-120.95,4.4,-48,.1,1.5,12,'steel');
 for(const x of [-42,0,42]){box(x,2.4,91,32,4.8,11,'concrete');box(x,5,91,33,.28,12,'roof');for(const dx of [-10,0,10])box(x+dx,1.8,85.46,7,3.6,.05,'steel');}
 // Four easy-to-read light towers stay behind the barrier. The infield remains
 // visually open, so both approaching lanes and the full turn remain visible.
 for(const x of [-78,78])for(const z of [-81,81]){box(x,6.5,z,.18,13,.18,'steel');box(x,13,z,4.5,.6,.65,'concrete');}
 const apronPositions:number[]=[];for(const [x0,x1,z0,z1]of [[-260,-165,-190,190],[165,260,-190,190],[-165,165,-190,-110],[-165,165,110,190]])apronPositions.push(x0,0,z0,x0,0,z1,x1,0,z1,x0,0,z0,x1,0,z1,x1,0,z0);
 const apronGeometry=new T.BufferGeometry();apronGeometry.setAttribute('position',new T.Float32BufferAttribute(apronPositions,3));apronGeometry.computeVertexNormals();const apron=new T.Mesh(apronGeometry,materials.earth);apron.name='cinderbank_outer_ground';apron.receiveShadow=true;root.add(apron);
 for(const [finish,instances]of batches){const mesh=new T.InstancedMesh(boxGeometry,materials[finish],instances.length);instances.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.name='cinderbank_'+finish;mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 const extras:T.Material[]=[],extraGeometry:T.BufferGeometry[]=[],textures:T.Texture[]=[map];
 if(typeof document!=='undefined'){
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=128;const ctx=canvas.getContext('2d');
  if(ctx){ctx.fillStyle='#433e31';ctx.fillRect(0,0,1024,128);ctx.fillStyle='#e6d9b4';ctx.font='bold 66px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('CINDERBANK SPEEDWAY',512,64,990);const signMap=new T.CanvasTexture(canvas);signMap.colorSpace=T.SRGBColorSpace;textures.push(signMap);const material=new T.MeshStandardMaterial({map:signMap,roughness:.9,side:T.DoubleSide}),geometry=new T.PlaneGeometry(44,5.5);extras.push(material);extraGeometry.push(geometry);const sign=new T.Mesh(geometry,material);sign.name='cinderbank_title';sign.position.set(0,8,-82.9);root.add(sign);}
 }
 root.userData.solidRecords=CINDERBANK_SOLIDS;freezeSceneryTransforms(root);let disposed=false;
 return{root,groundCoverage:{width,height,spanX,spanZ,road},dispose(){if(disposed)return;disposed=true;root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});for(const g of [groundGeometry,boxGeometry,apronGeometry,...extraGeometry])g.dispose();for(const m of [groundMaterial,...Object.values(materials),...extras])m.dispose();textures.forEach(t=>t.dispose());root.clear();}};
}
