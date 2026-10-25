import {LIVERY_LIMIT,type LiveryLayer,type LiveryFace} from './livery-data';
/** Derby race numbers (offline events): a rival whose livery carries no number is painted with its car number in a white
 * roundel on both doors and the roof, as real derby cars are, so "#7" in the feed is the car with a 7 on it. */
export const RACE_NUMBER={door:{x:.5,y:.5,size:.42},roof:{x:.5,y:.5,size:.5},disc:0xf4f2ea,ink:0x111111} as const;
/** Fictional local sponsors painted on a rival's rear flanks, chosen by its car number (16 letters at most, the livery's lettering limit). */
export const SPONSORS=['BLACKRIDGE SCRAP','HARROW TOWING','QUARRY AUTO','KESTREL BODYWORK','SALT FLATS SCRAP','IRON GATE TOWING','BRAMBLE MOTORS','STONEPIT TYRES'] as const;
export const SPONSOR_DECAL={x:.2,y:.33,width:.26,height:.1} as const;
const layer=(face:LiveryFace,shape:'circle'|'number',x:number,y:number,width:number,height:number,color:number,text=''):LiveryLayer=>
 ({name:shape==='number'?'RACE NUMBER':'NUMBER DISC',face,shape,color,x,y,width,height,rotation:0,opacity:1,flip:false,hidden:false,text,seed:1});
/** The livery with race numbers added, or null when it already has a number (or text) of its own or no room is left. */
export function withRaceNumbers(livery:readonly LiveryLayer[]|undefined,number:number):LiveryLayer[]|null{
 const own=livery??[];if(own.some(l=>!l.hidden&&(l.shape==='number'||l.shape==='text'))||!Number.isInteger(number)||number<1)return null;
 const text=String(number),add:LiveryLayer[]=[];
 for(const face of ['left','right'] as const){const d=RACE_NUMBER.door;add.push(layer(face,'circle',d.x,d.y,d.size*.62,d.size,RACE_NUMBER.disc),layer(face,'number',d.x,d.y,d.size*.5*Math.min(1,.55+.25*text.length),d.size*.8,RACE_NUMBER.ink,text));}
 const r=RACE_NUMBER.roof;add.push(layer('top','circle',r.x,r.y,r.size,r.size*.62,RACE_NUMBER.disc),layer('top','number',r.x,r.y,r.size*.45*Math.min(1,.55+.25*text.length),r.size*.5,RACE_NUMBER.ink,text));
 // A local sponsor sticker on each rear quarter panel, above the wheel (side faces run nose-to-tail along +z, so the right face is mirrored).
 const sponsor=SPONSORS[(number-1)%SPONSORS.length],d=SPONSOR_DECAL;
 for(const [face,x] of [['left',d.x],['right',1-d.x]] as const)add.push({...layer(face,'circle',x,d.y,d.width+.03,d.height*1.15,RACE_NUMBER.disc),shape:'stripe',name:'SPONSOR PANEL'},{...layer(face,'number',x,d.y,d.width,d.height,RACE_NUMBER.ink,sponsor),shape:'text',name:'SPONSOR'});
 return own.length+add.length>LIVERY_LIMIT?null:[...own,...add];
}
