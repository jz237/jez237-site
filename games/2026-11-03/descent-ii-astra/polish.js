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
  q('loadingScreen').tabIndex=-1;
  // Native dialogs retain their own focus and Escape handling.
  const labelDialogs=()=>document.querySelectorAll('dialog:not([aria-labelledby])').forEach(d=>{const h=d.querySelector('h2');if(h){h.id=h.id||d.id+'-title';d.setAttribute('aria-labelledby',h.id);}});
  labelDialogs();new MutationObserver(labelDialogs).observe(document.body,{childList:true});
  document.body.classList.add('astra-polished');
})();
