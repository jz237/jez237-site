/* Presentation only: preserve the native flight, renderer and menu commands. */
(()=>{
  'use strict';
  const q=id=>document.getElementById(id);
  function section(title,id){const el=document.createElement('section');el.className='settings-section';el.setAttribute('aria-labelledby',id);const h=document.createElement('h3');h.id=id;h.textContent=title;el.append(h);return el;}
  const settings=q('panel-settings'),heading=document.createElement('h2');heading.textContent='Flight settings';settings.querySelector('.section-line').after(heading);
  const display=section('Display','displaySettings'),flight=section('Flight preferences','flightSettings'),tools=section('Controls & comfort','controlSettings'),diagnostics=section('Performance','diagnosticSettings');
  display.append(settings.querySelector('.settings-grid'));
  settings.querySelectorAll('.switch-row').forEach(el=>flight.append(el));
  for(const id of ['controllerSetup','weaponPriorities','comfortSetup'])tools.append(q(id));
  const advice=q('performanceStart').nextElementSibling;
  diagnostics.append(q('performanceStart'),advice,q('performancePrevious'));
  const grid=document.createElement('div');grid.className='settings-sections';grid.append(display,flight,tools,diagnostics);
  settings.querySelector('.interaction-note')?.remove();heading.after(grid);
  settings.append(settings.querySelector('[data-go="missions"]'));
  const showroom=q('panel-showroom'),exhibits=document.createElement('div');exhibits.className='showroom-grid';
  showroom.querySelectorAll('.showroom-action').forEach(el=>exhibits.append(el));showroom.querySelector('.mine-choice').after(exhibits);
  // Keep all launch handlers on their original elements.
  const missions=q('panel-missions'),actions=document.createElement('div');actions.className='mission-actions';actions.append(q('menus'),q('squadronStart'));missions.append(actions);
  q('start').after(q('resumeLastFlight'));q('resumeLastFlight').after(q('continueFlight'));
  q('resumeLastFlight').classList.add('resume-action');
  q('menus').querySelector('span')?.remove();
  q('squadronStart').textContent='Multiplayer & AI squadron';const squadArrow=document.createElement('b');squadArrow.textContent='→';squadArrow.setAttribute('aria-hidden','true');q('squadronStart').append(squadArrow);
  q('nativeOpen').before(q('nativeComfort'));
  const note=missions.querySelector('.interaction-note');note.textContent='Select a campaign, then enter the mine. Double-click to launch.';
  const controlList=q('panel-controls').querySelector('.key-list');
  for(const [label,keys] of [['Wingman orders (co-op)','Alt + 1–4'],['Request assistance (co-op)','Alt + H']]){const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd'),kbd=document.createElement('kbd');dt.textContent=label;kbd.textContent=keys;dd.append(kbd);row.append(dt,dd);controlList.append(row);}
  // Collapse the scattered utility buttons into one compact flight drawer.
  const dock=document.createElement('details');dock.id='flightDock';const summary=document.createElement('summary');summary.textContent='Flight controls';summary.setAttribute('aria-label','Open flight controls');dock.append(summary);
  const drawer=document.createElement('div');drawer.className='flight-drawer';dock.append(drawer);
  for(const id of ['flightMenu','invertFlight','previewFlight','mineFlight'])if(q(id))drawer.append(q(id));q('stage').append(dock);
  drawer.addEventListener('click',e=>{if(e.target.closest('button')?.id!=='invertFlight')dock.open=false;});
  document.addEventListener('pointerlockchange',()=>{if(document.pointerLockElement)dock.open=false;});
  // Keep restoration reachable even when the cockpit and informational overlays are hidden.
  const hud=document.createElement('button');hud.id='hudToggle';hud.type='button';hud.hidden=true;
  hud.textContent='Hide HUD';hud.title='Hide HUD (Alt+F7)';hud.setAttribute('aria-controls','astraDeck');q('stage').append(hud);
  let hudVisible=null;
  function syncHud(){
    const m=window.Module,ready=!!(m?.calledRun&&!m.aborted&&!m.astraExited&&m._astra_hud_visible);
    hud.hidden=!ready||!flightActive||!!window.astraPreview?.active||!!window.astraMenus?.active;
    if(!ready)return;
    const visible=!!m._astra_hud_visible();
    if(visible!==hudVisible){
      hudVisible=visible;hud.textContent=visible?'Hide HUD':'Show HUD';hud.title=(visible?'Hide cockpit; keep flight readouts':'Show full cockpit')+' (Alt+F7)';
      document.body.classList.toggle('hud-hidden',!visible);
      if(!visible)window.astraDeck?.show(false);
    }
  }
  window.astraHud={sync:syncHud,toggle(){
    if(!window.Module?._astra_hud_visible||!flightActive||window.astraPreview?.active)return;
    Module.hudToggleCommand=!Module.hudToggleCommand;hud.blur();
    if(!document.querySelector('dialog[open]')&&!window.astraMenus?.active)flightView.focus({preventScroll:true});
  }};
  let hudKeyDown=false;
  for(const type of ['keydown','keyup'])window.addEventListener(type,e=>{
    if(e.code!=='F7')return;
    if(type==='keyup'&&hudKeyDown){hudKeyDown=false;e.preventDefault();e.stopImmediatePropagation();return;}
    if(!e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)return;
    if(!flightActive||window.astraMenus?.active||window.astraPreview?.active||document.querySelector('dialog[open]')||e.target.closest?.('input,textarea,select,[contenteditable=true]'))return;
    e.preventDefault();e.stopImmediatePropagation();
    if(type==='keydown'){if(!e.repeat&&!hudKeyDown)astraHud.toggle();hudKeyDown=true;}else hudKeyDown=false;
  },true);
  window.addEventListener('blur',()=>{hudKeyDown=false;});
  hud.onclick=()=>astraHud.toggle();
  for(const type of ['keydown','keyup'])hud.addEventListener(type,e=>{if(e.key===' '||e.key==='Enter')e.stopPropagation();});
  new MutationObserver(syncHud).observe(document.body,{attributes:true,attributeFilter:['class']});
  setInterval(()=>{if(flightActive)syncHud();},500);
  const hudRow=document.createElement('div');hudRow.innerHTML='<dt>HUD on / off</dt><dd><kbd>Alt + F7</kbd> or the HUD button</dd>';controlList.append(hudRow);
  const rear=document.createElement('button');rear.id='rearDisplay';rear.type='button';rear.hidden=true;
  rear.innerHTML='<span>Rear display: Off</span><small>Shift+F1 / Shift+F2</small>';
  rear.setAttribute('aria-label','Rear-view display');rear.setAttribute('aria-pressed','false');
  rear.title='Rear camera on/off. Shift+F1 cycles the left monitor; Shift+F2 cycles the right. Hold R (default) to look behind.';
  q('stage').append(rear);let rearOn=null;
  function syncRear(){
    const m=window.Module,ready=!!(m?.calledRun&&!m.aborted&&!m.astraExited&&m._astra_rear_status);
    rear.hidden=!ready||!flightActive||!!m?.autopilot||!!window.astraPreview?.active||!!window.astraMenus?.active;
    if(!ready)return;
    const on=!!(m._astra_rear_status()&3);
    if(on!==rearOn){rearOn=on;rear.querySelector('span').textContent='Rear display: '+(on?'On':'Off');rear.setAttribute('aria-pressed',String(on));}
  }
  window.astraRear={sync:syncRear,toggle(){
    const m=window.Module;
    if(!m?._astra_rear_status||!flightActive||m.autopilot||window.astraPreview?.active||window.astraMenus?.active)return;
    m.rearDisplayCommand=!m.rearDisplayCommand;rear.blur();flightView.focus({preventScroll:true});
  }};
  rear.onclick=()=>astraRear.toggle();
  for(const type of ['keydown','keyup'])rear.addEventListener(type,e=>{if(e.key===' '||e.key==='Enter')e.stopPropagation();});
  new MutationObserver(syncRear).observe(document.body,{attributes:true,attributeFilter:['class']});
  setInterval(()=>{if(flightActive)syncRear();},500);
  for(const [label,keys] of [['Rear-view display','Rear display button · Shift+F1 left / Shift+F2 right'],['Look behind','Hold R (default); release to face forward']]){
    const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=keys;row.append(dt,dd);controlList.append(row);
  }
  const demoHint=document.createElement('p');demoHint.className='interaction-note';demoHint.textContent='The demo starts without the cockpit, with essential flight readouts. Use Show HUD to restore the full cockpit.';q('panel-spectate').append(demoHint);
  q('loadingScreen').tabIndex=-1;
  // Native dialogs retain their own focus and Escape handling.
  const labelDialogs=()=>document.querySelectorAll('dialog:not([aria-labelledby])').forEach(d=>{const h=d.querySelector('h2');if(h){h.id=h.id||d.id+'-title';d.setAttribute('aria-labelledby',h.id);}});
  labelDialogs();new MutationObserver(labelDialogs).observe(document.body,{childList:true});
  document.body.classList.add('astra-polished');
})();
