import * as T from 'three';
import {classicWindowFrame} from './classic-window-frame';
import {closedVehiclePressing as pressing} from './vehicle-pressing';

const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);
const mix=T.MathUtils.lerp;

/** Original short-wheelbase, two-door saloon. Asset coordinates: +Z is the
 * nose, ground is Y=0, and the four tyre centres match the physics anchors. */
export function buildCompactAsset(){
 const root=new T.Group();root.name='Rook1100';
 const material=(name:string,color:number,roughness:number,metalness=0)=>{const m=new T.MeshPhysicalMaterial({name,color,roughness,metalness});return m;};
 const paint=material('paint_Rook',0x587578,.28,.42);paint.clearcoat=1;paint.clearcoatRoughness=.15;
 const chrome=material('Rook Brushed Chrome',0xa4abb0,.27,.88),rubber=material('Rook Window Rubber',0x171b1b,.84),steel=material('Structure Rook Steel',0x343b3c,.68,.55);
 const inside=material('Interior Rook Cloth',0x4a4539,.94),vinyl=material('Interior Rook Vinyl',0x252c29,.81),glass=material('Rook Glass',0x334d57,.08,.12);glass.transparent=true;glass.opacity=.55;glass.depthWrite=false;
 const tire=material('Tire Rook',0x272625,.96),rim=material('Rook Stamped Wheel',0xb8b6a9,.48,.66),headlight=material('Rook Headlight',0xe7e1cb,.20,.28),brake=material('Rook Brakelight',0xa22b1c,.27,.12),amber=material('Rook Indicator',0xd58527,.28,.14);
 const add=(name:string,g:T.BufferGeometry,m:T.Material,parent:T.Object3D=root)=>{if(g.index)g=g.toNonIndexed();const mesh=new T.Mesh(g,m);mesh.name=name;mesh.castShadow=mesh.receiveShadow=true;parent.add(mesh);return mesh;};
 const box=(name:string,x:number,y:number,z:number,w:number,h:number,l:number,m:T.Material,parent:T.Object3D=root)=>{const o=add(name,new T.BoxGeometry(w,h,l),m,parent);o.position.set(x,y,z);return o;};
 const cylinder=(name:string,x:number,y:number,z:number,r:number,length:number,m:T.Material,axis:'x'|'y'|'z'='y',parent:T.Object3D=root)=>{const o=add(name,new T.CylinderGeometry(r,r,length,12,1),m,parent);if(axis==='x')o.rotation.z=Math.PI/2;if(axis==='z')o.rotation.x=Math.PI/2;o.position.set(x,y,z);return o;};
 const bar=(name:string,a:T.Vector3,b:T.Vector3,r:number,m:T.Material,parent:T.Object3D=root)=>{const o=add(name,new T.CylinderGeometry(r,r,a.distanceTo(b),8),m,parent);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(v(0,1,0),b.clone().sub(a).normalize());return o;};
 const panel=(name:string,nx:number,ny:number,map:(u:number,t:number)=>T.Vector3,n:T.Vector3,m:T.Material=paint,thickness=.018)=>add(name,pressing(nx,ny,map,n,thickness),m);
 const sideX=(y:number,z:number)=>.765-.078*((y-.80)/.42)**2-.051*(Math.max(0,Math.abs(z)-1.28)/.45)**2-.006*Math.exp(-(((y-.795)/.025)**2));
 const endZ=(x:number,sign:number)=>sign*(1.73+.052*Math.max(0,1-(x/.704)**2));
 const lower=(z:number)=>{const dz=Math.min(Math.abs(z-1.09),Math.abs(z+1.09));return dz<.359?Math.max(.405,.34+Math.sqrt(.359**2-dz**2)):.405;};
 const belt=(z:number)=>.973-.047*(Math.max(0,Math.abs(z)-.95)/.78);
 for(const side of [-1,1]){
  const suffix=side<0?'L':'R';
  // Actual arch cut-outs: the rolled lower edge follows the tyre clearance.
  for(const [name,start,end]of [['FrontWing',.48,1.73],['BodyDoor',-.60,.48],['RearWing',-1.73,-.60]]as const){
   panel('panel_'+name+suffix,28,8,(u,t)=>{const z=mix(start,end,u),y=mix(lower(z),belt(z),t);return v(side*sideX(y,z),y,z);},v(side,0,0));
  }
  for(const z of [-1.09,1.09]){
   const points=Array.from({length:25},(_,i)=>{const angle=mix(.15,Math.PI-.15,i/24),y=.34+Math.sin(angle)*.361,Z=z+Math.cos(angle)*.361;return v(side*(sideX(y,Z)+.004),y,Z);});
   add('panel_ArchLip'+suffix+(z>0?'Front':'Rear'),new T.TubeGeometry(new T.CatmullRomCurve3(points),24,.006,6,false),paint);
   panel('Structure wheelhouse '+suffix+(z>0?' front':' rear'),28,4,(u,t)=>{const angle=u*Math.PI,y=.34+Math.sin(angle)*.355,Z=z+Math.cos(angle)*.355;return v(side*mix(.57,.739,t),y,Z);},v(0,1,0),steel,.012);
  }
  panel('panel_Sill'+suffix,36,3,(u,t)=>{const z=mix(-1.67,1.67,u);return v(side*mix(.733,.716,t),mix(.402,.341,t),z);},v(side,-.2,0));
  // Shoulder rolls into the narrower boot and bonnet.
  for(const [name,start,end]of [['FrontShoulder',.48,1.73],['RearShoulder',-1.73,-.98]]as const)
   panel('panel_'+name+suffix,24,5,(u,t)=>{const z=mix(start,end,u),x=side*mix(sideX(belt(z),z),.654,t);return v(x,belt(z)+.029*Math.sin(t*Math.PI/2),u===0&&start===-1.73?endZ(x,-1):u===1&&end===1.73?endZ(x,1):z);},v(side,1,0).normalize());
  box('panel_BodyDoor'+suffix+'Handle',side*.765,.912,-.43,.033,.035,.13,chrome);
  box('panel_BodyDoor'+suffix+'InnerCard',side*.695,.716,-.03,.025,.36,1.02,vinyl);
  box('panel_BodyDoor'+suffix+'ArmRest',side*.66,.75,-.18,.056,.05,.27,inside);
  cylinder('panel_BodyDoor'+suffix+'WindowWinder',side*.654,.79,.17,.02,.018,chrome,'x');
  bar('panel_BodyDoor'+suffix+'WindowWinderStem',v(side*.646,.79,.17),v(side*.646,.735,.13),.008,chrome);
  const window=(name:string,corners:T.Vector3[])=>{const f=classicWindowFrame(corners,side);add('panel_'+name+'Frame',f.frame,paint);add('panel_'+name+'Seal',f.seal,rubber);add('panel_'+name+'Trim',f.trim,chrome);add('glass_'+name,f.glass,glass).castShadow=false;};
  window('BodyDoor'+suffix,[v(side*.70,.985,.48),v(side*.70,.985,-.59),v(side*.575,1.455,-.59),v(side*.575,1.455,.16)]);
  window('Quarter'+suffix,[v(side*.70,.985,-.60),v(side*.70,.985,-.98),v(side*.575,1.455,-.78),v(side*.575,1.455,-.60)]);
  box('panel_BodyDoor'+suffix+'MirrorStem',side*.782,1.017,.34,.07,.012,.012,chrome);
  const mirror=add('panel_BodyDoor'+suffix+'Mirror',new T.SphereGeometry(.065,16,8),chrome);mirror.position.set(side*.821,1.036,.34);mirror.scale.set(.42,.72,1);
  panel('panel_SideSwage'+suffix,36,2,(u,t)=>{const z=mix(-1.58,1.58,u),y=mix(.805,.833,t);return v(side*(sideX(y,z)+.003*Math.sin(t*Math.PI)),y,z);},v(side,0,0));
  for(const z of [-.599,.479])bar('panel_BodyDoor'+suffix+'ShutLine'+z,v(side*(sideX(.438,z)+.001),.438,z),v(side*(sideX(.94,z)+.001),.94,z),.0015,rubber);
  bar('panel_Apillar'+suffix,v(side*.70,.992,.48),v(side*.575,1.453,.16),.013,paint);
  bar('panel_Bpillar'+suffix,v(side*.70,.99,-.596),v(side*.575,1.454,-.596),.012,paint);
  bar('panel_Cpillar'+suffix,v(side*.70,.99,-.98),v(side*.575,1.454,-.78),.026,paint);
 }
 panel('panel_hood',16,22,(u,t)=>{const x=(u*2-1)*.654,z=mix(.48,endZ(x,1),t);return v(x,belt(z)+.029+.043*(1-(x/.654)**2)*Math.sin(t*Math.PI),z);},v(0,1,0));
 panel('panel_Boot',16,16,(u,t)=>{const x=(u*2-1)*.654,z=mix(endZ(x,-1),-.98,t);return v(x,belt(z)+.029+.022*(1-(x/.654)**2)*Math.sin(t*Math.PI),z);},v(0,1,0));
 panel('panel_Roof',18,18,(u,t)=>{const x=(u*2-1)*.575,z=mix(-.78,.16,t);return v(x,1.455+.057*(1-(x/.575)**2)*Math.sin(t*Math.PI),z);},v(0,1,0));
 const windscreen=(name:string,corners:T.Vector3[])=>{const f=classicWindowFrame(corners,1);add('panel_'+name+'Frame',f.frame,paint);add('panel_'+name+'Seal',f.seal,rubber);add('panel_'+name+'Trim',f.trim,chrome);add('glass_'+name,f.glass,glass).castShadow=false;};
 windscreen('Front',[v(-.70,.985,.48),v(.70,.985,.48),v(.575,1.455,.16),v(-.575,1.455,.16)]);
 windscreen('Rear',[v(.70,.985,-.98),v(-.70,.985,-.98),v(-.575,1.455,-.78),v(.575,1.455,-.78)]);
 for(const side of [-1,1])bar('panel_Wiper'+side,v(side*.35,1.002,.457),v(side*.12,1.072,.412),.007,rubber);
 // Closed, bowed end pressings. Lamps nest in shallow cups; bumper has returns.
 for(const front of [true,false]){
  const sign=front?1:-1,label=front?'Front':'Rear';
  panel('panel_'+label+'Valance',24,10,(u,t)=>{const x=(u*2-1)*.704;const z=endZ(x,sign),roll=T.MathUtils.clamp((.704-Math.abs(x))/.05,0,1);return v(x,mix(.42,belt(z)+.029*Math.sin(roll*Math.PI/2),t),z);},v(0,0,sign));
  panel(front?'panel_hoodRolledEdge':'panel_BootRolledEdge',18,4,(u,t)=>{const x=(u*2-1)*.704,z=endZ(x,sign),roll=T.MathUtils.clamp((.704-Math.abs(x))/.05,0,1),top=belt(z)+.029*Math.sin(roll*Math.PI/2);return v(x,top+.002-.029*(1-Math.cos(t*Math.PI/2)),z+sign*(-.018+.024*Math.sin(t*Math.PI/2)));},v(0,.7,sign).normalize());
  panel('panel_bumper_'+(front?'front':'rear'),32,4,(u,t)=>{const x=(u*2-1)*.745;return v(x,mix(.45,.528,t),sign*(1.817-.045*(x/.745)**4+.014*Math.sin(t*Math.PI)));},v(0,0,sign),chrome,.036);
  panel('panel_bumper_'+(front?'front':'rear')+'Rubber',32,2,(u,t)=>{const x=(u*2-1)*.732;return v(x,mix(.475,.496,t),sign*(1.837-.045*(x/.745)**4));},v(0,0,sign),rubber,.01);
  for(const side of [-1,1]){box('Structure '+label+' crash mount '+side,side*.47,.472,sign*1.704,.075,.062,.20,steel);box('panel_bumper_'+(front?'front':'rear')+'Overrider'+side,side*.49,.486,sign*1.84,.055,.126,.035,rubber);}
 }
 box('panel_FrontGrilleRecess',0,.743,1.765,.66,.178,.018,rubber);
 for(let i=0;i<7;i++)box('panel_FrontGrilleSlat'+i,0,.672+i*.023,1.781,.636,.008,.012,chrome);
 for(const side of [-1,1]){
  const cup=cylinder('panel_HeadlightCup'+side,side*.512,.783,1.761,.112,.026,chrome,'z');
  const lens=cylinder('panel_HeadlightLens'+side,side*.512,.783,1.786,.095,.012,headlight,'z');
  for(let i=-3;i<=3;i++){const y=.783+i*.022,w=2*Math.sqrt(.09**2-(i*.022)**2);box('panel_HeadlightFluting'+side+'_'+i,side*.512,y,1.794,w,.003,.002,headlight);}
  box('panel_FrontIndicator'+side,side*.499,.596,1.779,.167,.052,.024,amber);
  box('panel_RearLampBezel'+side,side*.529,.789,-1.769,.119,.211,.026,chrome);
  box('panel_RearIndicator'+side,side*.529,.846,-1.789,.098,.071,.012,amber);
  box('panel_RearBrakelight'+side,side*.529,.762,-1.789,.098,.084,.012,brake);
  box('panel_RearReverse'+side,side*.529,.698,-1.789,.098,.026,.012,headlight);
  cylinder('Structure exhaust outlet '+side,side*.43,.334,-1.738,.026,.17,steel,'z');
 }
 box('panel_RearPlateRecess',0,.739,-1.77,.37,.115,.018,rubber);
 box('panel_RearPlate',0,.739,-1.783,.325,.087,.009,chrome);
 for(const z of [-1.52,1.52])box('Structure cross beam '+z,0,.378,z,1.32,.065,.062,steel);
 for(const side of [-1,1])box('Structure longitudinal rail '+side,side*.465,.353,0,.055,.085,3.12,steel);
 box('Structure floor',0,.433,-.175,1.35,.025,2.38,steel);
 box('Interior Rook carpet',0,.456,-.24,1.30,.021,1.94,vinyl);
 box('Structure firewall',0,.688,.51,1.28,.42,.021,steel);
 box('Interior Rook dashboard',0,.942,.375,1.30,.126,.178,vinyl);
 box('Interior Rook parcel shelf',0,.965,-1.01,1.26,.025,.15,inside);
 for(const side of [-1,1]){
  const seat=add('Interior Rook seat '+side,new T.BoxGeometry(.47,.13,.44,4,2,4),inside);seat.position.set(side*.323,.596,-.19);
  const back=box('Interior Rook seat back '+side,side*.323,.805,-.398,.47,.39,.105,inside);back.rotation.x=-.10;
  for(let i=-2;i<=2;i++)box('Interior Rook seat pleat '+side+'_'+i,side*.323+i*.077,.808,-.337,.005,.31,.005,vinyl);
  box('Structure seat runner '+side,side*.32,.50,-.17,.30,.04,.39,steel);
 }
 box('Interior Rook rear bench',0,.625,-.787,1.14,.125,.32,inside);box('Interior Rook rear backrest',0,.83,-.948,1.14,.29,.085,inside);
 const steering=add('Interior Rook steering rim',new T.TorusGeometry(.147,.011,6,24),rubber);steering.rotation.x=-.27;steering.position.set(-.324,1.029,.186);
 for(let i=0;i<3;i++){const a=i*Math.PI*2/3;bar('Interior Rook steering spoke '+i,v(-.324,1.029,.186),v(-.324+Math.cos(a)*.136,1.029+Math.sin(a)*.132,.186-Math.sin(a)*.035),.006,chrome);}
 bar('Interior Rook steering column',v(-.324,1.029,.186),v(-.324,.847,.41),.015,steel);
 for(const [i,x]of [-.324,-.15].entries()){cylinder('Interior Rook dial '+i,x,.981,.277,i?.026:.048,.012,chrome,'z');cylinder('Interior Rook dial face '+i,x,.981,.268,i?.022:.043,.008,rubber,'z');bar('Interior Rook needle '+i,v(x,.981,.262),v(x-.015,1.003,.262),.0019,headlight);}
 bar('Interior Rook gear lever',v(0,.49,-.01),v(0,.734,.025),.009,steel);const knob=add('Interior Rook gear knob',new T.SphereGeometry(.022,12,8),rubber);knob.position.set(0,.734,.025);
 // Small longitudinal inline-four with visible bay sides and cooling system.
 box('Structure engine block',0,.663,1.06,.325,.26,.40,steel);box('Structure engine sump',0,.506,1.06,.345,.07,.365,steel);
 box('Structure engine valve cover',0,.826,1.05,.216,.082,.40,chrome);
 cylinder('Structure engine air cleaner',.035,.895,1.04,.135,.042,rubber);
 for(let i=0;i<4;i++){bar('Structure intake runner '+i,v(-.16,.759,.91+i*.093),v(-.248,.812,.91+i*.093),.027,steel);bar('Structure engine ignition lead '+i,v(.042,.882,.902+i*.083),v(.127,.83,.902+i*.083),.004,rubber);}
 box('Structure radiator',0,.721,1.57,.615,.329,.050,steel);for(let i=0;i<14;i++)box('Structure radiator fin '+i,-.283+i*.043,.722,1.606,.007,.296,.008,rubber);
 box('Structure battery',.403,.706,1.148,.19,.16,.24,rubber);box('Structure battery terminals',.403,.793,1.148,.11,.016,.12,chrome);
 cylinder('Structure brake reservoir',-.379,.79,.643,.047,.07,inside);
 for(const side of [-1,1]){cylinder('Structure suspension tower '+side,side*.49,.754,1.09,.093,.14,steel);bar('Structure front spring '+side,v(side*.515,.42,1.09),v(side*.49,.754,1.09),.027,steel);}
 for(const [index,name]of ['FL','FR','RL','RR'].entries()){
  const side=index%2?1:-1,wheel=new T.Group();wheel.name='wheel_'+name;wheel.position.set(side*.655,.3400195,(index<2?1:-1)*1.09);root.add(wheel);
  // Closed revolved tyre profile, with a rounded sidewall and grooved crown.
  const profile=[v(.168,-.092,0),v(.235,-.096,0),v(.299,-.089,0),v(.319,-.064,0),v(.32,-.044,0),v(.315,-.041,0),v(.32,-.038,0),v(.32,.038,0),v(.315,.041,0),v(.32,.044,0),v(.319,.064,0),v(.299,.089,0),v(.235,.096,0),v(.168,.092,0),v(.168,-.092,0)].map(p=>new T.Vector2(p.x,p.y));
  const tyre=add('Tire_Rook_'+name,new T.LatheGeometry(profile,28),tire,wheel);tyre.rotation.z=Math.PI/2;
  cylinder('Wheel_Rook_RimBarrel_'+name,0,0,0,.177,.146,rim,'x',wheel);
  cylinder('Wheel_Rook_BrakeDrum_'+name,-side*.064,0,0,.122,.045,steel,'x',wheel);
  const lip=add('Wheel_Rook_RimLip_'+name,new T.TorusGeometry(.176,.014,6,24),rim,wheel);lip.rotation.y=Math.PI/2;lip.position.x=side*.081;
  cylinder('Wheel_Rook_Hub_'+name,side*.084,0,0,.072,.026,chrome,'x',wheel);
  for(let i=0;i<8;i++){const a=i*Math.PI/4,y=Math.cos(a)*.123,z=Math.sin(a)*.123;
   cylinder('Wheel_Rook_Recess_'+name+'_'+i,side*.079,y,z,.022,.004,rubber,'x',wheel);
   if(i%2===0)cylinder('Wheel_Rook_Lug_'+name+'_'+i,side*.104,Math.cos(a)*.047,Math.sin(a)*.047,.008,.013,steel,'x',wheel);
  }
 }
 root.updateMatrixWorld(true);return root;
}
