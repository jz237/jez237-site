import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {mkdirSync,writeFileSync} from 'node:fs';
// Deterministic, editable museum model. Units are illustrative, not service dimensions.
globalThis.FileReader=class {readAsArrayBuffer(b){b.arrayBuffer().then(x=>{this.result=x;this.onloadend?.();});} readAsDataURL(b){b.arrayBuffer().then(x=>{this.result='data:application/octet-stream;base64,'+Buffer.from(x).toString('base64');this.onloadend?.();});}};
const root=new T.Group();root.name='Arcade_1981';
const mat=(name,color,metalness=0,roughness=.65)=>new T.MeshStandardMaterial({name,color,metalness,roughness});
const wood=mat('painted_wood','#171919',.05,.78),edge=mat('rubber_trim','#090b0c',.1,.45),metal=mat('aged_steel','#787a73',.8,.43),black=mat('black_metal','#292c2b',.7,.42),gold=mat('brass','#a48a4d',.65,.4),pcb=mat('circuit_board','#174d37',.15,.75),chip=mat('integrated_circuit','#171918',.15,.8),red=mat('button_red','#b42c20',.15,.22),yellow=mat('button_amber','#e9ad32',.1,.3),cream=mat('button_ivory','#c9c5ab',.05,.4),blue=mat('button_blue','#296880',.2,.3);
const mesh=(g,geo,m,pos=[0,0,0],name='')=>{const o=new T.Mesh(geo,m);o.position.set(...pos);o.name=name;g.add(o);return o;};
const box=(g,s,p,m,r=.015,name='')=>mesh(g,r?new RoundedBoxGeometry(...s,1,r):new T.BoxGeometry(...s),m,p,name);
const cyl=(g,r,h,p,m,rot=[0,0,0],name='')=>{const o=mesh(g,new T.CylinderGeometry(r,r,h,16),m,p,name);o.rotation.set(...rot);return o;};
const part=(name)=>{const g=new T.Group();g.name=name;root.add(g);return g;};
const screw=(g,p)=>{cyl(g,.013,.012,p,metal,[Math.PI/2,0,0]);box(g,[.016,.003,.003],[p[0],p[1],p[2]+.009],edge,0);};
const frame=part('chassis');
box(frame,[1.4,.14,1.28],[0,.12,0],black);box(frame,[1.3,.09,1.13],[0,.35,0],wood);
for(const x of [-.61,.61])for(const z of [-.53,.49]){box(frame,[.065,3.1,.065],[x,1.65,z],black);box(frame,[.08,.09,.08],[x,.045,z],edge);}
for(const y of [.45,1.4,2.65,3.27])box(frame,[1.25,.065,.055],[0,y,-.54],metal);
const outline=[[-.65,.12],[.57,.12],[.66,1.48],[.83,1.53],[.83,1.7],[.48,1.83],[.34,2.62],[.69,2.93],[.69,3.37],[-.65,3.37]];
for(const [name,x] of [['left_panel',-.715],['right_panel',.655]]){
 const g=part(name),s=new T.Shape();outline.forEach(([z,y],i)=>i?s.lineTo(z,y):s.moveTo(z,y));s.closePath();
 const geo=new T.ExtrudeGeometry(s,{depth:.06,bevelEnabled:true,bevelThickness:.005,bevelSize:.007,bevelSegments:1,steps:1});geo.rotateY(-Math.PI/2);geo.translate(x+.06,0,0);
 // Side UVs cover the original portrait print; generated geometry is retained in GLB.
 const p=geo.attributes.position,uv=geo.attributes.uv;for(let i=0;i<p.count;i++)uv.setXY(i,(p.getZ(i)+.65)/1.48,p.getY(i)/3.4);
 mesh(g,geo,wood,[0,0,0],name+'_wood');
 const pts=outline.map(([z,y])=>new T.Vector3(x+(x<0?-.002:.065),y,z));pts.push(pts[0]);mesh(g,new T.TubeGeometry(new T.CatmullRomCurve3(pts,false,'catmullrom',0),72,.018,5,false),edge);
 for(const y of [.22,1.3,2.85,3.25])cyl(g,.015,.071,[x+.03,y,-.51],metal,[0,0,Math.PI/2]);
}
const back=part('back_panel');box(back,[1.29,2.95,.06],[0,1.78,-.63],wood);
for(let i=0;i<10;i++)box(back,[.66,.013,.008],[0,.7+i*.045,-.665],edge,0);
const marquee=part('marquee');box(marquee,[1.34,.46,.52],[0,3.12,.4],black);box(marquee,[1.22,.34,.02],[0,3.12,.676],mat('marquee_glow','#f4b84d',.1,.5),.01,'marquee_print');
for(const x of [-.635,.635])for(const y of [2.93,3.31])screw(marquee,[x,y,.68]);
const crt=part('crt');box(crt,[1.2,1.02,.13],[0,2.27,.4],black,.09);box(crt,[1.08,.83,.13],[0,2.27,.49],edge,.11);
const screen=box(crt,[.98,.73,.08],[0,2.28,.56],mat('phosphor','#132226',.15,.17),.105,'crt_screen');
const bell=mesh(crt,new T.CylinderGeometry(.43,.13,.65,12),mat('tube_glass','#525957',.55,.28),[0,2.28,-.02]);bell.rotation.x=Math.PI/2;box(crt,[.3,.28,.25],[0,2.28,-.42],black);
for(const x of [-.58,.58]){box(crt,[.04,1.01,.48],[x,2.27,.18],metal);for(const y of [1.8,2.74])screw(crt,[x,y,.44]);}
const cp=part('controls');box(cp,[1.35,.12,.55],[0,1.65,.6],black,.025);box(cp,[1.24,.012,.44],[0,1.719,.62],mat('control_print','#292626',.15,.5),.01,'control_print');
box(cp,[1.29,.09,.025],[0,1.61,.881],metal);cyl(cp,.085,.012,[-.39,1.738,.62],metal);
const joystick=new T.Group();joystick.name='joystick';joystick.position.set(-.39,1.74,.62);cp.add(joystick);cyl(joystick,.019,.2,[0,.1,0],metal);mesh(joystick,new T.SphereGeometry(.065,20,12),red,[0,.22,0]);
for(const [i,x,z,m] of [[0,-.05,.63,blue],[1,.16,.6,cream],[2,.36,.6,red],[3,.52,.59,yellow],[4,.14,.79,cream],[5,.35,.78,red]]){cyl(cp,.061,.026,[x,1.738,z],edge);cyl(cp,.047,.035,[x,1.757,z],m,[0,0,0],'button_'+i);box(cp,[.07,.025,.03],[x,1.49,z],gold);box(cp,[.09,.006,.024],[x,1.515,z],gold,0,'leaf_'+i);}
for(const x of [-.61,.61])for(const z of [.41,.82])cyl(cp,.012,.005,[x,1.735,z],metal);
const coin=part('coin');box(coin,[1.27,1.12,.08],[0,.99,.51],wood);box(coin,[.67,.81,.07],[0,1,.59],metal,.03);box(coin,[.6,.74,.075],[0,1,.64],black,.03);
for(const x of [-.15,.15]){box(coin,[.19,.22,.025],[x,1.2,.689],edge);box(coin,[.11,.13,.012],[x,1.22,.707],mat('coin_lamp','#d55020',.2,.4),.008,'coin_lamp');box(coin,[.057,.009,.008],[x,1.25,.718],black);}
box(coin,[.38,.15,.04],[0,.81,.704],edge);cyl(coin,.025,.015,[.24,1,.705],gold,[Math.PI/2,0,0]);box(coin,[.46,.23,.34],[0,.58,.25],metal);for(const x of [-.26,.26])for(const y of [.68,1.32])screw(coin,[x,y,.69]);
cyl(coin,.048,.007,[.15,1.2,.45],gold,[Math.PI/2,0,0],'travelling_coin');
const boards=part('logic');for(const [j,z]of [[0,-.27],[1,-.42]]){box(boards,[.88,.68,.025],[.03,1.94,z],pcb,.004);for(let row=0;row<5;row++)for(let col=0;col<7;col++){const x=-.31+col*.112,y=1.69+row*.115;box(boards,[.066,.078,.021],[x,y,z+.025],chip,.004);for(const dx of [-.039,.039])for(let k=0;k<4;k++)box(boards,[.012,.005,.006],[x+dx,y-.028+k*.018,z+.033],gold,0);}for(let c=0;c<18;c++)box(boards,[.017,.032,.006],[-.33+c*.039,1.617,z+.02],gold,0);}
const power=part('power');box(power,[.43,.62,.42],[.29,.74,-.12],metal,.018);box(power,[.27,.19,.006],[.29,.83,.096],yellow,.003,'warning_label');
for(let i=0;i<8;i++)box(power,[.31,.012,.007],[.29,.47+i*.025,.1],black,0);box(power,[.27,.21,.2],[-.24,.59,-.1],black);for(let i=0;i<12;i++)box(power,[.28,.008,.22],[-.24,.5+i*.015,-.1],metal,0);
const speaker=part('speaker');box(speaker,[1.26,.18,.52],[0,2.81,.25],wood);box(speaker,[.45,.36,.05],[0,2.79,.48],metal);const cone=mesh(speaker,new T.ConeGeometry(.16,.07,32,1,true),edge,[0,2.79,.51],'speaker_cone');cone.rotation.x=Math.PI/2;mesh(speaker,new T.TorusGeometry(.166,.015,6,40),black,[0,2.79,.545]);mesh(speaker,new T.SphereGeometry(.052,16,12),black,[0,2.79,.54]);
const fan=part('ventilation');box(fan,[.34,.34,.11],[.27,.65,-.5],black);mesh(fan,new T.TorusGeometry(.132,.019,6,32),metal,[.27,.65,-.572]);const blades=new T.Group();blades.name='fan_rotor';blades.position.set(.27,.65,-.58);fan.add(blades);for(let i=0;i<5;i++){const b=box(blades,[.11,.065,.018],[Math.cos(i*1.256)*.055,Math.sin(i*1.256)*.055,0],metal);b.rotation.z=i*1.256;}cyl(fan,.035,.035,[.27,.65,-.58],black,[Math.PI/2,0,0]);
const details=part('details');box(details,[.2,.3,.005],[-.41,.95,-.589],cream,.001,'service_tag');cyl(details,.052,.007,[-.44,.405,.24],gold);box(details,[.13,.08,.09],[.39,.41,-.24],blue);cyl(details,.027,.2,[-.46,.43,-.24],black,[0,0,Math.PI/2]);
// Merge static hardware per assembly/material; keep named interactive pivots separate.
for(const g of root.children){g.updateMatrixWorld(true);const bins=new Map();for(const o of [...g.children])if(o.isMesh&&!o.name){const key=o.material.uuid;const b=bins.get(key)||{m:o.material,items:[]};b.items.push(o);bins.set(key,b);}for(const {m,items}of bins.values()){if(items.length<2)continue;const geometries=items.map(o=>{const geo=o.geometry.clone().applyMatrix4(o.matrix);return geo.index?geo.toNonIndexed():geo;});const merged=mergeGeometries(geometries,false);if(merged){items.forEach(o=>g.remove(o));mesh(g,merged,m);}geometries.forEach(x=>x.dispose());}}
root.updateMatrixWorld(true);mkdirSync('public',{recursive:true});const glb=await new GLTFExporter().parseAsync(root,{binary:true,onlyVisible:true});writeFileSync('public/cabinet.glb',Buffer.from(glb));console.log('Cabinet GLB:',glb.byteLength,'bytes;',root.children.length,'independent assemblies');
