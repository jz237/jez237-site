import {raceScore,type RaceScore} from './global-score';
type Result=RaceScore & {course:string};
const KEY='quarry-global-driver-v1';
async function endpoint(){const r=await fetch('./global-scoring.json',{signal:AbortSignal.timeout(5000)});if(!r.ok)throw Error('Global scoring is not available yet. Your local results are safe.');const config=await r.json();if(!config.endpoint)throw Error('Global scoring is not available yet. Your local results are safe.');const u=new URL(config.endpoint);if(u.protocol!=='https:'&&u.hostname!=='127.0.0.1')throw Error('Global scoring is not configured');return u.href;}
function identity(){try{const v=JSON.parse(localStorage.getItem(KEY)??'null');if(v&&/^[a-f0-9-]{36}$/.test(v.id))return v;}catch{}return {id:crypto.randomUUID(),name:'DRIVER'};}
export function openGlobalScores(result?:Result){
  document.getElementById('global-score-dialog')?.remove();
  const overlay=document.createElement('div');overlay.id='global-score-dialog';overlay.className='overlay';overlay.style.zIndex='100';
  overlay.innerHTML='<section class="dialog" role="dialog" aria-modal="true" aria-label="Global Hall of Dents"><div class="eyebrow">WEEKLY GLOBAL SCORING</div><h2>HALL OF DENTS</h2><p>Top 100 · Your best race counts once. Resets Mondays, UTC. Casual, player-reported scores.</p><p>Up to 1,000 placement points + 10 per starter + remaining condition.</p><form><label>Public nickname <input name="nickname" maxlength="18" minlength="2" required autocomplete="nickname"></label><button class="primary" type="submit">POST THIS RACE</button></form><p class="score-status" role="status"></p><ol class="score-entries"></ol><button type="button" class="score-refresh small-button">REFRESH</button><button type="button" class="score-close small-button">CLOSE</button></section>';
  const status=overlay.querySelector<HTMLElement>('.score-status')!,list=overlay.querySelector('ol')!,form=overlay.querySelector('form')!,input=overlay.querySelector('input')!,submit=overlay.querySelector<HTMLButtonElement>('[type=submit]')!,driver=identity();
  input.value=driver.name;
  if(result)submit.textContent=`POST ${raceScore(result).toLocaleString()} POINTS`;else form.hidden=true;
  let busy=false;const previous=document.activeElement as HTMLElement|null;
  const close=()=>{overlay.remove();document.removeEventListener('keydown',keys,true);previous?.focus();};
  const keys=(e:KeyboardEvent)=>{e.stopPropagation();if(e.key==='Escape'){e.preventDefault();close();}if(e.key==='Tab'){const a=Array.from(overlay.querySelectorAll<HTMLElement>('button:not(:disabled),input')).filter(e=>!e.closest('[hidden]'));const i=a.indexOf(document.activeElement as HTMLElement);e.preventDefault();a[(i+(e.shiftKey?-1:1)+a.length)%a.length]?.focus();}};
  document.addEventListener('keydown',keys,true);
  async function load(post=false){if(busy)return;busy=true;submit.disabled=true;status.textContent=post?'Posting score…':'Loading global scores…';
    try{const url=await endpoint();const name=input.value.trim();const r=await fetch(url,{method:post?'POST':'GET',headers:post?{'Content-Type':'application/json'}:undefined,body:post?JSON.stringify({...result,id:driver.id,name}):undefined,signal:AbortSignal.timeout(10000)});const data=await r.json();if(!r.ok)throw Error(data.error??'Leaderboard unavailable');if(!Array.isArray(data.entries))throw Error('Leaderboard unavailable');
      if(post){driver.name=name;try{localStorage.setItem(KEY,JSON.stringify(driver));}catch{}}
      list.replaceChildren();for(const entry of data.entries.slice(0,100)){const li=document.createElement('li');li.textContent=`${String(entry.name)} — ${Number(entry.points).toLocaleString()} pts · ${String(entry.course).replace(/-v\d+$/,'').replaceAll('-',' ')}`;list.append(li);}
      status.textContent=(post?'Score received. Only your best is kept. ':'')+(data.entries.length?`Week of ${data.week}`:'No scores yet — set the first!');
    }catch(e){status.textContent=e instanceof Error?e.message:'Could not reach global scoring. Try again.';}finally{busy=false;submit.disabled=false;}}
  form.onsubmit=e=>{e.preventDefault();void load(true);};overlay.querySelector<HTMLButtonElement>('.score-refresh')!.onclick=()=>{void load();};overlay.querySelector<HTMLButtonElement>('.score-close')!.onclick=close;
  document.body.append(overlay);overlay.querySelector<HTMLButtonElement>('.score-close')!.focus();void load();
}
export function globalScoresButton(container:Element|null,result?:Result){if(!container)return;const b=document.createElement('button');b.className='small-button';b.textContent=result?`GLOBAL SCORE · ${raceScore(result).toLocaleString()} PTS`:'GLOBAL SCORES';b.onclick=()=>openGlobalScores(result);container.append(b);}
