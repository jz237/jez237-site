import * as T from 'three';
import {formedVehiclePanel,panelSamples} from './formed-vehicle-panel';
import {classicWindowFrame} from './classic-window-frame';
import {buildCompactAsset} from './compact-asset';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),mix=T.MathUtils.lerp;
/** Original three-door 1980s four-wheel-drive wagon. Metres, +Z nose. */
export function buildTrailAsset(){
 const root=new T.Group();root.name='BirchTrail4x4';
 const mat=(name:string,color:number,roughness=.6,metalness=.15)=>new T.MeshPhysicalMaterial({name,color,roughness,metalness});
 const paint=mat('paint_Trail',0x827648,.4,.18);paint.clearcoat=.7;
 const steel=mat('Structure Trail Steel',0x343d3c,.7,.6),rubber=mat('Trail Rubber',0x242927,.9),chrome=mat('Trail Chrome',0xa4aaa4,.3,.75),cloth=mat('Interior Trail Cloth',0x726f57,.95),vinyl=mat('Interior Trail Vinyl',0x393e37,.9),glass=mat('Trail Glass',0x3d5b61,.1,.1),white=mat('Trail Headlight',0xe2dbc2,.25),red=mat('Trail Brakelight',0x9d251b,.24),amber=mat('Trail Indicator',0xc98a23,.3);
 glass.transparent=true;glass.opacity=.48;glass.depthWrite=false;
 const add=(name:string,g:T.BufferGeometry,m:T.Material)=>{if(g.index)g=g.toNonIndexed();const o=new T.Mesh(g,m);o.name=name;o.castShadow=o.receiveShadow=true;root.add(o);return o;};
 const box=(name:string,x:number,y:number,z:number,w:number,h:number,d:number,m:T.Material)=>{const o=add(name,new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);return o;};
 const panel=(name:string,nu:number,nv:number,map:(u:number,t:number)=>T.Vector3,n:T.Vector3,m:T.Material=paint,depth=.025)=>add(name,formedVehiclePanel(panelSamples(nu),panelSamples(nv),map,n,depth),m);
 const bar=(name:string,a:T.Vector3,b:T.Vector3,r:number,m:T.Material)=>{const o=add(name,new T.CylinderGeometry(r,r,a.distanceTo(b),8),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(v(0,1,0),b.clone().sub(a).normalize());return o;};
 const window=(name:string,c:T.Vector3[],side:number)=>{const f=classicWindowFrame(c,side);add('panel_'+name+'Frame',f.frame,paint);add('panel_'+name+'Seal',f.seal,rubber);add('glass_'+name,f.glass,glass).castShadow=false;};
 const sideX=(y:number)=>.955-.030*((y-.90)/.45)**2;
 const archY=(z:number)=>{const d=Math.min(Math.abs(z-1.35),Math.abs(z+1.35));return d<.485?Math.max(.52,.43+Math.sqrt(.485**2-d*d)):.52;};
 for(const side of [-1,1]){
  const suffix=side<0?'L':'R';
  for(const [name,a,b]of [['RearQuarter',-2.20,-.52],['BodyDoor',-.52,.96],['FrontWing',.96,2.20]]as const){
   const stem='panel_'+name+suffix+'Trail';
   panel(stem,15,5,(u,t)=>{const z=mix(a,b,u),y=mix(archY(z),1.18,t);return v(side*sideX(y),y,z);},v(side,0,0));
   if(name==='BodyDoor'){box(stem+'Handle',side*.958,1.09,-.34,.035,.04,.16,chrome);box(stem+'InnerCard',side*.88,.91,.19,.035,.45,1.37,vinyl);}
  }
  window('BodyDoor'+suffix+'Trail',[v(side*.942,1.18,.96),v(side*.942,1.18,-.50),v(side*.823,1.88,-.50),v(side*.823,1.88,.54)],side);
  window('Quarter'+suffix+'Trail',[v(side*.942,1.18,-.56),v(side*.942,1.18,-2.20),v(side*.823,1.88,-2.07),v(side*.823,1.88,-.56)],side);
  bar('Structure Trail B pillar '+suffix,v(side*.90,.57,-.53),v(side*.80,1.88,-.53),.034,steel);
  panel('panel_RoofShoulderTrail'+suffix,5,24,(u,t)=>{const a=u*Math.PI/2;return v(side*(.70+.123*Math.cos(a)),1.88+.105*Math.sin(a),mix(-2.07,.54,t));},v(side,1,0).normalize());
  panel('panel_HoodShoulderTrail'+suffix,5,14,(u,t)=>v(side*mix(sideX(1.18),.78,u),1.18+.045*Math.sin(u*Math.PI/2),mix(.96,2.20,t)),v(side,1,0).normalize());
  for(const z of [-1.35,1.35]){
   panel('Structure Trail wheelhouse '+suffix+z,20,3,(u,t)=>v(side*mix(.65,.955,t),.43+Math.sin(u*Math.PI)*.49,z+Math.cos(u*Math.PI)*.49),v(0,1,0),steel,.018);
   const points=Array.from({length:25},(_,i)=>{const a=mix(.16,Math.PI-.16,i/24),y=.43+Math.sin(a)*.494;return v(side*(sideX(y)+.012),y,z+Math.cos(a)*.494);});
   add('panel_TrailArch'+suffix+z,new T.TubeGeometry(new T.CatmullRomCurve3(points),24,.026,6,false),rubber);
  }
  box('panel_TrailSill'+suffix,side*.95,.54,.04,.09,.09,1.65,rubber);
  box('panel_TrailWaistTrim'+suffix,side*.956,1.10,-.02,.022,.045,4.34,rubber);
  for(const z of [-.52,.96])bar('panel_TrailDoorSeam'+suffix+z,v(side*.945,archY(z),z),v(side*.945,1.18,z),.004,rubber);
  bar('panel_BodyDoor'+suffix+'TrailMirrorArm',v(side*.94,1.24,.68),v(side*1.08,1.31,.70),.015,steel);
  box('panel_BodyDoor'+suffix+'TrailMirror',side*1.10,1.33,.68,.06,.15,.19,rubber);
  box('Structure Trail frame rail '+suffix,side*.59,.43,0,.14,.19,4.20,steel);
  box('panel_TrailRoofRail'+suffix,side*.70,2.04,-.73,.035,.07,2.18,steel);
  for(const z of [-1.72,.24])box('panel_TrailRoofRailMount'+suffix+z,side*.70,1.995,z,.07,.07,.09,rubber);
 }
 panel('panel_hoodTrail',14,14,(u,t)=>{const x=(u*2-1)*.78;return v(x,1.225+.040*(1-(x/.78)**2)*Math.sin(t*Math.PI),mix(.96,2.20,t));},v(0,1,0));
 panel('panel_RoofTrail',12,18,(u,t)=>{const x=(u*2-1)*.70;return v(x,1.985+.028*(1-(x/.70)**2),mix(-2.07,.54,t));},v(0,1,0));
 window('FrontTrail',[v(-.942,1.18,.96),v(.942,1.18,.96),v(.823,1.88,.54),v(-.823,1.88,.54)],1);
 window('TailgateTrailRear',[v(.72,1.18,-2.20),v(-.72,1.18,-2.20),v(-.64,1.88,-2.07),v(.64,1.88,-2.07)],1);
 for(const side of [-1,1])panel('panel_TrailRearCorner'+side,3,7,(u,t)=>v(side*mix(mix(.72,.64,t),mix(.942,.823,t),u),mix(1.18,1.88,t),mix(-2.20,-2.07,t)),v(0,0,-1));
 for(const front of [true,false])panel('panel_Trail'+(front?'Front':'Rear')+'Header',14,3,(u,t)=>{const top=1.985+.028*(1-(u*2-1)**2);return v((u*2-1)*mix(.823,.70,t),mix(1.88,top,t),front?.54:-2.07);},v(0,.5,front?1:-1).normalize());
 for(const front of [true,false]){const sign=front?1:-1,name=front?'front':'rear';
  if(front)panel('panel_TrailfrontValance',14,7,(u,t)=>{const x=(u*2-1)*.942;return v(x,mix(.52,1.225,t),2.20+.018*(1-(x/.942)**2));},v(0,0,1));
  else{
   panel('panel_TailgateTrailSkin',10,4,(u,t)=>v((u*2-1)*.72,mix(.68,1.18,t),-2.20-.018*(1-(u*2-1)**2)*Math.sin(t*Math.PI)),v(0,0,-1));
   box('panel_TailgateTrailInner',0,.93,-2.175,1.39,.46,.025,vinyl);
   box('panel_TrailRearSill',0,.59,-2.20,1.89,.18,.035,paint);
   for(const side of [-1,1])panel('panel_TrailRearCornerLower'+side,2,4,(u,t)=>v(side*mix(.72,.942,u),mix(.68,1.18,t),-2.20),v(0,0,-1));
  }
  panel('panel_bumper_'+name+'Trail',18,4,(u,t)=>{const x=(u*2-1)*.985;return v(x,mix(.48,.68,t),sign*(2.31-.09*(x/.985)**4+.018*Math.sin(t*Math.PI)));},v(0,0,sign),rubber,.055);
  for(const side of [-1,1])box('Structure Trail bumper mount '+name+side,side*.62,.575,sign*2.17,.13,.10,.32,steel);
 }
 box('panel_TrailGrilleRecess',0,1.02,2.226,1.02,.30,.028,rubber);
 for(let i=-6;i<=6;i++)box('panel_TrailGrilleSlat'+i,i*.071,1.02,2.244,.024,.265,.018,steel);
 for(const side of [-1,1]){
  box('panel_TrailHeadlightBezel'+side,side*.745,1.02,2.226,.36,.28,.035,chrome);
  box('panel_TrailHeadlight'+side,side*.745,1.02,2.247,.31,.22,.018,white);
  box('panel_TrailFrontIndicator'+side,side*.76,.815,2.228,.23,.08,.025,amber);
  box('panel_TrailRearLampBase'+side,side*.82,.94,-2.225,.16,.37,.035,rubber);
  box('panel_TrailRearLamp'+side,side*.82,.93,-2.248,.12,.22,.018,red);
  box('panel_TrailRearIndicator'+side,side*.82,1.085,-2.248,.12,.075,.018,amber);
  bar('panel_TrailWiper'+side,v(side*.45,1.195,.952),v(side*.24,1.40,.83),.009,rubber);
 }
 box('panel_TailgateTrailHandle',0,1.09,-2.237,.25,.045,.035,chrome);
 box('Structure Trail floor',0,.63,-.51,1.78,.06,3.30,steel);box('Interior Trail load floor',0,.68,-1.47,1.70,.04,1.28,vinyl);
 for(const side of [-1,1]){const x=side*.47;box('Interior Trail front cushion '+side,x,.91,.20,.62,.15,.53,cloth);const back=box('Interior Trail front back '+side,x,1.22,-.06,.62,.58,.14,cloth);back.rotation.x=-.1;box('Interior Trail headrest '+side,x,1.58,-.10,.34,.18,.12,cloth);}
 box('Interior Trail rear bench',0,.94,-.91,1.55,.16,.53,cloth);box('Interior Trail rear back',0,1.20,-1.18,1.55,.53,.14,cloth);
 box('Interior Trail dash',0,1.20,.84,1.76,.21,.28,vinyl);box('Interior Trail instruments',-.47,1.28,.67,.42,.14,.03,rubber);
 const steering=add('Interior Trail steering wheel',new T.TorusGeometry(.18,.013,6,24),rubber);steering.position.set(-.47,1.20,.47);steering.rotation.x=-.35;
 bar('Structure Trail steering column',v(-.47,1.20,.47),v(-.47,.7,.90),.025,steel);
 box('Structure engine block Trail',0,.86,1.55,.54,.39,.67,steel);
 for(const side of [-1,1]){const cover=box('Structure engine valve cover Trail '+side,side*.25,1.04,1.55,.18,.14,.65,chrome);cover.rotation.z=side*.26;}
 box('Structure radiator Trail',0,.98,2.02,1.00,.45,.07,steel);
 bar('Structure Trail exhaust',v(.40,.38,1.30),v(.40,.38,-2.20),.028,steel);
 const donor=buildCompactAsset();for(const [i,name]of ['FL','FR','RL','RR'].entries()){const wheel=donor.getObjectByName('wheel_'+name)!;wheel.removeFromParent();wheel.position.set((i%2?1:-1)*.82,.43,(i<2?1:-1)*1.35);wheel.scale.setScalar(.42/.32);root.add(wheel);}
 donor.traverse(o=>{if(o instanceof T.Mesh)o.geometry.dispose();});root.updateMatrixWorld(true);return root;
}
