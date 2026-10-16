import * as T from 'three';
import {formedVehiclePanel,panelSamples} from './formed-vehicle-panel';
import {classicWindowFrame} from './classic-window-frame';
import {addRoadWheels} from './road-wheels';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),mix=T.MathUtils.lerp;
/** Original 1980s notchback coupe: long bonnet, low cabin, separate boot. Nose +Z. */
export function buildMorrowAsset(){
 const root=new T.Group();root.name='Morrow420';
 const mat=(name:string,color:number,roughness=.6,metalness=.15)=>new T.MeshPhysicalMaterial({name,color,roughness,metalness});
 const paint=mat('paint_Morrow',0x713b42,.34,.16);paint.clearcoat=.8;
 const steel=mat('Structure Morrow Steel',0x384047,.67,.65),rubber=mat('Morrow Rubber',0x171c20,.9),alloy=mat('Morrow Alloy',0xabb3b5,.32,.75),cloth=mat('Interior Morrow Cloth',0x624a43,.96),vinyl=mat('Interior Morrow Vinyl',0x302b2a,.9),glass=mat('Morrow Glass',0x43545b,.1,.1),white=mat('Morrow Headlight',0xe5e4d5,.22),red=mat('Morrow Brakelight',0xa31e25,.24),amber=mat('Morrow Indicator',0xd68b25,.28);
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
  for(const [name,a,b]of [['RearQuarter',-2.36,-.72],['BodyDoor',-.72,.75],['FrontWing',.75,2.36]]as const){
   const stem='panel_'+name+suffix+'Morrow';
   panel(stem,22,8,(u,t)=>{const z=mix(a,b,u),y=mix(arch(z),1.055,t);return v(side*width(y,z),y,z);},v(side,0,0));
   if(name==='BodyDoor'){box(stem+'Handle',side*.89,1.00,-.51,.035,.04,.21,rubber);box(stem+'InnerCard',side*.82,.79,.02,.035,.43,1.36,vinyl);}
  }
  window('BodyDoor'+suffix+'Morrow',[v(side*.875,1.055,.75),v(side*.875,1.055,-.70),v(side*.71,1.46,-.60),v(side*.71,1.46,.12)],side);
  window('Quarter'+suffix+'Morrow',[v(side*.875,1.055,-.78),v(side*.87,1.055,-1.34),v(side*.71,1.46,-.99),v(side*.71,1.46,-.68)],side);
  panel('panel_MorrowSail'+suffix,6,8,(u,t)=>v(side*mix(.71,.875,t),mix(1.46,1.055,t),mix(mix(-.99,-1.34,t),mix(-1.12,-1.55,t),u)),v(side,0,0));
  bar('Structure Morrow B Pillar '+suffix,v(side*.83,.46,-.74),v(side*.70,1.46,-.64),.028,steel);
  box('panel_MorrowSill'+suffix,side*.875,.43,0,.07,.10,1.72,rubber);
  box('panel_MorrowWaistStrip'+suffix,side*.905,.75,0,.018,.045,4.48,rubber);
  for(const z of [-.72,.75])bar('panel_MorrowDoorSeam'+suffix+z,v(side*width(.44,z),.44,z),v(side*width(1.055,z),1.055,z),.003,rubber);
  bar('panel_BodyDoor'+suffix+'MorrowMirrorArm',v(side*.86,1.11,.60),v(side*.98,1.12,.59),.017,rubber);
  box('panel_BodyDoor'+suffix+'MorrowMirror',side*1.01,1.14,.58,.12,.10,.19,paint);
  box('panel_BodyDoor'+suffix+'MorrowMirrorGlass',side*1.01,1.14,.479,.095,.075,.006,alloy);
  for(const z of [-1.36,1.36]){
   panel('Structure Morrow wheelhouse '+suffix+z,22,4,(u,t)=>v(side*mix(.60,.91,t),.39+Math.sin(u*Math.PI)*.433,z+Math.cos(u*Math.PI)*.433),v(0,1,0),steel,.016);
   const points=Array.from({length:25},(_,i)=>{const a=mix(.08,Math.PI-.08,i/24),y=.39+Math.sin(a)*.44,zz=z+Math.cos(a)*.44;return v(side*(width(y,zz)+.008),y,zz);});
   add('panel_MorrowArchTrim'+suffix+z,new T.TubeGeometry(new T.CatmullRomCurve3(points),24,.015,5,false),rubber);
  }
 }
 panel('panel_hoodMorrow',18,20,(u,t)=>{const x=(u*2-1)*.875;return v(x,mix(1.075,1.005,t)+.025*(1-Math.abs(x/.875)),mix(.75,2.36,t));},v(0,1,0));
 panel('panel_RoofMorrow',18,16,(u,t)=>{const x=(u*2-1)*.71;return v(x,1.46+.04*(1-(x/.71)**2),mix(-1.12,.12,t));},v(0,1,0));
 window('FrontMorrow',[v(-.875,1.055,.75),v(.875,1.055,.75),v(.71,1.46,.12),v(-.71,1.46,.12)],1);
 window('RearMorrow',[v(-.875,1.055,-1.55),v(.875,1.055,-1.55),v(.71,1.46,-1.12),v(-.71,1.46,-1.12)],-1);
 panel('panel_trunkMorrow',18,12,(u,t)=>{const x=(u*2-1)*.87;return v(x,mix(1.06,.99,t)+.015*(1-(x/.87)**2),mix(-1.55,-2.36,t));},v(0,1,0));
 box('panel_trunkMorrowLip',0,1.025,-2.29,1.70,.065,.13,paint);
 for(const sign of [-1,1]){
  const name=sign===1?'front':'rear';
  panel('panel_Morrow'+name+'Valance',18,7,(u,t)=>{const x=(u*2-1)*.86;return v(x,mix(.44,1.0,t),sign*(2.365-.06*(x/.86)**6));},v(0,0,sign));
  panel('panel_bumper_'+name+'Morrow',22,5,(u,t)=>{const x=(u*2-1)*.92;return v(x,mix(.42,.65,t),sign*(2.43-.16*(x/.92)**6+.01*Math.sin(t*Math.PI)));},v(0,0,sign),rubber,.035);
  box('panel_Morrow'+name+'BumperStrip',0,.58,sign*2.455,1.68,.035,.018,alloy);
  for(const side of [-1,1])box('Structure Morrow bumper mount '+name+side,side*.58,.53,sign*2.26,.10,.09,.32,steel);
 }
 box('panel_MorrowGrille',0,.85,2.382,.64,.19,.018,rubber);
 for(let i=-4;i<=4;i++)box('panel_MorrowGrilleBar'+i,i*.069,.85,2.395,.013,.17,.01,alloy);
 box('panel_MorrowGrilleBadge',0,.86,2.405,.065,.06,.01,alloy);
 box('panel_MorrowLowerIntake',0,.48,2.456,.75,.065,.015,rubber);
 for(const side of [-1,1]){
  box('panel_MorrowHeadlightSeal'+side,side*.61,.85,2.366,.49,.22,.04,rubber);
  for(const i of [-1,1]){
   box('panel_MorrowHeadlight'+side+':'+i,side*.61+i*.115,.85,2.39,.205,.17,.018,white);
   for(let k=0;k<4;k++)box('panel_MorrowLampFlute'+side+':'+i+':'+k,side*.61+i*.115+(k-1.5)*.045,.85,2.403,.006,.15,.005,white);
  }
  box('panel_MorrowFrontIndicator'+side,side*.61,.69,2.387,.35,.06,.018,amber);
  box('panel_MorrowRearLampBase'+side,side*.59,.84,-2.367,.53,.24,.035,rubber);
  box('panel_MorrowRearLamp'+side,side*.55,.84,-2.391,.38,.19,.018,red);
  box('panel_MorrowRearIndicator'+side,side*.79,.84,-2.373,.09,.19,.018,amber);
  box('panel_MorrowReverseLamp'+side,side*.34,.84,-2.394,.065,.17,.018,white);
  bar('panel_MorrowWiper'+side,v(side*.50,1.07,.72),v(side*.29,1.22,.48),.007,rubber);
  box('Structure Morrow longitudinal rail'+side,side*.55,.35,0,.09,.09,4.15,steel);
  box('Interior Morrow SeatBase'+side,side*.40,.61,-.26,.53,.17,.60,cloth);
  const seat=box('Interior Morrow SeatBack'+side,side*.40,.88,-.57,.53,.52,.15,cloth);seat.rotation.x=-.14;
  box('Interior Morrow Headrest'+side,side*.40,1.20,-.61,.27,.14,.11,cloth);
  bar('Structure Morrow exhaust'+side,v(side*.31,.31,.85),v(side*.53,.31,-2.42),.032,steel);
 }
 box('panel_MorrowRearPlateRecess',0,.84,-2.389,.41,.19,.02,rubber);
 box('Structure Morrow floor',0,.43,-.26,1.61,.045,3.14,steel);
 box('Interior Morrow RearBench',0,.63,-1.18,1.38,.19,.47,cloth);box('Interior Morrow RearBack',0,.87,-1.41,1.38,.36,.13,cloth);
 box('Interior Morrow Dashboard',0,.98,.46,1.57,.14,.32,vinyl);box('Interior Morrow InstrumentBinnacle',-.40,1.065,.38,.46,.10,.17,vinyl);
 for(let i=-1;i<=1;i++)box('Interior Morrow Dial'+i,-.4+i*.125,1.06,.29,.085,.07,.006,white);
 const wheel=add('Interior SteeringWheel Morrow',new T.TorusGeometry(.15,.017,8,24),rubber);wheel.position.set(-.40,1.02,.14);wheel.rotation.x=.28;
 for(const side of [-1,1])bar('Interior Morrow SteeringSpoke'+side,v(-.40,1.02,.14),v(-.40+side*.14,1.02,.14),.014,steel);
 box('Interior Morrow Console',0,.61,.05,.20,.27,.68,vinyl);bar('Interior Morrow GearLever',v(0,.74,.04),v(0,.91,.01),.014,steel);
 box('Structure Morrow longitudinal V8',0,.68,1.38,.61,.39,.78,steel);
 for(const side of [-1,1]){const cover=box('Structure Morrow valve cover'+side,side*.24,.88,1.38,.22,.10,.67,alloy);cover.rotation.z=side*.22;}
 const air=add('Structure Morrow round air cleaner',new T.CylinderGeometry(.26,.26,.065,20),steel);air.position.set(0,.94,1.40);
 box('Structure Morrow radiator',0,.71,2.03,1.08,.39,.045,steel);
 for(let i=-8;i<=8;i++)box('Structure Morrow radiator fin'+i,i*.061,.71,2.06,.008,.35,.008,alloy);
 addRoadWheels(root,'marten');for(const [i,name]of ['FL','FR','RL','RR'].entries()){const w=root.getObjectByName('wheel_'+name)!;w.position.set((i%2?1:-1)*.77,.39,(i<2?1:-1)*1.36);w.scale.setScalar(.38/.32);}
 root.updateMatrixWorld(true);return root;
}
