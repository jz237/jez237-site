import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {formedVehiclePanel,panelSamples} from './formed-vehicle-panel';
import {classicWindowFrame} from './classic-window-frame';
import {addRoadWheels} from './road-wheels';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),mix=T.MathUtils.lerp,clamp=T.MathUtils.clamp;
/** Original 1990s full-size pickup: a chunky square regular cab with a long
 * bonnet, a wide egg-crate grille between quad rectangular headlamps, steel
 * bumpers (a step bumper at the rear), black wheel-arch flares and mud flaps,
 * a long open load bed with wheel tubs, stake pockets, tall corner tail lamps
 * and a drop-down tailgate, and a sport roll bar behind the cab. Front V8
 * driving a live rear axle on leaf springs. Nose +Z. */
export function buildHollinsAsset(){
 const root=new T.Group();root.name='HollinsPickup';
 const mat=(name:string,color:number,roughness=.6,metalness=.15)=>new T.MeshPhysicalMaterial({name,color,roughness,metalness});
 const paint=mat('paint_Hollins',0x8a1f1a,.34,.16);paint.clearcoat=.75;
 const chrome=mat('Hollins Chrome',0xdfe2e5,.12,1),bumperSteel=mat('Hollins Bumper Steel',0xb9bec2,.3,.85),steel=mat('Structure Hollins Steel',0x363c42,.66,.65),rubber=mat('Hollins Rubber',0x151617,.92),trim=mat('Hollins Black Trim',0x1c1e20,.6,.05),flare=mat('Hollins Arch Flare',0x202224,.78,.02),bar=mat('Hollins Roll Bar',0x202326,.42,.35),cap=mat('Hollins Wheel Trim',0xd2d6d8,.2,.88),bedliner=mat('Hollins Bed Liner',0x1f2123,.95,.02);
 const glass=mat('Hollins Glass',0x3a5559,.06,.1),white=mat('Hollins Lens',0xf0f2ee,.12),red=mat('Hollins Tail Lens',0xae141b,.22),amber=mat('Hollins Amber Lens',0xe0891f,.25),reverse=mat('Hollins Reverse Lens',0xdcdfdb,.2),plate=mat('Hollins Plate',0xe9e7df,.6);
 const cloth=mat('Interior Hollins Cloth',0x5a4a3f,.95),vinyl=mat('Interior Hollins Vinyl',0x2a2c2f,.85),carpet=mat('Interior Hollins Carpet',0x2a2724,.97),dial=mat('Interior Hollins Dial',0xe8e9e2,.3),alu=mat('Hollins Aluminium',0xb8bdc0,.34,.8);
 glass.transparent=true;glass.opacity=.42;glass.depthWrite=false;
 const add=(name:string,g:T.BufferGeometry,m:T.Material)=>{if(g.index)g=g.toNonIndexed();const o=new T.Mesh(g,m);o.name=name;o.castShadow=o.receiveShadow=true;root.add(o);return o;};
 const box=(name:string,x:number,y:number,z:number,w:number,h:number,d:number,m:T.Material)=>{const o=add(name,new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);return o;};
 const panel=(name:string,nu:number|number[],nv:number|number[],map:(u:number,t:number)=>T.Vector3,n:T.Vector3,m:T.Material=paint,depth=.02)=>add(name,formedVehiclePanel(typeof nu==='number'?panelSamples(nu):nu,typeof nv==='number'?panelSamples(nv):nv,map,n,depth),m);
 const rod=(name:string,a:T.Vector3,b:T.Vector3,r:number,m:T.Material,radial=8)=>{const o=add(name,new T.CylinderGeometry(r,r,a.distanceTo(b),radial),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(v(0,1,0),b.clone().sub(a).normalize());return o;};
 const tube=(name:string,points:T.Vector3[],r:number,m:T.Material,segments=Math.max(8,points.length+2),radial=6)=>add(name,new T.TubeGeometry(new T.CatmullRomCurve3(points),segments,r,radial,false),m);
 const window=(name:string,c:T.Vector3[],side:number,frame:T.Material=trim)=>{const f=classicWindowFrame(c,side);add('panel_'+name+'Frame',f.frame,frame);add('panel_'+name+'Seal',f.seal,rubber);add('glass_'+name,f.glass,glass).castShadow=false;};
 const merged=(name:string,parts:T.BufferGeometry[],m:T.Material)=>{const g=mergeGeometries(parts.map(p=>{const flat=p.index?p.toNonIndexed():p;if(flat!==p)p.dispose();return flat;}))!;parts.forEach(p=>p.dispose());return add(name,g,m);};
 // Proportions: 5.30 m over the bumpers on a 3.30 m wheelbase; bonnet 1.17 m at the cowl, cab roof 1.80 m,
 // bed rails 1.30 m, bed floor .86 m, body half width 1.00 m with flares to 1.04 m.
 const AXLE=1.65,WY=.41,ARCH=.50,END=2.58,REAR=-2.56,SILL=.56,BELT=1.17,HOODF=1.11,ROOF=1.80,BR=1.30,BF=.86,BW=1.0,BIW=.90,CWT=.86,WS0=1.20,WS1=.72,CB=-.30,BEDF=-.40,DOOR0=-.24,DOOR1=1.12,FC=.10;
 const arch=(z:number)=>{const d=Math.min(Math.abs(z-AXLE),Math.abs(z+AXLE));return d<ARCH?Math.max(SILL,WY+Math.sqrt(ARCH*ARCH-d*d)):SILL;};
 // Slab sides tuck under below .78 m; above the waist the cab glasshouse leans in to the roof.
 const sideW=(y:number)=>BW-.035*clamp((.78-y)/.22,0,1)**1.5;
 const hoodY=(z:number)=>z<=WS0?BELT:BELT-(BELT-HOODF)*clamp((z-WS0)/(END-WS0),0,1);
 const cabW=(y:number)=>y<=BELT?BW:mix(BW-.015,CWT,(y-BELT)/(ROOF-BELT));
 const cside=(s:number,z:number,y:number)=>v(s*cabW(y),y,z);
 const TOP=1.74,belt=(z:number,s:number)=>cside(s,z,BELT+.005),top=(z:number,s:number)=>cside(s,z,TOP);
 const pillarZ=(y:number)=>mix(WS0,WS1,(y-BELT)/(ROOF-BELT));
 const frontPlan=(z:number)=>z>END-FC?BW-FC+Math.sqrt(Math.max(0,FC*FC-(z-END+FC)**2)):BW;
 for(const s of [-1,1]){
  const S=s<0?'L':'R';
  // Front wing over the arch, the door, the short cab corner behind it and the long bed side.
  panel('panel_FrontWing'+S+'Hollins',[0,.05,.1,.15,.2,.25,.3,.35,.4,.45,.5,.55,.6,.65,.7,.75,.8,.85,.9,.95,1],4,(u,t)=>{const z=mix(DOOR1,END-FC,u),y=mix(arch(z),hoodY(z),t);return v(s*sideW(y),y,z);},v(s,0,0));
  panel('panel_HollinsFrontCorner'+S,4,4,(u,t)=>{const a=u*Math.PI/2,z=END-FC+FC*Math.sin(a),y=mix(SILL,hoodY(z),t);return v(s*(sideW(y)-FC+FC*Math.cos(a)),y,z);},v(s,0,1).normalize());
  panel('panel_BodyDoor'+S+'Hollins',12,4,(u,t)=>{const z=mix(DOOR0,DOOR1,u),y=mix(SILL,BELT,t);return v(s*sideW(y),y,z);},v(s,0,0));
  panel('panel_HollinsCabCorner'+S,1,4,(u,t)=>{const z=mix(CB,DOOR0,u),y=mix(SILL,BELT,t);return v(s*sideW(y),y,z);},v(s,0,0));
  panel('panel_HollinsBedSide'+S,[0,.04,.08,.12,.16,.2,.24,.28,.32,.36,.4,.44,.48,.52,.56,.6,.64,.68,.72,.76,.8,.84,.88,.92,.96,1],4,(u,t)=>{const z=mix(REAR,BEDF,u),y=mix(arch(z),BR-.03,t);return v(s*sideW(y),y,z);},v(s,0,0));
  // Bed: rail caps with stake pockets, inner walls, the rear corner posts carrying the tall tail lamps.
  box('panel_HollinsBedRail'+S,s*(BIW+BW)/2,BR-.015,(REAR+BEDF)/2,BW-BIW+.03,.03,BEDF-REAR,paint);
  merged('panel_HollinsBedRail'+S+'Pockets',[-2.40,-1.05,-.56].map(z=>new T.BoxGeometry(.05,.004,.09).translate(s*(BIW+BW)/2,BR+.002,z)),trim);
  box('panel_HollinsBedInner'+S,s*(BIW+.01),(BF+BR)/2,(REAR+BEDF)/2,.02,BR-BF,BEDF-REAR-.04,paint);
  panel('panel_HollinsBedRearPost'+S,1,4,(u,t)=>v(s*mix(BIW,sideW(mix(.66,BR,t)),u),mix(.66,BR-.03,t),REAR),v(0,0,-1));
  box('panel_HollinsTailLampBezel'+S,s*.952,1.04,REAR-.007,.094,.40,.012,chrome);
  box('panel_HollinsRearLamp'+S+'Tail',s*.952,1.115,REAR-.016,.076,.23,.016,red);
  box('panel_HollinsRearLamp'+S+'Reverse',s*.952,.93,REAR-.016,.076,.10,.016,reverse);
  // Black side moulding along the cab and the bed, above the arches.
  panel('panel_HollinsSideMoulding'+S+'Bed',8,1,(u,t)=>v(s*(BW+.006),mix(.95,.99,t),mix(REAR+.06,BEDF-.03,u)),v(s,0,0),trim,.012);
  panel('panel_BodyDoor'+S+'HollinsMoulding',4,1,(u,t)=>v(s*(BW+.006),mix(.95,.99,t),mix(DOOR0+.01,DOOR1-.01,u)),v(s,0,0),trim,.012);
  panel('panel_FrontWing'+S+'HollinsMoulding',6,1,(u,t)=>v(s*(BW+.006),mix(.95,.99,t),mix(DOOR1+.01,END-FC-.02,u)),v(s,0,0),trim,.012);
  box('panel_BodyDoor'+S+'HollinsHandle',s*(BW+.012),1.08,.02,.025,.035,.17,trim);
  box('panel_BodyDoor'+S+'HollinsInnerCard',s*(BW-.05),.86,.42,.03,.42,1.10,vinyl);
  box('panel_BodyDoor'+S+'HollinsLock',s*(BW+.008),1.08,-.10,.012,.03,.03,chrome);
  if(s<0)box('panel_HollinsFuelDoor'+S,s*(BW+.004),1.12,-.95,.012,.16,.16,paint);
  // Cab glasshouse: door glass with a vent wing, the rear cab pillar and the A pillar.
  window('BodyDoor'+S+'Hollins',[belt(.86,s),belt(-.17,s),top(-.17,s),top(.86,s)],s);
  window('BodyDoor'+S+'HollinsVent',[belt(1.13,s),belt(.90,s),top(.90,s),top(pillarZ(TOP)-.05,s)],s);
  const pillar=(name:string,a0:T.Vector3,a1:T.Vector3,b0:T.Vector3,b1:T.Vector3,m:T.Material=paint,nu=3)=>panel(name,nu,6,(u,t)=>a0.clone().lerp(a1,t).lerp(b0.clone().lerp(b1,t),u),v(s,.2,0),m,.016);
  pillar('panel_HollinsAPillar'+S,belt(WS0+.005,s),cside(s,pillarZ(ROOF-.02),ROOF-.02),belt(1.14,s),cside(s,pillarZ(ROOF-.02)-.07,ROOF-.02));
  pillar('panel_HollinsBPillar'+S,belt(-.19,s),cside(s,-.19,ROOF-.02),belt(CB,s),cside(s,CB,ROOF-.02));
  panel('panel_HollinsCantRail'+S,6,1,(u,t)=>{const z=mix(-.19,pillarZ(TOP)-.05,u);return cside(s,z,mix(TOP,ROOF-.02,t));},v(s,.3,0).normalize(),paint,.016);
  rod('panel_HollinsDripRail'+S,cside(s,-.27,ROOF-.025).add(v(s*.012,0,0)),cside(s,WS1+.02,ROOF-.025).add(v(s*.012,0,0)),.008,trim,6);
  // Big towing-style mirrors on arms from the door's front corner, wipers at the screen base.
  rod('panel_BodyDoor'+S+'HollinsMirrorArm',v(s*.99,1.24,1.06),v(s*1.10,1.30,1.04),.012,chrome);
  rod('panel_BodyDoor'+S+'HollinsMirrorArmLow',v(s*.99,1.18,.96),v(s*1.10,1.26,1.02),.01,chrome);
  box('panel_BodyDoor'+S+'HollinsMirror',s*1.125,1.33,1.03,.04,.24,.17,trim);
  rod('panel_HollinsWiper'+S,v(s*.66,BELT+.03,WS0-.01),v(s*.10,1.46,WS0-.24),.007,rubber);
  // Wheel houses, flared black arch lips and mud flaps behind each wheel.
  for(const z of [-AXLE,AXLE]){
   panel('Structure Hollins wheelhouse '+S+z,14,3,(u,t)=>v(s*mix(.62,BW-.02,t),WY+Math.sin(u*Math.PI)*(ARCH-.02),z+Math.cos(u*Math.PI)*(ARCH-.02)),v(0,1,0),steel,.016);
   panel('panel_HollinsArchFlare'+S+z,18,2,(u,t)=>{const a=mix(.18,Math.PI-.18,u),r=ARCH-.01+.085*t,y=WY+Math.sin(a)*r,zz=z+Math.cos(a)*r;return v(s*(sideW(y)+.006+.032*t),y,zz);},v(s,0,0),flare,.014);
   box('panel_HollinsMudFlap'+S+(z>0?'Front':'Rear'),s*.86,.35,z-ARCH-.07,.26,.28,.012,rubber);
  }
 }
 // Cab roof with rounded edges, the cab back with its window, bonnet, cowl and windscreen.
 const RC=.06,roofEdge=(u:number):[number,number]=>{const L=.08,w=cabW(ROOF-RC);if(u<L){const a=Math.PI/2*(1-u/L);return [-(w-RC)-RC*Math.cos(a),ROOF-RC+RC*Math.sin(a)];}if(u>1-L){const a=Math.PI/2*(1-(1-u)/L);return [(w-RC)+RC*Math.cos(a),ROOF-RC+RC*Math.sin(a)];}return [mix(-(w-RC),w-RC,(u-L)/(1-2*L)),ROOF];};
 panel('panel_RoofHollins',[0,.027,.053,.08,.3,.5,.7,.92,.947,.973,1],8,(u,t)=>{const [x,y]=roofEdge(u);return v(x,y,mix(CB-.005,pillarZ(y)+.01,t));},v(0,1,0));
 const BWY0=1.24,BWY1=1.70,BWX0=.66,BWX1=.60;
 panel('panel_HollinsCabBack',8,3,(u,t)=>{const y=mix(SILL,BWY0,t);return v((u*2-1)*cabW(y),y,CB);},v(0,0,-1));
 for(const s of [-1,1])panel('panel_HollinsCabBackPost'+(s<0?'L':'R'),2,4,(u,t)=>{const y=mix(BWY0,ROOF-.03,t),x=mix(mix(BWX0,BWX1,clamp((y-BWY0)/(BWY1-BWY0),0,1))-.005,cabW(y)-.004,u);return v(s*x,y,CB);},v(0,0,-1));
 panel('panel_HollinsCabBackHeader',4,1,(u,t)=>v((u*2-1)*(BWX1+.01),mix(BWY1,ROOF-.03,t),CB),v(0,0,-1));
 window('RearHollins',[v(-BWX0,BWY0,CB-.006),v(BWX0,BWY0,CB-.006),v(BWX1,BWY1,CB-.006),v(-BWX1,BWY1,CB-.006)],-1);
 box('panel_HollinsStopLamp',0,ROOF-.02,CB-.02,.30,.035,.03,red);
 panel('panel_hoodHollins',10,10,(u,t)=>{const z=mix(WS0+.02,END,t),w=frontPlan(z)-.02,x=(u*2-1)*w;return v(x,hoodY(z)+.018*(1-(x/w)**2)+.006,z);},v(0,1,0));
 // Two raised ribs run down the bonnet.
 for(const s of [-1,1])panel('panel_hoodHollinsRib'+(s<0?'L':'R'),1,8,(u,t)=>{const z=mix(WS0+.06,END-.10,t),x=s*mix(.30,.36,u);return v(x,hoodY(z)+.018*(1-(x/(BW-.02))**2)+.014,z);},v(0,1,0),paint,.012);
 box('panel_HollinsCowl',0,BELT+.012,WS0+.01,2*BW-.08,.02,.07,trim);
 window('FrontHollins',[v(-(BW-.05),BELT+.01,WS0),v(BW-.05,BELT+.01,WS0),v(CWT-.02,1.77,pillarZ(1.77)),v(-(CWT-.02),1.77,pillarZ(1.77))],1);
 // Upright nose: header panel, a wide chrome-framed egg-crate grille between quad rectangular headlamps.
 panel('panel_HollinsFrontPanel',10,4,(u,t)=>{const x=(u*2-1)*(BW-FC),y=mix(SILL,hoodY(END),t);return v(x,y,END);},v(0,0,1));
 const FZ=END+.008,GX=.50,GY0=.72,GY1=1.03;
 box('panel_HollinsGrille',0,(GY0+GY1)/2,FZ,2*GX,GY1-GY0,.014,trim);
 merged('panel_HollinsGrilleBars',[...[0,1,2].map(i=>new T.BoxGeometry(2*GX-.04,.016,.022).translate(0,GY0+.08+i*.075,FZ+.012)),...[-3,-2,-1,0,1,2,3].map(i=>new T.BoxGeometry(.016,GY1-GY0-.04,.022).translate(i*.14,(GY0+GY1)/2,FZ+.012))],bumperSteel);
 merged('panel_HollinsGrilleSurround',[new T.BoxGeometry(2*GX+.04,.03,.03).translate(0,GY1+.005,FZ+.014),new T.BoxGeometry(2*GX+.04,.03,.03).translate(0,GY0-.005,FZ+.014),new T.BoxGeometry(.03,GY1-GY0+.04,.03).translate(-GX-.005,(GY0+GY1)/2,FZ+.014),new T.BoxGeometry(.03,GY1-GY0+.04,.03).translate(GX+.005,(GY0+GY1)/2,FZ+.014)],chrome);
 box('panel_HollinsGrilleEmblem',0,(GY0+GY1)/2,FZ+.03,.16,.05,.012,chrome);
 for(const s of [-1,1]){
  box('panel_HollinsHeadlightBezel'+s,s*.71,.885,FZ+.004,.36,.17,.016,chrome);
  for(const [i,x]of [.615,.795].entries())box('panel_HollinsHeadlight'+s+(i?'Outer':'Inner'),s*x,.885,FZ+.014,.155,.125,.012,white);
  box('panel_HollinsFrontIndicator'+s,s*.71,.765,FZ+.008,.34,.05,.016,amber);
  panel('panel_HollinsSideMarker'+s,2,1,(u,t)=>{const z=mix(END-.30,END-.16,u);return v(s*(BW+.004),mix(.80,.85,t),z);},v(s,0,0),amber,.01);
 }
 // Steel bumpers: a full-width front bar with a black air dam, a rear step bumper with a ribbed tread.
 panel('panel_bumper_frontHollins',16,3,(u,t)=>{const x=(u*2-1)*1.0;return v(x,mix(.48,.68,t),END+.08-.14*Math.abs(x)**6+.014*Math.sin(t*Math.PI));},v(0,0,1),bumperSteel,.05);
 panel('panel_bumper_frontHollinsDam',12,1,(u,t)=>{const x=(u*2-1)*.92;return v(x,mix(.36,.48,t),END+.02-.06*Math.abs(x/.92)**6);},v(0,0,1),trim,.03);
 box('panel_bumper_frontHollinsPlate',0,.58,END+.105,.50,.11,.012,plate);
 for(const s of [-1,1])box('panel_bumper_frontHollinsFog'+s,s*.62,.42,END+.04,.14,.06,.016,reverse);
 panel('panel_bumper_rearHollins',16,3,(u,t)=>{const x=(u*2-1)*.98;return v(x,mix(.50,.66,t),REAR-.08+.10*Math.abs(x/.98)**6-.012*Math.sin(t*Math.PI));},v(0,0,-1),bumperSteel,.05);
 box('panel_bumper_rearHollinsStep',0,.668,REAR-.03,.92,.016,.12,bumperSteel);
 merged('panel_bumper_rearHollinsTread',Array.from({length:4},(_,i)=>new T.BoxGeometry(.86,.006,.012).translate(0,.679,REAR-.075+i*.03)),trim);
 box('panel_bumper_rearHollinsPlate',0,.58,REAR-.093,.50,.11,.012,plate);
 for(const s of [-1,1]){box('Structure Hollins bumper mount front'+s,s*.50,.58,END-.02,.10,.10,.18,steel);box('Structure Hollins bumper mount rear'+s,s*.50,.58,REAR+.02,.10,.10,.18,steel);}
 // Load bed: floor with ribs, headboard, wheel tubs, rear sill and the drop-down tailgate.
 const BZ0=REAR+.07,BZ1=BEDF-.05;
 box('panel_HollinsBedFloor',0,BF-.015,(BZ0+BZ1)/2,2*BIW,.03,BZ1-BZ0,bedliner);
 merged('panel_HollinsBedFloorRibs',Array.from({length:9},(_,i)=>new T.BoxGeometry(.04,.014,BZ1-BZ0-.06).translate(-.72+i*.18,BF+.007,(BZ0+BZ1)/2)),bedliner);
 box('panel_HollinsBedFront',0,(.66+BR)/2,BEDF,2*BW,BR-.66,.03,paint);
 box('panel_HollinsBedHeadboard',0,(BF+BR)/2,BEDF-.04,2*BIW,BR-BF,.02,paint);
 box('panel_HollinsBedFrontCap',0,BR-.015,BEDF-.02,2*BW,.03,.07,paint);
 for(const s of [-1,1]){
  const S=s<0?'L':'R',R=.56;
  panel('panel_HollinsBedWheelhouse'+S,14,2,(u,t)=>{const a=mix(.55,Math.PI-.55,u);return v(s*mix(BIW-.24,BIW,t),WY+Math.sin(a)*R,-AXLE+Math.cos(a)*R);},v(0,1,0),bedliner,.014);
  const c=new T.Shape(),a0=.55;c.moveTo(Math.cos(a0)*R,Math.sin(a0)*R);for(let i=1;i<=12;i++){const a=mix(a0,Math.PI-a0,i/12);c.lineTo(Math.cos(a)*R,Math.sin(a)*R);}c.lineTo(Math.cos(a0)*R,Math.sin(a0)*R);
  const g=new T.ExtrudeGeometry(c,{depth:.012,bevelEnabled:false,curveSegments:4});g.rotateY(-Math.PI/2).translate(s*(BIW-.24)+.006,WY,-AXLE);add('panel_HollinsBedWheelhouseCap'+S,g,bedliner);
 }
 box('panel_HollinsRearSill',0,(SILL+.08+.70)/2,REAR+.02,2*BIW,.70-SILL-.08,.02,paint);
 const TY0=.70,TY1=BR-.02;
 panel('panel_TailgateHollins',8,4,(u,t)=>{const x=(u*2-1)*(BIW-.005);return v(x,mix(TY0,TY1,t),REAR-.01*(1-x*x));},v(0,0,-1));
 panel('panel_TailgateHollinsStamp',6,2,(u,t)=>{const x=(u*2-1)*(BIW-.12);return v(x,mix(.80,1.08,t),REAR-.014*(1-x*x)-.002);},v(0,0,-1),paint,.01);
 box('panel_TailgateHollinsCap',0,TY1+.005,REAR+.03,2*BIW-.01,.03,.07,paint);
 box('panel_TailgateHollinsInner',0,(TY0+TY1)/2,REAR+.055,2*BIW-.02,TY1-TY0-.02,.02,paint);
 box('panel_TailgateHollinsHandle',0,1.17,REAR-.018,.24,.06,.016,trim);
 box('panel_TailgateHollinsHandleLever',0,1.165,REAR-.024,.16,.025,.01,chrome);
 for(const s of [-1,1]){box('panel_TailgateHollinsHinge'+s,s*(BIW-.06),TY0+.01,REAR+.01,.10,.03,.05,steel);box('panel_TailgateHollinsLatch'+s,s*(BIW-.01),TY1-.06,REAR+.03,.02,.05,.04,steel);}
 // Sport roll bar behind the cab: a hoop on the bed rails with two braces back to the rails.
 const RBZ=-.52,RBY=1.89;
 tube('panel_HollinsRollBar',[v(-.86,BR,RBZ),v(-.86,1.62,RBZ),v(-.84,1.80,RBZ),v(-.76,1.875,RBZ),v(-.60,RBY,RBZ),v(.60,RBY,RBZ),v(.76,1.875,RBZ),v(.84,1.80,RBZ),v(.86,1.62,RBZ),v(.86,BR,RBZ)],.035,bar,48,10);
 for(const s of [-1,1]){
  rod('panel_HollinsRollBarBrace'+(s<0?'L':'R'),v(s*.86,1.66,RBZ),v(s*.95,BR+.005,-1.18),.026,bar,8);
  box('panel_HollinsRollBarFoot'+(s<0?'L':'R'),s*.90,BR+.004,RBZ,.13,.012,.13,bar);
  box('panel_HollinsRollBarBraceFoot'+(s<0?'L':'R'),s*.95,BR+.004,-1.18,.10,.012,.10,bar);
 }
 // Cab interior: bench seat, dashboard, steering wheel, column shift and floor.
 box('Interior Hollins Bench',0,.78,.06,1.70,.15,.52,cloth);const back=box('Interior Hollins BenchBack',0,1.10,-.20,1.70,.58,.13,cloth);back.rotation.x=-.12;
 for(const s of [-1,1])box('Interior Hollins Headrest'+s,s*.42,1.46,-.25,.30,.16,.10,cloth);
 box('Interior Hollins Floor',0,.60,.45,1.86,.02,1.45,carpet);
 box('Interior Hollins BackWall',0,1.0,CB+.03,1.88,.80,.03,vinyl);
 box('Interior Hollins Dashboard',0,1.10,1.00,1.92,.22,.40,vinyl);box('Interior Hollins Binnacle',-.42,1.23,.86,.44,.11,.16,vinyl);
 for(const i of [-1,1])box('Interior Hollins Dial'+i,-.42+i*.10,1.23,.778,.12,.075,.006,dial);
 const wheel=add('Interior SteeringWheel Hollins',new T.TorusGeometry(.20,.018,6,18),vinyl);wheel.position.set(-.42,1.26,.62);wheel.rotation.x=.75;
 for(const s of [-1,1])rod('Interior Hollins SteeringSpoke'+s,v(-.42,1.26,.62),v(-.42+s*.19,1.26,.62),.014,vinyl);
 rod('Interior Hollins SteeringColumn',v(-.42,1.26,.62),v(-.42,1.08,.88),.024,vinyl);
 rod('Interior Hollins ColumnShift',v(-.38,1.20,.72),v(-.18,1.26,.76),.008,alu);
 // Structure: ladder frame, front V8 with two banks, gearbox, prop shaft, live rear axle on leaf springs, tank and exhaust.
 for(const s of [-1,1]){
  box('Structure Hollins frame rail'+s,s*.50,.52,0,.09,.16,5.00,steel);
  box('Structure Hollins leaf spring'+s,s*.50,.40,-AXLE,.08,.05,1.30,steel);
  box('Structure Hollins front coil'+s,s*.56,.56,AXLE,.12,.30,.12,steel);
  const bank=box('Structure Hollins V8 bank'+s,s*.17,.88,1.90,.26,.28,.66,steel);bank.rotation.z=-s*.42;
  box('Structure Hollins V8 cover'+s,s*.25,1.02,1.90,.12,.04,.60,alu).rotation.z=-s*.42;
 }
 for(const z of [-1.9,-1.2,-.4,.5,2.3])box('Structure Hollins cross member '+z,0,.50,z,1.0,.08,.08,steel);
 box('Structure Hollins V8 block',0,.74,1.90,.50,.30,.70,steel);box('Structure Hollins intake',0,1.04,1.90,.22,.08,.50,alu);
 box('Structure Hollins radiator',0,.82,2.42,.90,.46,.05,steel);for(let i=-6;i<=6;i++)box('Structure Hollins radiator fin'+i,i*.07,.82,2.45,.008,.42,.008,alu);
 box('Structure Hollins gearbox',0,.60,1.25,.32,.30,.62,steel);
 rod('Structure Hollins prop shaft',v(0,.52,.95),v(0,.42,-1.55),.04,steel);
 rod('Structure Hollins rear axle',v(-.78,WY,-AXLE),v(.78,WY,-AXLE),.045,steel);box('Structure Hollins differential',0,WY,-AXLE+.05,.32,.28,.28,steel);
 rod('Structure Hollins front axle',v(-.72,WY+.02,AXLE),v(.72,WY+.02,AXLE),.04,steel);
 for(const s of [-1,1])rod('Structure Hollins exhaust'+s,v(s*.30,.42,1.65),v(s*.30,.34,.60),.03,steel);
 rod('Structure Hollins exhaust',v(.30,.34,.60),v(.62,.34,-2.50),.035,steel);
 box('Structure Hollins fuel tank',-.70,.52,-.85,.26,.30,.80,steel);
 // Tern-pattern pressed wheels at .40 m on chunky tyres, each with a chrome dished trim.
 addRoadWheels(root,'tern');
 const rim=new T.LatheGeometry([new T.Vector2(.04,.026),new T.Vector2(.065,.028),new T.Vector2(.12,.016),new T.Vector2(.165,.007),new T.Vector2(.172,0)],18);
 const ribs=Array.from({length:8},(_,i)=>{const a=i/8*Math.PI*2;return new T.BoxGeometry(.014,.01,.07).translate(0,.022,.10).rotateY(a);});
 const trimGeometry=mergeGeometries([rim.toNonIndexed(),...ribs.map(r=>r.toNonIndexed())])!;rim.dispose();ribs.forEach(r=>r.dispose());
 for(const [i,name]of ['FL','FR','RL','RR'].entries()){
  const w=root.getObjectByName('wheel_'+name)!,s=i%2?1:-1;w.position.set(s*.84,WY,(i<2?1:-1)*AXLE);w.scale.setScalar(.40/.32);
  const c=new T.Mesh(trimGeometry.clone(),cap);c.name='Wheel Hollins trim '+name;c.quaternion.setFromUnitVectors(v(0,1,0),v(s,0,0));c.position.x=s*.078;c.castShadow=true;w.add(c);
 }
 trimGeometry.dispose();
 root.updateMatrixWorld(true);return root;
}
