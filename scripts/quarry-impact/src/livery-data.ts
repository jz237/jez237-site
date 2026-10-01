export const LIVERY_LIMIT=32;
export const LIVERY_FACES=['left','right','top','front','rear'] as const;
export type LiveryFace=typeof LIVERY_FACES[number];
export const LIVERY_SHAPES=['stripe','circle','star','chevron','checker','number','text','spray','rust','chips'] as const;
export type LiveryShape=typeof LIVERY_SHAPES[number];
export type LiveryLayer={name:string;face:LiveryFace;shape:LiveryShape;color:number;x:number;y:number;width:number;height:number;rotation:number;opacity:number;flip:boolean;hidden:boolean;text:string;seed:number};
export type LiveryGroup={name:string;layers:LiveryLayer[]};
const obj=(v:unknown):Record<string,unknown>=>v!==null&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:{};
const num=(v:unknown,f:number,min:number,max:number)=>typeof v==='number'&&Number.isFinite(v)?Math.max(min,Math.min(max,v)):f;
const label=(v:unknown,f:string,n:number)=>typeof v==='string'?v.replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,n)||f:f;
export function newLayer(shape:LiveryShape='stripe',face:LiveryFace='left'):LiveryLayer{return{name:shape.toUpperCase(),face,shape,color:shape==='chips'?0xa4a9a8:shape==='rust'?0x99552f:0xf1bd42,x:.5,y:.55,width:.55,height:.2,rotation:0,opacity:1,flip:false,hidden:false,text:shape==='number'?'27':'BLACKRIDGE',seed:1};}
export function normalizeLivery(value:unknown):LiveryLayer[]{
 if(!Array.isArray(value))return [];
 return value.slice(0,LIVERY_LIMIT).flatMap(v=>{const a=obj(v);if(!LIVERY_FACES.includes(a.face as LiveryFace)||!LIVERY_SHAPES.includes(a.shape as LiveryShape))return [];
 const d=newLayer(a.shape as LiveryShape,a.face as LiveryFace);return [{...d,name:label(a.name,d.name,24),text:label(a.text,d.text,16),color:Math.round(num(a.color,d.color,0,0xffffff)),x:num(a.x,.5,-.5,1.5),y:num(a.y,.55,-.5,1.5),width:num(a.width,.55,.02,2),height:num(a.height,.2,.02,2),rotation:num(a.rotation,0,-180,180),opacity:num(a.opacity,1,0,1),flip:a.flip===true,hidden:a.hidden===true,seed:Math.round(num(a.seed,1,0,0xffffffff))}];});
}
export function normalizeGroups(value:unknown):LiveryGroup[]{return Array.isArray(value)?value.slice(0,8).flatMap(v=>{const a=obj(v),layers=normalizeLivery(a.layers);return typeof a.name==='string'&&a.name.trim()&&layers.length?[{name:label(a.name,'Group',32),layers}]:[]}):[];}
/** Transform selected layers around their common center in surface coordinates. */
export function transformLayers(layers:LiveryLayer[],selected:readonly number[],dx=0,dy=0,scale=1,angle=0){
 const chosen=selected.filter(i=>i>=0&&i<layers.length);if(!chosen.length)return normalizeLivery(layers);
 const cx=chosen.reduce((n,i)=>n+layers[i].x,0)/chosen.length,cy=chosen.reduce((n,i)=>n+layers[i].y,0)/chosen.length,c=Math.cos(angle*Math.PI/180),s=Math.sin(angle*Math.PI/180);
 return normalizeLivery(layers.map((l,i)=>{if(!chosen.includes(i))return l;const x=(l.x-cx)*scale,y=(l.y-cy)*scale;return {...l,x:cx+x*c-y*s+dx,y:cy+x*s+y*c+dy,width:l.width*scale,height:l.height*scale,rotation:((l.rotation+angle+540)%360)-180};}));
}
export function mirrorLayer(layer:LiveryLayer):LiveryLayer{return {...layer,face:layer.face==='left'?'right':layer.face==='right'?'left':layer.face==='front'?'rear':layer.face==='rear'?'front':layer.face,x:1-layer.x,rotation:-layer.rotation,flip:layer.shape==='text'||layer.shape==='number'?layer.flip:!layer.flip};}
export const liveryHex=(n:number)=>'#'+n.toString(16).padStart(6,'0');
