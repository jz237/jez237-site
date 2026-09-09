import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {boardLayouts} from './hardware-layout.mjs';

// Electronics are batched per board/material; small parts do not each cost a draw call.
export function addHardware({root,part,box,cyl,tube,ring,screw,m,mesh,mat}){
 const labelSets={};
 const batch=g=>{g.updateMatrixWorld(true);const bins=new Map();for(const o of [...g.children])if(o.isMesh&&!o.name){const key=o.material.uuid;const items=bins.get(key)||[];items.push(o);bins.set(key,items);}for(const items of bins.values()){if(items.length<2)continue;const geometries=items.map(o=>{const a=o.geometry.clone().applyMatrix4(o.matrix);return a.index?a.toNonIndexed():a;});const merged=mergeGeometries(geometries,false);items.forEach(o=>g.remove(o));mesh(g,merged,items[0].material);geometries.forEach(x=>x.dispose());}};
 const labels=(g,id)=>{const material=mat('hardware_labels_'+id,{cpu:'#fffefe',rom:'#fefffe',interface:'#fefeff',sound:'#fffffe',power:'#feffff'}[id],0,.88);const entries=[];labelSets[id]=entries;return (text,w,h,x,y,z,rotation=0,red=false)=>{const index=entries.length;entries.push({text,red});const geo=new T.PlaneGeometry(w,h);const uv=geo.attributes.uv;for(let k=0;k<uv.count;k++)uv.setXY(k,((index%8)+uv.getX(k))/8,1-(Math.floor(index/8)+1-uv.getY(k))/16);const plane=mesh(g,geo,material,[x,y,z]);plane.rotation.z=rotation;};};
 const pin=(g,x,y,z)=>{box(g,[.002,.0028,.010],[x,y,z],m.zinc,0);ring(g,.0025,.0005,[x,y,.009],m.brass,[0,0,0],8);};
 const header=(g,entry,width,height,label)=>{const {u,v,n,ref,rotation=0}=entry;const x=(u-.5)*width,y=(.5-v)*height,h=new T.Group();h.position.set(x,y,.008);h.rotation.z=rotation;g.add(h);const rows=n>=20?2:1,cols=n/rows,pitch=.007;box(h,[cols*pitch+.011,rows*.008+.008,.015],[0,0,.0075],m.ivory,.001);for(let r=0;r<rows;r++)for(let k=0;k<cols;k++)box(h,[.002,.002,.018],[(k-(cols-1)/2)*pitch,(r-(rows-1)/2)*.008,.014],m.zinc,0);batch(h);label(ref,.055,.011,x,y+.019,.010);};
 function dip(g,c,label){const {family,ref,pins,u,v,rotation=0,socket=false,empty=false,red=false}=c;const {width,height}=g.userData;const x=(u-.5)*width,y=(.5-v)*height;const pitch=.0065,length=(pins/2-1)*pitch+.010,bw=pins>=22?.031:.017;const chip=new T.Group();chip.position.set(x,y,0);chip.rotation.z=rotation;g.add(chip);
  if(socket){box(chip,[bw+.012,length+.008,.008],[0,0,.012],m.trim,.001);for(const sign of [-1,1])for(let p=0;p<pins/2;p++)box(chip,[.002,.003,.002],[sign*(bw/2+.004),(p-(pins/2-1)/2)*pitch,.017],m.brass,0);}
  if(!empty){const z=socket?.021:.014;box(chip,[bw,length,.009],[0,0,z],m.chip,.0015);for(const sign of [-1,1])for(let p=0;p<pins/2;p++)pin(chip,sign*(bw/2+.003),(p-(pins/2-1)/2)*pitch,z-.004);cyl(chip,.002,.0006,[-bw*.24,length*.38,z+.0048],m.ivory,[Math.PI/2,0,0],'',8);label([family,ref].join('|'),length-.003,bw*.82,x,y,z+.005,rotation-Math.PI/2,red);}else label('IC5|UNPOPULATED',length,.018,x,y,.018,rotation-Math.PI/2);
  batch(chip);
 }
 function capacitor(g,x,y,r=.006,h=.019){cyl(g,r,h,[x,y,.008+h/2],m.blue,[Math.PI/2,0,0],'',10);cyl(g,r*.83,.0008,[x,y,.008+h],m.zinc,[Math.PI/2,0,0],'',10);box(g,[r*1.4,.0007,.001],[x,y,.009+h],m.ink,0);}
 function axial(g,x,y){cyl(g,.0027,.011,[x,y,.015],m.amber,[0,0,Math.PI/2],'',8);box(g,[.023,.001,.001],[x,y,.012],m.zinc,0);}
 const logic=part('logic'),tray=new T.Group();tray.name='board_tray';logic.add(tray);tray.position.set(-.57,1.90,-.17);tray.rotation.set(0,Math.PI/2,Math.PI/2);
 const placements={cpu:[.64,0,Math.PI/2],rom:[-.055,-.20,0],interface:[-.075,.37,0],sound:[-.80,-.26,0]};
 for(const [id,layout]of Object.entries(boardLayouts)){
  const g=new T.Group();g.name='board_'+id;g.userData={width:layout.width,height:layout.height,inspectId:id==='cpu'?'logic':id,sourceSheet:layout.sheet};tray.add(g);const [x,y,r]=placements[id];g.position.set(x,y,0);g.rotation.z=r;const {width:w,height:h}=layout;const label=labels(g,id);
  box(g,[w,h,.006],[0,0,0],m.pcb,.001);for(const xx of [-w/2+.013,w/2-.013])for(const yy of [-h/2+.013,h/2-.013]){ring(g,.008,.001,[xx,yy,.0035],m.trace);cyl(g,.004,.025,[xx,yy,-.01],m.ivory,[Math.PI/2,0,0],'',8);screw(g,[xx,yy,.008],'z',.0045);}
  label(layout.title,w*.60,.014,0,-h/2+.013,.004);
  for(const c of layout.chips)dip(g,c,label);
  for(const e of layout.headers)header(g,e,w,h,label);
  // Decoupling footprints follow the assembly drawing: one above each CPU IC.
  // Traces are deliberately omitted until copper artwork can establish their routes.
  if(id==='cpu'){
   for(const c of layout.chips){const px=(c.u-.5)*w,py=(.5-c.v)*h+(c.pins/2-1)*.0065/2+.014;axial(g,px,py);}
   for(let i=0;i<3;i++){const bx=.30+i*.055;box(g,[.045,.171,.012],[bx,-.28,.009],m.trim,.002);cyl(g,.020,.136,[bx,-.28,.034],m.ivory,[0,0,0],'',12);for(const by of [-.353,-.207])box(g,[.035,.009,.028],[bx,by,.023],m.zinc,.001);label('AA 1.5V',.10,.018,bx,-.28,.055,Math.PI/2);}
   box(g,[.034,.010,.014],[-.35,-.29,.015],m.zinc,.005);label('CR1 12 MHz',.082,.012,-.35,-.31,.007);for(let i=0;i<3;i++)capacitor(g,-.463,-.28-i*.045,.011,.023);
  }else if(id==='interface'){
   for(let i=0;i<19;i++)axial(g,-.126,-.124+i*.0115);label('W1 CLOSED  /  RED ROM',.17,.01,.095,.11,.007);
  }else if(id==='rom'){
   for(const c of layout.chips.filter(c=>c.red)){axial(g,(c.u-.5)*w-.054,(.5-c.v)*h);}
   for(let i=0;i<4;i++){cyl(g,.004,.007,[.135+i*.016,.205,.012],m.red,[Math.PI/2,0,0],'',10);axial(g,.135+i*.016,.238);}
   capacitor(g,-.21,.055,.011,.020);
  }else{
   for(const [px,py,rr,hh]of [[.155,-.114,.025,.052],[.205,-.114,.032,.065],[.115,.124,.012,.035],[.145,.124,.012,.035]])capacitor(g,px,py,rr,hh);
   for(const fx of [.185,.224]){cyl(g,.005,.083,[fx,.105,.016],m.glass,[0,0,0],'',12);for(const fy of [.061,.149])box(g,[.014,.008,.015],[fx,fy,.014],m.zinc,.001);box(g,[.001,.080,.001],[fx,.105,.016],m.copper,0);}
   label('F1 / F2  4A SB',.10,.009,.195,.17,.006);
   box(g,[.043,.027,.020],[.18,-.00,.015],m.chip,.002);label('7805',.041,.012,.18,0,.026);
   box(g,[.051,.039,.022],[.071,.15,.016],m.black,.001);label('TDA2002',.046,.010,.071,.15,.029);box(g,[.038,.018,.003],[.071,.178,.017],m.zinc,.001);screw(g,[.071,.179,.020],'z',.003);for(let k=0;k<5;k++)box(g,[.0015,.020,.002],[.055+k*.008,.125,.009],m.zinc,0);
   box(g,[.027,.019,.014],[-.18,-.16,.011],m.zinc,.004);label('3.58 MHz',.066,.011,-.18,-.18,.006);
  }
  // Flatten nested DIP/header groups into this board before material batching.
  g.updateMatrixWorld(true);for(const child of [...g.children])if(child.isGroup){child.updateMatrix();for(const o of [...child.children]){o.applyMatrix4(child.matrix);g.add(o);}g.remove(child);}batch(g);
 }
 // The original ribbons join CPU to ROM and interface. Physical routing is an approximation.
 for(const [start,end,n]of [[[.22,-.30,.014],[.045,-.51,.014],40],[[.22,.33,.014],[.15,.35,.014],20]])for(let i=0;i<n;i++){const d=(i-(n-1)/2)*.0028;tube(tray,[[start[0],start[1]+d,.02],[start[0]-.065,start[1]+d,.10],[end[0]+.07,end[1]+d,.10],[end[0],end[1]+d,.02]],.0013,i===0?m.redwire:m.whitewire,12);}batch(tray);
 const power=part('power');
 // D8359: open board, two TO-3 heatsinks, five fuses, three supply indicator LEDs.
 const supply=new T.Group();supply.name='supply_board';power.add(supply);supply.position.set(-.15,.88,-.40);const pl=labels(supply,'power');
 box(supply,[.66,.49,.006],[0,0,0],m.pcb,.001);for(const [x,y,w,h]of [[-.16,.036,.266,.330],[.19,-.13,.204,.18]]){box(supply,[w,h,.011],[x,y,.018],m.zinc,.001);for(let k=0;k<8;k++)box(supply,[w,.003,.035],[x,y-h*.44+k*h*.88/7,.034],m.zinc,0);const caseBody=mesh(supply,new T.SphereGeometry(.024,16,8),m.zinc,[x,y,.046]);caseBody.scale.set(1,.75,.5);for(const dx of [-.037,.037])screw(supply,[x+dx,y,.033],'z',.004);}
 for(let i=0;i<5;i++){const y=.203-i*.032;cyl(supply,.004,.075,[.202,y,.015],m.glass,[0,0,Math.PI/2],'',12);box(supply,[.075,.001,.001],[.202,y,.015],m.copper,0);for(const x of [.160,.244])box(supply,[.009,.014,.019],[x,y,.014],m.zinc,.001);pl('F'+[1,2,3,5,4][i],.016,.008,.27,y,.004);}
 capacitor(supply,.040,.024,.034,.060);pl('C12',.035,.010,.04,-.024,.005);
 for(const [x,text]of [[-.27,'+5V'],[-.14,'+12V'],[-.04,'-5V']]){cyl(supply,.004,.005,[x,-.174,.009],m.red,[Math.PI/2,0,0],'',10);pl(text,.036,.010,x,-.188,.006);}
 for(const [x,y,n,ref]of [[.31,.095,12,'4J1'],[-.13,-.223,15,'4J2'],[.31,-.175,6,'4J3']])header(supply,{u:x/.66+.5,v:.5-y/.49,n,ref,rotation:ref==='4J2'?0:Math.PI/2},.66,.49,pl);
 pl('D8359 LINEAR SUPPLY',.31,.013,0,.233,.004);for(const x of [-.31,.31])for(const y of [-.225,.225])screw(supply,[x,y,.005],'z',.005);
 supply.updateMatrixWorld(true);for(const child of [...supply.children])if(child.isGroup){child.updateMatrix();for(const o of [...child.children]){o.applyMatrix4(child.matrix);supply.add(o);}supply.remove(child);}batch(supply);
 // Laminated transformer on the lower mounting panel; enclosure dimensions remain approximate.
 box(power,[.98,.024,.56],[0,.365,-.10],m.raw);box(power,[.85,.008,.47],[0,.383,-.10],m.zinc);for(let i=0;i<24;i++)box(power,[.24,.24,.005],[.29,.523,-.24+i*.008],i%3?m.zinc:m.black,0);for(const x of [.20,.38])for(let i=0;i<17;i++)ring(power,.053,.0025,[x,.524,-.22+i*.009],m.copper);for(const x of [.18,.40])for(const z of [-.25,-.04])screw(power,[x,.40,z],'y',.005);box(power,[.12,.07,.085],[-.31,.427,.02],m.zinc,.003);box(power,[.12,.022,.09],[-.15,.403,.05],m.ivory,.003);for(const x of [-.167,-.135])box(power,[.005,.003,.022],[x,.416,.05],m.ink,0);for(let i=0;i<6;i++)tube(power,[[.29+i*.008,.60,-.15],[.19+i*.008,.72,-.27],[.15+i*.008,.93,-.36]],.0024,[m.redwire,m.yellowwire,m.bluewire][i%3],16);
 root.userData.hardwareLabels=labelSets;
 return {logic,power};
}
