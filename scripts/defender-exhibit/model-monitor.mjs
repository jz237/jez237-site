import * as T from 'three';

// K4600-family construction referenced to Wells-Gardner manual, figures 13–18.
// Component footprints are traced; cabinet fit, minor parts and chassis dimensions are approximate.
export function addMonitor({crt,box,cyl,ring,tube,mesh,screw,m,mat}){
 const pcb=mat('monitor_board','#82713e',0,.86);
 box(crt,[.80,.023,.66],[0,1.76,-.31],m.zinc,.003);
 box(crt,[.75,.007,.59],[0,1.789,-.31],pcb,.001);
 const main=(u,v)=>[(u-.5)*.75,1.793,(v-.5)*.59-.31];
 const cap=(u,v,r,h)=>{const [x,y,z]=main(u,v);cyl(crt,r,h,[x,y+h/2,z],m.blue,[0,0,0],'',12);cyl(crt,r*.9,.001,[x,y+h,z],m.zinc,[0,0,0],'',12);box(crt,[r*1.4,.001,.001],[x,y+h+.001,z],m.ink,0);};
 // Large cans from MQ-29 layout: C602, C608, C610, C623, C624, C625.
 for(const [u,v,r,h]of [[.18,.28,.052,.105],[.65,.74,.033,.067],[.90,.90,.026,.058],[.39,.25,.024,.053],[.49,.72,.023,.048],[.74,.40,.024,.048]])cap(u,v,r,h);
 for(const [u,v]of [[.55,.65],[.53,.67],[.56,.71],[.51,.76],[.57,.79],[.61,.78],[.63,.84],[.65,.89],[.70,.83],[.70,.79],[.72,.75],[.72,.65],[.80,.70],[.83,.84],[.87,.84],[.90,.84],[.92,.32],[.87,.36],[.71,.52],[.75,.52],[.77,.48],[.23,.58],[.19,.63],[.22,.65]]){const [x,y,z]=main(u,v);cyl(crt,.003,.024,[x,y+.007,z],m.ivory,[0,0,Math.PI/2],'',8);box(crt,[.038,.001,.001],[x,y+.004,z],m.zinc,0);}
 // Two removable upright signal cards and their long edge sockets.
 for(const [i,x,w,h,z]of [[0,-.10,.26,.255,-.45],[1,.075,.23,.22,-.43]]){
  box(crt,[.018,.022,w+.018],[x,1.81,z],m.trim,.002);box(crt,[.006,h,w],[x,1.83+h/2,z],pcb,.001);
  const positions=i===0?[[.12,.17],[.30,.17],[.43,.19],[.18,.30],[.31,.38],[.56,.24],[.76,.26],[.79,.42],[.52,.51],[.29,.56],[.12,.62],[.29,.77],[.48,.74],[.62,.81],[.78,.84]]:[[.23,.16],[.37,.17],[.60,.17],[.73,.30],[.32,.36],[.47,.39],[.59,.42],[.75,.46],[.22,.62],[.39,.69],[.55,.72],[.76,.78]];
  for(const [u,v]of positions){const yy=1.84+(1-v)*h*.88,zz=z+(u-.5)*w*.86;cyl(crt,.003,.023,[x+.008,yy,zz],m.ivory,[0,0,0],'',8);box(crt,[.001,.033,.001],[x+.006,yy,zz],m.zinc,0);}
  for(const [u,v]of [[.52,.33],[.74,.57],[.23,.83]]){const yy=1.84+(1-v)*h*.88,zz=z+(u-.5)*w*.86;box(crt,[.014,.018,.012],[x+.009,yy,zz],m.chip,.002);}
  for(let k=0;k<(i?1:3);k++){cyl(crt,.010,.014,[x+.012,1.87+k*.05,z-w*.46],m.ivory,[0,0,Math.PI/2],'',12);box(crt,[.001,.015,.002],[x+.020,1.87+k*.05,z-w*.46],m.ink,0);}
 }
 // Flyback / EHT block, rubber anode cap and supported lead.
 box(crt,[.13,.13,.15],[.27,1.87,-.09],m.trim,.012);cyl(crt,.025,.10,[.27,1.96,-.09],m.black);
 tube(crt,[[.27,2.01,-.09],[.41,2.11,-.22],[.31,2.53,-.17],[.23,2.56,.025]],.009,m.redwire,28);
 cyl(crt,.049,.011,[.23,2.56,.025],m.trim,[Math.PI/2,0,0]);
 // Neck board socket and the six edge adjustments shown in MS/QG layout.
 box(crt,[.26,.24,.006],[0,2.26,-.748],pcb,.003);ring(crt,.045,.009,[0,2.26,-.759],m.ivory);for(let i=0;i<10;i++){const a=i*Math.PI/5;cyl(crt,.002,.012,[Math.cos(a)*.039,2.26+Math.sin(a)*.039,-.765],m.zinc,[Math.PI/2,0,0],'',8);}
 for(const [x,y]of [[-.115,2.34],[-.115,2.29],[-.115,2.24],[-.115,2.19],[.112,2.19],[.112,2.15]]){cyl(crt,.010,.018,[x,y,-.765],m.ivory,[Math.PI/2,0,0],'',12);box(crt,[.014,.002,.001],[x,y,-.775],m.ink,0);}
 for(const [x,y]of [[.090,2.32],[.082,2.28],[.085,2.23]]){box(crt,[.014,.026,.012],[x,y,-.762],m.chip,.001);for(let i=0;i<3;i++)box(crt,[.001,.01,.001],[x-.004+i*.004,y-.017,-.755],m.zinc,0);}
 for(const [x,y]of [[-.05,2.36],[-.02,2.36],[.03,2.35],[.07,2.35],[.04,2.19],[.05,2.16],[-.04,2.18],[-.01,2.17]]){cyl(crt,.003,.025,[x,y,-.758],m.ivory,[0,0,0],'',8);box(crt,[.001,.036,.001],[x,y,-.753],m.zinc,0);}
 // Purity and convergence ring pairs with adjustment tabs behind the yoke.
 for(let i=0;i<6;i++){const z=-.47-i*.009;ring(crt,.060,.003,[0,2.26,z],i%2?m.trim:m.glass);const a=.5+i*.38;const tab=box(crt,[.018,.047,.004],[Math.cos(a)*.066,2.26+Math.sin(a)*.066,z],m.trim,.001);tab.rotation.z=a-Math.PI/2;}
 for(let i=0;i<3;i++){const a=i*2*Math.PI/3;const wedge=box(crt,[.034,.020,.052],[Math.cos(a)*.155,2.26+Math.sin(a)*.155,-.22],m.trim,.004);wedge.rotation.z=a;}
 for(let i=0;i<4;i++)tube(crt,[[Math.cos(i)*.13,2.26+Math.sin(i)*.13,-.27],[.24+i*.007,2.10,-.33],[.25+i*.007,1.83,-.44]],.003,[m.redwire,m.bluewire,m.yellowwire,m.whitewire][i],18);
 box(crt,[.14,.058,.002],[-.22,2.30,-.11],mat('monitor_label','#cec8ad',0,.9),.001,'monitor_label');
 for(const x of [-.35,.35])for(const z of [-.57,-.05])screw(crt,[x,1.798,z],'y',.006);
}
