import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import type {Part} from './model.ts';

type XYZ=[number,number,number];
type Palette={white:T.Material;dark:T.Material;rubber:T.Material;metal:T.Material;teal:T.Material;shell:T.MeshPhysicalMaterial};
const TAU=Math.PI*2;
const rng=(seed:number)=>()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
function mesh(p:T.Object3D,g:T.BufferGeometry,m:T.Material,pos:XYZ=[0,0,0]){const o=new T.Mesh(g,m);o.position.set(...pos);p.add(o);return o;}
function box(p:T.Object3D,pos:XYZ,size:XYZ,m:T.Material){return mesh(p,new RoundedBoxGeometry(...size,2,Math.min(...size,.08)*.17),m,pos);}
function cyl(p:T.Object3D,pos:XYZ,r:number,h:number,m:T.Material,axis='y',n=40){const o=mesh(p,new T.CylinderGeometry(r,r,h,n),m,pos);if(axis==='z')o.rotation.x=Math.PI/2;if(axis==='x')o.rotation.z=Math.PI/2;return o;}
function ring(p:T.Object3D,pos:XYZ,r:number,t:number,m:T.Material,axis='y'){const o=mesh(p,new T.TorusGeometry(r,t,6,64),m,pos);if(axis==='y')o.rotation.x=Math.PI/2;else if(axis==='x')o.rotation.y=Math.PI/2;return o;}
function sleeve(p:T.Object3D,pos:XYZ,r:number,inner:number,h:number,m:T.Material,axis='y'){const o=mesh(p,new T.LatheGeometry([new T.Vector2(inner,-h/2),new T.Vector2(r,-h/2),new T.Vector2(r,h/2),new T.Vector2(inner,h/2),new T.Vector2(inner,-h/2)],64),m,pos);if(axis==='z')o.rotation.x=Math.PI/2;return o;}
function pipe(p:T.Object3D,points:XYZ[],r:number,m:T.Material){return mesh(p,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),56,r,12,false),m);}
function screw(p:T.Object3D,pos:XYZ,m:Palette,axis='y',r=.025){const g=new T.Group();p.add(g);g.position.set(...pos);if(axis==='z')g.rotation.x=Math.PI/2;cyl(g,[0,0,0],r*1.5,.012,m.metal);cyl(g,[0,.015,0],r,.025,m.metal,'y',6);cyl(g,[0,.029,0],r*.45,.004,m.rubber,'y',6);}
function tex(draw:(c:CanvasRenderingContext2D,n:number)=>void,n=1024){const e=document.createElement('canvas');e.width=e.height=n;draw(e.getContext('2d')!,n);const t=new T.CanvasTexture(e);t.anisotropy=8;return t;}
function instances(p:T.Object3D,g:T.BufferGeometry,m:T.Material,count:number,place:(o:T.Object3D,i:number)=>void){const im=new T.InstancedMesh(g,m,count),o=new T.Object3D();for(let i=0;i<count;i++){o.position.set(0,0,0);o.rotation.set(0,0,0);o.scale.set(1,1,1);place(o,i);o.updateMatrix();im.setMatrixAt(i,o.matrix);}im.computeBoundingSphere();p.add(im);return im;}

// Every piece is parented to its existing selectable component; moving parts keep their original pivots.
export function detailSkimmer(parts:Part[],groups:Record<string,T.Group>,m:Palette){
 const get=(id:string)=>parts.find(p=>p.id===id)!.group;
 const acrylic=m.shell.clone();acrylic.thickness=.055;acrylic.roughness=.065;
 const wetBlack=new T.MeshPhysicalMaterial({color:0x172021,roughness:.29,clearcoat:.65,clearcoatRoughness:.2});
 const steel=new T.MeshStandardMaterial({color:0x9ea5a5,metalness:.9,roughness:.3});
 const silicone=new T.MeshPhysicalMaterial({color:0xd6dfd7,roughness:.25,transparent:true,opacity:.60,depthWrite:false,clearcoat:.5});
 const amber=new T.MeshPhysicalMaterial({color:0x61401c,roughness:.24,clearcoat:1,clearcoatRoughness:.06});
 const deposit=tex((c,n)=>{const r=rng(64);for(let i=0;i<14000;i++){const x=r()*n,y=r()*n,s=.5+Math.pow(r(),3)*32,alpha=(.06+.36*r())*(.35+.65*(1-y/n)),g=c.createRadialGradient(x,y,0,x,y,s);g.addColorStop(0,`rgba(99,71,27,${alpha})`);g.addColorStop(.5,`rgba(147,112,50,${alpha*.8})`);g.addColorStop(1,'rgba(100,76,36,0)');c.fillStyle=g;c.fillRect(x-s,y-s,s*2,s*2);}for(let i=0;i<80;i++){const x=r()*n,y=r()*n*.7;c.strokeStyle='rgba(94,74,39,.19)';c.lineWidth=.6+r()*2;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+8,y+60,x+2,y+90+r()*180);c.stroke();}});deposit.colorSpace=T.SRGBColorSpace;
 const film=new T.MeshPhysicalMaterial({map:deposit,roughness:.3,transparent:true,opacity:.76,depthWrite:false,side:T.DoubleSide,clearcoat:.6});
 function droplets(p:T.Object3D,lo:number,hi:number,radius:(y:number)=>number,count:number,seed:number){const r=rng(seed);const dm=new T.MeshPhysicalMaterial({color:0xe5eee6,roughness:.075,transparent:true,opacity:.43,depthWrite:false,clearcoat:1});const d=instances(p,new T.SphereGeometry(1,7,5),dm,count,o=>{const y=lo+r()*(hi-lo),a=r()*TAU,s=.002+Math.pow(r(),3)*.012;o.position.set(Math.sin(a)*(radius(y)+.004),y,Math.cos(a)*(radius(y)+.004));o.rotation.y=a;o.scale.set(s,s*(1+r()*2.4),s*.27);});d.renderOrder=5;}

 const motor=get('skimmer-pump');motor.clear();
 cyl(motor,[0,0,-.06],.235,.44,m.white,'z');cyl(motor,[0,0,-.30],.234,.055,wetBlack,'z');
 for(let i=0;i<18;i++){const a=i/18*TAU,o=box(motor,[Math.cos(a)*.237,Math.sin(a)*.237,-.07],[.025,.027,.35],m.white);o.rotation.z=a;}
 sleeve(motor,[0,0,.20],.255,.075,.085,m.white,'z');ring(motor,[0,0,.247],.215,.011,m.rubber,'z');
 for(let i=0;i<4;i++){const a=i/4*TAU+.7;screw(motor,[Math.cos(a)*.198,Math.sin(a)*.198,.249],m,'z');}
 for(const x of [-.25,.25]){box(motor,[x,-.21,-.025],[.13,.08,.46],wetBlack);for(const z of [-.2,.14])screw(motor,[x,-.158,z],m);}
 pipe(motor,[[-.18,.01,-.30],[-.29,.04,-.38],[-.36,.18,-.53],[-.35,.44,-.66]],.025,m.rubber);
 for(let i=0;i<6;i++)ring(motor,[-.18,.01,-.31-i*.017],.036-i*.002,.006,m.rubber,'z');
 const labelMap=tex((c,n)=>{c.scale(n/1024,n/1024);c.fillStyle='#192327';c.fillRect(0,0,1024,1024);c.fillStyle='#d5dddd';c.font='bold 110px Arial';c.fillText('SKIM',70,190);c.font='60px Arial';c.fillText('AIR / WATER',70,300);c.fillStyle='#819899';for(let i=0;i<7;i++)c.fillRect(70,430+i*60,i%2?650:520,12);},512);labelMap.colorSpace=T.SRGBColorSpace;
 const label=mesh(motor,new T.PlaneGeometry(.24,.18),new T.MeshStandardMaterial({map:labelMap,roughness:.5}),[0,.237,-.075]);label.rotation.x=-Math.PI/2;

 const rotor=get('needle-wheel').children[0] as T.Group;rotor.clear();
 cyl(rotor,[0,0,-.17],.106,.32,wetBlack,'z');for(const z of [-.35,-.015])cyl(rotor,[0,0,z],.115,.026,m.white,'z');
 cyl(rotor,[0,0,0],.313,.055,wetBlack,'z');ring(rotor,[0,0,.032],.303,.008,m.teal,'z');
 for(let row=0;row<4;row++){const r=.07+row*.066,n=12+row*10;for(let i=0;i<n;i++){const a=i/n*TAU+row*.25;cyl(rotor,[Math.cos(a)*r,Math.sin(a)*r,.089],.010,.105,m.white,'z',6);}}
 cyl(rotor,[0,0,-.19],.029,.53,m.white,'z');sleeve(rotor,[0,0,.062],.07,.031,.066,m.teal,'z');

 const vent=get('venturi');vent.clear();
 const throat=mesh(vent,new T.LatheGeometry([new T.Vector2(.137,-.24),new T.Vector2(.137,-.10),new T.Vector2(.068,.055),new T.Vector2(.075,.12),new T.Vector2(.136,.3),new T.Vector2(.136,.41),new T.Vector2(.111,.41),new T.Vector2(.051,.11),new T.Vector2(.047,.055),new T.Vector2(.112,-.13),new T.Vector2(.112,-.24),new T.Vector2(.137,-.24)],56),m.white);throat.rotation.x=Math.PI/2;
 for(const z of [-.15,.30]){sleeve(vent,[0,0,z],.168,.116,.10,m.white,'z');ring(vent,[0,0,z+.06],.139,.009,m.rubber,'z');}
 sleeve(vent,[0,.165,.10],.048,.026,.28,m.teal);for(let i=0;i<4;i++)ring(vent,[0,.26+i*.017,.10],.049,.005,m.white);

 const diffuser=get('diffuser');
 for(const y of [-.017,.062])ring(diffuser,[0,y,0],.776,.012,acrylic);
 for(let i=0;i<6;i++){const a=i/6*TAU;cyl(diffuser,[Math.sin(a)*.713,-.092,Math.cos(a)*.713],.026,.18,wetBlack);screw(diffuser,[Math.sin(a)*.713,.064,Math.cos(a)*.713],m,'y',.018);}
 const body=get('reaction-body');droplets(body,-1.28,.78,y=>y<-.825?.913:.91-(y+.825)/1.65*.53,820,13);
 for(const y of [-1.335,-.834])ring(body,[0,y,0],.906,.009,m.rubber);
 for(let i=0;i<6;i++){const a=i/6*TAU;box(body,[Math.cos(a)*.916,-1.245,Math.sin(a)*.916],[.047,.095,.047],acrylic);}

 const neck=get('neck');droplets(neck,-.29,.32,()=>.348,170,41);
 mesh(neck,new T.CylinderGeometry(.333,.333,.64,64,1,true),film);
 for(const y of [-.255,-.202])ring(neck,[0,y,0],.354,.009,m.rubber);
 const cup=get('cup');
 // Replace the opaque flat waste insert with an annular pool, meniscus and irregular foam raft.
 for(const child of [...cup.children])if(child instanceof T.Mesh&&child.geometry instanceof T.ExtrudeGeometry&&Math.abs(child.position.y+.24)<.012)cup.remove(child);
 sleeve(cup,[0,-.20,0],.749,.352,.18,amber);
 const liquid=mesh(cup,new T.RingGeometry(.353,.75,96,5),amber,[0,-.105,0]);liquid.rotation.x=-Math.PI/2;
 const lp=liquid.geometry.attributes.position;for(let i=0;i<lp.count;i++)lp.setZ(i,.004*Math.sin(lp.getX(i)*47)*Math.cos(lp.getY(i)*31));liquid.geometry.computeVertexNormals();
 for(const r of [.354,.745])ring(cup,[0,-.103,0],r,.010,amber);
 mesh(cup,new T.CylinderGeometry(.773,.773,.56,80,1,true),film,[0,0,0]);droplets(cup,-.27,.29,()=>.786,1050,29);
 const foamMat=new T.MeshPhysicalMaterial({color:0xbca372,roughness:.38,clearcoat:.65}),rand=rng(387);
 instances(cup,new T.SphereGeometry(1,7,5),foamMat,1200,o=>{const a=rand()*TAU,r=.356+Math.sqrt(rand())*.385,s=.004+Math.pow(rand(),2)*.014;o.position.set(Math.cos(a)*r,-.092+.012*Math.sin(a*7)+rand()*.019,Math.sin(a)*r);o.scale.set(s,s*.60,s);});
 sleeve(cup,[.787,-.22,0],.047,.031,.10,m.white).rotation.z=Math.PI/2;
 for(let i=0;i<4;i++)ring(cup,[.833+i*.021,-.22,0],.04,.005,m.white,'x');
 ring(cup,[.879,-.22,0],.047,.008,steel,'x');box(cup,[.879,-.176,0],[.05,.025,.043],steel);screw(cup,[.879,-.155,0],m,'y',.012);
 pipe(cup,[[.91,-.22,0],[1.04,-.24,.05],[1.09,-.41,.10],[1.06,-.61,.11]],.034,m.rubber);

 const lid=get('cup-lid');lid.clear();const shape=new T.Shape();shape.absarc(0,0,.819,0,TAU,false);
 for(let i=0;i<24;i++){const a=i/24*TAU,hole=new T.Path();hole.absarc(Math.cos(a)*.59,Math.sin(a)*.59,.018,0,TAU,true);shape.holes.push(hole);}
 const cover=mesh(lid,new T.ExtrudeGeometry(shape,{depth:.045,bevelEnabled:true,bevelSize:.006,bevelThickness:.006,bevelSegments:2,curveSegments:32}),acrylic);cover.rotation.x=-Math.PI/2;
 sleeve(lid,[0,.013,0],.831,.798,.059,m.white);ring(lid,[0,-.024,0],.772,.010,m.rubber);
 cyl(lid,[0,.09,0],.093,.13,wetBlack);for(let i=0;i<16;i++){const a=i/16*TAU;box(lid,[Math.sin(a)*.094,.09,Math.cos(a)*.094],[.013,.09,.013],wetBlack);}screw(lid,[0,.169,0],m,'y',.026);
 for(let i=0;i<4;i++){const a=i/4*TAU+.4;screw(lid,[Math.cos(a)*.751,.05,Math.sin(a)*.751],m,'y',.014);}

 const silencer=get('silencer');silencer.clear();
 sleeve(silencer,[0,0,0],.152,.126,.38,acrylic);for(const y of [-.215,.215]){cyl(silencer,[0,y,0],.17,.075,m.white);ring(silencer,[0,y*.82,0],.151,.009,m.rubber);}
 for(const x of [-.05,.05])sleeve(silencer,[x,0,0],.027,.017,.39,wetBlack);
 for(const y of [-.105,0,.105])sleeve(silencer,[0,y,0],.124,.049,.009,m.white);
 sleeve(silencer,[-.05,.31,0],.044,.022,.14,m.white);sleeve(silencer,[.05,-.30,0],.042,.021,.14,m.white);
 for(let i=0;i<4;i++)ring(silencer,[.05,-.32-i*.017,0],.044,.005,m.white);
 pipe(silencer,[[.05,-.36,0],[.13,-.66,.18],[.09,-1.36,.49],[-1.13,-1.49,.95]],.036,silicone);
 box(silencer,[-.19,-.18,0],[.16,.045,.14],m.white);screw(silencer,[-.23,-.149,0],m,'y',.018);
 const outlet=get('skimmer-outlet');for(const y of [.18,.32,.5])ring(outlet,[.32,y,0],.147,.007,m.white);
 const dialMap=tex((c,n)=>{c.scale(n/1024,n/1024);c.fillStyle='#202a2c';c.fillRect(0,0,1024,1024);c.strokeStyle='#cddad4';c.lineWidth=5;for(let i=0;i<32;i++){const a=i/32*TAU;const r=i%4?405:365;c.beginPath();c.moveTo(512+Math.sin(a)*r,512+Math.cos(a)*r);c.lineTo(512+Math.sin(a)*468,512+Math.cos(a)*468);c.stroke();}c.fillStyle='#b4d6ce';c.font='bold 145px Arial';c.textAlign='center';c.fillText('LEVEL',512,470);c.font='95px Arial';c.fillText('−     +',512,600);},512);dialMap.colorSpace=T.SRGBColorSpace;
 const dial=mesh(outlet,new T.CircleGeometry(.155,64),new T.MeshStandardMaterial({map:dialMap,roughness:.4}),[.32,.978,0]);dial.rotation.x=-Math.PI/2;
 for(let i=0;i<18;i++){const a=i/18*TAU,o=box(outlet,[.32+Math.sin(a)*.204,.925,Math.cos(a)*.204],[.022,.073,.022],wetBlack);o.rotation.y=a;}

 // Small irregular foam cap breaks up the former uniform white cone at the riser lip.
 const wet=new T.Group();groups.skimmer.add(wet);const count=1900,positions=new Float32Array(count*3),sizes=new Float32Array(count),seeds=Array.from({length:count},()=>[rand(),rand(),rand()]);
 const sprite=tex((c,n)=>{const g=c.createRadialGradient(n*.43,n*.39,0,n*.5,n*.5,n*.48);g.addColorStop(0,'rgba(255,249,215,.3)');g.addColorStop(.66,'rgba(246,234,197,.09)');g.addColorStop(.8,'rgba(255,244,206,.7)');g.addColorStop(1,'rgba(235,209,153,0)');c.fillStyle=g;c.fillRect(0,0,n,n);},64);
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(positions,3));for(let i=0;i<count;i++)sizes[i]=.45+seeds[i][2]*1.2;geo.setAttribute('foamSize',new T.BufferAttribute(sizes,1));
 const fm=new T.PointsMaterial({map:sprite,color:0xc8b88d,size:.034,transparent:true,opacity:.70,depthWrite:false,alphaTest:.015});fm.onBeforeCompile=s=>{s.vertexShader='attribute float foamSize;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('gl_PointSize = size;','gl_PointSize = size * foamSize;');};
 wet.add(new T.Points(geo,fm));
 return {visibility:(v:boolean)=>{wet.visible=v;},update:(time:number)=>{for(let i=0;i<count;i++){const [a,b,c]=seeds[i],phase=(b+time*(.065+c*.025))%1,angle=a*TAU+time*.09,r=(.08+.24*Math.sqrt(c))*(1+.05*Math.sin(time*.6+a*19));positions[i*3]=Math.cos(angle)*r;positions[i*3+1]=2.84+phase*.34+.02*Math.sin(angle*5+time*.8);positions[i*3+2]=Math.sin(angle)*r;}geo.attributes.position.needsUpdate=true;}};
}
