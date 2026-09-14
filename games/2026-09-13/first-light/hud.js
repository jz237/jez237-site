// Compact overlay: the title menu over the live lake, in-game conditions, tackle and technique
// readouts, the cast reticle and power meter, toasts and the version badge.
const $=id=>document.getElementById(id);
export function mountHud(handlers){
 const els={overlay:$('overlay'),hud:$('hud'),toast:$('toast'),clock:$('clock'),date:$('date'),wind:$('wind'),water:$('water'),sun:$('sun'),error:$('error'),start:$('start'),eyebrow:$('eyebrow'),title:$('title'),description:$('description'),hint:$('hint'),rigName:$('rigName'),rigDesc:$('rigDesc'),holderLine:$('holderLine'),technique:$('technique'),lineInfo:$('lineInfo'),reticle:$('reticle'),power:$('power'),powerFill:$('power').firstElementChild,tension:$('tension'),tensionFill:$('tension').firstElementChild,tensionLabel:$('tension').lastElementChild,card:$('catchCard')};
 let toastUntil=0,lastPhase='',lastPower=-1;
 $('start').onclick=()=>handlers.onStart();
 $('quality').onchange=e=>handlers.onQuality(e.target.value);
 $('steady').onchange=e=>handlers.onSteady(e.target.checked);
 $('dof').onchange=e=>handlers.onDof(e.target.checked);
 $('liveWeather').onchange=e=>handlers.onLiveWeather(e.target.checked);
 $('voiceVol').oninput=e=>handlers.onVoice(Number(e.target.value));
 $('realism').onchange=e=>handlers.onRealism(e.target.value);
 $('fov').oninput=e=>handlers.onFov(Number(e.target.value));
 $('rate').onchange=e=>handlers.onRate(e.target.value);
 $('weather').onchange=e=>handlers.onWeather(e.target.value);
 for(const b of document.querySelectorAll('[data-skip]'))b.onclick=()=>handlers.onSkip(Number(b.dataset.skip));
 $('lenses').onclick=()=>handlers.onLenses();
 $('menu').onclick=()=>handlers.onMenu();
 $('rigBtn').onclick=()=>handlers.onRig();
 $('ccRelease').onclick=()=>handlers.onRelease();
 $('ccPhoto').onclick=()=>handlers.onPhoto();$('photoBtn').onclick=()=>handlers.onPhotoMode();$('pbSave').onclick=()=>handlers.onPhotoSave();$('pbBack').onclick=()=>handlers.onPhotoBack();
 $('watch').onclick=()=>handlers.onWatch();
 $('lureCamBtn').onclick=()=>handlers.onLureCam();
 $('galleryBtn').onclick=()=>handlers.onGallery();
 $('sessionBtn').onclick=()=>handlers.onSession($('sessionVariant').value);$('tutorialBtn').onclick=()=>handlers.onTutorial();$('tutSkip').onclick=()=>handlers.onTutorialSkip();$('bigBassBtn').onclick=()=>handlers.onBigBass();
 $('scSubmit').onclick=()=>handlers.onSessionSubmit($('scInitials').value);$('scBack').onclick=()=>handlers.onSessionBack();$('scInitials').onkeydown=e=>{if(e.key==='Enter')handlers.onSessionSubmit($('scInitials').value);e.stopPropagation();};
 $('timeSlider').oninput=e=>handlers.onHour(Number(e.target.value));
 return {
  els,
  showMenu({eyebrow,title,description,button}){els.overlay.classList.remove('hidden');if(eyebrow)els.eyebrow.textContent=eyebrow;if(title)els.title.innerHTML=title;if(description)els.description.textContent=description;if(button)els.start.textContent=button;els.start.disabled=false;},
  hideMenu(){els.overlay.classList.add('hidden');els.hud.classList.remove('hidden');},
  setSettings(s){$('quality').value=s.quality;$('steady').checked=!!s.steadyCamera;$('dof').checked=s.dof!==false;$('liveWeather').checked=s.liveWeather!==false;$('voiceVol').value=s.voice===undefined?.8:s.voice;$('realism').value=s.realism||'standard';$('fov').value=s.fov;$('rate').value=String(s.timeRate);$('weather').value=s.weather;$('lenses').classList.toggle('on',!!s.polarized);},
  setConditions(c){els.clock.textContent=c.time;els.date.textContent=c.date;els.wind.textContent=c.wind;els.water.textContent=c.water;els.sun.textContent=c.sun;if(c.hour!==undefined&&document.activeElement!==$('timeSlider'))$('timeSlider').value=c.hour.toFixed(2);},
  setHolder(text,alert){if(els.holderLine.textContent!==text)els.holderLine.textContent=text;els.holderLine.classList.toggle('alert',!!alert);els.holderLine.classList.toggle('show',!!text);},
  setTackle(snap,rigName,desc){els.rigName.textContent=rigName;els.rigDesc.textContent=desc;els.technique.textContent=snap.phase==='snagged'?'SNAGGED · slack, then snap (F)':snap.phase==='retrieve'?snap.technique:snap.phase==='flight'?'cast away':snap.phase==='charging'?'loading the rod':snap.phase==='bite'?'SET THE HOOK':snap.phase==='fight'?'fish on · '+(snap.fight||'').toLowerCase():snap.phase==='landed'?'landed':'rod ready';
   els.lineInfo.textContent=snap.phase==='retrieve'?`${snap.lineOut.toFixed(0)} m out · lure ${snap.lureDepth<.05?(snap.onBottom?'on the bottom':'on top'):snap.lureDepth.toFixed(1)+' m down'}${snap.tension>.6?' · tight':''}`+(snap.abrasion>=.12?' · line '+snap.lineWord:''):snap.retie>0?`retying… ${Math.ceil(snap.retie)} s`:snap.casts?`${snap.casts} cast${snap.casts===1?'':'s'}`+(snap.abrasion>=.3?' · line '+snap.lineWord+' · R to retie':''):'';},
  setCast(phase,power){if(phase!==lastPhase){lastPhase=phase;els.reticle.classList.toggle('show',phase==='idle'||phase==='charging');els.power.classList.toggle('show',phase==='charging');}if(phase==='charging'&&Math.abs(power-lastPower)>.01){lastPower=power;els.powerFill.style.width=(power*100).toFixed(0)+'%';}},
  setBadge(text){$('demoBadge').textContent=text||'WATCH DEMO · Ray is fishing · press any key or tap to take the rod';},
  setCaption(text){const el=$('caption');if(el.textContent!==text){el.textContent=text;el.classList.toggle('show',!!text);}},setDemo(on){$('demoBadge').classList.toggle('show',!!on);document.body.classList.toggle('demo',!!on);},
  setTension(show,value,label){els.tension.classList.toggle('show',!!show);if(show){els.tensionFill.style.width=(Math.min(1,value)*100).toFixed(0)+'%';els.tensionLabel.textContent=label||'';}},
  showCard(c){$('ccSpecies').textContent=c.species;$('ccSize').textContent=c.size;$('ccDetail').textContent=c.detail;$('ccMeta').textContent=c.meta;els.card.classList.remove('hidden');},hideCard(){els.card.classList.add('hidden');},
  setLenses(v){$('lenses').classList.toggle('on',!!v);},
  setSession(s){const el=$('sessionBar');if(!s){el.classList.remove('show');return;}el.classList.add('show');el.innerHTML=s.html||`${s.label} · target <b>${s.target}</b> · <b>${s.remaining}</b> left · <b>${s.score}</b> pts`;},
  showSessionCard(c){$('scTitle').textContent=c.title;$('scSummary').textContent=c.summary;$('scTarget').textContent=c.target;$('scInitials').value=c.initials||'';$('scBoard').innerHTML=c.rows||'';$('sessionCard').classList.remove('hidden');$('scInitials').focus();},
  setSessionBoard(rows){$('scBoard').innerHTML=rows;},hideSessionCard(){$('sessionCard').classList.add('hidden');},
  toast(text,ms=3200){els.toast.textContent=text;els.toast.style.opacity=1;toastUntil=performance.now()+ms;},
  tick(){if(toastUntil&&performance.now()>toastUntil){els.toast.style.opacity=0;toastUntil=0;}},
  error(text){els.error.textContent=text;},
  setHint(text){els.hint.textContent=text;}
 };
}
