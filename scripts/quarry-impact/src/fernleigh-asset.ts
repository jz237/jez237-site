import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {formedVehiclePanel,panelSamples} from './formed-vehicle-panel';
import {classicWindowFrame} from './classic-window-frame';
import {addRoadWheels} from './road-wheels';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),mix=T.MathUtils.lerp,clamp=T.MathUtils.clamp;
/** Original 1990s one-box people carrier: a short sloping bonnet flowing into a
 * steeply raked windscreen, a tall rounded body with a large glasshouse on thin
 * black pillars, a sliding left-hand side door on an exposed rail, roof rails,
 * wraparound tail lamps beside a top-hinged tailgate, body-colour bumpers with
 * grey rubbing strips and plastic wheel trims. Transverse inline four driving
 * the front wheels. Nose +Z. */
export function buildFernleighAsset(){
 const root=new T.Group();root.name='FernleighMPV';
 const mat=(name:string,color:number,roughness=.6,metalness=.15)=>new T.MeshPhysicalMaterial({name,color,roughness,metalness});
 const paint=mat('paint_Fernleigh',0x2f6b66,.32,.2);paint.clearcoat=.8;
 const steel=mat('Structure Fernleigh Steel',0x383f45,.66,.65),rubber=mat('Fernleigh Rubber',0x17191a,.9),trim=mat('Fernleigh Black Trim',0x1e2022,.55,.05),strip=mat('Fernleigh Rubbing Strip',0x60666a,.72,.05),alloy=mat('Fernleigh Alloy',0xb4b9ba,.32,.7),cap=mat('Fernleigh Wheel Trim',0xb9bebf,.42,.22),cloth=mat('Interior Fernleigh Cloth',0x4f5866,.95),vinyl=mat('Interior Fernleigh Vinyl',0x2a2d31,.85),carpet=mat('Interior Fernleigh Carpet',0x25282c,.97),glass=mat('Fernleigh Glass',0x3c5a5f,.06,.1),white=mat('Fernleigh Lens',0xeef0ea,.16),red=mat('Fernleigh Tail Lens',0xa8161f,.22),amber=mat('Fernleigh Amber Lens',0xdc8b22,.25),smoke=mat('Fernleigh Reverse Lens',0xd9dcd8,.2),plate=mat('Fernleigh Plate',0xe9e7df,.6);
 glass.transparent=true;glass.opacity=.44;glass.depthWrite=false;
 const add=(name:string,g:T.BufferGeometry,m:T.Material)=>{if(g.index)g=g.toNonIndexed();const o=new T.Mesh(g,m);o.name=name;o.castShadow=o.receiveShadow=true;root.add(o);return o;};
 const box=(name:string,x:number,y:number,z:number,w:number,h:number,d:number,m:T.Material)=>{const o=add(name,new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);return o;};
 const panel=(name:string,nu:number,nv:number,map:(u:number,t:number)=>T.Vector3,n:T.Vector3,m:T.Material=paint,depth=.02)=>add(name,formedVehiclePanel(panelSamples(nu),panelSamples(nv),map,n,depth),m);
 const bar=(name:string,a:T.Vector3,b:T.Vector3,r:number,m:T.Material)=>{const o=add(name,new T.CylinderGeometry(r,r,a.distanceTo(b),8),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(v(0,1,0),b.clone().sub(a).normalize());return o;};
 const tube=(name:string,points:T.Vector3[],r:number,m:T.Material,segments=Math.max(8,points.length+2))=>add(name,new T.TubeGeometry(new T.CatmullRomCurve3(points),segments,r,6,false),m);
 const window=(name:string,c:T.Vector3[],side:number)=>{const f=classicWindowFrame(c,side);add('panel_'+name+'Frame',f.frame,trim);add('panel_'+name+'Seal',f.seal,rubber);add('glass_'+name,f.glass,glass).castShadow=false;};
 const merged=(name:string,parts:T.BufferGeometry[],m:T.Material)=>{const g=mergeGeometries(parts.map(p=>{const flat=p.index?p.toNonIndexed():p;if(flat!==p)p.dispose();return flat;}))!;parts.forEach(p=>p.dispose());return add(name,g,m);};
 // Proportions: 4.66 m body on a 2.85 m wheelbase, waist at 1.0 m, roof rails at 1.70 m.
 const AXLE=1.425,END=2.33,BELT=1.0,RE=1.62,RW=.76,WS0=1.43,WS1=.45,TW=.655;
 // Tailgate profile: glass leaning back from the roof, lower skin nearly upright.
 const zt=(y:number)=>y>=BELT?-2.12-.15*((RE-y)/(RE-BELT))**.75:-2.27-.05*(BELT-y)/(BELT-.40);
 // Waist rises gently to the screen base, then the short bonnet falls to the nose.
 const SH=(z:number)=>z<=1.0?BELT:z<=WS0?BELT+.04*(z-1.0)/(WS0-1.0):1.04-.19*Math.min(1.1,(z-WS0)/(END-.05-WS0))**1.5;
 // Plan: a rounded nose and corners that roll in towards the tailgate.
 const plan=(y:number,z:number)=>.10*clamp((z-1.9)/.43,0,1)**2+.09*clamp(1-(z-zt(Math.min(y,BELT)))/.42,0,1)**2;
 const width=(y:number,z:number)=>.915-.035*clamp((y-.66)/.36,0,1)**1.6-.035*clamp((.50-y)/.14,0,1)**2-plan(y,z);
 const arch=(z:number)=>{const d=Math.min(Math.abs(z-AXLE),Math.abs(z+AXLE));return d<.40?.36+Math.sqrt(.40**2-d*d):.36;};
 // Glasshouse sides lean in from the waist to the roof edge.
 const side=(s:number,z:number,y:number)=>{const b=SH(Math.min(z,WS0));return v(s*mix(width(b,z)-.012,RW,(y-b)/(RE-b)),y,z);};
 const belt=(z:number,s:number)=>side(s,z,SH(Math.min(z,WS0))),top=(z:number,s:number)=>side(s,z,RE);
 const glassEdge=(s:number,y:number)=>v(s*mix(.70,.64,(y-1.02)/(RE-1.02)),y,zt(y));
 // Grey rubbing strip runs along every side panel between the wheel arches.
 const stripSpans=(a:number,b:number)=>{const cuts=[[-AXLE-.385,-AXLE+.385],[AXLE-.385,AXLE+.385]],out:[number,number][]=[];let start=a;for(const [c0,c1]of cuts){if(c1<=start||c0>=b)continue;if(c0-start>.05)out.push([start,c0]);start=Math.max(start,c1);}if(b-start>.05)out.push([start,b]);return out;};
 for(const s of [-1,1]){
  const suffix=s<0?'L':'R';
  // Left: front door, sliding side door and rear quarter. Right: front door and a long fixed quarter.
  const parts=(s<0?[['RearQuarter',-END,-1.06,16],['BodyDoorRear',-1.06,.02,12],['BodyDoor',.02,1.17,12],['FrontWing',1.17,END,14]]:[['RearQuarter',-END,.02,26],['BodyDoor',.02,1.17,12],['FrontWing',1.17,END,14]])as [string,number,number,number][];
  for(const [name,a,b,nu]of parts){
   const stem='panel_'+name+suffix+'Fernleigh',rear=name==='RearQuarter';
   // The rear quarter's tail edge follows the tailgate profile; the shift fades out well before the arch.
   panel(stem,nu,7,(u,t)=>{const zz=mix(a,b,u),y=mix(arch(zz),SH(zz),t),z=rear?zz+(zt(y)-a)*clamp(1-(zz-a)/.3,0,1):zz;return v(s*width(y,z),y,z);},v(s,0,0));
   for(const [z0,z1]of stripSpans(rear?-1.99:a+.01,name==='FrontWing'?2.03:b-.01))panel(stem+'RubStrip'+z0.toFixed(2),Math.max(2,Math.round((z1-z0)/.12)),2,(u,t)=>{const z=mix(z0,z1,u),y=mix(.52,.585,t);return v(s*(width(y,z)+.006),y,z);},v(s,0,0),strip,.012);
   if(name==='BodyDoor'){box(stem+'Handle',s*(width(.88,.20)+.01),.88,.20,.025,.035,.16,trim);box(stem+'InnerCard',s*(width(.72,.6)-.05),.72,.6,.03,.40,b-a-.12,vinyl);}
   if(name==='BodyDoorRear'){box(stem+'Handle',s*(width(.88,-.12)+.01),.88,-.12,.025,.035,.16,trim);box(stem+'InnerCard',s*(width(.72,-.5)-.05),.72,-.52,.03,.40,b-a-.12,vinyl);box(stem+'Runner',s*(width(.97,-.95)+.005),.975,-.97,.04,.035,.10,trim);}
  }
  // Glass: a long quarter light behind the A pillar, the front door, the side door (or fixed light) and the rear quarter.
  window('Quarter'+suffix+'FernleighFront',[belt(1.39,s),belt(1.20,s),top(.36,s),top(.41,s)],s);
  window('BodyDoor'+suffix+'Fernleigh',[belt(1.14,s),belt(.07,s),top(.07,s),top(.31,s)],s);
  if(s<0)window('BodyDoorRear'+suffix+'Fernleigh',[belt(-.03,s),belt(-1.02,s),top(-1.02,s),top(-.03,s)],s);
  else window('Mid'+suffix+'Fernleigh',[belt(-.03,s),belt(-1.02,s),top(-1.02,s),top(-.03,s)],s);
  window('Rear'+suffix+'Fernleigh',[belt(-1.11,s),belt(-2.07,s),top(-2.00,s),top(-1.11,s)],s);
  const pillar=(name:string,a0:T.Vector3,a1:T.Vector3,b0:T.Vector3,b1:T.Vector3,m:T.Material=paint,nu=3)=>panel(name,nu,8,(u,t)=>a0.clone().lerp(a1,t).lerp(b0.clone().lerp(b1,t),u),v(s,.3,0),m,.016);
  pillar('panel_FernleighAPillar'+suffix,belt(WS0+.01,s),top(WS1-.005,s),belt(1.385,s),top(.415,s));
  pillar('panel_FernleighQuarterPost'+suffix,belt(1.205,s),top(.365,s),belt(1.135,s),top(.305,s),trim);
  pillar('panel_FernleighBPillar'+suffix,belt(.075,s),top(.075,s),belt(-.035,s),top(-.035,s),trim);
  pillar('panel_FernleighCPillar'+suffix,belt(-1.015,s),top(-1.015,s),belt(-1.115,s),top(-1.115,s),trim);
  // D pillar wraps from the rear side glass round to the tailgate glass along the waist.
  const dBase=(u:number)=>{if(u<.7){const z=mix(-2.065,zt(BELT),u/.7);return belt(z,s);}const w=width(BELT,zt(BELT))-.012;return v(s*mix(w,.70,(u-.7)/.3),BELT,zt(BELT));};
  const dTop=(u:number)=>top(-1.995,s).lerp(glassEdge(s,RE),u);
  panel('panel_FernleighDPillar'+suffix,10,8,(u,t)=>dBase(u).lerp(dTop(u),t),v(s,.2,-.6).normalize(),paint,.018);
  // Rear end beside the tailgate, carrying the tall wraparound lamps.
  panel('panel_FernleighRearEnd'+suffix,4,8,(u,t)=>{const y=mix(.40,BELT,t),w=width(y,zt(y));return v(s*mix(TW+.008,w,u),y,zt(y)+.001);},v(0,0,-1));
  const lampAt=(l:number,y:number,lift:number)=>{const w=width(y,zt(y)),flat=w-TW-.02;if(l<flat)return v(s*(TW+.02+l),y,zt(y)-lift);const z=zt(y)+(l-flat);return v(s*(width(y,z)+lift),y,z);};
  for(const [name,y0,y1,m]of [['Tail',.78,.98,red],['Indicator',.715,.775,amber],['Reverse',.655,.71,smoke]]as const)panel('panel_FernleighRearLamp'+suffix+name,10,2,(u,t)=>{const y=mix(y0,y1,t),w=width(y,zt(y));return lampAt(u*(w-TW-.02+.26),y,.006);},v(s*.5,0,-1).normalize(),m,.012);
  // Sliding-door rail under the rear side glass (dummy on the right for symmetry of the body line).
  if(s<0){tube('panel_FernleighSlideRail'+suffix,Array.from({length:8},(_,i)=>{const z=mix(-1.08,-2.02,i/7);return v(s*(width(.97,z)+.012),.97,z);}),.013,trim,10);box('panel_FernleighSlideRailCap'+suffix,s*(width(.97,-2.03)+.006),.97,-2.03,.03,.04,.04,trim);}
  else box('panel_FernleighFuelFlap'+suffix,s*(width(.86,-1.95)+.004),.86,-1.95,.012,.12,.14,paint);
  // Plastic sills, arch lips and a black waist finisher under the glass.
  panel('panel_FernleighSill'+suffix,16,2,(u,t)=>{const z=mix(-1.03,1.03,u),y=mix(.31,.40,t);return v(s*(width(.40,z)+.004),y,z);},v(s,0,0),trim,.03);
  for(const z of [-AXLE,AXLE]){
   panel('Structure Fernleigh wheelhouse '+suffix+z,14,3,(u,t)=>v(s*mix(.58,.90,t),.36+Math.sin(u*Math.PI)*.41,z+Math.cos(u*Math.PI)*.41),v(0,1,0),steel,.016);
   const points=Array.from({length:21},(_,i)=>{const a=mix(.04,Math.PI-.04,i/20),y=.36+Math.sin(a)*.405,zz=z+Math.cos(a)*.405;return v(s*(width(y,zz)+.01),y,zz);});
   tube('panel_FernleighArchTrim'+suffix+z,points,.018,trim,20);
  }
  for(const z of (s<0?[-1.06,.02,1.17]:[.02,1.17]))bar('panel_FernleighDoorSeam'+suffix+z,v(s*width(.37,z),.37,z),v(s*width(SH(z),z),SH(z),z),.003,rubber);
  // Mirrors on the front doors, wipers at the screen base.
  bar('panel_BodyDoor'+suffix+'FernleighMirrorArm',v(s*.87,1.06,1.10),v(s*.96,1.09,1.08),.016,trim);
  const mirror=add('panel_BodyDoor'+suffix+'FernleighMirror',new T.SphereGeometry(1,12,8),trim);mirror.position.set(s*.99,1.11,1.06);mirror.scale.set(.05,.085,.11);
  bar('panel_FernleighWiper'+suffix,v(s*.52,1.06,1.36),v(s*.08,1.21,1.12),.007,rubber);
  // Roof rails on three feet.
  tube('panel_FernleighRoofRail'+suffix,[v(s*.66,RE+.045,.32),v(s*.665,RE+.055,-.40),v(s*.665,RE+.055,-1.25),v(s*.66,RE+.045,-1.96)],.016,trim,16);
  for(const z of [.30,-.83,-1.94])box('panel_FernleighRoofRailFoot'+suffix+z,s*.66,RE+.03,z,.05,.06,.12,trim);
 }
 // Short bonnet, raked screen, long roof with a gently crowned centre and the tailgate.
 panel('panel_hoodFernleigh',10,12,(u,t)=>{const z=mix(WS0,END-.02,t),w=width(SH(z),z)-.02,x=(u*2-1)*w;return v(x,SH(z)+.016*(1-(x/w)**2)+.004,z);},v(0,1,0));
 window('FrontFernleigh',[belt(WS0,-1),belt(WS0,1),top(WS1,1),top(WS1,-1)],1);
 box('panel_FernleighCowl',0,1.045,WS0+.02,1.62,.02,.08,trim);
 const roofW=(z:number)=>{const r=.10,d=z-zt(RE);return d<r?RW-r+Math.sqrt(Math.max(0,r*r-(r-d)**2)):RW;};
 panel('panel_RoofFernleigh',8,12,(u,t)=>{const z=mix(zt(RE)+.002,WS1,t),w=roofW(z),x=(u*2-1)*w;return v(x,RE+.035*(1-(x/RW)**2),z);},v(0,1,0));
 panel('panel_TailgateFernleigh',10,6,(u,t)=>{const y=mix(.56,1.02,t),x=(u*2-1)*TW;return v(x,y,zt(y)-.012*(1-(x/TW)**2));},v(0,0,-1));
 window('TailgateFernleigh',[glassEdge(-1,1.02),glassEdge(1,1.02),glassEdge(1,RE),glassEdge(-1,RE)],-1);
 panel('panel_TailgateFernleighSpoiler',10,2,(u,t)=>{const x=(u*2-1)*.66;return v(x,RE+.012*Math.sin(t*Math.PI),mix(zt(RE)-.04,zt(RE)+.06,t));},v(0,1,0),paint,.03);
 box('panel_TailgateFernleighHandle',0,.92,zt(.92)-.03,.26,.035,.03,trim);
 box('panel_TailgateFernleighPlate',0,.72,zt(.72)-.025,.52,.12,.012,plate);box('panel_TailgateFernleighPlateLamp',0,.80,zt(.80)-.03,.14,.02,.03,trim);
 box('panel_TailgateFernleighInner',0,.80,zt(.80)+.06,1.24,.36,.025,vinyl);
 bar('panel_TailgateFernleighWiper',v(.05,1.10,zt(1.10)-.03),v(.42,1.38,zt(1.38)-.03),.008,rubber);
 box('panel_TailgateFernleighStopLamp',0,RE-.03,zt(RE-.03)-.02,.32,.03,.02,red);
 panel('panel_FernleighRearPanel',10,3,(u,t)=>{const y=mix(.40,.565,t),x=(u*2-1)*(TW+.01);return v(x,y,zt(y));},v(0,0,-1));
 // Nose: slim wide headlamps either side of a grille slot over a wrapped bumper.
 panel('panel_FernleighFrontPanel',12,4,(u,t)=>{const y=mix(.46,SH(END),t),w=width(y,END),x=(u*2-1)*w;return v(x,y,END+.02*(1-(x/w)**2));},v(0,0,1));
 const noseZ=(x:number,y:number)=>END+.02*(1-(x/width(y,END))**2);
 box('panel_FernleighGrille',0,.74,noseZ(0,.74)+.004,.48,.09,.012,trim);
 merged('panel_FernleighGrilleSlats',Array.from({length:3},(_,i)=>new T.BoxGeometry(.46,.008,.008).translate(0,.71+i*.03,noseZ(0,.74)+.012)),alloy);
 const badge=add('panel_FernleighBadge',new T.TorusGeometry(.03,.006,6,16),alloy);badge.position.set(0,.80,noseZ(0,.80)+.008);badge.scale.set(1.4,1,1);
 for(const s of [-1,1]){
  panel('panel_FernleighHeadlight'+s,6,2,(u,t)=>{const x=s*mix(.27,.73,u),y=mix(.69,.80,t);return v(x,y,noseZ(x,y)+.006);},v(0,0,1),white,.014);
  panel('panel_FernleighHeadlightSurround'+s,6,2,(u,t)=>{const x=s*mix(.255,.745,u),y=mix(.675,.815,t);return v(x,y,noseZ(x,y)+.002);},v(0,0,1),trim,.012);
  panel('panel_FernleighFrontIndicator'+s,4,2,(u,t)=>{const y=mix(.69,.80,t),z=mix(END-.01,END-.20,u);return v(s*(width(y,z)+.004),y,z);},v(s,0,.4).normalize(),amber,.012);
 }
 // Bumpers hug the body outline: across the face, round an elliptical corner and back along each flank.
 const outline=(sign:number,s:number,l:number,y:number,lift:number)=>{
  const face=sign>0?END+.02:zt(y),half=width(y,sign>0?END:zt(y)),xa=half-.12,rz=.14,zb=face-sign*rz,rx=width(y,zb)-xa,arc=Math.PI/2*Math.sqrt((rx*rx+rz*rz)/2);
  if(l<=xa)return v(s*l,y,face+sign*lift);
  if(l<=xa+arc){const a=(l-xa)/arc*Math.PI/2,nx=Math.sin(a)/rx,nz=Math.cos(a)/rz,n=Math.hypot(nx,nz);return v(s*(xa+rx*Math.sin(a)+lift*nx/n),y,zb+sign*(rz*Math.cos(a)+lift*nz/n));}
  const z=zb-sign*(l-xa-arc);return v(s*(width(y,z)+lift),y,z);
 };
 const wrapEnd=(sign:number,y:number)=>{const face=sign>0?END+.02:zt(y),xa=width(y,sign>0?END:zt(y))-.12,rx=width(y,face-sign*.14)-xa;return xa+Math.PI/2*Math.sqrt((rx*rx+.14*.14)/2)+.18;};
 const BY0=.29,BY1=.62,bulge=(y:number)=>.025+.015*Math.sin(Math.PI*clamp((y-BY0)/(BY1-BY0),0,1));
 for(const sign of [-1,1]){
  const name=sign===1?'front':'rear';
  for(const [label,y0,y1,m,lift,depth]of [['',BY0,BY1,paint,0,.04],['Strip',.52,.585,strip,.012,.014]]as const){
   const centre=(y:number)=>width(y,sign>0?END:zt(y))-.12;
   panel('panel_bumper_'+name+'Fernleigh'+label,14,label?2:5,(u,t)=>{const y=mix(y0,y1,t);return outline(sign,u<.5?-1:1,Math.abs(u*2-1)*centre(y),y,bulge(y)+lift);},v(0,0,sign),m,depth);
   for(const s of [-1,1])panel('panel_bumper_'+name+'Fernleigh'+label+'Corner'+(s<0?'L':'R'),12,label?2:5,(u,t)=>{const y=mix(y0,y1,t);return outline(sign,s,mix(centre(y),wrapEnd(sign,y),u),y,bulge(y)+lift);},v(s*.7,0,sign*.7),m,depth);
  }
  const faceZ=(y:number)=>(sign>0?END+.02:zt(y))+sign*(bulge(y)+.008);
  if(sign===1){box('panel_bumper_frontFernleighIntake',0,.35,faceZ(.35),.70,.07,.016,trim);for(const s of [-1,1])box('panel_bumper_frontFernleighFog'+s,s*.56,.36,faceZ(.36),.12,.06,.016,white);}
  else for(const s of [-1,1])box('panel_bumper_rearFernleighReflector'+s,s*.56,.38,faceZ(.38),.14,.035,.016,red);
  for(const s of [-1,1])box('Structure Fernleigh bumper mount '+name+s,s*.55,.44,sign*2.22,.1,.09,.22,steel);
 }
 // Cabin: two front seats, three middle-row chairs, a rear bench, a tall dash.
 for(const s of [-1,1]){
  box('Interior Fernleigh SeatBase'+s,s*.40,.68,.18,.50,.15,.52,cloth);const back=box('Interior Fernleigh SeatBack'+s,s*.40,1.0,-.10,.50,.58,.13,cloth);back.rotation.x=-.12;
  box('Interior Fernleigh Headrest'+s,s*.40,1.36,-.15,.26,.15,.09,cloth);
  box('Structure Fernleigh rail'+s,s*.52,.33,0,.09,.09,4.1,steel);
 }
 for(const x of [-.52,0,.52]){box('Interior Fernleigh MiddleSeat'+x,x,.66,-.72,.44,.14,.48,cloth);const back=box('Interior Fernleigh MiddleBack'+x,x,.96,-.98,.44,.54,.12,cloth);back.rotation.x=-.1;}
 box('Interior Fernleigh RearBench',0,.66,-1.66,1.50,.15,.48,cloth);const rb=box('Interior Fernleigh RearBack',0,.96,-1.92,1.50,.54,.12,cloth);rb.rotation.x=-.1;
 box('Interior Fernleigh Floor',0,.43,-.5,1.62,.02,3.4,carpet);
 box('Interior Fernleigh Dashboard',0,1.0,1.02,1.66,.18,.46,vinyl);box('Interior Fernleigh Binnacle',-.40,1.12,.86,.42,.10,.16,vinyl);
 for(const i of [-1,1])box('Interior Fernleigh Dial'+i,-.40+i*.09,1.12,.778,.11,.07,.006,white);
 box('Interior Fernleigh Console',0,.80,.82,.30,.30,.36,vinyl);bar('Interior Fernleigh GearLever',v(0,.96,.72),v(0,1.06,.66),.012,steel);
 const wheel=add('Interior SteeringWheel Fernleigh',new T.TorusGeometry(.18,.018,8,24),vinyl);wheel.position.set(-.40,1.14,.62);wheel.rotation.x=.62;
 for(const s of [-1,1])bar('Interior Fernleigh SteeringSpoke'+s,v(-.40,1.14,.62),v(-.40+s*.17,1.14,.62),.014,vinyl);
 bar('Interior Fernleigh SteeringColumn',v(-.40,1.14,.62),v(-.40,1.02,.86),.02,vinyl);
 // Structure: floor, transverse four, gearbox, radiator, exhaust and fuel tank.
 box('Structure Fernleigh floor',0,.40,-.3,1.64,.04,3.9,steel);
 box('Structure Fernleigh transverse four',-.06,.66,1.78,.78,.40,.44,steel);box('Structure Fernleigh cam cover',-.06,.88,1.78,.66,.06,.20,alloy);
 box('Structure Fernleigh gearbox',.48,.58,1.80,.30,.28,.34,steel);box('Structure Fernleigh battery',-.55,.70,1.95,.22,.20,.28,rubber);
 box('Structure Fernleigh radiator',0,.62,2.20,1.0,.34,.045,steel);for(let i=-6;i<=6;i++)box('Structure Fernleigh radiator fin'+i,i*.07,.62,2.23,.008,.30,.008,alloy);
 bar('Structure Fernleigh exhaust',v(.34,.30,1.5),v(.40,.30,-2.20),.03,steel);
 box('Structure Fernleigh fuel tank',0,.36,-1.1,.9,.18,.6,steel);
 // Tern-pattern pressed wheels at .34 m, each finished with a plastic trim.
 addRoadWheels(root,'tern');
 const rim=new T.LatheGeometry([new T.Vector2(.045,.018),new T.Vector2(.06,.02),new T.Vector2(.14,.012),new T.Vector2(.168,.006),new T.Vector2(.170,0)],24);
 const ribs=Array.from({length:8},(_,i)=>{const a=i/8*Math.PI*2;return new T.BoxGeometry(.016,.008,.08).translate(0,.018,.105).rotateY(a);});
 const trimGeometry=mergeGeometries([rim.toNonIndexed(),...ribs.map(r=>r.toNonIndexed())])!;rim.dispose();ribs.forEach(r=>r.dispose());
 for(const [i,name]of ['FL','FR','RL','RR'].entries()){
  const w=root.getObjectByName('wheel_'+name)!,s=i%2?1:-1;w.position.set(s*.78,.36,(i<2?1:-1)*AXLE);w.scale.setScalar(.34/.32);
  const c=new T.Mesh(trimGeometry.clone(),cap);c.name='Wheel Fernleigh trim '+name;c.quaternion.setFromUnitVectors(v(0,1,0),v(s,0,0));c.position.x=s*.078;c.castShadow=true;w.add(c);
 }
 trimGeometry.dispose();
 root.updateMatrixWorld(true);return root;
}
