// Shared with the site's other games. Namespaces keep incompatible runs apart.
export const SCORES_BASE='https://game-scores.jez237.workers.dev/scores/';
export const SCORE_MODES={race:'Race',time:'Time trial',championship:'Championship round',stunt:'Stunt attack'};
export const SCORE_SEAS={surf:'Big surf',course:'Venue conditions',calm:'Calm',chop:'Wind chop',storm:'Storm swell'};
const courseIds=new Set(['greyhaven','amber','reed','citadel','port','neon','glacier','tempest','practice']);
const timeCeiling=86400000,scoreCeiling=100000000;
const integer=(v,min,max)=>Number.isInteger(v)&&v>=min&&v<=max;
export const scoreInitials=value=>String(value??'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,3)||'YOU';

export function globalBoard(value){
 const {mode,course,difficulty=0,seaState='course',tuning='standard',layoutRevision=0}=value;
 const laps=mode==='stunt'?1:value.laps??3;
 if(!Object.hasOwn(SCORE_MODES,mode)||!courseIds.has(course)||course==='practice'&&mode!=='stunt'||
  !integer(difficulty,0,3)||!Object.hasOwn(SCORE_SEAS,seaState)||!['standard','custom'].includes(tuning)||
  !integer(layoutRevision,0,999)||!(mode==='stunt'||[3,4,5,6,9].includes(laps)))throw new Error('Unsupported global leaderboard.');
 return Object.freeze({mode,course,difficulty,laps,seaState,tuning,layoutRevision});
}

export function globalBoardKey(value){
 const b=globalBoard(value);
 // v1 denotes the modern driving model. A future physics change needs a new version.
 return `ats-v1-${b.mode}-${b.course}-d${b.difficulty}-l${b.laps}-s${b.seaState}-${b.tuning}-r${b.layoutRevision}`;
}

export function encodeGlobalScore(board,value){
 if(board.mode==='stunt'){
  if(!integer(value,0,scoreCeiling))throw new Error('Invalid stunt score.');
  return value;
 }
 const milliseconds=Math.round(value*1000);
 if(typeof value!=='number'||!Number.isFinite(value)||!integer(milliseconds,1,timeCeiling-1))throw new Error('Invalid race time.');
 // The shared service sorts descending; shorter times must have larger scores.
 return timeCeiling-milliseconds;
}

export function decodeGlobalScore(board,score){
 if(board.mode==='stunt')return integer(score,0,scoreCeiling)?score:null;
 return integer(score,1,timeCeiling-1)?(timeCeiling-score)/1000:null;
}

export function parseGlobalScores(board,data){
 const rows=Array.isArray(data)?data:data?.scores;
 if(!Array.isArray(rows))throw new Error('Invalid leaderboard response.');
 return rows.slice(0,100).flatMap(row=>{
  if(!row||decodeGlobalScore(board,row.score)===null)return [];
  const name=row.initials??row.name;
  if(typeof name!=='string')return [];
  return [{initials:scoreInitials(name),score:row.score,value:decodeGlobalScore(board,row.score)}];
 }).sort((a,b)=>b.score-a.score).slice(0,10);
}

export function captureGlobalRun(state,{tune={},assisted=false}={}){
 if(assisted||state.demoRun||state.nativePreview||state.physics!=='modern'||state.freeRide||!Object.hasOwn(SCORE_MODES,state.mode))return null;
 try{return Object.freeze({board:globalBoard({mode:state.mode,course:state.course.id,difficulty:state.difficulty,
  laps:state.laps,seaState:state.seaState,layoutRevision:state.course.layoutRevision??0,
  tuning:['engine','grip','handling'].some(k=>Number(tune[k]??0)!==0)?'custom':'standard'})});}catch{return null;}
}

export function completeGlobalRun(context,state){
 const rider=state.racers?.[0];
 if(!context||state.phase!=='results'||state.demoRun||state.nativePreview||!rider||rider.dq||rider.finishTime===null)return null;
 const value=context.board.mode==='stunt'?rider.stunt?.score:rider.finishTime;
 try{return Object.freeze({board:context.board,value,score:encodeGlobalScore(context.board,value)});}catch{return null;}
}

export function createGlobalScoresClient({fetchFn=globalThis.fetch,timeoutMs=10000}={}){
 async function request(board,options={}){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);
  try{
   const response=await fetchFn(SCORES_BASE+globalBoardKey(board),{...options,signal:controller.signal,cache:'no-store',credentials:'omit'});
   if(!response.ok)throw new Error('Global scores are unavailable. Try again.');
   // Keep the deadline active while the response body is arriving, too.
   return options.method==='POST'?await response.text():await response.json();
  }finally{clearTimeout(timer);}
 }
 return {
  async load(board){return parseGlobalScores(board,await request(board));},
  async post(run,initials){
   await request(run.board,{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({initials:scoreInitials(initials),score:encodeGlobalScore(run.board,run.value)})});
  }
 };
}

// Coalesce double clicks. A failed request can be retried without saving locally again.
export function createGlobalSubmission(run,client){
 let pending=null,posted=false;
 return {get posted(){return posted;},submit(initials){
  if(posted)return Promise.resolve();
  if(pending)return pending;
  pending=Promise.resolve().then(()=>client.post(run,initials)).then(()=>{posted=true;}).finally(()=>{pending=null;});
  return pending;
 }};
}

export function formatGlobalScore(board,value){
 if(board.mode==='stunt')return value.toLocaleString()+' pts';
 const ms=Math.round(value*1000),minutes=Math.floor(ms/60000),seconds=Math.floor(ms%60000/1000);
 return `${minutes}:${String(seconds).padStart(2,'0')}.${String(ms%1000).padStart(3,'0')}`;
}
