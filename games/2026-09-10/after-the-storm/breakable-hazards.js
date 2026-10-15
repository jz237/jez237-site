// Shared, per-race ice destruction. Positions and velocities use metres/seconds.
// The native rule is normal impact >= .5 * racer stability. Source ordinal
// values do not establish which browser avatar owns which stability value.
export const SOURCE_BREAK_STABILITY=Object.freeze([9.5,10,9,8]);
export const MAX_BROKEN_HAZARDS=256;
export const MAX_FRAGMENT_EVENTS=2; // Eight pieces per hit, sixteen visible pieces.
export const MAX_FRAGMENT_LIFETIME=1.2;
export const FRAGMENT_GRAVITY=60;
const stores=new WeakMap(),issuedEvents=new WeakSet(),EMPTY=Object.freeze([]);
const finite=value=>typeof value==='number'&&Number.isFinite(value);
const validTime=value=>finite(value)&&value>=0&&value<=1e9;
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const vector=(x,y,z)=>Object.freeze({x,y,z});

function poseFactor(pose){
 if(pose===8||pose==='handstand')return .1;
 if(pose===9||pose==='backwards')return .15;
 if(pose===17||pose==='stand'||pose==='standing'||pose==='somersault')return .2;
 return 1;
}

// velocityScale converts native displacement/update into metres/second.
// The default .5 explicitly uses .025 metres/native unit and 20 logical updates
// per second. Pass 1 for the unconverted native threshold. Index is a source
// ordinal, not a browser avatar id; callers must supply any avatar mapping.
export function sourceBreakThreshold(sourceIndex,pose=null,velocityScale=.5){
 if(!Number.isInteger(sourceIndex)||sourceIndex<0||sourceIndex>=SOURCE_BREAK_STABILITY.length||!finite(velocityScale)||velocityScale<=0||velocityScale>100)return null;
 return SOURCE_BREAK_STABILITY[sourceIndex]*.5*poseFactor(pose)*velocityScale;
}

// Outward normal points from the static sphere center to the hull probe.
// Measure before applying the breaking contact's ordinary collision response.
// Missing Y means a horizontal vector; normal length does not affect impact.
export function approachNormalSpeed(velocity,normal){
 if(!velocity||!normal)return 0;
 const vx=velocity.x,vy=velocity.y??0,vz=velocity.z,nx=normal.x,ny=normal.y??0,nz=normal.z;
 if(![vx,vy,vz,nx,ny,nz].every(finite))return 0;
 const length=Math.hypot(nx,ny,nz);if(!finite(length)||length<1e-9)return 0;
 const impact=-(vx*(nx/length)+vy*(ny/length)+vz*(nz/length));
 return finite(impact)?Math.max(0,impact):0;
}

function hazardKey(hazard){
 if(!hazard||typeof hazard!=='object')return null;
 const id=hazard.id;
 if(typeof id==='string'&&id.length>0&&id.length<=160)return 's:'+id;
 if(Number.isSafeInteger(id))return 'n:'+id;
 return null;
}

function thresholdFor(hazard,riderIndex,pose){
 const rule=hazard.breakable;
 if(!rule||typeof rule!=='object')return null;
 if(Object.hasOwn(rule,'threshold'))return finite(rule.threshold)&&rule.threshold>0&&rule.threshold<=1000?rule.threshold*poseFactor(pose):null;
 let index=rule.sourceIndex;
 if(Object.hasOwn(rule,'sourceIndexByRider')){
  if(!Number.isInteger(riderIndex)||riderIndex<0||riderIndex>63)return null;
  const mapping=rule.sourceIndexByRider;
  if(!mapping||typeof mapping!=='object'||!Object.hasOwn(mapping,riderIndex))return null;
  index=mapping[riderIndex];
 }
 return sourceBreakThreshold(index,pose,rule.nativeVelocityScale===undefined?.5:rule.nativeVelocityScale);
}

// An opaque token prevents render consumers from accidentally clearing broken
// state. Create one token for the entire race and share it between all racers.
// Keep it through lap changes, pause/resume and temporary rider resets.
export function createBreakableState(){
 const state=Object.freeze({});stores.set(state,{broken:new Set(),events:[],time:0,readOnly:false});return state;
}

// Keep this opaque token directly on an in-memory replay frame; do not clone or
// serialize it. IDs are copied and already-frozen events are shared by reference,
// so later live breaks/pruning cannot rewrite a captured frame. The optional
// frame time also excludes debris that has already expired when recording.
export function captureBreakableState(state,frameTime){
 const store=stores.get(state);if(!store||frameTime!==undefined&&!validTime(frameTime))return null;
 const time=frameTime??store.time;if(time<store.time)return null;
 const capture=Object.freeze({}),events=store.events.filter(event=>time>=event.time&&time<event.time+event.lifetime).slice(-MAX_FRAGMENT_EVENTS);
 stores.set(capture,Object.freeze({broken:new Set(store.broken),events:Object.freeze(events),time,readOnly:true}));
 return capture;
}

export function hazardBroken(state,hazard){
 const store=stores.get(state),key=hazardKey(hazard);
 return !!store&&key!==null&&store.broken.has(key);
}

function randomFor(seed){
 let word=2166136261;
 for(let i=0;i<seed.length;i++){word^=seed.charCodeAt(i);word=Math.imul(word,16777619);}
 return ()=>{word=(Math.imul(word,1664525)+1013904223)>>>0;return word/4294967296;};
}

function fragmentsFor(key,center,radius){
 const random=randomFor(key+':'+center.x+':'+center.y+':'+center.z),fragments=[];
 // Independent, authored debris vectors; no original mesh or texture is used.
 // Eight outward sectors retain the source piece count without random global
 // state or a frame-rate-dependent integration path.
 for(let i=0;i<8;i++){
  const angle=(i+(random()-.5)*.28)*Math.PI/4,dx=Math.sin(angle),dz=Math.cos(angle),outward=5+random(),upward=4+random()*5.5,offsetY=(i%2?1:-1)*radius*.16;
  // Retire once the piece has fallen 3.2 m below the center, with an absolute
  // lifetime cap for render buffers. This affects visuals only.
  const fallDistance=Math.max(.1,offsetY+3.2),lifetime=Math.min(MAX_FRAGMENT_LIFETIME,(upward+Math.sqrt(upward*upward+2*FRAGMENT_GRAVITY*fallDistance))/FRAGMENT_GRAVITY);
  fragments.push(Object.freeze({
   id:i,offset:vector(dx*radius*.35,offsetY,dz*radius*.35),
   velocity:vector(dx*outward,upward,dz*outward),
   rotation:vector(random()*Math.PI,random()*Math.PI,random()*Math.PI),
   angularVelocity:vector((random()-.5)*12,(random()-.5)*12,(random()-.5)*12),
   scale:radius*(.18+random()*.12),lifetime
  }));
 }
 return Object.freeze(fragments);
}

function prune(store,time){store.events=store.events.filter(event=>time<event.time+event.lifetime);}

// Hazard: {id,x,y?,z,r?,breakable:{threshold}}. The explicit threshold is the
// normal-pose impact speed in m/s. Alternatively, {sourceIndex} or an explicitly
// supplied {sourceIndexByRider,nativeVelocityScale} uses sourceBreakThreshold.
// normalSpeed is positive into the sphere, measured before collision response;
// a glancing or departing contact must supply its normal component, not speed.
export function hitBreakable(state,hazard,input={}){
 if(!input||typeof input!=='object')return null;
 const {normalSpeed,riderIndex=null,pose=null,time}=input;
 const store=stores.get(state),key=hazardKey(hazard);
 if(!store||store.readOnly||key===null||store.broken.has(key)||store.broken.size>=MAX_BROKEN_HAZARDS)return null;
 if(!validTime(time)||time<store.time||!finite(normalSpeed)||normalSpeed<=0||normalSpeed>1e4)return null;
 const threshold=thresholdFor(hazard,riderIndex,pose);
 if(threshold===null||normalSpeed<threshold)return null;
 const {x,z}=hazard,y=hazard.y??0,radius=hazard.r??1.25;
 if(![x,y,z].every(value=>finite(value)&&Math.abs(value)<=1e6)||!finite(radius)||radius<=0||radius>1000)return null;
 const center=vector(x,y,z),fragments=fragmentsFor(key,center,radius);
 const event=Object.freeze({id:'break:'+key,hazardId:hazard.id,riderIndex:Number.isInteger(riderIndex)?riderIndex:null,
  time,center,threshold,normalSpeed,fragments,lifetime:Math.max(...fragments.map(fragment=>fragment.lifetime))});
 issuedEvents.add(event);store.broken.add(key);store.time=time;prune(store,time);store.events.push(event);
 if(store.events.length>MAX_FRAGMENT_EVENTS)store.events.shift();
 return event;
}

// Query with the simulation clock, so pausing also freezes fragment playback.
// Expiring debris never restores the underlying obstacle. New race, new token.
export function breakableEvents(state,time){
 const store=stores.get(state);if(!store||!validTime(time))return EMPTY;
 if(!store.readOnly)prune(store,time);
 return store.events.filter(event=>time>=event.time&&time<event.time+event.lifetime);
}

// Stateless analytic playback avoids different debris trajectories at 30/60/
// 144 Hz. Rotation fields are Euler radians; scale is a uniform world size.
export function fragmentPose(event,fragment,time){
 if(!issuedEvents.has(event)||!event.fragments.includes(fragment)||!validTime(time))return null;
 if(time<event.time||time>=event.time+fragment.lifetime)return null;
 const age=time-event.time;
 const {center}=event,{offset,velocity,rotation,angularVelocity}=fragment;
 return {x:center.x+offset.x+velocity.x*age,y:center.y+offset.y+velocity.y*age-FRAGMENT_GRAVITY*age*age*.5,z:center.z+offset.z+velocity.z*age,
  rx:rotation.x+angularVelocity.x*age,ry:rotation.y+angularVelocity.y*age,rz:rotation.z+angularVelocity.z*age,
  scale:fragment.scale,opacity:clamp((fragment.lifetime-age)/.18,0,1)};
}
