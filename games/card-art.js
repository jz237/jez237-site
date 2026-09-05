/* Hand-built animated cover illustrations. No game code or remote assets loaded. */
(() => {
  const entries = {
    'Philadelphia Relief':['relief','#69d7e9','#e8c58c',0],
    'Final Blow: Philly After Dark':['fighter','#fe685e','#85a9e9',0],
    'Pinball Illusions':['pinball','#e861be','#91e6ef',0],
    'Pinball Fantasies HD':['pinball','#ffc34f','#e9618f',1],
    'Pinball Dreams HD':['pinball','#69cfff','#ad8bff',2],
    'Commando HD':['commando','#d5c27c','#a0bc6a',0],
    'Volcano':['volcano','#ff723d','#b898c8',0],
    'Smoke Lab':['smoke','#db83ed','#63d9ed',0],
    'Aquarium Laboratory':['aquarium','#6adee9','#ffb55d',0],
    'Skyhook: Ruin Runner':['skyhook','#f1d396','#7fcfce',0],
    'Chrome Riot':['robot','#fa627b','#65e3dc',0],
    'Stunt Car Racer HD':['racer','#f4a756','#84bbe3',0],
    'VOIDFORGE':['space','#c6a2ff','#f68954',0],
    'LUMEN':['grove','#b6eb83','#69e3de',0],
    'Marble Madness':['marble','#79c9ec','#c8a5ef',0],
    'Shatter Storm':['bricks','#69dce7','#ffb479',0],
    'Missile Command':['missile','#ffbc69','#85d7eb',0],
    'Turrican II':['robot','#e3c973','#7fb2ff',1],
    'Joust':['joust','#f0ca77','#ff756b',0],
    'Vector Arena':['vector','#63ece3','#ed76d2',0],
    'Steel Ribbon Racer':['racer','#fd7995','#88caf0',1],
    'Steel Duel':['tank','#d9b271','#95d9cf',0],
    'Snake Awakening':['snake','#b6e87d','#e5a96e',0],
    'Pay Dirt':['mine','#f4ce6c','#87bde8',0],
    'Eddy':['eddy','#67d8dc','#d3e99e',0],
    'Iron Ridge':['tank','#b1c891','#e4ac72',1],
    'Glimmer Grotto':['grove','#c79be9','#91e1c0',1],
    'Hollow Deep':['cave','#ecbb72','#8eb9bc',0],
    'Millipede':['millipede','#abd474','#cf8bd9',0],
    'Emerald Mine II':['mine','#90e3b5','#e1c075',1],
    'Night Fireworks Show':['fireworks','#ffc66a','#e2a0eb',0],
    'Hard Hat Mac':['construction','#eebc6e','#93cbe9',0],
    'Crystal Cavern':['cave','#d294e9','#74d7e7',1],
    'Plasma Pong':['pong','#91cafa','#e596cf',0],
    'Asteroids HD':['space','#8ad8ed','#edb574',1],
    'Invaders':['invaders','#afe587','#ff9797',0],
    'Fluid Lab':['fluid','#ee87ad','#65d9e1',0],
    'Particle Graphics Cat':['cat','#79dcea','#d89ce4',0],
    'Stellar Drift':['space','#ebaf68','#9ec5eb',2],
    'SUPER STAR TREK':['trek','#e5b875','#8fbdeb',0],
    'Lunar Lander':['lander','#e7ca87','#9fc5de',0],
    'Neon Qix':['qix','#e2a3e9','#7bdade',0],
    'Sky Joust':['joust','#e1b77d','#9ecedc',1],
    'Depth Charge':['submarine','#75c7d0','#e2bc79',0],
    'Glassrail Bastion':['train','#a0cbea','#d6a6eb',0],
    'PRIMORDIA':['primordia','#82d2c3','#e2a0ca',0],
    'Choplifter: Rescue Run':['helicopter','#e5bd73','#92cfd7',0],
    'Subway Siege: Blackout':['train','#e6b678','#76b8b5',1],
    'Subway Siege':['train','#81c5e3','#dc8e86',2],
    'Slash':['slash','#e6a9c5','#8ed8d5',0],
    'Gravity Weaver':['gravity','#b2a2ea','#93decd',0]
  };
  let serial=0;
  const path=(d,fill='none',stroke='',w=1,extra='')=>`<path d="${d}" fill="${fill}"${stroke?` stroke="${stroke}" stroke-width="${w}"`:''} ${extra}/>`;
  const circle=(x,y,r,fill,stroke='',w=1,extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"${stroke?` stroke="${stroke}" stroke-width="${w}"`:''} ${extra}/>`;
  const rect=(x,y,w,h,fill,rx=0,stroke='',extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"${stroke?` stroke="${stroke}" stroke-width=".7"`:''} ${extra}/>`;
  const ellipse=(x,y,rx,ry,fill,stroke='',extra='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}"${stroke?` stroke="${stroke}" stroke-width=".65"`:''} ${extra}/>`;
  const group=(body,transform='',motion='',extra='')=>`<g${transform?` transform="${transform}"`:''} ${extra}>${motion?`<g class="ca-motion ${motion}">${body}</g>`:body}</g>`;
  const repeat=(n,fn)=>Array.from({length:n},(_,i)=>fn(i)).join('');
  const blink=(body,delay=0)=>group(body,'','ca-glimmer',`style="--lag:${delay}s"`);

  function makeScene(type,a,b,v,id){
    const metal=`url(#${id}-metal)`,lit=`url(#${id}-lit)`,haze=`url(#${id}-haze)`;
    const stars=repeat(24,i=>circle(5+(i*37)%91,3+(i*19)%43,i%4===0?.55:.28,i%3?a:b,'',1,`opacity="${.22+(i%4)*.15}"`));
    const horizon=path('M0 40 12 32 22 38 36 22 48 35 66 20 85 34 100 28V68H0Z','#182538')+path('M0 51 19 39 37 50 54 34 74 43 89 36 100 47V68H0Z','#0d1825');
    const floor=path('M0 48H100V68H0Z','#091420')+repeat(6,i=>path(`M${-30+i*32} 68 50 39`,'none',a,.35,'opacity=".13"'))+repeat(4,i=>path(`M0 ${49+i*i*1.7}H100`,'none',a,.35,'opacity=".14"'));
    const skyline=(y=44)=>repeat(16,i=>{const x=i*7-3,h=7+(i*13)%22;return rect(x,y-h,5,h,'#142333')+rect(x+1,y-h+2,.7,h-4,i%3?b:a,0,'','opacity=".28"')});
    const crystal=(x,y,s,color=a)=>group(path('M0 -13 5 -5 4 5 0 10-5 3-4-7Z','#152333',color,.6)+path('M0-13 1 1 0 10-4-7Z',color)+path('M0-13 5-5 1 1Z','#e4f8f9')+path('M1 1 4 5 0 10Z',color,'',1,'opacity=".55"'),`translate(${x} ${y}) scale(${s})`);
    const fish=(x,y,s,color,delay=0)=>group(path('M-8 0Q-1-8 9 0Q1 7-8 0L-13-5-12 5Z',color)+path('M-6-1Q1-5 7-1','none','#f4f3d0',.5)+circle(5,-1,.6,'#08141a')+path('M-2-4 1-8 4-4Z',color),`translate(${x} ${y}) scale(${s})`,'ca-swim',`style="--lag:${delay}s"`);
    const tank=(x,y,s,color)=>group(ellipse(0,9,18,4,'#03070d')+rect(-15,-2,7,13,'#0a1017',2,'#697583')+rect(8,-2,7,13,'#0a1017',2,'#697583')+repeat(5,i=>path(`M-14 ${i*2.5}h5M9 ${i*2.5}h5`,'none','#677078',.7))+path('M-11-5 8-7 13 5 9 9-10 9-13 3Z',color,'#b3bcb0',.5)+path('M-11-5 8-7 10-3-8 0Z',metal)+ellipse(0,0,7,5,'#26383a','#9baaa2')+rect(-2,-16,3,16,metal,.7)+rect(-3,-17,5,3,'#34494e',.6)+circle(-5,4,1,a),`translate(${x} ${y}) scale(${s})`);
    const ship=(x,y,s)=>group(ellipse(0,12,11,3,haze)+path('M0-15 13 12 4 8 0 14-4 8-13 12Z',metal,'#bfd5df',.5)+path('M0-10 4 5 0 9-4 5Z',a)+path('M-8 8-6 14M8 8 6 14','none',b,2)+group(path('M-3 11 0 24 3 11Z',b),'','ca-thrust')+path('M0-8 1 3-1 3Z','#f3fcff'),`translate(${x} ${y}) scale(${s})`,'ca-hover');
    const person=(x,y,s,color,pose=0)=>group(circle(0,-10,2.5,'#d1aa92')+path(pose?'M-3-6 3-6 5 2-4 3Z':'M-3-6 3-6 3 2-3 2Z',color)+path(pose?'M-2 2-7 10M2 2 9 8M-3-4-9-1M3-4 10-8':'M-2 2-3 11M2 2 4 11M-3-4-7 2M3-4 8-2','none',color,3,'stroke-linecap="round"'),`translate(${x} ${y}) scale(${s})`);
    const flame=(x,y,s=1)=>group(path('M0 10Q-9 2-3-9L0-4 4-14Q4-3 7 1 10 8 0 10Z',a)+path('M0 8Q-4 2 1-5 5 4 0 8Z','#fff0b1'),`translate(${x} ${y}) scale(${s})`,'ca-flicker');
    const leaves=(x,y,h,color)=>path(`M${x} ${y}Q${x-5} ${y-h/2} ${x+2} ${y-h}M${x} ${y-4}q-10-3-7-10M${x} ${y-10}q9-1 8-8M${x} ${y-17}q-7-1-5-7`,'none',color,1.7,'stroke-linecap="round"');

    switch(type){
      case 'relief': return stars+path('M8 47 44 24 94 40 59 63Z','#122932',a,.8)+path('M8 47v5l51 16v-5Z','#102029')+path('M59 63 94 40v6L59 68Z','#1e4149')+repeat(7,i=>path(`M${13+i*4} ${45+i}q15-15 33-7t32-1`,'none',a,.45,'opacity=".25"'))+path('M56 28Q43 34 62 39T63 60','none','#53bfcf',4)+repeat(20,i=>{const x=23+(i*17)%49,y=41+(i*7)%10,h=3+(i*11)%17;return path(`M${x} ${y}v-${h}l3-2 3 1v${h}l-3 2Z`,metal)+path(`M${x+3} ${y-2}v-${h}`,'none',b,.65)})+path('M63 43 78 49M66 40v8M75 44v8','none',b,.8)+blink(circle(52,32,1.1,a)+circle(74,47,1,b));
      case 'fighter': return skyline()+floor+rect(8,16,24,7,'#192437',1,a)+path('M11 19h17M14 21h11','none',a,.65)+path('M0 55 100 48','none',b,.5)+group(person(35,42,1.55,'#a6c8d8',1),'','ca-stance')+group(person(65,42,1.55,'#cb705f',1),'translate(130 0) scale(-1 1)','ca-stance', 'style="--lag:-1.4s"')+blink(path('M48 30 54 34 51 28 58 32M51 36 56 39','none','#fff0c2',1.2)) +ellipse(48,63,26,3,haze);
      case 'pinball': return floor+path('M27 6H72L86 59 80 65H15L12 58Z','#112333','#8793a1',1)+path('M30 9H69L80 57H20Z',v===1?'#462237':v===2?'#192f42':'#362349',a,.7)+path('M32 13Q12 24 29 47M66 13Q86 27 69 46','none',metal,2)+repeat(3,i=>group(circle(38+i*12,24+(i%2)*11,5,'#1b2030',b,1.2)+circle(38+i*12,24+(i%2)*11,2.5,a),'','ca-glimmer',`style="--lag:${-i*.7}s"`))+repeat(7,i=>circle(28+i*7,45-(i%2)*4,1.1,i%2?a:b))+group(path('M29 53 44 57','none',metal,3,'stroke-linecap="round"'),'','ca-flipper')+group(path('M69 53 54 57','none',metal,3,'stroke-linecap="round"'),'','ca-flipper','style="--lag:-.6s"')+group(circle(54,39,2,metal),'','ca-pinball')+rect(39,12,20,5,'#0a1320',.5)+path(`M42 14h${v===0?12:v===1?8:15}`,'none',a,1)+path('M18 61h64','none',a,1.3);
      case 'commando': return horizon+path('M25 68 39 25 57 25 81 68Z','#454937')+repeat(9,i=>group(leaves(4+(i*23)%93,45+(i%3)*12,18,'#324c3e'),'','ca-sway'))+rect(65,37,17,12,'#575a40',1,'#adb17d')+repeat(3,i=>rect(13+i*7,44,5,8,i%2?'#727050':'#604735',1))+person(47,45,1.3,'#b5c17e',1)+path('M55 38 68 31','none',metal,2)+blink(path('M69 31 76 29M70 32 74 34','none','#fff1bd',1.5))+path('M37 59 62 61','none',a,.8);
      case 'volcano': return stars+ellipse(54,42,39,20,haze)+group(repeat(8,i=>circle(48+Math.sin(i*2)*10,30-i*4,5+i*.55,i%2?'#584256':'#372d42','','',`opacity="${.75-i*.06}"`)),'','ca-plume')+path('M0 65 20 49 39 26 47 30 55 25 76 47 100 64Z','#302a35','#80686c',.5)+path('M0 65 37 31 30 50 49 62 59 36 75 47 100 65Z','#171d2a')+path('M43 30 47 40 42 45 50 55 45 66M53 29 57 40 65 49 70 65','none',a,2.3)+path('M43 30 47 40 42 45 50 55','none','#ffdfa5',.7)+flame(48,25,.43)+repeat(10,i=>blink(circle(25+(i*13)%53,9+(i*7)%30,.65,i%2?a:'#ffe8af'),-i*.31));
      case 'smoke': return floor+rect(20,8,60,46,'#0e1d2d',3,'#506070')+repeat(8,i=>path(`M22 ${13+i*5}h56`,'none',b,.25,'opacity=".22"'))+rect(37,41,27,11,metal,2)+group(path('M48 46C20 37 64 36 38 25S63 11 47 4','none',a,8,'opacity=".22" stroke-linecap="round"')+path('M51 45C72 29 25 34 58 18S40 6 62 3','none',b,6,'opacity=".34" stroke-linecap="round"')+path('M50 44C29 32 62 28 47 18S49 8 54 5','none','#efe0ff',1.2,'opacity=".8"'),'','ca-smoke')+blink(circle(49,44,2,a))+rect(29,57,42,3,'#374655',1)+repeat(5,i=>circle(34+i*8,58.5,.7,i%2?a:b));
      case 'aquarium': return rect(7,8,86,51,'#092c39',4,'#60858e')+path('M8 13Q30 9 51 13T93 13','none','#b5eef1',1.3)+path('M8 55Q35 48 58 55T92 53V61H8Z','#263c3d')+repeat(8,i=>group(leaves(13+i*11,56,14+(i*7)%20,i%2?'#46745d':'#6b9170'),'','ca-sway',`style="--lag:${-i*.4}s"`))+path('M35 56 41 42 52 47 57 57Z','#465d61','#7b9390',.5)+fish(38,28,1.2,b)+fish(69,38,.85,a,-1.3)+fish(23,43,.6,'#c6b5d9',-2.2)+repeat(6,i=>group(circle(77+(i%2)*3,51-i*6,.8,'none','#a3e3e8',.5),'','ca-bubble',`style="--lag:${-i*.5}s"`))+path('M10 10v44M89 11v44','none','#ccf8ff',.6,'opacity=".4"');
      case 'skyhook': return stars+ellipse(48,22,50,30,haze)+path('M0 40Q18 30 40 39T100 36V68H0Z','#213b49')+repeat(3,i=>group(path('M-14 0 10-4 17 1 0 21Z','#2c4145')+path('M-14 0 10-4 17 1-7 6Z','#98a79a')+rect(-7,-14,5,17,'#b7b89b')+rect(5,-19,5,18,'#c7c8aa')+path('M-7-14 10-19','none',b,2),`translate(${15+i*37} ${42-(i%2)*20})`))+circle(48,13,3,a)+path('M48 13Q50 33 65 38','none',b,.7)+group(person(65,45,.9,'#e7bd80'),'','ca-swing')+blink(circle(48,13,5,'none',a,.5));
      case 'robot': return (v? horizon:skyline())+floor+ellipse(51,56,29,9,haze)+group(path('M40 25 58 23 65 39 58 51H40L33 38Z',metal,'#9aaebd',.7)+path('M42 27 56 26 59 38 40 40Z','#263c47',a,.7)+circle(49,33,3,a)+rect(41,14,17,13,metal,3)+path('M43 20h12','none',a,2)+path('M37 30 25 33 21 45M61 29 74 31 83 23M42 48 38 61M55 48 61 61','none',metal,6,'stroke-linecap="round"')+path('M73 28 86 23','none','#263741',5)+blink(path('M87 22 94 20M87 24 94 26','none',b,1.5)),'','ca-stance')+repeat(4,i=>circle(13+i*24,58,.7,a));
      case 'racer': return skyline(39)+path(v?'M0 60 35 28 60 27 100 55 100 68 0 68Z':'M0 65 33 26 62 26 100 64V68H0Z','#283344','#849398',.6)+path('M4 65 36 28M96 65 59 28','none',a,2)+path('M50 29v7m0 4v8m0 6v14','none','#c3c6b6',1.3)+group(ellipse(0,12,23,4,'#050a12')+rect(-21,1,7,11,'#09121a',2,'#727c83')+rect(14,1,7,11,'#09121a',2,'#727c83')+path('M-20 5-13-8 10-10 20 3 18 13-18 13Z',a,'#e2d2c4',.65)+path('M-11-6 8-7 13 1-15 2Z','#18374b','#accbdc',.6)+path('M-17 6 16 5','none','#f0e5d0',.7)+rect(-16,7,7,2,'#fff1c5',.8)+rect(9,6,7,2,'#fff1c5',.8)+path('M-6 11h13','none','#152231',2),`translate(${v?55:48} 46)`,'ca-drive')+repeat(4,i=>path(`M${6+i*28} 65l4-6`,'none',b,.5));
      case 'space': return stars+ellipse(76,18,25,19,haze)+circle(76,18,12,'#263448',b,.5)+path('M66 12Q82 9 87 19M67 24Q80 17 86 25','none',b,1,'opacity=".24"')+(v===1?repeat(5,i=>group(path('M-5-8 4-7 9-1 5 6-4 9-9 2Z','#394353','#96a7b3',.5)+path('M-5-3 1-4 4 0-2 4Z','#1e2d3d'),`translate(${14+(i*21)%78} ${13+(i*17)%42}) scale(${.7+(i%2)*.3})`,'ca-drift')):repeat(3,i=>group(path('M0-6 9 5 0 1-9 5Z',b),`translate(${21+i*28} ${12+(i%2)*10})`,'ca-hover')))+ship(48,43,1.1)+group(path('M46 19V7M51 17V3','none',a,1.2),'','ca-bolt');
      case 'grove': return stars+path('M0 0 16 11 9 45 22 68H0Z','#10262c')+path('M100 0 82 12 92 41 80 68H100Z','#15212d')+ellipse(50,52,40,12,haze)+path('M0 59Q36 47 49 57T100 55V68H0Z','#132d32')+repeat(7,i=>group(leaves(13+i*13,64,14+(i*11)%24,i%2?'#3d6464':'#31584d'),'','ca-sway',`style="--lag:${-i*.6}s"`))+(v?crystal(52,39,1.4,a)+fish(29,43,.45,b):group(path('M51 57Q48 40 52 26','none','#99b29a',2)+repeat(6,i=>group(ellipse(0,-7,3.5,9,a,'#ddf5be','opacity=".8"'),`translate(52 29) rotate(${i*60})`))+circle(52,29,4,'#edf4c7'),'','ca-breathe'))+repeat(9,i=>blink(circle(17+(i*31)%71,18+(i*7)%39,.7,i%2?a:b),-i*.5));
      case 'marble': return stars+path('M12 33 44 16 90 32 58 50Z','#8dacc0')+path('M12 33v12l46 18V50Z','#30445f')+path('M58 50 90 32v13L58 63Z','#526785')+path('M21 33 43 23 58 29 43 37 61 44 80 35','none','#e1d4eb',5)+path('M21 33 43 23 58 29 43 37 61 44 80 35','none','#38465f',3)+repeat(4,i=>path(`M${18+i*12} ${35+i*4}v10`,'none','#9eacc2',.5))+group(ellipse(0,6,6,2,'#102030')+circle(0,0,6,metal,a,.5)+circle(-2,-2,1.5,'#f0fbff'),`translate(47 26)`,'ca-marble')+circle(79,33,3,'#1a2541',b,1);
      case 'bricks': return stars+floor+repeat(24,i=>rect(10+(i%6)*14,10+Math.floor(i/6)*7,12,5,i%3===0?a:i%3===1?b:'#718faa',1,'#d2dfdf'))+group(rect(33,57,34,4,metal,2,a),'','ca-paddle')+group(path('M58 40 49 48 45 52','none',b,1,'opacity=".6"')+circle(59,39,2.7,'#fff1d5'), '','ca-pinball')+blink(path('M57 33 61 28M65 36l5-2M55 36l-5-2','none',a,.9));
      case 'missile': return stars+skyline(59)+ellipse(55,30,26,22,haze)+group(circle(53,27,14,'none',a,1.2)+circle(53,27,10,'none',b,.5),'','ca-shock')+path('M10 0 36 39M85 0 66 27M49 62 60 31','none',a,.9)+blink(circle(36,39,2,'#fff0c5')+circle(66,27,1.8,a))+path('M36 64 43 55H55L64 64Z',metal)+path('M48 55 55 42','none','#d9e3e9',2);
      case 'joust': return stars+horizon+path('M0 55 25 49 32 53 54 49 73 54 100 49V68H0Z','#3c2a31')+path('M0 61Q26 54 51 61T100 59','none',v?b:a,2)+group(ellipse(0,0,13,7,metal)+path('M6-3Q18-13 19-6L12 5M-8 0-20-6-15 4Z',a)+path('M-3 5-8 17M4 5 10 17','none',a,1.6)+circle(18,-7,3,a)+circle(19,-8,.7,'#122132')+person(-1,-11,.75,'#b0bdc7')+path('M0-14 33-16','none','#ebddb0',1),`translate(${v?58:43} ${v?29:33})`,'ca-hover')+path('M11 44h22l-4 5H8Z','#6d6a65',b,.5)+blink(circle(84,19,1,b));
      case 'vector': return floor+stars+repeat(4,i=>path(`M${10+i*5} ${14+i*3}H${92-i*5}V${62-i*3}H${10+i*5}Z`,'none',i%2?a:b,.5,'opacity=".28"'))+group(path('M50 18 66 45 51 39 35 46Z','none',a,1.7)+path('M50 24 56 36H44Z',a),'','ca-hover')+group(path('M16 23 21 16 28 21 23 28Z','none',b,1.3),'','ca-drift')+group(path('M78 46 84 38 90 46 84 54Z','none',a,1.2),'','ca-glimmer')+path('M43 49 39 57M58 49 62 57','none',b,1.2);
      case 'tank': return (v?horizon:floor)+(!v?repeat(6,i=>path(`M${8+i*16} ${12+(i%3)*9}v18h9`,'none','#59636d',4)):repeat(9,i=>path(`M${i*13} 45l5-18 6 18Z`,'#2e493d')))+tank(v?54:39,v?44:37,v?1.2:1,v?'#78866c':'#977f57')+(!v?group(tank(76,28,.55,'#638b88'),'rotate(145 76 28)'):'')+blink(path('M49 14 53 8 56 15M50 17 43 13M57 17l7-3','none',b,1.2));
      case 'snake': return floor+repeat(36,i=>rect(10+(i%9)*9,17+Math.floor(i/9)*10,7,8,'#203b34',1,'#365449'))+path('M21 49H70Q81 49 81 38T66 28H37Q26 28 26 39H51','none','#375c43',9,'stroke-linecap="round"')+path('M21 47H70Q79 47 79 38T66 30H37Q28 30 28 39H51','none',a,5,'stroke-linecap="round"')+repeat(12,i=>circle(24+i*4,47,.65,'#e7f1bf'))+group(ellipse(55,39,7,5,a)+circle(58,37,1,'#132820')+path('M62 40h5l2-2m-2 2 2 2','none',b,.8),'','ca-breathe')+blink(circle(54,19,3,b)+path('M54 16q0-4 3-4','none',a,1));
      case 'mine': return path('M0 0H100V68H0Z','#12212a')+repeat(9,i=>rect((i%3)*34+1,Math.floor(i/3)*23+2,32,21,i%2?'#243139':'#1d2b33',2))+path('M8 14H92M8 37H92M8 60H92','none',v?'#819581':'#967b59',3)+repeat(2,i=>path(`M${27+i*43} 16v43m6-43v43m-6-35h6m-6 7h6m-6 7h6m-6 7h6m-6 7h6`,'none','#a48f6d',1))+repeat(5,i=>crystal(14+i*17,29+(i%2)*23,.45,v?a:b))+person(45,29,.7,a)+blink(circle(45,20,2,b))+path('M77 8 77 28','none','#647178',.8)+rect(72,26,10,6,'#576568',1);
      case 'eddy': return stars+ellipse(50,34,43,27,haze)+repeat(8,i=>group(path(`M${10+i} ${30+i*2}C${18+i*3} ${-10+i*3} ${97-i*2} ${5+i*4} ${86-i*3} ${39+i}S${12+i*2} ${79-i*2} ${21+i*3} ${36-i}`,'none',i%2?a:b,.6,`opacity="${.15+i*.06}"`),'','ca-current'))+ellipse(53,35,11,7,'#122f38',a,.7)+repeat(15,i=>blink(circle(20+(i*19)%65,14+(i*13)%44,.6+(i%3)*.4,i%3?a:b),-i*.23))+path('M68 51q10-9 18-1-10 9-18 1Z','#24343e',a,.5)+circle(83,50,.7,b);
      case 'cave': return stars+path('M0 0H100V10L85 5 72 20 63 8 47 16 33 4 25 23 11 12 0 29Z','#23313a')+path('M0 0 13 19 8 43 23 68H0M100 0 86 24 95 49 82 68H100Z','#26313a')+path('M11 66 29 48 42 55 67 49 89 65Z','#19272f')+(v?crystal(35,40,1.2,a)+crystal(65,46,1.4,b)+crystal(48,53,.65,a):ellipse(49,48,24,20,haze)+path('M47 0 48 37','none','#908777',.6)+rect(43,36,11,16,metal,1)+rect(45,39,7,10,'#ffe2a2',1)+path('M43 42h11M49 37v15','none','#634f35',.8))+repeat(7,i=>blink(circle(19+(i*23)%68,24+(i*13)%29,.5,a),-i*.5));
      case 'millipede': return stars+floor+repeat(9,i=>group(path('M-5 0Q-5-7 0-7T5 0Z',i%2?a:b)+rect(-1,0,2,6,'#a8b4a3',.6)+circle(-2,-3,.7,'#ecedc9'),`translate(${12+(i*19)%78} ${29+(i*13)%27})`))+group(repeat(8,i=>circle(19+i*8,17+Math.sin(i*.9)*5,4.2,i===7?b:a,'#d4dfac',.5))+repeat(8,i=>path(`M${19+i*8} ${17+Math.sin(i*.9)*5}l-3 7m3-7 3 7`,'none',a,.6))+circle(77,18,1,'#111c1e'),'','ca-crawl')+path('M48 60 52 52 56 60Z',metal)+blink(path('M52 48v-7','none',b,1));
      case 'fireworks': return stars+skyline(59)+path('M0 60H100V68H0Z','#101f2d')+repeat(3,i=>group(repeat(18,j=>path(`M0 -4V-${10+(j%3)*4}`,'none',j%3?a:b,.75,`transform="rotate(${j*20})"`))+circle(0,0,2,'#ffefcd'),`translate(${24+i*27} ${20+(i%2)*12})`,'ca-firework',`style="--lag:${-i*1.1}s"`))+repeat(10,i=>path(`M${i*11} 63h5`,'none',i%2?a:b,.8,'opacity=".5"'));
      case 'construction': return skyline(60)+repeat(3,i=>path(`M9 ${24+i*17}H91`,'none','#b0804b',3))+repeat(5,i=>path(`M${13+i*18} 23v37m0-37 16 17m-16 0 16 17`,'none','#645444',1))+path('M22 20V6H78M26 6l15 13M41 6 26 19M42 6 57 19M58 6 43 19','none',a,1)+path('M75 6v24','none','#c8c2a1',.7)+path('M75 29q0 5-4 5','none',metal,1.5)+person(43,45,.9,'#8eacbb')+path('M39 35q4-6 8 0Z',a)+rect(66,45,12,11,metal,1)+blink(circle(22,7,1.3,b));
      case 'pong': return floor+path('M12 9H88V57H12Z','none','#9bbac9',.7)+path('M50 12v43','none',b,.6,'stroke-dasharray="2 3"')+group(rect(15,21,4,19,metal,1,a),'','ca-paddle')+group(rect(81,30,4,19,metal,1,b),'','ca-paddle','style="--lag:-1.3s"')+group(path('M36 39 49 34','none',a,2,'opacity=".35"')+circle(51,33,3,'#eaf6f2',a,.5),'','ca-pong')+ellipse(50,62,35,3,haze);
      case 'invaders': return stars+floor+repeat(12,i=>group(path('M-5-4H5V-1H8V4H5V6H2V3H-2V6H-5V4H-8V-1H-5Z',i<4?b:a)+rect(-4,-1,2,2,'#0b1a23')+rect(2,-1,2,2,'#0b1a23'),`translate(${18+(i%4)*21} ${12+Math.floor(i/4)*13}) scale(.7)`,'ca-invader',`style="--lag:${-i*.11}s"`))+path('M41 62V55H47V49H53V55H59V62Z',metal,a,.5)+group(path('M50 46V38M28 43v8','none',b,1.2),'','ca-bolt');
      case 'fluid': return stars+ellipse(48,35,38,27,haze)+group(path('M17 41C-2 1 82-7 83 27S9 67 25 35 79 28 64 46 40 57 36 46','none',a,8,'opacity=".42" stroke-linecap="round"')+path('M15 30C29 2 97 28 65 53S0 44 35 23 81 17 74 33','none',b,5,'opacity=".62" stroke-linecap="round"')+path('M21 39C12 9 72 0 80 26S18 60 29 38 71 31 60 44','none','#e8d5e6',.8),'','ca-current')+repeat(12,i=>blink(circle(16+(i*23)%71,11+(i*13)%48,.65,i%2?a:b),-i*.4));
      case 'cat': return stars+ellipse(50,55,33,8,haze)+path('M29 52Q25 31 31 19L31 8 42 20Q49 17 58 20L70 9 69 31Q75 50 62 56H37Z','#132c3c',a,.7)+path('M64 52Q92 57 82 40','none',a,2)+path('M33 12 36 25M67 13 63 25M43 38 49 43 55 38','none',b,.8)+blink(path('M35 31q5-4 9 0M56 31q5-4 9 0','none','#dcffcb',1.7))+path('M48 38h4l-2 3ZM42 40 20 35M42 43 18 43M58 40 79 35M58 43 83 43',b,b,.6)+repeat(68,i=>{const x=32+(i*17)%36,y=22+(i*11)%31;return blink(circle(x,y,.45,i%3?a:b),-i*.17)});
      case 'trek': return stars+circle(82,44,20,'#253342',b,.5)+path('M67 37q20-8 32 4M65 45q20-7 34 5','none','#8ba1b2',.7,'opacity=".4"')+group(ellipse(0,0,21,6,metal,a,.6)+ellipse(0,-1,15,3,'#587087',a,.5)+circle(0,-2,4,'#d8e6eb')+path('M-3 3 0 18 13 22 17 18 3 11Z',metal)+path('M-10 5-17 17M10 5 23 13','none',metal,3)+rect(-25,14,23,4,metal,2)+rect(15,10,20,4,metal,2)+circle(-23,16,1.3,a)+circle(33,12,1.3,a),'translate(43 26) rotate(-12)','ca-hover')+rect(8,58,26,3,b,1)+rect(37,58,15,3,a,1);
      case 'lander': return stars+circle(76,16,9,'#284459',a,.5)+path('M0 52 13 44 27 49 40 45 58 50 72 42 86 47 100 43V68H0Z','#556471')+ellipse(20,57,9,3,'#344656','#86939a')+ellipse(81,60,13,4,'#344656','#89949a')+group(path('M-9-7-5-16H6L10-7 7 2H-6Z',metal,b,.5)+rect(-4,-13,8,6,'#1a3d56',1,'#d3e7ec')+path('M-8 0-17 16h-5M8 0 17 16h5','none',metal,1.8)+rect(-10,0,20,5,b,1)+group(path('M-3 5 0 19 3 5Z','#ffe5a2'),'','ca-thrust'),'translate(48 34)','ca-hover')+path('M64 47V35l9 3-9 3','none',a,.8);
      case 'qix': return floor+rect(12,8,76,49,'#0d1d31',1,'#95a8bb')+path('M13 9H41V28H65V44H87V56H13Z','#294256',a,.6)+repeat(12,i=>path(`M${27+i*2.3} ${14+(i*7)%32} ${68-i*1.4} ${12+(i*11)%36}`,'none',i%2?a:b,.8,'class="ca-motion ca-glimmer"'))+path('M13 41H31V56','none','#e8eedc',1.2)+blink(circle(31,41,1.7,a)+circle(73,8,1.3,b));
      case 'submarine': return path('M0 15Q17 11 35 15T70 15T100 15V68H0Z','#102e3b')+path('M0 15Q17 11 35 15T70 15T100 15','none',a,1)+path('M12 11h29l-6 7H19Z',metal)+rect(24,6,6,7,'#879da5',1)+path('M28 6V2','none',b,.8)+group(ellipse(54,46,23,7,metal)+rect(47,34,9,8,metal,1)+path('M51 34v-7h5M75 45l10-5v12l-10-5','none',a,1.2)+repeat(5,i=>circle(39+i*7,44,1,'#233f4e')),'','ca-swim')+group(circle(32,30,1.5,b)+path('M32 22v5','none',b,.6),'','ca-bubble')+path('M3 64h94','none','#425b63',2);
      case 'train': return (v===0?stars+path('M0 49 16 30 33 44 48 29 68 45 87 27 100 40V68H0Z','#202a42'):repeat(5,i=>path(`M${5+i*6} 65V${24+i*4}Q50 ${-16+i*10} ${95-i*6} ${24+i*4}V65`,'none',i%2?'#334a55':'#1e303e',2)))+path('M0 67 47 34M100 67 55 34','none',metal,1.2)+repeat(5,i=>path(`M${22-i*5} ${43+i*5}h${55+i*8}`,'none','#4b5d69',1))+group(path('M31 49 35 17Q50 10 66 17L72 49 66 57H37Z',v===1?'#394849':metal,'#aebfc7',.7)+path('M38 21H62L65 35H36Z','#133749',a,.65)+path('M50 22v13','none','#8dabad',.5)+rect(39,40,22,3,'#18303e',1)+circle(38,47,2.1,'#ffedbf')+circle(64,47,2.1,'#ffedbf')+path('M44 51h13','none','#132330',2),'','ca-drive')+(v===1?path('M38 47 7 66H48Z','#e9cc84','','','opacity=".1"'):'');
      case 'primordia': return stars+ellipse(48,36,45,25,haze)+repeat(6,i=>group(leaves(8+i*17,68,14+(i*9)%27,'#335a61'),'','ca-sway'))+group(ellipse(0,0,17,8,'#203e45',a,.7)+repeat(7,i=>circle(-11+i*3.7,Math.sin(i)*2,1.1,i%2?a:b))+path('M-17 0-28-6-25 6Z','#437976')+circle(11,-1,1.2,'#ecf2c9'),'translate(45 34)','ca-swim')+repeat(5,i=>group(circle(0,0,2,b)+path('M-2 1q-5 5-8 1','none',a,.65),`translate(${20+(i*19)%69} ${15+(i*13)%36})`,'ca-drift',`style="--lag:${-i*.7}s"`))+path('M74 68 79 51 85 68Z','#38575b')+group(circle(81,48,2,a),'','ca-bubble');
      case 'helicopter': return stars+skyline(59)+group(path('M-21 2-5 0Q0-13 13-8L22 0Q24 9 11 10H-1L-8 5-23 7Z',metal,a,.5)+path('M5-8 12-7 19 0H4Z','#20445c','#b0dae3',.7)+path('M-22 5-28-5-28 8Z',b)+path('M-4 10-7 14H20M14 10v4M0-8v-7','none',metal,1.2)+group(path('M-28-15H32','none','#d1dce0',1.1),'','ca-rotor')+circle(-25,2,2,'none',b,.7),'translate(48 29)','ca-hover')+path('M65 39 82 62H40Z','#f1d99f','','','opacity=".11"')+person(63,56,.43,b)+person(73,58,.35,a);
      case 'slash': return stars+floor+repeat(3,i=>group(crystal(0,0,1,i%2?a:b),`translate(${26+i*25} ${25+(i%2)*14}) rotate(${i*25-20})`,'ca-drift'))+group(path('M15 54Q44 35 83 13','none','#e8faf6',3,'stroke-linecap="round"')+path('M15 55Q43 40 84 14','none',a,6,'opacity=".2"'),'','ca-slash')+repeat(8,i=>blink(path(`M${39+i*4} ${23+(i%3)*7}l${i%2?3:-3} -3`,'none',b,.8),-i*.16));
      case 'gravity': return stars+repeat(6,i=>path(`M${8+i*15} 8Q${15+i*12} 49 ${8+i*15} 60M8 ${9+i*10}Q49 ${5+i*7} 94 ${9+i*10}`,'none',a,.45,'opacity=".35"'))+group(ellipse(50,34,25,14,'none',b)+ellipse(50,34,14,25,'none',a),'','ca-current')+circle(50,34,8,'#142339',a,.8)+circle(48,31,3,haze)+group(circle(26,30,3,metal)+circle(74,39,2,b),'','ca-current')+blink(circle(50,34,3,'#e7dff2'));
      default: return stars+crystal(50,36,2,a);
    }
  }

  let observer;
  document.addEventListener('visibilitychange',()=>document.body.classList.toggle('gallery-motion-paused',document.hidden));
  window.GameCardArt={
    entries,
    mount(){
      observer?.disconnect();
      const covers=document.querySelectorAll('.cover-art');
      if(!('IntersectionObserver' in window)){covers.forEach(el=>el.classList.add('cover-visible'));return}
      observer=new IntersectionObserver(items=>items.forEach(({target,isIntersecting})=>target.classList.toggle('cover-visible',isIntersecting)),{rootMargin:'120px'});
      covers.forEach(el=>observer.observe(el));
    },
    render(g){
      const entry=entries[g.title];if(!entry)return null;
      const [type,a,b,v]=entry,id=`cover-${++serial}`;
      const svg=`<svg viewBox="0 0 100 68" class="arcade-svg cover-art" aria-hidden="true" focusable="false" data-cover="${type}" data-cover-title="${g.title.replaceAll('&','&amp;').replaceAll('"','&quot;')}">
        <defs>
          <linearGradient id="${id}-sky" x2=".2" y2="1"><stop stop-color="#101b2e"/><stop offset="1" stop-color="#030912"/></linearGradient>
          <linearGradient id="${id}-metal" x1="0" y1="0" x2=".7" y2="1"><stop stop-color="#e3edf0"/><stop offset=".3" stop-color="#90a4b5"/><stop offset=".49" stop-color="#dce7eb"/><stop offset=".53" stop-color="#415567"/><stop offset="1" stop-color="#a3b5c0"/></linearGradient>
          <linearGradient id="${id}-lit"><stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
          <radialGradient id="${id}-haze"><stop stop-color="${a}" stop-opacity=".34"/><stop offset="1" stop-color="${a}" stop-opacity="0"/></radialGradient>
          <linearGradient id="${id}-shade" x2="0" y2="1"><stop stop-color="#020710" stop-opacity=".15"/><stop offset=".55" stop-color="#020710" stop-opacity="0"/><stop offset="1" stop-color="#020710" stop-opacity=".32"/></linearGradient>
          <clipPath id="${id}-clip"><rect width="100" height="68" rx="4"/></clipPath>
        </defs>
        <g clip-path="url(#${id}-clip)">${rect(0,0,100,68,`url(#${id}-sky)`)}${makeScene(type,a,b,v,id)}${rect(0,0,100,68,`url(#${id}-shade)`)}</g>
        ${path('M3 16V5Q3 3 5 3H19M81 3H95Q97 3 97 5V16M3 52V63Q3 65 5 65H19M81 65H95Q97 65 97 63V52','none',a,.45,'opacity=".45"')}
      </svg>`;
      return `<span class="icon-wrap particle-icon-wrap gallery-cover" style="--icon-a:${a};--icon-b:${b};--icon-c:${b};--icon-hot:#e0edf1;--icon-cool:${a}" aria-hidden="true"><span class="arcade-icon icon-cover">${svg}</span></span>`;
    }
  };
})();
