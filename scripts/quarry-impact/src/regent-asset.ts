import * as T from 'three';
import {formedVehiclePanel,panelSamples} from './formed-vehicle-panel';
import {classicWindowFrame} from './classic-window-frame';
import {buildCompactAsset} from './compact-asset';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),mix=T.MathUtils.lerp;
/** Original 1970s full-size four-door saloon, +Z nose. Long bonnet and boot,
 * separate door skins, open glazing and actual wheel apertures. */
export function buildRegentAsset(){
 const root=new T.Group();root.name='HartwellRegent';
 const mat=(name:string,color:number,roughness=.55,metalness=.15)=>new T.MeshPhysicalMaterial({name,color,roughness,metalness});
 const paint=mat('paint_Regent',0x65714b,.36,.25);paint.clearcoat=.85;
 const chrome=mat('Regent Chrome',0xafb7b5,.27,.85),rubber=mat('Regent Rubber',0x202322,.92),steel=mat('Structure Regent Steel',0x363d3d,.7,.55),cloth=mat('Interior Regent Cloth',0x665c42,.95),vinyl=mat('Interior Regent Vinyl',0x36382f,.88),glass=mat('Regent Glass',0x39585b,.10,.1),white=mat('Regent Headlight',0xe7dbb7,.23),red=mat('Regent Brakelight',0xa52d22,.23),amber=mat('Regent Indicator',0xcc902f,.25);
 glass.transparent=true;glass.opacity=.48;glass.depthWrite=false;
 const add=(name:string,g:T.BufferGeometry,m:T.Material)=>{if(g.index)g=g.toNonIndexed();const mesh=new T.Mesh(g,m);mesh.name=name;mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);return mesh;};
 const box=(name:string,x:number,y:number,z:number,w:number,h:number,l:number,m:T.Material)=>{const o=add(name,new T.BoxGeometry(w,h,l),m);o.position.set(x,y,z);return o;};
 const panel=(name:string,nu:number,nv:number,map:(u:number,t:number)=>T.Vector3,n:T.Vector3,m:T.Material=paint,depth=.025)=>add(name,formedVehiclePanel(panelSamples(nu),panelSamples(nv),map,n,depth),m);
 const bar=(name:string,a:T.Vector3,b:T.Vector3,r:number,m:T.Material)=>{const o=add(name,new T.CylinderGeometry(r,r,a.distanceTo(b),8),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(v(0,1,0),b.clone().sub(a).normalize());return o;};
 const window=(name:string,corners:T.Vector3[],side:number)=>{const f=classicWindowFrame(corners,side);add('panel_'+name+'Frame',f.frame,paint);add('panel_'+name+'Seal',f.seal,rubber);add('panel_'+name+'Trim',f.trim,chrome);add('glass_'+name,f.glass,glass).castShadow=false;};
 const belt=(z:number)=>1.04-.035*Math.max(0,Math.abs(z)-1.1),sideX=(y:number,z:number)=>.995-.085*((y-.82)/.50)**2-.025*Math.max(0,Math.abs(z)-2.1);
 const lower=(z:number)=>{const d=Math.min(Math.abs(z-1.55),Math.abs(z+1.55));return d<.425?Math.max(.40,.36+Math.sqrt(.425**2-d*d)):.40;};
 for(const side of [-1,1]){
  const s=side<0?'L':'R';
  for(const [name,a,b]of [['RearWing',-2.67,-1.02],['BodyDoorRear',-1.02,-.12],['BodyDoor',-.12,.91],['FrontWing',.91,2.67]]as const){
   const stem='panel_'+name+s+'Regent';
   panel(stem,18,7,(u,t)=>{const z=mix(a,b,u),y=mix(lower(z),belt(z),t);return v(side*sideX(y,z),y,z);},v(side,0,0));
   if(name.includes('Door')){box(stem+'Handle',side*.997,.96,a+.14,.035,.035,.16,chrome);box(stem+'InnerCard',side*.907,.78,(a+b)/2,.03,.39,b-a-.04,vinyl);}
  }
  window('BodyDoor'+s+'Regent',[v(side*.972,1.045,.91),v(side*.972,1.045,-.10),v(side*.790,1.52,-.10),v(side*.790,1.52,.48)],side);
  window('BodyDoorRear'+s+'Regent',[v(side*.972,1.045,-.14),v(side*.972,1.045,-1.22),v(side*.790,1.52,-.98),v(side*.790,1.52,-.14)],side);
  bar('Structure Regent B pillar '+s,v(side*.945,.51,-.12),v(side*.785,1.515,-.12),.032,steel);
  for(const z of [-1.55,1.55]){
   panel('Structure Regent wheelhouse '+s+z,20,3,(u,t)=>v(side*mix(.69,.985,t),.36+Math.sin(u*Math.PI)*.428,z+Math.cos(u*Math.PI)*.428),v(0,1,0),steel,.015);
   const points=Array.from({length:21},(_,i)=>{const a=mix(.12,Math.PI-.12,i/20),y=.36+Math.sin(a)*.428,Z=z+Math.cos(a)*.428;return v(side*(sideX(y,Z)+.005),y,Z);});
   add('panel_RegentArch'+s+z,new T.TubeGeometry(new T.CatmullRomCurve3(points),20,.010,6,false),chrome);
  }
  for(const [name,a,b]of [['Front',.91,2.67],['Rear',-2.67,-1.22]]as const)panel('panel_RegentShoulder'+name+s,18,4,(u,t)=>{const z=mix(a,b,u);return v(side*mix(sideX(belt(z),z),.875,t),belt(z)+.038*Math.sin(t*Math.PI/2),z);},v(side,1,0).normalize());
  panel('panel_RegentRoofEdge'+s,5,16,(u,t)=>v(side*mix(.790,.70,u),1.52+.045*Math.sin(u*Math.PI/2),mix(-.98,.48,t)),v(side,1,0).normalize());
  box('panel_RegentSill'+s,side*.96,.415,-.055,.045,.09,2.05,chrome);
  box('panel_RegentBeltTrim'+s,side*.995,1.003,-.055,.018,.020,4.95,chrome);
  for(const z of [-1.02,-.12,.91])bar('panel_RegentDoorSeam'+s+z,v(side*(sideX(lower(z),z)+.001),lower(z),z),v(side*(sideX(belt(z),z)+.001),belt(z),z),.003,rubber);
  bar('panel_BodyDoor'+s+'RegentMirrorArm',v(side*.98,1.03,.67),v(side*1.10,1.10,.65),.012,chrome);
  box('panel_BodyDoor'+s+'RegentMirror',side*1.10,1.10,.65,.06,.085,.15,chrome);
 }
 panel('panel_hoodRegent',18,24,(u,t)=>{const x=(u*2-1)*.875,z=mix(.91,2.67,t);return v(x,belt(z)+.038+.042*(1-(x/.875)**2)*Math.sin(t*Math.PI),z);},v(0,1,0));
 panel('panel_BootRegent',18,20,(u,t)=>{const x=(u*2-1)*.875,z=mix(-2.67,-1.22,t);return v(x,belt(z)+.038+.025*(1-(x/.875)**2)*Math.sin(t*Math.PI),z);},v(0,1,0));
 panel('panel_RoofRegent',16,18,(u,t)=>{const x=(u*2-1)*.70;return v(x,1.565+.04*(1-(x/.7)**2)*Math.sin(t*Math.PI),mix(-.98,.48,t));},v(0,1,0));
 window('FrontRegent',[v(-.972,1.045,.91),v(.972,1.045,.91),v(.790,1.52,.48),v(-.790,1.52,.48)],1);
 window('RearRegent',[v(.972,1.045,-1.22),v(-.972,1.045,-1.22),v(-.790,1.52,-.98),v(.790,1.52,-.98)],1);
 for(const front of [true,false]){const sign=front?1:-1,stem=front?'front':'rear';
  panel('panel_Regent'+stem+'Valance',18,6,(u,t)=>{const x=(u*2-1)*.97;return v(x,mix(.40,belt(sign*2.67)+.038,t),sign*(2.67+.027*(1-(x/.97)**2)));},v(0,0,sign));
  panel('panel_bumper_'+stem+'Regent',20,4,(u,t)=>{const x=(u*2-1)*1.01;return v(x,mix(.43,.61,t),sign*(2.79-.09*(x/1.01)**4+.014*Math.sin(t*Math.PI)));},v(0,0,sign),chrome,.045);
  for(const side of [-1,1]){box('Structure Regent bumper mount '+stem+side,side*.64,.51,sign*2.64,.1,.09,.30,steel);box('panel_bumper_'+stem+'RegentRubber'+side,side*.56,.52,sign*2.79,.08,.20,.04,rubber);}
 }
 box('panel_RegentGrilleRecess',0,.82,2.702,1.07,.27,.023,rubber);for(let i=-9;i<=9;i++)box('panel_RegentGrilleSlat'+i,i*.052,.82,2.722,.018,.23,.014,chrome);
 for(const side of [-1,1]){
  box('panel_RegentLightBezel'+side,side*.748,.835,2.69,.405,.23,.025,chrome);
  for(const x of [.646,.85]){const lens=add('panel_RegentHeadlight'+side+x,new T.CylinderGeometry(.087,.087,.018,16),white);lens.rotation.x=Math.PI/2;lens.position.set(side*x,.835,2.713);}
  box('panel_RegentIndicator'+side,side*.83,.675,2.704,.20,.065,.025,amber);
  box('panel_RegentRearBezel'+side,side*.77,.835,-2.707,.31,.17,.025,chrome);box('panel_RegentRearLamp'+side,side*.77,.835,-2.724,.275,.135,.015,red);
  bar('panel_RegentWiper'+side,v(side*.44,1.059,.89),v(side*.23,1.14,.81),.008,rubber);
  box('Structure Regent frame rail '+side,side*.65,.35,0,.12,.15,5.15,steel);
 }
 box('Structure Regent floor',0,.44,-.2,1.82,.06,3.4,steel);box('Interior Regent carpet',0,.484,-.2,1.76,.028,2.35,vinyl);
 for(const z of [-.72,.39]){box('Interior Regent bench cushion '+z,0,.70,z,1.65,.15,.55,cloth);const back=box('Interior Regent bench back '+z,0,.98,z-.27,1.65,.56,.13,cloth);back.rotation.x=-.1;}
 box('Interior Regent dash',0,1.02,.84,1.82,.18,.30,vinyl);box('Interior Regent instrument cluster',-.52,1.09,.675,.45,.12,.035,rubber);
 const steering=add('Interior Regent steering wheel',new T.TorusGeometry(.18,.012,6,24),rubber);steering.position.set(-.52,1.04,.50);steering.rotation.x=-.45;
 bar('Structure Regent steering column',v(-.52,1.04,.50),v(-.52,.62,.88),.023,steel);
 box('Structure engine block Regent',0,.65,1.64,.52,.36,.77,steel);
 for(const side of [-1,1]){const cover=box('Structure engine valve cover Regent '+side,side*.25,.82,1.63,.18,.15,.75,chrome);cover.rotation.z=side*.28;bar('Structure Regent exhaust '+side,v(side*.42,.31,1.4),v(side*.42,.31,-2.64),.027,steel);}
 const cleaner=add('Structure Regent air cleaner',new T.CylinderGeometry(.23,.23,.07,18),steel);cleaner.position.set(0,.925,1.64);
 box('Structure radiator Regent',0,.72,2.36,1.0,.44,.08,steel);
 const donor=buildCompactAsset();for(const [i,name]of ['FL','FR','RL','RR'].entries()){const wheel=donor.getObjectByName('wheel_'+name)!;wheel.removeFromParent();wheel.position.set((i%2?1:-1)*.86,.36,(i<2?1:-1)*1.55);wheel.scale.setScalar(.38/.32);root.add(wheel);}
 donor.traverse(o=>{if(o instanceof T.Mesh)o.geometry.dispose();});root.updateMatrixWorld(true);return root;
}
