// The journal: what the player has actually caught, summarised per species into the card the
// Species Gallery shows. Knowledge starts as hearsay (the species' own diel curve, what the guide
// would tell you) and firms up from your catches: the bite clock fills with your hours, "what it
// took" lists your lures and techniques, bests are kept per size class. Pure, node-testable.
import {SPECIES,activityByHour} from './species.js';
import {hourOfDay} from './game-clock.js';
import {LURES} from './tackle.js';
export const CLASS_LABEL={young:'Young',common:'Common',trophy:'Trophy',legend:'Legend'};
export function catchHour(c){if(typeof c.hour==='number')return c.hour;if(typeof c.at==='number')return hourOfDay(c.at);return null;}
// the guide's hearsay: the species' activity by hour, sampled at the middle of each hour
export function hearsayClock(sp,sunrise=6.5,sunset=19.5){const out=[];for(let h=0;h<24;h++)out.push(activityByHour(h+.5,sp.diel,sunrise,sunset));return out;}
export function lureName(id){return (LURES[id]&&LURES[id].name)||id;}
export function summarizeSpecies(journal,id){
 const catches=(journal&&journal.catches||[]).filter(c=>c.species===id);
 const hours=new Array(24).fill(0),took={},techs={},classes={young:0,common:0,trophy:0,legend:0},bestByClass={};let best=null;
 for(const c of catches){const h=catchHour(c);if(h!==null)hours[Math.floor(((h%24)+24)%24)]++;
  if(c.lure)took[c.lure]=(took[c.lure]||0)+1;if(c.technique)techs[c.technique]=(techs[c.technique]||0)+1;
  const cls=c.sizeClass||'common';classes[cls]=(classes[cls]||0)+1;const L=c.lengthIn||0;
  if(!best||L>(best.lengthIn||0))best=c;if(!bestByClass[cls]||L>(bestByClass[cls].lengthIn||0))bestByClass[cls]=c;}
 const top=o=>Object.entries(o).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([key,n])=>({key,n}));
 const maxH=Math.max(...hours);const peakHour=maxH>0?hours.indexOf(maxH):null;
 return {id,count:catches.length,best,bestByClass,classes,hours,peakHour,lures:top(took),techniques:top(techs),firm:catches.length>=3};
}
export function journalOverview(journal){
 const catches=journal&&journal.catches||[];const species=new Set(catches.map(c=>c.species));let best=null;
 for(const c of catches)if(!best||(c.weightLb||0)>(best.weightLb||0))best=c;
 return {count:catches.length,species:species.size,best};
}
export function weightText(lb){return lb?`${Math.floor(lb)} lb ${Math.round((lb%1)*16)} oz`:'';}
export function bestText(c){if(!c)return null;const sp=SPECIES[c.species];return `${c.lengthIn} in ${sp?sp.name.toLowerCase():c.species}${c.weightLb?' · '+weightText(c.weightLb):''}`;}
export function hourLabel(h){const x=((h%24)+24)%24;const ap=x<12?'AM':'PM';const hh=x%12===0?12:x%12;return `${hh} ${ap}`;}
// one line for the menu
export function journalLine(journal){const o=journalOverview(journal);if(!o.count)return 'Journal: empty. The first fish writes the first page.';return `Journal: ${o.count} fish, ${o.species} species · best a ${bestText(o.best)}`;}
