import * as T from 'three';
import {formedVehiclePanel,panelSamples} from './formed-vehicle-panel';
import {classicWindowFrame} from './classic-window-frame';
import {buildCompactAsset} from './compact-asset';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),mix=T.MathUtils.lerp;
/** Original forward-control minibus. Metres, +Z nose; closed body skins and
 * a visible passenger cabin share the same chassis/wheel datum as physics. */
export function buildShuttleAsset(){
 const root=new T.Group();root.name='CalderShuttle';
 const mat=(name:string,color:number,roughness=.65,metalness=.1)=>new T.MeshPhysicalMaterial({name,color,roughness,metalness});
 const paint=mat('paint_Calder',0xc7a64d,.38,.12);paint.clearcoat=.8;
 const steel=mat('Structure Calder Steel',0x3f4544,.7,.6),rubber=mat('Calder Rubber',0x202523,.9),chrome=mat('Calder Wheel Brightwork',0xa2aaa4,.34,.8),cloth=mat('Interior Calder Seats',0x4d6155,.95),vinyl=mat('Interior Calder Floor',0x303631,.95),glass=mat('Calder Glass',0x395c62,.08,.08),white=mat('Calder Headlight',0xd7d4b4,.25),red=mat('Calder Brakelight',0x951d12,.2),amber=mat('Calder Indicator',0xc38618,.25);
 glass.transparent=true;glass.opacity=.48;glass.depthWrite=false;
 const add=(name:string,g:T.BufferGeometry,m:T.Material)=>{if(g.index)g=g.toNonIndexed();const mesh=new T.Mesh(g,m);mesh.name=name;mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);return mesh;};
 const box=(name:string,x:number,y:number,z:number,w:number,h:number,l:number,m:T.Material)=>{const o=add(name,new T.BoxGeometry(w,h,l),m);o.position.set(x,y,z);return o;};
 const panel=(name:string,nu:number,nv:number,map:(u:number,t:number)=>T.Vector3,n:T.Vector3,m:T.Material=paint,depth=.025)=>add(name,formedVehiclePanel(panelSamples(nu),panelSamples(nv),map,n,depth),m);
 const bar=(name:string,a:T.Vector3,b:T.Vector3,r:number,m:T.Material)=>{const o=add(name,new T.CylinderGeometry(r,r,a.distanceTo(b),8),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(v(0,1,0),b.clone().sub(a).normalize());return o;};
 const bodyX=(y:number)=>y<1.4?1.035+.018*Math.sin((y-.55)/.85*Math.PI):mix(1.035,.985,(y-1.4)/.94);
 const archY=(z:number)=>{const d=Math.min(Math.abs(z-1.9),Math.abs(z+1.9));return d<.50?Math.max(.55,.42+Math.sqrt(.50*.50-d*d)):.55;};
 const window=(name:string,corners:T.Vector3[],side:number)=>{const f=classicWindowFrame(corners,side);add('panel_'+name+'Frame',f.frame,paint);add('panel_'+name+'Seal',f.seal,rubber);add('glass_'+name,f.glass,glass).castShadow=false;};
 for(const side of [-1,1]){
  const suffix=side<0?'L':'R';
  // Separate side bays deform locally, with genuine wheel apertures below them.
  for(const [i,[a,b]]of [[-3.0,-2.35],[-2.35,-1.45],[-1.45,-.45],[-.45,.55],[.55,1.5],[1.5,2.45]].entries()){
   panel('panel_SideShuttle'+suffix+i,8,4,(u,t)=>{const z=mix(a,b,u),y=mix(archY(z),1.4,t);return v(side*bodyX(y),y,z);},v(side,0,0));
  }
  for(const [i,[a,b]]of [[-2.96,-1.88],[-1.86,-.78],[-.76,.32],[.34,1.40],[1.42,2.36]].entries()){
   window('PassengerShuttle'+suffix+i,[v(side*bodyX(1.4),1.4,b),v(side*bodyX(1.4),1.4,a),v(side*bodyX(2.34),2.34,a),v(side*bodyX(2.34),2.34,b)],side);
   bar('Structure cabin post Shuttle '+suffix+i,v(side*.997,1.36,a),v(side*.949,2.34,a),.025,steel);
  }
  window('BodyDoor'+suffix+'Shuttle',[v(side*1.035,1.4,2.98),v(side*1.035,1.4,2.38),v(side*.985,2.34,2.38),v(side*.985,2.34,2.72)],side);
  panel('panel_BodyDoor'+suffix+'Shuttle',6,4,(u,t)=>{const y=mix(.55,1.4,t);return v(side*(bodyX(y)+.002),y,mix(2.45,3.0,u));},v(side,0,0));
  box('panel_BodyDoor'+suffix+'ShuttleHandle',side*1.066,1.32,2.51,.028,.035,.13,chrome);
  panel('panel_RoofShoulderShuttle'+suffix,4,24,(u,t)=>{const a=u*Math.PI/2;return v(side*(.865+.12*Math.cos(a)),2.34+.16*Math.sin(a),mix(-3,2.72,t));},v(side,1,0).normalize());
  box('panel_ShuttleRubStrip'+suffix,side*1.058,1.14,0,.018,.045,5.98,rubber);
  for(const [i,[a,b]]of [[-2.99,-2.41],[-1.39,1.39],[2.41,2.99]].entries())box('panel_ShuttleLowerRail'+suffix+i,side*1.045,.57,(a+b)/2,.035,.055,b-a,steel);
  for(const z of [-1.9,1.9]){
   panel('Structure wheelhouse Shuttle '+suffix+z,16,3,(u,t)=>v(side*mix(.69,1.045,t),.42+Math.sin(u*Math.PI)*.505,z+Math.cos(u*Math.PI)*.505),v(0,1,0),steel,.018);
   const path=Array.from({length:21},(_,i)=>v(side*1.048,.42+Math.sin(.26+(Math.PI-.52)*i/20)*.51,z+Math.cos(.26+(Math.PI-.52)*i/20)*.51));
   add('panel_ArchLipShuttle'+suffix+z,new T.TubeGeometry(new T.CatmullRomCurve3(path),20,.013,6,false),paint);
  }
  bar('panel_BodyDoor'+suffix+'ShuttleMirrorArm',v(side*1.04,1.75,2.72),v(side*1.21,1.72,2.94),.013,steel);
  box('panel_BodyDoor'+suffix+'ShuttleMirror',side*1.21,1.72,2.97,.05,.23,.12,chrome);
 }
 panel('panel_RoofShuttle',10,28,(u,t)=>{const x=(u*2-1)*.865;return v(x,2.5+.035*(1-(x/.865)**2),mix(-3,2.72,t));},v(0,1,0));
 // Front screen sweeps back into the rounded roof; exposed engine sits below it.
 for(const side of [-1,1])window('FrontShuttle'+side,[v(side*.018,1.38,3),v(side*1.035,1.38,3),v(side*.985,2.34,2.72),v(side*.018,2.34,2.72)],side);
 panel('panel_FrontHeaderShuttle',10,3,(u,t)=>v((u*2-1)*mix(.985,.865,t),mix(2.34,2.5,t),2.72),v(0,.6,1).normalize());
 panel('panel_hoodShuttle',14,7,(u,t)=>{const x=(u*2-1)*1.035;return v(x,mix(.55,1.38,t),3.0+.035*(1-(x/1.035)**4)*Math.sin(t*Math.PI));},v(0,0,1));
 panel('panel_RearLowerShuttle',14,6,(u,t)=>v((u*2-1)*1.035,mix(.55,1.4,t),-3),v(0,0,-1));
 window('RearShuttle',[v(1.035,1.4,-3),v(-1.035,1.4,-3),v(-.985,2.34,-3),v(.985,2.34,-3)],1);
 panel('panel_RearHeaderShuttle',10,4,(u,t)=>v((u*2-1)*mix(.985,.865,t),mix(2.34,2.5,t),-3),v(0,.5,-1).normalize());
 for(const front of [true,false]){const sign=front?1:-1,stem=front?'front':'rear';
  panel('panel_bumper_'+stem+'Shuttle',14,3,(u,t)=>{const x=(u*2-1)*1.07;return v(x,mix(.48,.65,t),sign*(3.11-.07*(x/1.07)**4));},v(0,0,sign),steel,.065);
  for(const side of [-1,1]){box('Structure bumper mount Shuttle '+stem+side,side*.66,.54,sign*2.96,.12,.1,.28,steel);box('panel_Shuttle'+stem+'Lamp'+side,side*.78,.96,sign*3.036,.27,.17,.03,front?white:red);box('panel_Shuttle'+stem+'Indicator'+side,side*.78,.78,sign*3.036,.27,.07,.03,amber);}
 }
 box('panel_hoodShuttleGrille',0,.89,3.042,.84,.34,.022,rubber);for(let i=0;i<7;i++)box('panel_hoodShuttleGrilleSlat'+i,0,.755+i*.044,3.060,.81,.017,.018,chrome);
 box('panel_ShuttleDestinationSign',0,2.24,2.762,.76,.14,.04,rubber);
 for(const side of [-1,1])bar('panel_ShuttleWiper'+side,v(side*.46,1.42,2.99),v(side*.25,1.70,2.91),.009,rubber);
 box('Structure floor Shuttle',0,.67,-.05,1.94,.045,5.9,steel);box('Interior Calder passenger floor',0,.706,-.5,1.88,.025,4.8,vinyl);
 for(const side of [-1,1])box('Structure frame rail Shuttle '+side,side*.58,.46,0,.12,.17,5.85,steel);
 for(const z of [-2.7,-1.7,-.7,.3,1.3,2.3])box('Structure frame crossmember Shuttle '+z,0,.49,z,1.75,.11,.12,steel);
 for(const side of [-1,1])for(let row=0;row<4;row++){
  const z=1.05-row*.90,x=side*.59,name='Interior Calder passenger '+side+' '+row;
  box(name+' cushion',x,.99,z,.62,.13,.48,cloth);const back=box(name+' back',x,1.32,z-.22,.62,.62,.11,cloth);back.rotation.x=-.08;
  for(const dx of [-.22,.22])bar('Structure seat leg Shuttle '+side+row+dx,v(x+dx,.72,z),v(x+dx,.94,z),.018,steel);
  bar(name+' handrail',v(x-.27,1.64,z-.2),v(x+.27,1.64,z-.2),.014,chrome);
 }
 box('Interior Calder driver cushion',-.52,1.02,2.08,.57,.14,.49,cloth);box('Interior Calder driver back',-.52,1.34,1.85,.57,.62,.12,cloth);
 box('Interior Calder dash',0,1.35,2.64,1.91,.22,.29,vinyl);
 const steering=add('Interior Calder steering wheel',new T.TorusGeometry(.2,.013,6,24),rubber);steering.position.set(-.52,1.60,2.35);steering.rotation.x=-.5;
 bar('Structure steering column Shuttle',v(-.52,1.6,2.35),v(-.52,.88,2.65),.022,steel);
 box('Structure engine block Shuttle',0,.95,2.22,.43,.37,.65,steel);box('Structure engine valve cover Shuttle',0,1.18,2.22,.31,.1,.67,chrome);
 for(let i=0;i<6;i++)bar('Structure engine manifold Shuttle '+i,v(-.23,1.05,1.95+i*.108),v(-.34,.91,1.95+i*.108),.025,steel);
 box('Structure radiator Shuttle',0,.97,2.82,.85,.43,.065,steel);bar('Structure exhaust Shuttle',v(.49,.35,1.9),v(.49,.35,-3),.035,steel);
 const donor=buildCompactAsset();for(const [i,name]of ['FL','FR','RL','RR'].entries()){
  const wheel=donor.getObjectByName('wheel_'+name)!;wheel.removeFromParent();wheel.position.set((i%2?1:-1)*.92,.42,(i<2?1:-1)*1.9);wheel.scale.setScalar(.43/.32);root.add(wheel);
 }
 donor.traverse(o=>{if(o instanceof T.Mesh)o.geometry.dispose();});root.updateMatrixWorld(true);return root;
}
