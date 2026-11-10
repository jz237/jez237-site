(()=>{
  'use strict';const q=id=>document.getElementById(id),orders=['follow','cover','attack','regroup'],labels=['Follow me','Cover me','Attack my target','Regroup'];
  const help=new Map();let lastMessage='Choose an order for your AI wingmen.';
  const dialog=document.createElement('dialog');dialog.id='wingmanDialog';dialog.className='astra-tool-dialog';dialog.innerHTML='<header><h2>Wingman commands</h2><button id="wingmanClose">Close</button></header><p>Commands apply to AI teammates in co-op. Attack targets must be visible to you.</p><div id="wingmanOrders">'+orders.map((o,i)=>`<button data-order="${o}">${labels[i]} <small>Alt + ${i+1}</small></button>`).join('')+'</div><button id="wingmanHelp">Request assistance <small>Alt + H</small></button><p id="wingmanStatus" role="status"></p>';
  document.body.append(dialog);q('wingmanClose').onclick=()=>dialog.close();
  const panel=document.createElement('details');panel.id='squadHUD';panel.hidden=true;panel.open=innerWidth>=700;panel.innerHTML='<summary><span id="squadHUDTitle">Squadron</span><span aria-hidden="true">⌄</span></summary><div id="squadHUDRows"></div><div class="squadHUDControls"><button id="wingmanOpen">Commands</button><button id="squadHUDHelp">Help</button></div>';q('stage').append(panel);
  const markers=document.createElement('div');markers.id='friendlyMarkers';q('stage').append(markers);
  const rows=new Map(),tags=new Map();
  function message(text){lastMessage=text;q('wingmanStatus').textContent=text;}
  function issue(order){const n=window.astraNet;if(n?.session?.mode!=='coop'){message('Wingman commands are available in co-op campaigns.');return;}n.order(order,window.Module?.netView||[0,0,1]);message(labels[orders.indexOf(order)]+' · Order sent');}
  const api=window.astraSquadUI={
    open(){releaseFlightMouse();window.Module?._astra_reset_flight_input?.();q('wingmanOrders').hidden=window.astraNet?.session?.mode!=='coop';q('wingmanStatus').textContent=lastMessage;dialog.showModal();},
    command(m){if(!window.Module||Module.netSession?.self!==Module.netSession?.host)return;const d=m.direction||[0,0,1],ok=!!Module._astra_squad_order(m.from,orders.indexOf(m.order),...d);window.astraNet.orderResult(m.from,m.order,ok);},
    result(m){const name=window.astraNet?.session?.roster[m.from]?.name||'Pilot';message(m.ok?`${name}: ${labels[orders.indexOf(m.order)]}`:'No visible enemy is under that aim. Point at an enemy and try again.');},
    help(slot){help.set(slot,performance.now()+10000);message((window.astraNet?.session?.roster[slot]?.name||'Pilot')+' requests assistance');}
  };
  q('wingmanOpen').onclick=()=>api.open();q('squadHUDHelp').onclick=q('wingmanHelp').onclick=()=>window.astraNet?.help();
  dialog.querySelectorAll('[data-order]').forEach(b=>b.onclick=()=>issue(b.dataset.order));
  for(const type of ['keydown','keyup'])dialog.addEventListener(type,e=>e.stopPropagation());
  window.addEventListener('keydown',e=>{if(!e.altKey||e.ctrlKey||e.metaKey||e.repeat||!window.Module?.netSession||e.target.closest?.('input,textarea,select')||document.querySelector('dialog[open]'))return;const index=['Digit1','Digit2','Digit3','Digit4'].indexOf(e.code);if(index<0&&e.code!=='KeyH')return;e.preventDefault();e.stopImmediatePropagation();if(index>=0)issue(orders[index]);else window.astraNet.help();},true);
  setInterval(()=>{
    const m=window.Module,n=window.astraNet,s=n?.session,shown=!!s&&!m?.arenaDemo&&!!m?.netPilots&&document.body.classList.contains('flying')&&!window.astraMenus?.active&&!window.astraPreview?.active;
    panel.hidden=!shown;markers.hidden=!shown||s?.mode!=='coop';if(!shown)return;
    q('squadHUDTitle').textContent=n.reconnecting?'Reconnecting…':`${s.mode==='coop'?'Squadron':'Pilots'} · ${Number.isFinite(n.latency)?n.latency+' ms':'AI flight'}${s.self===s.host?' · Host':''}`;
    q('wingmanOpen').hidden=s.mode!=='coop';q('squadHUDHelp').hidden=s.mode!=='coop';
    const canvas=q('view'),rect=canvas.getBoundingClientRect(),now=performance.now(),alive=new Set();
    for(const p of m.netPilots){
      const info=s.roster[p.id];if(!info||info.skill===-2||p.id===s.self)continue;alive.add(p.id);
      let row=rows.get(p.id);if(!row){row=document.createElement('div');row.className='squadHUDRow';row.innerHTML='<span class="squad-name"></span><span class="squad-range"></span><span class="squad-shield" aria-hidden="true"><i></i></span><span class="squad-state"></span>';rows.set(p.id,row);q('squadHUDRows').append(row);}
      const asking=help.get(p.id)>now;
      row.classList.toggle('needs-help',asking||p.shields<30);
      row.querySelector('.squad-name').textContent=`${asking?'! ':''}${info.name}${info.skill>=0?' · AI':''}`;
      row.querySelector('.squad-range').textContent=p.connected===1?`${Math.round(p.distance)} u`:'';
      row.querySelector('.squad-state').textContent=p.connected===1?`${Math.max(0,Math.round(p.shields))}% shields${asking?' · Assistance requested':''}`:'Reconnecting';
      row.style.setProperty('--shield',Math.max(0,Math.min(100,p.shields))+'%');
      let tag=tags.get(p.id);if(!tag){tag=document.createElement('span');tags.set(p.id,tag);markers.append(tag);}
      const x=rect.left+p.screen[0]*rect.width/canvas.width,y=rect.top+p.screen[1]*rect.height/canvas.height;
      tag.hidden=!p.visible||p.connected!==1||x<rect.left+30||x>rect.right-30||y<rect.top+25||y>rect.bottom-25;
      tag.textContent=(asking?'! ':'◇ ')+info.name;tag.style.transform=`translate(${Math.round(x)}px,${Math.round(y)}px) translate(-50%,-130%)`;
    }
    for(const [id,row] of rows)if(!alive.has(id)){row.remove();rows.delete(id);tags.get(id)?.remove();tags.delete(id);}
  },250);
})();
