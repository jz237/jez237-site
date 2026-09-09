import * as T from 'three';
import {addHardware} from './model-hardware.mjs';
import {cabinetProfile} from './cabinet-profile.mjs';
import {addMonitor} from './model-monitor.mjs';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

export function buildDetailedCabinet(){
 const root=new T.Group();root.name='Arcade_1981';
 const mat=(name,color,metalness=0,roughness=.65)=>new T.MeshStandardMaterial({name,color,metalness,roughness});
 const m={wood:mat('painted_wood','#36352e',.08,.77),raw:mat('raw_plywood','#574733',0,.9),trim:mat('rubber_trim','#111412',.12,.5),steel:mat('aged_steel','#8c9289',.72,.39),zinc:mat('zinc_bracket','#777f7a',.65,.48),black:mat('black_metal','#313630',.65,.44),brass:mat('brass','#bfa779',.73,.35),copper:mat('copper_winding','#a36332',.75,.38),pcb:mat('circuit_board','#254c36',.15,.74),trace:mat('circuit_traces','#8b9560',.45,.55),chip:mat('integrated_circuit','#272a23',.1,.8),ivory:mat('aged_plastic','#b2b39c',.05,.6),red:mat('button_red','#a72015',.2,.24),green:mat('button_green','#258b30',.05,.32),amber:mat('button_amber','#e0a52e',.12,.26),blue:mat('button_blue','#205d72',.15,.3),paper:mat('aged_label','#c2b694',0,.95),glass:mat('tube_glass','#423e34',.36,.35),ink:mat('black_ink','#141612',0,.98),redwire:mat('wire_red','#a83c28',.05,.55),bluewire:mat('wire_blue','#367383',.05,.48),yellowwire:mat('wire_yellow','#b39a55',.05,.6),whitewire:mat('wire_white','#aaa593',.05,.7)};
 const mesh=(g,geo,material,pos=[0,0,0],name='')=>{const o=new T.Mesh(geo,material);o.position.set(...pos);o.name=name;g.add(o);return o;};
 const box=(g,s,p,material,r=.007,name='')=>mesh(g,r?new RoundedBoxGeometry(...s,1,r):new T.BoxGeometry(...s),material,p,name);
 const cyl=(g,r,h,p,material,rot=[0,0,0],name='',segments=16)=>{const o=mesh(g,new T.CylinderGeometry(r,r,h,segments),material,p,name);o.rotation.set(...rot);return o;};
 const tube=(g,points,r,material,segments=24)=>mesh(g,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),segments,r,5,false),material);
 const ring=(g,r,t,p,material,rotation=[0,0,0],segments=28)=>{const o=mesh(g,new T.TorusGeometry(r,t,6,segments),material,p);o.rotation.set(...rotation);return o;};
 const part=name=>{const g=new T.Group();g.name=name;root.add(g);return g;};
 const screw=(g,p,axis='z',r=.012)=>{const rot=axis==='x'?[0,0,Math.PI/2]:axis==='y'?[0,0,0]:[Math.PI/2,0,0];cyl(g,r,.008,p,m.steel,rot,'',12);const q=[...p];q[axis==='x'?0:axis==='y'?1:2]+=.005;const s=axis==='x'?[.002,r*1.3,.002]:axis==='y'?[r*1.3,.002,.002]:[r*1.3,.002,.002];box(g,s,q,m.ink,0);};
 const rivetGrid=(g,xs,ys,z)=>xs.forEach(x=>ys.forEach(y=>screw(g,[x,y,z])));
 const slotPlate=(g,width,height,pos,rows=7)=>{box(g,[width,height,.021],pos,m.black);for(let i=0;i<rows;i++)box(g,[width*.75,.01,.025],[pos[0],pos[1]-height*.37+i*height*.74/(rows-1),pos[2]+.007],m.ink,0);};
 const bracket=(g,x,y,z)=>{box(g,[.075,.18,.012],[x,y,z],m.zinc);box(g,[.075,.014,.1],[x,y-.083,z+.045],m.zinc);for(const dy of [-.052,.052])screw(g,[x,y+dy,z+.01]);};
 const frame=part('chassis');
 box(frame,[1.4,.1,1.25],[0,.14,-.01],m.raw);box(frame,[1.43,.07,1.27],[0,.19,-.01],m.black);box(frame,[1.3,.042,1.14],[0,.32,0],m.raw);
 for(const x of [-.6,.6])for(const z of [-.68,.65]){cyl(frame,.055,.06,[x,.06,z],m.trim);cyl(frame,.019,.09,[x,.1,z],m.steel);box(frame,[.07,z>0?2.13:3.08,.07],[x,z>0?1.31:1.76,z],m.raw);for(const y of (z>0?[.35,1.45,2.31]:[.35,1.45,2.65,3.2]))bracket(frame,x,y,z+.041);}
 for(const y of [.41,1.45,2.68,3.29]){box(frame,[1.28,.05,.06],[0,y,-.53],m.raw);box(frame,[1.22,.025,.07],[0,y+.032,-.53],m.zinc);}
 box(frame,[1.32,.18,.03],[0,.3,.56],m.black);rivetGrid(frame,[-.59,-.3,.3,.59],[.26,.35],.58);
 const shape=new T.Shape();cabinetProfile.forEach(([z,y],i)=>i?shape.lineTo(z,y):shape.moveTo(z,y));shape.closePath();
 for(const [name,x,side] of [['left_panel',-.71,-1],['right_panel',.65,1]]){
  const g=part(name);const geo=new T.ExtrudeGeometry(shape,{depth:.06,bevelEnabled:true,bevelThickness:.002,bevelSize:.003,bevelSegments:1,curveSegments:9});geo.rotateY(-Math.PI/2);geo.translate(x+.06,0,0);mesh(g,geo,m.wood);
  const face=new T.ShapeGeometry(shape,12);face.rotateY(-Math.PI/2);const outer=side<0?x-.003:x+.063;face.translate(outer,0,0);const a=face.attributes.position,uv=face.attributes.uv;for(let i=0;i<a.count;i++)uv.setXY(i,(a.getZ(i)+.73)/1.674,(a.getY(i)-.16)/3.904);const print=mat('side_print','#fff',.05,.77);print.side=T.DoubleSide;mesh(g,face,print,[0,0,0],name+'_print');
  const edgePoints=shape.getSpacedPoints(260).map(p=>[side<0?x-.001:x+.061,p.y,p.x]);tube(g,edgePoints,.014,m.trim,280);
  // Uneven tiny chips and plywood strata remain geometry at grazing angles.
  const chippedEdge=shape.getSpacedPoints(320);for(let i=0;i<70;i++){const p=chippedEdge[(i*43)%320];box(g,[.061,.004+(i%4)*.002,.005],[x+.03,p.y,p.x],m.raw,0);}
  for(let i=0;i<5;i++)box(g,[.059,.003,1.18],[x+.03,.165+i*.004,-.035],i%2?m.raw:m.black,0);
  for(const y of [.35,1.15,2.65,3.25])screw(g,[outer+side*.004,y,-.53],'x');
  for(const y of [.59,1.78,2.97]){box(g,[.009,.16,.055],[x+.03,y,-.63],m.steel);for(let i=0;i<6;i++)cyl(g,.012,.019,[x+.03,y-.063+i*.022,-.658],i%2?m.zinc:m.steel);}
 }
 const back=part('back_panel');box(back,[1.27,3.15,.046],[0,1.77,-.73],m.wood);slotPlate(back,.82,.37,[0,.72,-.76],10);slotPlate(back,.72,.24,[0,2.84,-.76],7);box(back,[.31,.19,.003],[.2,2.47,-.756],m.paper,.001,'back_label');for(const y of [.38,1.72,3.15])for(const x of [-.56,.56])screw(back,[x,y,-.76]);
 const marquee=part('marquee');box(marquee,[1.31,.44,.49],[0,3.12,.39],m.wood);box(marquee,[1.29,.4,.028],[0,3.12,.65],m.trim);box(marquee,[1.23,.335,.012],[0,3.12,.672],mat('marquee_glow','#fff',.05,.48),.003,'marquee_print');for(const y of [2.918,3.325])box(marquee,[1.35,.042,.055],[0,y,.675],m.black);for(const x of [-.654,.654])box(marquee,[.025,.45,.06],[x,3.12,.676],m.black);rivetGrid(marquee,[-.62,.62],[2.924,3.32],.71);cyl(marquee,.035,1.08,[0,3.13,.39],m.ivory,[0,0,Math.PI/2]);
 const crt=part('crt');box(crt,[1.23,1.025,.095],[0,2.255,.365],m.black,.024);
 // Recessed bezel, curved 4:3 display, aquadag bell, neck and copper deflection yoke.
 for(const x of [-.56,.56])box(crt,[.105,.97,.055],[x,2.26,.426],m.trim,.025);for(const y of [1.81,2.705])box(crt,[1.04,.087,.06],[0,y,.43],m.trim,.018);
 const surface=new T.PlaneGeometry(.99,.742,44,32);const p=surface.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i);p.setZ(i,.047*(1-(x/.5)**2)*Math.max(0,1-(y/.38)**2));}surface.computeVertexNormals();mesh(crt,surface,mat('phosphor','#777f77',.08,.32),[0,2.26,.471],'crt_screen');
 const bellPoints=[[.11,-.55],[.115,-.47],[.14,-.35],[.25,-.23],[.36,-.1],[.45,.12],[.48,.24]].map(([r,z])=>new T.Vector2(r,z));const bell=mesh(crt,new T.LatheGeometry(bellPoints,36),m.glass,[0,2.26,.12]);bell.rotation.x=Math.PI/2;bell.scale.set(1,.85,1);cyl(crt,.045,.28,[0,2.26,-.59],m.glass,[Math.PI/2,0,0]);
 for(let i=0;i<16;i++)ring(crt,.127+(i<8?i:16-i)*.004,.007,[0,2.26,-.28+i*.009],m.copper);
 for(const x of [-.585,.585]){for(const z of [-.18,.365])box(crt,[.039,1.02,.039],[x,2.26,z],m.zinc);for(const y of [1.77,2.755])box(crt,[.039,.035,.58],[x,y,.09],m.zinc);for(const y of [1.82,2.7])bracket(crt,x,y,.31);}
 addMonitor({crt,box,cyl,ring,tube,mesh,screw,m,mat});
 // The front bezel masks the mounting chassis; service metal is visible from the rear only.
 const bezelShape=new T.Shape();bezelShape.moveTo(-.75,-.615);bezelShape.lineTo(.75,-.615);bezelShape.lineTo(.75,.615);bezelShape.lineTo(-.75,.615);bezelShape.closePath();const aperture=new T.Path();aperture.moveTo(-.498,-.374);aperture.lineTo(-.498,.374);aperture.lineTo(.498,.374);aperture.lineTo(.498,-.374);aperture.closePath();bezelShape.holes.push(aperture);mesh(crt,new T.ShapeGeometry(bezelShape),mat('bezel_face','#050605',0,.97),[0,2.26,.474],'monitor_bezel');
 const cp=part('controls');box(cp,[1.35,.1,.565],[0,1.655,.594],m.raw);box(cp,[1.36,.026,.574],[0,1.72,.599],m.black);const cpFace=mesh(cp,new T.PlaneGeometry(1.29,.505),mat('control_print','#fff',.12,.68),[0,1.739,.611],'control_print');cpFace.rotation.x=-Math.PI/2;box(cp,[1.35,.11,.034],[0,1.658,.889],m.black);box(cp,[1.32,.008,.017],[0,1.716,.911],m.zinc);
 const joystick=new T.Group();joystick.name='joystick';joystick.position.set(-.48,1.746,.57);cp.add(joystick);box(cp,[.052,.012,.155],[-.48,1.749,.57],m.trim,.006);box(cp,[.025,.008,.12],[-.48,1.758,.57],m.ink,.003);cyl(joystick,.009,.14,[0,.07,0],m.steel);mesh(joystick,new T.SphereGeometry(.044,24,16),m.red,[0,.15,0]);
 for(const [i,x,z,color]of [[0,-.36,.73,m.ivory],[1,.32,.49,m.ivory],[2,.46,.49,m.ivory],[3,.24,.65,m.green],[4,0,.80,m.ivory],[5,-.12,.46,m.red],[6,.12,.46,m.red]]){cyl(cp,.043,.012,[x,1.746,z],color);ring(cp,.035,.002,[x,1.756,z],m.trim,[Math.PI/2,0,0]);mesh(cp,new T.LatheGeometry([[0,.002],[.019,.002],[.026,.005],[.030,.009],[.032,.007],[.032,-.012],[0,-.012]].map(([r,y])=>new T.Vector2(r,y)),32),color,[x,1.769,z],'button_'+i);cyl(cp,.034,.12,[x,1.61,z],m.ivory);box(cp,[.1,.014,.055],[x,1.54,z],m.ink);box(cp,[.11,.004,.025],[x,1.515,z],m.brass,0,'leaf_'+i);box(cp,[.11,.004,.025],[x,1.507,z],m.brass,0);cyl(cp,.008,.016,[x+.033,1.511,z],m.steel);tube(cp,[[x,1.53,z-.022],[x+.03,1.44,z-.04],[x-.02,1.39,.3]],.004,m.yellowwire,10);}
 for(const x of [-.61,.61])for(const z of [.39,.83])screw(cp,[x,1.752,z],'y');box(cp,[.12,.08,.2],[-.48,1.57,.57],m.black);for(const z of [.485,.655])box(cp,[.1,.008,.026],[-.48,1.532,z],m.brass);
 box(cp,[1.34,.14,.025],[0,1.6,.884],m.black);
 const coin=part('coin');box(coin,[1.29,1.1,.062],[0,.995,.533],m.wood);box(coin,[.72,.87,.025],[0,1,.58],m.zinc,.018);box(coin,[.674,.826,.034],[0,1,.601],m.trim,.024);box(coin,[.622,.777,.022],[0,1,.625],m.black,.02);
 for(const x of [-.158,.158]){box(coin,[.214,.258,.033],[x,1.203,.652],m.zinc,.016);box(coin,[.182,.228,.037],[x,1.203,.672],m.trim,.012);box(coin,[.128,.136,.012],[x,1.232,.697],mat('coin_lamp','#b64214',.1,.58),.006,'coin_lamp');box(coin,[.068,.011,.012],[x,1.263,.707],m.ink,.002);box(coin,[.075,.037,.019],[x,1.131,.702],m.black,.005);box(coin,[.011,.28,.19],[x-.09,1.095,.4],m.zinc);box(coin,[.011,.29,.19],[x+.075,1.095,.4],m.zinc);for(let i=0;i<4;i++)cyl(coin,.023,.14,[x,1.21-i*.047,.36],m.steel,[0,0,Math.PI/2]);tube(coin,[[x,1.1,.3],[x,.94,.34],[x,.75,.25]],.023,m.zinc,12);}
 box(coin,[.34,.14,.035],[0,.795,.663],m.zinc,.01);box(coin,[.304,.112,.042],[0,.795,.69],m.ink,.008);box(coin,[.28,.033,.035],[0,.75,.71],m.black);cyl(coin,.025,.018,[.244,1,.654],m.brass,[Math.PI/2,0,0]);box(coin,[.005,.026,.008],[.244,1,.668],m.ink,0);rivetGrid(coin,[-.29,.29],[.68,1.326],.657);box(coin,[.48,.16,.34],[0,.57,.22],m.zinc);box(coin,[.435,.015,.293],[0,.658,.22],m.ink);cyl(coin,.045,.006,[.158,1.23,.37],m.brass,[Math.PI/2,0,0],'travelling_coin');
 const {logic:boards,power}=addHardware({root,part,box,cyl,tube,ring,screw,m,mesh,mat});
 const speaker=part('speaker');box(speaker,[1.27,.055,.39],[0,2.807,.27],m.wood);box(speaker,[.43,.405,.018],[0,2.817,.48],m.zinc);const conePoints=[[.014,-.046],[.058,-.04],[.142,.002],[.154,.007],[.167,.005]].map(([r,z])=>new T.Vector2(r,z));const cone=mesh(speaker,new T.LatheGeometry(conePoints,48),m.ink,[0,2.817,.523],'speaker_cone');cone.rotation.x=Math.PI/2;for(const r of [.149,.157,.165])ring(speaker,r,.004,[0,2.817,.523],m.trim);mesh(speaker,new T.SphereGeometry(.05,24,12),m.trim,[0,2.817,.534]);for(const x of [-.185,.185])for(const y of [2.64,2.99])screw(speaker,[x,y,.494]);for(let i=0;i<8;i++){const a=i*Math.PI/4;tube(speaker,[[Math.cos(a)*.157,2.817+Math.sin(a)*.157,.474],[Math.cos(a)*.081,2.817+Math.sin(a)*.081,.345]],.008,m.zinc,4);}cyl(speaker,.077,.074,[0,2.817,.315],m.black,[Math.PI/2,0,0]);
 const grille=new T.Group();grille.name='speaker_cover';speaker.add(grille);box(grille,[1.29,.40,.012],[0,2.817,.59],mat('speaker_face','#070807',0,.93),.002);for(let i=0;i<21;i++)box(grille,[.43,.004,.001],[0,2.70+i*.011,.597],m.ink,0);for(let i=0;i<23;i++)box(grille,[1.24,.006,.014],[0,2.67+i*.011,.58],m.black,0);for(const x of [-.61,.61])box(grille,[.025,.29,.016],[x,2.79,.58],m.black);
 const vents=part('ventilation');
 // Passive rear ventilation; a powered fan was not established by the selected drawings.
 for(const y of [.71,2.83]){box(vents,[.84,.26,.012],[0,y,-.775],m.zinc,.002);for(let i=0;i<12;i++)box(vents,[.78,.011,.014],[0,y-.11+i*.020,-.783],m.ink,0);for(const x of [-.39,.39])for(const dy of [-.10,.10])screw(vents,[x,y+dy,-.788]);}
 const details=part('details');box(details,[.18,.24,.003],[-.43,1.06,-.588],m.paper,.001,'service_tag');box(details,[.19,.07,.004],[.39,.48,.48],m.paper,.001,'repair_label');cyl(details,.043,.005,[-.42,.347,.24],m.brass);ring(details,.035,.0015,[-.42,.351,.24],m.copper,[Math.PI/2,0,0]);cyl(details,.027,.19,[-.45,.365,-.19],m.black,[0,0,Math.PI/2]);cyl(details,.039,.026,[-.345,.365,-.19],m.zinc,[0,0,Math.PI/2]);
 // Cable loom, individual insulation colors, support ties and plug bodies.
 for(let i=0;i<12;i++){const x=.39+i*.009;const color=[m.redwire,m.bluewire,m.yellowwire,m.whitewire][i%4];tube(frame,[[x,.49,-.37],[x,.69,-.34],[x-.04,1.2,-.36],[x-.01,1.5,-.38],[x,2.4,-.38],[x-.05,2.79,-.27]],.004,color,40);}
 for(const y of [.67,1.07,1.49,2.04,2.48]){box(frame,[.14,.014,.016],[.431,y,-.36],m.trim);screw(frame,[.535,y,-.359]);}
 // Clear the bezel overhang while retaining assembly-local animation pivots.
 for(const o of cp.children)o.position.z+=.18;
 // Batch static geometry by material inside each independently movable assembly.
 const batches=[];root.traverse(o=>{if(o.isGroup)batches.push(o)});for(const g of batches.reverse()){g.updateMatrixWorld(true);const bins=new Map();for(const o of [...g.children])if(o.isMesh&&!o.name){const b=bins.get(o.material.uuid)||{material:o.material,items:[]};b.items.push(o);bins.set(o.material.uuid,b);}for(const {material,items}of bins.values()){if(items.length<2)continue;const geometries=items.map(o=>{const a=o.geometry.clone().applyMatrix4(o.matrix);return a.index?a.toNonIndexed():a;});const merged=mergeGeometries(geometries,false);if(merged){items.forEach(o=>g.remove(o));mesh(g,merged,material);}geometries.forEach(x=>x.dispose());}}
 // Assembly-local transforms preserve the existing button/joystick animation coordinates.
 const remount=(assembly,from,to,scale=[1,1,1],angle=0)=>{const holder=new T.Group();holder.name=assembly.name+'_mount';for(const child of [...assembly.children])holder.add(child);assembly.add(holder);const matrix=new T.Matrix4().makeTranslation(...to).multiply(new T.Matrix4().makeRotationX(angle)).multiply(new T.Matrix4().makeScale(...scale)).multiply(new T.Matrix4().makeTranslation(...from.map(v=>-v)));holder.applyMatrix4(matrix);};
 remount(cp,[0,1.74,.79],[0,2.43,.77],[1,1,1],.18);
 remount(crt,[0,2.26,.471],[0,3.01,.46],[.855,.855,.70],-.26);
 remount(coin,[0,.995,.533],[0,1.795,.90],[1,1,.5]);
 remount(marquee,[0,3.12,.675],[0,3.847,.685]);
 remount(speaker,[0,2.817,.523],[0,3.55,.53]);
 box(frame,[1.29,1.09,.04],[0,.71,.715],m.wood,.002);
 // Sloping rear crown follows the measured side outline and closes the roof seam.
 const crown=box(back,[1.31,.04,Math.hypot(.36,.435)],[0,3.5725,-.55],m.wood,.001);crown.rotation.x=-Math.atan2(.435,.36);
 const roof=box(frame,[1.31,.04,1.04],[0,3.91,.16],m.wood,.001);roof.rotation.x=-.27;
 // Keep the environment's established display scale while using measured cabinet proportions.
 root.scale.setScalar(.84);
 root.userData.cabinetDimensions={widthIn:26,sideHeightIn:70,sideDepthIn:30,source:'jbrew / William Stillwell measured DXF; feet and projecting controls excluded'};
 root.updateMatrixWorld(true);return root;
}
