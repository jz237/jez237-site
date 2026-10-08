export type ClassicKind='muscle'|'wagon'|'utility'|'compact'|'van'|'tern'|'marten'|'buggy'|'shuttle';
export const CLASSIC_VEHICLES={
 muscle:{name:'BRAMBLE V8',subtitle:'1970s muscle · 6.2 V8 · Rear-wheel drive',mass:1710,force:11100,halfLength:2.44,halfWidth:.914,wheelbase:2.82,color:0xaf542b,modelOffset:.8200195},
 wagon:{name:'MILLHAVEN ESTATE',subtitle:'1970s estate · 5.4 V8 · Rear-wheel drive',mass:1960,force:10500,halfLength:2.44,halfWidth:.914,wheelbase:2.82,color:0x739080,modelOffset:.8200195},
 utility:{name:'IRONVALE UTILITY',subtitle:'1970s utility · 5.7 V8 · Rear-wheel drive',mass:1840,force:10600,halfLength:3.0,halfWidth:.914,wheelbase:3.05,color:0x537c8a,modelOffset:.8200195},
 compact:{name:'ROOK 1100',subtitle:'1970s compact · 1.1 inline-four · Rear-wheel drive',mass:1040,force:6200,halfLength:1.86,halfWidth:.78,wheelbase:2.18,color:0x587578,modelOffset:.8200195},
 van:{name:'RILLFORD CARRIER',subtitle:'1970s panel van · 2.4 inline-four · Rear-wheel drive',mass:1850,force:9300,halfLength:2.34,halfWidth:.94,wheelbase:2.70,color:0xc3b28c,modelOffset:.8200195},
 tern:{name:'TERN 1400',subtitle:'1980s hatchback · 1.4 inline-four · Front-wheel drive',mass:1080,force:7400,halfLength:1.95,halfWidth:.82,wheelbase:2.36,color:0x9b4d38,modelOffset:.8200195},
 marten:{name:'MARTEN 1600',subtitle:'1960s coupe · 1.6 flat-four · Rear-engine / rear-wheel drive',mass:925,force:6650,halfLength:2.10,halfWidth:.80,wheelbase:2.28,color:0x6e929a,modelOffset:.8200195},
 buggy:{name:'RAVINE 1800',subtitle:'Open-frame buggy · 1.8 flat-four · Rear-engine / rear-wheel drive',mass:760,force:5900,halfLength:1.82,halfWidth:1.00,wheelbase:2.40,color:0xd9a63b,modelOffset:.96},
 shuttle:{name:'CALDER SHUTTLE',subtitle:'1980s minibus · 4.0 diesel six · Rear-wheel drive',mass:3300,force:14200,halfLength:3.15,halfWidth:1.07,wheelbase:3.80,color:0xc7a64d,modelOffset:.90},
}as const;

export const isClassicKind=(kind:string):kind is ClassicKind=>kind==='muscle'||kind==='wagon'||kind==='utility'||kind==='compact'||kind==='van'||kind==='tern'||kind==='marten'||kind==='buggy'||kind==='shuttle';
export const classicWheelHalfTrack=(kind:ClassicKind)=>kind==='shuttle'?.92:kind==='buggy'?.85:kind==='marten'?.665:kind==='tern'?.690:kind==='compact'?.655:kind==='van'?.805:.79;
export const vehicleWheelRadius=(kind:string)=>kind==='shuttle'?.43:kind==='buggy'?.38:kind==='compact'||kind==='tern'||kind==='marten'?.32:.375;
export function classicWheelAnchors(kind:ClassicKind){const d=CLASSIC_VEHICLES[kind];return{modelOffset:d.modelOffset,wheels:Array.from({length:4},(_,i)=>({x:(i%2?1:-1)*classicWheelHalfTrack(kind),y:kind==='shuttle'?.42:kind==='buggy'?.40:.3400195,z:(i<2?1:-1)*d.wheelbase/2}))};}
export const classicEngineVoice=(kind:string)=>({bank:kind==='compact'||kind==='van'||kind==='tern'||kind==='marten'||kind==='buggy'?'hatch':isClassicKind(kind)?'coupe':kind,pitch:kind==='shuttle'?.65:kind==='buggy'?1.01:kind==='muscle'?.88:kind==='wagon'?.76:kind==='utility'?.82:kind==='compact'?1.12:kind==='van'?.86:kind==='tern'?1.04:kind==='marten'?.94:1});

/** Authored rear-mounted air-cooled flat-four layouts. */
export const isRearEngineKind=(kind:string)=>kind==='marten'||kind==='buggy';
