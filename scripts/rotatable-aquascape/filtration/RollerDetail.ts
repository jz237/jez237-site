import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import type {Part} from './model.ts';

type XYZ=[number,number,number];
type Palette={white:T.Material;dark:T.Material;metal:T.Material;rubber:T.Material;teal:T.Material;shell:T.MeshPhysicalMaterial};
const TAU=Math.PI*2;
const seeded=(seed:number)=>()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
function add(parent:T.Object3D,geometry:T.BufferGeometry,material:T.Material,pos:XYZ=[0,0,0]){const mesh=new T.Mesh(geometry,material);mesh.position.set(...pos);parent.add(mesh);return mesh;}
function box(p:T.Object3D,xyz:XYZ,size:XYZ,m:T.Material){return add(p,new RoundedBoxGeometry(...size,2,Math.min(...size,.10)*.16),m,xyz);}
function cylinder(p:T.Object3D,xyz:XYZ,r:number,h:number,m:T.Material,axis='y',segments=32){const o=add(p,new T.CylinderGeometry(r,r,h,segments),m,xyz);if(axis==='x')o.rotation.z=-Math.PI/2;if(axis==='z')o.rotation.x=Math.PI/2;return o;}
function ring(p:T.Object3D,xyz:XYZ,r:number,t:number,m:T.Material,axis='y'){const o=add(p,new T.TorusGeometry(r,t,6,48),m,xyz);if(axis==='x')o.rotation.y=Math.PI/2;else if(axis==='y')o.rotation.x=Math.PI/2;return o;}
function sleeve(p:T.Object3D,xyz:XYZ,r:number,inner:number,h:number,m:T.Material,axis='y'){const o=add(p,new T.LatheGeometry([new T.Vector2(inner,-h/2),new T.Vector2(r,-h/2),new T.Vector2(r,h/2),new T.Vector2(inner,h/2),new T.Vector2(inner,-h/2)],48),m,xyz);if(axis==='x')o.rotation.z=-Math.PI/2;return o;}
function pipe(p:T.Object3D,points:XYZ[],r:number,m:T.Material){return add(p,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),48,r,12,false),m);}
function pvc(p:T.Object3D,points:XYZ[],r:number,m:T.Material){
 const ps=points.map(v=>new T.Vector3(...v)),path=new T.CurvePath<T.Vector3>();let last=ps[0];
 for(let i=1;i<ps.length-1;i++){const corner=ps[i],radius=Math.min(.15,corner.distanceTo(ps[i-1])*.46,corner.distanceTo(ps[i+1])*.46),a=corner.clone().addScaledVector(ps[i-1].clone().sub(corner).normalize(),radius),b=corner.clone().addScaledVector(ps[i+1].clone().sub(corner).normalize(),radius);path.add(new T.LineCurve3(last,a));path.add(new T.QuadraticBezierCurve3(a,corner,b));last=b;}
 path.add(new T.LineCurve3(last,ps.at(-1)!));return add(p,new T.TubeGeometry(path,64,r,16,false),m);
}
function screw(p:T.Object3D,xyz:XYZ,m:Palette,axis='x',r=.027){const g=new T.Group();p.add(g);g.position.set(...xyz);if(axis==='x')g.rotation.z=xyz[0]<0?Math.PI/2:-Math.PI/2;if(axis==='z')g.rotation.x=Math.PI/2;cylinder(g,[0,0,0],r*1.48,.014,m.metal);cylinder(g,[0,.017,0],r,.024,m.metal);cylinder(g,[0,.030,0],r*.43,.003,m.rubber,'y',6);}
function texture(draw:(c:CanvasRenderingContext2D,n:number)=>void,n=1024){const canvas=document.createElement('canvas');canvas.width=canvas.height=n;draw(canvas.getContext('2d')!,n);const t=new T.CanvasTexture(canvas);t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;return t;}
function instanced(p:T.Object3D,g:T.BufferGeometry,m:T.Material,count:number,place:(i:number,o:T.Object3D)=>void){const mesh=new T.InstancedMesh(g,m,count),o=new T.Object3D();for(let i=0;i<count;i++){o.position.set(0,0,0);o.rotation.set(0,0,0);o.scale.set(1,1,1);place(i,o);o.updateMatrix();mesh.setMatrixAt(i,o.matrix);}mesh.computeBoundingSphere();p.add(mesh);return mesh;}

/** Detail belongs to the eight existing selectable parts, including rotating spool children.
 * Wet effects use the same model clock and disappear during separation/isolation. */
export function detailRoller(parts:Part[],groups:Record<string,T.Group>,m:Palette){
 const part=(id:string)=>parts.find(p=>p.id===id)!;
 const get=(id:string)=>part(id).group;
 const glass=m.shell.clone();glass.thickness=.024;glass.roughness=.075;glass.transmission=.85;glass.opacity=.64;
 const black=new T.MeshPhysicalMaterial({color:0x182021,roughness:.33,clearcoat:.55,clearcoatRoughness:.24});
 const aluminum=new T.MeshStandardMaterial({color:0x626971,metalness:.72,roughness:.39});

 // Nonwoven fibers, rather than a woven cloth pattern or large sponge-like spots.
 const fiber=texture((c,n)=>{const r=seeded(563);c.fillStyle='#dbd9cd';c.fillRect(0,0,n,n);for(let i=0;i<43000;i++){const x=r()*n,y=r()*n,len=2+r()*12,angle=r()*TAU;c.strokeStyle=r()>.23?'rgba(255,255,248,.43)':'rgba(83,83,64,.24)';c.lineWidth=.35+r()*.95;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+Math.cos(angle+.4)*len*.45,y+Math.sin(angle+.4)*len*.45,x+Math.cos(angle)*len,y+Math.sin(angle)*len);c.stroke();}for(let i=0;i<2300;i++){c.fillStyle='rgba(66,71,57,.18)';c.beginPath();c.ellipse(r()*n,r()*n,.5+r()*1.5,.3+r()*.6,r()*TAU,0,TAU);c.fill();}});fiber.colorSpace=T.SRGBColorSpace;
 const loaded=texture((c,n)=>{c.drawImage(fiber.image,0,0);const r=seeded(564);c.fillStyle='rgba(108,83,41,.22)';c.fillRect(0,0,n,n);for(let i=0;i<4600;i++){const x=r()*n,y=r()*n,s=1+Math.pow(r(),2)*24,g=c.createRadialGradient(x,y,0,x,y,s);g.addColorStop(0,`rgba(69,55,26,${.09+r()*.29})`);g.addColorStop(1,'rgba(99,76,33,0)');c.fillStyle=g;c.fillRect(x-s,y-s,s*2,s*2);}for(let i=0;i<3000;i++){const x=r()*n,y=r()*n;c.fillStyle=r()>.6?'rgba(198,180,126,.6)':'rgba(57,48,26,.45)';c.fillRect(x,y,.6+r()*2,.5+r()*1.5);}});loaded.colorSpace=T.SRGBColorSpace;
 const fiberBump=fiber.clone();fiberBump.colorSpace=T.NoColorSpace;

 const frame=get('roller-frame');frame.clear();
 for(const x of [-.95,.95]){
  box(frame,[x,0,0],[.16,.16,2.16],black);
  for(const z of [-.84,.84]){cylinder(frame,[x,-.14,z],.115,.15,m.rubber);ring(frame,[x,-.079,z],.102,.008,aluminum);screw(frame,[x,.088,z],m,'y');}
  const shape=new T.Shape();shape.moveTo(-.94,.04);shape.lineTo(.94,.04);shape.lineTo(.94,2.18);shape.quadraticCurveTo(.89,2.38,.75,2.35);shape.quadraticCurveTo(.58,2.35,.55,2.16);shape.lineTo(.39,.46);shape.quadraticCurveTo(.38,.32,.22,.32);shape.lineTo(-.22,.32);shape.quadraticCurveTo(-.38,.32,-.39,.46);shape.lineTo(-.55,2.16);shape.quadraticCurveTo(-.58,2.35,-.75,2.35);shape.quadraticCurveTo(-.89,2.38,-.94,2.18);shape.closePath();
  const plate=add(frame,new T.ExtrudeGeometry(shape,{depth:.082,bevelEnabled:true,bevelSize:.012,bevelThickness:.012,bevelSegments:2,curveSegments:18}),m.white,[x-.041,0,0]);plate.rotation.y=Math.PI/2;
  for(const z of [-.78,.78]){
   sleeve(frame,[x+Math.sign(x)*.063,2.17,z],.137,.073,.06,black,'x');ring(frame,[x+Math.sign(x)*.105,2.17,z],.10,.012,aluminum,'x');
   for(const y of [.19,.72,1.48,1.91])screw(frame,[x+Math.sign(x)*.061,y,z*.93],m,'x');
  }
  for(const z of [-.83,.83]){box(frame,[x,.29,z],[.20,.06,.22],black);screw(frame,[x,.326,z],m,'y',.022);}
 }
 for(const z of [-.97,.97]){box(frame,[0,0,z],[1.85,.13,.14],black);box(frame,[0,.34,z],[1.87,.047,.047],black);box(frame,[0,1.10,z],[1.87,.044,.056],black);
  const pane=add(frame,new T.BoxGeometry(1.83,.74,.026),glass,[0,.72,z]);pane.renderOrder=3;
  for(let i=0;i<29;i++)box(frame,[-.88+i*.063,1.19,z],[.026,.18,.049],black);
  for(const x of [-.89,.89])for(const y of [.37,1.06])screw(frame,[x,y,z+Math.sign(z)*.022],m,'z',.019);
 }
 for(const x of [-.95,.95])for(let i=0;i<9;i++){box(frame,[x+Math.sign(x)*.057,.45+i*.063,.05],[.005,.005,i%4===0?.09:.05],aluminum);}
 const drops=seeded(712),dropMat=new T.MeshPhysicalMaterial({color:0xe5f3ee,roughness:.1,clearcoat:1,transparent:true,opacity:.4,depthWrite:false});
 for(const z of [-.985,.985])instanced(frame,new T.SphereGeometry(1,6,4),dropMat,290,(_,o)=>{const r=.003+Math.pow(drops(),2)*.009;o.position.set((drops()-.5)*1.77,.39+drops()*.64,z);o.scale.set(r,r*(1+drops()*2),r*.22);});

 // Reinforced cradle with open slats and rounded lower supports, retained as a removable part.
 const cradle=get('cradle');cradle.clear();
 for(const z of [-.59,.59]){for(let i=0;i<20;i++)box(cradle,[-.81+i*.085,.01,z],[.030,.97,.036],black);for(const y of [-.46,-.10,.30,.49])box(cradle,[0,y,z],[1.72,.039,.048],black);}
 for(let i=0;i<18;i++)box(cradle,[-.81+i*.095,-.435,0],[.026,.035,1.18],black);
 for(const x of [-.845,.845]){pipe(cradle,[[x,.47,-.59],[x,-.33,-.59],[x,-.465,0],[x,-.33,.59],[x,.47,.59]],.034,black);for(const z of [-.59,.59])screw(cradle,[x,.48,z],m,'y',.018);}

 for(const [id,used,radius] of [['clean-roll',false,.375],['waste-roll',true,.350]] as const){
  const rotor=get(id).children[0] as T.Group;rotor.clear();
  const cloth=new T.MeshStandardMaterial({map:used?loaded:fiber,bumpMap:fiberBump,bumpScale:.008,color:used?0xd8c8a1:0xfffef7,roughness:.94});
  const profile=[new T.Vector2(.092,-.85),new T.Vector2(radius-.014,-.85),new T.Vector2(radius,-.835),new T.Vector2(radius+.002,-.6),new T.Vector2(radius,0),new T.Vector2(radius+.003,.6),new T.Vector2(radius-.004,.84),new T.Vector2(.092,.85)];
  const geometry=new T.LatheGeometry(profile,112),pos=geometry.attributes.position;
  for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i),a=Math.atan2(z,x),rr=Math.hypot(x,z),k=rr>.2?1+.003*Math.sin(a*17+pos.getY(i)*20)+.0015*Math.sin(a*43):1;pos.setXYZ(i,x*k,pos.getY(i),z*k);}geometry.computeVertexNormals();
  const roll=add(rotor,geometry,cloth);roll.rotation.z=-Math.PI/2;
  const ends=texture((c,n)=>{const rr=seeded(used?181:182);c.fillStyle=used?'#b2a07b':'#ecebe3';c.fillRect(0,0,n,n);for(let j=0;j<62;j++){const r=n*.12+j*n*.00605;c.strokeStyle=used?'rgba(64,49,27,.52)':'rgba(99,97,77,.32)';c.lineWidth=.65+rr()*1.6;c.beginPath();for(let k=0;k<=190;k++){const a=k/190*TAU,v=r+Math.sin(a*7+j*.4)*1.15+Math.sin(a*19)*.6,x=n/2+Math.cos(a)*v,y=n/2+Math.sin(a)*v;k?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}for(let i=0;i<18000;i++){const x=rr()*n,y=rr()*n;c.fillStyle=rr()>.35?'rgba(255,252,229,.2)':'rgba(46,43,28,.13)';c.fillRect(x,y,.5+rr(),.6+rr()*1.3);}});ends.colorSpace=T.SRGBColorSpace;
  const endMat=new T.MeshStandardMaterial({map:ends,bumpMap:ends,bumpScale:.004,roughness:.92});
  for(const x of [-.853,.853]){const disk=add(rotor,new T.RingGeometry(.092,radius-.002,96),endMat,[x,0,0]);disk.rotation.y=x>0?Math.PI/2:-Math.PI/2;sleeve(rotor,[x*1.025,0,0],.105,.064,.07,black,'x');ring(rotor,[x*1.06,0,0],.088,.011,aluminum,'x');}
  cylinder(rotor,[0,0,0],.065,2.14,m.metal,'x');
  for(const x of [-1.075,1.075]){cylinder(rotor,[x,0,0],.092,.05,black,'x');screw(rotor,[x+Math.sign(x)*.028,0,0],m,'x',.034);}
  const r=seeded(used?555:666),lines:number[]=[];
  for(let i=0;i<3500;i++){const x=(r()-.5)*1.69,a=r()*TAU,rad=radius+.002,s=.003+r()*.014;lines.push(x,Math.cos(a)*rad,Math.sin(a)*rad,x+(r()-.5)*.014,Math.cos(a+.012)*(rad+s),Math.sin(a+.012)*(rad+s));}
  const fuzz=new T.BufferGeometry();fuzz.setAttribute('position',new T.Float32BufferAttribute(lines,3));rotor.add(new T.LineSegments(fuzz,new T.LineBasicMaterial({color:used?0xc4b18c:0xfffcee,transparent:true,opacity:.43})));
 }

 // Keep the original animated material and texture object so an advance really moves the cloth.
 const fleece=get('fleece'),oldMesh=fleece.children.find(o=>o instanceof T.Mesh) as T.Mesh;
 const material=oldMesh.material as T.MeshStandardMaterial;material.map!.image=fiber.image;material.map!.needsUpdate=true;material.bumpMap=fiberBump;material.bumpScale=.007;material.color.set(0xffffff);material.vertexColors=true;material.needsUpdate=true;fleece.clear();
 const curve=new T.CatmullRomCurve3([new T.Vector3(0,2.42,-.405),new T.Vector3(0,1.18,-.62),new T.Vector3(0,.61,-.66),new T.Vector3(0,.405,0),new T.Vector3(0,.61,.66),new T.Vector3(0,1.18,.62),new T.Vector3(0,2.42,.43)]);
 const strip=new T.BufferGeometry(),positions:number[]=[],uv:number[]=[],colors:number[]=[],indices:number[]=[],cleanColor=new T.Color(0xf0efe4),dirtyColor=new T.Color(0xa68e60),col=new T.Color();
 function point(t:number,x:number){const v=curve.getPoint(T.MathUtils.clamp(t,0,1));v.x=x;v.z+=.004*Math.sin(x*35+t*51)*Math.sin(Math.PI*t)+.002*Math.sin(x*80+t*29);return v;}
 for(let j=0;j<=160;j++)for(let i=0;i<=48;i++){const t=j/160,x=-.82+i/48*1.64,v=point(t,x),load=T.MathUtils.smoothstep(t,.15,.65),variation=.045*Math.sin(x*26+t*31)+.026*Math.sin(x*59-t*73);positions.push(v.x,v.y,v.z);uv.push(i/48,t*2.6);col.copy(cleanColor).lerp(dirtyColor,Math.max(0,load*.85+variation)).multiplyScalar(1-.07*load*Math.cos(t*19+x*11));colors.push(col.r,col.g,col.b);if(i<48&&j<160){const a=j*49+i;indices.push(a,a+1,a+49,a+1,a+50,a+49);}}
 strip.setAttribute('position',new T.Float32BufferAttribute(positions,3));strip.setAttribute('normal',new T.Float32BufferAttribute(new Float32Array(positions.length),3));strip.setAttribute('uv',new T.Float32BufferAttribute(uv,2));strip.setAttribute('color',new T.Float32BufferAttribute(colors,3));strip.setIndex(indices);strip.computeVertexNormals();add(fleece,strip,material);
 const edgeLines:number[]=[];for(const side of [-1,1])for(let j=0;j<650;j++){const t=j/650,v=point(t,side*.821),w=point(t+.0015,side*(.824+.004*Math.sin(j*2)));edgeLines.push(...v.toArray(),...w.toArray());}const eg=new T.BufferGeometry();eg.setAttribute('position',new T.Float32BufferAttribute(edgeLines,3));fleece.add(new T.LineSegments(eg,new T.LineBasicMaterial({color:0xc4ba99,transparent:true,opacity:.55})));
 const random=seeded(818),particles=Array.from({length:460},()=>({t:.27+random()*.69,x:(random()-.5)*1.56,s:.002+Math.pow(random(),2)*.013,a:random()*TAU})),dummy=new T.Object3D();
 const debris=new T.InstancedMesh(new T.IcosahedronGeometry(1,0),new T.MeshStandardMaterial({color:0x7b6844,roughness:.94}),particles.length);fleece.add(debris);let lastAdvance=NaN;
 function moveDebris(advance:number){if(advance===lastAdvance)return;lastAdvance=advance;for(let i=0;i<particles.length;i++){const p=particles[i],t=.27+((p.t-.27+advance)% .70),v=point(t,p.x),tangent=curve.getTangent(t),normal=new T.Vector3(0,-tangent.z,tangent.y).normalize();dummy.position.copy(v).addScaledVector(normal,.005);dummy.scale.set(p.s*1.4,p.s,p.s*.6);dummy.rotation.set(p.a,p.a*.7,p.a*.3);dummy.updateMatrix();debris.setMatrixAt(i,dummy.matrix);debris.setColorAt(i,new T.Color([0x766644,0xb7aa77,0x4c4b31][i%3]));}debris.instanceMatrix.needsUpdate=true;debris.computeBoundingSphere();}
 moveDebris(0);

 // Gearbox cover, split gasket, bearing boss, fluted motor can and captive socket screws.
 const motor=get('roller-motor');motor.clear();
 box(motor,[0,0,0],[.36,.49,.49],aluminum);box(motor,[.19,0,0],[.017,.463,.463],m.rubber);box(motor,[.212,0,0],[.046,.47,.47],aluminum);
 for(const y of [-.181,.181])for(const z of [-.181,.181])screw(motor,[.24,y,z],m,'x',.029);
 sleeve(motor,[-.24,0,0],.128,.068,.17,black,'x');ring(motor,[-.33,0,0],.11,.008,m.metal,'x');
 cylinder(motor,[0,-.46,0],.185,.44,aluminum);for(const y of [-.245,-.665]){cylinder(motor,[0,y,0],.191,.045,black);ring(motor,[0,y,0],.177,.008,m.metal);}
 for(let i=0;i<16;i++){const a=i/16*TAU,o=box(motor,[Math.cos(a)*.188,-.46,Math.sin(a)*.188],[.025,.37,.018],aluminum);o.rotation.y=-a;}
 cylinder(motor,[0,-.74,-.04],.05,.12,black);for(let i=0;i<6;i++)ring(motor,[0,-.717-i*.018,-.04],.050-i*.003,.005,m.rubber);
 pipe(motor,[[0,-.79,-.04],[.05,-.95,-.14],[.13,-1.22,-.17],[.05,-1.58,-.31]],.021,m.rubber);
 const badge=texture((c,n)=>{c.scale(n/1024,n/1024);c.fillStyle='#142126';c.fillRect(0,0,1024,1024);c.strokeStyle='#71858a';c.lineWidth=8;c.strokeRect(20,20,984,984);c.fillStyle='#c5d2ce';c.font='bold 115px Arial';c.fillText('FLEECE',72,195);c.font='75px Arial';c.fillText('LEVEL DRIVE',72,310);c.fillStyle='#76938f';for(let i=0;i<5;i++)c.fillRect(75,430+i*66,i%2?660:540,13);c.font='48px Arial';c.fillText('ILLUSTRATIVE MODEL',72,902);},512);badge.colorSpace=T.SRGBColorSpace;
 const label=add(motor,new T.PlaneGeometry(.255,.255),new T.MeshStandardMaterial({map:badge,roughness:.54}),[.238,0,0]);label.rotation.y=Math.PI/2;

 // Optical-style probe and adjustable bracket; retain the existing experiment's LED object.
 const sensorPart=part('sensor'),sensor=sensorPart.group,led=sensor.children[1];sensor.clear();led.userData.dynamic=true;sensor.add(led);led.position.set(.129,.19,.045);sensorPart.base.set(.94,1.88,.19);sensor.position.copy(sensorPart.base);
 box(sensor,[.045,.14,0],[.13,.16,.20],m.white);box(sensor,[.09,.14,.30],[.055,.16,.63],m.white);screw(sensor,[.128,.14,.60],m,'x',.021);
 cylinder(sensor,[0,-.045,0],.067,.43,aluminum);cylinder(sensor,[0,.224,0],.073,.16,black);ring(sensor,[0,.14,0],.073,.014,m.teal);sleeve(sensor,[0,-.255,0],.077,.054,.068,black);
 const lens=add(sensor,new T.SphereGeometry(.055,20,12),glass,[0,-.295,0]);lens.scale.y=.5;
 pipe(sensor,[[0,.31,0],[0,.49,.01],[-.04,.64,-.15],[.015,.73,-.38]],.021,m.rubber);for(let i=0;i<5;i++)ring(sensor,[0,.32+i*.018,0],.027,.004,black);

 // Hollow union and downward outlet. The inlet anchor remains aligned to the full sump drain.
 const inlet=get('roller-inlet');inlet.clear();pvc(inlet,[[-.8,.15,-.5],[-.8,-.12,-.5],[-.37,-.12,-.21],[-.37,-.52,-.21]],.11,m.white);
 sleeve(inlet,[-.8,.15,-.5],.198,.131,.22,m.white);for(let i=0;i<16;i++){const a=i/16*TAU,o=box(inlet,[-.8+Math.cos(a)*.198,.15,-.5+Math.sin(a)*.198],[.025,.17,.025],m.white);o.rotation.y=-a;}
 for(const y of [.02,.28])ring(inlet,[-.8,y,-.5],.146,.011,m.rubber);sleeve(inlet,[-.37,-.50,-.21],.145,.114,.10,black);

 const wet=new T.Group();groups.roller.add(wet);const volume=groups.roller.getObjectByName('roller-water-volume')!;
 const timeUniform={value:0},ripple=texture((c,n)=>{c.fillStyle='#888';c.fillRect(0,0,n,n);for(let j=0;j<65;j++){c.strokeStyle=`rgba(235,240,232,${.10+(j%5)*.04})`;c.lineWidth=1+(j%3);c.beginPath();for(let i=0;i<=n;i+=4){const y=j*n/65+6*Math.sin(i*.041+j*.6)+2*Math.sin(i*.14+j);i?c.lineTo(i,y):c.moveTo(i,y);}c.stroke();}},256);
 const waterMat=new T.MeshPhysicalMaterial({color:0xc4c9b0,roughness:.10,metalness:.05,transparent:true,opacity:.32,depthWrite:false,bumpMap:ripple,bumpScale:.017,side:T.DoubleSide});
 waterMat.onBeforeCompile=shader=>{shader.uniforms.rollerTime=timeUniform;shader.vertexShader='uniform float rollerTime;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed.z+=.003*sin(position.x*31.0+rollerTime*2.4)*sin(position.y*19.0-rollerTime*1.5);');};
 const surface=add(wet,new T.PlaneGeometry(1.60,1.08,40,32),waterMat,[0,1.10,0]);surface.rotation.x=-Math.PI/2;
 const stream=add(wet,new T.CylinderGeometry(.096,.11,.28,20,1,true),new T.MeshPhysicalMaterial({color:0xcddecd,roughness:.13,transparent:true,opacity:.3,depthWrite:false,side:T.DoubleSide}),[-.37,1.25,-.51]);
 const foamGeo=new T.BufferGeometry(),foamPos=new Float32Array(220*3),foamSeeds=Array.from({length:220},()=>[random(),random(),random()]);foamGeo.setAttribute('position',new T.BufferAttribute(foamPos,3));
 const dots=texture((c,n)=>{const g=c.createRadialGradient(n*.40,n*.35,1,n*.5,n*.5,n*.47);g.addColorStop(0,'rgba(241,245,226,.8)');g.addColorStop(.45,'rgba(235,239,220,.04)');g.addColorStop(.81,'rgba(241,245,226,.7)');g.addColorStop(1,'rgba(241,245,226,0)');c.fillStyle=g;c.fillRect(0,0,n,n);},32);
 wet.add(new T.Points(foamGeo,new T.PointsMaterial({map:dots,size:.022,transparent:true,opacity:.65,depthWrite:false})));
 return {visibility:(v:boolean)=>{wet.visible=v;},update:(time:number)=>{moveDebris(-material.map!.offset.y/2.6);timeUniform.value=time;ripple.offset.set(time*.017,-time*.031);const level=volume.position.y+.175*volume.scale.y;surface.position.y=level;const gap=Math.max(.025,1.39-level);stream.position.y=level+gap/2;stream.scale.y=gap/.28;stream.visible=level<1.39;for(let i=0;i<foamSeeds.length;i++){const [a,b,c]=foamSeeds[i],phase=(a+time*.27)%1;foamPos[i*3]=-.37+Math.cos(b*TAU)*(.02+phase*.24);foamPos[i*3+1]=level+.008+Math.sin(time*2+c*TAU)*.003;foamPos[i*3+2]=-.36+Math.sin(b*TAU)*(.02+phase*.19);}foamGeo.attributes.position.needsUpdate=true;}};
}
