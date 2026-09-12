/** Original, locally rendered interface study. No Tesla firmware, maps, or vehicle API. */
export class CockpitDisplay {
 constructor(host,onChange=()=>{}){
  this.canvas=document.createElement('canvas');this.canvas.width=1200;this.canvas.height=760;host.append(this.canvas);this.ctx=this.canvas.getContext('2d');
  this.overlay=document.createElement('div');this.overlay.className='screen-hotspots';host.append(this.overlay);
  this.state={tab:'navigation',temperature:72,fan:3,auto:true,ac:true,seatHeat:0,battery:78,limit:85,charging:false,locked:true,lights:'Auto',night:false,brightness:85,route:null};this.onChange=onChange;this.targets=[];this.elapsed=0;this.render();
 }
 getState(){return {...this.state};}
 tab(name){this.state.tab=name;this.render();}
 change(fn){fn(this.state);this.render();}
 text(value,x,y,size=20,color=this.ink,weight=400){const c=this.ctx;c.fillStyle=color;c.font=`${weight} ${size}px Arial, sans-serif`;c.fillText(value,x,y);}
 rect(x,y,w,h,fill,r=12){const c=this.ctx;c.fillStyle=fill;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();}
 line(points,color,width=3){const c=this.ctx;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=width;c.lineJoin='round';c.lineCap='round';c.stroke();}
 button(label,x,y,w,h,action,{active=false,small=false}={}){
  this.rect(x,y,w,h,active?'#227bd4':this.tile,9);this.text(label,x+16,y+h/2+(small?6:8),small?19:23,active?'#fff':this.ink,500);this.targets.push({label,x,y,w,h,action});
 }
 car(x,y,scale=1){const c=this.ctx;c.save();c.translate(x,y);c.scale(scale,scale);c.shadowColor='#0004';c.shadowBlur=18;this.rect(-52,-112,104,226,'#9da9b1',31);c.shadowBlur=0;this.rect(-39,-69,78,116,'#293b49',21);this.rect(-34,-105,68,26,'#c9d3d9',13);this.rect(-33,54,66,51,'#bac5ce',12);for(const sx of [-1,1]){this.rect(sx===-1?-61:50,-71,11,47,'#18232c',4);this.rect(sx===-1?-61:50,52,11,47,'#18232c',4);}this.line([[-30,-9],[30,-9]],'#627582',2);c.restore();}
 render(){
  const focusIndex=[...this.overlay.children].indexOf(document.activeElement);const c=this.ctx,s=this.state;this.ink=s.night?'#edf2f8':'#17212c';this.muted=s.night?'#9baec0':'#647382';this.bg=s.night?'#15202c':'#f4f6f8';this.tile=s.night?'#293949':'#e2e8ed';this.targets=[];c.clearRect(0,0,1200,760);this.rect(0,0,1200,760,this.bg,0);
  this.text('MODEL S',26,34,19,this.ink,600);this.text('P',263,34,20,'#368357',600);this.text('STUDIO PROFILE',325,34,16,this.muted);this.text('72°F OUTSIDE',854,34,16,this.muted);this.text('DEMO',1100,34,16,'#358569',600);
  this.line([[0,52],[1200,52]],s.night?'#354656':'#dce2e7',1);
  this.text('PARKED',30,99,18,this.muted,600);this.text('0',34,176,77,this.ink,300);this.text('mph',105,172,19,this.muted);this.car(130,340,1.1);
  this.text(s.locked?'Doors locked':'Doors unlocked',54,502,19,this.muted);this.rect(33,540,192,7,this.tile,3);this.rect(33,540,192*s.battery/100,7,'#47a887',3);this.text(`${Math.floor(s.battery)}%`,32,586,30,this.ink,500);this.text(s.charging?'Charging demo':'Sample battery',32,617,17,this.muted);this.line([[259,53],[259,670]],s.night?'#354656':'#dce2e7',1);
  if(s.tab==='navigation')this.navigation();if(s.tab==='climate')this.climate();if(s.tab==='charging')this.charging();if(s.tab==='controls')this.controls();
  this.rect(0,674,1200,86,s.night?'#0e1720':'#fff',0);
  const tabs=[['navigation','Navigate'],['climate','Climate'],['charging','Charging'],['controls','Controls']];tabs.forEach(([key,label],i)=>this.button(label,20+i*226,690,212,52,()=>this.tab(key),{active:s.tab===key}));this.text(`${s.temperature}°`,1003,726,31,this.ink,500);this.text('CABIN',1100,722,14,this.muted);
  this.overlay.replaceChildren(...this.targets.map(t=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',t.label);b.textContent=t.label;b.style.cssText=`left:${t.x/12}%;top:${t.y/7.6}%;width:${t.w/12}%;height:${t.h/7.6}%`;b.onclick=()=>t.action();return b;}));if(focusIndex>=0)this.overlay.children[focusIndex]?.focus({preventScroll:true});this.onChange(this.state);
 }
 navigation(){
  const c=this.ctx,s=this.state;this.rect(260,53,940,620,s.night?'#202f3b':'#e9eeeb',0);
  c.fillStyle=s.night?'#214259':'#b3d7e5';c.beginPath();c.moveTo(790,53);c.bezierCurveTo(680,260,1040,210,878,455);c.bezierCurveTo(800,585,997,618,1040,674);c.lineTo(1200,674);c.lineTo(1200,53);c.fill();
  for(const [x,y,w,h] of [[321,140,115,69],[483,237,117,66],[358,372,171,102],[655,438,122,67],[717,99,90,70]])this.rect(x,y,w,h,s.night?'#2c443d':'#d1dfcb',18);
  const roads=[[[260,226],[643,226],[756,135],[1060,135],[1200,222]],[[315,53],[315,620]],[[460,53],[460,674]],[[606,53],[606,347],[769,347],[910,462],[1200,462]],[[260,328],[561,328],[744,571],[982,571]],[[260,511],[560,511],[678,615],[1200,615]]];
  for(const road of roads){this.line(road,s.night?'#475967':'#fff',16);this.line(road,s.night?'#3e505d':'#d9dfdf',2);}
  this.text('LAKE MERIDIAN',968,320,20,s.night?'#8dbece':'#6597a9',500);this.text('NORTH PARK',337,412,16,this.muted);this.text('HARBOR DRIVE',691,552,14,this.muted);
  this.rect(284,74,448,57,s.night?'#15202c':'#fff',13);this.text(s.route?`→ ${s.route}`:'Choose a sample destination',305,111,23,this.ink,500);
  const routes={'Lakeside overlook':[[460,511],[460,328],[561,328],[650,449],[770,449]],'Hilltop observatory':[[460,511],[460,226],[643,226],[756,135]],'Harbor charger':[[460,511],[560,511],[678,615],[958,615]]};
  if(s.route){this.line(routes[s.route],'#2589df',9);const end=routes[s.route].at(-1);this.rect(end[0]-12,end[1]-12,24,24,'#257ed3',12);}
  c.save();c.translate(460,511);c.fillStyle='#2079cd';c.beginPath();c.moveTo(0,-20);c.lineTo(14,17);c.lineTo(0,9);c.lineTo(-14,17);c.closePath();c.fill();c.restore();
  ['Lakeside overlook','Hilltop observatory','Harbor charger'].forEach((name,i)=>this.button(name,284,153+i*58,280,47,()=>this.change(s=>s.route=name),{active:s.route===name,small:true}));
  if(s.route){this.rect(284,573,356,77,this.bg,12);this.text(s.route==='Lakeside overlook'?'12 min · 6.4 mi':s.route==='Hilltop observatory'?'18 min · 9.8 mi':'8 min · 3.1 mi',305,605,23,this.ink,500);this.text('Route preview · vehicle remains parked',305,634,16,this.muted);}
  else this.text('FICTIONAL MAP / ROUTE PREVIEW',801,651,14,this.muted);
 }
 climate(){
  const s=this.state;this.text('Climate',298,109,36,this.ink,500);this.text('Adjust the cabin experience.',299,143,19,this.muted);
  this.rect(292,175,430,279,this.tile);this.text('CABIN TEMPERATURE',318,212,17,this.muted,600);this.text(`${s.temperature}°`,436,325,88,this.ink,300);
  this.button('− Cooler',315,363,170,62,()=>this.change(s=>s.temperature=Math.max(60,s.temperature-1)));this.button('+ Warmer',512,363,184,62,()=>this.change(s=>s.temperature=Math.min(82,s.temperature+1)));
  this.text('FAN SPEED',779,212,18,this.muted,600);for(let i=0;i<10;i++)this.rect(780+i*32,251-(i*5),22,30+i*5,i<s.fan?'#2482d7':this.tile,3);this.text(`${s.fan} / 10`,782,327,27);
  this.button('− Fan',773,364,165,61,()=>this.change(s=>{s.fan=Math.max(0,s.fan-1);s.auto=false;}));this.button('+ Fan',957,364,165,61,()=>this.change(s=>{s.fan=Math.min(10,s.fan+1);s.auto=false;}));
  this.button(s.auto?'Auto: on':'Auto: off',297,492,253,65,()=>this.change(s=>{s.auto=!s.auto;if(s.auto&&s.fan===0)s.fan=3;}),{active:s.auto});this.button(s.ac?'A/C: on':'A/C: off',574,492,250,65,()=>this.change(s=>s.ac=!s.ac),{active:s.ac});this.button(`Seat heat: ${s.seatHeat}`,848,492,281,65,()=>this.change(s=>s.seatHeat=(s.seatHeat+1)%4),{active:s.seatHeat>0});
  this.text('Fan changes animate the airflow in the 3D cabin.',299,614,20,this.muted);
 }
 charging(){
  const s=this.state;this.text('Charging',298,109,36,this.ink,500);this.text('An accelerated demonstration of charging controls.',298,144,19,this.muted);
  this.rect(298,183,500,188,this.tile,22);this.rect(312,197,472*s.battery/100,160,'#409a78',15);this.rect(798,244,17,64,this.tile,4);this.text(`${s.battery.toFixed(1)}%`,339,299,61,s.battery>60?'#fff':this.ink,500);
  this.text('CHARGE LIMIT',866,210,18,this.muted,600);this.text(`${s.limit}%`,861,284,52);this.button('− Limit',846,320,131,51,()=>this.change(s=>{s.limit=Math.max(50,s.limit-5);if(s.battery>=s.limit)s.charging=false;}),{small:true});this.button('+ Limit',995,320,140,51,()=>this.change(s=>s.limit=Math.min(100,s.limit+5)),{small:true});
  this.button(s.charging?'Stop charging demo':'Start charging demo',297,421,476,73,()=>this.change(s=>s.charging=!s.charging&&s.battery<s.limit),{active:s.charging});this.button('Reset sample to 78%',801,421,334,73,()=>this.change(s=>{s.battery=78;s.charging=false;}),{small:true});
  this.text(s.battery>=s.limit?'Limit reached — increase the limit to continue.':s.charging?'Simulated charging is active. Watch both displays.':'Ready to simulate. No charger connection is required.',299,549,23,this.ink,500);this.text('Sample state only. The animation is faster than real charging.',299,594,19,this.muted);
 }
 controls(){
  const s=this.state;this.text('Vehicle controls',298,109,36,this.ink,500);this.text('Explore a few familiar touchscreen functions.',298,144,19,this.muted);
  this.button(s.locked?'Doors: locked':'Doors: unlocked',296,188,400,86,()=>this.change(s=>s.locked=!s.locked),{active:s.locked});this.button(`Headlights: ${s.lights}`,729,188,407,86,()=>this.change(s=>s.lights=['Auto','On','Off'][(['Auto','On','Off'].indexOf(s.lights)+1)%3]));
  this.button(s.night?'Appearance: night':'Appearance: day',296,298,840,78,()=>this.change(s=>s.night=!s.night),{active:s.night});
  this.text('DISPLAY BRIGHTNESS',300,431,18,this.muted,600);this.rect(299,458,530,10,this.tile,4);this.rect(299,458,530*s.brightness/100,10,'#237bd4',4);this.text(`${s.brightness}%`,861,474,27);
  this.button('− Dimmer',297,512,253,59,()=>this.change(s=>s.brightness=Math.max(25,s.brightness-10)));this.button('+ Brighter',575,512,253,59,()=>this.change(s=>s.brightness=Math.min(100,s.brightness+10)));
  this.text('MODEL S STUDIO / SOFTWARE STUDY 1.0',300,627,17,this.muted);
 }
 activateUV(uv){const x=uv.x*1200,y=(1-uv.y)*760,t=this.targets.find(t=>x>=t.x&&x<=t.x+t.w&&y>=t.y&&y<=t.y+t.h);if(t)t.action();return !!t;}
 tick(dt){if(!this.state.charging)return;this.elapsed+=dt;if(this.elapsed<.4)return;this.state.battery=Math.min(this.state.limit,this.state.battery+this.elapsed*.35);this.elapsed=0;if(this.state.battery>=this.state.limit)this.state.charging=false;this.render();}
}
