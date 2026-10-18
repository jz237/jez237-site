import * as T from 'three';
import {formedVehiclePanel,panelSamples} from './formed-vehicle-panel';
import {classicWindowFrame} from './classic-window-frame';
import {addRoadWheels} from './road-wheels';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),mix=T.MathUtils.lerp;
/** Original 1980s boxy European saloon: upright glasshouse, thick C-pillars,
 * four doors, big black safety bumpers, inline four, rear-wheel drive. Nose +Z. */
export function buildTordalAsset(){
 const root=new T.Group();root.name='Tordal244';
 const mat=(name:string,color:number,roughness=.6,metalness=.15)=>new T.MeshPhysicalMaterial({name,color,roughness,metalness});
 const paint=mat('paint_Tordal',0x2d4c7a,.36,.14);paint.clearcoat=.7;
 const steel=mat('Structure Tordal Steel',0x383f45,.66,.65),rubber=mat('Tordal Rubber',0x17191b,.9),alloy=mat('Tordal Alloy',0xb3b8ba,.32,.75),cloth=mat('Interior Tordal Cloth',0x8a7a5e,.96),vinyl=mat('Interior Tordal Vinyl',0x2c2a28,.9),glass=mat('Tordal Glass',0x3f5560,.06,.1),white=mat('Tordal Lens',0xf0ece0,.18),red=mat('Tordal Tail Lens',0xa8161f,.24),amber=mat('Tordal Amber Lens',0xd98a20,.25);
 glass.transparent=true;glass.opacity=.44;glass.depthWrite=false;
 const add=(name:string,g:T.BufferGeometry,m:T.Material)=>{if(g.index)g=g.toNonIndexed();const o=new T.Mesh(g,m);o.name=name;o.castShadow=o.receiveShadow=true;root.add(o);return o;};
 const box=(name:string,x:number,y:number,z:number,w:number,h:number,d:number,m:T.Material)=>{const o=add(name,new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);return o;};
 const panel=(name:string,nu:number,nv:number,map:(u:number,t:number)=>T.Vector3,n:T.Vector3,m:T.Material=paint,depth=.02)=>add(name,formedVehiclePanel(panelSamples(nu),panelSamples(nv),map,n,depth),m);
 const bar=(name:string,a:T.Vector3,b:T.Vector3,r:number,m:T.Material)=>{const o=add(name,new T.CylinderGeometry(r,r,a.distanceTo(b),8),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(v(0,1,0),b.clone().sub(a).normalize());return o;};
 const window=(name:string,c:T.Vector3[],side:number)=>{const f=classicWindowFrame(c,side);add('panel_'+name+'Frame',f.frame,rubber);add('panel_'+name+'Seal',f.seal,rubber);add('glass_'+name,f.glass,glass).castShadow=false;};
 const width=(y:number,z:number)=>.85-.02*Math.max(0,y-.80)/.12-.03*(Math.abs(z)/2.36)**10;
 const arch=(z:number)=>{const d=Math.min(Math.abs(z-1.32),Math.abs(z+1.32));return d<.41?Math.max(.38,.36+Math.sqrt(.41**2-d*d)):.38;};
 const SH=.93;
 for(const side of [-1,1]){
  const suffix=side<0?'L':'R';
  for(const [name,a,b]of [['RearQuarter',-2.34,-1.02],['BodyDoorRear',-1.02,-.04],['BodyDoor',-.04,.95],['FrontWing',.95,2.34]]as const){
   const stem='panel_'+name+suffix+'Tordal';
   panel(stem,22,8,(u,t)=>{const z=mix(a,b,u),y=mix(arch(z),SH,t);return v(side*width(y,z),y,z);},v(side,0,0));
   if(name==='BodyDoor'||name==='BodyDoorRear'){box(stem+'Handle',side*.855,.85,a+.16,.03,.04,.18,rubber);box(stem+'InnerCard',side*.79,.70,(a+b)/2,.03,.42,b-a-.08,vinyl);}
  }
  // Upright glass: front and rear door lights, a thick C-pillar to the rear screen.
  window('BodyDoor'+suffix+'Tordal',[v(side*.835,.935,.92),v(side*.835,.935,-.01),v(side*.72,1.37,-.01),v(side*.72,1.37,.44)],side);
  window('BodyDoorRear'+suffix+'Tordal',[v(side*.835,.935,-.07),v(side*.835,.935,-.98),v(side*.72,1.37,-.98),v(side*.72,1.37,-.07)],side);
  const a0=v(side*.835,.935,-1.02),a1=v(side*.72,1.375,-1.02),b0=v(side*.80,.965,-1.64),b1=v(side*.69,1.385,-1.27);
  panel('panel_RearQuarter'+suffix+'TordalPillar',6,8,(u,t)=>a0.clone().lerp(a1,t).lerp(b0.clone().lerp(b1,t),u),v(side,.25,-.3),paint,.016);
  bar('Structure Tordal B pillar '+suffix,v(side*.84,.40,-.04),v(side*.72,1.37,-.04),.03,rubber);
  box('panel_TordalRubStrip'+suffix,side*.865,.70,0,.03,.07,4.2,rubber);box('panel_TordalRubInsert'+suffix,side*.881,.70,0,.004,.012,4.2,alloy);
  box('panel_TordalSill'+suffix,side*.85,.40,0,.05,.08,1.9,rubber);
  for(const z of [-1.02,-.04,.95])bar('panel_TordalDoorSeam'+suffix+z,v(side*width(.40,z),.40,z),v(side*width(SH,z),SH,z),.003,rubber);
  bar('panel_BodyDoor'+suffix+'TordalMirrorArm',v(side*.84,.97,.86),v(side*.95,.99,.84),.016,rubber);
  box('panel_BodyDoor'+suffix+'TordalMirror',side*.98,1.0,.83,.14,.11,.08,rubber);
  for(const z of [-1.32,1.32]){
   panel('Structure Tordal wheelhouse '+suffix+z,22,4,(u,t)=>v(side*mix(.58,.86,t),.36+Math.sin(u*Math.PI)*.41,z+Math.cos(u*Math.PI)*.41),v(0,1,0),steel,.016);
   const points=Array.from({length:25},(_,i)=>{const a=mix(.08,Math.PI-.08,i/24),y=.36+Math.sin(a)*.415,zz=z+Math.cos(a)*.415;return v(side*(width(y,zz)+.008),y,zz);});
   add('panel_TordalArchTrim'+suffix+z,new T.TubeGeometry(new T.CatmullRomCurve3(points),24,.014,5,false),rubber);
  }
 }
 // Flat bonnet, upright screen, flat roof, upright rear screen and a squared boot.
 panel('panel_hoodTordal',18,20,(u,t)=>{const x=(u*2-1)*.82;return v(x,mix(.95,.925,t)+.012*(1-(x/.82)**2),mix(.95,2.32,t));},v(0,1,0));
 window('FrontTordal',[v(-.83,.945,.95),v(.83,.945,.95),v(.71,1.375,.42),v(-.71,1.375,.42)],1);
 panel('panel_RoofTordal',16,12,(u,t)=>{const x=(u*2-1)*.72;return v(x,1.38+.015*(1-(x/.72)**2),mix(-1.27,.42,t));},v(0,1,0));
 window('RearTordal',[v(-.80,.965,-1.64),v(.80,.965,-1.64),v(.69,1.385,-1.27),v(-.69,1.385,-1.27)],-1);
 panel('panel_BootTordal',18,8,(u,t)=>{const x=(u*2-1)*.82;return v(x,.965-.005*t,mix(-1.66,-2.30,t));},v(0,1,0));
 panel('panel_TordalRearPanel',18,6,(u,t)=>{const x=(u*2-1)*.84;return v(x,mix(.58,.96,t),-2.34);},v(0,0,-1));
 box('panel_BootTordalBadge',.5,.9,-2.355,.24,.035,.01,alloy);box('panel_BootTordalLock',0,.86,-2.355,.08,.06,.01,alloy);
 // Big black safety bumpers with alloy cappings and corner sections.
 for(const sign of [-1,1]){
  const name=sign===1?'front':'rear';
  panel('panel_Tordal'+name+'Valance',18,6,(u,t)=>{const x=(u*2-1)*.84;return v(x,mix(.42,sign>0?.92:.58,t),sign*2.34);},v(0,0,sign));
  panel('panel_bumper_'+name+'Tordal',22,5,(u,t)=>{const x=(u*2-1)*.92;return v(x,mix(.34,.58,t),sign*(2.52-.08*(x/.92)**8));},v(0,0,sign),rubber,.12);
  box('panel_Tordal'+name+'BumperCap',0,.59,sign*2.5,1.72,.035,.16,alloy);
  for(const side of [-1,1])box('Structure Tordal bumper mount '+name+side,side*.55,.46,sign*2.40,.1,.1,.24,steel);
 }
 // Squared nose: chrome-surround grille with a bar badge, rectangular lamps, wrap markers.
 box('panel_TordalGrille',0,.75,2.345,.86,.28,.02,rubber);box('panel_TordalGrilleSurround',0,.75,2.35,.9,.32,.012,alloy);
 for(let i=-6;i<=6;i++)box('panel_TordalGrilleBar'+i,i*.065,.75,2.358,.012,.26,.01,alloy);box('panel_TordalGrilleBadge',0,.75,2.365,.36,.03,.012,alloy);
 for(const side of [-1,1]){
  box('panel_TordalHeadlightBezel'+side,side*.64,.76,2.343,.38,.24,.02,rubber);box('panel_TordalHeadlight'+side,side*.64,.76,2.355,.33,.19,.015,white);
  box('panel_TordalFrontIndicator'+side,side*.86,.76,2.30,.03,.17,.12,amber);
  for(const [y,m,h]of [[.88,amber,.08],[.80,red,.10],[.72,white,.06],[.65,red,.06]]as const)box('panel_TordalRearLamp'+side+':'+y,side*.68,y,-2.355,.28,h,.015,m);
  box('panel_TordalRearLampBase'+side,side*.68,.77,-2.345,.31,.32,.02,rubber);
  bar('panel_TordalWiper'+side,v(side*.46,.96,.93),v(side*.2,1.1,.72),.007,rubber);
  box('Structure Tordal longitudinal rail'+side,side*.52,.33,0,.09,.09,4.3,steel);
  box('Interior Tordal SeatBase'+side,side*.38,.56,-.24,.52,.17,.56,cloth);const seat=box('Interior Tordal SeatBack'+side,side*.38,.86,-.52,.52,.54,.14,cloth);seat.rotation.x=-.12;
  box('Interior Tordal Headrest'+side,side*.38,1.2,-.56,.3,.16,.1,cloth);
  if(side===-1)bar('Structure Tordal exhaust',v(-.3,.27,.9),v(-.5,.27,-2.45),.03,steel);
 }
 box('Structure Tordal floor',0,.40,-.3,1.6,.045,3.3,steel);
 box('Interior Tordal RearBench',0,.58,-1.2,1.42,.18,.5,cloth);box('Interior Tordal RearBack',0,.84,-1.44,1.42,.42,.13,cloth);
 box('Interior Tordal Dashboard',0,.95,.52,1.6,.16,.34,vinyl);box('Interior Tordal InstrumentBinnacle',-.38,1.03,.44,.5,.1,.18,vinyl);
 for(let i=-1;i<=1;i++)box('Interior Tordal Dial'+i,-.38+i*.14,1.03,.348,.1,.08,.006,white);
 const wheel=add('Interior SteeringWheel Tordal',new T.TorusGeometry(.18,.02,8,24),vinyl);wheel.position.set(-.38,.98,.2);wheel.rotation.x=.32;
 for(const side of [-1,1])bar('Interior Tordal SteeringSpoke'+side,v(-.38,.98,.2),v(-.38+side*.17,.98,.2),.016,vinyl);
 box('Interior Tordal Console',0,.6,.1,.22,.3,.74,vinyl);bar('Interior Tordal GearLever',v(0,.74,.05),v(0,.92,.02),.013,steel);
 box('Structure Tordal inline four',0,.64,1.55,.40,.40,.74,steel);box('Structure Tordal valve cover',0,.87,1.55,.3,.08,.66,alloy);
 box('Structure Tordal air cleaner',.4,.8,1.5,.28,.14,.4,rubber);box('Structure Tordal battery',-.44,.68,1.9,.24,.24,.3,rubber);
 box('Structure Tordal radiator',0,.66,2.18,1.1,.38,.05,steel);for(let i=-8;i<=8;i++)box('Structure Tordal radiator fin'+i,i*.062,.66,2.21,.008,.34,.008,alloy);
 addRoadWheels(root,'marten');for(const [i,name]of ['FL','FR','RL','RR'].entries()){const w=root.getObjectByName('wheel_'+name)!;w.position.set((i%2?1:-1)*.74,.36,(i<2?1:-1)*1.32);w.scale.setScalar(.34/.32);}
 root.updateMatrixWorld(true);return root;
}
