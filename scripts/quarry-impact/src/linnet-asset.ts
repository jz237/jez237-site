import * as T from 'three';
import {formedVehiclePanel,panelSamples} from './formed-vehicle-panel';
import {addRoadWheels} from './road-wheels';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),mix=T.MathUtils.lerp;
/** Original 1960s British two-seat roadster: open cockpit with a framed
 * windscreen, folded hood, round lamps, chrome bumpers, inline four, RWD. Nose +Z. */
export function buildLinnetAsset(){
 const root=new T.Group();root.name='Linnet1300';
 const mat=(name:string,color:number,roughness=.6,metalness=.15)=>new T.MeshPhysicalMaterial({name,color,roughness,metalness});
 const paint=mat('paint_Linnet',0x1f5a3a,.32,.15);paint.clearcoat=.85;
 const chrome=mat('Linnet Chrome',0xe2e5e7,.12,1),steel=mat('Structure Linnet Steel',0x383f45,.66,.65),rubber=mat('Linnet Rubber',0x161819,.9),leather=mat('Interior Linnet Leather',0x6e3524,.7),hood=mat('Linnet Hood Canvas',0x2b2a28,.95),wood=mat('Interior Linnet Walnut',0x5d3a22,.5),glass=mat('Linnet Glass',0x3f5560,.06,.1),white=mat('Linnet Lens',0xf3efe2,.18),red=mat('Linnet Tail Lens',0xae141e,.22),amber=mat('Linnet Amber Lens',0xe08d22,.25);
 glass.transparent=true;glass.opacity=.4;glass.depthWrite=false;
 const add=(name:string,g:T.BufferGeometry,m:T.Material)=>{if(g.index)g=g.toNonIndexed();const o=new T.Mesh(g,m);o.name=name;o.castShadow=o.receiveShadow=true;root.add(o);return o;};
 const box=(name:string,x:number,y:number,z:number,w:number,h:number,d:number,m:T.Material)=>{const o=add(name,new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);return o;};
 const panel=(name:string,nu:number,nv:number,map:(u:number,t:number)=>T.Vector3,n:T.Vector3,m:T.Material=paint,depth=.02)=>add(name,formedVehiclePanel(panelSamples(nu),panelSamples(nv),map,n,depth),m);
 const bar=(name:string,a:T.Vector3,b:T.Vector3,r:number,m:T.Material)=>{const o=add(name,new T.CylinderGeometry(r,r,a.distanceTo(b),8),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(v(0,1,0),b.clone().sub(a).normalize());return o;};
 // Rounded flanks with a waist dip at the cockpit and gentle rear fins.
 const shoulder=(z:number)=>{const dip=Math.exp(-(((z+.25)/.75)**4));return .86-.06*dip+.04*Math.max(0,(-z-1.3)/.6);};
 const width=(y:number,z:number)=>.78-.07*Math.max(0,y-.62)/.24-.10*(Math.abs(z)/1.95)**4;
 const arch=(z:number)=>{const d=Math.min(Math.abs(z-1.15),Math.abs(z+1.15));return d<.38?Math.max(.34,.32+Math.sqrt(.38**2-d*d)):.34;};
 for(const side of [-1,1]){
  const suffix=side<0?'L':'R';
  for(const [name,a,b]of [['RearQuarter',-1.94,-.72],['BodyDoor',-.72,.42],['FrontWing',.42,1.94]]as const){
   const stem='panel_'+name+suffix+'Linnet';
   panel(stem,24,8,(u,t)=>{const z=mix(a,b,u),y=mix(arch(z),shoulder(z),t);return v(side*width(y,z),y,z);},v(side,0,0));
   if(name==='BodyDoor'){box(stem+'Handle',side*.73,.76,a+.14,.03,.03,.14,chrome);box(stem+'InnerCard',side*.66,.6,(a+b)/2,.03,.32,b-a-.08,leather);}
  }
  box('panel_LinnetSill'+suffix,side*.74,.36,-.15,.04,.06,1.3,chrome);
  for(const z of [-.72,.42])bar('panel_LinnetDoorSeam'+suffix+z,v(side*width(.36,z),.36,z),v(side*width(shoulder(z),z),shoulder(z),z),.003,rubber);
  bar('panel_BodyDoor'+suffix+'LinnetMirrorArm',v(side*.7,.83,.35),v(side*.8,.9,.33),.01,chrome);
  const mirror=add('panel_BodyDoor'+suffix+'LinnetMirror',new T.SphereGeometry(.05,12,8),chrome);mirror.position.set(side*.82,.92,.32);mirror.scale.set(1,.8,1.2);
  const lampF=add('panel_LinnetHeadlight'+side,new T.CylinderGeometry(.085,.085,.03,18),white);lampF.rotation.x=Math.PI/2;lampF.position.set(side*.52,.72,1.86);
  const bezel=add('panel_LinnetHeadlightBezel'+side,new T.TorusGeometry(.088,.012,6,18),chrome);bezel.position.set(side*.52,.72,1.875);
  box('panel_LinnetFrontIndicator'+side,side*.62,.55,1.9,.07,.05,.03,amber);
  const tail=add('panel_LinnetRearLamp'+side,new T.CylinderGeometry(.05,.05,.03,14),red);tail.rotation.x=Math.PI/2;tail.position.set(side*.6,.78,-1.92);
  box('panel_LinnetRearIndicator'+side,side*.6,.68,-1.93,.06,.04,.02,amber);
  for(const z of [-1.15,1.15]){
   panel('Structure Linnet wheelhouse '+suffix+z,22,4,(u,t)=>v(side*mix(.5,.77,t),.32+Math.sin(u*Math.PI)*.38,z+Math.cos(u*Math.PI)*.38),v(0,1,0),steel,.016);
  }
 }
 // Long bonnet with a power bulge, short boot, cockpit tub and a folded hood.
 panel('panel_hoodLinnet',18,18,(u,t)=>{const x=(u*2-1)*.68,z=mix(.42,1.86,t);return v(x,mix(.86,.74,t*t)+.04*Math.exp(-((x/.2)**2))*(1-t),z);},v(0,1,0));
 panel('panel_BootLinnet',16,8,(u,t)=>{const x=(u*2-1)*.66;return v(x,mix(.87,.80,t*t),mix(-1.25,-1.9,t));},v(0,1,0));
 panel('panel_LinnetRearDeck',14,4,(u,t)=>{const x=(u*2-1)*.68;return v(x,.84,mix(-.95,-1.25,t));},v(0,1,0));
 panel('panel_LinnetScuttle',14,4,(u,t)=>{const x=(u*2-1)*.68;return v(x,.86,mix(.28,.42,t));},v(0,1,0));
 box('Interior Linnet CockpitRoll',0,.83,-.3,1.34,.04,1.3,rubber);
 // Framed windscreen with chrome posts, glass and a single wiper pair.
 for(const side of [-1,1])bar('panel_LinnetScreenPost'+side,v(side*.62,.86,.3),v(side*.58,1.18,.18),.018,chrome);
 bar('panel_LinnetScreenTop',v(-.58,1.18,.18),v(.58,1.18,.18),.016,chrome);
 const screen=add('glass_FrontLinnet',new T.PlaneGeometry(1.16,.33),glass);screen.position.set(0,1.02,.24);screen.rotation.x=-.35;screen.castShadow=false;
 for(const side of [-1,1])bar('panel_LinnetWiper'+side,v(side*.3,.88,.3),v(side*.1,.98,.27),.006,chrome);
 // Folded canvas hood behind the seats and two leather buckets.
 const folded=add('panel_LinnetFoldedHood',new T.CylinderGeometry(.12,.12,1.2,12),hood);folded.rotation.z=Math.PI/2;folded.position.set(0,.92,-.98);
 for(const side of [-1,1]){
  box('Interior Linnet SeatBase'+side,side*.3,.48,-.38,.44,.12,.46,leather);const back=box('Interior Linnet SeatBack'+side,side*.3,.72,-.64,.44,.46,.12,leather);back.rotation.x=-.18;
 }
 box('Interior Linnet Dashboard',0,.8,.22,1.28,.16,.14,wood);for(let i=-2;i<=2;i++){const d=add('Interior Linnet Dial'+i,new T.CylinderGeometry(.045,.045,.01,16),white);d.rotation.x=Math.PI/2;d.position.set(-.3+i*.12,.82,.148);}
 const wheel=add('Interior SteeringWheel Linnet',new T.TorusGeometry(.19,.012,8,28),wood);wheel.position.set(-.3,.84,.0);wheel.rotation.x=.5;
 for(const side of [-1,1])bar('Interior Linnet SteeringSpoke'+side,v(-.3,.84,0),v(-.3+side*.18,.84,0),.008,chrome);
 box('Interior Linnet Tunnel',0,.48,-.1,.24,.22,1.0,leather);bar('Interior Linnet GearLever',v(0,.6,-.05),v(0,.78,-.1),.011,chrome);
 // Chrome bumpers with overriders, a slatted grille mouth and a boot rack.
 for(const sign of [-1,1]){
  const name=sign===1?'front':'rear';
  panel('panel_Linnet'+name+'Valance',16,5,(u,t)=>{const x=(u*2-1)*.7;return v(x,mix(.38,sign>0?.74:.8,t),sign*(1.92-.1*(x/.7)**4));},v(0,0,sign));
  panel('panel_bumper_'+name+'Linnet',20,4,(u,t)=>{const x=(u*2-1)*.76;return v(x,mix(.42,.5,t),sign*(2.0-.18*(x/.76)**4));},v(0,0,sign),chrome,.03);
  for(const side of [-1,1]){box('panel_bumper_'+name+'LinnetOverrider'+side,side*.3,.5,sign*2.02,.05,.16,.06,chrome);box('Structure Linnet bumper mount '+name+side,side*.42,.42,sign*1.86,.07,.07,.2,steel);}
 }
 const mouth=add('panel_LinnetGrille',new T.CylinderGeometry(.2,.2,.02,20),rubber);mouth.rotation.x=Math.PI/2;mouth.scale.set(1.7,1,.7);mouth.position.set(0,.6,1.93);
 for(let i=-4;i<=4;i++)box('panel_LinnetGrilleSlat'+i,i*.07,.6,1.945,.012,.12,.01,chrome);
 for(const dx of [-.35,.35])bar('panel_BootLinnetRack'+dx,v(dx,.86,-1.35),v(dx,.84,-1.75),.01,chrome);bar('panel_BootLinnetRackBar',v(-.35,.88,-1.75),v(.35,.88,-1.75),.01,chrome);
 // Structure and the inline four under the bulge.
 for(const side of [-1,1]){box('Structure Linnet chassis rail'+side,side*.42,.3,0,.08,.08,3.5,steel);if(side===-1)bar('Structure Linnet exhaust',v(-.24,.24,.7),v(-.4,.24,-2.0),.025,chrome);}
 box('Structure Linnet floor',0,.35,-.35,1.3,.04,1.6,steel);
 box('Structure Linnet inline four',0,.56,1.15,.32,.32,.6,steel);box('Structure Linnet rocker cover',0,.76,1.15,.22,.06,.54,chrome);
 box('Structure Linnet radiator',0,.56,1.75,.8,.3,.04,steel);
 addRoadWheels(root,'marten');for(const [i,name]of ['FL','FR','RL','RR'].entries()){const w=root.getObjectByName('wheel_'+name)!;w.position.set((i%2?1:-1)*.66,.34,(i<2?1:-1)*1.15);}
 root.updateMatrixWorld(true);return root;
}
