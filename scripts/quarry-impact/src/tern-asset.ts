import * as T from 'three';
import {classicWindowFrame} from './classic-window-frame';
import {formedVehiclePanel,panelSamples} from './formed-vehicle-panel';
import {buildCompactAsset} from './compact-asset';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),mix=T.MathUtils.lerp;

/** Original three-door hatchback: short overhangs, wedge bonnet, raked hatch,
 * transverse engine. +Z points forward; wheel centres use the fleet datum. */
export function buildTernAsset(){
 const root=new T.Group();root.name='Tern1400';
 const mat=(name:string,color:number,roughness:number,metalness=0)=>new T.MeshPhysicalMaterial({name,color,roughness,metalness});
 const paint=mat('paint_Tern',0x9b4d38,.35,.14);paint.clearcoat=.8;paint.clearcoatRoughness=.2;
 const rubber=mat('Tern Rubber',0x202525,.84),trim=mat('Tern Satin Trim',0x363e40,.56,.2),steel=mat('Structure Tern Steel',0x414b4b,.66,.55),alloy=mat('Tern Alloy',0xa2a9a6,.42,.7);
 const cloth=mat('Interior Tern Cloth',0x464843,.96),vinyl=mat('Interior Tern Vinyl',0x2b312f,.85),glass=mat('Tern Glass',0x304952,.09,.1);glass.transparent=true;glass.opacity=.55;glass.depthWrite=false;
 const lamp=mat('Tern Headlight',0xe6e1cb,.21,.1),brake=mat('Tern Brakelight',0x921d16,.28,.12),amber=mat('Tern Indicator',0xcb862b,.28,.1);
 const add=(name:string,g:T.BufferGeometry,m:T.Material)=>{if(g.index)g=g.toNonIndexed();const o=new T.Mesh(g,m);o.name=name;o.castShadow=o.receiveShadow=true;root.add(o);return o;};
 const box=(name:string,x:number,y:number,z:number,w:number,h:number,l:number,m:T.Material)=>{const o=add(name,new T.BoxGeometry(w,h,l),m);o.position.set(x,y,z);return o;};
 const bar=(name:string,a:T.Vector3,b:T.Vector3,r:number,m:T.Material)=>{const o=add(name,new T.CylinderGeometry(r,r,a.distanceTo(b),8),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(v(0,1,0),b.clone().sub(a).normalize());return o;};
 const panel=(name:string,nx:number,ny:number,surface:(u:number,t:number)=>T.Vector3,out:T.Vector3,m:T.Material=paint,thickness=.018)=>add(name,formedVehiclePanel(panelSamples(nx),panelSamples(ny),surface,out,thickness),m);
 const window=(name:string,corners:T.Vector3[],side:number)=>{const f=classicWindowFrame(corners,side);add('panel_'+name+'Frame',f.frame,paint);add('panel_'+name+'Seal',f.seal,rubber);add('panel_'+name+'Trim',f.trim,trim);add('glass_'+name,f.glass,glass).castShadow=false;};
 const sideX=(y:number,z:number)=>{
  const tuck=.046*(1-T.MathUtils.smoothstep(y,.35,.68)),shoulder=.035*T.MathUtils.smoothstep(y,.77,1.02),end=.033*T.MathUtils.smoothstep(Math.abs(z),1.50,1.81);
  return .804-tuck-shoulder-end;
 };
 const arch=(z:number)=>{const dz=Math.min(Math.abs(z-1.18),Math.abs(z+1.18));return dz<.367?Math.max(.37,.3400195+Math.sqrt(.367**2-dz**2)):.37;};
 const belt=(z:number)=>z>.62?mix(1.02,.935,(z-.62)/1.19):1.02;
 const endZ=(x:number,front:boolean)=>(front?1:-1)*(1.81+.026*(1-(x/.737)**2));
 for(const side of [-1,1]){
  const s=side<0?'L':'R';
  for(const [name,a,b]of [['FrontWing',.62,1.81],['BodyDoor',-.70,.62],['RearWing',-1.81,-.70]]as const){
   add('panel_'+name+s+'Tern',formedVehiclePanel(panelSamples(20),[0,.10,.5,1],(u,t)=>{
    const z=mix(a,b,u),bottom=arch(z),y=t<=.10?mix(bottom,.73,t/.10):mix(.73,belt(z),(t-.10)/.90);return v(side*sideX(y,z),y,z);
   },v(side,0,0)),paint);
   panel('panel_'+name+s+'TernMoulding',16,1,(u,t)=>{const z=mix(a,b,u),y=mix(.753,.795,t);return v(side*(sideX(y,z)+.006),y,z);},v(side,0,0),rubber,.01);
  }
  panel('panel_SillTern'+s,18,2,(u,t)=>{const z=mix(-1.77,1.77,u);return v(side*mix(sideX(.37,z),.714,t),mix(.369,.317,t),z);},v(side,-.5,0));
  for(const z of [-1.18,1.18]){
   const points=Array.from({length:25},(_,i)=>{const a=mix(.12,Math.PI-.12,i/24),y=.3400195+Math.sin(a)*.370,Z=z+Math.cos(a)*.370;return v(side*(sideX(y,Z)+.003),y,Z);});
   add('panel_ArchLipTern'+s+z,new T.TubeGeometry(new T.CatmullRomCurve3(points),24,.008,5,false),rubber);
   panel('Structure Tern wheelhouse '+s+z,14,2,(u,t)=>{const a=u*Math.PI;return v(side*mix(.60,.771,t),.3400195+Math.sin(a)*.366,z+Math.cos(a)*.366);},v(0,1,0),steel,.012);
  }
  panel('panel_FrontShoulderTern'+s,13,2,(u,t)=>{const z=mix(.62,1.81,u),y=belt(z);return v(side*mix(sideX(y,z),.704,t),y+.015*Math.sin(t*Math.PI/2),u===1?endZ(side*mix(sideX(y,z),.704,t),true):z);},v(side,1,0).normalize());
  window('BodyDoor'+s+'Tern',[v(side*.769,1.02,.62),v(side*.769,1.02,-.70),v(side*.631,1.43,-.70),v(side*.631,1.43,.12)],side);
  window('QuarterTern'+s,[v(side*.769,1.02,-.72),v(side*.737,1.02,-1.76),v(side*.631,1.43,-1.04),v(side*.631,1.43,-.72)],side);
  // Steel posts and headers follow the glass rake rather than rectangular bars.
  panel('panel_BodyDoor'+s+'TernHeader',10,1,(u,t)=>{const y=mix(1.43,1.478,t);return v(side*mix(.631,.639,t),y,mix(-.70,mix(.12,.094,t),u));},v(side,0,0));
  bar('panel_ApillarTern'+s,v(side*.769,1.02,.62),v(side*.631,1.43,.12),.018,paint);
  bar('panel_BpillarTern'+s,v(side*.769,1.02,-.71),v(side*.639,1.478,-.71),.017,trim);
  panel('panel_CpillarTern'+s,3,7,(u,t)=>{const y=mix(1.02,1.478,t),x=side*mix(.737,.639,t),z=mix(-1.76,-1.02,t);return v(x,y,z+.061*u);},v(side,0,-.4).normalize());
  panel('panel_QuarterHeaderTern'+s,7,1,(u,t)=>v(side*mix(.631,.639,t),mix(1.43,1.478,t),mix(-1.04,-.72,u)),v(side,0,0));
  box('panel_BodyDoor'+s+'TernHandleRecess',side*.797,.937,-.545,.022,.065,.176,rubber);
  box('panel_BodyDoor'+s+'TernHandle',side*.815,.946,-.548,.021,.020,.118,trim);
  box('panel_BodyDoor'+s+'TernInnerCard',side*.725,.74,-.03,.025,.42,1.24,vinyl);
  box('panel_BodyDoor'+s+'TernArmrest',side*.684,.802,-.16,.07,.047,.30,cloth);
  const mirror=box('panel_BodyDoor'+s+'TernMirror',side*.856,1.083,.478,.12,.089,.15,trim);mirror.rotation.y=side*.16;
  box('panel_BodyDoor'+s+'TernMirrorStem',side*.793,1.049,.477,.082,.026,.042,rubber);
  for(const z of [-.697,.617])bar('panel_BodyDoor'+s+'TernShutline'+z,v(side*sideX(.405,z),.405,z),v(side*sideX(1.01,z),1.01,z),.0016,rubber);
 }
 panel('panel_hoodTern',12,11,(u,t)=>{const x=(u*2-1)*.704,z=mix(.62,endZ(x,true),t);return v(x,mix(1.035,.950,t)+.021*(1-(x/.704)**2)*Math.sin(t*Math.PI),z);},v(0,1,0));
 window('FrontTern',[v(-.769,1.02,.62),v(.769,1.02,.62),v(.631,1.43,.12),v(-.631,1.43,.12)],1);
 panel('panel_FrontHeaderTern',10,1,(u,t)=>v((u*2-1)*mix(.631,.639,t),mix(1.43,1.478,t),mix(.12,.094,t)),v(0,.5,1).normalize());
 panel('panel_RoofTern',10,10,(u,t)=>{const x=(u*2-1)*.639;return v(x,1.478+.038*(1-(x/.639)**2)*Math.sin(t*Math.PI),mix(-1.02,.094,t));},v(0,1,0));
 window('TailgateTernRear',[v(.737,1.02,-1.76),v(-.737,1.02,-1.76),v(-.631,1.43,-1.04),v(.631,1.43,-1.04)],1);
 panel('panel_TailgateTernHeader',10,1,(u,t)=>v((u*2-1)*mix(.631,.639,t),mix(1.43,1.478,t),mix(-1.04,-1.02,t)),v(0,.5,-1).normalize());
 panel('panel_TailgateTernSkin',16,6,(u,t)=>{const y=mix(.564,1.02,t),x=(u*2-1)*mix(.663,.737,T.MathUtils.smoothstep(y,.94,1.02));return v(x,y,mix(endZ(x,false),-1.76,t)-.008*Math.sin(t*Math.PI));},v(0,0,-1));
 panel('panel_TailgateTernInner',13,3,(u,t)=>v((u*2-1)*.641,mix(.59,1.00,t),mix(-1.791,-1.73,t)),v(0,0,1),vinyl,.012);
 box('panel_TailgateTernHandle',0,.937,-1.803,.224,.04,.025,rubber);
 box('panel_TailgateTernPlateRecess',0,.767,-1.833,.402,.119,.022,rubber);
 box('panel_TailgateTernPlate',0,.767,-1.848,.355,.087,.01,alloy);
 for(const side of [-1,1]){
  panel('panel_RearCornerTern'+side,3,8,(u,t)=>{const y=mix(.36,1.02,t),x=side*mix(mix(.663,.737,T.MathUtils.smoothstep(y,.94,1.02)),sideX(y,-1.81),u);return v(x,y,mix(mix(endZ(x,false),-1.76,T.MathUtils.clamp((y-.564)/.456,0,1))-.008*Math.sin(T.MathUtils.clamp((y-.564)/.456,0,1)*Math.PI),-1.81,u));},v(side,0,-1).normalize());
  box('panel_TailLampTernBezel'+side,side*.712,.791,-1.839,.137,.297,.037,rubber);
  box('panel_TailLampTernIndicator'+side,side*.712,.889,-1.863,.114,.080,.016,amber);
  box('panel_TailLampTernBrake'+side,side*.712,.783,-1.863,.114,.125,.016,brake);
  box('panel_TailLampTernReverse'+side,side*.712,.689,-1.863,.114,.045,.016,lamp);
 }
 panel('panel_RearApronTern',16,2,(u,t)=>{const x=(u*2-1)*.737;return v(x,mix(.36,.564,t),endZ(x,false));},v(0,0,-1));
 panel('panel_FrontValanceTern',16,6,(u,t)=>{const x=(u*2-1)*.737;return v(x,mix(.365,.95,t),endZ(x,true));},v(0,0,1));
 for(const front of [true,false]){
  const stem=front?'front':'rear',sign=front?1:-1;
  panel('panel_bumper_'+stem+'Tern',18,2,(u,t)=>{const x=(u*2-1)*.785;return v(x,mix(.425,.557,t),sign*(1.885-.069*(x/.785)**4+.009*Math.sin(t*Math.PI)));},v(0,0,sign),rubber,.048);
  for(const side of [-1,1])box('Structure '+stem+' crash mount Tern '+side,side*.47,.472,sign*1.735,.075,.062,.20,steel);
 }
 box('panel_FrontGrilleTern',0,.793,1.839,.627,.203,.020,rubber);
 for(let i=0;i<5;i++)box('panel_FrontGrilleTernSlat'+i,0,.716+i*.036,1.854,.604,.009,.012,trim);
 for(const side of [-1,1]){
  const x=side*.512;box('panel_HeadlightTernCup'+side,x,.795,1.839,.352,.209,.036,trim);
  box('panel_HeadlightTernLens'+side,x,.802,1.866,.291,.151,.014,lamp);
  for(let i=0;i<7;i++)box('panel_HeadlightTernRib'+side+i,x-.120+i*.04,.802,1.875,.003,.144,.003,lamp);
  box('panel_IndicatorTern'+side,side*.648,.609,1.852,.13,.054,.022,amber);
  bar('panel_WiperTern'+side,v(side*.39,1.043,.591),v(side*.18,1.124,.484),.006,rubber);
 }
 bar('panel_TailgateTernWiper',v(0,1.08,-1.674),v(.295,1.182,-1.498),.007,rubber);
 box('Structure Tern floor',0,.365,-.07,1.43,.026,3.33,steel);
 for(const side of [-1,1])box('Structure Tern rail '+side,side*.48,.324,-.05,.065,.07,3.23,steel);
 for(const z of [-1.44,-.68,.30,1.32])box('Structure Tern beam '+z,0,.337,z,1.37,.050,.065,steel);
 box('Interior Tern carpet',0,.401,-.20,1.39,.018,2.1,cloth);
 box('Structure Tern firewall',0,.697,.663,1.38,.612,.023,steel);
 box('Interior Tern dashboard',0,.984,.503,1.38,.135,.212,vinyl);
 for(const side of [-1,1]){
  box('Interior Tern seat cushion '+side,side*.343,.556,-.166,.48,.133,.474,cloth);
  const back=box('Interior Tern seat back '+side,side*.343,.818,-.41,.48,.43,.11,cloth);back.rotation.x=-.14;
  box('Interior Tern headrest '+side,side*.343,1.129,-.46,.24,.13,.085,vinyl);
  for(const edge of [-1,1])box('Interior Tern seat bolster '+side+edge,side*.343+edge*.205,.80,-.342,.069,.338,.11,vinyl);
 }
 box('Interior Tern rear bench',0,.574,-.956,1.14,.13,.39,cloth);box('Interior Tern rear backrest',0,.813,-1.166,1.14,.344,.094,cloth);
 box('Interior Tern load floor',0,.538,-1.486,1.20,.028,.569,vinyl);
 const steering=add('Interior Tern steering rim',new T.TorusGeometry(.148,.010,6,24),rubber);steering.position.set(-.343,1.045,.268);steering.rotation.x=-.33;
 bar('Interior Tern steering spoke',v(-.483,1.045,.268),v(-.203,1.045,.268),.009,trim);
 bar('Interior Tern steering column',v(-.343,1.045,.268),v(-.343,.857,.512),.014,steel);
 box('Interior Tern instrument hood',-.343,1.054,.422,.35,.12,.16,vinyl);
 bar('Interior Tern gear lever',v(0,.424,-.02),v(0,.66,.02),.008,steel);
 // Short transverse block and offset gearbox leave visible front half-shafts.
 box('Structure engine block Tern',-.055,.642,1.141,.57,.244,.282,steel);
 box('Structure engine sump Tern',-.055,.495,1.141,.56,.063,.259,steel);
 box('Structure engine valve cover Tern',-.055,.800,1.141,.51,.078,.178,alloy);
 box('Structure engine air cleaner Tern',-.063,.868,1.173,.33,.064,.212,rubber);
 box('Structure Tern transaxle',.352,.625,1.147,.226,.208,.28,steel);
 for(const side of [-1,1])bar('Structure Tern front halfshaft '+side,v(.31,.414,1.18),v(side*.69,.414,1.18),.018,steel);
 for(let i=0;i<4;i++)bar('Structure intake runner Tern '+i,v(-.263+i*.132,.72,1.28),v(-.263+i*.132,.79,1.368),.022,alloy);
 box('Structure radiator Tern',0,.692,1.64,.76,.294,.045,steel);
 for(let i=0;i<18;i++)box('Structure radiator fin Tern '+i,-.346+i*.041,.692,1.668,.005,.261,.007,rubber);
 box('Structure Tern battery',-.431,.64,1.413,.19,.154,.231,rubber);
 bar('Structure Tern exhaust',v(-.32,.281,.59),v(-.32,.281,-1.825),.024,steel);
 const source=buildCompactAsset();for(const [i,name]of ['FL','FR','RL','RR'].entries()){
  const wheel=source.getObjectByName('wheel_'+name)!;wheel.removeFromParent();wheel.position.set((i%2?1:-1)*.690,.3400195,(i<2?1:-1)*1.18);root.add(wheel);
 }
 source.traverse(o=>{if(o instanceof T.Mesh)o.geometry.dispose();});root.updateMatrixWorld(true);return root;
}
