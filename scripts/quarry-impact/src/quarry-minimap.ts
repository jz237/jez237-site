import {trackPoint} from './rules';
type MapCar={id:number;health:number;current:{x:number;z:number};currentQ:{x:number;y:number;z:number;w:number}};
export type MinimapCourse={point(t:number):{x:number;z:number};extent:number;halfWidth?:number;lines?:readonly {points:readonly {x:number;z:number}[];width:number}[]};
export function drawQuarryMap(canvas:HTMLCanvasElement,cars:MapCar[],arena:{x:number;z:number;radius:number;outline?:readonly {x:number;z:number}[]},mode:string,followed:number,waypoints:readonly {x:number;z:number;label:string}[]=[],course?:MinimapCourse){
 const c=canvas.getContext('2d')!,size=canvas.width,r=size*.45,cx=size/2,cy=size/2;
 c.clearRect(0,0,size,size);c.save();c.beginPath();c.arc(cx,cy,r,0,Math.PI*2);c.clip();
 const ground=c.createRadialGradient(cx,cy,0,cx,cy,r);ground.addColorStop(0,'#afa899e8');ground.addColorStop(1,'#5d6155ef');c.fillStyle=ground;c.fillRect(0,0,size,size);
 const derby=mode==='derby',scale=derby?r/(arena.radius+13):r/(course?.extent??130),ox=derby?arena.x:0,oz=derby?arena.z:0;
 c.fillStyle='#c4bba6b0';c.strokeStyle='#343a35b0';c.lineWidth=6;c.beginPath();
 if(derby){if(arena.outline?.length){arena.outline.forEach((p,i)=>i?c.lineTo(cx+(p.x-ox)*scale,cy-(p.z-oz)*scale):c.moveTo(cx+(p.x-ox)*scale,cy-(p.z-oz)*scale));c.closePath();}else c.arc(cx,cy,arena.radius*scale,0,Math.PI*2);}
 else if(course){
  // A stroke follows both branches without filling their enclosed infields.
  c.strokeStyle='#343a35';c.lineWidth=(course.halfWidth??6)*2*scale;c.lineJoin='round';c.lineCap='round';
  for(let i=0;i<=256;i++){const p=course.point(i/256),x=cx+p.x*scale,y=cy-p.z*scale;i?c.lineTo(x,y):c.moveTo(x,y);}
 }
 else for(let i=0;i<=120;i++){const p=trackPoint(i/120),x=cx+(p.x-ox)*scale,y=cy-(p.z-oz)*scale;i?c.lineTo(x,y):c.moveTo(x,y);}
 if(derby||!course)c.fill();c.stroke();
 if(!derby&&course?.lines)for(const line of course.lines){c.beginPath();c.lineWidth=line.width*scale;line.points.forEach((p,i)=>i?c.lineTo(cx+p.x*scale,cy-p.z*scale):c.moveTo(cx+p.x*scale,cy-p.z*scale));c.stroke();}
 if(derby&&!arena.outline){c.fillStyle='#73989a80';for(let i=0;i<6;i++){c.beginPath();c.ellipse(cx+Math.sin(i*2.13)*r*.55,cy+Math.cos(i*3.41)*r*.50,9+i%3*3,5+i%2*3,i*.52,0,Math.PI*2);c.fill();}}
 for(const p of waypoints){const x=cx+(p.x-ox)*scale,y=cy-(p.z-oz)*scale;c.fillStyle='#14241d';c.strokeStyle='#ffdf83';c.lineWidth=2;c.beginPath();c.arc(x,y,10,0,Math.PI*2);c.fill();c.stroke();c.font='bold 12px Arial';c.textAlign='center';c.textBaseline='middle';c.fillStyle='#fff1bd';c.fillText(p.label==='FINISH'?'F':p.label,x,y);c.textBaseline='alphabetic';}
 for(const car of cars){const x=cx+(car.current.x-ox)*scale,y=cy-(car.current.z-oz)*scale;
  if(car.id===followed){const q=car.currentQ,yaw=Math.atan2(2*(q.w*q.y+q.x*q.z),1-2*(q.y*q.y+q.x*q.x));c.save();c.translate(x,y);c.rotate(yaw);c.fillStyle='#f6f5e7';c.strokeStyle='#363e38';c.lineWidth=2;c.beginPath();c.moveTo(0,-10);c.lineTo(-6,7);c.lineTo(0,4);c.lineTo(6,7);c.closePath();c.fill();c.stroke();c.restore();}
  else{c.fillStyle=car.health<=0?'#4b5047':['#da695a','#d8ba51','#478c95','#aa7862'][car.id%4];c.strokeStyle='#444b43';c.lineWidth=1.5;c.beginPath();c.arc(x,y,5.5,0,Math.PI*2);c.fill();c.stroke();}
 }
 c.restore();
 for(const [offset,color,width] of [[0,'#dddacdcc',3],[7,'#303931aa',2],[-7,'#bcc1b088',1]] as const){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.arc(cx,cy,r+offset,0,Math.PI*2);c.stroke();}
 c.font='bold 16px Arial';c.textAlign='center';c.fillStyle='#f4f2df';c.fillText('N',cx,cy-r+22);
}
