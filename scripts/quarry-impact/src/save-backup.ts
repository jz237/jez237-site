import {PROFILE_KEY,readProfile} from './progression';
import {GARAGE_KEY,readGarage} from './garage';
import {CONTROLS_KEY,readControls} from './driving-controls';
import {CLUB_CUP_KEY,readClubCup} from './club-cup';
import {CLUB_RECORDS_KEY,readClubRecords} from './club-records';
import {TIME_TRIAL_KEY,readTimeTrialRecords} from './time-trial';
import {TRIAL_GHOST_KEY,readGhostLibrary} from './trial-ghost';
import {EVENT_KEY,readEventOptions} from './event-rules';
import {DEMO_KEY,readDemoOptions} from './demo-session';
export const BACKUP_LIMIT=6_000_000,BACKUP_JOURNAL='quarry-impact-restore-v1';
export const SAVE_KEYS=['quarry-impact-v1',PROFILE_KEY,GARAGE_KEY,CONTROLS_KEY,CLUB_CUP_KEY,CLUB_RECORDS_KEY,TIME_TRIAL_KEY,TRIAL_GHOST_KEY,EVENT_KEY,DEMO_KEY,'quarry-driver'] as const;
export type SaveEntries=Record<typeof SAVE_KEYS[number],string|null>;
type Store=Pick<Storage,'getItem'|'setItem'|'removeItem'>;
export type SaveBackup={format:'quarry-impact-save';version:1;created:string;entries:SaveEntries;checksum:string};
const object=(v:unknown):v is Record<string,any>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const canonical=(v:any):string=>JSON.stringify(v,(_,x)=>object(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const readers:Record<string,(v:string)=>unknown>={[PROFILE_KEY]:readProfile,[GARAGE_KEY]:readGarage,[CONTROLS_KEY]:readControls,[CLUB_CUP_KEY]:readClubCup,[CLUB_RECORDS_KEY]:readClubRecords,[TIME_TRIAL_KEY]:readTimeTrialRecords,[TRIAL_GHOST_KEY]:readGhostLibrary,[EVENT_KEY]:readEventOptions,[DEMO_KEY]:readDemoOptions};
function normalize(key:string,text:string):string{
 if(key==='quarry-driver')return text.replace(/[\u0000-\u001f\u007f]/g,'').slice(0,24);
 let raw:unknown;try{raw=JSON.parse(text);}catch{throw Error(`Unreadable saved data: ${key}`);}
 if(!object(raw))throw Error(`Invalid saved data: ${key}`);
 if(key==='quarry-impact-v1'){
  const out:Record<string,unknown>={};
  if(raw.quality!==undefined){if(!['auto','ultra','high','medium'].includes(raw.quality))throw Error('Invalid graphics setting.');out.quality=raw.quality;}
  if(raw.performance!==undefined){if(typeof raw.performance!=='boolean')throw Error('Invalid performance setting.');out.performance=raw.performance;}
  for(const k of ['engine','effects','ambience'])if(raw[k]!==undefined){if(typeof raw[k]!=='number'||!Number.isFinite(raw[k])||raw[k]<0||raw[k]>1)throw Error('Invalid sound setting.');out[k]=raw[k];}
  if(raw.best!==undefined){if(!object(raw.best)||Object.keys(raw.best).length>10000||Object.entries(raw.best).some(([k,v])=>k.length>200||!/^[-\w:.]+$/.test(k)||typeof v!=='number'||!Number.isFinite(v)||v<0))throw Error('Invalid event records.');out.best=raw.best;}
  return canonical(out);
 }
 if(raw.version!==1)throw Error(`Unsupported saved-data version: ${key}`);
 const value=readers[key](text);if(value===null)throw Error('The championship save is invalid.');
 // Preserve the canonical bytes of controls exported before vibration existed.
 // readControls supplies the default after import; old signed backups stay valid.
 if(key===CONTROLS_KEY&&!Object.hasOwn(raw,'rumble'))delete(value as {rumble?:number}).rumble;
 if(key===CONTROLS_KEY){const controls=value as Record<string,any>;for(const key of ['transmission','shiftUpButton','shiftDownButton','clutchButton'])if(!Object.hasOwn(raw,key))delete controls[key];for(const key of ['shiftUp','shiftDown','clutch'])if(!Object.hasOwn(raw.keys??{},key))delete controls.keys[key];}
 // Keep older signed garage backups canonical; readGarage adds new stock cars on load.
 if(key===GARAGE_KEY&&!Object.hasOwn(raw.cars??{},'shuttle'))delete(value as {cars:Record<string,unknown>}).cars.shuttle;
 if(key===GARAGE_KEY&&!Object.hasOwn(raw.cars??{},'regent'))delete(value as {cars:Record<string,unknown>}).cars.regent;
 return canonical(value);
}
function entries(value:unknown):SaveEntries{
 if(!object(value)||Object.keys(value).length!==SAVE_KEYS.length||SAVE_KEYS.some(k=>!Object.hasOwn(value,k)||value[k]!==null&&typeof value[k]!=='string'))throw Error('The backup has missing or unknown save sections.');
 return value as SaveEntries;
}
export function captureSave(storage:Pick<Storage,'getItem'>):SaveEntries{return Object.fromEntries(SAVE_KEYS.map(k=>[k,storage.getItem(k)])) as SaveEntries;}
async function checksum(value:unknown){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(canonical(value)))),b=>b.toString(16).padStart(2,'0')).join('');}
export async function exportSave(storage:Pick<Storage,'getItem'>,created=new Date().toISOString()):Promise<string>{
 const source=captureSave(storage),data=Object.fromEntries(SAVE_KEYS.map(k=>[k,source[k]===null?null:normalize(k,source[k]!)])) as SaveEntries;
 const body={format:'quarry-impact-save' as const,version:1 as const,created,entries:data};const text=JSON.stringify({...body,checksum:await checksum(body)});
 if(new TextEncoder().encode(text).length>BACKUP_LIMIT)throw Error('This save exceeds the 6 MB backup limit.');return text;
}
export async function readSave(text:string):Promise<SaveBackup>{
 if(new TextEncoder().encode(text).length>BACKUP_LIMIT)throw Error('This backup exceeds the 6 MB limit.');
 let v:any;try{v=JSON.parse(text);}catch{throw Error('Choose a valid Quarry save backup (.qis).');}
 if(!object(v)||v.format!=='quarry-impact-save'||v.version!==1||Object.keys(v).sort().join()!=='checksum,created,entries,format,version'||typeof v.created!=='string'||!Number.isFinite(Date.parse(v.created))||typeof v.checksum!=='string')throw Error('Unsupported or incomplete save backup.');
 const data=entries(v.entries);if(await checksum({format:v.format,version:v.version,created:v.created,entries:data})!==v.checksum)throw Error('The backup checksum does not match. The file may be damaged.');
 for(const k of SAVE_KEYS)if(data[k]!==null&&normalize(k,data[k]!)!==data[k])throw Error(`Invalid or unsupported save section: ${k}`);
 return v as SaveBackup;
}
export function backupSummary(data:SaveEntries){
 const p=readProfile(data[PROFILE_KEY]),g=readGarage(data[GARAGE_KEY]),cup=readClubCup(data[CLUB_CUP_KEY]);
 return {events:p.events,medals:Object.values(p.challenges).filter(r=>r.medal>0).length,unlocks:p.career?.unlocked.length??0,presets:Object.values(g.cars).reduce((n,c)=>n+c.presets.length,0),bests:Object.keys(readTimeTrialRecords(data[TIME_TRIAL_KEY]).bests).length,ghosts:readGhostLibrary(data[TRIAL_GHOST_KEY]).ghosts.length,cup:cup?`${cup.results.length} rounds completed`:'No saved championship'};
}
function write(storage:Store,data:SaveEntries){
 // Remove only the game's allowlisted keys to make room; the journal remains
 // until every write succeeds, including across a crash or closed tab.
 for(const k of SAVE_KEYS)storage.removeItem(k);
 for(const k of SAVE_KEYS)if(data[k]!==null)storage.setItem(k,data[k]!);
}
export function recoverSaveImport(storage:Store):boolean{
 const raw=storage.getItem(BACKUP_JOURNAL);if(raw===null)return false;
 let journal:any;try{journal=JSON.parse(raw);}catch{throw Error('The save recovery record is unreadable.');}
 if(!object(journal)||journal.version!==1||raw.length>BACKUP_LIMIT)throw Error('The save recovery record is invalid.');
 write(storage,entries(journal.entries));storage.removeItem(BACKUP_JOURNAL);return true;
}
/** Call from the main-menu settings only. Reload after success so all systems
 * load one coherent save, rather than combining old memory with imported data. */
export async function restoreSave(storage:Store,backup:SaveBackup):Promise<void>{
 const validated=await readSave(JSON.stringify(backup));
 if(storage.getItem(BACKUP_JOURNAL)!==null)throw Error('A previous restore needs recovery. Reload the game first.');
 const journal=JSON.stringify({version:1,entries:captureSave(storage)});
 if(journal.length>BACKUP_LIMIT)throw Error('Not enough room for a safe recovery record. Export your current save first.');
 // If this allocation fails, no existing data has been touched.
 storage.setItem(BACKUP_JOURNAL,journal);
 try{write(storage,validated.entries);storage.removeItem(BACKUP_JOURNAL);}
 catch(error){try{recoverSaveImport(storage);}catch{throw Error('RESTORE_RECOVERY_REQUIRED');}throw Error('Restore failed. Your previous save was recovered. '+(error instanceof Error?error.message:''));}
}
