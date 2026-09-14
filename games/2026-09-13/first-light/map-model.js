// The lake map's arithmetic: the world-to-canvas frame, depth bands, where the journal's catches
// cluster, bearings to cover. Pure and node-tested; map.js draws it. North is −z.
export const MAP={pad:.06,cell:12};
export function mapFrame(span,w,h){const s=Math.min(w,h)*(1-2*MAP.pad)/span;return {s,ox:w/2,oy:h/2,span,w,h};}
export function worldToMap(f,x,z){return {x:f.ox+x*f.s,y:f.oy+z*f.s};}
export function depthBand(h){return h>=0?'land':h>-1?'shallow':h>-3?'mid':h>-6?'deep':'channel';}
export const FEATURE_LABEL={dock:'Dock',laydown:'Laydown',weedbed:'Weed bed',pads:'Lily pads',riprap:'Riprap point',stump:'Stump field'};
// catches grouped on a coarse grid; entries without a position fall back to the cover they were logged on
export function catchSpots(catches=[],features=[],cell=MAP.cell){
 const m=new Map();
 for(const c of catches){let x=c.x,z=c.z;if(!Number.isFinite(x)||!Number.isFinite(z)){const f=features.find(f=>f.type===c.spot);if(!f)continue;x=f.x;z=f.z;}
  const kx=Math.round(x/cell)*cell,kz=Math.round(z/cell)*cell,k=kx+','+kz;const e=m.get(k)||{x:kx,z:kz,count:0,species:{},best:0};
  e.count++;e.species[c.species]=(e.species[c.species]||0)+1;e.best=Math.max(e.best,c.lengthIn||0);m.set(k,e);}
 return [...m.values()].map(e=>({...e,top:Object.entries(e.species).sort((a,b)=>b[1]-a[1])[0][0]}));
}
const WORDS=['N','NE','E','SE','S','SW','W','NW'];
export function bearingTo(from,to){const dx=to.x-from.x,dz=to.z-from.z,d=Math.hypot(dx,dz);const deg=(Math.atan2(dx,-dz)*180/Math.PI+360)%360;return {m:Math.round(d),deg:Math.round(deg),word:WORDS[Math.round(deg/45)%8]};}
export function nearestFeature(from,features=[]){let best=null,bd=Infinity;for(const f of features){const d=Math.hypot(f.x-from.x,f.z-from.z);if(d<bd){bd=d;best=f;}}return best?{feature:best,dist:bd}:null;}
export function coverLine(from,features){const n=nearestFeature(from,features);if(!n)return '';const b=bearingTo(from,n.feature);return `${FEATURE_LABEL[n.feature.type]||n.feature.type} · ${b.m} m ${b.word}`;}
