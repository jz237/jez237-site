/* Presentation controls never write native pilot, inventory or AI state. */
(() => {
  const $ = id => document.getElementById(id);
  const combatToggle=document.createElement('button');combatToggle.id='combatToggle';combatToggle.textContent='Damage controls';combatToggle.setAttribute('aria-controls','rangeControls');
  $('previewPanel').append(combatToggle);
  function combatControls(open){combatToggle.setAttribute('aria-expanded',String(open));$('rangeControls').hidden=!open;}
  combatToggle.onclick=()=>combatControls(combatToggle.getAttribute('aria-expanded')!=='true');
  const shadow = $('shadowQuality');
  try { shadow.value = localStorage.getItem('astra.shadows') ?? (matchMedia('(pointer:coarse)').matches ? '0' : '1'); } catch {}
  shadow.addEventListener('change', () => {
    try { localStorage.setItem('astra.shadows', shadow.value); } catch {}
    if (window.Module) Module.shadowQuality = Number(shadow.value);
    document.getElementById('mineShadowQuality').value=shadow.value;
  });
  const shadowLabel=document.createElement('label');shadowLabel.textContent='MOVING SHADOWS';
  const shadowInMine=shadow.cloneNode(true);shadowInMine.id='mineShadowQuality';shadowInMine.value=shadow.value;
  shadowLabel.append(shadowInMine);$('mineDetails').insertBefore(shadowLabel,$('mineDescription'));
  shadowInMine.onchange=()=>{shadow.value=shadowInMine.value;shadow.dispatchEvent(new Event('change'));};
  astraMinePreview.descriptions[8]='The actual ship silhouette moves across a real mine wall from a nearby fixture. Compare Basic, Detailed and Ultra shadows here.';
  window.astraPlayback = {
    age: 0,
    reset() {
      Module.previewPaused = false;
      Module.previewSpeed = Number($('effectSpeed').value);
      this.age = 0; this.sync();
    },
    sync() {
      $('effectPause').textContent = Module.previewPaused ? 'Play' : 'Pause';
      $('effectPause').setAttribute('aria-pressed', String(!!Module.previewPaused));
    },
    update(age, length, seed, timed) {
      this.age = age;
      const enabled = Module.mineInspect < 0 && Module.pickupInspect < 0;
      $('playbackControls').hidden = !enabled;
      $('effectNew').hidden = !enabled || !!timed;
      $('combatControls').hidden = !(Module.combatInspect >= 0);
      $('effectScrub').max = String(length);
      $('effectScrub').value = String(Math.min(age, length));
      $('effectTimestamp').textContent = `${Math.min(age, length).toFixed(2)} / ${length.toFixed(2)} s`;
      if (enabled && age >= length && !Module.previewPaused && (timed || !$('blastLoop').checked)) {
        Module.previewPaused = true; this.sync();
      }
      Module.effectPlayback = { age, length, seed: seed >>> 0, paused: !!Module.previewPaused, rate: Module.previewSpeed || 1 };
    }
  };
  $('effectPause').onclick = () => { Module.previewPaused = !Module.previewPaused; astraPlayback.sync(); };
  $('effectSpeed').onchange = () => { Module.previewSpeed = Number($('effectSpeed').value); };
  $('effectScrub').oninput = () => {
    Module.previewPaused = true; Module.previewSeek = Number($('effectScrub').value);
    if (Module.weaponInspect >= 0) { astraWeaponDemo.cycling = false; astraWeaponDemo.sync(); }
    astraPlayback.sync();
  };
  $('effectReplay').onclick = () => { Module.pyroPreviewCommand = 2; };
  $('effectNew').onclick = () => { Module.pyroPreviewCommand = 1; };
  const blastUpdate = astraPreview.update.bind(astraPreview);
  astraPreview.update = (...args) => {
    blastUpdate(...args);
    $('previewAgain').textContent = 'New variation';
  };
  const resetCombat = () => { window.astraCombatPending = -1; if (window.Module) Module.combatInspect = -1;document.body.classList.remove('combat-preview'); };
  const explosionOpen = astraPreview.open.bind(astraPreview);
  astraPreview.open = () => { resetCombat(); explosionOpen(); };
  const weaponsOpen = astraWeaponDemo.open.bind(astraWeaponDemo);
  astraWeaponDemo.open = () => { resetCombat(); weaponsOpen(); };
  for (const id of ['previewStart', 'blastStart', 'collectiblesStart', 'weaponsStart', 'mineStart', 'autoMine', 'mineFlight']) {
    $(id)?.addEventListener('click', resetCombat, true);
  }
  const show = astraPreview.show.bind(astraPreview);
  astraPreview.show = active => {
    show(active);
    astraImpact.clear();
    if (!active) resetCombat();
    $('playbackControls').hidden = !active || Module.mineInspect >= 0 || Module.pickupInspect >= 0;
    $('combatControls').hidden = !active || !(Module.combatInspect >= 0);
  };
  window.astraCombat = {
    open() {
      window.astraCombatPending = 0;
      if (flightActive && Module.astra) {
        Module.combatInspect = 0; Module.mineInspect = Module.weaponInspect = Module.pickupInspect = -1;
        releaseFlightMouse(); Module.pyroPreviewCommand = 1;
      } else { $('look').value = 'astra'; launch(true, false, false, true); }
    },
    update(mode, age) {
      if(!document.body.classList.contains('combat-preview')){document.body.classList.add('combat-preview');combatControls(!matchMedia('(max-height:550px), (max-width:700px)').matches);}
      $('combatControls').hidden = false; $('blastControls').hidden = true;
      $('weaponControls').hidden = true; $('previewPrevious').hidden = true;
      $('previewProgress').hidden = true; $('combatSelect').value = String(mode);
      $('previewTitle').textContent = mode===1 ? 'PYRO–GX / DIRECTIONAL SHIELDS' : mode===2 ? 'ROBOT / HULL BREAKUP' : 'ROBOT / BREAKAWAY COMPONENTS';
      $('combatRobotLabel').hidden=mode===1;
      $('previewVariation').textContent = mode===1 ? ['Forward', 'Starboard', 'Rear', 'Port', 'Above'][Math.min(4, Math.floor(age / 2))] + ' impact' : mode===2 ? age<2?'Intact hull':age<4.4?'Hull rupture':'Tumbling wreckage' : ['Intact hull','Side assembly detached','Lower assembly detached','Weapon housing detached'][Math.min(3,Math.floor(age/2))];
      $('previewPhase').textContent = mode===1 ? 'Localized ripple · Direction marker' : 'Original surfaces · Missing components · Solid flying pieces';
      $('previewAgain').textContent = 'Replay'; $('previewTime').textContent = '';
      astraDeck.show(mode===1);
      if (mode===1) {
        astraDeck.update(0,3,100,Math.max(5,100-Math.floor(age/2)*18),0,0,0,1,6,100,0,1,100,true,false,0);
        const dirs = [[0,0,1],[1,0,0],[0,0,-1],[-1,0,0],[0,1,0]];
        astraImpact.preview(dirs[Math.min(4, Math.floor(age / 2))], age % 2);
      } else astraImpact.clear();
    }
  };
  $('combatRobot').onchange=()=>{Module.combatRobot=Number($('combatRobot').value);Module.pyroPreviewCommand=2;};
  $('combatStart').onclick = () => astraCombat.open();
  $('combatSelect').onchange = () => { Module.combatInspect = Number($('combatSelect').value); Module.pyroPreviewCommand = 2; };
  const again = $('previewAgain').onclick;
  $('previewAgain').onclick = () => { if (Module.combatInspect >= 0) Module.pyroPreviewCommand = 2; else again(); };

  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.id = 'shieldImpacts'; svg.setAttribute('viewBox', '0 0 1000 600'); svg.setAttribute('aria-hidden', 'true');
  $('stage').append(svg);
  const groups = Array.from({length: 3}, () => {
    const group = document.createElementNS(ns,'g');
    const ripple = document.createElementNS(ns,'path'), marker = document.createElementNS(ns,'path'), label = document.createElementNS(ns,'text');
    group.append(ripple,marker,label); svg.append(group);
    ripple.setAttribute('class','shield-ripple'); marker.setAttribute('class','shield-marker'); label.setAttribute('class','shield-label');
    return {group,ripple,marker,label};
  });
  function draw(slot, direction, age, strength) {
    const {group,ripple,marker,label} = groups[slot];
    const visible = age >= 0 && age < .75;
    group.style.display = visible ? '' : 'none'; if (!visible) return;
    const [x,y,z] = direction;
    const angle = Math.abs(x)+Math.abs(y)<.1 ? (z < 0 ? Math.PI/2 : -Math.PI/2) : Math.atan2(-y,x);
    const a = angle * 180 / Math.PI, rear = z < -.35;
    const radius = 218 - age*30;
    const start = angle-.36-age*.1, end = angle+.36+age*.1;
    const sx = 500+Math.cos(start)*radius*1.83, sy = 300+Math.sin(start)*radius;
    const ex = 500+Math.cos(end)*radius*1.83, ey = 300+Math.sin(end)*radius;
    ripple.setAttribute('d',`M${sx} ${sy} A${radius*1.83} ${radius} 0 0 1 ${ex} ${ey}`);
    ripple.style.opacity = String((1-age/.75)*Math.min(.45,.22+strength*.018));
    ripple.style.strokeWidth = String(2.5+age*7);
    marker.setAttribute('d','M 81 -10 L 91 0 L 81 10');
    marker.setAttribute('transform',`translate(500 290) rotate(${a})`);
    marker.style.opacity=String(Math.min(.8,1-age/.75));
    label.setAttribute('x',String(500+Math.cos(angle)*119)); label.setAttribute('y',String(294+Math.sin(angle)*110));
    label.textContent=rear?'REAR':Math.abs(x)+Math.abs(y)<.1?'FRONT':'';
    label.style.opacity=String(1-age/.75);
  }
  let hits=[], pending=0;
  window.astraImpact = {
    hit(x,y,z,damage) {
      if (!flightActive || !Module.astra || astraPreview.active) return;
      const now=performance.now();
      // Repeated scraping cannot build a wall of overlapping flashes.
      hits=hits.filter(hit=>now-hit.born<750 && Math.hypot(hit.dir[0]-x,hit.dir[1]-y,hit.dir[2]-z)>.35).slice(-2);
      hits.push({dir:[x,y,z],born:now,strength:damage});
      Module.lastShieldImpact={x,y,z,damage};
      if(!pending)pending=requestAnimationFrame(tick);
    },
    clear() { hits=[];groups.forEach(g=>g.group.style.display='none'); },
    preview(direction,age) { hits=[];groups.slice(1).forEach(g=>g.group.style.display='none');draw(0,direction,age,12); }
  };
  function tick(now) {
    pending=0;
    if(astraPreview.active)return;
    if(!flightActive||document.hidden){astraImpact.clear();return;}
    hits=hits.filter(hit=>now-hit.born<750);
    groups.forEach((_,i)=>{const hit=hits[i];draw(i,hit?.dir||[0,0,1],hit?(now-hit.born)/1000:2,hit?.strength||0);});
    if(hits.length)pending=requestAnimationFrame(tick);
  }
  astraImpact.clear();
})();
