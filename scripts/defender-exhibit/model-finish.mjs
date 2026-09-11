import * as T from 'three';

/** Close-up construction in assembly coordinates, before remounting and batching. */
export function addFinish({root,cp,coin,crt,marquee,frame,back,box,cyl,ring,tube,mesh,screw,m,mat}){
 const scuff=mat('contact_scuff','#737365',.35,.61);
 const fiber=mat('exposed_particleboard','#92734d',0,.96);
 const polished=mat('grip_polish','#9b271d',0,.27);
 const rubber=mat('edge_joint','#080908',0,.91);
 const glass=mat('cover_glass','#c9dfd9',0,.13);glass.transparent=true;glass.opacity=.07;glass.depthWrite=false;
 // A second curved face sits in front of the phosphor, with a visible perimeter lip.
 const screen=root.getObjectByName('crt_screen');
 mesh(crt,screen.geometry.clone(),glass,[0,2.26,.482],'crt_cover_glass');
 for(const x of [-.502,.502])box(crt,[.006,.747,.014],[x,2.26,.475],m.glass,.002);
 for(const y of [1.886,2.634])box(crt,[1.01,.006,.014],[0,y,.475],m.glass,.002);
 // Marquee print is physically behind its acrylic cover and retaining channels.
 box(marquee,[1.235,.34,.006],[0,3.12,.686],glass,.002,'marquee_cover_glass');
 for(const y of [2.945,3.296]){
  box(marquee,[1.265,.010,.021],[0,y,.685],m.zinc,.001);
  box(marquee,[1.254,.003,.004],[0,y+.006,.697],scuff,0);
  for(const x of [-.49,.49])screw(marquee,[x,y,.701],'z',.008);
 }
 for(const x of [-.555,.555]){box(marquee,[.07,.085,.063],[x,3.13,.40],m.ivory,.006);box(marquee,[.07,.025,.13],[x,2.978,.40],m.zinc,.002);}
 tube(marquee,[[-.55,3.09,.37],[-.53,3.00,.28],[.46,3.00,.28],[.53,3.10,.37]],.004,m.whitewire,24);
 // Mold line and rubbed arcs follow the joystick, rather than floating above it.
 const joy=root.getObjectByName('joystick');
 ring(joy,.044,.0007,[0,.15,0],rubber,[Math.PI/2,0,0],40);
 const grip=new T.SphereGeometry(.04425,28,12,.15,2.15,.45,.68);
 mesh(joy,grip,polished,[0,.15,0]);
 ring(joy,.011,.0015,[0,.006,0],m.trim,[Math.PI/2,0,0]);
 // Concentric scratches and short broken scuffs cluster around the button rims.
 const controls=[[-.36,.73],[.32,.49],[.46,.49],[.24,.65],[0,.80],[-.12,.46],[.12,.46]];
 controls.forEach(([x,z],i)=>{
  for(let j=0;j<5;j++){
   const points=[];const r=.046+j*.0013;
   for(let k=0;k<8;k++){const a=i*.77+j*.93+k*.045;points.push([x+Math.cos(a)*r,1.7405,z+Math.sin(a)*r]);}
   tube(cp,points,.00045,j%3?scuff:rubber,7);
  }
 });
 for(const x of [-.65,.65]){box(cp,[.005,.006,.515],[x,1.739,.604],rubber,0);box(cp,[.018,.056,.014],[x,1.695,.873],m.zinc,.002);}
 // Coin acceptor throats have lips, a dark recessed slot and a separate return lens.
 const red=mat('coin_return_lens','#ae2017',0,.24);
 for(const x of [-.158,.158]){
  for(const dx of [-.039,.039])box(coin,[.008,.027,.019],[x+dx,1.263,.712],m.zinc,.002);
  for(const dy of [-.012,.012])box(coin,[.080,.006,.017],[x,1.263+dy,.713],m.zinc,.001);
  box(coin,[.091,.049,.009],[x,1.132,.711],m.trim,.003);
  box(coin,[.079,.037,.010],[x,1.132,.718],red,.006,'coin_return_'+(x<0?'left':'right'));
  for(let i=0;i<6;i++)box(coin,[.055,.001,.001],[x,1.119+i*.005,.724],scuff,0);
  for(const dx of [-.089,.089])for(const y of [1.104,1.304])screw(coin,[x+dx,y,.695],'z',.006);
  for(let j=0;j<12;j++){const a=j*2.399;const xx=x+Math.cos(a)*(.054+(j%3)*.009),yy=1.13+Math.sin(a)*.036;const scratch=box(coin,[.009+j%4*.003,.0008,.0007],[xx,yy,.698],scuff,0);scratch.rotation.z=a*.2;}
 }
 ring(coin,.025,.0015,[.244,1,.670],scuff);
 for(const y of [.62,1.35]){box(coin,[.04,.032,.014],[-.315,y,.643],m.zinc,.002);screw(coin,[-.315,y,.654],'z',.006);}
 // T-molding splice on the low rear edge, and irregular exposed substrate at feet.
 for(const [id,x]of [['left_panel',-.714],['right_panel',.714]]){
  const panel=root.getObjectByName(id);
  box(panel,[.024,.007,.023],[x,.40,-.73],rubber,.001);
  for(const z of [-.70,.70])for(let i=0;i<16;i++){
   const y=.171+(i%5)*.009,zz=z+(Math.sin(i*9.1)*.019);
   const chip=mesh(panel,new T.CircleGeometry(.003+i%4*.0015,5),i%3?fiber:m.raw,[x,y,zz]);chip.rotation.y=Math.PI/2;
   chip.rotation.z=i*.83;chip.scale.y=.4+(i%3)*.35;
  }
 }
 // Clipped service harness, branch plugs and threaded mounting hardware.
 for(const y of [.67,1.07,1.49,2.04,2.48]){
  ring(frame,.058,.002,[.433,y,-.35],m.ivory,[Math.PI/2,0,0],16);
  box(frame,[.013,.020,.014],[.491,y,-.345],m.ivory,.001);
  box(frame,[.029,.002,.006],[.507,y,-.345],m.ivory,0);
 }
 for(const [y,z]of [[1.40,-.35],[2.36,-.35]]){
  box(frame,[.128,.045,.036],[.434,y,z],m.ivory,.003);
  box(frame,[.12,.003,.038],[.434,y,z],rubber,0);
  box(frame,[.030,.012,.009],[.434,y+.013,z+.024],m.ivory,.001);
  for(let i=0;i<8;i++)box(frame,[.005,.009,.002],[.387+i*.013,y-.014,z+.019],m.brass,0);
 }
 // Paper labels are distinct runtime textures, large enough to read when inspected.
 box(back,[.34,.18,.003],[-.20,2.15,-.756],m.paper,.001,'inspection_label');
 box(frame,[.27,.11,.002],[.24,1.07,-.31],m.paper,.001,'harness_label');
 box(cp,[.32,.065,.002],[0,1.60,.331],m.paper,.001,'controls_service_label');
 root.userData.finishDetails={version:1,areas:['controls','crt','cabinet-edges','coin-door','marquee','interior','electronics'],copperRouting:'Illustrative routing between populated footprints; not original copper artwork.'};
}
