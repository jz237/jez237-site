import * as T from 'three';
import {formedVehiclePanel,panelSamples} from './formed-vehicle-panel';
import {classicWindowFrame} from './classic-window-frame';
import {addRoadWheels} from './road-wheels';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z),mix=T.MathUtils.lerp;
/** Original 1960s European microcar: rounded egg-shaped two-door saloon with a
 * short front luggage lid, big round lamps in pods, a fabric sunroof, small
 * wheels on a narrow track, chrome bumpers and a louvred rear engine lid over
 * an air-cooled twin driving the rear wheels. Nose +Z. */
export function buildPipitAsset(){
 const root=new T.Group();root.name='Pipit600';
 const mat=(name:string,color:number,roughness=.6,metalness=.15)=>new T.MeshPhysicalMaterial({name,color,roughness,metalness});
 const paint=mat('paint_Pipit',0x9cc7c0,.34,.12);paint.clearcoat=.8;
 const chrome=mat('Pipit Chrome',0xe2e5e7,.12,1),steel=mat('Structure Pipit Steel',0x383f45,.66,.65),rubber=mat('Pipit Rubber',0x161819,.9),vinyl=mat('Interior Pipit Vinyl',0xd9ccb0,.72),dash=mat('Interior Pipit Dash',0x2b2a28,.8),ivory=mat('Interior Pipit Ivory',0xeee6d2,.4),canvas=mat('Pipit Sunroof Canvas',0x2e2c29,.95),glass=mat('Pipit Glass',0x3f5560,.06,.1),white=mat('Pipit Lens',0xf3efe2,.18),red=mat('Pipit Tail Lens',0xae141e,.22),amber=mat('Pipit Amber Lens',0xe08d22,.25),plate=mat('Pipit Plate',0xe9e7df,.6);
 glass.transparent=true;glass.opacity=.42;glass.depthWrite=false;
 const add=(name:string,g:T.BufferGeometry,m:T.Material)=>{if(g.index)g=g.toNonIndexed();const o=new T.Mesh(g,m);o.name=name;o.castShadow=o.receiveShadow=true;root.add(o);return o;};
 const box=(name:string,x:number,y:number,z:number,w:number,h:number,d:number,m:T.Material)=>{const o=add(name,new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);return o;};
 const panel=(name:string,nu:number,nv:number,map:(u:number,t:number)=>T.Vector3,n:T.Vector3,m:T.Material=paint,depth=.02)=>add(name,formedVehiclePanel(panelSamples(nu),panelSamples(nv),map,n,depth),m);
 const bar=(name:string,a:T.Vector3,b:T.Vector3,r:number,m:T.Material)=>{const o=add(name,new T.CylinderGeometry(r,r,a.distanceTo(b),8),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(v(0,1,0),b.clone().sub(a).normalize());return o;};
 const tube=(name:string,points:T.Vector3[],r:number,m:T.Material,closed=false)=>add(name,new T.TubeGeometry(new T.CatmullRomCurve3(points,closed),Math.max(8,points.length+2),r,6,closed),m);
 const disc=(name:string,r:number,depth:number,m:T.Material,p:T.Vector3,axis=v(0,0,1))=>{const o=add(name,new T.CylinderGeometry(r,r,depth,20),m);o.position.copy(p);o.quaternion.setFromUnitVectors(v(0,1,0),axis);return o;};
 const window=(name:string,c:T.Vector3[],side:number)=>{const f=classicWindowFrame(c,side);add('panel_'+name+'Frame',f.frame,paint);add('panel_'+name+'Seal',f.seal,rubber);add('glass_'+name,f.glass,glass).castShadow=false;};
 // Egg plan and section: widest at mid-flank, rolling under to the sills and in to the waist.
 const END=1.48,plan=(z:number)=>1-.30*(Math.abs(z)/END)**3.2;
 const width=(y:number,z:number)=>.645*plan(z)*(1-.16*((y-.52)/.34)**2);
 // Shoulder line: short luggage lid curving down over the nose, level waist, falling engine lid.
 const SH=(z:number)=>z>.50?.85-.29*((z-.50)/.98)**2:z>-1.0?.85+.02*(.50-z)/1.5:.87-.25*((-1.0-z)/.48)**1.7;
 const arch=(z:number)=>{const d=Math.min(Math.abs(z-.925),Math.abs(z+.925));return d<.31?.28+Math.sqrt(.31**2-d*d):.28;};
 const belt=(z:number,side:number)=>v(side*(width(SH(z)+.01,z)-.012),SH(z)+.01,z);
 const RW=.42,roofY=(x:number,z:number)=>1.29+.07*Math.max(0,1-(x/RW)**2)*Math.max(0,1-((z+.33)/.39)**2);
 const lidY=(x:number,z:number,front:boolean)=>{const t=front?(z-.50)/.98:(-1.0-z)/.48,w=width(SH(z),z);return SH(z)+.05*Math.max(0,1-(x/w)**2)*(1-.6*t);};
 // The nose and tail bulge forward/back at mid-height and roll in top and bottom.
 const endFace=(sign:number,u:number,t:number)=>{const z0=sign*END,y=mix(.28,SH(z0),t),w=width(y,z0),x=(u*2-1)*w,c=1-(x/w)**2;return v(x,y+.02*c*t,z0+sign*.06*c*Math.sin(Math.PI*t));};
 for(const side of [-1,1]){
  const suffix=side<0?'L':'R';
  for(const [name,a,b]of [['RearQuarter',-END,-.30],['BodyDoor',-.30,.50],['FrontWing',.50,END]]as const){
   const stem='panel_'+name+suffix+'Pipit';
   panel(stem,name==='BodyDoor'?14:24,8,(u,t)=>{const z=mix(a,b,u),y=mix(arch(z),SH(z),t);return v(side*width(y,z),y,z);},v(side,0,0));
   if(name==='BodyDoor'){box(stem+'Handle',side*(width(.76,-.20)+.012),.76,-.20,.025,.025,.12,chrome);box(stem+'InnerCard',side*(width(.65,.10)-.04),.52,.10,.03,.26,b-a-.08,vinyl);}
  }
  // Greenhouse: framed door and quarter lights, slim A/B pillars and a broad C pillar.
  window('BodyDoor'+suffix+'Pipit',[belt(.42,side),belt(-.28,side),v(side*RW,1.29,-.28),v(side*RW,1.29,.04)],side);
  window('Quarter'+suffix+'Pipit',[belt(-.34,side),belt(-.86,side),v(side*RW,1.29,-.64),v(side*RW,1.29,-.34)],side);
  const pillar=(name:string,a0:T.Vector3,a1:T.Vector3,b0:T.Vector3,b1:T.Vector3)=>panel(name,4,8,(u,t)=>a0.clone().lerp(a1,t).lerp(b0.clone().lerp(b1,t),u),v(side,.3,0),paint,.016);
  pillar('panel_PipitAPillar'+suffix,belt(.50,side),v(side*RW,1.29,.06),belt(.42,side),v(side*RW,1.29,.04));
  pillar('panel_PipitBPillar'+suffix,belt(-.28,side),v(side*RW,1.29,-.28),belt(-.34,side),v(side*RW,1.29,-.34));
  pillar('panel_RearQuarter'+suffix+'PipitPillar',belt(-.86,side),v(side*RW,1.29,-.64),belt(-.98,side),v(side*(RW-.02),1.29,-.72));
  tube('panel_PipitBeltTrim'+suffix,Array.from({length:12},(_,i)=>{const z=mix(.48,-.96,i/11);return belt(z,side).add(v(side*.01,.002,0));}),.008,chrome);
  box('panel_PipitSill'+suffix,side*(width(.30,0)+.006),.30,0,.02,.03,1.12,chrome);
  for(const z of [-.30,.50])bar('panel_PipitDoorSeam'+suffix+z,v(side*width(.28,z),.28,z),v(side*width(SH(z),z),SH(z),z),.003,rubber);
  bar('panel_BodyDoor'+suffix+'PipitMirrorArm',v(side*.53,.88,.44),v(side*.62,.93,.42),.008,chrome);
  const mirror=add('panel_BodyDoor'+suffix+'PipitMirror',new T.SphereGeometry(.042,12,8),chrome);mirror.position.set(side*.64,.95,.41);mirror.scale.set(1,.8,1.2);
  // Big round lamps in body-colour pods on the shoulders of the nose.
  disc('panel_PipitHeadlightPod'+side,.105,.18,paint,v(side*.31,.50,1.43));
  disc('panel_PipitHeadlight'+side,.086,.02,white,v(side*.31,.50,1.525));
  const bezel=add('panel_PipitHeadlightBezel'+side,new T.TorusGeometry(.093,.012,6,20),chrome);bezel.position.set(side*.31,.50,1.529);
  const flank=width(.50,1.30)+.004;disc('panel_PipitFrontIndicator'+side,.026,.016,amber,v(side*flank,.50,1.30),v(side,0,.25).normalize());
  const tailAt=(x:number,y:number)=>{const t=(y-.28)/(SH(-END)-.28),w=width(y,-END),c=1-(x/w)**2;return -END-.06*c*Math.sin(Math.PI*t);};
  disc('panel_PipitRearLamp'+side,.046,.03,red,v(side*.31,.50,tailAt(.31,.50)-.004),v(0,0,-1));
  disc('panel_PipitRearIndicator'+side,.03,.03,amber,v(side*.31,.405,tailAt(.31,.405)-.004),v(0,0,-1));
  for(const z of [-.925,.925]){
   panel('Structure Pipit wheelhouse '+suffix+z,16,3,(u,t)=>v(side*mix(.36,.58,t),.28+Math.sin(u*Math.PI)*.31,z+Math.cos(u*Math.PI)*.31),v(0,1,0),steel,.016);
   tube('panel_PipitArchTrim'+suffix+z,Array.from({length:17},(_,i)=>{const a=mix(.1,Math.PI-.1,i/16),y=.28+Math.sin(a)*.312,zz=z+Math.cos(a)*.312;return v(side*(width(y,zz)+.006),y,zz);}),.009,rubber);
  }
 }
 // Short front luggage lid, rounded nose and the egg-shaped tail with its engine lid.
 panel('panel_hoodPipit',16,16,(u,t)=>{const z=mix(.50,END,t),w=width(SH(z),z),x=(u*2-1)*w;return v(x,lidY(x,z,true),z);},v(0,1,0));
 panel('panel_PipitNose',16,10,(u,t)=>endFace(1,u,t),v(0,0,1));
 panel('panel_EngineLidPipit',16,10,(u,t)=>{const z=mix(-1.0,-END,t),w=width(SH(z),z),x=(u*2-1)*w;return v(x,lidY(x,z,false),z);},v(0,1,0));
 panel('panel_PipitTail',16,10,(u,t)=>endFace(-1,u,t),v(0,0,-1));
 for(let i=0;i<6;i++){const zc=-1.08-i*.046;panel('panel_EngineLidPipitLouvre'+i,8,1,(u,t)=>{const x=(u*2-1)*.23,z=zc+(t-.5)*.024;return v(x,lidY(x,z,false)+.004+.006*t,z);},v(0,1,0),rubber,.006);}
 box('panel_EngineLidPipitHandle',0,lidY(0,-1.40,false)-.01,-1.41,.12,.02,.03,chrome);
 // Bubble glasshouse: raked screen, domed roof with a roll-back fabric sunroof, rear light.
 window('FrontPipit',[belt(.50,-1),belt(.50,1),v(RW,1.29,.06),v(-RW,1.29,.06)],1);
 window('RearPipit',[belt(-.98,-1),belt(-.98,1),v(RW-.02,1.29,-.72),v(-(RW-.02),1.29,-.72)],-1);
 panel('panel_RoofPipit',16,14,(u,t)=>{const x=(u*2-1)*RW,z=mix(-.72,.06,t);return v(x,roofY(x,z),z);},v(0,1,0));
 panel('panel_PipitSunroof',10,10,(u,t)=>{const x=(u*2-1)*.27,z=mix(-.58,-.02,t);return v(x,roofY(x,z)+.007,z);},v(0,1,0),canvas,.008);
 const onRoof=(x:number,z:number,lift:number)=>v(x,roofY(x,z)+lift,z);
 tube('panel_PipitSunroofFrame',[onRoof(-.28,-.01,.012),onRoof(0,-.01,.012),onRoof(.28,-.01,.012),onRoof(.29,-.30,.012),onRoof(.28,-.59,.012),onRoof(0,-.59,.012),onRoof(-.28,-.59,.012),onRoof(-.29,-.30,.012)],.009,chrome,true);
 for(const z of [-.12,-.25,-.38])tube('panel_PipitSunroofFold'+z,Array.from({length:7},(_,i)=>onRoof((i/6*2-1)*.26,z,.012)),.007,canvas);
 tube('panel_PipitSunroofRoll',Array.from({length:7},(_,i)=>onRoof((i/6*2-1)*.26,-.52,.022)),.024,canvas);
 for(const side of [-1,1])bar('panel_PipitWiper'+side,v(side*.30,.885,.48),v(side*.10,.97,.42),.006,chrome);
 // Slim chrome bumpers with overriders, a plain nose badge and moustache trim.
 for(const sign of [-1,1]){
  const name=sign===1?'front':'rear';
  panel('panel_bumper_'+name+'Pipit',20,4,(u,t)=>{const x=(u*2-1)*.46;return v(x,mix(.30,.37,t),sign*(1.53-.14*(x/.46)**4));},v(0,0,sign),chrome,.03);
  for(const side of [-1,1]){box('panel_bumper_'+name+'PipitOverrider'+side,side*.21,.36,sign*1.535,.045,.12,.05,chrome);box('Structure Pipit bumper mount '+name+side,side*.30,.33,sign*1.44,.06,.06,.14,steel);}
 }
 const noseAt=(x:number,y:number)=>{const t=(y-.28)/(SH(END)-.28),w=width(y,END),c=1-(x/w)**2;return END+.06*c*Math.sin(Math.PI*t);};
 tube('panel_PipitNoseTrim',Array.from({length:9},(_,i)=>{const x=(i/8*2-1)*.15,y=.44-.025*(x/.15)**2;return v(x,y,noseAt(x,y)+.006);}),.007,chrome);
 disc('panel_PipitNoseBadge',.032,.012,chrome,v(0,.50,noseAt(0,.50)+.004));
 box('panel_PipitRearPlate',0,.465,-1.545,.26,.09,.012,plate);box('panel_PipitPlateLamp',0,.52,-1.542,.08,.02,.025,chrome);
 // Cabin: two front buckets, a small rear bench, a painted dash with one big dial.
 for(const side of [-1,1]){
  box('Interior Pipit SeatBase'+side,side*.25,.39,-.12,.40,.10,.42,vinyl);const back=box('Interior Pipit SeatBack'+side,side*.25,.65,-.36,.40,.44,.10,vinyl);back.rotation.x=-.15;
 }
 box('Interior Pipit RearBench',0,.39,-.70,.96,.10,.32,vinyl);const rear=box('Interior Pipit RearBack',0,.61,-.86,.96,.36,.10,vinyl);rear.rotation.x=-.2;
 box('Interior Pipit Dashboard',0,.80,.40,1.0,.10,.16,paint);box('Interior Pipit DashPad',0,.86,.38,.94,.03,.12,dash);
 disc('Interior Pipit Speedo',.06,.012,ivory,v(-.27,.81,.316));
 const wheel=add('Interior SteeringWheel Pipit',new T.TorusGeometry(.17,.012,8,28),ivory);wheel.position.set(-.27,.82,.15);wheel.rotation.x=.45;
 for(const side of [-1,1])bar('Interior Pipit SteeringSpoke'+side,v(-.27,.82,.15),v(-.27+side*.16,.82,.15),.008,chrome);
 bar('Interior Pipit SteeringColumn',v(-.27,.82,.15),v(-.27,.70,.38),.014,dash);bar('Interior Pipit GearLever',v(0,.31,.08),v(0,.57,.02),.009,chrome);
 // Structure: twin rails, floor pan, front fuel tank, the rear twin and its exhaust.
 for(const side of [-1,1])box('Structure Pipit chassis rail'+side,side*.34,.23,0,.07,.07,2.7,steel);
 box('Structure Pipit floor',0,.26,-.2,1.04,.04,2.1,steel);
 box('Structure Pipit fuel tank',0,.47,1.02,.5,.16,.30,steel);
 box('Structure Pipit rear twin',0,.47,-1.20,.46,.24,.34,steel);
 for(const side of [-1,1]){const barrel=add('Structure Pipit cylinder'+side,new T.CylinderGeometry(.06,.06,.16,12),chrome);barrel.position.set(side*.08,.67,-1.22);}
 disc('Structure Pipit cooling fan',.12,.05,steel,v(0,.57,-1.02));
 bar('Structure Pipit exhaust',v(-.12,.35,-1.25),v(-.24,.23,-1.52),.022,chrome);box('Structure Pipit silencer',-.2,.26,-1.38,.16,.08,.16,steel);
 addRoadWheels(root,'marten');for(const [i,name]of ['FL','FR','RL','RR'].entries()){const w=root.getObjectByName('wheel_'+name)!;w.position.set((i%2?1:-1)*.50,.28,(i<2?1:-1)*.925);w.scale.setScalar(.26/.32);}
 root.updateMatrixWorld(true);return root;
}
