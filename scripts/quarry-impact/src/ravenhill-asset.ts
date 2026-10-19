import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {formedVehiclePanel,panelSamples} from './formed-vehicle-panel';
import {classicWindowFrame} from './classic-window-frame';
import {addRoadWheels} from './road-wheels';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),mix=T.MathUtils.lerp,clamp=T.MathUtils.clamp;
/** Original 1960s long-wheelbase funeral coach: long bonnet over a V8, a tall
 * rear compartment with side glass and tied-back drapes, vinyl landau quarters
 * with chrome S-bars, a big chrome grille and bumpers, small tailfins with
 * vertical lamps, whitewall tyres and a top-hinged tailgate. Rear-wheel drive.
 * Nose +Z. */
export function buildRavenhillAsset(){
 const root=new T.Group();root.name='RavenhillHearse';
 const mat=(name:string,color:number,roughness=.6,metalness=.15)=>new T.MeshPhysicalMaterial({name,color,roughness,metalness});
 const paint=mat('paint_Ravenhill',0x15171a,.28,.18);paint.clearcoat=.95;
 const chrome=mat('Ravenhill Chrome',0xe4e7e9,.1,1),steel=mat('Structure Ravenhill Steel',0x383f45,.66,.65),rubber=mat('Ravenhill Rubber',0x141617,.9),landau=mat('Ravenhill Landau Vinyl',0x1b1c1e,.78,.05),cloth=mat('Interior Ravenhill Upholstery',0x2a2b2e,.8),dash=mat('Interior Ravenhill Dash',0x1d1f22,.6),curtain=mat('Interior Ravenhill Curtain',0x8a8490,.92),valance=mat('Interior Ravenhill Valance',0x4d4356,.9),deck=mat('Interior Ravenhill Deck Carpet',0x3a3036,.95),glass=mat('Ravenhill Glass',0x3e5560,.06,.1),white=mat('Ravenhill Lens',0xf3efe2,.18),red=mat('Ravenhill Tail Lens',0xb0141f,.22),amber=mat('Ravenhill Amber Lens',0xe08d22,.25),plate=mat('Ravenhill Plate',0xe9e7df,.6),ivory=mat('Interior Ravenhill Ivory',0xeee6d2,.4),whitewall=mat('Tyre Ravenhill Whitewall',0xeeeae0,.62);
 glass.transparent=true;glass.opacity=.42;glass.depthWrite=false;
 const add=(name:string,g:T.BufferGeometry,m:T.Material)=>{if(g.index)g=g.toNonIndexed();const o=new T.Mesh(g,m);o.name=name;o.castShadow=o.receiveShadow=true;root.add(o);return o;};
 const box=(name:string,x:number,y:number,z:number,w:number,h:number,d:number,m:T.Material)=>{const o=add(name,new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);return o;};
 const panel=(name:string,nu:number,nv:number,map:(u:number,t:number)=>T.Vector3,n:T.Vector3,m:T.Material=paint,depth=.02)=>add(name,formedVehiclePanel(panelSamples(nu),panelSamples(nv),map,n,depth),m);
 const bar=(name:string,a:T.Vector3,b:T.Vector3,r:number,m:T.Material)=>{const o=add(name,new T.CylinderGeometry(r,r,a.distanceTo(b),8),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(v(0,1,0),b.clone().sub(a).normalize());return o;};
 const tube=(name:string,points:T.Vector3[],r:number,m:T.Material,closed=false,segments=Math.max(8,points.length+2))=>add(name,new T.TubeGeometry(new T.CatmullRomCurve3(points,closed),segments,r,6,closed),m);
 const disc=(name:string,r:number,depth:number,m:T.Material,p:T.Vector3,axis=v(0,0,1),radial=20)=>{const o=add(name,new T.CylinderGeometry(r,r,depth,radial),m);o.position.copy(p);o.quaternion.setFromUnitVectors(v(0,1,0),axis);return o;};
 const window=(name:string,c:T.Vector3[],side:number,frame:T.Material=paint)=>{const f=classicWindowFrame(c,side);add('panel_'+name+'Frame',f.frame,frame);add('panel_'+name+'Seal',f.seal,rubber);add('glass_'+name,f.glass,glass).castShadow=false;};
 const merged=(name:string,parts:T.BufferGeometry[],m:T.Material)=>{const g=mergeGeometries(parts.map(p=>{const flat=p.index?p.toNonIndexed():p;if(flat!==p)p.dispose();return flat;}))!;parts.forEach(p=>p.dispose());return add(name,g,m);};
 const slab=(x:number,y:number,z:number,w:number,h:number,d:number)=>new T.BoxGeometry(w,h,d).translate(x,y,z);
 // Long low body: level waist, bonnet falling gently to the nose, sills tucked under.
 const BELT=.995,ROOF=1.52,RW=.84,END=2.90,AXLE=1.8;
 const SH=(z:number)=>z>1.15?.99-.05*((z-1.15)/1.75)**2:.99;
 const width=(y:number,z:number)=>.975-.045*clamp((y-.78)/.21,0,1)**1.6-.02*(Math.abs(z)/END)**10-.035*clamp((.52-y)/.14,0,1)**2;
 const arch=(z:number)=>{const d=Math.min(Math.abs(z-AXLE),Math.abs(z+AXLE));return d<.47?Math.max(.38,.39+Math.sqrt(.47**2-d*d)):.38;};
 // The glasshouse sides lean in from the waist to the roof rail.
 const side=(s:number,z:number,y:number)=>v(s*mix(width(BELT,z)-.012,RW,(y-BELT)/(ROOF-BELT)),y,z);
 const belt=(z:number,s:number)=>side(s,z,BELT),top=(z:number,s:number)=>side(s,z,ROOF);
 // Tailgate: nearly upright glass over a lower skin that kicks back to the bumper.
 const zt=(y:number)=>y>=BELT?-2.62-.13*(ROOF-y)/(ROOF-BELT):-2.75-.12*(BELT-y)/(BELT-.62);
 const tg=(s:number,y:number)=>y>=BELT?side(s,zt(y),y):v(s*(width(y,zt(y))-.015),y,zt(y));
 for(const s of [-1,1]){
  const suffix=s<0?'L':'R';
  for(const [name,a,b,nu]of [['RearQuarter',-END,-.62,26],['BodyDoor',-.62,1.08,10],['FrontWing',1.08,END,20]]as const){
   const stem='panel_'+name+suffix+'Ravenhill';
   panel(stem,nu,6,(u,t)=>{const z=mix(a,b,u),y=mix(arch(z),SH(z),t);return v(s*width(y,z),y,z);},v(s,0,0));
   if(name==='BodyDoor'){box(stem+'Handle',s*(width(.90,-.42)+.012),.90,-.42,.03,.035,.2,chrome);box(stem+'InnerCard',s*(width(.72,.2)-.05),.72,.23,.03,.42,b-a-.12,cloth);}
  }
  // Chrome brightwork: waist moulding, flank spear above the arches and rocker strip.
  tube('panel_RavenhillBeltTrim'+suffix,Array.from({length:24},(_,i)=>{const z=mix(2.86,-2.88,i/23);return v(s*(width(SH(z),z)+.006),SH(z)+.004,z);}),.008,chrome,false,20);
  tube('panel_RavenhillSpear'+suffix,Array.from({length:20},(_,i)=>{const z=mix(2.70,-2.78,i/19);return v(s*(width(.885,z)+.008),.885,z);}),.011,chrome,false,16);
  box('panel_RavenhillRocker'+suffix,s*(width(.44,0)+.006),.44,0,.03,.07,2.6,chrome);
  // Front door glass, B pillar and the tall coach window with drapes behind it.
  window('BodyDoor'+suffix+'Ravenhill',[belt(1.04,s),belt(-.48,s),top(-.48,s),top(.50,s)],s,chrome);
  window('Coach'+suffix+'Ravenhill',[belt(-.66,s),belt(-1.80,s),top(-1.80,s),top(-.66,s)],s,chrome);
  const pillar=(name:string,a0:T.Vector3,a1:T.Vector3,b0:T.Vector3,b1:T.Vector3,m:T.Material=paint,nu=4)=>panel(name,nu,8,(u,t)=>a0.clone().lerp(a1,t).lerp(b0.clone().lerp(b1,t),u),v(s,.3,0),m,.016);
  pillar('panel_RavenhillAPillar'+suffix,belt(1.15,s),top(.55,s),belt(1.04,s),top(.50,s));
  pillar('panel_RavenhillBPillar'+suffix,belt(-.48,s),top(-.48,s),belt(-.66,s),top(-.66,s));
  // Padded landau quarter with its chrome S-bar.
  const landauAt=(u:number,t:number,lift=0)=>{const p=belt(-1.80,s).lerp(top(-1.80,s),t).lerp(belt(-2.75,s).lerp(top(-2.62,s),t),u);p.x+=s*lift;return p;};
  pillar('panel_RearQuarter'+suffix+'RavenhillLandau',belt(-1.80,s),top(-1.80,s),belt(-2.75,s),top(-2.62,s),landau,10);
  const sbar=[[.10,.80],[.24,.78],[.38,.70],[.50,.55],[.62,.40],[.76,.32],[.90,.30]].map(([u,t])=>landauAt(u,t,.022));
  tube('panel_RavenhillLandauBar'+suffix,sbar,.014,chrome,false,18);
  for(const end of [sbar[0],sbar.at(-1)!]){const knob=add('panel_RavenhillLandauBarEnd'+suffix+end.z.toFixed(2),new T.SphereGeometry(.026,8,6),chrome);knob.position.copy(end);}
  // Drapes: two pleated curtains tied back to the window posts, under a swagged valance.
  const inner=(z:number,y:number,depth:number)=>{const p=side(s,z,y);p.x-=s*depth;return p;};
  for(const [i,[z0,dir]]of ([[-.71,-1],[-1.75,1]]as const).entries()){
   panel('Interior Ravenhill Curtain'+suffix+i,22,6,(u,t)=>{const y=mix(1.02,1.40,t),w=.53*(t>=.38?.32+.68*((t-.38)/.62)**1.3:.32+.16*(.38-t)/.38),z=z0+dir*u*w,p=inner(z,y,.06);p.x-=s*.014*Math.sin(u*Math.PI*12);return p;},v(s,0,0),curtain,.006);
   const tie=add('Interior Ravenhill CurtainTie'+suffix+i,new T.TorusGeometry(.03,.006,6,14),ivory);tie.position.copy(inner(z0+dir*.07,1.165,.06));tie.rotation.y=Math.PI/2;
  }
  panel('Interior Ravenhill Valance'+suffix,20,2,(u,t)=>{const z=mix(-.70,-1.76,u),bottom=1.36-.035*Math.abs(Math.sin(u*Math.PI*4)),p=inner(z,mix(bottom,1.48,t),.05);p.x-=s*.008*Math.sin(u*Math.PI*24);return p;},v(s,0,0),valance,.006);
  // Small fins over the rear quarters, finished with tall tail lamps.
  const finTop=(z:number)=>.99+.13*clamp((-2.0-z)/.93,0,1)**1.5;
  panel('panel_RavenhillFin'+suffix,12,3,(u,t)=>{const z=mix(-2.0,-2.93,u),y=mix(.96,finTop(z),t);return v(s*(width(BELT,z)+.004),y,z);},v(s,0,0),paint,.022);
  tube('panel_RavenhillFinCap'+suffix,Array.from({length:10},(_,i)=>{const z=mix(-2.2,-2.92,i/9);return v(s*(width(BELT,z)-.007),finTop(z)+.004,z);}),.008,chrome);
  const lamp=add('panel_RavenhillRearLamp'+suffix,new T.CylinderGeometry(.032,.032,.27,12),red);lamp.position.set(s*(width(BELT,-2.93)-.006),.96,-2.935);lamp.scale.set(1,1,.7);
  box('panel_RavenhillRearLampBezel'+suffix,s*(width(BELT,-2.93)-.006),.96,-2.925,.075,.30,.03,chrome);
  for(const z of [-.62,1.08])bar('panel_RavenhillDoorSeam'+suffix+z,v(s*width(.40,z),.40,z),v(s*width(SH(z),z),SH(z),z),.003,rubber);
  bar('panel_BodyDoor'+suffix+'RavenhillMirrorArm',v(s*.93,1.02,.92),v(s*1.02,1.06,.90),.012,chrome);
  const mirror=add('panel_BodyDoor'+suffix+'RavenhillMirror',new T.SphereGeometry(.06,12,8),chrome);mirror.position.set(s*1.04,1.08,.89);mirror.scale.set(1,.8,1.3);
  tube('panel_RavenhillDripRail'+suffix,[v(s*(RW+.006),ROOF+.004,.55),v(s*(RW+.006),ROOF+.006,-1.0),v(s*(RW+.006),ROOF+.004,-2.61)],.008,chrome);
  for(const z of [-AXLE,AXLE]){
   panel('Structure Ravenhill wheelhouse '+suffix+z,14,3,(u,t)=>v(s*mix(.62,.96,t),.39+Math.sin(u*Math.PI)*.46,z+Math.cos(u*Math.PI)*.46),v(0,1,0),steel,.016);
   const points=Array.from({length:25},(_,i)=>{const a=mix(.1,Math.PI-.1,i/24),y=.39+Math.sin(a)*.475,zz=z+Math.cos(a)*.475;return v(s*(width(y,zz)+.008),y,zz);});
   tube('panel_RavenhillArchTrim'+suffix+z,points,.011,chrome,false,16);
  }
 }
 // Long bonnet, raked windscreen, flat roof over the coach and the tailgate.
 panel('panel_hoodRavenhill',10,14,(u,t)=>{const z=mix(1.15,END-.02,t),w=width(SH(z),z)-.02,x=(u*2-1)*w;return v(x,SH(z)+.018*(1-(x/w)**2)+.006,z);},v(0,1,0));
 const ornament=add('panel_RavenhillHoodOrnament',new T.ConeGeometry(.026,.22,10),chrome);ornament.rotation.x=Math.PI/2;ornament.position.set(0,SH(2.6)+.05,2.62);
 bar('panel_RavenhillHoodSpear',v(0,SH(2.45)+.03,2.45),v(0,SH(1.5)+.03,1.5),.008,chrome);
 window('FrontRavenhill',[belt(1.15,-1),belt(1.15,1),top(.55,1),top(.55,-1)],1,chrome);
 panel('panel_RoofRavenhill',8,10,(u,t)=>{const x=(u*2-1)*RW;return v(x,ROOF+.025*(1-(x/RW)**2),mix(-2.62,.55,t));},v(0,1,0));
 panel('panel_TailgateRavenhill',12,6,(u,t)=>{const y=mix(.62,1.035,t),p=tg(u*2-1,y),w=Math.abs(tg(1,y).x);p.z-=.02*(1-(p.x/w)**2);return p;},v(0,0,-1));
 window('TailgateRavenhill',[tg(-1,1.035),tg(1,1.035),tg(1,ROOF),tg(-1,ROOF)],-1,chrome);
 box('panel_TailgateRavenhillHandle',0,.90,zt(.90)-.035,.30,.035,.03,chrome);
 box('panel_TailgateRavenhillPlate',0,.74,zt(.74)-.03,.32,.11,.012,plate);box('panel_TailgateRavenhillPlateLamp',0,.81,zt(.81)-.036,.10,.02,.03,chrome);
 panel('Interior Ravenhill RearValance',18,2,(u,t)=>{const y=mix(1.40-.03*Math.abs(Math.sin(u*Math.PI*3)),1.49,t),p=tg(u*2-1,y);p.x*=.92;p.z+=.06;return p;},v(0,0,-1),valance,.006);
 panel('panel_RavenhillRearPanel',10,3,(u,t)=>{const y=mix(.44,.63,t),w=width(y,-END)-.01,x=(u*2-1)*w;return v(x,y,-END+.01-.015*(1-(x/w)**2));},v(0,0,-1));
 // Full-width front: chrome egg-crate grille, twin lamps each side, heavy bumpers.
 panel('panel_RavenhillFrontValance',12,4,(u,t)=>{const y=mix(.46,SH(END),t),w=width(y,END),x=(u*2-1)*w;return v(x,y,END+.02*(1-(x/w)**2));},v(0,0,1));
 box('panel_RavenhillGrille',0,.70,END+.022,1.04,.32,.02,rubber);
 merged('panel_RavenhillGrilleBars',[...Array.from({length:6},(_,i)=>slab(0,.565+i*.054,END+.036,1.02,.014,.012)),...Array.from({length:15},(_,i)=>slab((i-7)*.068,.70,END+.034,.012,.30,.014))],chrome);
 tube('panel_RavenhillGrilleSurround',[v(-.53,.535,END+.04),v(.53,.535,END+.04),v(.55,.70,END+.04),v(.53,.865,END+.04),v(-.53,.865,END+.04),v(-.55,.70,END+.04)],.016,chrome,true,36);
 disc('panel_RavenhillCrest',.04,.014,chrome,v(0,.90,END+.035));
 for(const s of [-1,1]){
  box('panel_RavenhillLampPanel'+s,s*.72,.80,END+.02,.34,.16,.02,rubber);
  for(const x of [.63,.81]){disc('panel_RavenhillHeadlight'+s+':'+x,.066,.03,white,v(s*x,.80,END+.03));const bezel=add('panel_RavenhillHeadlightBezel'+s+':'+x,new T.TorusGeometry(.072,.013,6,18),chrome);bezel.position.set(s*x,.80,END+.045);}
  box('panel_RavenhillFrontIndicator'+s,s*.72,.655,END+.03,.18,.05,.02,amber);
  bar('panel_RavenhillWiper'+s,v(s*.46,1.005,1.12),v(s*.18,1.10,.90),.007,rubber);
 }
 for(const sign of [-1,1]){
  const name=sign===1?'front':'rear';
  panel('panel_bumper_'+name+'Ravenhill',20,4,(u,t)=>{const x=(u*2-1)*.975;return v(x,mix(.34,.54,t),sign*(2.97-.22*Math.abs(x/.975)**5+.02*Math.sin(t*Math.PI)));},v(0,0,sign),chrome,.04);
  for(const s of [-1,1]){box('panel_bumper_'+name+'RavenhillOverrider'+s,s*.40,.50,sign*2.99,.07,.26,.06,chrome);box('Structure Ravenhill bumper mount '+name+s,s*.6,.45,sign*2.82,.1,.09,.3,steel);}
 }
 // Cabin: front bench, dash and partition; the coach carries a carpeted deck on chrome rollers.
 box('Interior Ravenhill FrontBench',0,.60,.06,1.6,.17,.58,cloth);const back=box('Interior Ravenhill FrontBenchBack',0,.88,-.26,1.6,.5,.14,cloth);back.rotation.x=-.12;
 box('Interior Ravenhill Partition',0,.90,-.60,1.66,.56,.05,cloth);
 box('Interior Ravenhill Dashboard',0,.93,.92,1.72,.16,.34,dash);box('Interior Ravenhill DashChrome',0,.96,.745,1.6,.03,.02,chrome);
 const wheel=add('Interior SteeringWheel Ravenhill',new T.TorusGeometry(.2,.014,8,28),ivory);wheel.position.set(-.42,1.0,.56);wheel.rotation.x=.42;
 for(const s of [-1,1])bar('Interior Ravenhill SteeringSpoke'+s,v(-.42,1.0,.56),v(-.42+s*.19,1.0,.56),.011,chrome);
 bar('Interior Ravenhill SteeringColumn',v(-.42,1.0,.56),v(-.42,.86,.86),.018,dash);
 box('Interior Ravenhill CasketDeck',0,.62,-1.72,1.40,.04,2.1,deck);
 for(const s of [-1,1]){box('Interior Ravenhill DeckRail'+s,s*.45,.66,-1.72,.04,.04,2.0,chrome);for(let i=0;i<6;i++)disc('Interior Ravenhill DeckRoller'+s+i,.02,.10,chrome,v(s*.30,.66,-.85-i*.34),v(1,0,0),8);}
 // Structure: full-length frame, floor, V8, radiator, exhaust and fuel tank.
 for(const s of [-1,1])box('Structure Ravenhill frame rail'+s,s*.58,.34,0,.1,.1,5.4,steel);
 box('Structure Ravenhill floor',0,.42,-.4,1.76,.04,4.2,steel);
 box('Structure Ravenhill V8 block',0,.66,2.05,.62,.42,.86,steel);for(const s of [-1,1])box('Structure Ravenhill valve cover'+s,s*.2,.89,2.05,.16,.07,.78,chrome);
 const filter=add('Structure Ravenhill air cleaner',new T.CylinderGeometry(.22,.22,.08,20),chrome);filter.position.set(0,.915,2.05);
 box('Structure Ravenhill radiator',0,.66,2.74,1.1,.42,.05,steel);
 bar('Structure Ravenhill exhaust',v(-.36,.28,1.5),v(-.56,.28,-2.88),.035,steel);
 box('Structure Ravenhill fuel tank',0,.40,-2.45,.9,.2,.42,steel);
 addRoadWheels(root,'marten');for(const [i,name]of ['FL','FR','RL','RR'].entries()){const w=root.getObjectByName('wheel_'+name)!;w.position.set((i%2?1:-1)*.80,.39,(i<2?1:-1)*AXLE);w.scale.setScalar(.38/.32);
  // Whitewall band on the outer sidewall: rubber, so it flexes with the tyre and is not counted as rim metal.
  const band=new T.Mesh(new T.TorusGeometry(.215,.03,6,28).toNonIndexed(),whitewall);band.name='Tyre Ravenhill whitewall '+name;band.rotation.y=Math.PI/2;band.position.x=(i%2?1:-1)*.07;band.castShadow=true;w.add(band);}
 root.updateMatrixWorld(true);return root;
}
