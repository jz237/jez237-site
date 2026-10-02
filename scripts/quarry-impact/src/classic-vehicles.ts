import {stampedPanel} from './classic-panel';
import * as T from 'three';
import {wreckTopology} from './wreck-topology';
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {CLASSIC_VEHICLES,type ClassicKind} from './classic-vehicle-specs';
export {CLASSIC_VEHICLES,type ClassicKind} from './classic-vehicle-specs';
export function buildClassicVehicle(kind:Exclude<ClassicKind,'utility'>){
 const d=CLASSIC_VEHICLES[kind],wagon=kind==='wagon',root=new T.Group();root.name=d.name;root.userData.classicVehicle=kind;
 const paint=new T.MeshPhysicalMaterial({name:'paint Classic Body',color:d.color,metalness:.45,roughness:.32,clearcoat:.7,clearcoatRoughness:.2});
 const trim=new T.MeshStandardMaterial({name:'paint Paint 2 Classic Trim',color:0x282b29,metalness:.15,roughness:.66});
 const chrome=new T.MeshStandardMaterial({name:'Classic Satin Chrome',color:0xbcc1bc,metalness:.92,roughness:.22});
 const steel=new T.MeshStandardMaterial({name:'Classic Chassis Steel',color:0x343a39,metalness:.65,roughness:.66});
 const rubber=new T.MeshStandardMaterial({name:'Classic Tire',color:0x262727,roughness:.96});
 const upholstery=new T.MeshStandardMaterial({name:'Interior Classic Vinyl',color:0x2f2923,roughness:.93});
 const glass=new T.MeshPhysicalMaterial({name:'Classic Glass',color:0x293b43,transparent:true,opacity:.55,metalness:.15,roughness:.08,side:T.DoubleSide,depthWrite:false});
 const head=new T.MeshStandardMaterial({name:'Classic Headlight',color:0xe9e5cf,emissive:0xf4dfac,emissiveIntensity:.45,roughness:.23});
 const tail=new T.MeshStandardMaterial({name:'Classic Brakelight',color:0x831a10,emissive:0x8e0f05,emissiveIntensity:.4,roughness:.3});
 let serial=0;
 function mesh(name:string,g:T.BufferGeometry,m:T.Material,x=0,y=0,z=0,parent:T.Object3D=root){const o=new T.Mesh(g,m);o.name=name;o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;parent.add(o);return o;}
 function box(name:string,x:number,y:number,z:number,w:number,h:number,l:number,m:T.Material=paint,r=.035,parent:T.Object3D=root){return mesh(name,r>=.005?new RoundedBoxGeometry(w,h,l,2,Math.min(r,w/3,h/3,l/3)):new T.BoxGeometry(w,h,l),m,x,y,z,parent);}
 function bar(name:string,a:T.Vector3,b:T.Vector3,r:number,m:T.Material=steel,parent:T.Object3D=root){const o=mesh(name,new T.CylinderGeometry(r,r,a.distanceTo(b),8),m,0,0,0,parent);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());return o;}
 function pane(name:string,points:number[],mat:T.Material,reverse=false){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(points,3));g.setIndex(reverse?[0,2,1,0,3,2]:[0,1,2,0,2,3]);g.setAttribute('uv',new T.Float32BufferAttribute([0,0,1,0,1,1,0,1],2));g.computeVertexNormals();
  if(mat===paint){const normal=new T.Vector3().fromBufferAttribute(g.attributes.normal,0),verts=[...points];for(let i=0;i<4;i++)verts.push(points[i*3]-normal.x*.025,points[i*3+1]-normal.y*.025,points[i*3+2]-normal.z*.025);const indices=Array.from(g.index!.array);indices.push(...indices.slice().reverse().map(i=>i+4));for(let i=0;i<4;i++){const j=(i+1)%4;indices.push(...(reverse?[i,j,j+4,i,j+4,i+4]:[i,j+4,j,i,i+4,j+4]));}g.setAttribute('position',new T.Float32BufferAttribute(verts,3));g.setAttribute('uv',new T.Float32BufferAttribute([0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1],2));g.setIndex(indices);g.deleteAttribute('normal');g.computeVertexNormals();}
  if(mat===glass){const corners=Array.from({length:4},(_,i)=>new T.Vector3().fromArray(points,i*3)),normal=new T.Vector3().fromBufferAttribute(g.attributes.normal,0),pos:number[]=[],tex:number[]=[],idx:number[]=[];const n=10;
   for(let y=0;y<=n;y++)for(let x=0;x<=n;x++){const u=x/n,v=y/n,low=corners[0].clone().lerp(corners[1],u),high=corners[3].clone().lerp(corners[2],u),p=low.lerp(high,v).addScaledVector(normal,.018*Math.sin(u*Math.PI)*Math.sin(v*Math.PI));pos.push(p.x,p.y,p.z);tex.push(u,v);}
   for(let y=0;y<n;y++)for(let x=0;x<n;x++){const a=y*(n+1)+x;idx.push(...(reverse?[a,a+n+2,a+1,a,a+n+1,a+n+2]:[a,a+1,a+n+2,a,a+n+2,a+n+1]));}g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(tex,2));g.setIndex(idx);g.deleteAttribute('normal');g.computeVertexNormals();}
  return mesh(name,g,mat);}
 const belt=(z:number)=>1.23-(z> .75?.075*(z-.75)/(d.halfLength-.75):.025*Math.max(0,(-z-d.wheelbase/2)/(d.halfLength-d.wheelbase/2)));
 // A pressed side has a lower tuck, a shoulder and narrower nose/tail.
 const sideWidth=(z:number,y:number)=>d.halfWidth*(.91+.08*T.MathUtils.smoothstep(y,.40,1.04)-.035*T.MathUtils.smoothstep(y,1.08,1.25))*(1-.055*T.MathUtils.smoothstep(Math.abs(z),d.halfLength-.65,d.halfLength));
 function ribbon(name:string,points:T.Vector3[],radius:number,material:T.Material){return mesh(name,new T.TubeGeometry(new T.CatmullRomCurve3(points),Math.max(8,Math.min(64,points.length*2)),radius,5,false),material);}
 // Side skins have actual wheel openings rather than tires intersecting a box.
 const sideParts:[string,number,number][]=wagon?[['RearQuarter',-d.halfLength,-1.57],['BodyDoorRear',-1.55,-.62],['BodyDoor',-.60,.72],['FrontFender',.74,d.halfLength]]:[['RearQuarter',-d.halfLength,-.84],['BodyDoor',-.82,.72],['FrontFender',.74,d.halfLength]];
 for(const side of [-1,1])for(const [part,a,b]of sideParts){
  const outline:T.Vector2[]=[];
  for(let j=0;j<=80;j++){const z=a+(b-a)*j/80;let y=.40+.17*T.MathUtils.smoothstep(Math.abs(z),d.halfLength-.58,d.halfLength);for(const center of [-d.wheelbase/2,d.wheelbase/2])if(Math.abs(z-center)<.455)y=Math.max(y,.61+Math.sqrt(.455**2-(z-center)**2));outline.push(new T.Vector2(z,y));}
  for(let j=0;j<=24;j++){const z=b+(a-b)*j/24;outline.push(new T.Vector2(z,belt(z)));}
  const simple=outline.filter((p,i)=>{const a=outline[(i+outline.length-1)%outline.length],b=outline[(i+1)%outline.length];return Math.abs((p.x-a.x)*(b.y-p.y)-(p.y-a.y)*(b.x-p.x))>1e-7;});const shape=new T.Shape(simple);shape.closePath();
  const extruded=new T.ExtrudeGeometry(shape,{depth:.045,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.008,bevelThickness:.012,curveSegments:12});
  const refined=wreckTopology(extruded,.12);extruded.dispose();let g=refined.toNonIndexed();refined.dispose();
  const positions=g.attributes.position;
  for(let i=0;i<positions.count;i++){const z=positions.getX(i),y=positions.getY(i),thickness=positions.getZ(i);positions.setXYZ(i,side*(sideWidth(z,y)+thickness-.0225),y,z);}
  // Mapping the extrusion to the right side reverses its orientation.
  if(side>0){for(let i=0;i<positions.count;i+=3)for(const key of Object.keys(g.attributes)){const attr=g.attributes[key];for(let c=0;c<attr.itemSize;c++){const a=attr.array[(i+1)*attr.itemSize+c];attr.array[(i+1)*attr.itemSize+c]=attr.array[(i+2)*attr.itemSize+c];attr.array[(i+2)*attr.itemSize+c]=a;}}}
  g.deleteAttribute('normal');const welded=mergeVertices(g,.00001);g.dispose();welded.computeVertexNormals();g=welded.toNonIndexed();welded.dispose();mesh('panel_'+part+(side<0?'L':'R'),g,paint);
  const shoulder:number[]=[];
  for(let j=0;j<24;j++){const z0=a+(b-a)*j/24,z1=a+(b-a)*(j+1)/24;for(const [z,inset]of [[z0,0],[z1,0],[z1,1],[z0,0],[z1,1],[z0,1]])shoulder.push(side*(sideWidth(z,belt(z))-.09*inset),belt(z)+.025*inset,z);}
  const sg=new T.BufferGeometry();sg.setAttribute('position',new T.Float32BufferAttribute(shoulder,3));sg.setAttribute('uv',new T.Float32BufferAttribute(new Array(shoulder.length/3*2).fill(0),2));
  if(side>0){const p=sg.attributes.position;for(let i=0;i<p.count;i+=3){const v=new T.Vector3().fromBufferAttribute(p,i+1);p.setXYZ(i+1,p.getX(i+2),p.getY(i+2),p.getZ(i+2));p.setXYZ(i+2,v.x,v.y,v.z);}}
  sg.computeVertexNormals();mesh('panel_'+part+(side<0?'L':'R')+'Shoulder',sg,paint);
  const crease=Array.from({length:20},(_,j)=>{const z=a+(b-a)*j/19,y=belt(z)-.075;return new T.Vector3(side*(sideWidth(z,y)+.026),y,z);});
  ribbon('panel_'+part+(side<0?'L':'R')+'BeltTrim',crease,wagon?.009:.004,wagon?chrome:paint);
  for(const z of [-d.wheelbase/2,d.wheelbase/2]){const arch=Array.from({length:65},(_,j)=>{const angle=Math.PI-j/64*Math.PI,long=z+Math.cos(angle)*.463,y=.61+Math.sin(angle)*.463;return new T.Vector3(side*(sideWidth(long,y)+.024),y,long);}).filter(p=>p.z>=a&&p.z<=b);if(arch.length>1)ribbon('panel_'+part+(side<0?'L':'R')+'ArchLip',arch,.012,wagon?chrome:paint);}
 }
 box('Structure floor',0,.49,-.05,1.68,.12,d.halfLength*1.82,steel);
 for(const x of [-.64,.64])box('Structure chassis rail '+x,x,.43,0,.12,.15,d.halfLength*1.8,steel);
 const hoodEnd=.72,hoodStart=d.halfLength-.08,hoodZ=(hoodStart+hoodEnd)/2,hoodLength=hoodStart-hoodEnd;
 const hood=mesh('panel_hood',stampedPanel(1.85,hoodLength,.045,.026,-.028),paint,0,1.207,hoodZ);
 if(!wagon){
  for(const x of [-.43,.43]){const stripe=mesh('panel_HoodStripe'+x,stampedPanel(.23,hoodLength-.13,.002,.001,-.026),trim,x,1.233,hoodZ);}
  const scoop=box('panel_HoodScoop',0,1.275,1.20,.47,.055,.48,paint,.025);scoop.rotation.x=.08;box('panel_HoodScoopIntake',0,1.275,1.439,.34,.022,.012,trim,.004);
 }
 const roofFront=.18,roofRear=wagon?-2.17:-1.08,roofHeight=wagon?1.82:1.69,roofWidth=wagon?1.68:1.52;
 mesh('panel_BodyRoof',stampedPanel(roofWidth,roofFront-roofRear,.04,.045),paint,0,roofHeight,(roofFront+roofRear)/2);
 // Cabin glazing is split into panes with metal pillars and window trim.
 const bottomFront=.76,bottomRear=wagon?-2.58:-1.73,low=1.25,high=roofHeight-.05;
 pane('glass_Windshield',[-.80,low,bottomFront,.80,low,bottomFront,roofWidth/2-.055,high,roofFront,-roofWidth/2+.055,high,roofFront],glass);
 pane('glass_Rear',[-roofWidth/2+.055,high,roofRear,roofWidth/2-.055,high,roofRear,.79,low,bottomRear,-.79,low,bottomRear],glass);
 for(const side of [-1,1]){
  const x=side*.9,topX=side*roofWidth/2,backDoor=wagon?-.60:-.55;
  pane('glass_BodyDoor'+(side<0?'L':'R'),[x,low,bottomFront,topX,high,roofFront,topX,high,backDoor,x,low,backDoor],glass,side>0);
  if(wagon){pane('glass_BodyDoorRear'+(side<0?'L':'R'),[x,low,-.65,topX,high,-.65,topX,high,-1.53,x,low,-1.53],glass,side>0);pane('glass_Cargo'+side,[x,low,-1.60,topX,high,-1.60,topX,high,roofRear,x,low,bottomRear],glass,side>0);}
  else pane('glass_Quarter'+side,[x,low,backDoor-.06,topX,high,backDoor-.06,topX,high,roofRear-.01,x,low,bottomRear+.23],glass,side>0);
  pane('panel_WindshieldFrame'+side,[x,low,bottomFront,side*.80,low,bottomFront,topX-side*.055,high,roofFront,topX,high,roofFront],paint,side>0);
  pane('panel_RearWindowFrame'+side,[x,low,bottomRear,side*.79,low,bottomRear,topX-side*.055,high,roofRear,topX,high,roofRear],paint,side<0);
  const pillar=(name:string,bottom:number,top:number,widthBottom:number,widthTop:number)=>pane(name,[x+side*.008,low-.015,bottom+widthBottom/2,topX+side*.008,roofHeight+.015,top+widthTop/2,topX+side*.008,roofHeight+.015,top-widthTop/2,x+side*.008,low-.015,bottom-widthBottom/2],paint,side>0);
  pillar('panel_CabinPillarA'+side,bottomFront,roofFront,.075,.065);
  pillar('panel_CabinPillarB'+side,backDoor-.025,backDoor-.025,.065,.065);
  if(wagon)pillar('panel_CabinPillarRearDoor'+side,-1.565,-1.565,.065,.065);
  pillar('panel_CabinPillarC'+side,bottomRear+(wagon?.015:.10),roofRear,.12+(wagon?0:.18),.10);
  for(const z of [bottomFront,bottomRear])bar('seal_Cabin'+serial++,new T.Vector3(x,low,z),new T.Vector3(topX,high,z===bottomFront?roofFront:roofRear),.014,trim);
  ribbon('panel_RoofGutter'+side,[new T.Vector3(topX,roofHeight,roofRear-.025),new T.Vector3(topX+side*.022,roofHeight+.008,(roofRear+roofFront)/2),new T.Vector3(topX,roofHeight,roofFront+.025)],.012,chrome);
  bar('panel_WindowSill'+side,new T.Vector3(x,low,bottomRear),new T.Vector3(x,low,bottomFront),.018,chrome);
  box('panel_BodyDoor'+(side<0?'L':'R')+'Handle',side*(d.halfWidth+.015),1.13,wagon?-.46:-.61,.045,.035,.15,chrome,.008);
  if(wagon)box('panel_BodyDoorRear'+(side<0?'L':'R')+'Handle',side*(d.halfWidth+.015),1.13,-1.40,.045,.035,.15,chrome,.008);
  box('panel_Mirror'+side,side*(d.halfWidth+.105),1.35,.57,.2,.12,.17,chrome,.022);
  box('panel_BodySill'+side,side*d.halfWidth*.94,.44,-.05,.075,.09,1.60,chrome,.01);
  if(wagon){bar('panel_RoofRack'+side,new T.Vector3(side*.64,roofHeight+.13,roofRear+.12),new T.Vector3(side*.64,roofHeight+.13,roofFront-.12),.022,chrome);for(const z of [roofRear+.18,roofFront-.18])box('panel_RackFoot'+serial++,side*.64,roofHeight+.07,z,.06,.12,.10,trim,.01);}
  box('Interior door card'+side,side*.865,.95,-.02,.045,.49,1.32,upholstery,.03);box('Interior armrest'+side,side*.81,1.07,-.18,.11,.06,.43,trim,.025);
 }
 if(wagon){box('panel_Tailgate',0,1.03,-d.halfLength+.10,1.92,.37,.13,paint);for(const z of [-1.5,-.25])box('panel_RackCrossbar'+z,0,roofHeight+.12,z,1.35,.035,.04,chrome,.008);}
 else mesh('panel_BodyTrunk',stampedPanel(1.85,.76,.045,.018,.015),paint,0,1.215,-2.085);
 box('panel_RearFascia',0,1.03,-d.halfLength+.035,1.84,.33,.13,paint,.045);
 box('panel_RearLampPanel',0,1.07,-d.halfLength-.035,1.73,.19,.025,trim,.012);
 box('Structure rear bulkhead',0,1.04,wagon?-1.48:-1.32,1.71,.40,.06,steel);
 if(wagon)box('Interior cargo floor',0,.88,-2.02,1.71,.07,1.19,upholstery,.015);
 for(const end of [-1,1]){
  box('panel_'+(end>0?'bumper_front':'bumper_rear'),0,.80,end*(d.halfLength+.03),2.01,.15,.16,chrome,.06);
  box('panel_BumperRubber'+end,0,.82,end*(d.halfLength+.119),1.65,.045,.02,trim,.008);
  box('panel_'+(end>0?'FrontValance':'RearValance'),0,.57,end*(d.halfLength-.05),1.9,.30,.13,paint);
 }
 box('panel_LowerIntake',0,.58,d.halfLength+.018,1.12,.13,.026,trim,.02);
 for(let x=-.46;x<=.46;x+=.092)box('Lower intake slat'+serial++,x,.58,d.halfLength+.035,.012,.11,.014,steel,0);
 box('panel_FrontGrille',0,1.035,d.halfLength+.005,1.86,.24,.045,trim,.025);
 for(const y of [.90,1.17])box('panel_GrilleSurround'+y,0,y,d.halfLength+.034,1.87,.028,.035,chrome,.009);
 if(wagon){for(let y=.94;y<=1.13;y+=.047)box('Grille horizontal slat'+serial++,0,y,d.halfLength+.035,1.01,.012,.02,chrome,.001);}else for(let x=-.52;x<=.52;x+=.065)box('Grille slat'+serial++,x,1.035,d.halfLength+.035,.015,.20,.02,chrome,.001);
 for(const side of [-1,1]){
  if(wagon){box('panel_HeadlightBezel'+side,side*.715,1.035,d.halfLength+.027,.445,.225,.055,chrome,.022);box('panel_Headlight'+side,side*.715,1.035,d.halfLength+.060,.387,.165,.022,head,.015);}else for(let light=0;light<2;light++){const x=side*(.65+light*.23);const ring=mesh('panel_HeadlightRing'+serial++,new T.TorusGeometry(.105,.019,8,24),chrome,x,1.05,d.halfLength+.037);mesh('panel_Headlight'+serial++,new T.CircleGeometry(.092,24),head,x,1.05,d.halfLength+.039);}
  box('panel_TailLight'+side,side*.62,1.07,-d.halfLength-.057,wagon?.45:.50,.125,.045,tail,.014);
  for(let j=0;j<8;j++)box('Tail lens rib'+serial++,side*.62+(j-3.5)*.047,1.07,-d.halfLength-.083,.008,.102,.005,tail,.001);
  box('panel_ReverseLight'+side,side*.29,1.07,-d.halfLength-.06,.09,.085,.04,chrome,.008);
  const exhaust=mesh('Structure exhaust'+side,new T.CylinderGeometry(.04,.04,.32,12,1,true),steel,side*.7,.52,-d.halfLength-.03);exhaust.rotation.x=Math.PI/2;
 }
 box('Rear license plate',0,.98,-d.halfLength-.038,.38,.11,.012,chrome,.006);
 // An interior, cage and engine remain visible when body panels deform or detach.
 box('Interior dashboard',0,1.19,.49,1.68,.15,.35,upholstery);
 for(const x of [-.44,.44]){box('Interior seat base',x,.80,-.18,.62,.15,.68,upholstery,.06);const back=box('Interior seat back',x,1.08,-.50,.62,.49,.14,upholstery,.06);back.rotation.x=-.12;box('Interior headrest',x,1.40,-.51,.32,.18,.12,upholstery,.05);for(const offset of [-.24,.24])box('Interior seat bolster',x+offset,1.08,-.46,.10,.43,.19,upholstery,.035);}
 box('Interior rear bench',0,.93,-1.1,1.5,.35,.46,upholstery,.05);
 const steering=mesh('Interior steering wheel',new T.TorusGeometry(.18,.015,8,24),trim,-.45,1.33,.27);steering.rotation.x=-.30;
 for(const x of [-.75,.75]){bar('Structure cabin rail '+x,new T.Vector3(x,.75,-.66),new T.Vector3(x,roofHeight-.12,-.66),.026);bar('Structure cabin brace '+x,new T.Vector3(x,roofHeight-.12,-.66),new T.Vector3(x,.78,bottomRear),.025);}
 bar('Structure cabin beam',new T.Vector3(-.75,roofHeight-.12,-.66),new T.Vector3(.75,roofHeight-.12,-.66),.025);
 box('Structure engine block',0,.99,1.45,.69,.33,.68,steel);box('Structure engine cover',0,1.13,1.45,.64,.075,.56,chrome);
 box('Structure radiator',0,1.0,d.halfLength-.25,1.15,.35,.08,steel);
 for(const [i,name]of ['FL','FR','RL','RR'].entries()){
  const wheel=new T.Group();wheel.name='wheel_'+name;wheel.position.set((i%2?1:-1)*(d.halfWidth-.04),.61,(i<2?1:-1)*d.wheelbase/2);root.add(wheel);
  const profile=[[.223,-.135],[.263,-.15],[.318,-.15],[.353,-.125],[.373,-.078],[.375,0],[.373,.078],[.353,.125],[.318,.15],[.263,.15],[.223,.135],[.223,-.135]].map(([r,y])=>new T.Vector2(r,y));
  const tire=mesh('Classic Tire '+name,new T.LatheGeometry(profile,48),rubber,0,0,0,wheel);tire.rotation.z=Math.PI/2;
  for(const side of [-1,1]){
   const ring=(label:string,r:number,tube:number,x:number,mat:T.Material)=>{const o=mesh(label,new T.TorusGeometry(r,tube,6,48),mat,x,0,0,wheel);o.rotation.y=Math.PI/2;return o;};
   ring('Classic Tire bead '+name+side,.242,.006,side*.143,rubber);ring('Classic Tire molded ring '+name+side,.326,.0025,side*.148,rubber);
   const barrel=mesh('Classic Wheel barrel '+name+side,new T.CylinderGeometry(.223,.223,.10,40,1,true),steel,side*.087,0,0,wheel);barrel.rotation.z=Math.PI/2;
   ring('Classic Wheel polished lip '+name+side,.214,.012,side*.144,chrome);
   const backing=mesh('Classic Wheel brake '+name+side,new T.CircleGeometry(.193,40),steel,side*.114,0,0,wheel);backing.rotation.y=side*Math.PI/2;
   if(wagon){
    const dish=mesh('Classic SteelWheel dish '+name+side,new T.CylinderGeometry(.191,.181,.045,40),chrome,side*.137,0,0,wheel);dish.rotation.z=Math.PI/2;
    for(let j=0;j<8;j++){const angle=j/8*Math.PI*2,hole=mesh('Classic wheel vent '+serial++,new T.CircleGeometry(.025,12),trim,side*.162,Math.sin(angle)*.155,Math.cos(angle)*.155,wheel);hole.rotation.y=side*Math.PI/2;}
   }else{
    for(let j=0;j<5;j++){const angle=j/5*Math.PI*2,spoke=box('Classic alloy spoke '+serial++,side*.135,Math.sin(angle)*.126,Math.cos(angle)*.126,.042,.052,.162,chrome,.015,wheel);spoke.rotation.x=-angle;}
   }
   const hub=mesh('Classic Wheel center '+name+side,new T.CylinderGeometry(wagon?.103:.066,wagon?.095:.066,.039,32),chrome,side*.162,0,0,wheel);hub.rotation.z=Math.PI/2;
   for(let j=0;j<5;j++){const angle=j/5*Math.PI*2,bolt=mesh('Classic Wheel lug '+serial++,new T.CylinderGeometry(.010,.010,.015,6),steel,side*.190,Math.sin(angle)*.073,Math.cos(angle)*.073,wheel);bolt.rotation.z=Math.PI/2;}
  }
  // Shallow road tread follows the rounded shoulder instead of protruding blocks.
  for(let row=0;row<3;row++)for(let j=0;j<40;j++){const angle=(j+(row%2)*.5)/40*Math.PI*2;const block=box('Classic Tire tread '+serial++,(row-1)*.077,Math.sin(angle)*.374,Math.cos(angle)*.374,.065,.003,.019,rubber,.001,wheel);block.rotation.x=-angle;}

 }
 // Existing GLBs use non-indexed decoration batches. Normalize only these
 // authored primitives so indexed rings and rounded-box parts merge together.
 root.traverse(o=>{if(o instanceof T.Mesh&&o.geometry.index){const indexed=o.geometry;o.geometry=indexed.toNonIndexed();indexed.dispose();}});
 root.updateMatrixWorld(true);return root;
}
