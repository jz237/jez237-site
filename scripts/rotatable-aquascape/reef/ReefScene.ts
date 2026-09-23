import * as T from 'three';
import {limestoneMaps} from './ReefMaterials.ts';
import {branchingColony,platingColony} from './CoralMorphology.ts';
import {mergeVertices,mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

export type Obstacle={center:T.Vector3;radius:number};
export const reefClock={value:0};
export function seeded(seed:number){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
const random=seeded(81412),pick=(a:number,b:number)=>a+(b-a)*random();
function texture(kind:'rock'|'sand'|'coral'){
 const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d')!,im=ctx.createImageData(512,512);
 for(let y=0;y<512;y++)for(let x=0;x<512;x++){
  const i=(y*512+x)*4,n=random(),large=Math.sin(x*.027+Math.sin(y*.042))*Math.sin(y*.024),grain=n*.25;
  const base=kind==='sand'?[.88,.87,.80]:kind==='rock'?[.58,.54,.46]:[.96,.94,.92];
  const factor=kind==='rock'?.58+large*.3+grain:kind==='sand'?.78+grain:.72+grain;
  for(let k=0;k<3;k++)im.data[i+k]=255*base[k]*factor;im.data[i+3]=255;
 }
 ctx.putImageData(im,0,0);
 if(kind==='rock')for(let i=0;i<4100;i++){const x=random()*512,y=random()*512,r=pick(.4,5);ctx.fillStyle=i%3===0?'#634d6680':i%3===1?'#252d25a0':'#99916b60';ctx.beginPath();ctx.ellipse(x,y,r,r*.6,random()*6.28,0,6.28);ctx.fill();}
 if(kind==='coral')for(let i=0;i<2500;i++){
  const x=random()*512,y=random()*512,r=pick(.6,1.9);ctx.strokeStyle='#938d7a';ctx.lineWidth=pick(.35,.7);ctx.beginPath();ctx.ellipse(x,y,r,r*pick(.65,1),random()*6.28,0,6.28);ctx.stroke();
  ctx.fillStyle='#e9e2cb';ctx.beginPath();ctx.arc(x-r*.35,y-r*.7,r*.4,0,6.28);ctx.fill();
 }
 const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;return t;
}
function colored(g:T.BufferGeometry,color:T.Color,variation=.1){
 const p=g.getAttribute('position'),a=new Float32Array(p.count*3);
 for(let i=0;i<p.count;i++){const q=1+Math.sin(p.getX(i)*31+p.getY(i)*19+p.getZ(i)*23)*variation*.5;a[i*3]=color.r*q;a[i*3+1]=color.g*q;a[i*3+2]=color.b*q;}
 g.setAttribute('color',new T.BufferAttribute(a,3));return g.index?g.toNonIndexed():g;
}
function tube(points:T.Vector3[],radius:number,color:T.Color,segments=10,sides=6,taper=true){
 const curve=new T.CatmullRomCurve3(points),g=new T.TubeGeometry(curve,segments,radius,sides,false),p=g.getAttribute('position');
 if(taper)for(let i=0;i<=segments;i++){const center=curve.getPointAt(i/segments),s=1-.78*Math.pow(i/segments,1.3);for(let j=0;j<=sides;j++){const k=i*(sides+1)+j;p.setXYZ(k,center.x+(p.getX(k)-center.x)*s,center.y+(p.getY(k)-center.y)*s,center.z+(p.getZ(k)-center.z)*s);}}
 g.computeVertexNormals();return colored(g,color,.16);
}
function batch(geometries:T.BufferGeometry[],material:T.Material,parent:T.Group,name:string){
 if(!geometries.length)return;const geometry=mergeGeometries(geometries,false);geometries.forEach(g=>g.dispose());const mesh=new T.Mesh(geometry,material);mesh.name=name;mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
}
export function buildReef(scene:T.Scene){
 const group=new T.Group();scene.add(group);const obstacles:Obstacle[]=[],notes:T.Object3D[]=[];
 const rockMaps=limestoneMaps(),sandTex=texture('sand'),coralTex=texture('coral');sandTex.repeat.set(7,4);
 const rockMat=new T.MeshStandardMaterial({...rockMaps,normalScale:new T.Vector2(.9,.9),roughness:.96,vertexColors:true});
 const coralMat=new T.MeshStandardMaterial({map:coralTex,bumpMap:coralTex,bumpScale:.018,roughness:.76,vertexColors:true});
 const rocks:T.BufferGeometry[]=[],corals:T.BufferGeometry[]=[],soft:T.BufferGeometry[]=[],polyps:T.BufferGeometry[]=[];
 const addNote=(mesh:T.Object3D,title:string,description:string)=>{mesh.userData.note={title,description};notes.push(mesh);};
 const rock=(x:number,y:number,z:number,sx:number,sy:number,sz:number)=>{
  const original=new T.IcosahedronGeometry(1,22);original.deleteAttribute('normal');const geo=mergeVertices(original),p=geo.getAttribute('position');original.dispose();
  const pores=Array.from({length:31},()=>{const theta=pick(0,Math.PI*2),vertical=pick(-.93,.93),horizontal=Math.sqrt(1-vertical*vertical);return {a:Math.cos(theta)*horizontal,b:vertical,c:Math.sin(theta)*horizontal,r:pick(.1,.25),depth:pick(.025,.095)};});
  for(let i=0;i<p.count;i++){
   const a=p.getX(i),b=p.getY(i),c=p.getZ(i);let n=1+.12*Math.sin(a*8+c*4)*Math.cos(b*9-a*2)+.04*Math.sin(c*24+b*19)*Math.sin(a*22-b*6)+.014*Math.sin(a*67+c*51)*Math.cos(b*61);
   for(const pore of pores){const d=((a-pore.a)**2+(b-pore.b)**2+(c-pore.c)**2)/(pore.r*pore.r);if(d<1)n-=pore.depth*(1-d)**2;}
   p.setXYZ(i,a*n*sx+x,b*n*sy+y,c*n*sz+z);
  }
  geo.computeVertexNormals();const surface=colored(geo,new T.Color('#ebdfc9'),.06);rocks.push(surface);
  // Conservative cluster of collision volumes follows the irregular rock rather than one island-sized ball.
  const r=Math.min(sx,sy,sz)*1.16;obstacles.push({center:new T.Vector3(x,y,z),radius:r});
  for(const [axis,size] of [[0,sx],[1,sy],[2,sz]] as const)if(size>r*1.2)for(const sign of [-1,1]){const center=new T.Vector3(x,y,z);center.setComponent(axis,center.getComponent(axis)+sign*(size-r)*.85);obstacles.push({center,radius:r});}
 };
 // Two porous islands, with deliberately open caves and a winding channel.
 const formations=[[-3.6,.63,.15,.91,.55,.93],[-2.45,.55,-.6,.87,.48,.9],[-3.85,1.27,-.45,.64,.78,.72],[-2.05,1.13,-.6,.62,.75,.72],[-2.97,1.92,-.5,1.13,.57,.76],[-2.9,2.45,-.73,.82,.62,.76],[-3.1,2.91,-.95,.6,.56,.57],[-3.9,.5,1.38,.72,.39,.58],[-2.42,.51,1.45,.68,.4,.6],[-1.81,.35,-1.38,.65,.26,.52],
 [1.25,.66,-.42,.81,.59,.83],[3.35,.64,-.05,1,.6,.91],[3.25,1.4,-.72,.77,.82,.84],[1.01,1.45,-.75,.68,.78,.78],[1.68,2.35,-.81,1.12,.7,.8],[2.05,3.01,-.91,.83,.67,.74],[1.64,3.44,-1.02,.63,.49,.62],[3.4,2.11,-.82,.74,.58,.72],[3.98,.91,.65,.57,.67,.74],[2.25,.58,1.36,.88,.48,.6],[3.74,.5,1.52,.67,.42,.63],[.66,.36,1.42,.58,.22,.55],[3.99,2.09,-1.31,.56,.72,.53]];
 for(const a of formations)rock(...a as [number,number,number,number,number,number]);
 // Temporary per-rock bounds keep attachment raycasts local; these are never rendered.
 const supports=rocks.map(g=>{g.computeBoundingSphere();return new T.Mesh(g,rockMat);}),attachRay=new T.Raycaster();
 const rockMesh=batch(rocks,rockMat,group,'Porous living reef rock')!;addNote(rockMesh,'The architecture of a reef','Open caves and water-filled spaces give fish shelter and routes between the reef islands. The rock carries irregular patches of coralline algae. Drag to look through the arches.');
 const branch=(x:number,y:number,z:number,size:number,hue:number)=>{
  const base=new T.Vector3(x,y,z);attachRay.set(new T.Vector3(x,y+.32,z),new T.Vector3(0,-1,0));attachRay.far=.95;
  const support=attachRay.intersectObjects(supports,false)[0];if(support)base.y=support.point.y-.012*size;
  const colony=branchingColony(base,size,hue,random),center=base.clone().add(new T.Vector3(0,size*.47,0));let radiusSquared=0;
  for(const geometry of colony){const p=geometry.getAttribute('position');for(let i=0;i<p.count;i++)radiusSquared=Math.max(radiusSquared,(p.getX(i)-center.x)**2+(p.getY(i)-center.y)**2+(p.getZ(i)-center.z)**2);}
  corals.push(...colony);obstacles.push({center,radius:Math.sqrt(radiusSquared)+.015});
 };
 for(const b of [[-3.12,3.24,-.95,1,.94],[-3.92,2.55,-.6,.8,.025],[-2.37,2.83,-.7,.72,.22],[-3.45,2.83,-.25,.82,.81],[-1.94,1.61,-.63,.63,.47],[-3.89,1.23,1.06,.5,.2],[-2.11,.63,1.61,.51,.025],[-4.27,.72,.56,.63,.28],[-1.48,.57,-1.46,.55,.8],
 [1.69,3.76,-1.06,1.07,.84],[2.3,3.41,-.74,.95,.96],[1.02,3.22,-.5,.83,.23],[2.87,2.7,-.81,.82,.075],[3.69,2.43,-1.1,.94,.81],[3.72,1.32,.88,.8,.03],[4.15,1.5,.1,.6,.23],[1.1,1.13,.5,.52,.92],[.64,.55,1.58,.55,.025],[2.85,.87,1.42,.44,.21],[3.45,.65,1.77,.39,.82]])branch(...b as [number,number,number,number,number]);
 const plate=(x:number,y:number,z:number,r:number)=>{
  corals.push(platingColony(x,y,z,r,random()*Math.PI*2));
  for(let dx=-r*1.2;dx<=r*1.2;dx+=.18)for(let dz=-r*.92;dz<=r*.92;dz+=.18)if((dx/r)**2+(dz/(r*.76))**2<1.46)obstacles.push({center:new T.Vector3(x+dx,y+.045+.065*(dx*dx+dz*dz)/(r*r),z+dz),radius:.12});
 };
 plate(-3,1.98,.43,1.08);plate(-2.77,1.77,.62,.8);plate(2.4,2.52,.1,1.05);plate(1.62,2.4,-.07,.65);plate(1.26,.81,.95,.68);
 coralMat.side=T.DoubleSide;const hard=batch(corals,coralMat,group,'Branching and plating corals')!;addNote(hard,'A city built by tiny animals','Stony corals are colonies of polyps supported by a hard skeleton. Branching colonies and ruffled plates add different shapes and shelter. Their skeletons do not bend in the current. This scene is an artistic reef study, not a stocking plan.');
 const hosts=[new T.Vector3(3.05,1.21,.82),new T.Vector3(-3.62,.78,1.35)];
 for(let k=0;k<3;k++){
  const center=k<2?hosts[k]:new T.Vector3(3.88,.52,1.73),s=k===0?1:k===1?.63:.46;
  for(let i=0;i<180;i++){
   const a=i*2.399,r=Math.sqrt((i+.5)/180)*.63*s,root=center.clone().add(new T.Vector3(Math.cos(a)*r,0,Math.sin(a)*r)),h=pick(.35,.82)*s;
   const end=root.clone().add(new T.Vector3(Math.cos(a)*.3*s,h,Math.sin(a)*.3*s)),bend=root.clone().lerp(end,.57);bend.x+=Math.sin(i)*.12*s;
   const color=new T.Color(k===2?'#9c94b0':'#a2b273').multiplyScalar(pick(.8,1.14));
   soft.push(tube([root,bend,end],pick(.023,.036)*s,color,10,6,false));
   const tip=new T.SphereGeometry(.038*s,7,5);tip.scale(1,1.3,1);tip.translate(end.x,end.y,end.z);soft.push(colored(tip,new T.Color(k===2?'#cad7db':'#d5eaa1')));
  }
 }
 const softMat=new T.MeshStandardMaterial({vertexColors:true,roughness:.59,metalness:.03});
 softMat.onBeforeCompile=shader=>{shader.uniforms.reefTime=reefClock;shader.vertexShader='uniform float reefTime;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
 float root=position.x>2.5?(position.z>1.4?.52:1.21):.78;
 float flex=clamp((position.y-root)*1.6,0.,1.);flex*=flex;
 transformed.x+=sin(reefTime*1.65+position.z*2.4+position.x*1.1)*.075*flex;
 transformed.z+=sin(reefTime*1.23+position.x*3.)*.058*flex;`);};
 const anemones=batch(soft,softMat,group,'Swaying anemone tentacles')!;anemones.castShadow=false;addNote(anemones,'Shelter in the tentacles','Clownfish stay close to a host anemone, returning to its tentacles for shelter. The soft tentacles bend in the current while their base stays attached. Tap Feed fish to watch their short trips out from the host.');
 for(const [x,y,z,s] of [[-3.23,.48,1.81,.5],[2.18,.7,1.63,.56],[-2.4,1.08,.64,.32],[1.12,2.76,-.39,.31]]){
  for(let i=0;i<46;i++){
   const a=i*2.399,r=Math.sqrt(i/46)*s,px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r,py=y+.22*(1-r/s);
   const ring=new T.TorusGeometry(.058,.016,5,12);ring.rotateX(-Math.PI/2);ring.translate(px,py,pz);polyps.push(colored(ring,new T.Color(i%3?'#ed982a':'#43bf9b')));
   const disk=new T.SphereGeometry(.048,8,5);disk.scale(1,.27,1);disk.translate(px,py-.005,pz);polyps.push(colored(disk,new T.Color(i%3?'#3b717e':'#674e97')));
   for(let j=0;j<7;j++){const q=j/7*6.28;polyps.push(tube([new T.Vector3(px+Math.cos(q)*.06,py,pz+Math.sin(q)*.06),new T.Vector3(px+Math.cos(q)*.085,py+.038,pz+Math.sin(q)*.085)],.006,new T.Color('#929365'),2,4,false));}
  }
 }
 // Smaller encrusting colonies cover exposed ledges, with raised corallite rims.
 for(const [x,y,z,r] of [[-2.42,2.09,.03,.38],[-3.47,1.37,.64,.37],[-2.2,.67,.97,.29],[1.31,2.94,-.34,.37],[2.45,1.72,.3,.42],[3.79,.74,1.15,.32],[.91,1.17,-.06,.28]]){
  for(let i=0;i<85;i++){
   const a=i*2.399,rr=Math.sqrt(i/85)*r,px=x+Math.cos(a)*rr,pz=z+Math.sin(a)*rr,py=y+Math.sqrt(Math.max(0,r*r-rr*rr))*.7;
   const rim=new T.TorusGeometry(.034,.012,5,9);rim.rotateX(-Math.PI/2);rim.translate(px,py,pz);polyps.push(colored(rim,new T.Color(i%4?'#68b78e':'#afc781')));
   const center=new T.SphereGeometry(.025,5,4);center.scale(1,.3,1);center.translate(px,py-.014,pz);polyps.push(colored(center,new T.Color('#425664')));
  }
 }
 const zoo=batch(polyps,coralMat,group,'Zoanthid gardens')!;addNote(zoo,'A garden of polyps','These buttonlike animals form colonies on the rock. Each crown of tentacles surrounds a mouth. The reef mixes branching, plating and soft forms; look closely to see their different structures.');
 const sand=new T.Mesh(new T.PlaneGeometry(10.06,4.61,100,46),new T.MeshStandardMaterial({map:sandTex,bumpMap:sandTex,bumpScale:.025,roughness:1,color:'#dedbd0'}));sand.rotation.x=-Math.PI/2;sand.position.y=.18;sand.receiveShadow=true;group.add(sand);
 const rubble=new T.InstancedMesh(new T.IcosahedronGeometry(1,0),new T.MeshStandardMaterial({color:'#d4d4bd',roughness:1}),1600),dummy=new T.Object3D();
 for(let i=0;i<1600;i++){const x=pick(-4.94,4.94),z=pick(-2.23,2.23);dummy.position.set(x,.185,z);const s=pick(.012,.049);dummy.scale.set(s,pick(.4,1)*s,s);dummy.rotation.set(random()*3,random()*3,random()*3);dummy.updateMatrix();rubble.setMatrixAt(i,dummy.matrix);rubble.setColorAt(i,new T.Color().setHSL(.11,.12,pick(.37,.83)));}rubble.receiveShadow=true;group.add(rubble);
 return {group,obstacles,notes,hosts};
}
