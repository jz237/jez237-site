const titles={'aquaclear-studio':'AquaClear · layered media','biowheel-studio':'Bio-Wheel · water-driven rotation','trickle-studio':'Wet/dry · trickling water','moving-bed-studio':'Moving bed · aerated carriers','sand-studio':'Fluidized sand · upward flow','drum-studio':'Drum · screen, rinse, waste','skimmer-studio':'Skimmer · air, foam, collection','roller-studio':'Fleece roller · capture and advance','filtoclear-studio':'FiltoClear · foam and UV','reef-filtration':'Reef sump · complementary processes'};
export function createFilterDiagram(viewport,id){
 const canvas=document.createElement('canvas');canvas.className='filter-schematic';canvas.setAttribute('aria-label',titles[id]+' animated diagram');viewport.append(canvas);const c=canvas.getContext('2d');let water=0,air=0,last=0,frames=0;
 const box=(x,y,w,h,fill='#16333d',stroke='#84b1bc',r=8)=>{c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.stroke();}};
 const circle=(x,y,r,fill,stroke)=>{c.beginPath();c.arc(x,y,r,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.stroke();}};
 const label=(text,x,y,size=15,color='#d6e5e5')=>{c.font=`${size}px system-ui`;c.textAlign='center';c.fillStyle=color;c.fillText(text,x,y);};
 function route(points,t,color='#a1e3ed',n=10){const distances=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1])),length=distances.reduce((a,b)=>a+b,0);c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.lineWidth=5;c.strokeStyle='#547c89';c.stroke();c.fillStyle=color;for(let i=0;i<n;i++){let d=((i/n+t*.07)%1)*length,j=0;while(d>distances[j]&&j<distances.length-1)d-=distances[j++];const a=points[j],b=points[j+1],f=d/distances[j],angle=Math.atan2(b[1]-a[1],b[0]-a[0]);c.save();c.translate(a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f);c.rotate(angle);c.beginPath();c.moveTo(8,0);c.lineTo(-5,-4);c.lineTo(-5,4);c.closePath();c.fill();c.restore();}}
 function wheel(x,y,r,t){circle(x,y,r,'#b6ad89','#e5d9b9');for(let i=0;i<16;i++){const a=i/16*Math.PI*2+t;c.beginPath();c.moveTo(x+Math.cos(a)*r*.25,y+Math.sin(a)*r*.25);c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);c.strokeStyle='#56645c';c.lineWidth=2;c.stroke();}circle(x,y,r*.15,'#263f45');}
 function bubbles(x,y,w,h,t,count=30){for(let i=0;i<count;i++){const p=(i/count+t*(.1+(i%3)*.02))%1;circle(x+(i*37%100)/100*w+Math.sin(p*9+i)*3,y+h-p*h,2+(i%3),null,'#9cdeea');}}
 function roller(x,y,t,small=false){const s=small?.55:1;c.save();c.translate(x,y);c.scale(s,s);box(0,25,210,185,'#235365');const advance=Math.floor(t/10)*2+Math.max(0,t%10-7)*.66;box(40,20,125,150,'#bec9b9');for(let i=0;i<8;i++){const py=35+(i*18+advance*20)%130;c.strokeStyle=i<4?'#738f83':'#a2916b';c.lineWidth=2;c.beginPath();c.moveTo(45,py);c.lineTo(160,py);c.stroke();}wheel(40,20,34,advance);wheel(166,20,34,-advance);box(12,167,185,20,'#397181',null);c.restore();}
 function skimmer(x,y,t,small=false){const s=small?.6:1;c.save();c.translate(x,y);c.beginPath();c.moveTo(25,230);c.lineTo(35,110);c.lineTo(64,58);c.lineTo(98,58);c.lineTo(127,110);c.lineTo(137,230);c.closePath();c.fillStyle='#235a6d';c.fill();c.strokeStyle='#9bbfc5';c.lineWidth=2;c.stroke();box(45,5,72,48,'#3b4b48');box(49,49-(t%14)/14*35,64,(t%14)/14*35,'#9b7141',null,2);bubbles(48,73,66,147,t,35);label('Foam',81,0,13);c.restore();}
 function media(x,y,w,h,count,t,r=7){for(let i=0;i<count;i++){const px=x+(i*43%101)/101*w+Math.sin(t*1.1+i)*5,py=y+(i*29%97)/97*h+Math.cos(t*.9+i*2)*7;circle(px,py,r,'#bac8b7','#668580');if(r>4)circle(px,py,r*.45,'#294e5b');}}
 return {render(time,state,moving){const dt=Math.max(0,time-last);last=time;const powered=state.pump!==false&&state.power!==false&&state.waterOn!==false;water+=powered?dt:0;air+=state.airOn!==false&&(powered||id==='moving-bed-studio')?dt:0;frames++;
  const w=Math.max(1,viewport.clientWidth),h=Math.max(1,viewport.clientHeight);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}c.clearRect(0,0,w,h);const top=h>500?155:100,scale=Math.min((w-28)/700,(h-top-60)/350);c.save();c.translate((w-700*scale)/2,top+(h-top-60-350*scale)/2);c.scale(scale,scale);label(titles[id],350,22,19,'#e1c8a1');
  if(id==='aquaclear-studio'||id==='biowheel-studio'){
   box(40,200,200,95,'#24576c');label('Aquarium',140,321);box(288,55,270,205);
   if(id==='biowheel-studio'){
    box(320,88,44,146,'#557e88');wheel(550,176,49,water*.65);
    route([[130,250],[130,78],[295,78],[295,150],[495,150],[515,180],[580,215],[580,290],[220,290]],water);
    label('Cartridge',345,278,13);label('Wet wheel',535,70,13);
   }else{
    box(320,186,175,40,'#557e88');box(320,140,175,40,'#555956');box(320,94,175,40,'#b4b69e');
    route([[130,250],[130,78],[295,78],[295,245],[408,245],[408,78],[545,78],[590,125],[590,290],[220,290]],water);
    label('Foam · carbon · bio-media',400,278,13);
   }
   label('Intake → media → return',350,345,13);
  }else if(id==='trickle-studio'){
   box(220,55,220,205);box(235,88,190,24,'#adb4a0');for(let i=0;i<12;i++)box(238+i*16,120+((water*32+i*17)%95),3,9,'#8dd6e2',null,1);media(245,149,160,95,30,0,8);box(175,265,390,44,'#245b70');label('Drip plate',330,76,13);label('Air-exposed media',330,250,13);route([[95,130],[95,42],[330,42],[330,86]],water,'#a1e3ed',6);route([[435,287],[600,287],[600,45],[470,45]],water,'#a1e3ed',7);label('Gravity through media · pumped return',350,345,13);
  }else if(id==='moving-bed-studio'||id==='sand-studio'){
   box(220,55,240,250,'#23596b');const sand=id==='sand-studio';media(242,sand?170:100,195,sand?105:165,sand?100:44,sand?water:air,sand?2.5:9);if(!sand)bubbles(245,100,190,190,air,25);box(235,288,210,8,'#8caca5',null);route([[80,275],[200,275],[200,305],[340,305],[340,286]],water,'#a1e3ed',7);route([[455,90],[560,90],[560,280],[625,280]],water,'#a1e3ed',6);label(sand?'Upward water suspends the grains':'Aeration tumbles protected bio-media',350,345,13);
  }else if(id==='drum-studio'){
   box(160,125,420,170,'#245569');c.save();c.translate(350,190);c.scale(1.6,1);circle(0,0,86,'#5c7475','#bed2cd');for(let i=0;i<18;i++){const a=i/18*Math.PI*2+water*.13;c.beginPath();c.moveTo(Math.cos(a)*86,Math.sin(a)*86);c.lineTo(Math.cos(a+Math.PI)*86,Math.sin(a+Math.PI)*86);c.strokeStyle='#9fb7ad';c.lineWidth=.6;c.stroke();}c.restore();box(250,187,200,14,'#927958');if(water%12>8)for(let i=0;i<7;i++)route([[255+i*32,63],[255+i*32,132]],water*2,'#b8ebef',3);route([[60,230],[180,230]],water);route([[520,254],[640,254]],water);route([[450,194],[600,194],[600,95]],water%12>8?water:0,'#deb58b',6);label('Screen retains solids · rinse exports them',350,345,13);
  }else if(id==='skimmer-studio'){
   skimmer(270,45,air);route([[90,260],[280,260]],water);route([[410,265],[610,265]],water);label('Water enters below · bubbles rise · foam collects',350,345,13);
  }else if(id==='roller-studio'){
   roller(245,83,water);route([[70,195],[252,195]],water);route([[460,265],[630,265]],water);label('Water crosses fleece · dirty fleece winds out',350,345,13);
  }else if(id==='filtoclear-studio'){
   box(230,65,240,240,'#244759');for(let i=0;i<5;i++)box(245,110+i*35,210,27,i%2?'#847398':'#537fa5',null);box(332,95,35,192,'#293a4a');box(344,110,10,160,'#c6adf3',null,3);route([[80,120],[210,120],[210,287],[285,287],[285,120]],water);route([[380,270],[380,85],[610,85],[610,225]],water);label('Foam captures solids · enclosed UV clarification',350,345,13);
  }else{
   box(45,115,610,187,'#204d5d');roller(78,130,water,true);skimmer(270,100,air,true);media(420,192,65,80,13,0,12);wheel(590,260,22,water*2);route([[50,80],[120,80],[120,130]],water,'#a1e3ed',6);route([[195,285],[280,285],[400,285],[550,285],[620,285],[620,80],[660,80]],water);label('Fleece',135,100,13);label('Skimmer',320,100,13);label('Biology',460,100,13);label('Return',590,100,13);label('Distinct processes · one circulating system',350,345,13);
  }
  c.restore();c.font='11px system-ui';c.textAlign='center';c.fillStyle='#b3c7cc';c.fillText((state.paused?'Paused':moving?'Animated diagram':'Inspection paused')+' · simplified teaching view',w/2,h-20);
 },snapshot:()=>({frames,water,air,kind:id}),dispose(){canvas.remove();}};
}
