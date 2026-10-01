export type ClassicKind='muscle'|'wagon';
export const CLASSIC_VEHICLES={
 muscle:{name:'BRAMBLE V8',subtitle:'1970s muscle · 6.2 V8 · Rear-wheel drive',mass:1710,force:11100,halfLength:2.44,halfWidth:.914,wheelbase:2.82,color:0xaf542b,modelOffset:.8200195},
 wagon:{name:'MILLHAVEN ESTATE',subtitle:'1970s estate · 5.4 V8 · Rear-wheel drive',mass:1960,force:10500,halfLength:2.44,halfWidth:.914,wheelbase:2.82,color:0x739080,modelOffset:.8200195},
}as const;

export const isClassicKind=(kind:string):kind is ClassicKind=>kind==='muscle'||kind==='wagon';
export const classicWheelHalfTrack=(kind:ClassicKind)=>.79;
export function classicWheelAnchors(kind:ClassicKind){const d=CLASSIC_VEHICLES[kind];return{modelOffset:d.modelOffset,wheels:Array.from({length:4},(_,i)=>({x:(i%2?1:-1)*classicWheelHalfTrack(kind),y:.3400195,z:(i<2?1:-1)*d.wheelbase/2}))};}
export const classicEngineVoice=(kind:string)=>({bank:isClassicKind(kind)?'coupe':kind,pitch:kind==='muscle'?.88:kind==='wagon'?.76:1});
