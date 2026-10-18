import * as T from 'three';
import {formedVehiclePanel,panelSamples} from './formed-vehicle-panel';
import {classicWindowFrame} from './classic-window-frame';
import {addRoadWheels} from './road-wheels';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),mix=T.MathUtils.lerp,clamp=T.MathUtils.clamp;
/** Original late-1950s American two-door hardtop: tailfins with bullet lamps,
 * wraparound glass, chrome bumpers, two-tone paint, V8, rear-wheel drive. Nose +Z. */
export function buildStarfinAsset(){
 const root=new T.Group();root.name='Starfin58';
 const mat=(name:string,color:number,roughness=.6,metalness=.15)=>new T.MeshPhysicalMaterial({name,color,roughness,metalness});
 const paint=mat('paint_Starfin',0x2f9a96,.3,.16);paint.clearcoat=.9;
 const roofPaint=mat('Starfin Ivory',0xeee7d6,.32,.1);roofPaint.clearcoat=.85;
 const chrome=mat('Starfin Chrome',0xe3e6e8,.12,1),steel=mat('Structure Starfin Steel',0x383f45,.66,.65),rubber=mat('Starfin Rubber',0x16191c,.88),cloth=mat('Interior Starfin Vinyl',0xe2d9c6,.7),vinyl=mat('Interior Starfin Dash',0x2a6e6b,.6),glass=mat('Starfin Glass',0x3e5560,.06,.1),white=mat('Starfin Lens',0xf3efe2,.18),red=mat('Starfin Tail Lens',0xb0141f,.22),amber=mat('Starfin Amber Lens',0xe08d22,.25);
 glass.transparent=true;glass.opacity=.42;glass.depthWrite=false;
 const add=(name:string,g:T.BufferGeometry,m:T.Material)=>{if(g.index)g=g.toNonIndexed();const o=new T.Mesh(g,m);o.name=name;o.castShadow=o.receiveShadow=true;root.add(o);return o;};
 const box=(name:string,x:number,y:number,z:number,w:number,h:number,d:number,m:T.Material)=>{const o=add(name,new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);return o;};
 const panel=(name:string,nu:number,nv:number,map:(u:number,t:number)=>T.Vector3,n:T.Vector3,m:T.Material=paint,depth=.02)=>add(name,formedVehiclePanel(panelSamples(nu),panelSamples(nv),map,n,depth),m);
 const bar=(name:string,a:T.Vector3,b:T.Vector3,r:number,m:T.Material)=>{const o=add(name,new T.CylinderGeometry(r,r,a.distanceTo(b),8),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(v(0,1,0),b.clone().sub(a).normalize());return o;};
 const window=(name:string,c:T.Vector3[],side:number,frame:T.Material=paint)=>{const f=classicWindowFrame(c,side);add('panel_'+name+'Frame',f.frame,frame);add('panel_'+name+'Seal',f.seal,rubber);add('glass_'+name,f.glass,glass).castShadow=false;};
 // Long flat shoulder that sweeps up into tailfins over the rear wheels.
 const shoulder=(z:number)=>z<-1.0?.96+.16*clamp((-1.0-z)/1.55,0,1)**1.6:.96;
 const width=(y:number,z:number)=>.96-.05*Math.max(0,y-.86)/.2-.05*(Math.abs(z)/2.64)**8;
 const arch=(z:number)=>{const d=Math.min(Math.abs(z-1.5),Math.abs(z+1.5));return d<.44?Math.max(.42,.38+Math.sqrt(.44**2-d*d)):.42;};
 for(const side of [-1,1]){
  const suffix=side<0?'L':'R';
  for(const [name,a,b]of [['RearQuarter',-2.62,-.55],['BodyDoor',-.55,.82],['FrontWing',.82,2.62]]as const){
   const stem='panel_'+name+suffix+'Starfin';
   panel(stem,24,8,(u,t)=>{const z=mix(a,b,u),y=mix(arch(z),shoulder(z),t);return v(side*width(y,z),y,z);},v(side,0,0));
   if(name==='BodyDoor'){box(stem+'Handle',side*.965,.86,a+.18,.03,.035,.2,chrome);box(stem+'InnerCard',side*.89,.72,(a+b)/2,.03,.42,b-a-.1,vinyl);}
  }
  // Chrome spear and two-tone flash along the flank, ending in a fin cove.
  bar('panel_StarfinSpear'+suffix,v(side*.972,.80,2.3),v(side*.972,.80,-1.3),.012,chrome);
  panel('panel_StarfinCove'+suffix,16,3,(u,t)=>{const z=mix(-2.4,-.9,u),y=mix(.66,.80,t);return v(side*(width(y,z)+.004),y,z);},v(side,0,0),roofPaint,.006);
  box('panel_StarfinRocker'+suffix,side*.96,.45,0,.04,.07,1.9,chrome);
  window('BodyDoor'+suffix+'Starfin',[v(side*.92,.975,.78),v(side*.92,.975,-.50),v(side*.76,1.33,-.52),v(side*.76,1.345,.08)],side,chrome);
  window('Quarter'+suffix+'Starfin',[v(side*.92,.98,-.58),v(side*.91,1.0,-1.18),v(side*.77,1.30,-.86),v(side*.76,1.335,-.60)],side,chrome);
  // Slim ivory C-pillar joining the quarter light to the wraparound rear glass.
  const qb=v(side*.91,1.0,-1.18),qt=v(side*.77,1.30,-.86),rb=v(side*.90,.99,-1.27),rt=v(side*.74,1.352,-.79);
  panel('panel_RearQuarter'+suffix+'StarfinPillar',4,8,(u,t)=>qb.clone().lerp(qt,t).lerp(rb.clone().lerp(rt,t),u),v(side,.3,-.4),roofPaint,.012);
  for(const z of [-.55,.82])bar('panel_StarfinDoorSeam'+suffix+z,v(side*width(.44,z),.44,z),v(side*width(shoulder(z),z),shoulder(z),z),.003,rubber);
  bar('panel_BodyDoor'+suffix+'StarfinMirrorArm',v(side*.93,1.0,.66),v(side*1.02,1.03,.64),.012,chrome);
  const mirror=add('panel_BodyDoor'+suffix+'StarfinMirror',new T.SphereGeometry(.06,12,8),chrome);mirror.position.set(side*1.04,1.05,.63);mirror.scale.set(1,.8,1.3);
  // Bullet tail lamps in the fins and fin tips.
  for(const y of [.98,1.06]){const lamp=add('panel_StarfinRearLamp'+side+':'+y,new T.SphereGeometry(.055,12,8),red);lamp.position.set(side*.86,y,-2.66);lamp.scale.set(1,1,1.6);}
  box('panel_StarfinFinCap'+side,side*.86,1.12,-2.42,.08,.02,.4,chrome);
  for(const z of [-1.5,1.5]){
   panel('Structure Starfin wheelhouse '+suffix+z,22,4,(u,t)=>v(side*mix(.62,.97,t),.38+Math.sin(u*Math.PI)*.44,z+Math.cos(u*Math.PI)*.44),v(0,1,0),steel,.016);
   const points=Array.from({length:25},(_,i)=>{const a=mix(.08,Math.PI-.08,i/24),y=.38+Math.sin(a)*.445,zz=z+Math.cos(a)*.445;return v(side*(width(y,zz)+.01),y,zz);});
   add('panel_StarfinArchTrim'+suffix+z,new T.TubeGeometry(new T.CatmullRomCurve3(points),24,.012,5,false),chrome);
  }
 }
 // Long flat bonnet with a jet-style ornament; ivory roof; deck lid between fins.
 panel('panel_hoodStarfin',18,22,(u,t)=>{const x=(u*2-1)*.90,z=mix(.82,2.6,t);return v(x,.975-.04*t+.015*(1-(x/.9)**2),z);},v(0,1,0));
 box('panel_StarfinHoodOrnament',0,.97,2.42,.04,.05,.26,chrome);bar('panel_StarfinHoodSpear',v(0,.99,2.3),v(0,.985,1.4),.008,chrome);
 window('FrontStarfin',[v(-.91,.975,.82),v(.91,.975,.82),v(.74,1.355,.10),v(-.74,1.355,.10)],1,chrome);
 panel('panel_RoofStarfin',16,12,(u,t)=>{const x=(u*2-1)*.75;return v(x,1.355+.03*(1-(x/.75)**2),mix(-.80,.10,t));},v(0,1,0),roofPaint);
 window('RearStarfin',[v(-.90,.99,-1.26),v(.90,.99,-1.26),v(.74,1.35,-.80),v(-.74,1.35,-.80)],-1,chrome);
 panel('panel_BootStarfin',18,10,(u,t)=>{const x=(u*2-1)*.78;return v(x,.985-.02*t,mix(-1.28,-2.58,t));},v(0,1,0));
 box('panel_BootStarfinBadge',0,.9,-2.67,.4,.05,.02,chrome);
 panel('panel_StarfinRearPanel',18,6,(u,t)=>{const x=(u*2-1)*.80;return v(x,mix(.56,.96,t),-2.63);},v(0,0,-1));
 // Heavy chrome bumpers with bullet guards; full-width grille and quad lamps.
 for(const sign of [-1,1]){
  const name=sign===1?'front':'rear';
  panel('panel_Starfin'+name+'Valance',18,6,(u,t)=>{const x=(u*2-1)*.90;return v(x,mix(.46,sign>0?.95:.56,t),sign*(2.62-.04*(x/.9)**6));},v(0,0,sign));
  panel('panel_bumper_'+name+'Starfin',24,5,(u,t)=>{const x=(u*2-1)*1.0;return v(x,mix(.36,.56,t),sign*(2.72-.16*(x/1.0)**6+.02*Math.sin(t*Math.PI)));},v(0,0,sign),chrome,.04);
  for(const side of [-1,1]){box('Structure Starfin bumper mount '+name+side,side*.6,.46,sign*2.52,.1,.09,.3,steel);if(sign>0){const guard=add('panel_bumper_frontStarfinGuard'+side,new T.ConeGeometry(.07,.2,12),chrome);guard.rotation.x=Math.PI/2;guard.position.set(side*.42,.52,2.82);}}
 }
 box('panel_StarfinGrille',0,.74,2.64,1.3,.2,.02,rubber);for(let i=-9;i<=9;i++)box('panel_StarfinGrilleBar'+i,i*.07,.74,2.652,.014,.18,.01,chrome);for(const y of [.66,.82])box('panel_StarfinGrilleRail'+y,0,y,2.656,1.34,.02,.012,chrome);
 for(const side of [-1,1]){
  for(const dx of [-.12,.12]){const lamp=add('panel_StarfinHeadlight'+side+':'+dx,new T.CylinderGeometry(.085,.085,.03,16),white);lamp.rotation.x=Math.PI/2;lamp.position.set(side*(.72+dx),.82,2.625);const ring=add('panel_StarfinHeadlightBezel'+side+':'+dx,new T.TorusGeometry(.088,.012,6,16),chrome);ring.position.set(side*(.72+dx),.82,2.64);}
  box('panel_StarfinFrontIndicator'+side,side*.72,.62,2.66,.14,.05,.02,amber);
  bar('panel_StarfinWiper'+side,v(side*.46,.99,.80),v(side*.2,1.1,.55),.007,rubber);
 }
 // Structure, bench-seat cabin and big V8.
 for(const side of [-1,1]){box('Structure Starfin frame rail'+side,side*.58,.34,0,.1,.1,4.8,steel);if(side===-1)bar('Structure Starfin exhaust',v(-.36,.28,1.0),v(-.56,.28,-2.7),.035,steel);}
 box('Structure Starfin floor',0,.42,-.3,1.76,.04,3.0,steel);
 box('Interior Starfin FrontBench',0,.60,-.25,1.6,.17,.6,cloth);const back=box('Interior Starfin FrontBenchBack',0,.88,-.55,1.6,.5,.14,cloth);back.rotation.x=-.12;
 box('Interior Starfin RearBench',0,.60,-1.05,1.56,.17,.5,cloth);box('Interior Starfin RearBenchBack',0,.85,-1.28,1.56,.42,.13,cloth);
 box('Interior Starfin Dashboard',0,.97,.56,1.7,.16,.34,vinyl);box('Interior Starfin DashChrome',0,1.0,.385,1.6,.03,.02,chrome);
 const wheel=add('Interior SteeringWheel Starfin',new T.TorusGeometry(.2,.014,8,28),white);wheel.position.set(-.42,1.0,.24);wheel.rotation.x=.42;
 for(const side of [-1,1])bar('Interior Starfin SteeringSpoke'+side,v(-.42,1.0,.24),v(-.42+side*.19,1.0,.24),.011,chrome);
 box('Structure Starfin V8 block',0,.66,1.7,.6,.42,.86,steel);for(const side of [-1,1])box('Structure Starfin valve cover'+side,side*.2,.9,1.7,.16,.08,.78,chrome);
 const filter=add('Structure Starfin air cleaner',new T.CylinderGeometry(.22,.22,.08,20),chrome);filter.position.set(0,.98,1.7);
 box('Structure Starfin radiator',0,.66,2.4,1.1,.42,.05,steel);
 addRoadWheels(root,'marten');for(const [i,name]of ['FL','FR','RL','RR'].entries()){const w=root.getObjectByName('wheel_'+name)!;w.position.set((i%2?1:-1)*.80,.39,(i<2?1:-1)*1.5);w.scale.setScalar(.38/.32);
  // Whitewall band on the outer sidewall.
  const band=new T.Mesh(new T.TorusGeometry(.215,.03,8,32).toNonIndexed(),white);band.name='Tyre Starfin whitewall '+name;band.rotation.y=Math.PI/2;band.position.x=(i%2?1:-1)*.07;band.castShadow=true;w.add(band);}
 root.updateMatrixWorld(true);return root;
}
