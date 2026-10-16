import test from 'node:test';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {defaultControls,readControls,CONTROLS_KEY} from '../src/driving-controls';
import {SAVE_KEYS,readSave,restoreSave,exportSave} from '../src/save-backup';
const canonical=(v:any):string=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
function signed(controls:any){const entries=Object.fromEntries(SAVE_KEYS.map(k=>[k,k===CONTROLS_KEY?canonical(controls):null]));const body={format:'quarry-impact-save',version:1,created:'2026-10-08T00:00:00.000Z',entries};return JSON.stringify({...body,checksum:createHash('sha256').update(canonical(body)).digest('hex')});}
function older(revision?:number){const c:any=defaultControls();if(revision===undefined)delete c.keyboardDefaults;else c.keyboardDefaults=revision;c.keys.left=['KeyA','ArrowLeft'];c.keys.right=['KeyD','ArrowRight'];c.deadzone=.3;c.rumble=0;return c;}
test('signed older default maps preserve checksum bytes, then migrate after restore',async()=>{
 for(const revision of [undefined,...Array.from({length:defaultControls().keyboardDefaults!-1},(_,i)=>i+1)]){
  const c=older(revision),backup=await readSave(signed(c));assert.equal(backup.entries[CONTROLS_KEY],canonical(c));
  const data=new Map<string,string>(),store={getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v);},removeItem:(k:string)=>{data.delete(k);}};
  await restoreSave(store,backup);const loaded=readControls(store.getItem(CONTROLS_KEY));assert.deepEqual(loaded.keys.left,['KeyD','ArrowRight']);assert.deepEqual(loaded.keys.right,['KeyA','ArrowLeft']);assert.equal(loaded.deadzone,.3);assert.equal(loaded.rumble,0);
  await readSave(await exportSave(store));
 }
});
test('historical custom keys and current intentional standard steering survive',async()=>{
 const custom=older(4);custom.keys.left=['KeyJ'];custom.keys.right=['KeyL'];
 for(const c of [custom,older(defaultControls().keyboardDefaults)]){const backup=await readSave(signed(c));assert.deepEqual(readControls(backup.entries[CONTROLS_KEY]).keys,c.keys);}
});
test('legacy migration cannot conceal invalid keys, values or unknown revisions',async()=>{
 for(const edit of [(c:any)=>c.keys.left=['KeyW'],(c:any)=>c.keys.left=['KeyC'],(c:any)=>c.keys.right=[],(c:any)=>c.deadzone=2,(c:any)=>c.keyboardDefaults=0,(c:any)=>c.keyboardDefaults=defaultControls().keyboardDefaults!+1,(c:any)=>c.keyboardDefaults='4',(c:any)=>c.extra=true]){const c=older(4);edit(c);await assert.rejects(readSave(signed(c)));}
 const changed=JSON.parse(signed(older(4)));changed.entries[CONTROLS_KEY]=canonical(older(3));await assert.rejects(readSave(JSON.stringify(changed)),/checksum/);
});
