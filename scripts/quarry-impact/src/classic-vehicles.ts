import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {CLASSIC_VEHICLES,type ClassicKind} from './classic-vehicle-specs';
export {CLASSIC_VEHICLES,type ClassicKind} from './classic-vehicle-specs';
export function buildClassicVehicle(kind:ClassicKind){
 const d=CLASSIC_VEHICLES[kind],wagon=kind==='wagon',root=new T.Group();root.name=d.name;root.userData.classicVehicle=kind;
 const paint=new T.MeshPhysicalMaterial({name:'paint Classic Body',color:d.color,metalness:.45,roughness:.32,clearcoat:.7,clearcoatRoughness:.2});
 const trim=new T.MeshStandardMaterial({name:'paint Paint 2 Classic Trim',color:0x282b29,metalness:.15,roughness:.66});
 const chrome=new T.MeshStandardMaterial({name:'Classic Satin Chrome',color:0xbcc1bc,metalness:.92,roughness:.22});
 const steel=new T.MeshStandardMaterial({name:'Classic Chassis Steel',color:0x343a39,metalness:.65,roughness:.66});
 const rubber=new T.MeshStandardMaterial({name:'Classic Tire',color:0x262727,roughness:.96});
 const upholstery=new T.MeshStandardMaterial({name:'Interior Classic Vinyl',color:0x2f2923,roughness:.93});
 const glass=new T.MeshPhysicalMaterial({name:'Classic Glass',color:0x68858a,transparent:true,opacity:.3,metalness:.15,roughness:.08,side:T.DoubleSide,depthWrite:false});
 const head=new T.MeshStandardMaterial({name:'Classic Headlight',color:0xe9e5cf,emissive:0xf4dfac,emissiveIntensity:.45,roughness:.23});
 const tail=new T.MeshStandardMaterial({name:'Classic Brakelight',color:0x831a10,emissive:0x8e0f05,emissiveIntensity:.4,roughness:.3});
 let serial=0;
 function mesh(name:string,g:T.BufferGeometry,m:T.Material,x=0,y=0,z=0,parent:T.Object3D=root){const o=new T.Mesh(g,m);o.name=name;o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;parent.add(o);return o;}
 function box(name:string,x:number,y:number,z:number,w:number,h:number,l:number,m:T.Material=paint,r=.035,parent:T.Object3D=root){return mesh(name,r?new RoundedBoxGeometry(w,h,l,2,Math.min(r,w/3,h/3,l/3)):new T.BoxGeometry(w,h,l),m,x,y,z,parent);}
 function bar(name:string,a:T.Vector3,b:T.Vector3,r:number,m:T.Material=steel,parent:T.Object3D=root){const o=mesh(name,new T.CylinderGeometry(r,r,a.distanceTo(b),8),m,0,0,0,parent);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());return o;}
 function pane(name:string,points:number[],mat:T.Material,reverse=false){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(points,3));g.setIndex(reverse?[0,2,1,0,3,2]:[0,1,2,0,2,3]);g.setAttribute('uv',new T.Float32BufferAttribute([0,0,1,0,1,1,0,1],2));g.computeVertexNormals();return mesh(name,g,mat);}
 // Side skins have actual wheel openings rather than tires intersecting a box.
 for(const side of [-1,1])for(const [part,a,b]of [['RearQuarter',-d.halfLength,-.84],['BodyDoor',-.82,.72],['FrontFender',.74,d.halfLength]]as const){
  const shape=new T.Shape();shape.moveTo(a,.66);
  for(const z of [-d.wheelbase/2,d.wheelbase/2])if(z-.47>a&&z+.47<b){shape.lineTo(z-.47,.66);for(let i=0;i<=20;i++){const ang=Math.PI-i/20*Math.PI;shape.lineTo(z+Math.cos(ang)*.47,.66+Math.sin(ang)*.47);}}
  shape.lineTo(b,.66);shape.lineTo(b,1.2-(part==='FrontFender'?.08:0));shape.lineTo(a,1.2);shape.closePath();
  const g=new T.ExtrudeGeometry(shape,{depth:.045,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.025,bevelThickness:.012,curveSegments:12});
  // local X is longitudinal; local Z is thickness.
  const o=mesh('panel_'+part+(side<0?'L':'R'),g,paint,side*(d.halfWidth-.03),0,0);o.rotation.y=-Math.PI/2;
 }
 box('Structure floor',0,.69,-.05,1.68,.12,d.halfLength*1.82,steel);
 for(const x of [-.64,.64])box('Structure chassis rail '+x,x,.59,0,.12,.15,d.halfLength*1.8,steel);
 const hoodEnd=.72,hoodStart=d.halfLength-.08,hood=box('panel_hood',0,1.19,(hoodStart+hoodEnd)/2,1.87,.11,hoodStart-hoodEnd,paint,.05);hood.rotation.x=.035;
 if(!wagon){for(const x of [-.44,.44])box('panel_HoodStripe'+x,x,1.253,1.49,.28,.006,1.36,trim,.001);box('panel_HoodScoop',0,1.30,1.18,.58,.11,.48,trim,.025);}
 const roofFront=.18,roofRear=wagon?-1.80:-.81,roofHeight=wagon?1.94:1.84,roofWidth=wagon?1.72:1.62;
 box('panel_BodyRoof',0,roofHeight,(roofFront+roofRear)/2,roofWidth,.085,roofFront-roofRear,paint,.04);
 // Cabin glazing is split into panes with metal pillars and window trim.
 const bottomFront=.76,bottomRear=wagon?-2.22:-1.46,low=1.25,high=roofHeight-.05;
 pane('glass_Windshield',[-.86,low,bottomFront,.86,low,bottomFront,roofWidth/2,high,roofFront,-roofWidth/2,high,roofFront],glass);
 pane('glass_Rear',[-roofWidth/2,high,roofRear,roofWidth/2,high,roofRear,.88,low,bottomRear,-.88,low,bottomRear],glass);
 for(const side of [-1,1]){
  const x=side*.9,topX=side*roofWidth/2,backDoor=wagon?-1.15:-.82;
  pane('glass_BodyDoor'+(side<0?'L':'R'),[x,low,bottomFront,topX,high,roofFront,topX,high,backDoor,x,low,backDoor],glass,side>0);
  if(wagon)pane('glass_Cargo'+side,[x,low,backDoor-.09,topX,high,backDoor-.09,topX,high,roofRear,x,low,bottomRear],glass,side>0);
  else pane('glass_Quarter'+side,[x,low,backDoor-.04,topX,high,backDoor-.04,topX,high,roofRear-.06,x,low,bottomRear],glass,side>0);
  for(const [a,b]of [[new T.Vector3(x,low,bottomFront),new T.Vector3(topX,high,roofFront)],[new T.Vector3(x,low,bottomRear),new T.Vector3(topX,high,roofRear)],[new T.Vector3(x,low,backDoor),new T.Vector3(topX,high,backDoor)]])bar('panel_CabinPillar'+serial++,a,b,.037,paint);
  bar('panel_WindowSill'+side,new T.Vector3(x,low,bottomRear),new T.Vector3(x,low,bottomFront),.018,chrome);
  box('panel_BodyDoor'+(side<0?'L':'R')+'Handle',side*(d.halfWidth+.015),1.13,-.61,.045,.035,.15,chrome,.008);
  box('panel_Mirror'+side,side*(d.halfWidth+.105),1.35,.57,.2,.12,.17,chrome,.022);
  box('panel_BodySill'+side,side*d.halfWidth,.61,-.05,.075,.085,1.60,chrome,.01);
  if(wagon){box('panel_EstateSideTrim'+side,side*(d.halfWidth+.012),.96,-1.7,.015,.12,1.7,trim,.005);bar('panel_RoofRack'+side,new T.Vector3(side*.64,roofHeight+.13,roofRear+.12),new T.Vector3(side*.64,roofHeight+.13,roofFront-.12),.025,chrome);}
 }
 if(wagon){box('panel_Tailgate',0,1.03,-d.halfLength+.10,1.92,.37,.13,paint);for(const z of [-1.5,-.25])box('panel_RackCrossbar'+z,0,roofHeight+.12,z,1.35,.035,.04,chrome,.008);}
 else box('panel_BodyTrunk',0,1.17,-2.02,1.88,.10,.88,paint,.04);
 for(const end of [-1,1]){
  box('panel_'+(end>0?'bumper_front':'bumper_rear'),0,.80,end*(d.halfLength+.03),2.01,.15,.16,chrome,.06);
  box('panel_BumperRubber'+end,0,.82,end*(d.halfLength+.119),1.65,.045,.02,trim,.008);
  box('panel_'+(end>0?'FrontValance':'RearValance'),0,.60,end*(d.halfLength-.05),1.9,.15,.13,paint);
 }
 box('panel_FrontGrille',0,1.035,d.halfLength+.005,1.86,.24,.045,trim,.025);
 for(let x=-.52;x<=.52;x+=.065)box('Grille slat'+serial++,x,1.035,d.halfLength+.035,.015,.20,.02,chrome,.001);
 for(const side of [-1,1]){
  for(let light=0;light<2;light++){const x=side*(.65+light*.23);const ring=mesh('panel_HeadlightRing'+serial++,new T.TorusGeometry(.105,.019,8,24),chrome,x,1.05,d.halfLength+.037);mesh('panel_Headlight'+serial++,new T.CircleGeometry(.092,24),head,x,1.05,d.halfLength+.039);}
  box('panel_TailLight'+side,side*.68,1.07,-d.halfLength-.02,.43,.12,.04,tail,.014);
  const exhaust=mesh('Structure exhaust'+side,new T.CylinderGeometry(.04,.04,.32,12,1,true),steel,side*.7,.52,-d.halfLength-.03);exhaust.rotation.x=Math.PI/2;
 }
 box('Rear license plate',0,.98,-d.halfLength-.038,.38,.11,.012,chrome,.006);
 // An interior, cage and engine remain visible when body panels deform or detach.
 box('Interior dashboard',0,1.19,.49,1.68,.15,.35,upholstery);
 for(const x of [-.44,.44]){box('Interior seat base',x,.93,-.18,.62,.15,.68,upholstery,.06);const back=box('Interior seat back',x,1.18,-.50,.62,.51,.14,upholstery,.06);back.rotation.x=-.12;}
 box('Interior rear bench',0,1.01,-1.1,1.5,.35,.46,upholstery,.05);
 const steering=mesh('Interior steering wheel',new T.TorusGeometry(.18,.015,8,24),trim,-.45,1.33,.27);steering.rotation.x=-.30;
 for(const x of [-.75,.75]){bar('Structure cabin rail '+x,new T.Vector3(x,.75,-.66),new T.Vector3(x,roofHeight-.12,-.66),.026);bar('Structure cabin brace '+x,new T.Vector3(x,roofHeight-.12,-.66),new T.Vector3(x,.78,bottomRear),.025);}
 bar('Structure cabin beam',new T.Vector3(-.75,roofHeight-.12,-.66),new T.Vector3(.75,roofHeight-.12,-.66),.025);
 box('Structure engine block',0,.99,1.45,.69,.33,.68,steel);box('Structure engine cover',0,1.13,1.45,.64,.075,.56,chrome);
 box('Structure radiator',0,1.0,d.halfLength-.25,1.15,.35,.08,steel);
 for(const [i,name]of ['FL','FR','RL','RR'].entries()){
  const wheel=new T.Group();wheel.name='wheel_'+name;wheel.position.set((i%2?1:-1)*(d.halfWidth-.04),.61,(i<2?1:-1)*d.wheelbase/2);root.add(wheel);
  const tire=mesh('Classic Tire '+name,new T.CylinderGeometry(.375,.375,.27,36,1,true),rubber,0,0,0,wheel);tire.rotation.z=Math.PI/2;
  for(const side of [-1,1]){const sidewall=mesh('Classic Tire sidewall '+name+side,new T.RingGeometry(.225,.375,36),rubber,side*.136,0,0,wheel);sidewall.rotation.y=side*Math.PI/2;
   const rim=mesh('Classic SteelWheel '+name+side,new T.CylinderGeometry(.225,.225,.055,24),chrome,side*.13,0,0,wheel);rim.rotation.z=Math.PI/2;
   const hub=mesh('Classic Hub '+name+side,new T.CylinderGeometry(.105,.105,.025,20),trim,side*.169,0,0,wheel);hub.rotation.z=Math.PI/2;
   for(let j=0;j<8;j++){const a=j/8*Math.PI*2,hole=mesh('Classic wheel vent '+serial++,new T.CircleGeometry(.031,8),trim,side*.159,Math.sin(a)*.163,Math.cos(a)*.163,wheel);hole.rotation.y=side*Math.PI/2;}}
  for(let j=0;j<36;j++){const a=j/36*Math.PI*2;const block=box('Classic Tire tread '+serial++,0,Math.sin(a)*.374,Math.cos(a)*.374,.26,.015,.031,rubber,.003,wheel);block.rotation.x=-a;}
 }
 // Existing GLBs use non-indexed decoration batches. Normalize only these
 // authored primitives so indexed rings and rounded-box parts merge together.
 root.traverse(o=>{if(o instanceof T.Mesh&&o.geometry.index){const indexed=o.geometry;o.geometry=indexed.toNonIndexed();indexed.dispose();}});
 root.updateMatrixWorld(true);return root;
}
