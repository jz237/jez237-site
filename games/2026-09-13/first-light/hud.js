// Compact overlay: the title menu over the live lake, in-game conditions, toasts and the version badge.
const $=id=>document.getElementById(id);
export function mountHud(handlers){
 const els={overlay:$('overlay'),hud:$('hud'),toast:$('toast'),clock:$('clock'),date:$('date'),wind:$('wind'),water:$('water'),sun:$('sun'),error:$('error'),start:$('start'),eyebrow:$('eyebrow'),title:$('title'),description:$('description'),hint:$('hint')};
 let toastUntil=0;
 $('start').onclick=()=>handlers.onStart();
 $('quality').onchange=e=>handlers.onQuality(e.target.value);
 $('steady').onchange=e=>handlers.onSteady(e.target.checked);
 $('fov').oninput=e=>handlers.onFov(Number(e.target.value));
 $('rate').onchange=e=>handlers.onRate(e.target.value);
 $('weather').onchange=e=>handlers.onWeather(e.target.value);
 for(const b of document.querySelectorAll('[data-skip]'))b.onclick=()=>handlers.onSkip(Number(b.dataset.skip));
 $('lenses').onclick=()=>handlers.onLenses();
 $('menu').onclick=()=>handlers.onMenu();
 $('timeSlider').oninput=e=>handlers.onHour(Number(e.target.value));
 return {
  els,
  showMenu({eyebrow,title,description,button}){els.overlay.classList.remove('hidden');if(eyebrow)els.eyebrow.textContent=eyebrow;if(title)els.title.innerHTML=title;if(description)els.description.textContent=description;if(button)els.start.textContent=button;els.start.disabled=false;},
  hideMenu(){els.overlay.classList.add('hidden');els.hud.classList.remove('hidden');},
  setSettings(s){$('quality').value=s.quality;$('steady').checked=!!s.steadyCamera;$('fov').value=s.fov;$('rate').value=String(s.timeRate);$('weather').value=s.weather;$('lenses').classList.toggle('on',!!s.polarized);},
  setConditions(c){els.clock.textContent=c.time;els.date.textContent=c.date;els.wind.textContent=c.wind;els.water.textContent=c.water;els.sun.textContent=c.sun;if(c.hour!==undefined&&document.activeElement!==$('timeSlider'))$('timeSlider').value=c.hour.toFixed(2);},
  setLenses(v){$('lenses').classList.toggle('on',!!v);},
  toast(text,ms=3200){els.toast.textContent=text;els.toast.style.opacity=1;toastUntil=performance.now()+ms;},
  tick(){if(toastUntil&&performance.now()>toastUntil){els.toast.style.opacity=0;toastUntil=0;}},
  error(text){els.error.textContent=text;},
  setHint(text){els.hint.textContent=text;}
 };
}
