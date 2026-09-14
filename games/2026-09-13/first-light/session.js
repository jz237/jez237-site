// First Light sessions: twenty real minutes on the cove at 4x, a dawn or a dusk or a night, on a
// daily seed so every player fishes the same lake with the same weather and the same target
// species, and a score that is comparable across players. Pure, node-testable; main.js runs it.
import {ROSTER,SPECIES,activityByHour} from './species.js';
import {localParts} from './game-clock.js';
export const SESSION_SECONDS=20*60;
export const VARIANTS={
 dawn:{id:'dawn',label:'Dawn session',startHour:6.1,rate:4,weatherPool:['calm','breeze','overcast'],blurb:'Twenty minutes from first light. The same lake, weather and target for everyone today.'},
 dusk:{id:'dusk',label:'Dusk session',startHour:18.1,rate:4,weatherPool:['calm','breeze','overcast','rain'],blurb:'Twenty minutes into the evening bite, the light going the whole time.'},
 night:{id:'night',label:'Night cats',startHour:21.4,rate:4,weatherPool:['calm','overcast'],blurb:'Twenty minutes in the dark. Bait on the bottom, rod in the holder, and listen.'}
};
export function dailyKey(ms,tz){const p=localParts(ms,tz);return `${p.year}${String(p.month).padStart(2,'0')}${String(p.day).padStart(2,'0')}`;}
export function seedFrom(key,variant){let h=2166136261;for(const ch of key+':'+variant){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}return h||1;}
function rng(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
// the target: a species that is actually up at that hour, weighted by how many live in the cove
export function pickTarget(seed,variant){
 const v=VARIANTS[variant]||VARIANTS.dawn;const r=rng(seed);const hour=v.startHour+1;
 const cands=ROSTER.map(id=>{const sp=SPECIES[id];let w=(sp.count||4)*activityByHour(hour,sp.diel,6.5,19.5);if(id==='carp')w*=.25;if(variant==='night'&&(id==='catfish'||id==='walleye'))w*=3;return {id,w};}).filter(c=>c.w>.05);
 const total=cands.reduce((s,c)=>s+c.w,0);let x=r()*total;for(const c of cands){x-=c.w;if(x<=0)return c.id;}return cands[cands.length-1].id;
}
export function pickWeather(seed,variant){const v=VARIANTS[variant]||VARIANTS.dawn;const r=rng(seed^0x9e3779b9);return v.weatherPool[Math.floor(r()*v.weatherPool.length)];}
export function createSession({variant='dawn',key='00000000',seed=null}={}){
 const s=seed||seedFrom(key,variant);const v=VARIANTS[variant]||VARIANTS.dawn;
 return {variant:v.id,key,seed:s,target:pickTarget(s,variant),weather:pickWeather(s,variant),startHour:v.startHour,rate:v.rate,elapsed:0,over:false,closed:false,score:0,landed:[],casts:0,best:null,bestTarget:null,submitted:false};
}
// points: length in inches, tripled for the target, a quarter more for a trophy target
export function scoreCatch(session,c){const isTarget=c.species===session.target;let pts=Math.round((c.lengthIn||0)*(isTarget?3:1));if(isTarget&&(c.sizeClass==='trophy'||c.sizeClass==='legend'))pts=Math.round(pts*1.25);return pts;}
export function recordCatch(session,c){if(session.closed)return 0;const pts=scoreCatch(session,c);session.score+=pts;session.landed.push({...c,pts});if(!session.best||c.lengthIn>session.best.lengthIn)session.best=c;if(c.species===session.target&&(!session.bestTarget||c.lengthIn>session.bestTarget.lengthIn))session.bestTarget=c;return pts;}
export function tick(session,dt){if(session.over)return false;session.elapsed+=dt;if(session.elapsed>=SESSION_SECONDS){session.elapsed=SESSION_SECONDS;session.over=true;return true;}return false;}
export function closeSession(session){session.over=true;session.closed=true;return session;}
export function remaining(session){return Math.max(0,SESSION_SECONDS-session.elapsed);}
export function formatRemaining(s){const m=Math.floor(s/60),ss=Math.floor(s%60);return `${m}:${String(ss).padStart(2,'0')}`;}
export function boardNamespace(session){return `first-light-${session.variant}-${session.key}`;}
export function targetName(session){return SPECIES[session.target]?SPECIES[session.target].name:session.target;}
// fish names are mostly their own plurals; only the sunfish take an s
export function plural(name,n){if(n===1)return name;return /bluegill|pumpkinseed/.test(name)?name+'s':name;}
export function summary(session){
 const n=session.landed.length,t=session.landed.filter(c=>c.species===session.target).length;
 const best=session.bestTarget?`best ${targetName(session).toLowerCase()} ${session.bestTarget.lengthIn} in`:session.best?`best a ${session.best.lengthIn} in ${(SPECIES[session.best.species]||{name:session.best.species}).name.toLowerCase()}`:'nothing landed';
 return `${session.score} points · ${n} landed, ${t} ${plural(targetName(session).toLowerCase(),t)} · ${best} · ${session.casts} casts`;
}
export function initialsOf(s){return String(s||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,3);}
