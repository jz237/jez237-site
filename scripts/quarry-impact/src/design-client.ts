import {CAR_KINDS} from './rules';
import {validOnlineLivery} from './online-livery';
import type {Design} from './design-types';
export type PublishedDesign=Design&{rating:number;ratingCount:number};
export type DesignDraft=Pick<Design,'kind'|'paint'|'trim'|'layers'|'name'|'creator'|'allowRemix'>;
export class DesignClient{
 readonly key:string;readonly owned:Set<string>;
 constructor(private endpoint:string,private storage:Storage){
  let key='',owned:string[]=[];
  try{key=storage.getItem('quarry-design-key-v1')??'';if(!/^[a-zA-Z0-9_-]{43,128}$/.test(key)){key=crypto.randomUUID().replaceAll('-','')+crypto.randomUUID().replaceAll('-','');storage.setItem('quarry-design-key-v1',key)}const v=JSON.parse(storage.getItem('quarry-design-owned-v1')??'[]');if(Array.isArray(v))owned=v.filter(i=>typeof i==='string');}catch{key='';}
  this.key=key;this.owned=new Set(owned);
 }
 async request(path:string,method='GET',body?:unknown,revision?:number){
  if(method!=='GET'&&!this.key)throw Error('Browser storage is unavailable; publishing and ratings are disabled.');
  const r=await fetch(this.endpoint+path,{method,headers:{...(method==='GET'?{}:{authorization:'Bearer '+this.key,'content-type':'application/json'}),...(revision?{'if-match':String(revision)}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})}).catch(()=>{throw Error('Could not reach the design catalog. Your garage design has not changed.');});
  const v=await r.json();if(!r.ok)throw Error(typeof v.error==='string'?v.error:'Catalog request failed');return v;
 }
 validate(v:any):PublishedDesign{if(!v||typeof v.id!=='string'||typeof v.name!=='string'||typeof v.creator!=='string'||!CAR_KINDS.includes(v.kind)||!validOnlineLivery(v.layers)||typeof v.allowRemix!=='boolean'||!Number.isInteger(v.paint)||v.paint<0||v.paint>0xffffff||!Number.isInteger(v.trim)||v.trim<0||v.trim>0xffffff||!Number.isFinite(v.rating)||!Number.isInteger(v.ratingCount)||!Number.isInteger(v.revision))throw Error('Invalid catalog design');return v;}
 async get(id:string){return this.validate(await this.request('/'+encodeURIComponent(id)))}
 async publish(draft:DesignDraft){const d=this.validate(await this.request('','POST',draft));this.owned.add(d.id);this.remember();return d;}
 async update(d:PublishedDesign,draft:DesignDraft){return this.validate(await this.request('/'+encodeURIComponent(d.id),'PUT',draft,d.revision))}
 async rate(d:PublishedDesign,rating:number){return this.validate(await this.request('/'+encodeURIComponent(d.id)+'/rating','PUT',{rating}))}
 async remove(d:PublishedDesign){await this.request('/'+encodeURIComponent(d.id),'DELETE',undefined,d.revision);this.owned.delete(d.id);this.remember()}
 private remember(){try{this.storage.setItem('quarry-design-owned-v1',JSON.stringify([...this.owned]))}catch{/* Key remains durable; shortcut persistence is optional. */}}
}
