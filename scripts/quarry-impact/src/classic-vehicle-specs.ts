export type ClassicKind='muscle'|'wagon'|'utility'|'compact'|'van';
export const CLASSIC_VEHICLES={
 muscle:{name:'BRAMBLE V8',subtitle:'1970s muscle · 6.2 V8 · Rear-wheel drive',mass:1710,force:11100,halfLength:2.44,halfWidth:.914,wheelbase:2.82,color:0xaf542b,modelOffset:.8200195},
 wagon:{name:'MILLHAVEN ESTATE',subtitle:'1970s estate · 5.4 V8 · Rear-wheel drive',mass:1960,force:10500,halfLength:2.44,halfWidth:.914,wheelbase:2.82,color:0x739080,modelOffset:.8200195},
 utility:{name:'IRONVALE UTILITY',subtitle:'1970s utility · 5.7 V8 · Rear-wheel drive',mass:1840,force:10600,halfLength:3.0,halfWidth:.914,wheelbase:3.05,color:0x537c8a,modelOffset:.8200195},
 compact:{name:'ROOK 1100',subtitle:'1970s compact · 1.1 inline-four · Rear-wheel drive',mass:1040,force:6200,halfLength:1.86,halfWidth:.78,wheelbase:2.18,color:0x587578,modelOffset:.8200195},
 van:{name:'RILLFORD CARRIER',subtitle:'1970s panel van · 2.4 inline-four · Rear-wheel drive',mass:1850,force:9300,halfLength:2.34,halfWidth:.94,wheelbase:2.70,color:0xc3b28c,modelOffset:.8200195},
}as const;

export const isClassicKind=(kind:string):kind is ClassicKind=>kind==='muscle'||kind==='wagon'||kind==='utility'||kind==='compact'||kind==='van';
export const classicWheelHalfTrack=(kind:ClassicKind)=>kind==='compact'?.655:kind==='van'?.805:.79;
export const vehicleWheelRadius=(kind:string)=>kind==='compact'?.32:.375;
export function classicWheelAnchors(kind:ClassicKind){const d=CLASSIC_VEHICLES[kind];return{modelOffset:d.modelOffset,wheels:Array.from({length:4},(_,i)=>({x:(i%2?1:-1)*classicWheelHalfTrack(kind),y:.3400195,z:(i<2?1:-1)*d.wheelbase/2}))};}
export const classicEngineVoice=(kind:string)=>({bank:kind==='compact'||kind==='van'?'hatch':isClassicKind(kind)?'coupe':kind,pitch:kind==='muscle'?.88:kind==='wagon'?.76:kind==='utility'?.82:kind==='compact'?1.12:kind==='van'?.86:1});
