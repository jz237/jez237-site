// No WebGL, external assets or GPU dependency. Uses the same simulation clock,
// interlocks, parcel readings and controls as the 3D lesson.
export function createDiagram(viewport){
 const canvas=document.createElement('canvas');canvas.className='flow-diagram';canvas.setAttribute('aria-label','Animated aquarium, mechanical filter, UV chamber and return circuit');viewport.append(canvas);const c=canvas.getContext('2d');let lastTravel=0,frames=0;
 function round(x,y,w,h,r,fill,stroke){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=1.5;c.stroke();}}
 function label(t,x,y,size=12,color='#c8d9df'){c.fillStyle=color;c.font=`${size}px system-ui`;c.textAlign='center';c.fillText(t,x,y);}
 return {canvas,render(state,s){const width=Math.max(1,viewport.clientWidth),height=Math.max(1,viewport.clientHeight);if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}c.clearRect(0,0,width,height);frames++;lastTravel=s.travel;
  // Use a stable logical drawing area; enough room above for the title.
  const scale=Math.min((width-30)/760,(height-200)/330),x=(width-760*scale)/2,y=145+(height-200-330*scale)/2;c.save();c.translate(x,y);c.scale(scale,scale);
  const flow=s.flow>.01&&state.mode!=='exploded',purple=s.lamp&&state.field&&state.mode!=='exploded';
  round(16,50,145,195,10,'#243e49','#8cbdc8');round(24,110,129,125,5,'#2b718a');label('AQUARIUM',88,270);label('Water recirculates',88,290,10);
  round(222,105,84,138,8,'#26363c','#a4aba2');for(let i=0;i<8;i++)round(232+i*8,118,4,108,1,'#a9ad94');label('MECHANICAL',264,270);label('Solids captured',264,290,10);
  c.strokeStyle='#718f9a';c.lineWidth=10;c.beginPath();c.moveTo(158,178);c.lineTo(223,178);c.moveTo(306,178);c.lineTo(370,178);c.moveTo(715,178);c.lineTo(742,178);c.lineTo(742,55);c.lineTo(90,55);c.lineTo(90,110);c.stroke();
  const spread=state.explode*45;round(368-spread,119,350,120,24,'#182832','#a6bac2');round(380-spread,133,324,91,18,'#296078','#6dacc0');
  const lampX=402+spread*1.5;round(lampX,153,278,48,15,'#98cbd326','#b6dbdf');round(lampX+12,164,248,9,4,purple?'#cfbcff':'#768188');round(lampX+12,184,248,9,4,purple?'#cfbcff':'#768188');
  if(purple){const glow=c.createLinearGradient(0,133,0,224);glow.addColorStop(0,'#b08bed00');glow.addColorStop(.5,'#b08bed44');glow.addColorStop(1,'#b08bed00');round(383,135,318,87,17,glow);}
  label(state.mode==='exploded'?'SEPARATED · POWER ISOLATED':'UV CHAMBER',544,270);label('Dry lamp inside quartz · water outside',544,290,10);
  // Moving arrows are placed on the closed loop and within the annulus.
  if(state.arrows&&flow){c.fillStyle='#b9e7ef';for(let i=0;i<16;i++){const p=(i/16+s.travel*.06)%1;let ax,ay,angle;if(p<.45){ax=160+p/.45*570;ay=178;angle=0;}else if(p<.53){ax=742;ay=178-(p-.45)/.08*123;angle=-Math.PI/2;}else if(p<.94){ax=742-(p-.53)/.41*652;ay=55;angle=Math.PI;}else{ax=90;ay=55+(p-.94)/.06*55;angle=Math.PI/2;}if(ax>370&&ax<715&&ay===178)ay=i%2?144:213;c.save();c.translate(ax,ay);c.rotate(angle);c.beginPath();c.moveTo(7,0);c.lineTo(-5,-4);c.lineTo(-5,4);c.closePath();c.fill();c.restore();}}
  if(s.parcel.active){c.fillStyle='#f5c381';c.beginPath();c.arc(388+s.parcel.progress*310,212,7,0,Math.PI*2);c.fill();}
  if(s.service){label('SERVICE: '+(s.servicePhase+1)+' / 6',544,98,13,'#f2d3a9');}
  label('VISIBLE VIOLET IS A TEACHING OVERLAY · UV-C IS INVISIBLE',386,325,9,'#bdafce');c.restore();
 },snapshot:()=>({frames,travel:lastTravel,animated:true}),dispose(){canvas.remove();}};
}
