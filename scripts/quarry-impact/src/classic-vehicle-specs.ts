export type ClassicKind='muscle'|'wagon'|'utility'|'compact'|'van'|'tern'|'marten'|'buggy'|'shuttle'|'regent'|'trail'|'kite'|'morrow'|'alder'|'saber'|'starfin'|'tordal'|'linnet'|'pipit'|'ravenhill';
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
 regent:{name:'HARTWELL REGENT',subtitle:'1970s full-size saloon · 6.8 V8 · Rear-wheel drive',mass:2180,force:12100,halfLength:2.82,halfWidth:1.02,wheelbase:3.10,color:0x65714b,modelOffset:.85},
 trail:{name:'BIRCH TRAIL 4×4',subtitle:'1980s three-door 4×4 · 4.2 V8 · All-wheel drive',mass:2010,force:11100,halfLength:2.34,halfWidth:.99,wheelbase:2.70,color:0x827648,modelOffset:.92},
 kite:{name:'KITE 2000',subtitle:'1990s hot hatch · 2.0 inline-four · Front-wheel drive',mass:1160,force:8750,halfLength:2.04,halfWidth:.86,wheelbase:2.48,color:0x327b82,modelOffset:.84},
 morrow:{name:'MORROW 420',subtitle:'1980s coupe · 4.2 V8 · Rear-wheel drive',mass:1560,force:10100,halfLength:2.48,halfWidth:.93,wheelbase:2.72,color:0x713b42,modelOffset:.85},
 alder:{name:'ALDER 230',subtitle:'1980s estate · 2.3 inline four · Rear-wheel drive',mass:1430,force:8400,halfLength:2.48,halfWidth:.93,wheelbase:2.72,color:0xb29a65,modelOffset:.85},
 saber:{name:'SABER 2.0 GT',subtitle:'1980s liftback coupe · 2.0 twin-cam four · Rear-wheel drive',mass:1120,force:7900,halfLength:2.20,halfWidth:.86,wheelbase:2.42,color:0xb3261e,modelOffset:.8200195},
 starfin:{name:'STARFIN 58',subtitle:'1950s hardtop · 5.8 V8 · Rear-wheel drive',mass:1720,force:10600,halfLength:2.70,halfWidth:.98,wheelbase:3.0,color:0x2f9a96,modelOffset:.85},
 tordal:{name:'TORDAL 244',subtitle:'1980s saloon · 2.3 inline four · Rear-wheel drive',mass:1340,force:8100,halfLength:2.50,halfWidth:.88,wheelbase:2.64,color:0x2d4c7a,modelOffset:.84},
 linnet:{name:'LINNET 1300',subtitle:'1960s roadster · 1.3 inline four · Rear-wheel drive',mass:860,force:6400,halfLength:2.0,halfWidth:.80,wheelbase:2.30,color:0x1f5a3a,modelOffset:.8200195},
 pipit:{name:'PIPIT 600',subtitle:'1960s microcar · 0.6 rear twin · Rear-wheel drive',mass:560,force:4300,halfLength:1.5,halfWidth:.66,wheelbase:1.85,color:0x9cc7c0,modelOffset:.76},
 ravenhill:{name:'RAVENHILL HEARSE',subtitle:'1960s funeral coach · 6.4 V8 · Rear-wheel drive',mass:2150,force:10800,halfLength:2.95,halfWidth:.98,wheelbase:3.6,color:0x15171a,modelOffset:.85},
}as const;

export const isClassicKind=(kind:string):kind is ClassicKind=>kind==='ravenhill'||kind==='pipit'||kind==='linnet'||kind==='tordal'||kind==='starfin'||kind==='saber'||kind==='alder'||kind==='morrow'||kind==='kite'||kind==='muscle'||kind==='wagon'||kind==='utility'||kind==='compact'||kind==='van'||kind==='tern'||kind==='marten'||kind==='buggy'||kind==='shuttle'||kind==='regent'||kind==='trail';
export const classicWheelHalfTrack=(kind:ClassicKind)=>kind==='ravenhill'?.80:kind==='pipit'?.50:kind==='linnet'?.66:kind==='tordal'?.74:kind==='starfin'?.80:kind==='saber'?.71:kind==='alder'?.77:kind==='morrow'?.77:kind==='kite'?.72:kind==='trail'?.82:kind==='regent'?.86:kind==='shuttle'?.92:kind==='buggy'?.85:kind==='marten'?.665:kind==='tern'?.690:kind==='compact'?.655:kind==='van'?.805:.79;
export const vehicleWheelRadius=(kind:string)=>kind==='ravenhill'?.38:kind==='pipit'?.26:kind==='linnet'?.32:kind==='tordal'?.34:kind==='starfin'?.38:kind==='saber'?.32:kind==='alder'?.38:kind==='morrow'?.38:kind==='kite'?.34:kind==='trail'?.42:kind==='regent'?.38:kind==='shuttle'?.43:kind==='buggy'?.38:kind==='compact'||kind==='tern'||kind==='marten'?.32:.375;
export function classicWheelAnchors(kind:ClassicKind){const d=CLASSIC_VEHICLES[kind];return{modelOffset:d.modelOffset,wheels:Array.from({length:4},(_,i)=>({x:(i%2?1:-1)*classicWheelHalfTrack(kind),y:kind==='ravenhill'?.39:kind==='pipit'?.28:kind==='tordal'?.36:kind==='starfin'?.39:kind==='alder'?.39:kind==='morrow'?.39:kind==='kite'?.36:kind==='trail'?.43:kind==='regent'?.36:kind==='shuttle'?.42:kind==='buggy'?.40:.3400195,z:(i<2?1:-1)*d.wheelbase/2}))};}
export const classicEngineVoice=(kind:string)=>({bank:kind==='pipit'||kind==='linnet'||kind==='tordal'||kind==='saber'||kind==='alder'||kind==='kite'||kind==='compact'||kind==='van'||kind==='tern'||kind==='marten'||kind==='buggy'?'hatch':isClassicKind(kind)?'coupe':kind,pitch:kind==='ravenhill'?.78:kind==='pipit'?1.2:kind==='linnet'?1.08:kind==='tordal'?.94:kind==='starfin'?.86:kind==='saber'?1.1:kind==='alder'?.96:kind==='morrow'?.93:kind==='kite'?1.07:kind==='trail'?.86:kind==='regent'?.72:kind==='shuttle'?.65:kind==='buggy'?1.01:kind==='muscle'?.88:kind==='wagon'?.76:kind==='utility'?.82:kind==='compact'?1.12:kind==='van'?.86:kind==='tern'?1.04:kind==='marten'?.94:1});

/** Authored rear-mounted layouts: air-cooled flat-fours and the Pipit's twin. */
export const isRearEngineKind=(kind:string)=>kind==='marten'||kind==='buggy'||kind==='pipit';

export const isFrontDriveKind=(kind:string)=>kind==='tern'||kind==='kite';
