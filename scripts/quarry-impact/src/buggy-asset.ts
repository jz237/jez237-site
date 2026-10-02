import * as T from 'three';
import {mergeGeometries,toCreasedNormals} from 'three/addons/utils/BufferGeometryUtils.js';
import {formedVehiclePanel,panelSamples} from './formed-vehicle-panel';
import {buggyTube,buggyLoft,buggyTread} from './buggy-geometry';
import {buggyHub,buggyLinks,buggyShock,type BuggyCorner} from './buggy-suspension';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),mix=T.MathUtils.lerp;

/** Original lightweight rear-engine sand/rough-road buggy. All dimensions are
 * metres, +Z is forward, and the 0.38m tyres centre at Y=.40. */
export function buildBuggyAsset(){
 const root=new T.Group();root.name='Ravine1800';
 const mat=(name:string,color:number,roughness:number,metalness=0)=>new T.MeshPhysicalMaterial({name,color,roughness,metalness});
 const paint=mat('paint_Ravine',0xd4a343,.36,.12);paint.clearcoat=.85;paint.clearcoatRoughness=.18;
 const spring=mat('Ravine spring enamel',0xd4a343,.37,.12);spring.clearcoat=.65;spring.clearcoatRoughness=.20;
 const frame=mat('Structure Ravine powdercoat',0x28312e,.54,.42),steel=mat('Structure Ravine steel',0x484e4b,.54,.73),alloy=mat('Ravine cast alloy',0x9da6a3,.42,.78),bright=mat('Ravine machined alloy',0xc4c7bf,.26,.85);
 const rubber=mat('Ravine rubber',0x151b19,.91),tire=mat('Tire Ravine all terrain',0x292c27,.95),cloth=mat('Interior Ravine charcoal fabric',0x272c27,.98),vinyl=mat('Interior Ravine shell',0x181f1d,.73),harness=mat('Interior Ravine harness',0xba662f,.96);
 const lamp=mat('Ravine Headlight',0xaab5ab,.20,.12),brake=mat('Ravine Brakelight',0x9b251b,.29,.10),amber=mat('Ravine Indicator',0xc37e28,.28,.10),exhaust=mat('Structure Ravine exhaust',0x5c5140,.49,.70);
 const add=(name:string,g:T.BufferGeometry,m:T.Material,parent:T.Object3D=root)=>{if(name.startsWith('Wheel_Ravine_Barrel_')){const old=g;g=toCreasedNormals(g,Math.PI/3);old.dispose();}if(g.index){const old=g;g=g.toNonIndexed();old.dispose();}const o=new T.Mesh(g,m);o.name=name;o.castShadow=o.receiveShadow=true;parent.add(o);return o;};
 const box=(name:string,p:T.Vector3,size:T.Vector3,m:T.Material,parent:T.Object3D=root)=>{const o=add(name,new T.BoxGeometry(size.x,size.y,size.z),m,parent);o.position.copy(p);return o;};
 const tube=(name:string,points:T.Vector3[],r:number,m:T.Material=frame,segments=12,sides=8,loop=false)=>add(name,buggyTube(points,r,segments,sides,loop),m);
 const bar=(name:string,a:T.Vector3,b:T.Vector3,r:number,m:T.Material=frame,parent:T.Object3D=root,sides=8)=>{const o=add(name,new T.CylinderGeometry(r,r,a.distanceTo(b),sides),m,parent);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(v(0,1,0),b.clone().sub(a).normalize());return o;};
 const cylinder=(name:string,p:T.Vector3,r:number,d:number,m:T.Material,axis:'x'|'y'|'z'='y',segments=10,parent:T.Object3D=root)=>{const o=add(name,new T.CylinderGeometry(r,r,d,segments),m,parent);o.position.copy(p);if(axis==='x')o.rotation.z=Math.PI/2;if(axis==='z')o.rotation.x=Math.PI/2;return o;};
 const panel=(name:string,nx:number,ny:number,surface:(u:number,t:number)=>T.Vector3,out:T.Vector3,m:T.Material=paint,thickness=.016)=>add(name,formedVehiclePanel(panelSamples(nx),panelSamples(ny),surface,out,thickness),m);
 const rounded=(name:string,p:T.Vector3,w:number,h:number,d:number,m:T.Material,r=.035,parent:T.Object3D=root)=>{const bevel=Math.min(.008,d*.22),o=add(name,buggyLoft([{w:w-.014,h:h-.014,r,z:-d/2},{w,h,r,z:-d/2+bevel},{w,h,r,z:d/2-bevel},{w:w-.014,h:h-.014,r,z:d/2}],1),m,parent);o.position.copy(p);return o;};
 const noseWidth=(t:number)=>mix(.61,.39,t)+.050*Math.sin(t*Math.PI),noseTop=(x:number,t:number)=>mix(.91,.565,t)+.040*Math.sin(t*Math.PI)-.095*(x/noseWidth(t))**4;
 panel('panel_hoodRavine',10,8,(u,t)=>{const x=(u*2-1)*noseWidth(t);return v(x,noseTop(x,t),mix(.53,1.47,t)+.055*(1-(u*2-1)**2)*t**5);},v(0,1,0));
 for(const side of [-1,1]){
  const suffix=side<0?'L':'R';
  panel('panel_hoodRavineSkirt'+suffix,10,2,(u,t)=>{const x=side*noseWidth(u),top=noseTop(x,u);return v(x-side*.025*Math.sin(t*Math.PI/2),mix(top,mix(.61,.43,u),t),mix(.53,1.47,u));},v(side,0,0));
  panel('panel_SidePodRavine'+suffix,10,4,(u,t)=>{const z=mix(-.79,.53,u),top=mix(.80,.68,u)-.13*Math.sin(u*Math.PI),x=side*(.60+.075*Math.sin(u*Math.PI)-.025*(1-t)**2);return v(x,mix(.43+.07*u,top,t),z);},v(side,.1,0).normalize());
  panel('panel_SidePodRavineRim'+suffix,10,2,(u,t)=>{const z=mix(-.79,.53,u),top=mix(.80,.68,u)-.13*Math.sin(u*Math.PI),x=side*(.60+.075*Math.sin(u*Math.PI)-.045*t);return v(x,top+.012*Math.sin(t*Math.PI),z);},v(0,1,0));
  panel('panel_SidePodRavineLower'+suffix,12,1,(u,t)=>v(side*(.584+.056*Math.sin(u*Math.PI)),mix(.453+.066*u,.487+.066*u,t),mix(-.75,.49,u)),v(side,0,0),vinyl,.007);
  // A narrow quarter cap leaves the tyre, trailing arms and engine exposed.
  panel('panel_RearQuarterRavine'+suffix,8,3,(u,t)=>{const z=mix(-.85,-1.40,u),x=side*mix(.57,.69,t);return v(x,mix(.91,.82,u)+.055*Math.sin(u*Math.PI)-.065*t*t,z);},v(side,.8,0).normalize());
  bar('Structure Ravine lower rail '+suffix,v(side*.59,.40,-1.48),v(side*.59,.40,1.37),.028);
  tube('panel_CageSideRavine'+suffix,[v(side*.64,.43,-.77),v(side*.66,.81,-.72),v(side*.665,.76,-.18),v(side*.64,.69,.52),v(side*.59,.43,.66)],.026,frame,8);
  bar('Structure Ravine side diagonal '+suffix,v(side*.64,.46,-.71),v(side*.64,.70,.46),.020);
  tube('panel_CageRoofRailRavine'+suffix,[v(side*.57,1.52,.17),v(side*.58,1.62,-.19),v(side*.59,1.60,-.63)],.026,frame,8);
  tube('panel_CageRearBraceRavine'+suffix,[v(side*.59,1.59,-.64),v(side*.56,1.11,-1.01),v(side*.48,.52,-1.54)],.026,frame,8);
  bar('Structure Ravine engine cradle '+suffix,v(side*.59,.40,-.75),v(side*.48,.43,-1.66),.026);
 }
 panel('panel_hoodRavineNose',10,2,(u,t)=>{const x=(u*2-1)*.39;return v(x,mix(.43,noseTop(x,1),t),1.47+.055*(1-(u*2-1)**2));},v(0,0,1));
 tube('panel_CageFrontRavine',[v(-.63,.65,.52),v(-.61,1.39,.23),v(-.57,1.52,.17),v(-.48,1.58,.17),v(.48,1.58,.17),v(.57,1.52,.17),v(.61,1.39,.23),v(.63,.65,.52)],.026,frame,20);
 tube('panel_CageMainRavine',[v(-.64,.44,-.72),v(-.63,1.42,-.65),v(-.59,1.60,-.63),v(-.50,1.66,-.63),v(.50,1.66,-.63),v(.59,1.60,-.63),v(.63,1.42,-.65),v(.64,.44,-.72)],.026,frame,20);
 bar('panel_CageRearCrossRavine',v(-.57,1.49,-.645),v(.57,.61,-.72),.022);
 bar('Structure Ravine harness bar',v(-.62,1.12,-.68),v(.62,1.12,-.68),.022);
 tube('panel_bumper_frontRavine',[v(-.59,.40,1.39),v(-.55,.48,1.67),v(-.36,.49,1.73),v(.36,.49,1.73),v(.55,.48,1.67),v(.59,.40,1.39)],.030,frame,12);
 tube('panel_bumper_rearRavine',[v(-.48,.43,-1.55),v(-.48,.56,-1.71),v(0,.58,-1.76),v(.48,.56,-1.71),v(.48,.43,-1.55)],.029,frame,10);
 box('Structure Ravine floor',v(0,.42,-.115),v(1.10,.026,1.45),steel);
 box('Structure Ravine firewall',v(0,.705,-.86),v(1.14,.57,.025),steel);
 for(const z of [-.77,.12,1.24])bar('Structure Ravine crossmember '+z,v(-.59,.40,z),v(.59,.40,z),.028);
 rounded('Structure Ravine front fuel tank',v(0,.59,.92),.66,.24,.36,steel,.06);
 for(const x of [-.19,.19])box('Structure Ravine fuel tank strap '+x,v(x,.59,.92),v(.032,.25,.372),frame);
 cylinder('Structure Ravine fuel cap',v(.20,.723,.93),.035,.019,bright);
 rounded('Interior Ravine dashboard',v(0,.92,.43),1.04,.12,.12,vinyl,.035);

 // Two deep, contoured buckets; visible side bolsters and four-point harnesses.
 for(const side of [-1,1]){
  const x=side*.325;
  for(const dx of [-.145,.145])bar('Structure Ravine seat rail '+side+' '+dx,v(x+dx,.46,-.50),v(x+dx,.46,.05),.015,steel);
  const back=(u:number,t:number)=>{const width=.20+.036*Math.sin(t*Math.PI)-.057*T.MathUtils.smoothstep(t,.73,1),U=u*2-1;return v(x+U*width,.67+.61*t,-.45-.19*t+.11*Math.abs(U)**3);};
  panel('Interior Ravine bucket back '+side,6,6,back,v(0,.20,1).normalize(),cloth,.034);
  panel('Interior Ravine bucket cushion '+side,6,4,(u,t)=>{const U=u*2-1;return v(x+U*mix(.205,.228,t),.625+.065*Math.abs(U)**3+.020*Math.sin(t*Math.PI),mix(-.45,.07,t));},v(0,1,0),cloth,.048);
  // An inset shell lip supplies an intentional dark border without a box seat.
  for(const sign of [-1,1])tube('Interior Ravine bucket piping '+side+' '+sign,Array.from({length:7},(_,i)=>back(sign>0?1:0,i/6).add(v(0,0,.006))),.007,vinyl,8,4);
  for(const shoulder of [-1,1]){
   const X=x+shoulder*.078;
   panel('Interior Ravine shoulder harness '+side+' '+shoulder,1,6,(u,t)=>v(X+(u-.5)*.037,.72+.48*t,-.46-.19*(.08+.78*t)+.022),v(0,.1,1).normalize(),harness,.004);
   bar('Interior Ravine harness anchorage '+side+' '+shoulder,v(X,1.16,-.62),v(X,1.12,-.68),.010,harness);
   tube('Interior Ravine lap belt '+side+' '+shoulder,[v(x+shoulder*.19,.62,-.22),v(x+shoulder*.10,.688,-.15),v(x,.688,-.15)],.016,harness,5,4);
  }
  rounded('Interior Ravine harness buckle '+side,v(x,.692,-.143),.064,.034,.014,steel,.006);
 }
 const steering=add('Interior Ravine steering rim',new T.TorusGeometry(.151,.013,5,18),rubber);steering.rotation.x=-.31;steering.position.set(-.325,1.075,.218);
 for(let i=0;i<3;i++){const a=(i*120+30)*Math.PI/180;bar('Interior Ravine steering spoke '+i,v(-.325,1.075,.218),v(-.325+Math.cos(a)*.140,1.075+Math.sin(a)*.132,.218-Math.sin(a)*.042),.008,steel);}
 cylinder('Interior Ravine steering boss',v(-.325,1.075,.212),.034,.023,vinyl,'z');bar('Interior Ravine steering column',v(-.325,1.075,.238),v(-.325,.85,.50),.014,steel);
 for(const [i,x]of [-.325,-.15,.15].entries()){
  cylinder('Interior Ravine gauge bezel '+i,v(x,.941,.359),i===0?.050:.030,.018,bright,'z',12);
  cylinder('Interior Ravine gauge face '+i,v(x,.941,.347),i===0?.044:.025,.007,rubber,'z',12);
  bar('Interior Ravine gauge needle '+i,v(x,.941,.340),v(x-.016,.962,.340),.002,amber,root,4);
 }
 bar('Interior Ravine gear lever',v(0,.45,-.03),v(0,.74,.02),.010,steel);rounded('Interior Ravine gear knob',v(0,.756,.02),.05,.045,.043,vinyl,.015);
 for(const side of [-1,1]){
  const s=side<0?'L':'R';
  // Link geometry retains its own transform and corner identity at runtime.
  for(const front of [true,false]){
   const corner=((front?'F':'R')+s) as BuggyCorner,hub=buggyHub(corner);
   for(const link of buggyLinks(corner)){const a=link.a.point.clone().add(link.a.hub?hub:v(0,0,0)),b=link.b.point.clone().add(link.b.hub?hub:v(0,0,0));bar(link.name,a,b,link.radius,link.name.endsWith('tie_rod')?bright:steel);}
   const spec=buggyShock(corner),bottom=hub.clone().add(spec.offset),top=spec.mount,axis=top.clone().sub(bottom),length=axis.length(),rotation=new T.Quaternion().setFromUnitVectors(v(0,1,0),axis.clone().normalize());
   const shockGroup=new T.Group();shockGroup.name='suspension_'+corner+'_shock';shockGroup.position.copy(bottom);shockGroup.quaternion.copy(rotation);root.add(shockGroup);
   cylinder('Ravine shock shaft '+corner,v(0,length*.5,0),.015,length,bright,'y',8,shockGroup);
   cylinder('Ravine damper '+corner,v(0,length*.61,0),.028,length*.56,steel,'y',8,shockGroup);
   const coil=Array.from({length:43},(_,i)=>{const t=i/42,a=t*Math.PI*2*6;return v(Math.cos(a)*.043,length*(.275+.67*t),Math.sin(a)*.043);});
   add('Ravine spring '+corner,buggyTube(coil,.0075,42,4),spring,shockGroup);
   for(const t of [.20,.94])cylinder('Ravine spring seat '+corner+t,v(0,length*t,0),.054,.012,steel,'y',10,shockGroup);
  }
  bar('Structure Ravine lamp bracket '+s,v(side*.55,.57,1.08),v(side*.60,.79,1.10),.016);
  cylinder('panel_HeadlightRavineHousing'+s,v(side*.60,.80,1.10),.092,.095,frame,'z',16);
  cylinder('panel_HeadlightRavineRim'+s,v(side*.60,.80,1.155),.086,.025,bright,'z',16);
  cylinder('panel_HeadlightRavineLens'+s,v(side*.60,.80,1.174),.075,.013,lamp,'z',16);
  cylinder('panel_IndicatorRavine'+s,v(side*.61,.665,1.12),.031,.019,amber,'z');
  rounded('panel_RearLampRavineHousing'+s,v(side*.58,.855,-1.365),.19,.085,.06,frame,.018);
  rounded('panel_RearLampRavineBrake'+s,v(side*.58,.855,-1.404),.144,.049,.016,brake,.014);
 }

 // Air-cooled boxer: opposed finned cylinders, rounded valve covers, central
 // fan housing and four separate induction/exhaust paths remain exposed.
 rounded('Structure engine crankcase Ravine',v(0,.59,-1.275),.29,.28,.48,alloy,.055);
 rounded('Structure engine sump Ravine',v(0,.415,-1.275),.34,.075,.38,steel,.025);
 rounded('Structure Ravine transaxle',v(0,.45,-.97),.255,.18,.25,steel,.04);
 for(const side of [-1,1]){
  for(const z of [-1.105,-1.415]){
   cylinder('Structure engine cylinder Ravine '+side+z,v(side*.26,.59,z),.098,.24,alloy,'x',10);
   for(let j=0;j<6;j++)cylinder('Structure engine cooling fin Ravine '+side+z+j,v(side*(.16+j*.034),.59,z),.111,.008,steel,'x',8);
   tube('Structure engine intake Ravine '+side+z,[v(side*.35,.70,z),v(side*.30,.80,z),v(side*.16,.87,-1.27)],.027,alloy,6,6);
   tube('Structure engine exhaust header Ravine '+side+z,[v(side*.34,.485,z),v(side*.40,.34,z-.03),v(side*.30,.32,-1.56),v(side*.20,.405,-1.62)],.022,exhaust,8,6);
   tube('Structure engine ignition lead Ravine '+side+z,[v(0,.77,-1.18),v(side*.16,.78,z),v(side*.32,.703,z)],.004,rubber,5,4);
  }
  const cover=rounded('Structure engine valve cover Ravine '+side,v(side*.426,.594,-1.26),.22,.21,.55,alloy,.05);cover.scale.x=.58;
  for(const y of [.52,.66])bar('Structure engine valve cover bail Ravine '+side+y,v(side*.493,y,-1.49),v(side*.493,y,-1.035),.008,steel);
 }
 cylinder('Structure engine fan shroud Ravine',v(0,.784,-1.42),.158,.135,alloy,'z',16);
 cylinder('Structure engine fan inlet Ravine',v(0,.784,-1.498),.116,.015,rubber,'z',16);
 cylinder('Structure engine fan pulley Ravine',v(0,.784,-1.512),.046,.024,bright,'z',12);
 cylinder('Structure engine crank pulley Ravine',v(0,.56,-1.525),.071,.022,steel,'z',16);
 tube('Structure engine fan belt Ravine',[v(-.048,.794,-1.539),v(-.055,.73,-1.539),v(-.076,.56,-1.539),v(0,.485,-1.539),v(.076,.56,-1.539),v(.055,.73,-1.539),v(.048,.794,-1.539),v(0,.834,-1.539),v(-.048,.794,-1.539)],.008,rubber,18,4,true);
 cylinder('Structure engine air cleaner Ravine',v(0,.938,-1.215),.127,.058,rubber,'y',16);
 cylinder('Structure engine air cleaner top Ravine',v(0,.972,-1.215),.120,.014,alloy,'y',16);
 cylinder('Structure engine silencer Ravine',v(0,.43,-1.62),.064,.59,exhaust,'x',16);
 tube('Structure Ravine exhaust outlet',[v(.25,.43,-1.62),v(.38,.44,-1.67),v(.47,.49,-1.72)],.026,steel,9,10);

 // Four original open wheels with cylindrical crown lugs. The outer tread
 // radius and full shoulder width match the physics contract exactly.
 for(const [i,name]of ['FL','FR','RL','RR'].entries()){
  const side=i%2?1:-1,wheel=new T.Group();wheel.name='wheel_'+name;wheel.position.set(side*.85,.40,(i<2?1:-1)*1.20);root.add(wheel);
  const profile=[[.198,-.120],[.265,-.141],[.326,-.145],[.353,-.126],[.361,-.086],[.361,.086],[.353,.126],[.326,.145],[.265,.141],[.198,.120],[.198,-.120]].map(([r,x])=>new T.Vector2(r,x));
  const body=add('Tire_Ravine_'+name,new T.LatheGeometry(profile,24),tire,wheel);body.rotation.z=Math.PI/2;
  const lugs:T.BufferGeometry[]=[];for(let j=0;j<20;j++)for(const row of [-1,0,1])lugs.push(buggyTread(row*.092,row===0?.073:.082,j*Math.PI/10+(row===0?.055:row*.023),row===0?.070:.086));
  add('Tire_Ravine_Tread_'+name,mergeGeometries(lugs)!,tire,wheel);lugs.forEach(g=>g.dispose());
  const barrel=add('Wheel_Ravine_Barrel_'+name,new T.LatheGeometry([[.176,-.115],[.207,-.110],[.208,-.086],[.185,-.086],[.185,.086],[.208,.086],[.207,.110],[.176,.115],[.176,-.115]].map(([r,x])=>new T.Vector2(r,x)),20),alloy,wheel);barrel.rotation.z=Math.PI/2;
  cylinder('Wheel_Ravine_BrakeDisc_'+name,v(-side*.06,0,0),.156,.018,steel,'x',20,wheel);
  cylinder('Wheel_Ravine_Hub_'+name,v(side*.116,0,0),.059,.061,bright,'x',16,wheel);
  for(let j=0;j<6;j++){
   const a=j*Math.PI/3,spoke=add('Wheel_Ravine_Spoke_'+name+j,buggyLoft([{w:.032,h:.127,r:.010,z:-.013},{w:.039,h:.137,r:.011,z:.013}],1),alloy,wheel);
   // Loft normal points across the axle, broad sides bridge hub to rim.
   spoke.rotation.set(a,Math.PI/2,0);spoke.position.set(side*.113,Math.cos(a)*.126,Math.sin(a)*.126);
   cylinder('Wheel_Ravine_Lug_'+name+j,v(side*.153,Math.cos(a)*.043,Math.sin(a)*.043),.0075,.015,steel,'x',6,wheel);
  }
 }
 root.updateMatrixWorld(true);return root;
}
