import {CHALLENGES,formatChallengeValue,lowerIsBetter,challengeVenueName,type Challenge,type Discipline} from './challenges';
import {DISCIPLINES,levelFor,type DriverProfile,type Award} from './progression';
import {DEFINITIONS} from './rules';
export const MEDALS=['NO MEDAL','BRONZE','SILVER','GOLD'];
export function awardText(award:Award|null){
  if(!award||!award.qualified)return '';
  const xp=Object.entries(award.xp).filter(([,n])=>n>0).map(([key,n])=>`+${n} ${DISCIPLINES[key as Discipline].label} XP`).join(' · ');
  return `${award.medal?MEDALS[award.medal]+(award.improved?' · NEW BEST · ':' · '):''}${xp}`;
}
export function showDriverProfile(ui:HTMLElement,profile:DriverProfile,callbacks:{close:()=>void;start:(challenge:Challenge)=>void},storageWarning='',initialDiscipline:Discipline='racing'){
  let filter:Discipline=initialDiscipline;
  const render=()=>{
    const medals=Object.values(profile.challenges).filter(r=>r.medal>0).length;
    ui.innerHTML=`<section class="profile-board" aria-label="Driver profile and challenges"><header><div><div class="eyebrow">BLACKRIDGE MOTOR CLUB / DRIVER PROFILE</div><h1>EARN YOUR REPUTATION.</h1><p>${profile.events} events completed · ${profile.wins} wins · ${(profile.distance/1000).toFixed(1)} km driven · ${profile.knockouts} knockouts</p></div><button id="profile-close" aria-label="Close driver profile">✕</button></header><div class="discipline-grid">${(Object.keys(DISCIPLINES) as Discipline[]).map(key=>{const l=levelFor(profile.xp[key]);return `<article class="discipline"><div class="eyebrow">${DISCIPLINES[key].label}</div><strong>LEVEL ${l.level}</strong><progress max="1" value="${l.fraction}" aria-label="${DISCIPLINES[key].label} level progress"></progress><small>${l.earned} / ${l.required} XP to next level</small><p>${DISCIPLINES[key].description}</p></article>`;}).join('')}</div><div class="challenge-heading"><div><h2>THE CHALLENGE BOARD</h2><p>${medals} / ${CHALLENGES.length} challenges medalled · Solo · Fixed stock cars · No recoveries</p></div><nav aria-label="Challenge categories">${(Object.keys(DISCIPLINES) as Discipline[]).map(key=>`<button data-filter="${key}" aria-pressed="${filter===key}">${key==='racing'?'RACING':key==='impact'?'DEMOLITION':'STUNTS'}</button>`).join('')}</nav></div><p class="profile-note">Drive your way: solo racing, impacts and stunts each build a separate level. XP is banked when an event ends or you return to the menu. New challenge medals award bonus XP once. Demo and online sessions do not award local progression.</p>${storageWarning?'<p class="profile-warning" role="alert">'+storageWarning+'</p>':''}<div class="challenge-grid">${CHALLENGES.filter(c=>c.discipline===filter).map(c=>{const record=profile.challenges[c.id];return `<article class="challenge-card"><div class="eyebrow">${challengeVenueName(c)} / ${DEFINITIONS[c.car].name} / ${c.limit} SECONDS</div><h3>${c.title}</h3><p>${c.description}</p><div class="medal-targets">${c.medals.map((v,i)=>`<span class="medal-${i+1}">${MEDALS[i+1]}<b>${lowerIsBetter(c)?'≤ ':''}${formatChallengeValue(c,v)}</b></span>`).join('')}</div><div class="challenge-best">${record?.medal?MEDALS[record.medal]+' · Best '+formatChallengeValue(c,record.best??0):'UNCLAIMED'}${record?.attempts?' · '+record.attempts+' attempts':''}</div><button data-challenge="${c.id}">START CHALLENGE ↗</button></article>`;}).join('')}</div></section>`;
    ui.querySelector<HTMLButtonElement>('#profile-close')!.onclick=callbacks.close;
    ui.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter as Discipline;render();});
    ui.querySelectorAll<HTMLButtonElement>('[data-challenge]').forEach(b=>b.onclick=()=>callbacks.start(CHALLENGES.find(c=>c.id===b.dataset.challenge)!));
  };
  render();
}
