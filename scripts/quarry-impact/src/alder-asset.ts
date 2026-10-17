import * as T from 'three';
import {formedVehiclePanel,panelSamples} from './formed-vehicle-panel';
import {classicWindowFrame} from './classic-window-frame';
import {addRoadWheels} from './road-wheels';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),mix=T.MathUtils.lerp;
/** Original 1980s European estate: four doors, upright cargo cabin, inline-four engine. Nose +Z. */
export function buildAlderAsset(){
 const root=new T.Group();root.name='Alder230';
 const mat=(name:string,color:number,roughness=.6,metalness=.15)=>new T.MeshPhysicalMaterial({name,color,roughness,metalness});
 const paint=mat('paint_Alder',0xb29a65,.34,.16);paint.clearcoat=.8;
 const steel=mat('Structure Alder Steel',0x384047,.67,.65),rubber=mat('Alder Rubber',0x171c20,.9),alloy=mat('Alder Alloy',0xabb3b5,.32,.75),cloth=mat('Interior Alder Cloth',0x62674e,.96),vinyl=mat('Interior Alder Vinyl',0x302b2a,.9),glass=mat('Alder Glass',0x43545b,.1,.1),white=mat('Alder Headlight',0xe5e4d5,.22),red=mat('Alder Brakelight',0xa31e25,.24),amber=mat('Alder Indicator',0xd68b25,.28);
 glass.transparent=true;glass.opacity=.45;glass.depthWrite=false;
 const add=(name:string,g:T.BufferGeometry,m:T.Material)=>{if(g.index)g=g.toNonIndexed();const o=new T.Mesh(g,m);o.name=name;o.castShadow=o.receiveShadow=true;root.add(o);return o;};
 const box=(name:string,x:number,y:number,z:number,w:number,h:number,d:number,m:T.Material)=>{const o=add(name,new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);return o;};
 const panel=(name:string,nu:number,nv:number,map:(u:number,t:number)=>T.Vector3,n:T.Vector3,m:T.Material=paint,depth=.02)=>add(name,formedVehiclePanel(panelSamples(nu),panelSamples(nv),map,n,depth),m);
 const bar=(name:string,a:T.Vector3,b:T.Vector3,r:number,m:T.Material)=>{const o=add(name,new T.CylinderGeometry(r,r,a.distanceTo(b),8),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(v(0,1,0),b.clone().sub(a).normalize());return o;};
 const window=(name:string,c:T.Vector3[],side:number)=>{const f=classicWindowFrame(c,side);add('panel_'+name+'Frame',f.frame,paint);add('panel_'+name+'Seal',f.seal,rubber);add('glass_'+name,f.glass,glass).castShadow=false;};
 const width=(y:number,z:number)=>.90-.035*Math.abs(y-.78)/.4-.045*(Math.abs(z)/2.36)**8;
 const arch=(z:number)=>{const d=Math.min(Math.abs(z-1.36),Math.abs(z+1.36));return d<.43?Math.max(.40,.39+Math.sqrt(.43**2-d*d)):.40;};
 for(const side of [-1,1]){
  const suffix=side<0?'L':'R';
  for(const [name,a,b]of [['RearQuarter',-2.36,-1.34],['BodyDoorRear',-1.34,-.40],['BodyDoor',-.40,.75],['FrontWing',.75,2.36]]as const){
   const stem='panel_'+name+suffix+'Alder';
   panel(stem,22,8,(u,t)=>{const z=mix(a,b,u),y=mix(arch(z),1.055,t);return v(side*width(y,z),y,z);},v(side,0,0));
   if(name==='BodyDoor'||name==='BodyDoorRear'){box(stem+'Handle',side*.89,1.00,a+.16,.035,.04,.18,rubber);box(stem+'InnerCard',side*.82,.79,(a+b)/2,.035,.43,b-a-.08,vinyl);}
  }
  window('BodyDoor'+suffix+'Alder',[v(side*.875,1.055,.75),v(side*.875,1.055,-.36),v(side*.76,1.57,-.36),v(side*.76,1.57,.25)],side);
  window('BodyDoorRear'+suffix+'Alder',[v(side*.875,1.055,-.44),v(side*.875,1.055,-1.30),v(side*.76,1.57,-1.30),v(side*.76,1.57,-.44)],side);
  window('Cargo'+suffix+'Alder',[v(side*.875,1.055,-1.38),v(side*.875,1.055,-2.24),v(side*.76,1.57,-2.14),v(side*.76,1.57,-1.38)],side);
  for(const z of [-.40,-1.34])bar('Structure Alder cabin pillar '+suffix+z,v(side*.83,.46,z),v(side*.76,1.57,z),.028,steel);
  bar('panel_AlderRoofRail'+suffix,v(side*.64,1.66,-2.03),v(side*.64,1.66,.10),.018,rubber);
  for(const z of [-1.95,-.95,.02])box('panel_AlderRoofRailFoot'+suffix+z,side*.64,1.62,z,.06,.09,.12,rubber);
  box('panel_AlderSill'+suffix,side*.875,.43,0,.07,.10,1.72,rubber);
  box('panel_AlderWaistStrip'+suffix,side*.905,.75,0,.018,.045,4.48,rubber);
  for(const z of [-1.34,-.40,.75])bar('panel_AlderDoorSeam'+suffix+z,v(side*width(.44,z),.44,z),v(side*width(1.055,z),1.055,z),.003,rubber);
  bar('panel_BodyDoor'+suffix+'AlderMirrorArm',v(side*.86,1.11,.60),v(side*.98,1.12,.59),.017,rubber);
  box('panel_BodyDoor'+suffix+'AlderMirror',side*1.01,1.14,.58,.12,.10,.19,paint);
  box('panel_BodyDoor'+suffix+'AlderMirrorGlass',side*1.01,1.14,.479,.095,.075,.006,alloy);
  for(const z of [-1.36,1.36]){
   panel('Structure Alder wheelhouse '+suffix+z,22,4,(u,t)=>v(side*mix(.60,.91,t),.39+Math.sin(u*Math.PI)*.433,z+Math.cos(u*Math.PI)*.433),v(0,1,0),steel,.016);
   const points=Array.from({length:25},(_,i)=>{const a=mix(.08,Math.PI-.08,i/24),y=.39+Math.sin(a)*.44,zz=z+Math.cos(a)*.44;return v(side*(width(y,zz)+.008),y,zz);});
   add('panel_AlderArchTrim'+suffix+z,new T.TubeGeometry(new T.CatmullRomCurve3(points),24,.015,5,false),rubber);
  }
 }
 panel('panel_hoodAlder',18,20,(u,t)=>{const x=(u*2-1)*.875;return v(x,mix(1.075,1.005,t)+.025*(1-Math.abs(x/.875)),mix(.75,2.36,t));},v(0,1,0));
 panel('panel_RoofAlder',18,16,(u,t)=>{const x=(u*2-1)*.76;return v(x,1.57+.035*(1-(x/.76)**2),mix(-2.17,.25,t));},v(0,1,0));
 window('FrontAlder',[v(-.875,1.055,.75),v(.875,1.055,.75),v(.76,1.57,.25),v(-.76,1.57,.25)],1);
 window('TailgateAlder',[v(-.875,1.055,-2.30),v(.875,1.055,-2.30),v(.76,1.57,-2.17),v(-.76,1.57,-2.17)],-1);
 panel('panel_TailgateAlder',18,10,(u,t)=>v((u*2-1)*.87,mix(.64,1.055,t),mix(-2.36,-2.30,t)),v(0,0,-1));
 box('panel_TailgateAlderHandle',0,1.00,-2.33,.25,.05,.035,rubber);
 bar('panel_TailgateAlderWiper',v(.40,1.09,-2.30),v(.10,1.43,-2.21),.009,rubber);
 box('Interior Alder CargoFloor',0,.60,-1.81,1.60,.06,1.06,vinyl);
 for(let i=-4;i<=4;i++)box('Interior Alder CargoRunner'+i,i*.15,.634,-1.81,.012,.008,.98,rubber);
 for(const sign of [-1,1]){
  const name=sign===1?'front':'rear';
  panel('panel_Alder'+name+'Valance',18,7,(u,t)=>{const x=(u*2-1)*.86;return v(x,mix(.44,1.0,t),sign*(2.365-.06*(x/.86)**6));},v(0,0,sign));
  panel('panel_bumper_'+name+'Alder',22,5,(u,t)=>{const x=(u*2-1)*.92;return v(x,mix(.42,.65,t),sign*(2.43-.16*(x/.92)**6+.01*Math.sin(t*Math.PI)));},v(0,0,sign),rubber,.035);
  box('panel_Alder'+name+'BumperStrip',0,.58,sign*2.455,1.68,.035,.018,alloy);
  for(const side of [-1,1])box('Structure Alder bumper mount '+name+side,side*.58,.53,sign*2.26,.10,.09,.32,steel);
 }
 box('panel_AlderGrille',0,.85,2.382,.64,.19,.018,rubber);
 for(let i=-4;i<=4;i++)box('panel_AlderGrilleBar'+i,i*.069,.85,2.395,.013,.17,.01,alloy);
 box('panel_AlderGrilleBadge',0,.86,2.405,.065,.06,.01,alloy);
 box('panel_AlderLowerIntake',0,.48,2.456,.75,.065,.015,rubber);
 for(const side of [-1,1]){
  box('panel_AlderHeadlightSeal'+side,side*.61,.85,2.366,.49,.22,.04,rubber);
  box('panel_AlderHeadlight'+side,side*.61,.85,2.39,.43,.17,.018,white);
  for(let k=0;k<7;k++)box('panel_AlderLampFlute'+side+':'+k,side*.61+(k-3)*.055,.85,2.403,.006,.15,.005,white);
  box('panel_AlderFrontIndicator'+side,side*.86,.85,2.34,.075,.17,.05,amber);
  box('panel_AlderRearLampBase'+side,side*.77,.88,-2.367,.19,.35,.035,rubber);
  box('panel_AlderRearLamp'+side,side*.77,.82,-2.391,.15,.16,.018,red);
  box('panel_AlderRearIndicator'+side,side*.77,1.00,-2.373,.15,.07,.018,amber);
  box('panel_AlderReverseLamp'+side,side*.77,.93,-2.394,.15,.06,.018,white);
  bar('panel_AlderWiper'+side,v(side*.50,1.07,.72),v(side*.29,1.22,.48),.007,rubber);
  box('Structure Alder longitudinal rail'+side,side*.55,.35,0,.09,.09,4.15,steel);
  box('Interior Alder SeatBase'+side,side*.40,.61,-.26,.53,.17,.60,cloth);
  const seat=box('Interior Alder SeatBack'+side,side*.40,.88,-.57,.53,.52,.15,cloth);seat.rotation.x=-.14;
  box('Interior Alder Headrest'+side,side*.40,1.20,-.61,.27,.14,.11,cloth);
  if(side===-1)bar('Structure Alder exhaust',v(-.31,.31,.85),v(-.53,.31,-2.42),.032,steel);
 }
 box('panel_AlderRearPlateRecess',0,.84,-2.389,.41,.19,.02,rubber);
 box('Structure Alder floor',0,.43,-.26,1.61,.045,3.14,steel);
 box('Interior Alder RearBench',0,.63,-1.18,1.38,.19,.47,cloth);box('Interior Alder RearBack',0,.87,-1.41,1.38,.36,.13,cloth);
 box('Interior Alder Dashboard',0,.98,.46,1.57,.14,.32,vinyl);box('Interior Alder InstrumentBinnacle',-.40,1.065,.38,.46,.10,.17,vinyl);
 for(let i=-1;i<=1;i++)box('Interior Alder Dial'+i,-.4+i*.125,1.06,.29,.085,.07,.006,white);
 const wheel=add('Interior SteeringWheel Alder',new T.TorusGeometry(.15,.017,8,24),rubber);wheel.position.set(-.40,1.02,.14);wheel.rotation.x=.28;
 for(const side of [-1,1])bar('Interior Alder SteeringSpoke'+side,v(-.40,1.02,.14),v(-.40+side*.14,1.02,.14),.014,steel);
 box('Interior Alder Console',0,.61,.05,.20,.27,.68,vinyl);bar('Interior Alder GearLever',v(0,.74,.04),v(0,.91,.01),.014,steel);
 box('Structure Alder longitudinal inline four',0,.68,1.38,.38,.39,.78,steel);
 box('Structure Alder valve cover',0,.91,1.38,.29,.09,.68,alloy);
 for(let i=0;i<4;i++)bar('Structure Alder ignition lead'+i,v(.10,.97,1.12+i*.17),v(.25,.81,1.12+i*.17),.009,rubber);
 box('Structure Alder air cleaner',.42,.85,1.35,.24,.14,.43,rubber);
 box('Structure Alder battery',-.45,.72,1.80,.24,.25,.30,rubber);
 box('Structure Alder radiator',0,.71,2.03,1.08,.39,.045,steel);
 for(let i=-8;i<=8;i++)box('Structure Alder radiator fin'+i,i*.061,.71,2.06,.008,.35,.008,alloy);
 addRoadWheels(root,'marten');for(const [i,name]of ['FL','FR','RL','RR'].entries()){const w=root.getObjectByName('wheel_'+name)!;w.position.set((i%2?1:-1)*.77,.39,(i<2?1:-1)*1.36);w.scale.setScalar(.38/.32);}
 root.updateMatrixWorld(true);return root;
}
