// A ghost contains measured hull poses, not inputs. Playback has no connection
// to physics, buoy adjudication, collision, records, or championship progress.
export const GHOST_VERSION=1;
// Keep old custom-sea recordings importable without racing them against the
// new depth-limited troughs. Original venue-water ghosts remain compatible.
export const ghostWaterRevision=seaState=>seaState==='course'?0:1;
export const GHOST_SAMPLE_HZ=20;
export const MAX_GHOST_SECONDS=1200;
export const MAX_GHOST_SAMPLES=MAX_GHOST_SECONDS*GHOST_SAMPLE_HZ+2;
export const MAX_GHOST_BYTES=524288;
const FORMAT='after-the-storm-ghost',WIDTH=9,MAX_GAP=.25,TAU=Math.PI*2;
const SEA_STATES=new Set(['course','surf','calm','chop','storm']);
const scales=[1000,100,100,100,10000,10000,10000,100,10000];
const limits=[MAX_GHOST_SECONDS,100000,100000,100000,Math.PI,Math.PI,Math.PI,200,10];
const decoded=new WeakMap(),canonical=new WeakSet();
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const number=(value,min,max)=>typeof value==='number'&&Number.isFinite(value)&&value>=min&&value<=max;
const integer=(value,min,max)=>number(value,min,max)&&Number.isInteger(value);
const fail=message=>{throw new Error(message);};
const angle=value=>Math.atan2(Math.sin(value),Math.cos(value));
const mix=(a,b,t)=>a+(b-a)*t;

function cleanSetup(value){
 if(!object(value)||typeof value.course!=='string'||! /^[a-z][a-z0-9-]{0,47}$/.test(value.course)||!integer(value.layoutRevision,0,999)||!integer(value.difficulty,0,3)||![3,4,5,6,9].includes(value.laps)||!SEA_STATES.has(value.seaState)||!integer(value.waveSeed,0,996)||!integer(value.rider,0,3)||!object(value.tune))fail('Invalid time-trial ghost setup.');
 if(!integer(value.waterRevision??0,0,999))fail('Invalid ghost water revision.');
 if(!integer(value.water??0,0,3))fail('Invalid ghost water option.');
 const tune={};for(const key of ['engine','grip','handling']){const v=value.tune[key]??0;if(!number(v,-1,1))fail('Invalid time-trial ghost tuning.');tune[key]=Object.is(v,-0)?0:v;}
 return Object.freeze({...(value.waterRevision?{waterRevision:value.waterRevision}:{}),...(value.water?{water:value.water}:{}),course:value.course,layoutRevision:value.layoutRevision,difficulty:value.difficulty,laps:value.laps,seaState:value.seaState,waveSeed:value.waveSeed,rider:value.rider,tune:Object.freeze(tune)});
}

// createRace keeps the applied stats rather than the tune sliders. Pass the
// numeric tune used to create that race; omitted sliders mean their zero value.
export function ghostMetadata(state,{tune={}}={}){
 if(!object(state)||!object(state.course)||!Array.isArray(state.racers)||!state.racers[0])fail('Invalid time-trial state.');
 return cleanSetup({waterRevision:ghostWaterRevision(state.seaState),water:state.waterChoice??0,course:state.course.id,layoutRevision:state.course.layoutRevision??0,difficulty:state.difficulty,laps:state.laps,seaState:state.seaState,waveSeed:state.waveSeed,rider:state.racers[0].id,tune});
}

export function ghostKey(setup){
 const s=cleanSetup(setup);return JSON.stringify([s.course,s.layoutRevision,s.difficulty,s.laps,s.seaState,s.waveSeed,s.rider,s.tune.engine,s.tune.grip,s.tune.handling,s.waterRevision??0,...(s.water?[s.water]:[])]);
}

function pose(state){
 const r=state.racers?.[0],h=r?.hydro;
 if(!r||!h||!number(state.time,0,MAX_GHOST_SECONDS)||!number(r.x,-100000,100000)||!number(r.z,-100000,100000)||!number(h.y,-100000,100000)||!number(r.heading,-1e6,1e6)||!number(h.pitch,-1e6,1e6)||!number(h.roll,-1e6,1e6)||!number(r.speed,0,200)||!number(r.turn??0,-10,10))return null;
 return [state.time,r.x,r.z,h.y,angle(r.heading),angle(h.pitch),angle(h.roll),r.speed,r.turn??0].map((v,i)=>Math.round(v*scales[i]));
}

function invalidate(recorder,reason){recorder.invalid=reason;return false;}
function append(recorder,state,force=false){
 if(!object(recorder)||!Array.isArray(recorder.frames)||recorder.closed||recorder.invalid)return false;
 if(state?.mode!=='time'||state.demoRun||state.racers?.[0]?.dq)return invalidate(recorder,'This is not a valid time trial.');
 if(!force&&state.phase!=='running')return false;
 const time=state.time;
 if(!number(time,0,MAX_GHOST_SECONDS)||time<recorder.last-1e-7)return invalidate(recorder,'The trial clock was reset or exceeded the recording limit.');
 if(!force&&time-recorder.last<1/GHOST_SAMPLE_HZ-1e-7)return false;
 if(time-recorder.last>MAX_GAP+1e-7)return invalidate(recorder,'The trial recording has a missing section.');
 try{if(ghostKey(ghostMetadata(state,{tune:recorder.setup.tune}))!==recorder.key)return invalidate(recorder,'The trial setup changed during recording.');}catch{return invalidate(recorder,'The trial setup is invalid.');}
 const row=pose(state);if(!row)return invalidate(recorder,'The trial contains an invalid hull pose.');
 if(recorder.frames.at(-1)?.[0]===row[0])recorder.frames[recorder.frames.length-1]=row;
 else{if(recorder.frames.length>=MAX_GHOST_SAMPLES)return invalidate(recorder,'The trial recording is full.');recorder.frames.push(row);}
 recorder.last=time;return true;
}

export function beginGhostRace(state,options={}){
 if(state?.mode!=='time'||state.demoRun||!['countdown','running'].includes(state.phase)||state.time!==0||state.racers?.length!==1)return null;
 const setup=ghostMetadata(state,options),recorder={setup,key:ghostKey(setup),frames:[],last:0,closed:false,invalid:null};
 append(recorder,state,true);return recorder;
}

export function recordGhostFrame(recorder,state){return append(recorder,state);}

const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function base64(bytes){
 let out='';for(let i=0;i<bytes.length;i+=3){const n=bytes[i]*65536+(bytes[i+1]??0)*256+(bytes[i+2]??0);out+=alphabet[n>>>18]+alphabet[n>>>12&63]+(i+1<bytes.length?alphabet[n>>>6&63]:'=')+(i+2<bytes.length?alphabet[n&63]:'=');}return out;
}
function unbase64(text){
 if(typeof text!=='string'||!text.length||text.length>MAX_GHOST_BYTES||text.length%4||! /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(text))fail('Invalid time-trial ghost frame data.');
 const bytes=new Uint8Array(text.length/4*3-(text.endsWith('==')?2:text.endsWith('=')?1:0));let at=0;
 for(let i=0;i<text.length;i+=4){const a=alphabet.indexOf(text[i]),b=alphabet.indexOf(text[i+1]),c=alphabet.indexOf(text[i+2]),d=alphabet.indexOf(text[i+3]),n=a*262144+b*4096+Math.max(0,c)*64+Math.max(0,d);if(at<bytes.length)bytes[at++]=n>>>16;if(at<bytes.length)bytes[at++]=n>>>8&255;if(at<bytes.length)bytes[at++]=n&255;}
 if(base64(bytes)!==text)fail('Non-canonical time-trial ghost frame data.');return bytes;
}
function pack(frames){
 const bytes=[],previous=Array(WIDTH).fill(0);for(const frame of frames)for(let i=0;i<WIDTH;i++){const delta=frame[i]-previous[i];previous[i]=frame[i];let v=delta<0?-delta*2-1:delta*2;do{const part=v%128;v=Math.floor(v/128);bytes.push(part+(v?128:0));}while(v);}
 return base64(bytes);
}
function unpack(data,count,duration){
 const bytes=unbase64(data),rows=[],previous=Array(WIDTH).fill(0);let at=0;
 for(let n=0;n<count;n++){const row=[];for(let i=0;i<WIDTH;i++){let v=0,done=false;for(let b=0;b<5;b++){if(at>=bytes.length)fail('Truncated time-trial ghost.');const byte=bytes[at++];v+=(byte&127)*2**(b*7);if(v>0xffffffff)fail('Invalid time-trial ghost delta.');if(byte<128){if(b&&byte===0)fail('Invalid time-trial ghost delta.');done=true;break;}}if(!done)fail('Invalid time-trial ghost delta.');const delta=v%2?-(v+1)/2:v/2;row[i]=previous[i]+delta;previous[i]=row[i];const limit=Math.ceil(limits[i]*scales[i]);if(!integer(row[i],i===0||i===7?0:-limit,limit))fail('Time-trial ghost pose is out of bounds.');}
  if(n===0&&row[0]!==0||n>0&&(row[0]<=rows[n-1][0]||row[0]-rows[n-1][0]>MAX_GAP*1000+1))fail('Time-trial ghost has an invalid clock.');rows.push(row);
 }
 if(at!==bytes.length||rows.at(-1)[0]!==Math.round(duration*1000))fail('Time-trial ghost duration does not match its frames.');return rows;
}

// Only this small, bounded portable schema survives import. Quantized poses use
// centimetres, milliseconds, and 1/10000-radian angles, then signed delta varints.
export function validateGhost(value){
 if(object(value)&&canonical.has(value))return value;
 if(!object(value)||value.format!==FORMAT||value.version!==GHOST_VERSION||value.sampleHz!==GHOST_SAMPLE_HZ||!number(value.duration,.001,MAX_GHOST_SECONDS)||!integer(value.count,2,MAX_GHOST_SAMPLES))fail('Unsupported time-trial ghost.');
 const out={format:FORMAT,version:GHOST_VERSION,sampleHz:GHOST_SAMPLE_HZ,setup:cleanSetup(value.setup),duration:value.duration,count:value.count,data:value.data};
 if(typeof out.data!=='string'||out.data.length>MAX_GHOST_BYTES-512)fail('Time-trial ghost is too large.');
 const rows=unpack(out.data,out.count,out.duration);if(JSON.stringify(out).length>MAX_GHOST_BYTES)fail('Time-trial ghost is too large.');
 Object.freeze(out);canonical.add(out);decoded.set(out,rows);return out;
}

export function finishGhostRace(recorder,state){
 if(!object(recorder)||!Array.isArray(recorder.frames)||recorder.closed||recorder.invalid)return null;
 const r=state?.racers?.[0],laps=r?.lapTimes,gates=state?.course?.gates;
 const complete=state?.mode==='time'&&!state.demoRun&&state.phase==='results'&&r&&!r.dq&&number(r.finishTime,.001,MAX_GHOST_SECONDS)&&Math.abs(r.finishTime-state.time)<1e-6&&r.lap===state.laps+1&&r.next===1&&integer(r.misses,0,4)&&Array.isArray(laps)&&laps.length===state.laps&&laps.every(t=>number(t,.001,MAX_GHOST_SECONDS))&&Math.abs(laps.reduce((a,b)=>a+b,0)-r.finishTime)<1e-5&&Array.isArray(gates)&&gates.length>=2&&r.passed===gates.length*state.laps;
 if(!complete){invalidate(recorder,'Only a completed, valid time trial can become a ghost.');recorder.closed=true;return null;}
 if(!append(recorder,state,true)){recorder.closed=true;return null;}
 recorder.closed=true;
 try{return validateGhost({format:FORMAT,version:GHOST_VERSION,sampleHz:GHOST_SAMPLE_HZ,setup:recorder.setup,duration:r.finishTime,count:recorder.frames.length,data:pack(recorder.frames)});}catch(error){invalidate(recorder,error.message);return null;}
}

export function ghostCompatible(ghost,state,options={}){
 try{return ghostKey(validateGhost(ghost).setup)===ghostKey(state?.racers?ghostMetadata(state,options):state);}catch{return false;}
}

// A best lap never replaces a faster total run. Different water, layouts,
// riders, lap counts, classes, or tuning must live in separate record scopes.
export function keepBestGhost(existing,candidate){
 const next=validateGhost(candidate);if(!existing)return next;const current=validateGhost(existing);
 if(ghostKey(current.setup)!==ghostKey(next.setup))fail('Cannot replace an incompatible time-trial ghost.');
 return next.duration<current.duration?next:current;
}

export function ghostSample(ghost,time){
 const clean=validateGhost(ghost);if(!number(time,0,clean.duration))return null;
 const rows=decoded.get(clean);let low=0,high=rows.length-1;const ms=time*1000;
 while(low+1<high){const mid=(low+high)>>>1;if(rows[mid][0]<=ms)low=mid;else high=mid;}
 const a=rows[low],b=rows[high],t=Math.max(0,Math.min(1,(ms-a[0])/(b[0]-a[0]))),linear=i=>mix(a[i],b[i],t)/scales[i],rotation=i=>angle(a[i]/scales[i]+angle((b[i]-a[i])/scales[i])*t);
 return {x:linear(1),z:linear(2),heading:rotation(4),speed:linear(7),turn:linear(8),hydro:{y:linear(3),pitch:rotation(5),roll:rotation(6)}};
}

export function serializeGhost(ghost){return JSON.stringify(validateGhost(ghost));}
export function importGhost(text){
 if(typeof text!=='string'||text.length>MAX_GHOST_BYTES)fail('Time-trial ghost file is too large.');let value;try{value=JSON.parse(text);}catch{fail('Invalid time-trial ghost JSON.');}return validateGhost(value);
}
