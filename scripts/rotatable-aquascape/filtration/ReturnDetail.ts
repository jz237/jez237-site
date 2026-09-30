import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import type {Part} from './model.ts';
import {describe} from './content.ts';

type XYZ=[number,number,number];
const TAU=Math.PI*2;
const rng=(seed:number)=>()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
function texture(draw:(c:CanvasRenderingContext2D,n:number)=>void,n=512){const e=document.createElement('canvas');e.width=e.height=n;draw(e.getContext('2d')!,n);const t=new T.CanvasTexture(e);t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;return t;}
function add(p:T.Object3D,g:T.BufferGeometry,m:T.Material,pos:XYZ=[0,0,0]){const o=new T.Mesh(g,m);o.position.set(...pos);p.add(o);return o;}
function box(p:T.Object3D,pos:XYZ,size:XYZ,m:T.Material){return add(p,new RoundedBoxGeometry(...size,2,Math.min(...size,.12)*.18),m,pos);}
function cylinder(p:T.Object3D,pos:XYZ,r:number,h:number,m:T.Material,axis='z',n=48){const o=add(p,new T.CylinderGeometry(r,r,h,n),m,pos);if(axis==='z')o.rotation.x=Math.PI/2;return o;}
function ring(p:T.Object3D,pos:XYZ,r:number,t:number,m:T.Material,axis='z'){const o=add(p,new T.TorusGeometry(r,t,8,64),m,pos);if(axis==='y')o.rotation.x=Math.PI/2;return o;}
function sleeve(p:T.Object3D,pos:XYZ,r:number,inner:number,h:number,m:T.Material,axis='z'){const o=add(p,new T.LatheGeometry([new T.Vector2(inner,-h/2),new T.Vector2(r,-h/2),new T.Vector2(r,h/2),new T.Vector2(inner,h/2),new T.Vector2(inner,-h/2)],64),m,pos);if(axis==='z')o.rotation.x=Math.PI/2;return o;}
function pipe(p:T.Object3D,points:XYZ[],r:number,m:T.Material,n=40){return add(p,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),n,r,10,false),m);}
function screw(p:T.Object3D,pos:XYZ,m:T.Material,dark:T.Material,r=.024){cylinder(p,pos,r*1.5,.012,dark);cylinder(p,[pos[0],pos[1],pos[2]+.011],r,.018,m);const o=add(p,new T.CircleGeometry(r*.46,6),dark,[pos[0],pos[1],pos[2]+.021]);o.rotation.z=Math.PI/6;}
function stamp(p:T.Object3D,text:string,sub:string,pos:XYZ,size:XYZ,top=false){const map=texture((c,n)=>{c.fillStyle='#192325';c.fillRect(0,0,n,n);c.strokeStyle='#6c8482';c.lineWidth=4;c.strokeRect(15,15,n-30,n-30);c.fillStyle='#d1e0da';c.font='bold 74px Arial';c.fillText(text,38,116);c.font='32px Arial';c.fillText(sub,38,179);c.fillStyle='#9baea9';c.font='28px Arial';c.fillText('WET ROTOR',38,282);c.fillText('KEEP INLET CLEAR',38,334);c.font='23px Arial';c.fillText('GENERIC TEACHING MODEL',38,463);});map.colorSpace=T.SRGBColorSpace;const o=add(p,new T.PlaneGeometry(size[0],size[1]),new T.MeshStandardMaterial({map,roughness:.58}),pos);if(top)o.rotation.x=-Math.PI/2;return o;}

/** Original wet-rotor teaching reconstruction. No manufacturer dimensions or speed claims. */
export function detailReturn(parts:Part[],groups:Record<string,T.Group>){
 const get=(id:string)=>parts.find(p=>p.id===id)!.group;
 const grain=texture((c,n)=>{const r=rng(81);c.fillStyle='#858585';c.fillRect(0,0,n,n);for(let i=0;i<42000;i++){const v=80+r()*90;c.fillStyle=`rgb(${v},${v},${v})`;c.fillRect(r()*n,r()*n,.5+r()*1.7,.5+r()*1.4);}for(let i=0;i<45;i++){c.strokeStyle='rgba(215,215,215,.20)';c.lineWidth=.5;c.beginPath();const x=r()*n,y=r()*n;c.moveTo(x,y);c.lineTo(x+20+r()*80,y+r()*2);c.stroke();}});
 const colorMap=texture((c,n)=>{const r=rng(19);c.fillStyle='#b4b7b5';c.fillRect(0,0,n,n);for(let i=0;i<1800;i++){const v=155+r()*47;c.fillStyle=`rgba(${v},${v+2},${v+1},.16)`;const x=r()*n,y=r()*n,s=1+r()*9;c.fillRect(x,y,s,s*.55);}});colorMap.colorSpace=T.SRGBColorSpace;
 const rough=texture((c,n)=>{const r=rng(34);c.fillStyle='#b5b5b5';c.fillRect(0,0,n,n);for(let i=0;i<6500;i++){const v=105+r()*90;c.fillStyle=`rgb(${v},${v},${v})`;c.fillRect(r()*n,r()*n,1+r()*6,1+r()*3);}});
 const polymer=new T.MeshPhysicalMaterial({color:0x364343,map:colorMap,bumpMap:grain,bumpScale:.0012,roughness:.84,roughnessMap:rough,metalness:0,clearcoat:.06,clearcoatRoughness:.6,side:T.DoubleSide});
 const vane=polymer.clone();vane.color.set(0x293e3d);vane.roughness=.72;vane.bumpScale=.0005;vane.clearcoat=.10;
 const ceramic=new T.MeshPhysicalMaterial({color:0xe9e6d8,roughness:.23,metalness:0,clearcoat:.24,clearcoatRoughness:.28});
 const elastomer=new T.MeshStandardMaterial({color:0x1c2425,roughness:.87,bumpMap:grain,bumpScale:.0022});
 const metal=new T.MeshStandardMaterial({color:0x929c9b,metalness:.93,roughness:.32,bumpMap:grain,bumpScale:.00035});
 const inset=new T.MeshStandardMaterial({color:0x10191a,roughness:.72});
 const liner=new T.MeshPhysicalMaterial({color:0x8f9990,roughness:.26,clearcoat:.3,metalness:0});
 const magnetMat=new T.MeshStandardMaterial({color:0x283131,roughness:.42,bumpMap:grain,bumpScale:.0006,metalness:.08});
 const clipped:{group:T.Group;plane:T.Plane;materials:T.Material[]}[]=[];
 const sectionFaces:T.Mesh[]=[],sectionMat=new T.MeshStandardMaterial({color:0x606c66,roughness:.84});
 function section(p:T.Group,pos:XYZ,size:XYZ){const o=box(p,pos,size,sectionMat);o.userData.dynamic=true;o.visible=false;sectionFaces.push(o);}
 function cutting(id:string){const group=get(id),plane=new T.Plane(new T.Vector3(-1,0,0),.035),materials:T.Material[]=[];function mat(source:T.Material){const m=source.clone();if(m instanceof T.MeshStandardMaterial){m.side=T.DoubleSide;m.clipShadows=true;}materials.push(m);return m;}clipped.push({group,plane,materials});return {group,mat};}

 // Molded encapsulated housing, a genuinely hollow rotor well, seam, ribs and cable gland.
 const motor=cutting('pump-motor'),pm=motor.mat(polymer),lm=motor.mat(liner),em=motor.mat(elastomer),mm=motor.mat(metal),im=motor.mat(inset);motor.group.clear();
 sleeve(motor.group,[0,0,-.14],.456,.19,.78,pm);sleeve(motor.group,[0,0,-.105],.192,.174,.67,lm);
 cylinder(motor.group,[0,0,-.55],.447,.045,pm);ring(motor.group,[0,0,-.519],.453,.008,em);
 sleeve(motor.group,[0,0,.272],.488,.19,.075,pm);ring(motor.group,[0,0,.312],.446,.009,em);
 for(let i=0;i<20;i++){const a=i/20*TAU,r=.457,o=box(motor.group,[Math.cos(a)*r,Math.sin(a)*r,-.155],[.035,.046,.64],pm);o.rotation.z=a;}
 box(motor.group,[0,.414,-.18],[.64,.17,.69],pm);box(motor.group,[0,.506,-.18],[.59,.012,.63],pm);
 for(const x of [-.40,.40])box(motor.group,[x,-.31,-.15],[.16,.12,.68],pm);
 for(let i=0;i<6;i++){const a=i/6*TAU;screw(motor.group,[Math.cos(a)*.419,Math.sin(a)*.419,.32],mm,im,.025);}
 sleeve(motor.group,[0,0,-.48],.078,.035,.07,em);
 pipe(motor.group,[[-.32,.23,-.54],[-.45,.24,-.65],[-.49,.20,-.83],[-.57,.30,-.97]],.034,em);
 for(let i=0;i<7;i++)ring(motor.group,[-.36,.23,-.59-i*.022],.047-i*.0018,.006,em);
 for(const side of [-1,1]){section(motor.group,[.035,side*.322,-.14],[.001,.261,.78]);section(motor.group,[.035,side*.178,-.105],[.001,.025,.67]);section(motor.group,[.035,side*.334,.272],[.001,.284,.075]);}
 section(motor.group,[.035,.447,-.18],[.001,.16,.69]);
 const motorLabel=stamp(motor.group,'RETURN','ENCAPSULATED DRIVE',[0,.515,-.18],[.41,.26,0],true);motorLabel.userData.dynamic=true;

 // Seven swept vanes, open impeller eye and an axial bore through the magnetic sleeve.
 const rotor=get('pump-rotor'),wheel=rotor.children[0] as T.Group;wheel.clear();
 sleeve(wheel,[0,0,-.22],.154,.036,.47,magnetMat);
 for(const z of [-.47,.026])sleeve(wheel,[0,0,z],.161,.036,.036,ceramic);
 sleeve(wheel,[0,0,.111],.403,.039,.049,vane);sleeve(wheel,[0,0,.159],.090,.038,.082,vane);
 ring(wheel,[0,0,.259],.144,.019,vane);
 for(let i=0;i<7;i++){const shape=new T.Shape();shape.moveTo(.089,-.008);shape.bezierCurveTo(.20,-.023,.32,-.091,.377,-.179);shape.lineTo(.399,-.160);shape.bezierCurveTo(.333,-.075,.214,.007,.088,.022);shape.closePath();const o=add(wheel,new T.ExtrudeGeometry(shape,{depth:.125,bevelEnabled:true,bevelSize:.004,bevelThickness:.004,bevelSegments:2,curveSegments:16,steps:1}),vane,[0,0,.139]);o.rotation.z=i/7*TAU;}
 for(const z of [-.401,-.09])ring(wheel,[0,0,z],.154,.004,elastomer);

 const shaft=get('shaft');shaft.clear();cylinder(shaft,[0,0,-.018],.032,.99,ceramic);
 for(const z of [-.5,.46]){sleeve(shaft,[0,0,z],.081,.033,.07,elastomer);sleeve(shaft,[0,0,z+.036],.055,.033,.009,ceramic);}

 // The chamber expands around the wheel; the outlet is a hollow tangent, not a solid pipe.
 const vol=cutting('volute'),vp=vol.mat(polymer),vm=vol.mat(metal),ve=vol.mat(elastomer),vi=vol.mat(inset);vol.group.clear();
 const spiral=(radius:number)=>{const s=new T.Shape();for(let i=0;i<=100;i++){const a=.5+i/100*TAU,r=radius+.052*i/100;const x=Math.cos(a)*r,y=Math.sin(a)*r;if(!i)s.moveTo(x,y);else s.lineTo(x,y);}s.closePath();return s;};
 const outline=spiral(.518),channel=new T.Path();for(let i=100;i>=0;i--){const a=.5+i/100*TAU,r=.447+.052*i/100;if(i===100)channel.moveTo(Math.cos(a)*r,Math.sin(a)*r);else channel.lineTo(Math.cos(a)*r,Math.sin(a)*r);}channel.closePath();outline.holes.push(channel);
 add(vol.group,new T.ExtrudeGeometry(outline,{depth:.33,bevelEnabled:true,bevelSize:.007,bevelThickness:.007,bevelSegments:2,curveSegments:64}),vp,[0,0,-.174]);
 sleeve(vol.group,[0,0,.180],.538,.215,.045,vp);ring(vol.group,[0,0,.21],.229,.01,ve);ring(vol.group,[0,0,-.186],.448,.012,ve);
 // Open elbow with a continuous inner wall.
 const pts:XYZ[]=[[.32,.38,-.02],[.31,.58,-.02],[.28,.72,-.10],[.28,.87,-.12]],curve=new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(...p)));
 add(vol.group,new T.TubeGeometry(curve,32,.139,24,false),polymer);const inner=add(vol.group,new T.TubeGeometry(curve,32,.098,24,false),polymer);inner.material=polymer;
 sleeve(vol.group,[.28,.87,-.12],.139,.098,.12,polymer,'y');sleeve(vol.group,[.28,.965,-.12],.125,.098,.20,polymer,'y');
 // One helix gives the fitting a true thread and shadow relief.
 const thread:XYZ[]=[];for(let i=0;i<=192;i++){const a=i/192*TAU*5;thread.push([.28+Math.cos(a)*.128,.884+i/192*.17,-.12+Math.sin(a)*.128]);}pipe(vol.group,thread,.006,polymer,192);
 sleeve(vol.group,[.28,.797,-.12],.188,.142,.145,polymer,'y');
 for(let i=0;i<20;i++){const a=i/20*TAU;const o=box(vol.group,[.28+Math.cos(a)*.184,.797,-.12+Math.sin(a)*.184],[.015,.125,.024],polymer);o.rotation.y=-a;}
 ring(vol.group,[.28,.873,-.12],.161,.007,ve,'y');
 for(let i=0;i<6;i++){const a=i/6*TAU+.3,x=Math.cos(a)*.493,y=Math.sin(a)*.493;cylinder(vol.group,[x,y,.055],.049,.31,vp);screw(vol.group,[x,y,.224],vm,vi,.022);}
 for(const side of [-1,1]){section(vol.group,[.035,side*.503,-.009],[.001,.058,.33]);section(vol.group,[.035,side*.372,.180],[.001,.33,.045]);}
 // Discreet molded direction arrow on the removable cover.
 const arrow=new T.Shape();arrow.moveTo(-.34,.21);arrow.lineTo(-.22,.28);arrow.lineTo(-.235,.24);arrow.lineTo(-.15,.26);arrow.lineTo(-.16,.28);arrow.lineTo(-.27,.30);arrow.lineTo(-.30,.34);arrow.closePath();add(vol.group,new T.ExtrudeGeometry(arrow,{depth:.004,bevelEnabled:false}),vol.mat(liner),[0,0,.208]);

 const seal=get('seal');seal.clear();ring(seal,[0,0,0],.448,.027,elastomer);ring(seal,[0,0,0],.448,.0018,polymer);
 const guard=cutting('strainer'),gp=guard.mat(polymer),ge=guard.mat(elastomer),gm=guard.mat(metal),gi=guard.mat(inset);guard.group.clear();
 for(const z of [-.12,.055,.18])ring(guard.group,[0,0,z],.437,.019,gp);
 for(let i=0;i<28;i++){const a=i/28*TAU,o=box(guard.group,[Math.cos(a)*.432,Math.sin(a)*.432,.025],[.024,.028,.287],gp);o.rotation.z=a;}
 for(let y=-.384;y<.401;y+=.060){const half=Math.sqrt(.424*.424-y*y),points:XYZ[]=[];for(let j=0;j<=20;j++){const x=-half+2*half*j/20;points.push([x,y,.175+.12*Math.sqrt(Math.max(0,1-(x*x+y*y)/(.438*.438)))]);}pipe(guard.group,points,.015,gp,20);}
 for(const x of [-.165,.165])box(guard.group,[x,0,.242],[.025,.744,.029],gp);
 ring(guard.group,[0,0,-.14],.449,.012,ge);
 for(let i=0;i<3;i++){const a=i/3*TAU+.4;screw(guard.group,[Math.cos(a)*.402,Math.sin(a)*.402,.193],gm,gi,.018);}
 const feet=get('pump-base');feet.clear();
 for(const x of [-.43,.43]){box(feet,[x,0,-.08],[.15,.10,1.26],polymer);for(const z of [-.53,.46]){cylinder(feet,[x,-.085,z],.129,.105,elastomer,'y',32);ring(feet,[x,-.129,z],.118,.01,elastomer,'y');sleeve(feet,[x,.064,z],.072,.034,.02,metal,'y');box(feet,[x,.015,z],[.1,.012,.16],inset);}}
 for(const z of [-.39,.34])box(feet,[0,.01,z],[.94,.075,.13],polymer);

 describe('pump-motor','Encapsulated stator & rotor well','SEALED ELECTRICAL SIDE','Stationary windings are sealed inside the textured motor body. Their magnetic field turns the wet rotor through the cavity wall; the electrical windings do not touch aquarium water. Open the cutaway to see the hollow rotor well.','The cable gland and molded casing belong to the sealed motor, not the removable wet-side parts. Follow the manufacturer’s instructions rather than opening the electrical housing.');
 describe('pump-rotor','Magnetic rotor & swept impeller','ROTATING WET SIDE','The dark magnetic sleeve and seven swept vanes rotate as one assembly. Water reaches the open center, then the vanes transfer energy to it as it moves toward the rim. The pale end collars and central bore locate it around the shaft.','The inspection-speed slider slows this teaching animation only. Real speed, vane count and impeller shape depend on the pump.');
 describe('shaft','Ceramic shaft & bearing seats','ALIGNMENT / WET SUPPORT','The pale shaft passes through the rotor bore. End bearing seats keep the axis aligned while the rotor turns around it in the water-filled cavity. This model uses a fixed-shaft arrangement.','Ceramic shafts can be damaged by rough handling. Designs differ: use the correct replacement parts and service directions for the actual pump.');
 describe('volute','Expanding volute & threaded outlet','PRESSURE / DISCHARGE','The spiral channel grows around the impeller and leads to a tangential outlet. It collects flow and helps turn velocity into pressure. The hollow riser, screw bosses, union grip and helical thread remain visible when separated.','Use the pump curve at the required total head, including vertical lift and plumbing losses. A zero-head flow rating is not the flow delivered to a tall aquarium.');
 describe('seal','Wet-side O-ring','REMOVABLE JOINT','A continuous elastomer O-ring sits between the removable chamber and the motor’s wet-side flange. It seals that joint; it is not a rotating mechanical shaft seal.','A twisted, dirty or damaged O-ring can compromise the joint. Inspect and refit it only as directed by the pump manufacturer, with power isolated.');
 describe('strainer','Slotted intake cage','LARGE-DEBRIS GUARD','Rounded slats and side slots admit water to the front inlet. The cage discourages larger objects from entering the impeller while leaving an open water path. It is not a fine-particle filter.','A dirty intake, low water level or air drawn into the inlet can reduce performance. Keep suitable clearance around the inlet.');
 describe('pump-base','Cradle & compliant feet','VIBRATION ISOLATION','Twin mounting rails support the housing above four textured rubber pads. The pads soften the vibration path to the sump floor; a flexible connection can also reduce vibration transmitted through rigid plumbing.','Keep the pump and pipework from pressing against glass or cabinet panels. Persistent rattling may also come from debris or worn wet-side parts.');
 let cutaway=false,speed=1,phase=0,lastTime=0;
 function refreshPlanes(){for(const c of clipped){c.group.updateWorldMatrix(true,false);c.plane.copy(new T.Plane(new T.Vector3(-1,0,0),.035)).applyMatrix4(c.group.matrixWorld);}}
 function setCutaway(v:boolean){cutaway=v;refreshPlanes();for(const c of clipped)for(const m of c.materials){m.clippingPlanes=v?[c.plane]:null;m.needsUpdate=true;}motorLabel.visible=!v;sectionFaces.forEach(o=>o.visible=v);}
 return {setCutaway,setSpeed:(v:number)=>speed=T.MathUtils.clamp(v,.25,1),visibility:(_v:boolean)=>{if(cutaway)refreshPlanes();},update:(time:number)=>{const dt=Math.max(0,time-lastTime);lastTime=time;phase+=dt*1.7*speed;wheel.rotation.z=-phase;},snapshot:()=>({cutaway,speed,phase}),reset:()=>{phase=lastTime=0;setCutaway(false);speed=1;}};
}
