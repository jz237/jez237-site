import * as T from 'three';
import {formedVehiclePanel,panelSamples} from './formed-vehicle-panel';
import {classicWindowFrame} from './classic-window-frame';
import {addRoadWheels} from './road-wheels';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),mix=T.MathUtils.lerp,clamp=T.MathUtils.clamp;
/** Original 1980s wedge-nosed liftback coupe: pop-up headlamps, twin-cam inline
 * four, rear-wheel drive. Two long doors and a glass liftback. Nose +Z. */
export function buildSaberAsset(){
 const root=new T.Group();root.name='Saber20GT';
 const mat=(name:string,color:number,roughness=.6,metalness=.15)=>new T.MeshPhysicalMaterial({name,color,roughness,metalness});
 const paint=mat('paint_Saber',0xb3261e,.3,.18);paint.clearcoat=.85;
 const steel=mat('Structure Saber Steel',0x373e44,.66,.65),rubber=mat('Saber Rubber',0x16191c,.88),alloy=mat('Saber Alloy',0xb0b6b8,.3,.78),cloth=mat('Interior Saber Cloth',0x3b3c40,.95),vinyl=mat('Interior Saber Vinyl',0x26272a,.88),glass=mat('Saber Glass',0x3f5560,.06,.1),white=mat('Saber Lens',0xf0ede0,.18),red=mat('Saber Tail Lens',0xa3121c,.25),amber=mat('Saber Amber Lens',0xd7861c,.25),stripe=mat('Saber Stripe',0x1f2124,.5,.1);
 glass.transparent=true;glass.opacity=.45;glass.depthWrite=false;
 const add=(name:string,g:T.BufferGeometry,m:T.Material)=>{if(g.index)g=g.toNonIndexed();const o=new T.Mesh(g,m);o.name=name;o.castShadow=o.receiveShadow=true;root.add(o);return o;};
 const box=(name:string,x:number,y:number,z:number,w:number,h:number,d:number,m:T.Material)=>{const o=add(name,new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);return o;};
 const panel=(name:string,nu:number,nv:number,map:(u:number,t:number)=>T.Vector3,n:T.Vector3,m:T.Material=paint,depth=.02)=>add(name,formedVehiclePanel(panelSamples(nu),panelSamples(nv),map,n,depth),m);
 const bar=(name:string,a:T.Vector3,b:T.Vector3,r:number,m:T.Material)=>{const o=add(name,new T.CylinderGeometry(r,r,a.distanceTo(b),8),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(v(0,1,0),b.clone().sub(a).normalize());return o;};
 const window=(name:string,c:T.Vector3[],side:number)=>{const f=classicWindowFrame(c,side);add('panel_'+name+'Frame',f.frame,paint);add('panel_'+name+'Seal',f.seal,rubber);add('glass_'+name,f.glass,glass).castShadow=false;};
 // Wedge profile: the shoulder line rises from the low nose to the tail.
 const shoulder=(z:number)=>z>.66?mix(.92,.77,(z-.66)/1.47):z>-1.6?mix(.92,.97,(.66-z)/2.26):.97;
 const width=(y:number,z:number)=>.84-.05*Math.max(0,y-.80)/.2-.05*(Math.abs(z)/2.15)**6;
 const arch=(z:number)=>{const d=Math.min(Math.abs(z-1.21),Math.abs(z+1.21));return d<.39?Math.max(.36,.32+Math.sqrt(.39**2-d*d)):.36;};
 for(const side of [-1,1]){
  const suffix=side<0?'L':'R';
  for(const [name,a,b]of [['RearQuarter',-2.13,-.52],['BodyDoor',-.52,.66],['FrontWing',.66,2.13]]as const){
   const stem='panel_'+name+suffix+'Saber';
   panel(stem,22,8,(u,t)=>{const z=mix(a,b,u),y=mix(arch(z),shoulder(z),t);return v(side*width(y,z),y,z);},v(side,0,0));
   if(name==='BodyDoor'){box(stem+'Handle',side*.845,.84,a+.14,.03,.035,.16,rubber);box(stem+'InnerCard',side*.77,.68,(a+b)/2,.03,.40,b-a-.08,vinyl);}
  }
  // Long door glass following the raked A-pillar, a fixed quarter light behind.
  window('BodyDoor'+suffix+'Saber',[v(side*.80,.925,.62),v(side*.80,.93,-.47),v(side*.64,1.245,-.50),v(side*.64,1.255,-.03)],side);
  window('Quarter'+suffix+'Saber',[v(side*.80,.94,-.58),v(side*.79,.965,-1.28),v(side*.66,1.19,-.92),v(side*.64,1.245,-.62)],side);
  // Sail panel: from the quarter-light's rear edge back to the liftback glass edge.
  const hatchY=(z:number)=>.975+.28*(z+1.86)/1.13,hatchX=(z:number)=>.79-.17*(z+1.86)/1.13;
  panel('panel_RearQuarter'+suffix+'SaberSail',12,6,(u,t)=>{const zb=mix(-1.86,-1.28,u),zt=mix(-1.86,-.92,u),z=mix(zb,zt,t);return v(side*mix(width(.97,zb),hatchX(zt),t),mix(shoulder(zb),hatchY(zt),t),z);},v(side,.35,0));
  for(const z of [-.52])bar('Structure Saber B pillar '+suffix,v(side*.80,.40,z),v(side*.66,1.24,z-.04),.024,steel);
  box('panel_SaberSill'+suffix,side*.84,.37,0,.06,.09,1.6,rubber);
  // Two-tone lower body and a pinstripe along the flank.
  panel('panel_SaberLowerTrim'+suffix,20,2,(u,t)=>{const z=mix(-1.75,1.75,u),y=mix(.42,.55,t);return v(side*(width(y,z)+.004),Math.max(y,arch(z)+.02),z);},v(side,0,0),stripe,.006);
  box('panel_SaberPinstripe'+suffix,side*.846,.74,.05,.006,.02,3.4,alloy);
  for(const z of [-.52,.66])bar('panel_SaberDoorSeam'+suffix+z,v(side*width(.38,z),.38,z),v(side*width(shoulder(z),z),shoulder(z),z),.003,rubber);
  bar('panel_BodyDoor'+suffix+'SaberMirrorArm',v(side*.80,.96,.52),v(side*.92,.98,.50),.015,rubber);
  box('panel_BodyDoor'+suffix+'SaberMirror',side*.95,1.0,.49,.13,.085,.17,rubber);
  box('panel_BodyDoor'+suffix+'SaberMirrorGlass',side*.955,1.0,.403,.10,.065,.006,alloy);
  for(const z of [-1.21,1.21]){
   panel('Structure Saber wheelhouse '+suffix+z,22,4,(u,t)=>v(side*mix(.56,.85,t),.32+Math.sin(u*Math.PI)*.39,z+Math.cos(u*Math.PI)*.39),v(0,1,0),steel,.016);
   const points=Array.from({length:25},(_,i)=>{const a=mix(.08,Math.PI-.08,i/24),y=.32+Math.sin(a)*.395,zz=z+Math.cos(a)*.395;return v(side*(width(y,zz)+.01),y,zz);});
   add('panel_SaberArchTrim'+suffix+z,new T.TubeGeometry(new T.CatmullRomCurve3(points),24,.018,5,false),rubber);
  }
 }
 // Low wedge bonnet with a gentle crown; pop-up lamp lids sit closed in it.
 const hoodY=(x:number,z:number)=>mix(.925,.775,clamp((z-.66)/1.47,0,1))+.02*(1-(x/.8)**2);
 panel('panel_hoodSaber',18,20,(u,t)=>{const x=(u*2-1)*.80,z=mix(.66,2.10,t);return v(x,hoodY(x,z),z);},v(0,1,0));
 for(const side of [-1,1]){
  panel('panel_SaberPopUpLid'+side,6,4,(u,t)=>{const x=side*mix(.38,.70,u),z=mix(1.70,2.0,t);return v(x,hoodY(x,z)+.012,z);},v(0,1,0));
  for(const z of [1.69,2.01])box('panel_SaberPopUpSeam'+side+z,side*.54,hoodY(side*.54,z)+.008,z,.33,.006,.008,rubber);
 }
 for(let i=0;i<5;i++)box('panel_SaberCowlVent'+i,-.32+i*.16,.93,.72,.10,.008,.06,rubber);
 // Raked screen, short roof and the big glass liftback with a lip spoiler.
 window('FrontSaber',[v(-.80,.925,.66),v(.80,.925,.66),v(.62,1.265,-.05),v(-.62,1.265,-.05)],1);
 panel('panel_RoofSaber',16,12,(u,t)=>{const x=(u*2-1)*.63;return v(x,1.265+.025*(1-(x/.63)**2),mix(-.72,-.05,t));},v(0,1,0));
 window('TailgateSaber',[v(-.79,.975,-1.86),v(.79,.975,-1.86),v(.62,1.255,-.73),v(-.62,1.255,-.73)],-1);
 panel('panel_TailgateSaberDeck',16,4,(u,t)=>{const x=(u*2-1)*.80;return v(x,.975+.005*Math.sin(t*Math.PI),mix(-2.08,-1.86,t));},v(0,1,0));
 panel('panel_TailgateSaber',18,8,(u,t)=>{const x=(u*2-1)*.82;return v(x,mix(.58,.975,t),-2.12+.03*t);},v(0,0,-1));
 box('panel_TailgateSaberSpoiler',0,1.02,-2.03,1.5,.035,.18,rubber);
 for(const side of [-1,1])box('panel_TailgateSaberSpoilerStand'+side,side*.6,.995,-2.0,.05,.04,.08,rubber);
 // Full-width tail-lamp band with louvred black centre and a plate recess.
 for(const side of [-1,1]){
  box('panel_SaberRearLamp'+side,side*.58,.84,-2.14,.42,.15,.02,red);
  box('panel_SaberRearIndicator'+side,side*.58,.75,-2.135,.42,.05,.02,amber);
  box('panel_SaberReverseLamp'+side,side*.30,.80,-2.14,.10,.10,.02,white);
 }
 box('panel_SaberRearCentre',0,.80,-2.138,.48,.17,.02,rubber);for(let i=0;i<5;i++)box('panel_SaberRearLouvre'+i,0,.74+i*.03,-2.15,.46,.008,.01,alloy);
 box('panel_SaberRearPlateRecess',0,.62,-2.137,.40,.13,.02,rubber);
 for(const sign of [-1,1]){
  const name=sign===1?'front':'rear';
  panel('panel_Saber'+name+'Valance',18,6,(u,t)=>{const x=(u*2-1)*.82;return v(x,mix(.44,sign>0?.77:.58,t),sign*(2.13-.05*(x/.82)**6));},v(0,0,sign));
  panel('panel_bumper_'+name+'Saber',22,5,(u,t)=>{const x=(u*2-1)*.86;return v(x,mix(.28,.47,t),sign*(2.19-.14*(x/.86)**6+.012*Math.sin(t*Math.PI)));},v(0,0,sign),rubber,.04);
  for(const side of [-1,1])box('Structure Saber bumper mount '+name+side,side*.52,.40,sign*2.02,.09,.08,.26,steel);
 }
 // Nose details: slot grille, bumper indicators, fog lamps, chin lip.
 box('panel_SaberGrilleSlot',0,.66,2.15,.86,.05,.02,rubber);
 for(const side of [-1,1]){box('panel_SaberFrontIndicator'+side,side*.62,.40,2.205,.22,.06,.02,amber);box('panel_SaberFogLamp'+side,side*.34,.37,2.21,.14,.06,.02,white);}
 box('panel_SaberChinLip',0,.27,2.12,1.5,.02,.12,rubber);box('panel_SaberBadge',0,.715,2.135,.12,.03,.01,alloy);
 for(const side of [-1,1])bar('panel_SaberWiper'+side,v(side*.42,.94,.64),v(side*.18,1.06,.40),.007,rubber);
 // Structure, cabin and twin-cam engine bay.
 for(const side of [-1,1]){
  box('Structure Saber longitudinal rail'+side,side*.50,.30,0,.08,.08,3.9,steel);
  box('Interior Saber SeatBase'+side,side*.36,.50,-.30,.47,.15,.52,cloth);
  const seat=box('Interior Saber SeatBack'+side,side*.36,.80,-.58,.47,.56,.14,cloth);seat.rotation.x=-.2;
  for(const dx of [-.2,.2])box('Interior Saber SeatBolster'+side+dx,side*.36+dx,.86,-.56,.07,.42,.16,cloth);
  if(side===-1)bar('Structure Saber exhaust',v(-.28,.24,.75),v(-.46,.24,-2.18),.03,steel);
 }
 box('Structure Saber floor',0,.36,-.30,1.52,.04,2.7,steel);
 box('Interior Saber RearSeat',0,.53,-1.15,1.2,.14,.36,cloth);box('Interior Saber RearBack',0,.74,-1.33,1.2,.32,.11,cloth);
 box('Interior Saber Dashboard',0,.87,.42,1.5,.13,.34,vinyl);box('Interior Saber InstrumentBinnacle',-.36,.96,.34,.48,.11,.18,vinyl);
 for(let i=-1;i<=1;i++)box('Interior Saber Dial'+i,-.36+i*.14,.955,.245,.10,.08,.006,white);
 const wheel=add('Interior SteeringWheel Saber',new T.TorusGeometry(.17,.018,8,24),rubber);wheel.position.set(-.36,.90,.12);wheel.rotation.x=.38;
 for(const side of [-1,1])bar('Interior Saber SteeringSpoke'+side,v(-.36,.90,.12),v(-.36+side*.16,.90,.12),.014,steel);
 box('Interior Saber Console',0,.52,.0,.22,.30,.80,vinyl);bar('Interior Saber GearLever',v(0,.67,-.05),v(0,.84,-.08),.013,steel);
 box('Structure Saber twin-cam inline four',0,.56,1.26,.36,.36,.70,steel);
 for(const side of [-1,1])box('Structure Saber cam cover'+side,side*.09,.78,1.26,.13,.08,.64,alloy);
 for(let i=0;i<4;i++)bar('Structure Saber ignition lead'+i,v(0,.82,1.0+i*.17),v(.22,.70,1.0+i*.17),.008,rubber);
 box('Structure Saber air box',.38,.70,1.30,.22,.14,.40,rubber);box('Structure Saber battery',-.44,.62,1.70,.22,.22,.28,rubber);
 box('Structure Saber radiator',0,.55,1.92,1.0,.34,.045,steel);for(let i=-7;i<=7;i++)box('Structure Saber radiator fin'+i,i*.062,.55,1.95,.008,.30,.008,alloy);
 addRoadWheels(root,'tern');for(const [i,name]of ['FL','FR','RL','RR'].entries()){const w=root.getObjectByName('wheel_'+name)!;w.position.set((i%2?1:-1)*.71,.34,(i<2?1:-1)*1.21);}
 root.updateMatrixWorld(true);return root;
}
