import * as T from 'three';
import {formedVehiclePanel,panelSamples} from './formed-vehicle-panel';
import {classicWindowFrame} from './classic-window-frame';
import {addRoadWheels} from './road-wheels';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),mix=T.MathUtils.lerp;
/** Original rounded 1990s three-door hot hatch. Authored in metres, nose +Z. */
export function buildKiteAsset(){
 const root=new T.Group();root.name='Kite2000';
 const mat=(name:string,color:number,roughness=.6,metalness=.15)=>new T.MeshPhysicalMaterial({name,color,roughness,metalness});
 const paint=mat('paint_Kite',0x327b82,.34,.16);paint.clearcoat=.8;
 const steel=mat('Structure Kite Steel',0x39434a,.65,.6),rubber=mat('Kite Rubber',0x20282a,.88),alloy=mat('Kite Alloy',0xb4b9b7,.3,.72),cloth=mat('Interior Kite Cloth',0x384655,.96),vinyl=mat('Interior Kite Vinyl',0x252d32,.88),glass=mat('Kite Glass',0x3d5a64,.1,.1),white=mat('Kite Headlight',0xdfebdc,.2),red=mat('Kite Brakelight',0xa42123,.22),amber=mat('Kite Indicator',0xd29b35,.25);
 glass.transparent=true;glass.opacity=.48;glass.depthWrite=false;
 const add=(name:string,g:T.BufferGeometry,m:T.Material)=>{if(g.index)g=g.toNonIndexed();const o=new T.Mesh(g,m);o.name=name;o.castShadow=o.receiveShadow=true;root.add(o);return o;};
 const box=(name:string,x:number,y:number,z:number,w:number,h:number,d:number,m:T.Material)=>{const o=add(name,new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);return o;};
 const panel=(name:string,nu:number,nv:number,map:(u:number,t:number)=>T.Vector3,n:T.Vector3,m:T.Material=paint,depth=.020)=>add(name,formedVehiclePanel(panelSamples(nu),panelSamples(nv),map,n,depth),m);
 const bar=(name:string,a:T.Vector3,b:T.Vector3,r:number,m:T.Material)=>{const o=add(name,new T.CylinderGeometry(r,r,a.distanceTo(b),8),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(v(0,1,0),b.clone().sub(a).normalize());return o;};
 const window=(name:string,c:T.Vector3[],side:number)=>{const f=classicWindowFrame(c,side);add('panel_'+name+'Frame',f.frame,paint);add('panel_'+name+'Seal',f.seal,rubber);add('glass_'+name,f.glass,glass).castShadow=false;};
 const width=(y:number,z:number)=>.837-.045*((y-.72)/.40)**2-.045*(Math.abs(z)/1.93)**6;
 const arch=(z:number)=>{const d=Math.min(Math.abs(z-1.24),Math.abs(z+1.24));return d<.392?Math.max(.39,.36+Math.sqrt(.392**2-d*d)):.39;};
 for(const side of [-1,1]){
  const suffix=side<0?'L':'R';
  for(const [name,a,b]of [['RearQuarter',-1.91,-.58],['BodyDoor',-.58,.74],['FrontWing',.74,1.91]]as const){
   const stem='panel_'+name+suffix+'Kite';
   panel(stem,18,7,(u,t)=>{const z=mix(a,b,u),y=mix(arch(z),1.035,t);return v(side*width(y,z),y,z);},v(side,0,0));
   if(name==='BodyDoor'){box(stem+'Handle',side*.807,.985,-.40,.033,.04,.17,rubber);box(stem+'InnerCard',side*.75,.78,.08,.03,.43,1.22,vinyl);}
  }
  window('BodyDoor'+suffix+'Kite',[v(side*.802,1.035,.74),v(side*.802,1.035,-.56),v(side*.664,1.49,-.56),v(side*.664,1.49,.15)],side);
  window('Quarter'+suffix+'Kite',[v(side*.802,1.035,-.63),v(side*.782,1.035,-1.72),v(side*.664,1.49,-1.12),v(side*.664,1.49,-.63)],side);
  bar('Structure Kite B Pillar '+suffix,v(side*.78,.45,-.595),v(side*.65,1.49,-.595),.027,steel);
  panel('panel_RoofShoulderKite'+suffix,6,20,(u,t)=>{const a=u*Math.PI/2;return v(side*(.54+.124*Math.cos(a)),1.49+.06*Math.sin(a),mix(-1.12,.15,t));},v(side,1,0).normalize());
  panel('panel_HoodShoulderKite'+suffix,5,16,(u,t)=>v(side*mix(width(1.035,mix(.74,1.91,t)),.69,u),mix(1.055,.99,t)+.018*Math.sin(u*Math.PI),mix(.74,1.91,t)),v(side,1,0).normalize());
  for(const z of [-1.24,1.24]){
   panel('Structure Kite wheelhouse '+suffix+z,22,4,(u,t)=>v(side*mix(.56,.84,t),.36+Math.sin(u*Math.PI)*.395,z+Math.cos(u*Math.PI)*.395),v(0,1,0),steel,.016);
   const points=Array.from({length:25},(_,i)=>{const a=mix(.08,Math.PI-.08,i/24),y=.36+Math.sin(a)*.40,zz=z+Math.cos(a)*.40;return v(side*(width(y,zz)+.01),y,zz);});
   add('panel_KiteArchTrim'+suffix+z,new T.TubeGeometry(new T.CatmullRomCurve3(points),24,.014,5,false),rubber);
  }
  box('panel_KiteSill'+suffix,side*.824,.42,0,.065,.09,1.72,paint);
  box('panel_KiteWaistStrip'+suffix,side*.835,.73,0,.018,.035,3.64,rubber);
  for(const z of [-.58,.74])bar('panel_KiteDoorSeam'+suffix+z,v(side*width(.45,z),.45,z),v(side*width(1.035,z),1.035,z),.003,rubber);
  bar('panel_BodyDoor'+suffix+'KiteMirrorArm',v(side*.8,1.08,.61),v(side*.92,1.13,.62),.018,rubber);
  const mirror=add('panel_BodyDoor'+suffix+'KiteMirror',new T.SphereGeometry(1,10,6),paint);mirror.position.set(side*.94,1.13,.61);mirror.scale.set(.075,.055,.115);
 }
 panel('panel_hoodKite',16,16,(u,t)=>{const x=(u*2-1)*.69;return v(x,mix(1.055,.99,t)+.035*(1-(x/.69)**2)*Math.sin(t*Math.PI),mix(.74,1.91,t));},v(0,1,0));
 panel('panel_RoofKite',14,16,(u,t)=>{const x=(u*2-1)*.54;return v(x,1.55+.025*(1-(x/.54)**2)*Math.sin(t*Math.PI),mix(-1.12,.15,t));},v(0,1,0));
 window('FrontKite',[v(-.802,1.035,.74),v(.802,1.035,.74),v(.664,1.49,.15),v(-.664,1.49,.15)],1);
 window('TailgateKite',[v(-.782,1.035,-1.72),v(.782,1.035,-1.72),v(.664,1.49,-1.12),v(-.664,1.49,-1.12)],-1);
 panel('panel_TailgateKiteSkin',16,6,(u,t)=>v((u*2-1)*.775,mix(.66,1.035,t),mix(-1.92,-1.72,t)-.02*Math.sin(t*Math.PI)),v(0,0,-1));
 box('panel_TailgateKiteInner',0,.86,-1.80,1.46,.30,.025,vinyl);
 panel('panel_TailgateKiteSpoiler',14,4,(u,t)=>v((u*2-1)*.71,1.51+.018*Math.sin(t*Math.PI),mix(-1.31,-1.10,t)),v(0,1,0),paint,.035);
 for(const sign of [-1,1]){
  const front=sign===1,name=front?'front':'rear';
  panel('panel_Kite'+name+'Valance',18,6,(u,t)=>{const x=(u*2-1)*.80;return v(x,mix(.41,front?1.0:.68,t),sign*(1.925-.07*(x/.8)**4));},v(0,0,sign));
  panel('panel_bumper_'+name+'Kite',22,5,(u,t)=>{const x=(u*2-1)*.85;return v(x,mix(.40,.64,t),sign*(1.995-.14*(x/.85)**4+.018*Math.sin(t*Math.PI)));},v(0,0,sign),paint,.035);
  for(const side of [-1,1])box('Structure Kite bumper mount '+name+side,side*.55,.52,sign*1.82,.10,.08,.30,steel);
 }
 box('panel_KiteLowerIntake',0,.51,2.022,.87,.12,.012,rubber);
 for(let i=-4;i<=4;i++)box('panel_KiteIntakeBar'+i,i*.085,.51,2.031,.016,.105,.012,steel);
 box('panel_KiteGrille',0,.86,1.943,.59,.12,.02,rubber);
 box('panel_KiteBadge',0,.875,1.959,.065,.05,.012,alloy);
 for(const side of [-1,1]){
  box('panel_KiteHeadlightSeal'+side,side*.56,.85,1.928,.46,.18,.035,rubber);
  box('panel_KiteHeadlight'+side,side*.54,.85,1.950,.36,.15,.018,white);
  box('panel_KiteFrontIndicator'+side,side*.75,.85,1.933,.09,.15,.025,amber);
  for(let k=0;k<6;k++)box('panel_KiteLampFlute'+side+k,side*.54+(k-2.5)*.052,.85,1.962,.007,.13,.005,white);
  box('panel_KiteRearLampBase'+side,side*.65,.84,-1.89,.27,.27,.04,rubber);
  box('panel_KiteRearLamp'+side,side*.65,.83,-1.918,.23,.14,.018,red);
  box('panel_KiteRearIndicator'+side,side*.65,.94,-1.897,.23,.055,.018,amber);
  bar('panel_KiteWiper'+side,v(side*.45,1.05,.72),v(side*.24,1.22,.50),.007,rubber);
 }
 box('panel_TailgateKiteHandle',0,.88,-1.87,.18,.035,.03,rubber);
 box('Structure Kite floor',0,.43,-.23,1.50,.04,2.80,steel);
 for(const side of [-1,1]){
  box('Interior Kite SeatBase'+side,side*.37,.62,-.23,.49,.17,.58,cloth);
  const seat=box('Interior Kite SeatBack'+side,side*.37,.89,-.52,.49,.54,.14,cloth);seat.rotation.x=-.12;
  box('Interior Kite Headrest'+side,side*.37,1.22,-.56,.24,.14,.10,cloth);
  box('Structure Kite rail'+side,side*.51,.36,0,.08,.08,3.3,steel);
 }
 box('Interior Kite RearBench',0,.66,-1.15,1.29,.20,.43,cloth);box('Interior Kite RearBack',0,.89,-1.36,1.29,.36,.12,cloth);
 box('Interior Kite Dashboard',0,.98,.43,1.42,.13,.32,vinyl);
 box('Interior Kite InstrumentBinnacle',-.36,1.07,.39,.39,.10,.16,vinyl);
 for(const side of [-1,1])box('Interior Kite Dial'+side,-.36+side*.08,1.06,.301,.10,.075,.006,white);
 const wheel=add('Interior SteeringWheel Kite',new T.TorusGeometry(.145,.016,8,24),rubber);wheel.position.set(-.36,1.02,.14);wheel.rotation.x=.32;
 for(const side of [-1,1])bar('Interior Kite SteeringSpoke'+side,v(-.36,1.02,.14),v(-.36+side*.13,1.02,.14),.012,steel);
 box('Interior Kite Console',0,.65,.02,.16,.28,.52,vinyl);bar('Interior Kite GearLever',v(0,.79,.03),v(0,.91,.02),.013,steel);
 box('Structure Kite transverse engine',0,.71,1.23,.93,.32,.43,steel);
 for(let i=0;i<4;i++)box('Structure Kite intake runner'+i,-.30+i*.20,.91,1.17,.12,.08,.30,alloy);
 box('Structure Kite radiator',0,.69,1.72,1.04,.35,.045,steel);
 for(let i=-7;i<=7;i++)box('Structure Kite radiator fin'+i,i*.067,.69,1.75,.009,.31,.008,alloy);
 bar('Structure Kite exhaust',v(.34,.32,1.13),v(.34,.32,-1.91),.028,steel);
 addRoadWheels(root,'tern');for(const [i,name]of ['FL','FR','RL','RR'].entries()){const w=root.getObjectByName('wheel_'+name)!;w.position.set((i%2?1:-1)*.72,.36,(i<2?1:-1)*1.24);w.scale.setScalar(.34/.32);}
 root.updateMatrixWorld(true);return root;
}
