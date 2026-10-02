import test from 'node:test';
import assert from 'node:assert/strict';
import {ControllerInput,type ControllerCommand} from '../src/controller-input';
import {defaultControls,drivingInput,type Pad} from '../src/driving-controls';

const pad=(buttons:Record<number,number>={},axes:readonly number[]=[0,0],index=0,id='Standard test pad'):Pad=>({id,index,connected:true,axes,buttons:Array.from({length:20},(_,i)=>({value:buttons[i]??0,pressed:(buttons[i]??0)>=.5,touched:false}))});
const sample=(input:ControllerInput,p:Pad|undefined,time:number,context='menu')=>input.update(p,time,context);
const ready=()=>{const input=new ControllerInput();sample(input,pad(),0);return input;};

test('standard action buttons emit one edge each, with no action on initial held connection',()=>{
 const input=new ControllerInput(),held=pad({0:1,1:1,2:1,3:1,9:1});
 assert.deepEqual(sample(input,held,0).commands,[]);assert.deepEqual(sample(input,held,900).commands,[]);
 sample(input,pad(),901);
 assert.deepEqual(sample(input,held,902).commands,['accept','back','start','camera','recover']);
 assert.deepEqual(sample(input,held,5000).commands,[]);
 for(const [button,command]of [[0,'accept'],[1,'back'],[9,'start'],[2,'camera'],[3,'recover']] as const){
  sample(input,pad(),5001);assert.deepEqual(sample(input,pad({[button]:1}),5002).commands,[command]);
 }
});

test('navigation repeats after a delay, never bursts on a hitch and stops on release',()=>{
 const input=ready(),down=pad({13:1});
 assert.deepEqual(sample(input,down,10).commands,['down']);
 for(const time of [11,100,300,359])assert.deepEqual(sample(input,down,time).commands,[]);
 assert.deepEqual(sample(input,down,360).commands,['down']);assert.deepEqual(sample(input,down,479).commands,[]);
 assert.deepEqual(sample(input,down,480).commands,['down']);assert.deepEqual(sample(input,down,8000).commands,['down']);
 assert.deepEqual(sample(input,down,8001).commands,[]);assert.deepEqual(sample(input,pad(),9000).commands,[]);
 assert.deepEqual(sample(input,down,9001).commands,['down']);
});

test('stick drift stays neutral and hysteresis prevents threshold chatter',()=>{
 const input=ready();
 for(const [i,x]of [0,.1,-.2,.49,-.54].entries())assert.deepEqual(sample(input,pad({},[x,0]),i+1).commands,[]);
 assert.deepEqual(sample(input,pad({},[.6,0]),10).commands,['right']);
 for(const [i,x]of [.54,.4,.32,.5].entries())assert.deepEqual(sample(input,pad({},[x,0]),11+i).commands,[]);
 sample(input,pad({},[.2,0]),20);assert.deepEqual(sample(input,pad({},[.54,0]),21).commands,[]);
 assert.deepEqual(sample(input,pad({},[-.8,0]),22).commands,['left']);
});

test('diagonals choose one stable direction and D-pad opposites cancel rather than falling through to the stick',()=>{
 const input=ready();assert.deepEqual(sample(input,pad({},[.8,.8]),1).commands,['down']);
 for(let i=0;i<20;i++)assert.deepEqual(sample(input,pad({},[i%2?.82:.78,.8]),i+2).commands,[]);
 assert.deepEqual(sample(input,pad({},[1,.6]),30).commands,['right']);
 assert.deepEqual(sample(input,pad({12:1,13:1},[1,0]),31).commands,[]);
 assert.deepEqual(sample(input,pad({12:1,15:1}),32).commands,['up']);
 assert.deepEqual(sample(input,pad({12:1,15:1}),33).commands,[]);
});

test('context transitions suppress held commands and every held driving button until each releases',()=>{
 const input=ready(),p=pad({0:1,6:.4,7:1,10:.2,15:1},[.9,0]),before=JSON.stringify(p);
 sample(input,p,10);assert.equal(drivingInput(defaultControls(),new Set(),[input.drivingPad(p)],5).brake>0,true);
 assert.deepEqual(sample(input,p,11,'playing').commands,[]);
 const masked=input.drivingPad(p);
 for(const i of [0,6,7,10,15])assert.equal(masked.buttons[i].value,0,'including arbitrary remapped driving buttons');
 assert.equal(masked.axes,p.axes);assert.equal(JSON.stringify(p),before,'the hardware snapshot stays immutable');
 const driving=drivingInput(defaultControls(),new Set(),[masked],5);assert.equal(driving.throttle,0);assert.equal(driving.brake,0);assert.equal(driving.handbrake,false);
 assert.deepEqual(sample(input,p,1000,'playing').commands,[]);
 const partial=pad({6:.4,7:1,10:.2,15:1},[.9,0]);sample(input,partial,1001,'playing');
 const repress=pad({0:1,6:.4,7:1,10:.2,15:1},[.9,0]);assert.deepEqual(sample(input,repress,1002,'playing').commands,['accept']);
 assert.equal(input.drivingPad(repress).buttons[0].value,1);assert.equal(input.drivingPad(repress).buttons[7].value,0);
 sample(input,pad(),1003,'playing');assert.deepEqual(sample(input,pad({},[.9,0]),1004,'playing').commands,['right']);
 const gas=pad({7:.75});sample(input,gas,1005,'playing');assert.equal(input.drivingPad(gas),gas);assert.ok(drivingInput(defaultControls(),new Set(),[input.drivingPad(gas)],5).throttle>.7);
});

test('ordinary driving holds remain untouched within one context',()=>{
 const input=ready(),p=pad({7:.8,0:1},[-.7,0]),config=defaultControls();
 const expected=drivingInput(config,new Set(),[p],14);
 for(const time of [1,17,500,5000]){sample(input,p,time);assert.equal(input.drivingPad(p),p);assert.deepEqual(drivingInput(config,new Set(),[input.drivingPad(p)],14),expected);}
});

test('pad loss reports once; reconnect and selected slot or device replacement start neutral',()=>{
 const input=ready();sample(input,pad({0:1}),1);
 assert.equal(sample(input,undefined,2).disconnected,true);assert.equal(sample(input,undefined,3).disconnected,false);
 assert.deepEqual(sample(input,pad({0:1}),4),{commands:[],disconnected:false});assert.equal(input.drivingPad(pad({0:1})).buttons[0].value,0);
 sample(input,pad(),5);assert.deepEqual(sample(input,pad({0:1}),6).commands,['accept']);
 const second=pad({0:1,7:1},[0,0],1);assert.deepEqual(sample(input,second,7),{commands:[],disconnected:true});assert.equal(sample(input,second,8).disconnected,false);assert.equal(input.drivingPad(second).buttons[7].value,0);
 const replaced=pad({9:1},[0,0],1,'Different device');assert.deepEqual(sample(input,replaced,9),{commands:[],disconnected:true});
 assert.deepEqual(sample(input,{...replaced,connected:false},10),{commands:[],disconnected:true});assert.equal(sample(input,undefined,11).disconnected,false);
});

test('missing and nonfinite inputs are neutral, and pressed-only buttons still honor release gates',()=>{
 const input=ready(),empty={...pad(),axes:[],buttons:[]};assert.deepEqual(sample(input,empty,1).commands,[]);
 const bad=pad({0:NaN,1:Infinity},[NaN,Infinity]);assert.deepEqual(sample(input,bad,2).commands,[]);
 const pressed=pad();pressed.buttons[0].pressed=true;assert.deepEqual(sample(input,pressed,3).commands,['accept']);
 assert.deepEqual(sample(input,pressed,4,'pause').commands,[]);assert.equal(input.drivingPad(pressed).buttons[0].pressed,false);
 sample(input,empty,5,'pause');assert.deepEqual(sample(input,pressed,6,'pause').commands,['accept']);
 const unknown=pad({7:1},[0,0],3);assert.equal(input.drivingPad(unknown).buttons[7].value,0);
});

test('nonfinite or rewound clocks cannot generate a navigation burst',()=>{
 const input=ready(),p=pad({14:1});const observed:ControllerCommand[][]=[];
 for(const time of [10,NaN,Infinity,5,20,354,355,1e8,1e8])observed.push(sample(input,p,time).commands);
 assert.deepEqual(observed,[['left'],[],[],[],[],[],['left'],['left'],[]]);
});

test('masking preserves native-style Gamepad prototype accessors, not just plain test objects',()=>{
 const input=ready(),snapshot=pad({0:1,7:1},[1,0]);
 const prototype=Object.fromEntries([]);
 for(const key of ['id','index','connected','axes','buttons'] as const)Object.defineProperty(prototype,key,{get:()=>snapshot[key]});
 const native=Object.create(prototype) as Pad;assert.deepEqual(Object.keys(native),[]);
 sample(input,native,1);sample(input,native,2,'playing');
 const masked=input.drivingPad(native);
 assert.equal(masked.id,snapshot.id);assert.equal(masked.index,snapshot.index);assert.equal(masked.connected,true);assert.equal(masked.axes,snapshot.axes);
 assert.deepEqual(drivingInput(defaultControls(),new Set(),[masked],0),{throttle:0,brake:0,steer:1,handbrake:false});
 assert.equal(native.buttons[7].value,1);
});

test('neutral trigger noise releases a held pedal before its next press, including a remapped pedal',()=>{
 for(const {button,deadzone,noise}of [{button:7,deadzone:.05,noise:.01},{button:11,deadzone:.12,noise:.1}]){
  const input=new ControllerInput(),config={...defaultControls(),throttleButton:button,triggerDeadzone:deadzone};
  input.update(pad(),0,'menu',deadzone);input.update(pad({[button]:1}),1,'driving',deadzone);
  assert.equal(drivingInput(config,new Set(),[input.drivingPad(pad({[button]:1}))],0).throttle,0);
  const released=pad({[button]:noise});input.update(released,2,'driving',deadzone);
  assert.equal(drivingInput(config,new Set(),[input.drivingPad(released)],0).throttle,0,'the release value is genuinely neutral in the saved driving map');
  const pressed=pad({[button]:1});input.update(pressed,3,'driving',deadzone);
  assert.equal(drivingInput(config,new Set(),[input.drivingPad(pressed)],0).throttle,1,'the next press works without requiring an impossible exact zero');
 }
});

test('configured zero deadzone and pressed-only buttons cannot falsely release the transition gate',()=>{
 const input=new ControllerInput(),gas=pad({7:1}),config={...defaultControls(),triggerDeadzone:0};
 input.update(pad(),0,'menu',0);input.update(gas,1,'driving',0);
 input.update(pad({7:.01}),2,'driving',0);input.update(gas,3,'driving',0);
 assert.equal(drivingInput(config,new Set(),[input.drivingPad(gas)],0).throttle,0,'nonzero input is not neutral when the saved deadzone is zero');
 input.update(pad(),4,'driving',0);input.update(gas,5,'driving',0);assert.equal(drivingInput(config,new Set(),[input.drivingPad(gas)],0).throttle,1);
 const pressed=pad();pressed.buttons[0].pressed=true;input.update(pressed,6,'paused',.4);
 assert.deepEqual(input.update(pressed,7,'paused',.4).commands,[]);assert.equal(input.drivingPad(pressed).buttons[0].pressed,false);
 input.update(pad(),8,'paused',.4);assert.deepEqual(input.update(pressed,9,'paused',.4).commands,['accept']);
});

test('release thresholds are bounded like saved controls and a value above the configured neutral range stays masked',()=>{
 for(const {threshold,neutral,above}of [
  {threshold:.2,neutral:.2,above:.201},{threshold:-1,neutral:0,above:.001},{threshold:99,neutral:.4,above:.401},
  ...[NaN,Infinity,-Infinity,'bad'].map(threshold=>({threshold,neutral:.05,above:.051})),
 ]){
  const input=new ControllerInput(),gas=pad({7:1}),update=(p:Pad,t:number,context='driving')=>input.update(p,t,context,threshold as number);
  update(pad(),0,'menu');update(gas,1);update(pad({7:above}),2);update(gas,3);
  assert.equal(input.drivingPad(gas).buttons[7].value,0,'input above the bounded neutral range remains held');
  update(pad({7:neutral}),4);update(gas,5);assert.equal(input.drivingPad(gas).buttons[7].value,1,'a bounded neutral value releases the pedal');
 }
});
