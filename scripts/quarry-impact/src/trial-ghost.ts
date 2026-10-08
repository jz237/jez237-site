import {isTimeTrialConfig,timeTrialKey,type TimeTrialConfig,type TimeTrialResult} from './time-trial';

export const TRIAL_GHOST_KEY='quarry-impact-trial-ghosts-v1';
export const MAX_GHOST_SECONDS=600;
export const MAX_GHOST_FRAMES=6002;
export const MAX_GHOST_BYTES=2_000_000;
export type GhostFrame=[number,number,number,number,number,number,number,number];
export type TrialGhost={version:1;config:TimeTrialConfig;time:number;frames:GhostFrame[];gates:number[]};
export type GhostLibrary={version:1;enabled:boolean;ghosts:TrialGhost[]};
type Pose={x:number;y:number;z:number};
type Rotation=Pose&{w:number};
const empty=():GhostLibrary=>({version:1,enabled:true,ghosts:[]});
const finite=(v:unknown):v is number=>typeof v==='number'&&Number.isFinite(v);
const round=(v:number)=>Math.round(v*10000)/10000;

export function validTrialGhost(value:unknown):value is TrialGhost{
  if(!value||typeof value!=='object')return false;
  const g=value as TrialGhost;
  if(g.version!==1||!isTimeTrialConfig(g.config)||!finite(g.time)||g.time<=0||g.time>MAX_GHOST_SECONDS||
    !Array.isArray(g.frames)||g.frames.length<2||g.frames.length>MAX_GHOST_FRAMES||!Array.isArray(g.gates)||g.gates.length!==24)return false;
  let previous=-1;
  for(const frame of g.frames){
    if(!Array.isArray(frame)||frame.length!==8||!frame.every(finite)||frame[0]<=previous||frame[0]<0||frame[0]>g.time||
      frame.slice(1,4).some(v=>Math.abs(v)>10000)||Math.abs(Math.hypot(...frame.slice(4))-1)>.002)return false;
    if(previous>=0&&frame[0]-previous>.12)return false;
    previous=frame[0];
  }
  if(g.frames[0][0]!==0||Math.abs(previous-g.time)>1e-7)return false;
  previous=0;
  for(const gate of g.gates){if(!finite(gate)||gate<=previous||gate>g.time)return false;previous=gate;}
  return Math.abs(previous-g.time)<1e-7;
}

export function readGhostLibrary(text:string|null|undefined):GhostLibrary{
  if(typeof text!=='string'||text.length>MAX_GHOST_BYTES)return empty();
  try{
    const value=JSON.parse(text);
    if(value?.version!==1||typeof value.enabled!=='boolean'||!Array.isArray(value.ghosts)||value.ghosts.length>16)return empty();
    const keys=new Set<string>(),ghosts:TrialGhost[]=[];
    for(const ghost of value.ghosts){
      if(!validTrialGhost(ghost))continue;
      const key=timeTrialKey(ghost.config);if(keys.has(key))continue;keys.add(key);ghosts.push(ghost);
    }
    return{version:1,enabled:value.enabled,ghosts};
  }catch{return empty();}
}
export function loadGhostLibrary(storage?:Pick<Storage,'getItem'>):GhostLibrary{
  try{return readGhostLibrary((storage??globalThis.localStorage).getItem(TRIAL_GHOST_KEY));}catch{return empty();}
}
export function saveGhostLibrary(library:GhostLibrary,storage?:Pick<Storage,'setItem'>):boolean{
  try{
    const text=JSON.stringify(library);if(text.length>MAX_GHOST_BYTES)return false;
    (storage??globalThis.localStorage).setItem(TRIAL_GHOST_KEY,text);return true;
  }catch{return false;}
}
/** Never race a ghost from another category or a superseded personal best. */
export function findTrialGhost(library:GhostLibrary,config:TimeTrialConfig,best:number|null):TrialGhost|null{
  return library.ghosts.find(g=>timeTrialKey(g.config)===timeTrialKey(config)&&g.time===best)??null;
}
/** Only the same eligibility decision which awards a new PB can replace a ghost.
 * Old recordings are evicted first; numerical PBs live in their own store. */
export function settleTrialGhost(library:GhostLibrary,config:TimeTrialConfig,result:TimeTrialResult,recording:TrialGhost|null):GhostLibrary{
  if(!result.eligible||!result.newBest)return library;
  const ghosts=library.ghosts.filter(g=>timeTrialKey(g.config)!==timeTrialKey(config));
  if(recording&&validTrialGhost(recording)&&timeTrialKey(recording.config)===timeTrialKey(config)&&recording.time===result.time)ghosts.push(recording);
  const next:GhostLibrary={version:1,enabled:library.enabled,ghosts};
  while(next.ghosts.length>16||JSON.stringify(next).length>MAX_GHOST_BYTES)next.ghosts.shift();
  return next;
}

/** Sample the physical pose at 10 Hz. Gate times retain fixed-step precision. */
export class TrialGhostRecorder{
  private frames:GhostFrame[]=[];
  readonly gates:number[]=[];
  private invalid=false;
  constructor(readonly config:TimeTrialConfig){}
  sample(time:number,p:Pose,q:Rotation,force=false){
    if(this.invalid)return;
    if(![time,p.x,p.y,p.z,q.x,q.y,q.z,q.w].every(finite)||time>MAX_GHOST_SECONDS||this.frames.length>=MAX_GHOST_FRAMES){this.invalid=true;return;}
    const last=this.frames.at(-1);
    if(last&&(time<=last[0]||!force&&time-last[0]<.1-1e-8))return;
    this.frames.push([time,round(p.x),round(p.y),round(p.z),round(q.x),round(q.y),round(q.z),round(q.w)]);
  }
  gate(passed:number,time:number){
    if(passed===this.gates.length+1&&passed<=24)this.gates.push(time);
    else this.invalid=true;
  }
  finish(time:number,p:Pose,q:Rotation):TrialGhost|null{
    this.sample(time,p,q,true);
    const ghost:TrialGhost={version:1,config:{...this.config},time,frames:this.frames,gates:this.gates};
    return !this.invalid&&validTrialGhost(ghost)?ghost:null;
  }
}

/** Binary search also handles seeking backwards; shortest quaternion arc avoids
 * a spin when equivalent q and -q samples straddle a recording boundary. */
export function sampleTrialGhost(ghost:TrialGhost,time:number):{position:[number,number,number];quaternion:[number,number,number,number]}|null{
  if(!finite(time)||time<0||time>ghost.time)return null;
  let lo=0,hi=ghost.frames.length-1;
  while(lo+1<hi){const mid=(lo+hi)>>1;if(ghost.frames[mid][0]<=time)lo=mid;else hi=mid;}
  const a=ghost.frames[lo],b=ghost.frames[hi],f=Math.max(0,Math.min(1,(time-a[0])/(b[0]-a[0])));
  const dot=a.slice(4).reduce((sum,v,i)=>sum+v*b[i+4],0),sign=dot<0?-1:1;
  const q=a.slice(4).map((v,i)=>v+(b[i+4]*sign-v)*f),length=Math.hypot(...q);
  return{position:[1,2,3].map(i=>a[i]+(b[i]-a[i])*f) as [number,number,number],quaternion:q.map(v=>v/length) as [number,number,number,number]};
}
