// Additional inspectable, mechanically articulated modules. Dimensions are model millimetres.
import * as T from 'three';
import { M, box, cyl, torus, ex } from '../kit.js';
const ring=(r,w=.045)=>new T.TorusGeometry(r,w,8,40);
const part=(parent,id,name,props={})=>parent.part(id,{name,info:name+' — illustrative APX-9 internal mechanism.',...props});
function fan(parent,id,pos){
 const f=part(parent,id,'Micro cooling impeller',{pos,explode:ex([0,.6,0],'fine')});
 f.add(ring(.46),M.gunmetal);f.add(cyl(.08,.14,{axis:'z',segments:16}),M.chrome);
 const rotor=part(f,'rotor','Seven-blade cooling rotor');rotor.add(cyl(.16,.1,{axis:'z',segments:20}),M.brass);
 const blade=box(.13,.31,.035,.02);
 for(let i=0;i<7;i++){const a=i*Math.PI*2/7;rotor.add(blade,M.steel,new T.Matrix4().compose(new T.Vector3(-Math.sin(a)*.28,Math.cos(a)*.28,0),new T.Quaternion().setFromEuler(new T.Euler(.28,0,a+.22)),new T.Vector3(1,1,1)));}
}
export function build(ctx){
 const {bee}=ctx,head=bee.get('head-frame'),core=bee.get('power-core');
 if(head){
  for(const side of [-1,1]){
   const id=side>0?'r':'l';
   const g=part(head,'optical-drive-'+id,'Optical iris and focus gimbal',{pos:[10.9,.9,side*2.1],rot:[0,side<0?180:0,0],explode:ex([0,0,side*1.5],'mid')});
   const shell=part(g,'barrel','Optical barrel',{tag:'shell'});shell.add(cyl(.95,.48,{axis:'z',rIn:.8,segments:48}),M.gunmetal);
   for(let i=0;i<12;i++){const a=i*Math.PI/6;shell.add(cyl(.04,.065,{axis:'z',segments:8}),M.gold,[Math.cos(a)*.88,Math.sin(a)*.88,.28]);}
   const yaw=part(g,'yaw-ring','Optical yaw cradle');yaw.add(ring(.80,.05),M.chrome);yaw.add(cyl(.07,1.76,{axis:'y',segments:12}),M.steel);
   const pitch=part(yaw,'pitch-ring','Optical pitch cradle');pitch.add(ring(.70,.04),M.brass);
   const lens=part(pitch,'focus-carriage','Axial focusing lens');lens.add(cyl(.38,.10,{axis:'z',segments:40}),M.glass,[0,0,-.1]);lens.add(ring(.40,.035),M.chrome,[0,0,-.1]);
   const foil=new T.Shape();foil.moveTo(0,0);foil.quadraticCurveTo(.35,-.20,.74,.08);foil.lineTo(.42,.22);foil.quadraticCurveTo(.15,.24,0,.08);foil.closePath();
   const geo=new T.ExtrudeGeometry(foil,{depth:.025,bevelEnabled:true,bevelSize:.008,bevelThickness:.008,bevelSegments:1,steps:1,curveSegments:10});
   for(let i=0;i<6;i++){const a=i*Math.PI/3,b=part(pitch,'iris-'+i,'Iris leaf '+(i+1),{pos:[Math.cos(a)*.54,Math.sin(a)*.54,.12+i*.004],rot:[0,0,a*180/Math.PI+126]});b.add(geo,i%2?M.steel:M.titanium);b.add(cyl(.035,.04,{axis:'z',segments:10}),M.gold);}
  }
  fan(head,'cooling-r',[9.2,1.35,1.25]);fan(head,'cooling-l',[9.2,1.35,-1.25]);
 }
 if(core){
  const bank=part(core,'coolant-bank','Six-cylinder coolant pump bank',{pos:[0,-2.6,0],explode:ex([0,-2.4,0],'mid'),info:'Six phased eccentric drives push linked piston rods through transparent cylinder sleeves. Illustrative closed-loop coolant circulation.'});
  bank.add(box(3.8,.12,1.05,.06),M.gunmetal,[0,-.32,0]);bank.add(cyl(.09,3.8,{axis:'x',segments:20}),M.chrome);
  const sleeveMaterial=M.glass.clone();sleeveMaterial.transparent=true;sleeveMaterial.opacity=.19;sleeveMaterial.depthWrite=false;
  for(let i=0;i<6;i++){
   const px=(i-2.5)*.6,unit=part(bank,'pump-'+i,'Coolant pump '+(i+1),{pos:[px,0,0]});
   const housing=part(unit,'sleeve','Cylinder sleeve',{tag:'shell'});housing.add(cyl(.20,.48,{axis:'y',rIn:.15,segments:24}),sleeveMaterial,[0,.83,0]);housing.add(box(.43,.08,.48,.04),M.gunmetal,[0,1.1,0]);
   for(const xx of [-.14,.14])for(const zz of [-.17,.17])housing.add(cyl(.027,.025,{axis:'y',segments:6}),M.gold,[xx,1.15,zz]);
   for(const s of [-1,1])housing.add(cyl(.035,1.15,{axis:'y',segments:8}),M.chrome,[0,.30,s*.26]);
   const cam=part(unit,'eccentric','Eccentric crank');cam.add(cyl(.27,.12,{axis:'x',segments:28}),M.brass);cam.add(cyl(.065,.18,{axis:'x',segments:12}),M.chrome,[0,.22,0]);
   const rod=part(unit,'conrod','Articulated pump connecting rod',{pos:[0,.58,0]});rod.add(cyl(.045,.72,{axis:'y',segments:12}),M.chrome);rod.add(cyl(.085,.14,{axis:'x',segments:16}),M.steel,[0,-.36,0]);rod.add(cyl(.075,.14,{axis:'x',segments:16}),M.steel,[0,.36,0]);
   const piston=part(unit,'piston','Reciprocating piston',{pos:[0,.94,0]});piston.add(cyl(.145,.18,{axis:'y',segments:24}),M.steel);for(const yy of [-.06,.06])piston.add(torus(.144,.015,{radial:6,tubular:24}),M.gunmetal,new T.Matrix4().compose(new T.Vector3(0,yy,0),new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),Math.PI/2),new T.Vector3(1,1,1)));
  }
  fan(bank,'radiator-r',[-1.65,.6,.65]);fan(bank,'radiator-l',[1.65,.6,.65]);
 }
}
