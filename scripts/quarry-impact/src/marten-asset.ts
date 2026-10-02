import * as T from 'three';
import {classicWindowFrame} from './classic-window-frame';
import {formedVehiclePanel,panelSamples} from './formed-vehicle-panel';
import {buildCompactAsset} from './compact-asset';
import {refineTernCabin} from './tern-cabin';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),mix=T.MathUtils.lerp;

/** Original compact rear-engine coupe. Closed curved pressings surround a
 * front luggage bay and rear air-cooled flat-four. +Z is the nose. */
export function buildMartenAsset(){
 const root=new T.Group();root.name='Marten1600';
 const mat=(name:string,color:number,roughness:number,metalness=0)=>new T.MeshPhysicalMaterial({name,color,roughness,metalness});
 const paint=mat('paint_Marten',0x6e929a,.29,.3);paint.clearcoat=1;paint.clearcoatRoughness=.15;
 const rubber=mat('Marten Rubber',0x202523,.85),vinyl=mat('Interior Marten Vinyl',0x2b322c,.84),cloth=mat('Interior Marten Cloth',0x665d4c,.96);
 const steel=mat('Structure Marten Steel',0x444a49,.68,.52),alloy=mat('Marten Alloy',0xb0b5af,.35,.75),chrome=mat('Marten Chrome',0xaebabb,.25,.85);
 const glass=mat('Marten Glass',0x334d55,.09,.12);glass.transparent=true;glass.opacity=.55;glass.depthWrite=false;
 const lamp=mat('Marten Headlight',0xdddac5,.2,.13),brake=mat('Marten Brakelight',0xa02318,.26,.12),amber=mat('Marten Indicator',0xc7842c,.27,.12);
 const add=(name:string,g:T.BufferGeometry,m:T.Material,parent:T.Object3D=root)=>{
  const lathe=g.type==='LatheGeometry';if(g.index)g=g.toNonIndexed();
  // Lathe tips collapse one triangle at each pole. Remove only those zero-area
  // faces so lenses remain closed without invalid damage normals.
  if(lathe){const p=g.attributes.position,keep:number[]=[];for(let i=0;i<p.count;i+=3){const a=v(0,0,0).fromBufferAttribute(p,i),b=v(0,0,0).fromBufferAttribute(p,i+1),c=v(0,0,0).fromBufferAttribute(p,i+2);if(b.sub(a).cross(c.sub(a)).lengthSq()>1e-18)keep.push(i,i+1,i+2);}if(keep.length!==p.count){const clean=new T.BufferGeometry();for(const [key,a]of Object.entries(g.attributes))clean.setAttribute(key,new T.Float32BufferAttribute(keep.flatMap(i=>Array.from({length:a.itemSize},(_,j)=>a.getComponent(i,j))),a.itemSize));g.dispose();g=clean;}}
  const o=new T.Mesh(g,m);o.name=name;o.castShadow=o.receiveShadow=true;parent.add(o);return o;};
 const box=(name:string,x:number,y:number,z:number,w:number,h:number,d:number,m:T.Material)=>{const o=add(name,new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);return o;};
 const bar=(name:string,a:T.Vector3,b:T.Vector3,r:number,m:T.Material,segments=8)=>{const o=add(name,new T.CylinderGeometry(r,r,a.distanceTo(b),segments),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(v(0,1,0),b.clone().sub(a).normalize());return o;};
 const cylinder=(name:string,x:number,y:number,z:number,r:number,d:number,m:T.Material,axis:'x'|'y'|'z'='y',segments=12)=>{const o=add(name,new T.CylinderGeometry(r,r,d,segments),m);o.position.set(x,y,z);if(axis==='x')o.rotation.z=Math.PI/2;if(axis==='z')o.rotation.x=Math.PI/2;return o;};
 const panel=(name:string,nx:number,ny:number,surface:(u:number,t:number)=>T.Vector3,out:T.Vector3,m:T.Material=paint,thickness=.018)=>add(name,formedVehiclePanel(panelSamples(nx),panelSamples(ny),surface,out,thickness),m);
 const sideX=(y:number,z:number)=>.774-.071*((y-.73)/.43)**2-.054*T.MathUtils.smoothstep(Math.abs(z),1.52,1.96);
 const belt=(z:number)=>z>.62?mix(1.025,.815,(z-.62)/1.34):z< -1.30?mix(1.025,.815,(-z-1.30)/.66):1.025;
 const endZ=(x:number,sign:number)=>sign*(1.96+.052*(1-(x/.72)**2));
 const arch=(z:number)=>{const dz=Math.min(Math.abs(z-1.14),Math.abs(z+1.14));return dz<.368?Math.max(.375,.3400195+Math.sqrt(.368**2-dz**2)):.375;};
 const window=(name:string,corners:T.Vector3[],side:number)=>{const f=classicWindowFrame(corners,side);add('panel_'+name+'Frame',f.frame,paint);add('panel_'+name+'Seal',f.seal,rubber);add('panel_'+name+'Trim',f.trim,chrome);add('glass_'+name,f.glass,glass).castShadow=false;};
 for(const side of [-1,1]){
  const s=side<0?'L':'R';
  for(const [name,a,b]of [['FrontWing',.62,1.96],['BodyDoor',-.57,.62],['RearWing',-1.96,-.57]] as const){
   add('panel_'+name+s+'Marten',formedVehiclePanel(panelSamples(18),[0,.14,.46,.75,1],(u,t)=>{const z=mix(a,b,u),y=mix(arch(z),belt(z),t);return v(side*sideX(y,z),y,z);},v(side,0,0)),paint);
  }
  panel('panel_SillMarten'+s,12,2,(u,t)=>{const z=mix(-1.90,1.90,u);return v(side*mix(sideX(.375,z),.692,t),mix(.374,.327,t),z);},v(side,-.4,0));
  for(const z of [-1.14,1.14]){
   const points=Array.from({length:21},(_,i)=>{const a=mix(.11,Math.PI-.11,i/20),y=.3400195+Math.sin(a)*.369,Z=z+Math.cos(a)*.369;return v(side*(sideX(y,Z)+.003),y,Z);});
   add('panel_ArchLipMarten'+s+z,new T.TubeGeometry(new T.CatmullRomCurve3(points),20,.006,4,false),paint);
   panel('Structure Marten wheelhouse '+s+z,12,2,(u,t)=>{const a=u*Math.PI;return v(side*mix(.59,.748,t),.3400195+Math.sin(a)*.365,z+Math.cos(a)*.365);},v(0,1,0),steel,.012);
  }
  for(const [name,a,b]of [['FrontShoulder',.62,1.96],['RearShoulder',-1.96,-1.30]] as const){
   panel('panel_'+name+'Marten'+s,14,3,(u,t)=>{const z=mix(a,b,u),y=belt(z),x=side*mix(sideX(y,z),.652,t);return v(x,y+.02*Math.sin(t*Math.PI/2),u===1&&b===1.96?endZ(x,1):u===0&&a===-1.96?endZ(x,-1):z);},v(side,.7,0).normalize());
  }
  window('BodyDoor'+s+'Marten',[v(side*.741,1.025,.62),v(side*.741,1.025,-.57),v(side*.596,1.443,-.57),v(side*.596,1.443,.14)],side);
  window('QuarterMarten'+s,[v(side*.741,1.025,-.59),v(side*.741,1.025,-1.30),v(side*.596,1.443,-.78),v(side*.596,1.443,-.59)],side);
  panel('panel_BodyDoor'+s+'MartenHeader',9,1,(u,t)=>v(side*mix(.596,.608,t),mix(1.443,1.478,t),mix(-.57,mix(.14,.11,t),u)),v(side,0,0));
  panel('panel_QuarterHeaderMarten'+s,6,1,(u,t)=>v(side*mix(.596,.608,t),mix(1.443,1.478,t),mix(-.78,-.59,u)),v(side,0,0));
  bar('panel_ApillarMarten'+s,v(side*.741,1.025,.62),v(side*.596,1.443,.14),.018,paint);
  bar('panel_BpillarMarten'+s,v(side*.741,1.025,-.58),v(side*.608,1.478,-.58),.018,paint);
  panel('panel_CpillarMarten'+s,3,8,(u,t)=>v(side*mix(.741,.608,t),mix(1.025,1.478,t),mix(-1.30,-.78,t)+u*.065),v(side,0,-.3).normalize());
  box('panel_BodyDoor'+s+'MartenHandleRecess',side*.758,.911,-.431,.022,.062,.175,rubber);
  box('panel_BodyDoor'+s+'MartenHandle',side*.775,.92,-.431,.025,.019,.124,chrome);
  box('panel_BodyDoor'+s+'MartenInnerCard',side*.710,.744,.022,.026,.40,1.07,vinyl);
  box('panel_BodyDoor'+s+'MartenArmrest',side*.67,.805,-.15,.064,.043,.26,cloth);
  cylinder('panel_BodyDoor'+s+'MartenWinder',side*.667,.849,.16,.019,.015,chrome,'x',8);
  bar('panel_BodyDoor'+s+'MartenWinderStem',v(side*.66,.849,.16),v(side*.66,.804,.135),.006,chrome,6);
  for(const z of [-.568,.618])bar('panel_BodyDoor'+s+'MartenShutline'+z,v(side*sideX(.42,z),.42,z),v(side*sideX(1.015,z),1.015,z),.0015,rubber,4);
  bar('panel_BodyDoor'+s+'MartenMirrorStem',v(side*.754,1.055,.39),v(side*.821,1.093,.39),.009,chrome,6);
  const mirror=add('panel_BodyDoor'+s+'MartenMirror',new T.SphereGeometry(.059,12,6),chrome);mirror.position.set(side*.831,1.104,.39);mirror.scale.set(.5,.73,1);
 }
 panel('panel_hoodMarten',10,9,(u,t)=>{const x=(u*2-1)*.652;return v(x,mix(1.045,.835,t)+.052*(1-(x/.652)**2)*Math.sin(t*Math.PI),mix(.62,endZ(x,1),t));},v(0,1,0));
 panel('panel_EngineLidMarten',10,6,(u,t)=>{const x=(u*2-1)*.652;return v(x,mix(.835,1.045,t)+.029*(1-(x/.652)**2)*Math.sin(t*Math.PI),mix(endZ(x,-1),-1.30,t));},v(0,1,0));
 for(const side of [-1,1])for(let i=0;i<7;i++){
  const z=-1.825+i*.056,t=(z+2.012)/.712,y=mix(.835,1.045,t)+.029*(1-(.26/.652)**2)*Math.sin(t*Math.PI);
  box('panel_EngineLidMartenVent'+side+' '+i,side*.265,y+.002,z,.37,.009,.022,rubber);
 }
 box('panel_EngineLidMartenHandle',0,.906,-1.828,.12,.02,.031,chrome);
 window('FrontMarten',[v(-.741,1.025,.62),v(.741,1.025,.62),v(.596,1.443,.14),v(-.596,1.443,.14)],1);
 window('RearMarten',[v(.741,1.025,-1.30),v(-.741,1.025,-1.30),v(-.596,1.443,-.78),v(.596,1.443,-.78)],1);
 panel('panel_RoofMarten',8,8,(u,t)=>{const x=(u*2-1)*.608;return v(x,1.478+.050*(1-(x/.608)**2)*Math.sin(t*Math.PI),mix(-.78,.11,t));},v(0,1,0));
 for(const rear of [false,true])panel('panel_'+(rear?'Rear':'Front')+'HeaderMarten',10,1,(u,t)=>v((u*2-1)*mix(.596,.608,t),mix(1.443,1.478,t),rear?-.78:mix(.14,.11,t)),v(0,1,rear?-1:1).normalize());
 const nose=(x:number,y:number,depth:number)=>v(x,y,endZ(x,1)+depth);
 const shape=new T.Shape();const ys=[.365,.425,.56,.69,.815];
 shape.moveTo(-sideX(ys[0],1.96)-.004,ys[0]);for(const y of ys)shape.lineTo(sideX(y,1.96)+.004,y);shape.lineTo(.652,.835);shape.lineTo(-.652,.835);for(const y of [...ys].reverse())shape.lineTo(-sideX(y,1.96)-.004,y);shape.closePath();
 for(const side of [-1,1]){const hole=new T.Path();hole.absellipse(side*.510,.704,.115,.115,0,Math.PI*2,true,0);shape.holes.push(hole);}
 const sheet=new T.ExtrudeGeometry(shape,{depth:.022,bevelEnabled:false,curveSegments:16}),p=sheet.attributes.position;
 for(let i=0;i<p.count;i++){const q=nose(p.getX(i),p.getY(i),p.getZ(i)-.022);p.setXYZ(i,q.x,q.y,q.z);}sheet.computeVertexNormals();add('panel_FrontValanceMarten',sheet,paint);
 panel('panel_RearValanceMarten',16,5,(u,t)=>{const y=mix(.365,.835,t),x=(u*2-1)*(sideX(Math.min(y,.815),-1.96)+.004);return v(x,y,endZ(x,-1));},v(0,0,-1));
 const fitLamp=(g:T.LatheGeometry,x:number)=>{g.rotateX(Math.PI/2);const p=g.attributes.position;for(let i=0;i<p.count;i++)p.setZ(i,p.getZ(i)+endZ(p.getX(i)+x,1)-endZ(x,1));g.computeVertexNormals();return g;};
 for(const side of [-1,1]){
  const x=side*.510,z=endZ(x,1);
  const ring=add('panel_HeadlightMartenRim'+side,fitLamp(new T.LatheGeometry([[.127,-.027],[.131,-.008],[.124,.006],[.111,.004],[.109,-.027],[.127,-.027]].map(([r,d])=>new T.Vector2(r,d)),20),x),chrome);ring.position.set(x,.704,z);
  const lens=add('panel_HeadlightMartenLens'+side,fitLamp(new T.LatheGeometry([[0,-.006],[.051,-.008],[.096,-.014],[.109,-.025],[.109,-.039],[0,-.039]].map(([r,d])=>new T.Vector2(r,d)),20),x),lamp);lens.position.set(x,.704,z);
  cylinder('panel_FrontIndicatorMarten'+side,side*.52,.52,endZ(side*.52,1)+.01,.04,.017,amber,'z',12);
  box('panel_RearLampMartenBezel'+side,side*.539,.698,-1.989,.219,.099,.03,chrome);
  box('panel_RearLampMartenBrake'+side,side*.507,.698,-2.009,.122,.076,.014,brake);
  box('panel_RearLampMartenIndicator'+side,side*.602,.698,-2.009,.055,.076,.014,amber);
  bar('panel_WiperMarten'+side,v(side*.38,1.049,.596),v(side*.16,1.115,.500),.006,rubber,6);
 }
 box('panel_RearPlateMartenRecess',0,.665,-2.017,.351,.106,.022,rubber);box('panel_RearPlateMarten',0,.665,-2.031,.31,.082,.01,alloy);
 for(const sign of [-1,1]){
  const label=sign>0?'front':'rear';
  panel('panel_bumper_'+label+'Marten',16,2,(u,t)=>{const x=(u*2-1)*.773;return v(x,mix(.403,.475,t),sign*(2.064-.078*(x/.773)**4+.009*Math.sin(t*Math.PI)));},v(0,0,sign),chrome,.036);
  for(const side of [-1,1]){box('Structure '+label+' crash mount Marten '+side,side*.48,.427,sign*1.93,.06,.06,.18,steel);box('panel_bumper_'+label+'MartenOverrider'+side,side*.48,.438,sign*2.067,.048,.106,.026,rubber);}
 }
 box('Structure Marten floor',0,.362,0,1.37,.024,3.71,steel);
 for(const side of [-1,1])box('Structure Marten rail '+side,side*.46,.326,0,.064,.065,3.65,steel);
 for(const z of [-1.65,-.55,.43,1.53])box('Structure Marten beam '+z,0,.340,z,1.37,.045,.063,steel);
 box('Structure Marten front bulkhead',0,.685,.665,1.37,.603,.025,steel);
 box('Structure Marten rear firewall',0,.683,-1.274,1.36,.595,.025,steel);
 box('Interior Marten carpet',0,.401,-.19,1.36,.018,2.10,cloth);
 box('Interior Marten parcel shelf',0,.993,-1.226,1.37,.026,.122,vinyl);
 const cabin=new T.Group();refineTernCabin(cabin,{cloth,vinyl,rubber,steel,alloy});for(const o of [...cabin.children]){o.name=o.name.replaceAll('Tern','Marten');root.add(o);}
 bar('Interior Marten steering column',v(-.343,1.045,.268),v(-.343,.857,.512),.014,steel);
 bar('Interior Marten gear lever',v(0,.424,-.02),v(0,.66,.02),.008,steel);
 // A luggage tray and spare occupy the nose; no front engine is hidden here.
 box('Structure Marten luggage tray',0,.458,1.26,1.13,.025,.93,steel);
 const spare=add('Structure Marten spare tyre',new T.TorusGeometry(.244,.067,5,16),rubber);spare.rotation.x=Math.PI/2;spare.position.set(0,.546,1.19);
 cylinder('Structure Marten spare rim',0,.55,1.19,.176,.066,alloy,'y',12);
 for(const side of [-1,1])cylinder('Structure Marten front strut tower '+side,side*.52,.681,1.14,.071,.174,steel,'y',8);
 box('Structure Marten front fuel tank',0,.389,1.42,.74,.052,.39,steel);
 // Low opposing cylinder banks flank the rear crankcase; no water radiator.
 box('Structure engine block Marten',0,.581,-1.56,.265,.235,.51,steel);
 for(const side of [-1,1]){
  box('Structure engine valve cover Marten '+side,side*.346,.588,-1.56,.30,.17,.42,alloy);
  for(let i=0;i<7;i++)box('Structure engine casting rib Marten '+side+' '+i,side*.35,.69,-1.743+i*.059,.293,.011,.009,steel);
  bar('Structure intake runner Marten '+side,v(side*.28,.715,-1.53),v(side*.11,.846,-1.56),.035,alloy);
  bar('Structure Marten rear halfshaft '+side,v(0,.445,-1.14),v(side*.665,.445,-1.14),.019,steel);
  bar('Structure Marten exhaust manifold '+side,v(side*.33,.472,-1.54),v(side*.43,.359,-1.82),.023,steel);
 }
 cylinder('Structure engine cover cooling fan Marten',0,.772,-1.582,.149,.117,steel,'z',16);
 cylinder('Structure engine cover fan pulley Marten',0,.771,-1.652,.043,.020,alloy,'z',12);
 cylinder('Structure engine air cleaner Marten',.011,.900,-1.533,.105,.052,rubber,'y',12);
 box('Structure Marten transaxle',0,.474,-1.229,.217,.174,.25,alloy);
 cylinder('Structure Marten silencer',0,.342,-1.898,.058,.68,steel,'x',10);
 cylinder('Structure Marten exhaust tip',-.33,.336,-1.991,.022,.18,alloy,'z',10);
 const source=buildCompactAsset();for(const [i,name]of ['FL','FR','RL','RR'].entries()){const wheel=source.getObjectByName('wheel_'+name)!;wheel.removeFromParent();wheel.position.set((i%2?1:-1)*.665,.3400195,(i<2?1:-1)*1.14);root.add(wheel);}source.traverse(o=>{if(o instanceof T.Mesh)o.geometry.dispose();});
 root.updateMatrixWorld(true);return root;
}
