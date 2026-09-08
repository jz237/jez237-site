export function normalizeSpectatorConfig(raw,fighters,stages){
 if(!raw)return null;
 const {first,second,stage='random',difficulty='auto'}=raw,bestOf=Number(raw.bestOf||3);
 if(!fighters.includes(first)||!fighters.includes(second)||first===second)return null;
 if(stage!=='random'&&!stages.includes(stage))return null;
 if(!['auto','rookie','street','pro','final'].includes(difficulty)||![1,3,5].includes(bestOf))return null;
 return {first,second,stage,difficulty,bestOf};
}
export function configuredDirector(director,config){
 if(!config)return director;
 const map=cycle=>cycle?{...cycle,picks:[config.first,config.second],stage:config.stage==='random'?cycle.stage:config.stage}:cycle;
 return {next:()=>map(director.next()),peek:()=>map(director.peek()),snapshot:()=>({...director.snapshot(),matchupCount:1})};
}
export function spectatorConfigFromUrl(url){
 const q=new URL(url).searchParams;
 return q.has('p1')?{first:q.get('p1'),second:q.get('p2'),stage:q.get('arena')||'random',difficulty:q.get('cpu')||'auto',bestOf:q.get('bestOf')||3}:null;
}
export function addSpectatorConfig(url,config){
 if(!config)return url;const out=new URL(url);
 for(const [key,value] of Object.entries({p1:config.first,p2:config.second,arena:config.stage,cpu:config.difficulty,bestOf:config.bestOf}))out.searchParams.set(key,value);
 return out.href;
}
