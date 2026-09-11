import {COURSES} from './courses.js';
const KEY='after-the-storm-racing-v1';
export const initialSave=()=>({version:1,dolphin:false,records:{},scores:{},settings:{},names:[],unlocked:0,reached:['greyhaven','practice'],audio:{mode:'stereo',music:false,volume:.8,enabled:true},preferences:{graphics:'auto',laps:3,seaState:'surf'}});
export const MAX_SAVE_BYTES=2000000;
const layoutSuffix=({course,layoutRevision})=>{const revision=layoutRevision??COURSES.find(c=>c.id===course)?.layoutRevision??0;return revision?'/layout-'+revision:'';};
export const recordKey=(entry)=>`${entry.course}/${entry.difficulty??0}/${entry.laps??3}${layoutSuffix(entry)}`;
export const scoreKey=(entry)=>`${entry.course}/${entry.difficulty??0}${layoutSuffix(entry)}`;
export function cleanInitials(value){return String(value).toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,3)||'YOU';}
export function readSave(storage){try{return validateSave(JSON.parse(storage.getItem(KEY)));}catch{return initialSave();}}
export function writeSave(storage,save){try{storage.setItem(KEY,JSON.stringify(save));return true;}catch{return false;}}
export function addRecord(save,entry){if(!Number.isFinite(entry.time)||entry.time<=0||!Number.isFinite(entry.bestLap)||entry.bestLap<=0||entry.bestLap>entry.time)throw new Error('Invalid race time');const key=recordKey(entry),current=save.records[key]||{times:[],lap:null};const row={initials:cleanInitials(entry.initials),time:entry.time,bestLap:entry.bestLap,rider:entry.rider,custom:!!entry.custom};const times=[...current.times,row].sort((a,b)=>a.time-b.time).slice(0,3),lap=!current.lap||row.bestLap<current.lap.bestLap?row:current.lap;save.records[key]={times,lap};return {rank:times.indexOf(row)+1,bestLap:lap===row};}

export function addScore(save,entry){if(!Number.isFinite(entry.score)||entry.score<0)throw new Error('Invalid stunt score');save.scores??={};const key=scoreKey(entry),row={initials:cleanInitials(entry.initials),score:Math.floor(entry.score),rider:entry.rider};const rows=[...(save.scores[key]||[]),row].sort((a,b)=>b.score-a.score).slice(0,3);save.scores[key]=rows;return {rank:rows.indexOf(row)+1};}

const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const fail=message=>{throw new Error(message);};
const number=(v,min,max)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
const integer=(v,min,max)=>number(v,min,max)&&Number.isInteger(v);
const courseIds=new Set(COURSES.map(c=>c.id));
export function cleanName(name){return String(name).replace(/[\u0000-\u001f\u007f<>]/g,'').trim().slice(0,20);}
function tuning(value){if(!object(value))fail('Invalid rider tuning.');const result={};for(const key of ['engine','grip','handling']){if(!number(value[key]??0,-1,1))fail('Tuning must be between -1 and 1.');if(value[key]!==undefined)result[key]=value[key];}return result;}
function timeRow(r){if(!object(r)||!integer(r.rider,0,3)||!number(r.time,.001,86400)||!number(r.bestLap,.001,r.time)||typeof r.initials!=='string')fail('Invalid time record.');return {initials:cleanInitials(r.initials),time:r.time,bestLap:r.bestLap,rider:r.rider,custom:!!r.custom};}
function recordParts(key,count){const p=key.split('/');if((p.length!==count&&!(p.length===count+1&&/^layout-[1-9][0-9]{0,2}$/.test(p[count])))||!courseIds.has(p[0])||!['0','1','2','3'].includes(p[1])||(count===3&&!['3','4','5','6','9'].includes(p[2])))fail('Unknown course record.');return p;}
// Import reconstructs a bounded, known schema. No imported object is assigned
// into live state before all nested records and settings have been validated.
export function validateSave(value){
 if(!object(value)||value.version!==1||!object(value.records))fail('This is not a supported After the Storm save.');
 const out=initialSave();if(value.dolphin!==undefined&&typeof value.dolphin!=='boolean')fail('Invalid park bonus.');out.dolphin=!!value.dolphin;if(!integer(value.unlocked??0,0,3))fail('Invalid championship unlock.');out.unlocked=value.unlocked??0;
 if(value.reached!==undefined){if(!Array.isArray(value.reached)||value.reached.length>9||value.reached.some(id=>!courseIds.has(id)))fail('Invalid reached courses.');out.reached=[...new Set(['greyhaven','practice',...value.reached])];}
 if(Object.keys(value.records).length>1800)fail('Too many course records.');
 for(const [key,entry] of Object.entries(value.records)){recordParts(key,3);if(!object(entry)||!Array.isArray(entry.times)||entry.times.length>3)fail('Invalid leaderboard.');out.records[key]={times:entry.times.map(timeRow).sort((a,b)=>a.time-b.time),lap:entry.lap?timeRow(entry.lap):null};if(out.records[key].times.length&&!out.records[key].lap)fail('Missing best lap.');}
 if(value.scores!==undefined){if(!object(value.scores)||Object.keys(value.scores).length>360)fail('Invalid score table.');for(const [key,rows] of Object.entries(value.scores)){recordParts(key,2);if(!Array.isArray(rows)||rows.length>3)fail('Invalid score list.');out.scores[key]=rows.map(r=>{if(!object(r)||!integer(r.rider,0,3)||!integer(r.score,0,1e8)||typeof r.initials!=='string')fail('Invalid stunt score.');return {initials:cleanInitials(r.initials),score:r.score,rider:r.rider};}).sort((a,b)=>b.score-a.score);}}
 if(value.settings!==undefined){if(!object(value.settings))fail('Invalid settings.');for(const [id,tune] of Object.entries(value.settings)){if(!['0','1','2','3'].includes(id))fail('Unknown rider.');out.settings[id]=tuning(tune);}}
 if(value.names!==undefined){if(!Array.isArray(value.names)||value.names.length>4||value.names.some(n=>typeof n!=='string'))fail('Invalid rider names.');out.names=value.names.map(cleanName);}
 if(value.versus!==undefined){const v=value.versus;if(!object(v)||!integer(v.rider,0,3))fail('Invalid second player.');out.versus={rider:v.rider,tune:tuning(v.tune??{}),handicap:!!v.handicap};if(v.swapColours!==undefined){if(typeof v.swapColours!=='boolean')fail('Invalid colour choice.');out.versus.swapColours=v.swapColours;}}
 if(value.audio!==undefined){const a=value.audio;if(!object(a)||!['stereo','mono','headphones'].includes(a.mode)||!number(a.volume,0,1)||typeof a.music!=='boolean'||typeof a.enabled!=='boolean')fail('Invalid audio options.');out.audio={mode:a.mode,music:a.music,volume:a.volume,enabled:a.enabled};}
 if(value.preferences!==undefined){const p=value.preferences;if(!object(p)||!['auto','high','medium','low'].includes(p.graphics)||![3,4,5,6,9].includes(p.laps)||!['surf','course','calm','chop','storm'].includes(p.seaState))fail('Invalid display or sea preferences.');out.preferences={graphics:p.graphics,laps:p.laps,seaState:p.seaState};}
 return out;
}
export function exportSave(save){return JSON.stringify({format:'after-the-storm-save',version:1,data:validateSave(save)},null,2);}
export function importSave(text){if(typeof text!=='string'||text.length>MAX_SAVE_BYTES)fail('Save file is too large.');let envelope;try{envelope=JSON.parse(text);}catch{fail('Invalid JSON. Choose an exported save file.');}if(envelope?.format!=='after-the-storm-save'||envelope.version!==1)fail('This file is not an After the Storm export.');return validateSave(envelope.data);}
export function replaceSave(target,candidate,storage){const clean=validateSave(candidate);if(!writeSave(storage,clean))fail('Browser storage is unavailable. Existing progress was kept.');for(const key of Object.keys(target))delete target[key];Object.assign(target,clean);}
export function eraseRecords(save,{course,difficulty=0,laps=3,kind='time',layoutRevision}){if(!courseIds.has(course))fail('Unknown course.');const bucket=kind==='score'?save.scores:save.records,key=kind==='score'?scoreKey({course,difficulty,layoutRevision}):recordKey({course,difficulty,laps,layoutRevision});const previous=bucket[key];delete bucket[key];return {kind,key,previous:previous?structuredClone(previous):null};}
export function restoreRecords(save,undo){const scores=undo.kind==='score',bucket=scores?save.scores:save.records;if(!undo.previous)return;const previous=structuredClone(undo.previous),current=bucket[undo.key];if(!current){bucket[undo.key]=previous;return;}const unique=rows=>[...new Map(rows.map(r=>[JSON.stringify(r),r])).values()];if(scores)bucket[undo.key]=unique([...current,...previous]).sort((a,b)=>b.score-a.score).slice(0,3);else bucket[undo.key]={times:unique([...current.times,...previous.times]).sort((a,b)=>a.time-b.time).slice(0,3),lap:!current.lap||previous.lap.bestLap<current.lap.bestLap?previous.lap:current.lap};}
