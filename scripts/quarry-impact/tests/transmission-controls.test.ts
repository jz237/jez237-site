import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultControls,readControls,drivingInput,drivingButtons,type Pad} from '../src/driving-controls';
import {CONTROLS_KEY} from '../src/driving-controls';
import {exportSave,readSave,restoreSave,SAVE_KEYS} from '../src/save-backup';
import {ControllerInput} from '../src/controller-input';
const pad=(buttons:Record<number,number>):Pad=>({index:0,id:'Test pad',connected:true,axes:[0],buttons:Array.from({length:16},(_,i)=>({value:buttons[i]??0,pressed:(buttons[i]??0)>.5,touched:false}))});
test('old custom keys and conflicting gamepad buttons migrate without discarding the driving map',()=>{
 const old:any=defaultControls();old.keys.throttle=['KeyE'];old.keys.reverse=['KeyQ'];old.keys.handbrake=['ShiftLeft'];for(const key of ['shiftUp','shiftDown','clutch'])delete old.keys[key];for(const key of ['transmission','shiftUpButton','shiftDownButton','clutchButton'])delete old[key];old.handbrakeButton=5;
 const c=readControls(JSON.stringify(old));assert.deepEqual(c.keys.throttle,['KeyE']);assert.deepEqual(c.keys.reverse,['KeyQ']);assert.deepEqual(c.keys.handbrake,['ShiftLeft']);assert.equal(c.handbrakeButton,5);assert.equal(c.transmission,'automatic');
 const keys=Object.values(c.keys).flat();assert.equal(keys.length,new Set(keys).size);const buttons=[c.throttleButton,c.brakeButton,c.handbrakeButton,c.shiftUpButton,c.shiftDownButton,c.clutchButton];assert.equal(new Set(buttons).size,6);assert.deepEqual(readControls(JSON.stringify(c)),c);
});
test('manual pedals stay separate, rebound shift/clutch input works, and legacy authorities receive automatic controls',()=>{
 const c=defaultControls();c.transmission='clutch';c.keys.shiftUp=['KeyU'];c.keys.shiftDown=['KeyJ'];c.keys.clutch=['KeyK'];
 const input=drivingInput(c,new Set(['KeyW','KeyS','KeyU','KeyK']),[],0);assert.equal(input.throttle,0);assert.equal(input.brake,1);assert.deepEqual(input.transmission,{mode:'clutch',up:true,down:false,clutch:1});
 const old=drivingInput(c,new Set(['KeyS','KeyU']),[],0,false);assert.equal(old.transmission,undefined);assert.equal(old.throttle,-.6);assert.equal(old.brake,0);
 assert.ok(drivingButtons(c).includes(c.clutchButton));assert.ok(!drivingButtons(c,false).includes(c.clutchButton));c.transmission='manual';assert.ok(!drivingButtons(c).includes(c.clutchButton));
});
test('gamepad shift/clutch cannot leak from a menu or reconnect until released',()=>{
 const c=defaultControls();c.transmission='clutch';const input=new ControllerInput(),pressed=pad({5:1,1:1});input.update(pressed,0,'settings');input.update(pressed,10,'driving');
 let drive=drivingInput(c,new Set(),[input.drivingPad(pressed)],0);assert.equal(drive.transmission!.up,false);assert.equal(drive.transmission!.clutch,0);
 input.update(pad({}),20,'driving');input.update(pressed,30,'driving');drive=drivingInput(c,new Set(),[input.drivingPad(pressed)],0);assert.equal(drive.transmission!.up,true);assert.equal(drive.transmission!.clutch,1);
 input.update(undefined,40,'driving');input.update(pressed,50,'driving');assert.equal(drivingInput(c,new Set(),[input.drivingPad(pressed)],0).transmission!.up,false);
});
test('old and new portable save files retain controls and checksums through restore',async()=>{
 for(const legacy of [true,false]){
  const controls:any=defaultControls();controls.transmission='clutch';controls.keys.shiftUp=['KeyU'];if(legacy){for(const key of ['shiftUp','shiftDown','clutch'])delete controls.keys[key];for(const key of ['transmission','shiftUpButton','shiftDownButton','clutchButton'])delete controls[key];controls.keys.throttle=['KeyE'];}
  const data=new Map<string,string>([[CONTROLS_KEY,JSON.stringify(controls)]]),storage={getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v);},removeItem:(k:string)=>{data.delete(k);}};
  const exported=await exportSave(storage),loaded=await readSave(exported);for(const key of SAVE_KEYS)data.delete(key);await restoreSave(storage,loaded);const read=readControls(storage.getItem(CONTROLS_KEY));assert.equal(read.transmission,legacy?'automatic':'clutch');assert.deepEqual(read.keys.throttle,legacy?['KeyE']:['KeyW','ArrowUp']);
 }
});
