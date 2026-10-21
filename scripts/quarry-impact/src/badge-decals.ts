import {ACHIEVEMENTS} from './achievements';
import {newLayer,normalizeLivery,type LiveryFace,type LiveryLayer,type LiveryShape} from './livery-data';
/** Trophy decals: each earned badge unlocks a ready-made livery set in the workshop, so the
 * badges have something to show off. Sets are ordinary livery layers (inserted like a saved
 * group), drawn on both flanks unless they belong on the roof. */
export type BadgeDecal={badge:string;name:string;layers:LiveryLayer[]};
type Part=Partial<LiveryLayer>&{shape:LiveryShape;face:LiveryFace};
const layer=(name:string,p:Part):LiveryLayer=>({...newLayer(p.shape,p.face),name,seed:7,...p});
const sides=(name:string,p:Omit<Part,'face'>)=>(['left','right'] as const).map(face=>layer(name,{...p,face}));
const set=(badge:string,name:string,...layers:LiveryLayer[][]):BadgeDecal=>({badge,name,layers:normalizeLivery(layers.flat())});
export const BADGE_DECALS:readonly BadgeDecal[]=[
 set('chequered','Chequered sill',sides('CHEQUER',{shape:'checker',color:0x111111,x:.5,y:.86,width:.9,height:.12})),
 set('top-step','Winner’s star',sides('STAR',{shape:'star',color:0xf2c230,x:.5,y:.45,width:.22,height:.5}),[layer('ROOF STAR',{shape:'star',face:'top',color:0xf2c230,x:.5,y:.5,width:.3,height:.3})]),
 set('last-standing','Last one standing',sides('LAST STANDING',{shape:'text',color:0xd8261c,text:'LAST STANDING',x:.5,y:.3,width:.8,height:.16})),
 set('held-together','Gaffer tape',sides('TAPE',{shape:'stripe',color:0x9da3a6,x:.42,y:.5,width:.5,height:.07,rotation:24}),sides('TAPE',{shape:'stripe',color:0x9da3a6,x:.58,y:.52,width:.48,height:.07,rotation:-21})),
 set('first-takedown','Takedown chevrons',...[.36,.5,.64].map(x=>sides('CHEVRON',{shape:'chevron',color:0xe03a1e,x,y:.5,width:.14,height:.4}))),
 set('scrap-merchant','Scrap merchant',sides('RUST',{shape:'rust',x:.3,y:.7,width:.4,height:.5}),sides('CHIPS',{shape:'chips',x:.72,y:.4,width:.35,height:.4})),
 set('breakers-yard','Breaker’s yard',sides('BREAKERS',{shape:'text',color:0xf1bd42,text:'BREAKER’S YARD',x:.5,y:.32,width:.82,height:.16}),sides('RUST',{shape:'rust',x:.5,y:.75,width:.7,height:.4,opacity:.8})),
 set('collector','Collector’s number',sides('ROUNDEL',{shape:'circle',color:0xf4f1e6,x:.5,y:.5,width:.24,height:.58}),sides('NUMBER',{shape:'number',color:0x141414,text:'10',x:.5,y:.5,width:.16,height:.42})),
 set('grand-tour','Grand tour stripes',[layer('STRIPE',{shape:'stripe',face:'top',color:0x2a5fbf,x:.42,y:.5,width:1.2,height:.08,rotation:90}),layer('STRIPE',{shape:'stripe',face:'top',color:0x2a5fbf,x:.58,y:.5,width:1.2,height:.08,rotation:90})]),
 set('arena-regular','Arena regular',sides('SPRAY',{shape:'spray',color:0x3fbf4f,x:.5,y:.55,width:.8,height:.6,opacity:.85})),
 set('daily-driver','Daily driver',sides('DAILY',{shape:'text',color:0x1d7bd6,text:'DAILY DRIVER',x:.5,y:.82,width:.6,height:.13})),
 set('goldsmith','Goldsmith pinstripe',sides('PINSTRIPE',{shape:'stripe',color:0xd4a72c,x:.5,y:.4,width:1.1,height:.035})),
 set('last-car-running','Last car running',sides('LAST CAR',{shape:'text',color:0xffffff,text:'LAST CAR RUNNING',x:.5,y:.3,width:.86,height:.15})),
 set('night-owl','Night owl',sides('NIGHT OWL',{shape:'text',color:0x9b6bff,text:'NIGHT OWL',x:.5,y:.62,width:.6,height:.17}),sides('MOON',{shape:'circle',color:0xf3eecf,x:.82,y:.3,width:.1,height:.25})),
 set('ice-cream-scream','Ninety-nine',sides('CONE',{shape:'circle',color:0xf5a3c7,x:.5,y:.45,width:.22,height:.55}),sides('99',{shape:'number',color:0x7a3b1f,text:'99',x:.5,y:.45,width:.15,height:.4})),
 set('wheel-snatcher','Wheel snatcher',sides('TYRE',{shape:'circle',color:0x1b1b1a,x:.75,y:.55,width:.16,height:.42}),sides('HUB',{shape:'circle',color:0xc9c9c4,x:.75,y:.55,width:.07,height:.18})),
 set('scrapyard','Scrapyard',sides('RUST',{shape:'rust',x:.5,y:.6,width:.9,height:.7}),sides('CHIPS',{shape:'chips',x:.4,y:.35,width:.6,height:.4})),
 set('firestarter','Firestarter flames',sides('FLAMES',{shape:'spray',color:0xff6a1a,x:.22,y:.72,width:.4,height:.5,opacity:.9}),sides('FIRESTARTER',{shape:'text',color:0xffb31a,text:'FIRESTARTER',x:.62,y:.32,width:.62,height:.15})),
 set('inferno','Inferno',sides('INFERNO',{shape:'spray',color:0xd8261c,x:.5,y:.78,width:.95,height:.45,opacity:.85}),sides('HEAT',{shape:'spray',color:0xffa21a,x:.5,y:.86,width:.9,height:.28,opacity:.8})),
 set('banger-king','Banger king',sides('BANGER',{shape:'text',color:0xffd23a,text:'BANGER KING',x:.5,y:.3,width:.7,height:.16}),sides('STAR',{shape:'star',color:0xffd23a,x:.88,y:.3,width:.1,height:.25})),
 set('silverware','Champion’s crest',sides('CHAMPION',{shape:'text',color:0xd9dde0,text:'CHAMPION',x:.5,y:.3,width:.6,height:.16}),[layer('ROOF STAR',{shape:'star',face:'top',color:0xd9dde0,x:.5,y:.5,width:.26,height:.26})]),
];
export const badgeName=(id:string)=>ACHIEVEMENTS.find(a=>a.id===id)?.name??id;
export type TrophyDecal=BadgeDecal&{unlocked:boolean;hint:string};
export function trophyDecals(badges:readonly string[]|undefined):TrophyDecal[]{
 const have=new Set(badges??[]);
 return BADGE_DECALS.map(d=>({...d,unlocked:have.has(d.badge),hint:'Earn the '+badgeName(d.badge)+' badge'}));
}
