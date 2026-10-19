import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {formedVehiclePanel,panelSamples} from './formed-vehicle-panel';
import {classicWindowFrame} from './classic-window-frame';
import {addRoadWheels} from './road-wheels';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),mix=T.MathUtils.lerp,clamp=T.MathUtils.clamp;
/** Original 1980s ice-cream van: a coachbuilt box body on a light-van chassis,
 * a short bonnet and upright cab with sliding doors, an overcab luton, a big
 * sliding serving hatch with a counter and a striped awning flap on the left
 * side, a fibreglass cone sign and two chime horns on the roof, round lamps,
 * chrome bumpers, a rear door with menu boards behind its glass, and a cream
 * livery with pastel pink and blue bands and painted cone and lolly decals.
 * Front inline four driving the rear wheels. Nose +Z. */
export function buildCornetAsset(){
 const root=new T.Group();root.name='CornetIceCreamVan';
 const mat=(name:string,color:number,roughness=.6,metalness=.15)=>new T.MeshPhysicalMaterial({name,color,roughness,metalness});
 const paint=mat('paint_Cornet',0xf3e6c8,.34,.12);paint.clearcoat=.7;
 const pink=mat('Cornet Livery Pink',0xf2a9c4,.42,.05),blue=mat('Cornet Livery Blue',0x9fcfe6,.42,.05),chrome=mat('Cornet Chrome',0xe2e5e8,.1,1),alu=mat('Cornet Aluminium',0xbcc1c4,.34,.8),steel=mat('Structure Cornet Steel',0x383f45,.66,.65),rubber=mat('Cornet Rubber',0x161718,.9),trim=mat('Cornet Black Trim',0x1d1f21,.55,.05),cap=mat('Cornet Wheel Trim',0xd4d8da,.22,.85);
 const glass=mat('Cornet Glass',0x3d5a60,.06,.1),white=mat('Cornet Lens',0xf1f2ec,.14),red=mat('Cornet Tail Lens',0xb0141c,.22),amber=mat('Cornet Amber Lens',0xe08a1e,.25),reverse=mat('Cornet Reverse Lens',0xdcdfdb,.2),plate=mat('Cornet Plate',0xe9e7df,.6);
 const waffle=mat('Cornet Waffle',0xd9a05b,.75,.02),ridge=mat('Cornet Waffle Ridge',0xa8692f,.8,.02),strawberry=mat('Cornet Strawberry',0xf4a3bf,.5,.03),mint=mat('Cornet Mint',0xa6dfc6,.5,.03),serve=mat('Cornet Soft Serve',0xfbf4e4,.45,.02),choc=mat('Cornet Chocolate',0x5a3320,.55,.04),cherry=mat('Cornet Cherry',0xc81f35,.3,.05),sky=mat('Cornet Sign Blue',0xb9e0f2,.5,.03),board=mat('Cornet Menu Board',0xf7f4ea,.7,.02);
 const stainless=mat('Interior Cornet Stainless',0xc4c8ca,.3,.85),vinyl=mat('Interior Cornet Vinyl',0x2c2f33,.85),seat=mat('Interior Cornet Seat',0x6b4e3d,.9),floor=mat('Interior Cornet Floor',0x4a4f53,.95),liner=mat('Interior Cornet Liner',0xeeeae0,.8),machine=mat('Interior Cornet Machine',0xf0c9d6,.5,.1),dial=mat('Interior Cornet Dial',0xe8e9e2,.3),lightPanel=mat('Interior Cornet Light Panel',0xf6f6ee,.4);
 glass.transparent=true;glass.opacity=.42;glass.depthWrite=false;
 const add=(name:string,g:T.BufferGeometry,m:T.Material)=>{if(g.index)g=g.toNonIndexed();const o=new T.Mesh(g,m);o.name=name;o.castShadow=o.receiveShadow=true;root.add(o);return o;};
 const box=(name:string,x:number,y:number,z:number,w:number,h:number,d:number,m:T.Material)=>{const o=add(name,new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);return o;};
 const panel=(name:string,nu:number|number[],nv:number|number[],map:(u:number,t:number)=>T.Vector3,n:T.Vector3,m:T.Material=paint,depth=.02)=>add(name,formedVehiclePanel(typeof nu==='number'?panelSamples(nu):nu,typeof nv==='number'?panelSamples(nv):nv,map,n,depth),m);
 const bar=(name:string,a:T.Vector3,b:T.Vector3,r:number,m:T.Material,radial=8)=>{const o=add(name,new T.CylinderGeometry(r,r,a.distanceTo(b),radial),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(v(0,1,0),b.clone().sub(a).normalize());return o;};
 const tube=(name:string,points:T.Vector3[],r:number,m:T.Material,segments=Math.max(8,points.length+2),radial=6)=>add(name,new T.TubeGeometry(new T.CatmullRomCurve3(points),segments,r,radial,false),m);
 const disc=(name:string,r:number,depth:number,m:T.Material,p:T.Vector3,axis=v(0,0,1),radial=20)=>{const o=add(name,new T.CylinderGeometry(r,r,depth,radial),m);o.position.copy(p);o.quaternion.setFromUnitVectors(v(0,1,0),axis);return o;};
 const window=(name:string,c:T.Vector3[],side:number,frame:T.Material=trim)=>{const f=classicWindowFrame(c,side);add('panel_'+name+'Frame',f.frame,frame);add('panel_'+name+'Seal',f.seal,rubber);add('glass_'+name,f.glass,glass).castShadow=false;};
 const merged=(name:string,parts:T.BufferGeometry[],m:T.Material)=>{const g=mergeGeometries(parts.map(p=>{const flat=p.index?p.toNonIndexed():p;if(flat!==p)p.dispose();return flat;}))!;parts.forEach(p=>p.dispose());return add(name,g,m);};
 // Proportions: 5.04 m over the bumpers on a 2.90 m wheelbase; cab waist 1.20 m, box roof 2.42 m, cone sign to 3.02 m.
 const AXLE=1.45,WY=.38,ARCH=.44,END=2.44,REAR=-2.44,BOXF=.60,SILL=.48,BELT=1.20,CABTOP=1.97,ROOF=2.42,BW=.98,CW=.95,CWT=.87,WS0=1.72,WS1=1.46,RC=.08;
 // Overcab luton: an elliptical nose over the cab roof between y 2.00 and the box roof.
 const LZ=.98,LRZ=.24,LY=2.21,LRY=.21,LB=2.0;
 const noseZ=(y:number)=>LZ+LRZ*Math.cos(Math.asin(clamp((y-LY)/LRY,-1,1)));
 // Serving hatch opening on the left box side.
 const HZ0=-.90,HZ1=.40,HY0=1.24,HY1=2.02;
 const arch=(z:number)=>{const d=Math.min(Math.abs(z-AXLE),Math.abs(z+AXLE));return d<ARCH?Math.max(SILL,WY+Math.sqrt(ARCH*ARCH-d*d)):SILL;};
 // Bonnet line falls from the screen base to the nose; plan corners round off at the front.
 const HL=(z:number)=>z<=WS0?BELT:BELT-.11*clamp((z-WS0)/(END-WS0),0,1)**1.4;
 const cabPlan=(z:number)=>z>END-.14?CW-.14+Math.sqrt(Math.max(0,.14*.14-(z-END+.14)**2)):CW;
 const cabW=(y:number)=>y<=BELT?CW:mix(CW-.012,CWT,(y-BELT)/(CABTOP-BELT));
 const cside=(s:number,z:number,y:number)=>v(s*cabW(y),y,z);
 const belt=(z:number,s:number)=>cside(s,z,BELT),top=(z:number,s:number)=>cside(s,z,1.90);
 const pillarZ=(y:number)=>mix(WS0,WS1,(y-BELT)/(CABTOP-BELT));
 // Pastel livery bands: a dripping pink band (wavy top edge) and a fine blue stripe above it.
 const drip=(z:number)=>1.02+.028*Math.sin(z*11.5)+.012*Math.sin(z*27+.6);
 const decals=new Map<string,{m:T.Material;parts:T.BufferGeometry[]}>();
 const decal=(name:string,m:T.Material,g:T.BufferGeometry)=>{let d=decals.get(name);if(!d){d={m,parts:[]};decals.set(name,d);}d.parts.push(g);};
 // Painted decals are thin extrusions laid onto a face: L/R box sides, B rear, F luton sign.
 const lay=(shapes:T.Shape|T.Shape[],face:'L'|'R'|'B'|'F',a:number,y:number,layer:number,surface=BW)=>{
  const g=new T.ExtrudeGeometry(shapes,{depth:.003,bevelEnabled:false,curveSegments:8}),off=.002+layer*.0032;
  if(face==='L')g.rotateY(-Math.PI/2).translate(-(surface+off),y,a);else if(face==='R')g.rotateY(Math.PI/2).translate(surface+off,y,a);else if(face==='B')g.rotateY(Math.PI).translate(a,y,REAR-off);else g.translate(a,y,surface+off);
  return g;
 };
 const circle=(x:number,y:number,r:number)=>{const s=new T.Shape();s.absarc(x,y,r,0,Math.PI*2,false);return s;};
 const rounded=(x0:number,y0:number,x1:number,y1:number,r:number)=>{const s=new T.Shape();s.moveTo(x0+r,y0);s.lineTo(x1-r,y0);s.quadraticCurveTo(x1,y0,x1,y0+r);s.lineTo(x1,y1-r);s.quadraticCurveTo(x1,y1,x1-r,y1);s.lineTo(x0+r,y1);s.quadraticCurveTo(x0,y1,x0,y1-r);s.lineTo(x0,y0+r);s.quadraticCurveTo(x0,y0,x0+r,y0);return s;};
 const coneDecal=(tag:string,face:'L'|'R'|'B'|'F',a:number,y:number,k:number,surface=BW)=>{
  const cone=new T.Shape();cone.moveTo(-.20*k,0);cone.lineTo(.20*k,0);cone.lineTo(0,-.44*k);cone.lineTo(-.20*k,0);
  decal('panel_CornetDecal'+tag+'Waffle',waffle,lay(cone,face,a,y,0,surface));
  const diamonds:T.Shape[]=[];for(let row=0;row<5;row++){const yy=-.07*k-row*.075*k,half=.20*k*(1+yy/(.44*k))-.035*k;for(let x=-half+((row%2)*.04*k);x<=half+1e-6;x+=.08*k){const d=new T.Shape(),r=.022*k;d.moveTo(x,yy+r);d.lineTo(x+r,yy);d.lineTo(x,yy-r);d.lineTo(x-r,yy);d.lineTo(x,yy+r);diamonds.push(d);}}
  decal('panel_CornetDecal'+tag+'Ridge',ridge,lay(diamonds,face,a,y,1,surface));
  decal('panel_CornetDecal'+tag+'Mint',mint,lay(circle(0,.30*k,.15*k),face,a,y,1,surface));
  const scoop=new T.Shape();scoop.absarc(0,.10*k,.20*k,-Math.PI*.05,Math.PI*1.05,false);for(let i=0;i<=6;i++){const x=mix(-.19*k,.19*k,i/6);scoop.lineTo(x,.03*k-(i%2?.05*k:0));}
  decal('panel_CornetDecal'+tag+'Pink',strawberry,lay(scoop,face,a,y,2,surface));
  decal('panel_CornetDecal'+tag+'Cherry',cherry,lay(circle(.05*k,.46*k,.045*k),face,a,y,2,surface));
 };
 const lollyDecal=(tag:string,face:'L'|'R'|'B'|'F',a:number,y:number,k:number,surface=BW)=>{
  decal('panel_CornetDecal'+tag+'Waffle',waffle,lay(rounded(-.025*k,-.32*k,.025*k,-.10*k,.012*k),face,a,y,0,surface));
  decal('panel_CornetDecal'+tag+'Mint',mint,lay(rounded(-.10*k,-.16*k,.10*k,.20*k,.08*k),face,a,y,1,surface));
  const dip=new T.Shape();dip.moveTo(-.10*k,.04*k);for(let i=0;i<=8;i++){const x=mix(-.10*k,.10*k,i/8);dip.lineTo(x,.04*k-(i%2?.05*k:0)*(i%4===1?1.4:1));}dip.lineTo(.10*k,.12*k);dip.quadraticCurveTo(.10*k,.20*k,.02*k,.20*k);dip.lineTo(-.02*k,.20*k);dip.quadraticCurveTo(-.10*k,.20*k,-.10*k,.12*k);dip.lineTo(-.10*k,.04*k);
  decal('panel_CornetDecal'+tag+'Pink',strawberry,lay(dip,face,a,y,2,surface));
 };
 for(const s of [-1,1]){
  const S=s<0?'L':'R',X=s*BW;
  // Box sides: lower (with the rear arch), upper (around the hatch on the left) and the luton band.
  panel('panel_CornetBoxSide'+S,24,3,(u,t)=>{const z=mix(REAR+RC,BOXF,u);return v(X,mix(arch(z),HY0,t),z);},v(s,0,0));
  if(s<0){
   panel('panel_CornetBoxUpperRearL',4,4,(u,t)=>v(X,mix(HY0,LB,t),mix(REAR+RC,HZ0,u)),v(s,0,0));
   panel('panel_CornetBoxUpperFrontL',2,4,(u,t)=>v(X,mix(HY0,LB,t),mix(HZ1,BOXF,u)),v(s,0,0));
   panel('panel_CornetBoxOverHatchL',6,1,(u,t)=>v(X,mix(HY1,LB,t),mix(HZ0,HZ1,u)),v(s,0,0));
  }else panel('panel_CornetBoxUpperR',8,4,(u,t)=>v(X,mix(HY0,LB,t),mix(REAR+RC,BOXF,u)),v(s,0,0));
  panel('panel_CornetLutonSide'+S,10,3,(u,t)=>{const y=mix(LB,ROOF-RC,t);return v(X,y,mix(REAR+RC,noseZ(y),u));},v(s,0,0));
  // Rounded rear corners of the coachbuilt box.
  panel('panel_CornetRearCorner'+S,4,4,(u,t)=>{const a=u*Math.PI/2;return v(s*(BW-RC+RC*Math.cos(a)),mix(SILL,ROOF-RC,t),REAR+RC-RC*Math.sin(a));},v(s,0,-1).normalize());
  // The cab steps in from the box; this edge closes the step.
  box('panel_CornetBoxFrontEdge'+S,s*(CW+BW)/2,(SILL+LB)/2,BOXF,BW-CW+.01,LB-SILL,.02,paint);
  // Livery: pink drip band and blue stripe along the box, a blue band under the roof.
  panel('panel_CornetBandPink'+S,40,2,(u,t)=>{const z=mix(REAR+RC+.01,BOXF-.01,u);return v(s*(BW+.004),mix(Math.max(.80,arch(z)+.02),drip(z),t),z);},v(s,0,0),pink,.008);
  panel('panel_CornetBandBlue'+S,8,1,(u,t)=>{const z=mix(REAR+RC+.01,BOXF-.01,u);return v(s*(BW+.004),mix(1.08,1.13,t),z);},v(s,0,0),blue,.008);
  panel('panel_CornetBandTop'+S,8,1,(u,t)=>{const y=mix(2.20,2.30,t);return v(s*(BW+.004),y,mix(REAR+RC+.01,noseZ(y)-.01,u));},v(s,0,0),blue,.008);
  // Cab: sliding door over the front of the arch, the front wing and the rounded front corner.
  panel('panel_BodyDoor'+S+'Cornet',12,4,(u,t)=>{const z=mix(.63,1.40,u);return v(s*CW,mix(arch(z),BELT,t),z);},v(s,0,0));
  panel('panel_BodyDoor'+S+'CornetBandPink',14,2,(u,t)=>{const z=mix(.645,1.385,u);return v(s*(CW+.004),mix(Math.max(.80,arch(z)+.02),drip(z),t),z);},v(s,0,0),pink,.008);
  panel('panel_BodyDoor'+S+'CornetBandBlue',3,1,(u,t)=>v(s*(CW+.004),mix(1.08,1.13,t),mix(.645,1.385,u)),v(s,0,0),blue,.008);
  box('panel_BodyDoor'+S+'CornetHandle',s*(CW+.012),1.10,.74,.025,.03,.14,chrome);
  box('panel_BodyDoor'+S+'CornetInnerCard',s*(CW-.05),.92,1.0,.03,.40,.62,vinyl);
  panel('panel_FrontWing'+S+'Cornet',14,4,(u,t)=>{const z=mix(1.40,END-.14,u);return v(s*CW,mix(arch(z),HL(z),t),z);},v(s,0,0));
  panel('panel_FrontWing'+S+'CornetBandPink',14,2,(u,t)=>{const z=mix(1.415,2.10,u);return v(s*(CW+.004),mix(Math.max(.80,arch(z)+.02),drip(z),t),z);},v(s,0,0),pink,.008);
  panel('panel_FrontWing'+S+'CornetBandBlue',3,1,(u,t)=>v(s*(CW+.004),mix(1.08,1.13,t),mix(1.415,2.05,u)),v(s,0,0),blue,.008);
  panel('panel_CornetFrontCorner'+S,4,4,(u,t)=>{const a=u*Math.PI/2,z=END-.14+.14*Math.sin(a);return v(s*(CW-.14+.14*Math.cos(a)),mix(SILL,HL(z),t),z);},v(s,0,1).normalize());
  // Cab glasshouse: door glass, a quarter light, pillars and the cant rail under the luton.
  window('BodyDoor'+S+'Cornet',[belt(1.36,s),belt(.68,s),top(.68,s),top(1.36,s)],s);
  window('Quarter'+S+'CornetFront',[belt(1.68,s),belt(1.42,s),top(1.42,s),top(1.455,s)],s);
  const pillar=(name:string,a0:T.Vector3,a1:T.Vector3,b0:T.Vector3,b1:T.Vector3,m:T.Material=paint,nu=3)=>panel(name,nu,6,(u,t)=>a0.clone().lerp(a1,t).lerp(b0.clone().lerp(b1,t),u),v(s,.2,0),m,.016);
  pillar('panel_CornetAPillar'+S,belt(WS0+.005,s),cside(s,pillarZ(CABTOP),CABTOP),belt(1.675,s),cside(s,1.45,CABTOP));
  pillar('panel_CornetBPillar'+S,belt(1.42,s),cside(s,1.42,CABTOP),belt(1.36,s),cside(s,1.36,CABTOP),trim);
  pillar('panel_CornetCabRearPillar'+S,belt(.68,s),cside(s,.68,CABTOP),belt(BOXF,s),cside(s,BOXF,CABTOP));
  panel('panel_CornetCantRail'+S,6,1,(u,t)=>{const z=mix(BOXF,1.45,u);return cside(s,z,mix(1.90,CABTOP,t));},v(s,.3,0).normalize(),paint,.016);
  // Sliding-door runners above and below the door; a step behind the front wheel.
  tube('panel_CornetDoorRailTop'+S,[v(s*(cabW(1.93)+.012),1.93,1.38),v(s*(cabW(1.93)+.012),1.93,.95),v(s*(BW+.012),1.93,.50),v(s*(BW+.012),1.93,.22)],.011,alu,10);
  box('panel_CornetCabStep'+S,s*(CW-.06),.42,.80,.22,.035,.32,trim);
  // Big van mirrors on arms from the A pillar.
  bar('panel_BodyDoor'+S+'CornetMirrorArm',v(s*.92,1.40,1.62),v(s*1.04,1.47,1.58),.012,chrome);
  box('panel_BodyDoor'+S+'CornetMirror',s*1.055,1.50,1.57,.035,.24,.15,trim);
  bar('panel_CornetWiper'+S,v(s*.62,1.225,1.71),v(s*.12,1.60,1.58),.007,rubber);
  // Wheel houses and black arch lips.
  for(const z of [-AXLE,AXLE]){
   const w=z>0?CW:BW;
   panel('Structure Cornet wheelhouse '+S+z,14,3,(u,t)=>v(s*mix(.58,w-.02,t),WY+Math.sin(u*Math.PI)*.45,z+Math.cos(u*Math.PI)*.45),v(0,1,0),steel,.016);
   const points=Array.from({length:15},(_,i)=>{const a=mix(.1,Math.PI-.1,i/14),y=WY+Math.sin(a)*ARCH,zz=z+Math.cos(a)*ARCH;return v(s*(w+.008),y,zz);});
   tube('panel_CornetArchTrim'+S+z,points,.016,trim,14,5);
  }
  // Rear lamps: tall clusters on the rear corner posts.
  for(const [name,y0,y1,m]of [['Reverse',.60,.68,reverse],['Tail',.70,.90,red],['Indicator',.92,1.02,amber]]as const)box('panel_CornetRearLamp'+S+name,s*.78,(y0+y1)/2,REAR-.012,.16,y1-y0-.008,.02,m);
  box('panel_CornetRearLampBezel'+S,s*.78,.81,REAR-.006,.19,.45,.012,chrome);
 }
 // Roof with rounded side edges, running forward over the luton.
 const rcols=[0,.03,.06,.09,.3,.5,.7,.91,.94,.97,1];
 const roofAt=(u:number)=>{const L=.09;if(u<L){const a=Math.PI/2*(1-u/L);return [-(BW-RC)-RC*Math.cos(a),ROOF-RC+RC*Math.sin(a)];}if(u>1-L){const a=Math.PI/2*(1-(1-u)/L);return [(BW-RC)+RC*Math.cos(a),ROOF-RC+RC*Math.sin(a)];}return [mix(-(BW-RC),BW-RC,(u-L)/(1-2*L)),ROOF];};
 panel('panel_RoofCornet',rcols,8,(u,t)=>{const [x,y]=roofAt(u);return v(x,y,mix(REAR,noseZ(y),t));},v(0,1,0));
 // Luton nose and its underside over the cab.
 panel('panel_CornetLutonNose',6,10,(u,t)=>{const a=mix(-Math.PI/2,Math.PI/2,t);return v((u*2-1)*BW,LY+LRY*Math.sin(a),LZ+LRZ*Math.cos(a));},v(0,0,1));
 box('panel_CornetLutonFloor',0,LB-.01,(BOXF+LZ)/2,2*BW,.02,LZ-BOXF,paint);
 // Rear face around the rear door, with a blue band under the roof and a pink band at the waist.
 const DX=.515,DY0=.63,DY1=2.11,RX=BW-RC;
 for(const s of [-1,1]){
  panel('panel_CornetRearPost'+(s<0?'L':'R'),2,6,(u,t)=>v(s*mix(DX+.025,RX,u),mix(SILL,ROOF,t),REAR),v(0,0,-1));
  panel('panel_CornetBandPinkRear'+(s<0?'L':'R'),2,1,(u,t)=>v(s*mix(DX+.03,RX-.005,u),mix(1.08,1.20,t),REAR-.004),v(0,0,-1),pink,.008);
  panel('panel_CornetBandTopRear'+(s<0?'L':'R'),2,1,(u,t)=>v(s*mix(DX+.03,RX-.005,u),mix(2.20,2.30,t),REAR-.004),v(0,0,-1),blue,.008);
  lollyDecal('Rear'+(s<0?'L':'R'),'B',s*.73,1.62,.75);
 }
 panel('panel_CornetRearHeader',4,1,(u,t)=>v(mix(-DX-.025,DX+.025,u),mix(DY1+.02,ROOF,t),REAR),v(0,0,-1));
 panel('panel_CornetBandTopRearHeader',4,1,(u,t)=>v(mix(-DX-.02,DX+.02,u),mix(2.20,2.30,t),REAR-.004),v(0,0,-1),blue,.008);
 panel('panel_CornetRearSill',4,1,(u,t)=>v(mix(-DX-.025,DX+.025,u),mix(SILL,DY0-.02,t),REAR),v(0,0,-1));
 box('panel_CornetCappingRear',0,ROOF-.005,REAR+.01,2*RX,.03,.04,alu);
 // Rear door (top-hinged): skin around its window, the menu boards behind the glass, plate and handle.
 const DW0=1.45,DW1=1.98,DWX=.40;
 panel('panel_TailgateCornet',6,4,(u,t)=>v(mix(-DX,DX,u),mix(DY0,DW0,t),REAR-.012),v(0,0,-1));
 panel('panel_TailgateCornetTop',6,1,(u,t)=>v(mix(-DX,DX,u),mix(DW1,DY1,t),REAR-.012),v(0,0,-1));
 for(const s of [-1,1])panel('panel_TailgateCornetStile'+(s<0?'L':'R'),1,3,(u,t)=>v(s*mix(DWX,DX,u),mix(DW0,DW1,t),REAR-.012),v(0,0,-1));
 window('TailgateCornet',[v(-DWX,DW0,REAR-.012),v(DWX,DW0,REAR-.012),v(DWX,DW1,REAR-.012),v(-DWX,DW1,REAR-.012)],-1);
 panel('panel_TailgateCornetBandPink',4,1,(u,t)=>v(mix(-DX+.005,DX-.005,u),mix(1.08,1.20,t),REAR-.016),v(0,0,-1),pink,.008);
 box('panel_TailgateCornetMenuBoard',0,(DW0+DW1)/2,REAR+.035,2*DWX-.04,DW1-DW0-.04,.015,board);
 {const rows:T.BufferGeometry[][]=[[],[],[]];for(let col=0;col<2;col++)for(let row=0;row<5;row++)rows[(row+col)%3].push(new T.BoxGeometry(.24,.032,.006).translate((col?.17:-.17),DW0+.08+row*.085,REAR+.026));
  merged('panel_TailgateCornetMenuPink',rows[0],strawberry);merged('panel_TailgateCornetMenuMint',rows[1],mint);merged('panel_TailgateCornetMenuChoc',rows[2],choc);}
 box('panel_TailgateCornetHandle',.36,1.30,REAR-.03,.035,.12,.03,chrome);
 box('panel_TailgateCornetPlate',0,.80,REAR-.025,.52,.12,.012,plate);
 box('panel_TailgateCornetInner',0,1.0,REAR+.02,.96,.60,.02,liner);
 // Serving hatch: aluminium surround, two sliding panes (one slid open), a stainless counter and the striped awning flap.
 {const f=classicWindowFrame([v(-BW,HY0,HZ1),v(-BW,HY0,HZ0),v(-BW,HY1,HZ0),v(-BW,HY1,HZ1)],-1);add('panel_CornetHatchFrame',f.frame,alu);add('panel_CornetHatchSeal',f.seal,rubber);}
 const PY0=HY0+.04,PY1=HY1-.04;
 box('glass_CornetHatchFront',-(BW-.03),(PY0+PY1)/2,.06,.008,PY1-PY0,.62,glass).castShadow=false;
 box('glass_CornetHatchSlider',-(BW-.045),(PY0+PY1)/2,-.02,.008,PY1-PY0,.62,glass).castShadow=false;
 merged('panel_CornetHatchPaneFrames',[.06,-.02].flatMap((z,i)=>{const x=-(BW-.03-i*.015);return [new T.BoxGeometry(.016,.022,.62).translate(x,PY0,z),new T.BoxGeometry(.016,.022,.62).translate(x,PY1,z),new T.BoxGeometry(.016,PY1-PY0,.022).translate(x,(PY0+PY1)/2,z-.31),new T.BoxGeometry(.016,PY1-PY0,.022).translate(x,(PY0+PY1)/2,z+.31)];}),alu);
 box('panel_CornetHatchRunner',-(BW-.035),HY0+.012,(HZ0+HZ1)/2,.04,.02,HZ1-HZ0-.06,alu);
 box('panel_CornetHatchCounter',-(BW-.07),1.225,(HZ0+HZ1)/2,.37,.03,HZ1-HZ0+.04,alu);
 for(const z of [HZ0+.15,HZ1-.15])bar('panel_CornetHatchBracket'+z,v(-(BW+.005),1.07,z),v(-(BW+.15),1.215,z),.012,alu);
 const FL=.26,FA=1.05,HX=-(BW+.006),HYH=HY1+.045;
 const flap=(t:number)=>v(HX-t*FL*Math.sin(FA),HYH-t*FL*Math.cos(FA),0);
 panel('panel_ServingHatchCornetFlap',6,2,(u,t)=>flap(t).setZ(mix(HZ0-.05,HZ1+.05,u)),v(-Math.cos(FA),Math.sin(FA),0),paint,.014);
 {const stripes:T.BufferGeometry[]=[];const N=7,span=(HZ1-HZ0+.1)/N;for(let i=0;i<N;i+=2){const z0=HZ0-.05+i*span,z1=z0+span;stripes.push(formedVehiclePanel(panelSamples(1),panelSamples(2),(u,t)=>flap(t).add(v(-Math.cos(FA)*.004,Math.sin(FA)*.004,0)).setZ(mix(z0,z1,u)),v(-Math.cos(FA),Math.sin(FA),0),.006));}
  merged('panel_ServingHatchCornetFlapStripes',stripes,strawberry);}
 {const edge=flap(1),s=new T.Shape(),W=HZ1-HZ0+.1,n=9;s.moveTo(0,0);s.lineTo(W,0);for(let i=n;i>0;i--){const c=(i-.5)*W/n;s.absarc(c,0,W/n/2,0,-Math.PI,true);}s.lineTo(0,0);
  const g=new T.ExtrudeGeometry(s,{depth:.006,bevelEnabled:false,curveSegments:4});g.rotateY(-Math.PI/2).translate(edge.x+.003,edge.y,HZ0-.05);add('panel_ServingHatchCornetFlapValance',g,strawberry);}
 for(const z of [HZ0+.06,HZ1-.06])bar('panel_ServingHatchCornetFlapStay'+z,flap(.92).setZ(z),v(-(BW+.005),HY1-.18,z),.007,alu);
 // Luton sign board with sprinkles and a cone.
 const SZ=LZ+LRZ+.006;
 box('panel_CornetLutonSign',0,2.21,SZ,1.32,.17,.012,sky);
 {const rnd=(()=>{let a=0x51ce;return()=>{a=(a+0x6d2b79f5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};})();
  const groups:T.BufferGeometry[][]=[[],[],[]];for(let i=0;i<54;i++){const x=mix(-.62,.62,rnd()),y=mix(2.14,2.28,rnd());if(Math.abs(x)<.16)continue;groups[i%3].push(new T.BoxGeometry(.026,.007,.004).rotateZ(rnd()*Math.PI).translate(x,y,SZ+.008));}
  merged('panel_CornetSprinklesPink',groups[0],strawberry);merged('panel_CornetSprinklesMint',groups[1],mint);merged('panel_CornetSprinklesChoc',groups[2],choc);}
 coneDecal('Luton','F',0,2.215,.26,SZ+.004);
 // Side decals: a big cone, a small cone and a lolly on the right; a cone and a lolly behind the hatch on the left.
 lollyDecal('R1','R',-1.85,1.62,1.1);coneDecal('R2','R',-.85,1.66,1.05);coneDecal('R3','R',.18,1.62,.72);
 lollyDecal('L1','L',-1.30,1.62,1.0);coneDecal('L2','L',-1.98,1.62,.80);
 for(const [name,d]of decals)merged(name,d.parts,d.m);
 // Upright cab front: bonnet, front panel with round headlamps, a chrome grille, windscreen and cab roof.
 panel('panel_hoodCornet',10,8,(u,t)=>{const z=mix(WS0,END,t),w=cabPlan(z)-.01,x=(u*2-1)*w;return v(x,HL(z)+.015*(1-(x/w)**2)+.004,z);},v(0,1,0));
 panel('panel_CornetFrontPanel',8,4,(u,t)=>{const x=(u*2-1)*(CW-.14),y=mix(SILL,HL(END),t);return v(x,y,END+.008*(1-(x/(CW-.14))**2));},v(0,0,1));
 window('FrontCornet',[v(-(CW-.05),BELT+.01,WS0),v(CW-.05,BELT+.01,WS0),v(CWT-.03,1.93,pillarZ(1.93)),v(-(CWT-.03),1.93,pillarZ(1.93))],1);
 box('panel_CornetCowl',0,BELT+.01,WS0+.03,2*CW-.1,.02,.08,trim);
 box('panel_CornetCabRoof',0,CABTOP,(BOXF+WS1)/2+.01,2*CWT,.03,WS1-BOXF+.02,paint);
 for(const s of [-1,1]){
  disc('panel_CornetHeadlight'+s,.085,.03,white,v(s*.64,.87,END+.012),v(0,0,1),18);
  const bezel=add('panel_CornetHeadlightBezel'+s,new T.TorusGeometry(.092,.013,6,16),chrome);bezel.position.set(s*.64,.87,END+.022);
  box('panel_CornetFrontIndicator'+s,s*.64,.70,END+.012,.14,.06,.02,amber);
 }
 box('panel_CornetGrille',0,.82,END+.008,.70,.34,.012,trim);
 merged('panel_CornetGrilleSlats',Array.from({length:6},(_,i)=>new T.BoxGeometry(.66,.014,.012).translate(0,.68+i*.056,END+.02)),chrome);
 tube('panel_CornetGrilleSurround',[v(-.36,.64,END+.02),v(.36,.64,END+.02),v(.37,.82,END+.02),v(.36,1.0,END+.02),v(-.36,1.0,END+.02),v(-.37,.82,END+.02),v(-.36,.64,END+.02)],.014,chrome,18);
 // Chrome bumpers: a full-width bar wrapping the front corners; the rear bar carries a ribbed step under the door.
 for(const sign of [-1,1]){
  const name=sign>0?'front':'rear',face=sign>0?END+.07:REAR-.07;
  panel('panel_bumper_'+name+'Cornet',16,3,(u,t)=>{const x=(u*2-1)*.97;return v(x,mix(.37,.53,t),face-sign*.11*Math.abs(x/.97)**6+sign*.012*Math.sin(t*Math.PI));},v(0,0,sign),chrome,.04);
  for(const s of [-1,1])box('Structure Cornet bumper mount '+name+s,s*.52,.45,sign*(END-.02),.1,.09,.16,steel);
 }
 box('panel_bumper_frontCornetPlate',0,.45,END+.10,.50,.11,.012,plate);
 box('panel_bumper_rearCornetStep',0,.42,REAR-.085,.84,.04,.11,trim);
 merged('panel_bumper_rearCornetStepRibs',Array.from({length:5},(_,i)=>new T.BoxGeometry(.80,.008,.012).translate(0,.443,REAR-.05-i*.02)),alu);
 // Roof: cone sign on a plinth, chime horns, roof vent.
 box('panel_CornetConeSignBase',0,ROOF+.03,.62,.46,.06,.42,paint);
 {const holder=add('panel_CornetConeSignHolder',new T.TorusGeometry(.07,.016,6,16),chrome);holder.rotation.x=Math.PI/2;holder.position.set(0,ROOF+.07,.62);}
 const CY=ROOF+.05,CH=.28,CR=.15;
 {const cone=add('panel_CornetConeSign',new T.LatheGeometry([new T.Vector2(.001,0),new T.Vector2(.02,.012),new T.Vector2(CR,CH),new T.Vector2(CR+.015,CH+.005),new T.Vector2(CR+.016,CH+.035),new T.Vector2(.001,CH+.036)],20),waffle);cone.position.set(0,CY,.62);
  const ridges:T.BufferGeometry[]=[];for(const dir of [-1,1])for(let i=0;i<7;i++){const a0=i/7*Math.PI*2,pts=Array.from({length:7},(_,k)=>{const f=k/6,a=a0+dir*f*Math.PI/2,r=mix(.02,CR,f)+.004;return v(Math.cos(a)*r,CY+mix(.012,CH,f),.62+Math.sin(a)*r);});ridges.push(new T.TubeGeometry(new T.CatmullRomCurve3(pts),6,.006,3,false));}
  merged('panel_CornetConeSignRidges',ridges,ridge);
  const swirl=Array.from({length:61},(_,k)=>{const f=k/60,a=f*Math.PI*2*3.2,r=mix(.12,.02,f**1.1);return v(Math.cos(a)*r,CY+CH+.04+f*.15,.62+Math.sin(a)*r);});
  tube('panel_CornetConeSignSwirl',swirl,.055,serve,48,6);
  const scoop=add('panel_CornetConeSignScoop',new T.SphereGeometry(.14,16,8,0,Math.PI*2,0,Math.PI*.62),strawberry);scoop.position.set(0,CY+CH+.025,.62);
  const tip=add('panel_CornetConeSignTip',new T.ConeGeometry(.035,.07,10),serve);tip.position.set(.01,CY+CH+.215,.62);
  const flake=box('panel_CornetConeSignFlake',.07,CY+CH+.12,.66,.035,.18,.035,choc);flake.rotation.z=-.42;flake.rotation.x=.18;}
 for(const s of [-1,1]){
  // Chime horns: closed trumpet shells (outer flare, lip, inner flare) on a bracket, angled forward and out.
  const prof=[new T.Vector2(.022,0),new T.Vector2(.03,.10),new T.Vector2(.05,.17),new T.Vector2(.095,.23),new T.Vector2(.088,.235),new T.Vector2(.044,.18),new T.Vector2(.022,.11),new T.Vector2(.014,.01)];
  const horn=add('panel_CornetChimeHorn'+(s<0?'L':'R'),new T.LatheGeometry(prof,16),chrome);horn.position.set(s*.42,ROOF+.16,.82);horn.quaternion.setFromUnitVectors(v(0,1,0),v(s*.35,.08,1).normalize());
  disc('panel_CornetChimeDriver'+(s<0?'L':'R'),.045,.07,chrome,v(s*.39,ROOF+.155,.76),v(s*.35,.08,1).normalize(),14);
  bar('panel_CornetChimeBracket'+(s<0?'L':'R'),v(s*.39,ROOF+.005,.76),v(s*.39,ROOF+.14,.76),.012,alu);
 }
 box('panel_CornetChimeBar',0,ROOF+.01,.76,.86,.02,.06,alu);
 box('panel_CornetRoofVent',0,ROOF+.05,-1.55,.42,.08,.42,alu);
 // Cab: seats, dash, big flat steering wheel, partition with a pass-through.
 for(const s of [-1,1]){
  box('Interior Cornet SeatBase'+s,s*.42,.78,.92,.50,.14,.48,seat);const back=box('Interior Cornet SeatBack'+s,s*.42,1.10,.68,.50,.58,.12,seat);back.rotation.x=-.08;
 }
 box('Interior Cornet CabFloor',0,.58,1.10,1.80,.02,1.0,floor);
 box('Interior Cornet Partition',0,1.20,BOXF+.04,1.86,1.40,.03,liner);
 box('Interior Cornet Dashboard',0,1.10,1.58,1.84,.20,.30,vinyl);box('Interior Cornet Binnacle',-.42,1.22,1.48,.40,.10,.14,vinyl);
 for(const i of [-1,1])box('Interior Cornet Dial'+i,-.42+i*.09,1.22,1.405,.11,.07,.006,dial);
 const wheel=add('Interior SteeringWheel Cornet',new T.TorusGeometry(.21,.017,6,18),vinyl);wheel.position.set(-.42,1.30,1.28);wheel.rotation.x=1.0;
 for(const s of [-1,1])bar('Interior Cornet SteeringSpoke'+s,v(-.42,1.30,1.28),v(-.42+s*.20,1.30,1.28),.013,vinyl);
 bar('Interior Cornet SteeringColumn',v(-.42,1.30,1.28),v(-.42,1.05,1.48),.022,vinyl);
 bar('Interior Cornet GearLever',v(0,.66,1.30),v(.04,.98,1.22),.012,steel);
 // Serving room: floor, worktop with freezer lids, soft-serve machine, cone dispensers, shelves of sauces, menu board and lights.
 box('Interior Cornet Floor',0,.62,(REAR+BOXF)/2,1.90,.02,BOXF-REAR-.06,floor);
 box('Interior Cornet Ceiling',0,ROOF-.04,(REAR+BOXF)/2,1.90,.02,BOXF-REAR-.06,liner);
 box('Interior Cornet Freezer',-.62,.82,(HZ0+HZ1)/2-.15,.62,.40,1.50,liner);
 box('Interior Cornet Worktop',-.62,1.03,(HZ0+HZ1)/2-.15,.66,.03,1.54,stainless);
 merged('Interior Cornet FreezerLids',[-.62,-.10,.42].map(z=>new T.BoxGeometry(.50,.012,.46).translate(-.62,1.052,z-.15)),stainless);
 box('Interior Cornet ServeMachine',-.50,1.38,-.55,.42,.66,.46,machine);
 box('Interior Cornet ServeHead',-.50,1.76,-.55,.44,.10,.48,stainless);
 merged('Interior Cornet ServeNozzles',[-.12,0,.12].map(z=>new T.CylinderGeometry(.02,.012,.10,10).translate(-.70,1.30,-.55+z)),stainless);
 merged('Interior Cornet ConeDispensers',[.08,.18,.28].map(z=>new T.CylinderGeometry(.045,.045,.46,12).translate(-.84,1.30,z)),stainless);
 box('Interior Cornet Shelf',.80,1.55,-.60,.30,.03,1.60,stainless);box('Interior Cornet ShelfLow',.80,1.20,-.60,.30,.03,1.60,stainless);
 for(const [i,m]of [strawberry,choc,mint,strawberry,choc,mint].entries())add('Interior Cornet Sauce'+i,new T.CylinderGeometry(.035,.04,.20,10).translate(.80,1.67,-1.25+i*.24),m);
 box('Interior Cornet MenuBoard',BW-.06,1.85,-.30,.02,.32,.90,board);
 merged('Interior Cornet Lights',[-1.6,-.4,.3].map(z=>new T.BoxGeometry(.5,.02,.12).translate(0,ROOF-.06,z)),lightPanel);
 // Structure: ladder frame, floors, front inline four, gearbox, prop shaft, live rear axle on leaf springs, tank and generator.
 for(const s of [-1,1]){
  box('Structure Cornet frame rail'+s,s*.50,.40,0,.09,.12,4.70,steel);
  for(const z of [-AXLE,AXLE])box('Structure Cornet leaf spring'+s+z,s*.50,.32,z,.07,.05,1.10,steel);
 }
 box('Structure Cornet floor',0,.56,(REAR+BOXF)/2,1.92,.04,BOXF-REAR,steel);
 box('Structure Cornet inline four',0,.80,1.98,.50,.44,.66,steel);box('Structure Cornet cam cover',0,1.05,1.98,.38,.06,.56,alu);
 box('Structure Cornet gearbox',0,.62,1.42,.30,.28,.48,steel);
 bar('Structure Cornet prop shaft',v(0,.52,1.18),v(0,.44,-1.35),.035,steel);
 bar('Structure Cornet rear axle',v(-.74,.38,-AXLE),v(.74,.38,-AXLE),.04,steel);box('Structure Cornet differential',0,.38,-AXLE+.04,.28,.24,.24,steel);
 bar('Structure Cornet front axle',v(-.70,.40,AXLE),v(.70,.40,AXLE),.035,steel);
 box('Structure Cornet radiator',0,.82,2.33,.80,.40,.045,steel);for(let i=-5;i<=5;i++)box('Structure Cornet radiator fin'+i,i*.07,.82,2.36,.008,.36,.008,alu);
 bar('Structure Cornet exhaust',v(.30,.30,1.6),v(.62,.30,-2.40),.03,steel);
 box('Structure Cornet fuel tank',-.45,.38,-.30,.42,.22,.70,steel);
 box('Structure Cornet generator',.30,.40,-2.05,.50,.30,.42,steel);
 // Tern-pattern pressed wheels at .36 m with chrome wheel trims.
 addRoadWheels(root,'tern');
 const rim=new T.LatheGeometry([new T.Vector2(.045,.018),new T.Vector2(.06,.02),new T.Vector2(.14,.012),new T.Vector2(.168,.006),new T.Vector2(.170,0)],16);
 const ribs=Array.from({length:6},(_,i)=>{const a=i/6*Math.PI*2;return new T.BoxGeometry(.016,.008,.08).translate(0,.018,.105).rotateY(a);});
 const trimGeometry=mergeGeometries([rim.toNonIndexed(),...ribs.map(r=>r.toNonIndexed())])!;rim.dispose();ribs.forEach(r=>r.dispose());
 for(const [i,name]of ['FL','FR','RL','RR'].entries()){
  const w=root.getObjectByName('wheel_'+name)!,s=i%2?1:-1;w.position.set(s*.80,WY,(i<2?1:-1)*AXLE);w.scale.setScalar(.36/.32);
  const c=new T.Mesh(trimGeometry.clone(),cap);c.name='Wheel Cornet trim '+name;c.quaternion.setFromUnitVectors(v(0,1,0),v(s,0,0));c.position.x=s*.078;c.castShadow=true;w.add(c);
 }
 trimGeometry.dispose();
 root.updateMatrixWorld(true);return root;
}
