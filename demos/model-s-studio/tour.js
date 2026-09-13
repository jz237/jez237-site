const $=id=>document.getElementById(id);
const stops=[
 ['exterior','An electric silhouette.','Metallic silver, panoramic glazing and the low, sculpted body. Drag to orbit the complete vehicle.','./'],
 ['exploded','Every layer, revealed.','The vehicle separates into 308 visual groups: 297 artist surfaces and 11 added schematic battery pieces. These are visual groups, not a service-parts catalog.','./?view=parts'],
 ['battery','The foundation beneath the cabin.','A separate battery study reveals the cover, illustrative cell banks, cooling layer and protective tray. The internals are schematic, not manufacturer CAD.','./?view=battery'],
 ['driver','Take the driver’s seat.','Look past the yoke toward the instrument cluster and center display. The car is parked; all readings belong to the studio simulation.','cockpit.html'],
 ['seats','Shape, seams and support.','A close view of the front seat, headrest and upholstery seams in the artist model. Drag gently to inspect the contours.','cockpit.html?view=seats'],
 ['door','Details within reach.','Explore the driver’s door trim, armrest and layered interior surfaces from inside the cabin.','cockpit.html?view=door'],
 ['pedals','Down to the footwell.','Look below the dashboard at the modeled pedal surfaces and floor area. This is a visual inspection, not an operating or repair procedure.','cockpit.html?view=pedals'],
 ['console','The center of the cabin.','Inspect the console, armrest and storage surfaces between the front seats.','cockpit.html?view=console'],
 ['display','A display you can explore.','Try the touchscreen to preview navigation, climate, charging and vehicle controls. The software is an independent simulation with fictional routes and sample values.','cockpit.html?app=navigation']
];
let index=0,playing=false,timer=null,generation=0,loadedScene=null,busy=false;
const frame=$('tour-frame');
function loading(on){busy=on;$('tour-step').disabled=on;$('tour-next').disabled=on;$('tour-back').disabled=on||index===0;}
stops.forEach((s,i)=>$('tour-step').add(new Option(`${String(i+1).padStart(2,'0')} · ${s[1]}`,String(i))));
const sceneFor=i=>i<3?'exterior':'interior';
function play(on){playing=on;clearTimeout(timer);$('tour-play').textContent=on?'Pause tour':'Play tour';$('tour-play').setAttribute('aria-pressed',on);if(on&&!busy)timer=setTimeout(()=>{if(index===stops.length-1)play(false);else show(index+1);},10000);}
function readyAPI(){const w=frame.contentWindow;return sceneFor(index)==='exterior'?w?.modelSStudio:w?.modelSCockpit;}
async function show(next){
 const token=++generation;index=next;loading(true);clearTimeout(timer);$('tour-error').hidden=true;$('tour-loading').hidden=false;
 const [key,title,description,link]=stops[index];$('tour-title').textContent=title;$('tour-description').textContent=description;$('tour-count').textContent=`${String(index+1).padStart(2,'0')} / 09 · GUIDED TOUR`;$('tour-step').value=String(index);$('tour-progress').value=index+1;$('tour-next').textContent=index===8?'Restart ↺':'Next →';$('tour-explore').href=link;$('tour-display').hidden=key!=='display';$('tour-display').disabled=true;
 const url=new URL(location.href);url.searchParams.set('stop',key);history.replaceState(null,'',url);
 try{
  const scene=sceneFor(index);
  if(loadedScene!==scene){loadedScene=scene;const destination=scene==='exterior'?'./?tour=1':'cockpit.html?tour=1';
   await new Promise((resolve,reject)=>{const done=()=>{clearTimeout(timeout);resolve();};const timeout=setTimeout(()=>{frame.removeEventListener('load',done);reject(Error('Loading timed out'));},45000);frame.addEventListener('load',done,{once:true});frame.src=destination;});
   await new Promise((resolve,reject)=>{const start=performance.now();const poll=()=>{if(token!==generation)return resolve();try{const api=readyAPI();if(api?.getState().ready)return resolve();if(frame.contentDocument?.querySelector('#error:not([hidden]),#cockpit-error:not([hidden])'))return reject(Error('Scene unavailable'));}catch{}if(performance.now()-start>45000)return reject(Error('Loading timed out'));setTimeout(poll,100);};setTimeout(poll,100);});
  }
  if(token!==generation)return;
  const api=readyAPI();if(!api?.getState().ready)throw Error('Scene not ready');
  if(scene==='exterior')api.showTourView(key);else{api.closeScreen();api.showView(key);}
  $('tour-loading').hidden=true;$('tour-display').disabled=false;loading(false);play(playing);
 }catch(e){if(token!==generation)return;loadedScene=null;loading(false);play(false);$('tour-loading').hidden=true;$('tour-error').hidden=false;}
}
$('tour-back').onclick=()=>{play(false);show(Math.max(0,index-1));};$('tour-next').onclick=()=>{play(false);show((index+1)%stops.length);};$('tour-step').onchange=e=>{play(false);show(Number(e.target.value));};$('tour-play').onclick=()=>{if(index===8&&!playing){show(0);play(true);}else play(!playing);};$('tour-retry').onclick=()=>show(index);$('tour-display').onclick=()=>{play(false);readyAPI()?.openScreen();};
document.addEventListener('visibilitychange',()=>{if(document.hidden)play(false);});
frame.addEventListener('load',()=>{try{frame.contentDocument.addEventListener('pointerdown',()=>play(false),{capture:true});frame.contentDocument.addEventListener('keydown',()=>play(false),{capture:true});frame.contentDocument.addEventListener('wheel',()=>play(false),{capture:true,passive:true});}catch{}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')play(false);});
const initial=stops.findIndex(s=>s[0]===new URLSearchParams(location.search).get('stop'));show(initial<0?0:initial);
