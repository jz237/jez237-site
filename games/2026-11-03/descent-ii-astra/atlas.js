/* Survey computer: actual explored mine geometry, rendered only while Tab is open. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]),mul=(a,n)=>a.map(v=>v*n),dot=(a,b)=>a.reduce((n,v,i)=>n+v*b[i],0),length=a=>Math.hypot(...a),mean=a=>mul(a.reduce(add,a[0].map(()=>0)),1/a.length);
  const colors={blue:'#67a9ff',red:'#ff6c80',gold:'#ffd676',reactor:'#ff8679',exit:'#77f4bb',secret:'#c894ff',energy:'#ffd676',hostage:'#baed88',beacon:'#d6b9ff',frontier:'#7ddde8'};
  const symbols={reactor:'◉',exit:'↗',secret:'◇',energy:'ϟ',hostage:'✚',blue:'◆',red:'◆',gold:'◆',beacon:'⚑',frontier:'›'};
  let root,canvas,ctx,raf=0,dirty=true,lastFrame=0,pending,first=true,focusBefore,selected=null,route=[],routePoints=[],routeText='',filter='near',deck=false,following=true,yaw=-.45,pitch=.6,scale=2.5,pan=[0,0],target=[0,0,0],basis=[[1,0,0],[0,1,0],[0,0,1]],hitRooms=[],hitMarkers=[],drag=null,pinches=new Map();
  const map=window.astraMap={active:false,rooms:new Map(),markers:[],pilots:[],pose:null,roomId:-1,
    begin(fresh,level,name,online,destroyed){
      pending={rooms:new Map(),markers:[],level,name,online,destroyed};
      if(fresh||!this.active){mount();focusBefore=document.activeElement;this.active=true;first=true;following=true;pan=[0,0];filter='near';deck=false;selected=null;root.hidden=false;document.body.classList.add('astra-map-open');window.releaseFlightMouse?.();document.exitPointerLock?.();window.Module?._astra_reset_flight_input?.();$('atlasClose').focus({preventScroll:true});if(innerWidth<560&&!$('atlasListBody').hidden)$('atlasListToggle').click();dirty=true;schedule();}
    },
    room(id,visited,special,data){
      const vertices=Array.from({length:8},(_,i)=>Array.from(data.slice(i*3,i*3+3))),sides=Array.from({length:6},(_,i)=>{const n=24+i*7;return {child:data[n],kind:data[n+1],pass:!!data[n+2],verts:Array.from(data.slice(n+3,n+7))};});
      pending.rooms.set(id,{id,visited,special,vertices,sides,center:mean(vertices)});
    },
    marker(id,room,kind,name,position){pending.markers.push({id,room,kind,name:name||'Beacon',position});},
    commit(){
      this.rooms=pending.rooms;this.markers=pending.markers;this.level=pending.level;this.destroyed=pending.destroyed;
      const ov=window.Module?.overload&&window.astraOverload;
      if(ov?.controller)for(const r of ov.meta.records){
        if(!this.rooms.has(r.room)||!r.position||ov.controller.hidden.has(r.go)||ov.controller.dead.has(r.go)||ov.controller.disabled.has(r.go))continue;
        const kind=r.class==='Reactor'?'reactor':r.class==='DoorExit'?'exit':r.class==='TriggerEnergy'?'energy':r.class==='Item'&&r.data.m_type===25?'gold':r.class==='AlienPower'?'beacon':null;
        if(kind)this.markers.push({id:'overload-'+r.id,room:r.room,kind,name:r.class==='AlienPower'?'Alien energy core':r.class==='Item'?'Security clearance':kind==='reactor'?'Reactor':kind==='exit'?'Emergency exit':'Energy center',position:r.position.map(v=>v*4)});
      }
      for(const r of this.rooms.values())for(let i=0;i<6;i++){const s=r.sides[i];if(s.child>=0&&!this.rooms.has(s.child)&&s.kind&&s.pass)this.markers.push({id:'frontier-'+r.id+'-'+i,room:r.id,kind:'frontier',name:'Unexplored passage',position:mean(s.verts.map(v=>r.vertices[v]))});}
      $('atlasLevel').textContent=(window.Module?.campaign==='overload'?'OVERLOAD':window.Module?.campaign==='d2'?'COUNTERSTRIKE':'VERTIGO')+' / '+(pending.level<0?'SECRET '+-pending.level:'MINE '+pending.level);
      $('atlasName').textContent=pending.name;$('atlasLive').textContent=pending.online?'ONLINE · FLIGHT CONTINUES':'FLIGHT PAUSED';$('atlasLive').classList.toggle('online',pending.online);
      $('atlasExplored').textContent=this.rooms.size+' mapped rooms';
      if(selected&&!this.markers.some(m=>m.id===selected.id)&&!selected.custom)selected=null;
      rebuildList();computeRoute();dirty=true;
    },
    player(room,pose){
      const previous=this.roomId;this.roomId=room;this.pose=Array.from(pose);this.position=this.pose.slice(0,3);
      if(first){basis=[this.pose.slice(3,6),this.pose.slice(6,9),this.pose.slice(9,12)];target=this.position.slice();first=false;fit(false);}
      if(following)target=this.position.slice();if(previous!==room){computeRoute();rebuildList();}dirty=true;
    },
    close(){this.active=false;cancelAnimationFrame(raf);raf=0;pinches.clear();drag=null;root.hidden=true;document.body.classList.remove('astra-map-open');window.Module?._astra_reset_flight_input?.();if(focusBefore?.isConnected)focusBefore.focus({preventScroll:true});},
    select(id){const marker=this.markers.find(m=>m.id===id);if(marker)choose(marker);},
    get state(){return {active:this.active,rooms:this.rooms.size,markers:this.markers.length,route:route.slice(),routeText,selected:selected?.name,filter,deck,following};}
  };
  function mount(){
    if(root)return;
    root=document.createElement('section');root.id='astraAtlas';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label','Mine survey map');
    root.innerHTML=`<canvas id="atlasCanvas" aria-label="Interactive 3D map. Drag to orbit, Shift-drag to pan, scroll to zoom. Choose a destination from the list for a route."></canvas>
      <header class="atlas-header"><div><small id="atlasLevel"></small><h1 id="atlasName">Mine survey</h1><span id="atlasExplored"></span></div><div><span id="atlasLive"></span><button id="atlasClose">Return to flight <kbd>Tab</kbd></button></div></header>
      <nav class="atlas-tools" aria-label="Map view"><button id="atlasFollow" aria-pressed="true">Locate me</button><button id="atlasNearby" aria-pressed="true">Nearby</button><button id="atlasAll" aria-pressed="false">Whole mine</button><button id="atlasDeck" aria-pressed="false">Current deck</button><button id="atlasTop">Deck plan</button><button id="atlasOrbit">3D view</button><button id="atlasZoomIn" aria-label="Zoom in">＋</button><button id="atlasZoomOut" aria-label="Zoom out">−</button></nav>
      <aside class="atlas-destinations"><div class="atlas-section-title"><span>DESTINATIONS</span><button id="atlasListToggle" aria-label="Show or hide destinations" aria-expanded="true">−</button></div><div id="atlasListBody"><label class="atlas-search"><span class="atlas-sr">Find a destination</span><input id="atlasSearch" type="search" placeholder="Find a key, reactor, exit…"></label><div id="atlasDestinations"></div></div></aside>
      <section class="atlas-route" aria-label="Navigation route"><div><small>COURSE PLOTTER</small><strong id="atlasTarget">Choose a destination</strong><p id="atlasRouteText">Select a room or landmark to trace an explored route.</p></div><button id="atlasClear" hidden aria-label="Clear route">×</button></section>
      <footer class="atlas-footer"><div class="atlas-legend"><span><i style="--key:#85f4ff"></i>You</span><span><i style="--key:#77f4bb"></i>Route / exit</span><span><i style="--key:#67a9ff"></i>Blue door</span><span><i style="--key:#ff6c80"></i>Red door</span><span><i style="--key:#ffd676"></i>Gold door</span><span><i class="locked"></i>Locked</span></div><p>Drag to orbit · Shift / right-drag to pan · Wheel to zoom · Double-click to recenter · Esc to return</p></footer>`;
    document.body.append(root);canvas=$('atlasCanvas');ctx=canvas.getContext('2d',{alpha:false});
    $('atlasClose').onclick=()=>{Module.mapCommand=1;};
    $('atlasFollow').onclick=()=>{following=true;pan=[0,0];target=map.position.slice();fit(false);dirty=true;};
    $('atlasNearby').onclick=()=>{filter='near';fit(false);};$('atlasAll').onclick=()=>{filter='all';fit(true);};
    $('atlasDeck').onclick=()=>{deck=!deck;dirty=true;};
    $('atlasTop').onclick=()=>{yaw=0;pitch=Math.PI/2;fit(filter==='all');dirty=true;};$('atlasOrbit').onclick=()=>{yaw=-.45;pitch=.6;fit(filter==='all');dirty=true;};
    $('atlasZoomIn').onclick=()=>{scale=clamp(scale*1.25,.1,24);dirty=true;};$('atlasZoomOut').onclick=()=>{scale=clamp(scale/1.25,.1,24);dirty=true;};
    $('atlasClear').onclick=()=>{selected=null;computeRoute();rebuildList();dirty=true;};$('atlasSearch').oninput=rebuildList;
    $('atlasListToggle').onclick=()=>{const body=$('atlasListBody');body.hidden=!body.hidden;$('atlasListToggle').textContent=body.hidden?'+':'−';$('atlasListToggle').setAttribute('aria-expanded',!body.hidden);};
    root.addEventListener('contextmenu',e=>e.preventDefault());canvas.style.touchAction='none';
    canvas.onpointerdown=e=>{canvas.setPointerCapture(e.pointerId);pinches.set(e.pointerId,[e.clientX,e.clientY]);drag={x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,pan:e.shiftKey||e.button===2,pinch:pinches.size===2?length(sub(...[...pinches.values()])):0};};
    canvas.onpointermove=e=>{if(!drag)return;pinches.set(e.pointerId,[e.clientX,e.clientY]);if(pinches.size===2){const distance=length(sub(...[...pinches.values()]));if(drag.pinch>0)scale=clamp(scale*distance/drag.pinch,.1,24);drag.pinch=distance;drag.startX=-1e6;}
      else if(drag.pan){pan[0]+=e.clientX-drag.x;pan[1]+=e.clientY-drag.y;following=false;}
      else{yaw+=(e.clientX-drag.x)*.006;pitch=clamp(pitch+(e.clientY-drag.y)*.006,-1.55,1.570796);}
      drag.x=e.clientX;drag.y=e.clientY;dirty=true;
    };
    canvas.onpointerup=e=>{if(drag&&Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)<6){const marker=hitMarkers.find(m=>Math.hypot(e.clientX-m.x,e.clientY-m.y)<18);if(marker)choose(marker.marker);else{const room=hitRooms.filter(r=>Math.hypot(e.clientX-r.x,e.clientY-r.y)<Math.max(12,r.radius)).sort((a,b)=>Math.hypot(e.clientX-a.x,e.clientY-a.y)-Math.hypot(e.clientX-b.x,e.clientY-b.y))[0];if(room)choose({id:'room-'+room.id,room:room.id,name:'Room '+(room.id+1),kind:'beacon',position:map.rooms.get(room.id).center,custom:true});}}pinches.delete(e.pointerId);drag=null;};
    canvas.onpointercancel=()=>{pinches.clear();drag=null;};canvas.ondblclick=()=>{pan=[0,0];following=true;fit(false);};
    canvas.addEventListener('wheel',e=>{e.preventDefault();scale=clamp(scale*Math.exp(-e.deltaY*.0015),.1,24);dirty=true;},{passive:false});
    window.addEventListener('resize',()=>{if(map.active){if(innerWidth<560&&!$('atlasListBody').hidden)$('atlasListToggle').click();fit(filter==='all');}dirty=true;});
    for(const type of ['keydown','keyup'])window.addEventListener(type,e=>{
      if(!map.active)return;e.stopImmediatePropagation();
      if(type==='keyup')return;
      if(e.key==='Escape'||e.key==='Tab'&&!e.shiftKey&&e.target.tagName!=='INPUT'){e.preventDefault();if(!e.repeat)Module.mapCommand=1;return;}
      if(e.key==='Tab'){const list=[...root.querySelectorAll('button,input')].filter(el=>!el.hidden&&el.getClientRects().length),at=list.indexOf(document.activeElement);e.preventDefault();list[(at+(e.shiftKey?-1:1)+list.length)%list.length]?.focus();return;}
      if(e.target.tagName==='INPUT')return;
      if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','=','Home'].includes(e.key)){e.preventDefault();if(e.key==='Home')$('atlasFollow').click();else if(['+','-','='].includes(e.key))scale=clamp(scale*(e.key==='-'?.9:1.1),.1,24);else{pan[0]+=e.key==='ArrowLeft'?20:e.key==='ArrowRight'?-20:0;pan[1]+=e.key==='ArrowUp'?20:e.key==='ArrowDown'?-20:0;following=false;}dirty=true;}
    },true);
  }
  function choose(marker){selected=marker;computeRoute();rebuildList();dirty=true;}
  function graph(start){const parents=new Map([[start,null]]),queue=[start];for(let i=0;i<queue.length;i++){const r=map.rooms.get(queue[i]);if(!r)continue;for(const side of r.sides)if(side.pass&&map.rooms.has(side.child)&&!parents.has(side.child)){parents.set(side.child,r.id);queue.push(side.child);}}return parents;}
  function computeRoute(){
    route=[];routePoints=[];routeText='Select a room or landmark to trace an explored route.';
    if(selected){const parents=graph(map.roomId);if(parents.has(selected.room)){for(let id=selected.room;id!=null;id=parents.get(id))route.unshift(id);routePoints=[map.position||map.rooms.get(map.roomId)?.center||[0,0,0]];
      for(let i=1;i<route.length;i++){const r=map.rooms.get(route[i-1]),side=r.sides.find(s=>s.child===route[i]&&s.pass);routePoints.push(mean(side.verts.map(v=>r.vertices[v])),map.rooms.get(route[i]).center);}routePoints.push(selected.position);routeText=route.length>1?`${route.length-1} room connections · Explored, accessible passages`:'Destination is in this room';
    }else routeText='No explored route yet. Check keyed doors, switches, or other passages.';}
    if(root){$('atlasTarget').textContent=selected?.name||'Choose a destination';$('atlasRouteText').textContent=routeText;$('atlasClear').hidden=!selected;}
  }
  function rebuildList(){
    if(!root)return;const box=$('atlasDestinations'),search=$('atlasSearch').value.toLowerCase(),priority={exit:0,reactor:1,blue:2,red:2,gold:2,hostage:3,energy:4,beacon:5,secret:6,frontier:7};
    const list=map.markers.filter(m=>m.name.toLowerCase().includes(search)).sort((a,b)=>(priority[a.kind]??8)-(priority[b.kind]??8)||length(sub(a.position,map.position||[0,0,0]))-length(sub(b.position,map.position||[0,0,0]))).slice(0,28);
    const signature=JSON.stringify([list.map(m=>[m.id,m.name]),selected?.id]);if(box.dataset.signature===signature)return;box.dataset.signature=signature;box.replaceChildren();
    if(!list.length){const p=document.createElement('p');p.className='atlas-empty';p.textContent=search?'No matching discovered landmarks.':'Explore more passages to reveal landmarks.';box.append(p);}
    for(const m of list){const button=document.createElement('button');button.className='atlas-destination';button.classList.toggle('selected',selected?.id===m.id);button.setAttribute('aria-pressed',selected?.id===m.id);const icon=document.createElement('span');icon.textContent=symbols[m.kind]||'◇';icon.style.color=colors[m.kind]||colors.beacon;const label=document.createElement('span');label.textContent=m.name;const number=document.createElement('small');number.textContent='R'+(m.room+1);button.append(icon,label,number);button.onclick=()=>choose(m);box.append(button);}
  }
  function visibleRooms(){
    const near=new Set([map.roomId]),queue=[[map.roomId,0]];
    if(filter==='near')for(let i=0;i<queue.length;i++){const [id,n]=queue[i],r=map.rooms.get(id);if(!r||n>=6)continue;for(const s of r.sides)if(s.child>=0&&map.rooms.has(s.child)&&!near.has(s.child)){near.add(s.child);queue.push([s.child,n+1]);}}
    return [...map.rooms.values()].filter(r=>(filter==='all'||near.has(r.id)||route.includes(r.id))&&(!deck||Math.abs(dot(sub(r.center,map.position||target),basis[1]))<45||route.includes(r.id)));
  }
  function fit(all){if(!map.pose)return;const rooms=visibleRooms();if(!rooms.length)return;
    if(all){target=mean(rooms.map(r=>r.center));following=false;}else{target=map.position.slice();following=true;}
    pan=[0,0];scale=1;
    const pts=rooms.flatMap(r=>r.vertices.map(project)),left=innerWidth>800?290:innerWidth>560?220:22,right=innerWidth-28,top=innerHeight>560?(innerWidth<560?260:190):120,bottom=innerHeight-(innerWidth<560?190:85);
    const minX=Math.min(...pts.map(p=>p.x)),maxX=Math.max(...pts.map(p=>p.x)),minY=Math.min(...pts.map(p=>p.y)),maxY=Math.max(...pts.map(p=>p.y));
    scale=clamp(Math.min((right-left)/Math.max(25,maxX-minX),(bottom-top)/Math.max(25,maxY-minY))*.85,.1,12);
    const origin=project(target);pan=[(left+right)/2-origin.x-((minX+maxX)/2-origin.x)*scale,(top+bottom)/2-origin.y-((minY+maxY)/2-origin.y)*scale];dirty=true;
  }
  function project(point){const d=sub(point,target),x=dot(d,basis[0]),y=dot(d,basis[1]),z=dot(d,basis[2]),a=x*Math.cos(yaw)-z*Math.sin(yaw),b=x*Math.sin(yaw)+z*Math.cos(yaw);return {x:innerWidth*(innerWidth>800?.57:.5)+a*scale+pan[0],y:innerHeight*.53+(-y*Math.cos(pitch)+b*Math.sin(pitch))*scale+pan[1],z:y*Math.sin(pitch)+b*Math.cos(pitch)};}
  function schedule(){if(!raf&&map.active)raf=requestAnimationFrame(render);}
  function path(points){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));}
  function render(t){raf=0;if(!map.active)return;if(t-lastFrame<30){schedule();return;}lastFrame=t;if(!dirty){schedule();return;}dirty=false;
    const ratio=Math.min(devicePixelRatio||1,2),width=innerWidth,height=innerHeight;
    if(canvas.width!==Math.round(width*ratio)||canvas.height!==Math.round(height*ratio)){canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);canvas.style.width=width+'px';canvas.style.height=height+'px';}
    ctx.setTransform(ratio,0,0,ratio,0,0);ctx.fillStyle='#050e17';ctx.fillRect(0,0,width,height);
    const glow=ctx.createRadialGradient(width*.56,height*.52,20,width*.56,height*.52,width*.65);glow.addColorStop(0,'#103142');glow.addColorStop(1,'#050e17');ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
    ctx.strokeStyle='#52758a16';ctx.lineWidth=1;for(let x=0;x<width;x+=48){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,height);ctx.stroke();}for(let y=0;y<height;y+=48){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(width,y);ctx.stroke();}
    const rooms=visibleRooms(),shown=new Set(rooms.map(r=>r.id)),faces=[],lines=[];hitRooms=[];hitMarkers=[];
    for(const r of rooms){const v=r.vertices.map(project),p=project(r.center);if(p.x< -250||p.x>width+250||p.y< -250||p.y>height+250)continue;
      const elevation=Math.abs(dot(sub(r.center,map.position||target),basis[1])),fade=r.visited?clamp(1-elevation/500,.25,1):.22;
      hitRooms.push({...p,id:r.id,radius:Math.min(70,Math.max(...v.map(a=>Math.hypot(a.x-p.x,a.y-p.y))))});
      for(const s of r.sides){const points=s.verts.map(i=>v[i]);if(s.child<0||s.kind===0)faces.push({points,z:points.reduce((n,a)=>n+a.z,0)/4,fade,current:r.id===map.roomId});
        const color=s.kind===3?colors.blue:s.kind===4?colors.red:s.kind===5?colors.gold:s.kind===6?'#e7ad85':s.kind===2?'#91bea9':null;
        if(color)lines.push({points,color,locked:!s.pass,z:points.reduce((n,a)=>n+a.z,0)/4});
      }
      const seen=new Set();for(const s of r.sides)for(let j=0;j<4;j++){const a=s.verts[j],b=s.verts[(j+1)%4],key=[a,b].sort().join(',');if(seen.has(key))continue;seen.add(key);lines.push({points:[v[a],v[b]],color:r.id===map.roomId?'#80efff':route.includes(r.id)?'#3ba58f':`rgba(107,160,183,${.27*fade})`,z:(v[a].z+v[b].z)/2,current:r.id===map.roomId});}
    }
    faces.sort((a,b)=>b.z-a.z);for(const face of faces){path(face.points);ctx.closePath();ctx.fillStyle=face.current?'#18465766':`rgba(9,28,40,${.65*face.fade})`;ctx.fill();}
    lines.sort((a,b)=>b.z-a.z);for(const line of lines){path(line.points);if(line.points.length>2)ctx.closePath();ctx.strokeStyle=line.color;ctx.lineWidth=line.current?1.8:line.points.length>2?2:1;ctx.stroke();if(line.locked&&line.points.length>2){const p=mean(line.points.map(a=>[a.x,a.y]));ctx.fillStyle='#101a23';ctx.fillRect(p[0]-7,p[1]-8,14,16);ctx.fillStyle=line.color;ctx.font='bold 11px system-ui';ctx.textAlign='center';ctx.fillText('×',p[0],p[1]+4);}}
    if(routePoints.length){const pts=routePoints.map(project);path(pts);ctx.strokeStyle='#73efbb25';ctx.lineWidth=10;ctx.stroke();path(pts);ctx.setLineDash([8,5]);ctx.strokeStyle='#88ffcf';ctx.lineWidth=2.5;ctx.stroke();ctx.setLineDash([]);}
    const occupied=[];function label(p,text,color,priority=false){ctx.font='500 12px system-ui';const w=ctx.measureText(text).width+14,x=clamp(p.x+13,8,width-w-8),y=p.y-22,rect=[x,y,w,23];if(!priority&&occupied.some(a=>x<a[0]+a[2]&&x+w>a[0]&&y<a[1]+a[3]&&y+23>a[1]))return;occupied.push(rect);ctx.fillStyle='#06141ce8';ctx.fillRect(...rect);ctx.fillStyle=color;ctx.textAlign='left';ctx.fillText(text,x+7,y+16);}
    for(const m of map.markers.filter(m=>shown.has(m.room)).sort((a,b)=>Number(b.id===selected?.id)-Number(a.id===selected?.id))){const p=project(m.position),color=colors[m.kind]||colors.beacon;if(p.x<0||p.x>width||p.y<0||p.y>height)continue;hitMarkers.push({...p,marker:m});ctx.beginPath();ctx.arc(p.x,p.y,m.id===selected?.id?9:6,0,Math.PI*2);ctx.fillStyle='#07141e';ctx.fill();ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke();if(m.id===selected?.id||scale>.8&&m.kind!=='frontier')label(p,m.name,color);}
    for(const pilot of map.pilots){const p=project(pilot.position);ctx.fillStyle='#c3a1ff';ctx.beginPath();ctx.arc(p.x,p.y,5,0,Math.PI*2);ctx.fill();label(p,pilot.name,'#d7c1ff');}
    if(map.pose){const p=project(map.position),f=project(add(map.position,mul(map.pose.slice(9,12),12))),angle=Math.atan2(f.y-p.y,f.x-p.x);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(angle);ctx.beginPath();ctx.moveTo(13,0);ctx.lineTo(-8,-7);ctx.lineTo(-4,0);ctx.lineTo(-8,7);ctx.closePath();ctx.fillStyle='#b7fbff';ctx.shadowColor='#55deff';ctx.shadowBlur=14;ctx.fill();ctx.restore();label(p,'YOU · R'+(map.roomId+1),'#b7fbff',true);}
    for(const [id,on] of [['atlasFollow',following],['atlasNearby',filter==='near'],['atlasAll',filter==='all'],['atlasDeck',deck]])$(id).setAttribute('aria-pressed',on);
    map.rendered={rooms:rooms.length,faces:faces.length,lines:lines.length,routeRooms:route.length,width:canvas.width,height:canvas.height};schedule();
  }
})();
