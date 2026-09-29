import * as T from 'three';
import type {Part} from './model.ts';

type XYZ=[number,number,number];
type Palette={white:T.Material;dark:T.Material;rubber:T.Material;metal:T.Material;teal:T.Material;shell:T.MeshPhysicalMaterial};
const TAU=Math.PI*2;
const seeded=(seed:number)=>()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
function canvas(draw:(c:CanvasRenderingContext2D,n:number)=>void,n=1024){const e=document.createElement('canvas');e.width=e.height=n;draw(e.getContext('2d')!,n);const t=new T.CanvasTexture(e);t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;return t;}
function mesh(p:T.Object3D,g:T.BufferGeometry,m:T.Material,xyz:XYZ=[0,0,0]){const o=new T.Mesh(g,m);o.position.set(...xyz);p.add(o);return o;}
function pipe(p:T.Object3D,points:XYZ[],r:number,m:T.Material){return mesh(p,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(a=>new T.Vector3(...a))),40,r,12,false),m);}
function ring(p:T.Object3D,xyz:XYZ,r:number,t:number,m:T.Material,axis='y'){const o=mesh(p,new T.TorusGeometry(r,t,8,64),m,xyz);if(axis==='y')o.rotation.x=Math.PI/2;else if(axis==='x')o.rotation.y=Math.PI/2;return o;}
function band(p:T.Object3D,xyz:XYZ,r:number,h:number,m:T.Material,inner=r-.02){return mesh(p,new T.LatheGeometry([new T.Vector2(inner,-h/2),new T.Vector2(r,-h/2),new T.Vector2(r,h/2),new T.Vector2(inner,h/2)],64),m,xyz);}
const dummy=new T.Object3D();
function instances(p:T.Object3D,g:T.BufferGeometry,m:T.Material,count:number,place:(i:number,o:T.Object3D)=>void){const o=new T.InstancedMesh(g,m,count);for(let i=0;i<count;i++){dummy.position.set(0,0,0);dummy.rotation.set(0,0,0);dummy.scale.set(1,1,1);place(i,dummy);dummy.updateMatrix();o.setMatrixAt(i,dummy.matrix);}o.instanceMatrix.needsUpdate=true;o.computeBoundingSphere();p.add(o);return o;}

// Small surface features are geometry on the appropriate separable part, never flat photographs.
function condensation(p:T.Object3D,lower:number,upper:number,radius:(y:number)=>number,count:number,seed:number){
 const random=seeded(seed),material=new T.MeshPhysicalMaterial({color:0xf2faf6,roughness:.06,metalness:0,transmission:.65,thickness:.018,ior:1.333,transparent:true,opacity:.74,depthWrite:false,clearcoat:1});
 const drops=instances(p,new T.SphereGeometry(1,8,5),material,count,(_,o)=>{const y=lower+random()*(upper-lower),a=random()*TAU,r=radius(y)+.007,s=.003+Math.pow(random(),2)*.014;o.position.set(Math.sin(a)*r,y,Math.cos(a)*r);o.rotation.y=a;o.scale.set(s,s*(1.1+random()*2.2),s*.3);});drops.renderOrder=6;
}

function lettering(text:string,sub:string){const t=canvas((c,n)=>{c.fillStyle='#161e22';c.fillRect(0,0,n,n);c.strokeStyle='#91a2a6';c.lineWidth=4;c.strokeRect(14,14,n-28,n-28);c.fillStyle='#d5dddd';c.font='600 94px Arial';c.fillText(text,56,190);c.font='40px Arial';c.fillStyle='#a0b1b4';c.fillText(sub,56,295);for(let y=380;y<690;y+=60){c.fillStyle='#819296';c.fillRect(56,y,n*(y%120? .68:.49),13);}c.fillStyle='#c4d1d4';c.font='33px Arial';c.fillText('EDUCATIONAL MODEL',56,890);});t.colorSpace=T.SRGBColorSpace;return new T.MeshStandardMaterial({map:t,roughness:.44,metalness:.12});}

export function addSurfaceDetail(parts:Part[],groups:Record<string,T.Group>,m:Palette){
 const get=(id:string)=>parts.find(p=>p.id===id)!.group;
 const detail=(id:string)=>{const g=new T.Group();get(id).add(g);return g;};
 const milk=new T.MeshPhysicalMaterial({color:0xf5f5e8,roughness:.19,metalness:0,transparent:true,opacity:.11,depthWrite:false});
 const acrylic=m.shell.clone();acrylic.roughness=.07;acrylic.thickness=.055;acrylic.transmission=.96;
 const silicone=new T.MeshPhysicalMaterial({color:0xe4e4d5,roughness:.3,transparent:true,opacity:.68,depthWrite:false,clearcoat:.6});
 const amber=new T.MeshPhysicalMaterial({color:0x563318,roughness:.43,metalness:.05,transmission:0,thickness:.18,ior:1.333,clearcoat:1,clearcoatRoughness:.09});
 const wetBlack=new T.MeshPhysicalMaterial({color:0x141b1b,roughness:.29,clearcoat:.8,clearcoatRoughness:.2});

 // Condensation, tea-colored liquid and a patchy foam boundary make the skimmer read as wet equipment.
 condensation(get('reaction-body'),-.78,.79,y=>.91-(y+.825)/1.65*.53,950,13);
 condensation(get('cup'),-.25,.295,()=>.787,740,29);
 condensation(get('neck'),-.29,.31,()=>.348,180,41);
 const cup=get('cup');for(const child of [...cup.children])if(child instanceof T.Mesh&&child.geometry instanceof T.ExtrudeGeometry&&child.position.y<-.2&&child.position.y>-.3){child.material=amber;child.scale.z=2.3;}
 const cd=detail('cup');band(cd,[0,-.10,0],.746,.016,amber,.35);ring(cd,[0,-.098,0],.746,.009,amber);ring(cd,[0,-.095,0],.35,.009,amber);
 const random=seeded(83),foamMaterial=new T.MeshStandardMaterial({color:0xb8a580,roughness:.6});
 const scum=instances(cd,new T.SphereGeometry(1,8,6),foamMaterial,620,(_,o)=>{const a=random()*TAU,r=.37+Math.pow(random(),.5)*.368,s=.006+random()*.013;o.position.set(Math.cos(a)*r,-.084+random()*.027,Math.sin(a)*r);o.scale.set(s,s*.7,s);});scum.castShadow=false;
 // Short drain barb, collar, hose and clamp; assembly remains attached to the removable cup.
 band(cd,[.787,-.22,0],.047,.095,m.white,.03).rotation.z=Math.PI/2;
 for(let i=0;i<4;i++)ring(cd,[.84+i*.024,-.22,0],.04,.006,m.white,'x');
 const nd=detail('neck');for(const y of [-.24,-.18])ring(nd,[0,y,0],.354,.008,m.rubber);
 const lid=get('cup-lid');lid.clear();
 const coverShape=new T.Shape();coverShape.absarc(0,0,.822,0,TAU,false);for(let i=0;i<20;i++){const a=i/20*TAU,hole=new T.Path();hole.absarc(Math.cos(a)*.59,Math.sin(a)*.59,.018,0,TAU,true);coverShape.holes.push(hole);}
 const cover=mesh(lid,new T.ExtrudeGeometry(coverShape,{depth:.055,bevelEnabled:true,bevelSize:.008,bevelThickness:.008,bevelSegments:2,curveSegments:48}),acrylic);cover.rotation.x=-Math.PI/2;
 band(lid,[0,-.002,0],.824,.045,m.white,.79);ring(lid,[0,-.026,0],.773,.012,m.rubber);
 mesh(lid,new T.CylinderGeometry(.087,.105,.15,48),m.dark,[0,.10,0]);ring(lid,[0,.182,0],.071,.009,m.metal);
 const diffuser=detail('diffuser');for(let i=0;i<6;i++){const a=i/6*TAU;mesh(diffuser,new T.CylinderGeometry(.028,.028,.17,16),m.white,[Math.sin(a)*.7,-.10,Math.cos(a)*.7]);}ring(diffuser,[0,.064,0],.77,.016,m.white);
 const sd=detail('silencer');band(sd,[0,-.16,0],.157,.12,acrylic,.115);for(const y of [-.18,.19])ring(sd,[0,y,0],.16,.012,m.rubber);pipe(sd,[[.025,.34,0],[.10,.44,0],[.22,.45,0]],.02,m.white);
 pipe(sd,[[0,-.24,.018],[.14,-.57,.18],[.12,-1.29,.48],[-1.13,-1.5,.98]],.039,silicone);
 const od=detail('skimmer-outlet');for(const y of [.18,.32,.5])ring(od,[.32,y,0],.146,.008,m.white);
 const dial=mesh(od,new T.CircleGeometry(.133,64),m.dark,[.32,.982,0]);dial.rotation.x=-Math.PI/2;
 for(let i=0;i<14;i++){const a=i/14*TAU;const mark=mesh(od,new T.BoxGeometry(.01,.003,.024),m.white,[.32+Math.sin(a)*.115,.986,Math.cos(a)*.115]);mark.rotation.y=a;}
 const bd=detail('skimmer-base');ring(bd,[0,-.068,0],1.017,.012,m.rubber);ring(bd,[0,.079,0],1.026,.009,m.white);
 const pumpD=detail('skimmer-pump');const plate=mesh(pumpD,new T.PlaneGeometry(.3,.16),lettering('SKIM','AIR / WATER'),[0,.027,-.579]);plate.rotation.y=Math.PI;
 const haze=mesh(groups.skimmer,new T.CylinderGeometry(.30,.83,1.55,64,1,true),milk,[0,1.77,0]);

 const pd=detail('pump-motor');const label=mesh(pd,new T.PlaneGeometry(.38,.24),lettering('RETURN','WET ROTOR'),[.01,.504,-.19]);label.rotation.x=-Math.PI/2;
 // Mold seam, strain relief, shaft seats and mounting slots stay inspectable after separation.
 ring(pd,[0,0,-.52],.463,.008,m.rubber,'z');for(let i=0;i<7;i++)ring(pd,[-.49,.285,-.65-i*.025],.048-i*.002,.006,m.rubber,'z');
 const pedestal=get('pump-base');pedestal.clear();for(const x of [-.44,.44]){mesh(pedestal,new T.BoxGeometry(.14,.085,1.36),m.dark,[x,0,0]);for(const z of [-.52,.52]){mesh(pedestal,new T.CylinderGeometry(.13,.145,.13,32),m.rubber,[x,-.08,z]);band(pedestal,[x,.035,z],.08,.02,m.metal,.043);}}
 for(const z of [-.36,.36])mesh(pedestal,new T.BoxGeometry(1.02,.07,.13),m.dark,[0,.01,z]);
 const shaft=detail('shaft');for(const z of [-.41,.41]){const b=band(shaft,[0,0,z],.06,.023,m.white,.028);b.rotation.x=Math.PI/2;}
 const discharge=detail('volute');band(discharge,[.28,.96,-.12],.127,.24,m.dark,.097);for(let i=0;i<9;i++)ring(discharge,[.28,.88+i*.020,-.12],.13,.007,m.dark);
 const sump=detail('sump');for(const z of [-1.73,1.73])mesh(sump,new T.BoxGeometry(11.7,.012,.03),m.rubber,[0,.12,z]);
 const rp=detail('return-pipe');band(rp,[.35,1.8,0],.165,.27,m.white,.097);mesh(rp,new T.BoxGeometry(.41,.055,.10),m.dark,[.35,1.995,0]);mesh(rp,new T.CylinderGeometry(.04,.04,.12,24),m.metal,[.35,1.91,0]);
 const waterParts=[haze];
 return {visibility:(v:boolean)=>waterParts.forEach(p=>p.visible=v),update:(_time:number)=>{}};
}

// Attach growth to sampled surface triangles, keeping all growth with its own exploding rock slice.
export function growRock(part:T.Group,geometry:T.BufferGeometry,layer:number){
 const random=seeded(802+layer),position=geometry.attributes.position,normal=geometry.attributes.normal,index=geometry.index,triangles=(index?.count??position.count)/3;
 const at=(i:number)=>index?index.getX(i):i,v=new T.Vector3(),n=new T.Vector3(),a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3();
 const surface=()=>{for(let attempt=0;attempt<80;attempt++){const t=Math.floor(random()*triangles)*3,ia=at(t),ib=at(t+1),ic=at(t+2);a.fromBufferAttribute(position,ia);b.fromBufferAttribute(position,ib);c.fromBufferAttribute(position,ic);n.fromBufferAttribute(normal,ia).add(new T.Vector3().fromBufferAttribute(normal,ib)).add(new T.Vector3().fromBufferAttribute(normal,ic)).normalize();const u=Math.sqrt(random()),w=random();v.copy(a).multiplyScalar(1-u).addScaledVector(b,u*(1-w)).addScaledVector(c,u*w);if(Math.abs(n.z)<.985&&n.y>-.5)return;} };
 const colors=[0x73505e,0x553b50,0x8c5266,0x78583e,0x555e43],dummy=new T.Object3D();
 const crust=new T.InstancedMesh(new T.IcosahedronGeometry(1,1),new T.MeshStandardMaterial({roughness:.91,vertexColors:false}),2100);
 for(let i=0;i<2100;i++){surface();dummy.position.copy(v).addScaledVector(n,.004);dummy.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),n);const s=.006+Math.pow(random(),2)*.026;dummy.scale.set(s,.003+random()*.004,s*(.7+random()*.5));dummy.updateMatrix();crust.setMatrixAt(i,dummy.matrix);crust.setColorAt(i,new T.Color(colors[i%colors.length]).multiplyScalar(.7+random()*.35));}crust.castShadow=crust.receiveShadow=true;part.add(crust);
 const tubeMat=new T.MeshStandardMaterial({color:0xb5aa85,roughness:.7}),tubeG=new T.LatheGeometry([new T.Vector2(.52,0),new T.Vector2(1,.18),new T.Vector2(.9,1),new T.Vector2(.57,1),new T.Vector2(.5,.6)],12);
 instances(part,tubeG,tubeMat,90,(_,o)=>{surface();o.position.copy(v);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),n);const s=.009+random()*.016;o.scale.set(s,s*(1.1+random()*1.6),s);}).castShadow=true;
 const spongeMat=new T.MeshStandardMaterial({color:0x865737,roughness:.83});
 instances(part,tubeG,spongeMat,32,(_,o)=>{surface();o.position.copy(v);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),n);const s=.022+random()*.016;o.scale.set(s,s*(1.1+random()),s);}).castShadow=true;
}

export function studioEnvironment(){const env=new T.Scene();env.background=new T.Color(0x24272b);const panel=(xyz:XYZ,size:XYZ,intensity:number)=>{const m=new T.MeshBasicMaterial({color:new T.Color().setRGB(intensity,intensity*.98,intensity*.94),side:T.DoubleSide});const o=mesh(env,new T.BoxGeometry(...size),m,xyz);o.lookAt(0,1,0);};panel([-4,4,5],[3,7,.05],5);panel([5,4,0],[1.2,8,.05],7);panel([0,7,-5],[6,2,.05],3);panel([-5,1,-4],[1,6,.05],2);return env;}
