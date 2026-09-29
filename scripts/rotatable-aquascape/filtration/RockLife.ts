import * as T from 'three';

const TAU=Math.PI*2;
const seeded=(seed:number)=>()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);

function crustGeometry(seed:number){
 const random=seeded(seed),g=new T.BufferGeometry(),p:number[]=[],c:number[]=[],uv:number[]=[],ix:number[]=[],segments=20;
 for(let ring=0;ring<3;ring++)for(let i=0;i<=segments;i++){
  const a=i/segments*TAU,r=[.0,.71,1][ring]*(1+.15*Math.sin(a*5+seed)+.09*Math.sin(a*9)),y=ring===0?.17:ring===1?.14:.025;
  p.push(Math.cos(a)*r,y+.016*Math.sin(a*7),Math.sin(a)*r);
  uv.push(.5+Math.cos(a)*r*.43,.5+Math.sin(a)*r*.43);
  const light=ring===2?1.035:.84+random()*.15;c.push(light,light,light);
  if(ring<2&&i<segments){const k=ring*(segments+1)+i;ix.push(k,k+segments+1,k+1,k+1,k+segments+1,k+segments+2);}
 }
 g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('color',new T.Float32BufferAttribute(c,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();return g;
}

// Surface-bound colonies stay on their own rock section when it is separated.
// Deliberate planar teaching cuts remain bare; the irregular exterior and pore walls grow crusts.
export function growRock(part:T.Group,geometry:T.BufferGeometry,layer:number){
 const random=seeded(910+layer),position=geometry.attributes.position,normal=geometry.attributes.normal,index=geometry.index!,triangles=index.count/3;
 const a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3(),v=new T.Vector3(),n=new T.Vector3(),temp=new T.Vector3(),up=new T.Vector3(0,1,0),dummy=new T.Object3D();
 const center=(layer-1)*.64,lo=-1+layer*2/3-center,hi=lo+2/3;
 function sample(){for(let k=0;k<100;k++){
  const t=Math.floor(random()*triangles)*3,ia=index.getX(t),ib=index.getX(t+1),ic=index.getX(t+2);a.fromBufferAttribute(position,ia);b.fromBufferAttribute(position,ib);c.fromBufferAttribute(position,ic);
  const u=Math.sqrt(random()),w=random();v.copy(a).multiplyScalar(1-u).addScaledVector(b,u*(1-w)).addScaledVector(c,u*w);
  n.fromBufferAttribute(normal,ia).add(temp.fromBufferAttribute(normal,ib)).add(temp.fromBufferAttribute(normal,ic)).normalize();
  const cut=(layer>0&&Math.abs(v.z-lo)<.008)||(layer<2&&Math.abs(v.z-hi)<.008);
  if(!(cut&&Math.abs(n.z)>.86)&&n.y>-.83)return true;
 }return false;}
 function add(g:T.BufferGeometry,m:T.Material,count:number,place:(o:T.Object3D,i:number)=>void,colors?:number[]){
  const im=new T.InstancedMesh(g,m,count);for(let i=0;i<count;i++){dummy.position.set(0,0,0);dummy.rotation.set(0,0,0);dummy.scale.set(1,1,1);place(dummy,i);dummy.updateMatrix();im.setMatrixAt(i,dummy.matrix);if(colors)im.setColorAt(i,new T.Color(colors[i%colors.length]).multiplyScalar(.83+random()*.27));}im.computeBoundingSphere();im.castShadow=im.receiveShadow=true;part.add(im);return im;
 }
 const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const ctx=canvas.getContext('2d')!;ctx.fillStyle='#999';ctx.fillRect(0,0,256,256);for(let i=0;i<6500;i++){const x=random()*256,y=random()*256,r=.35+random()*1.4;ctx.fillStyle=i%3?'#636363':'#d2d2d2';ctx.beginPath();ctx.ellipse(x,y,r,r*.7,random()*TAU,0,TAU);ctx.fill();}const relief=new T.CanvasTexture(canvas);relief.anisotropy=4;
 const crustMat=new T.MeshPhysicalMaterial({vertexColors:true,roughness:.67,bumpMap:relief,bumpScale:.009,clearcoat:.14,clearcoatRoughness:.4,side:T.DoubleSide});
 const palettes=[[0x784251,0x893d54,0x9b586a,0x69384f,0x76543d],[0xb9a483,0xa99164,0xc3aa88,0x92725c,0x6c744c],[0x9b4f60,0x793752,0x685041,0xa46570,0x645645]];
 for(let variant=0;variant<3;variant++)add(crustGeometry(variant+8),crustMat,500,(o)=>{if(!sample()){o.scale.setScalar(0);return;}o.position.copy(v).addScaledVector(n,.002);o.quaternion.setFromUnitVectors(up,n);o.rotateY(random()*TAU);const s=.010+Math.pow(random(),.85)*.036;o.scale.set(s,s*(.38+random()*.4),s*(.58+random()*.6));},palettes[variant]);
 // Chalky broken carbonate grains under the colored crust, not a field of identical round beads.
 add(new T.TetrahedronGeometry(1,0),new T.MeshStandardMaterial({roughness:.86}),1350,o=>{if(!sample()){o.scale.setScalar(0);return;}o.position.copy(v).addScaledVector(n,.002);o.quaternion.setFromUnitVectors(up,n);o.rotateY(random()*TAU);const s=.003+Math.pow(random(),2)*.014;o.scale.set(s,.4*s,s*(.7+random()));},[0xd2bda0,0xb59b76,0xe3d0b0,0x948066]);
 // Encrusting sponge patches with several open oscula per colony.
 const anchors:Array<{p:T.Vector3;n:T.Vector3}> = [];for(let i=0;i<18;i++)if(sample())anchors.push({p:v.clone(),n:n.clone()});
 const sponge=new T.LatheGeometry([new T.Vector2(.04,0),new T.Vector2(.95,.05),new T.Vector2(1,.32),new T.Vector2(.68,.84),new T.Vector2(.48,1),new T.Vector2(.29,.93),new T.Vector2(.27,.38)],12);
 const spongeMat=new T.MeshPhysicalMaterial({roughness:.74,clearcoat:.13});
 add(sponge,spongeMat,anchors.length*7,(o,i)=>{const anchor=anchors[Math.floor(i/7)];o.position.copy(anchor.p);o.quaternion.setFromUnitVectors(up,anchor.n);o.translateX((random()-.5)*.085);o.translateZ((random()-.5)*.085);o.translateY(-.003);const s=.011+random()*.024;o.scale.set(s,s*(.5+random()*.9),s);},[0xaf682e,0xbd853c,0x90543b,0x977b40]);
 // Tiny calcareous tubes curl against the stone, with an actual open mouth at the free end.
 for(let shape=0;shape<2;shape++){
  const pts:T.Vector3[]=[];for(let i=0;i<=30;i++){const t=i/30,a=t*TAU*1.35,r=.13+.69*t;pts.push(new T.Vector3(Math.cos(a)*r,.10+.13*t*t,Math.sin(a)*r));}
  const tube=new T.TubeGeometry(new T.CatmullRomCurve3(pts),36,.074,6,false);
  add(tube,new T.MeshStandardMaterial({color:shape?0xcbb793:0xdfd3b7,roughness:.72}),42,o=>{if(!sample()){o.scale.setScalar(0);return;}o.position.copy(v).addScaledVector(n,.004);o.quaternion.setFromUnitVectors(up,n);o.rotateY(random()*TAU);const s=.020+random()*.023;o.scale.setScalar(s);});
 }
 // Sparse short filamentous turf sits between crust edges. One batched line object per slice.
 const lines:number[]=[],lineColors:number[]=[];
 for(let i=0;i<460;i++){if(!sample())continue;const root=v.clone().addScaledVector(n,.002),height=.005+random()*.019;temp.set(random()-.5,random()-.5,random()-.5).multiplyScalar(.006);const tip=root.clone().addScaledVector(n,height).add(temp);lines.push(...root.toArray(),...tip.toArray());const color=new T.Color(i%3?0x6a6943:0x786041);lineColors.push(color.r,color.g,color.b,color.r*.8,color.g*.9,color.b*.8);}
 const turf=new T.BufferGeometry();turf.setAttribute('position',new T.Float32BufferAttribute(lines,3));turf.setAttribute('color',new T.Float32BufferAttribute(lineColors,3));part.add(new T.LineSegments(turf,new T.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.7})));
}
