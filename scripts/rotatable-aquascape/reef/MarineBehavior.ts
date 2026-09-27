import type {MarineSpecies} from './MarineModels.ts';

/** Authored animation parameters, informed by the sources in qa/SWIMMING-RESEARCH.md.
 * BL is the model's one-unit trunk length, not measured animal total length.
 * These are illustrative display speeds and rhythms, not physiological data. */
export type MarineBehavior={
 cruiseBL:[number,number];burstBL:number;finHz:number;tailHz:number;
 rest:[number,number];restChance:number;night:number;turnRate:number;curve:number;
 wave:number;perceptionBL:number;stroke:[number,number];coast:[number,number];
 schooling:'shoal'|'station'|null;
};
export const marineBehavior:Record<MarineSpecies,MarineBehavior>={
 tang:{cruiseBL:[.65,1.15],burstBL:2.3,finHz:1.45,tailHz:1.05,rest:[.6,1.8],restChance:.22,night:.42,turnRate:1.5,curve:.85,wave:1,perceptionBL:4.8,stroke:[2.8,5.8],coast:[.7,1.5],schooling:null},
 semilarvatus:{cruiseBL:[.36,.72],burstBL:1.65,finHz:1.8,tailHz:.88,rest:[1.4,3.8],restChance:.76,night:.85,turnRate:1.7,curve:.98,wave:.85,perceptionBL:3.6,stroke:[1.4,3.5],coast:[.6,1.3],schooling:null},
 clown:{cruiseBL:[.4,.85],burstBL:2.6,finHz:1.9,tailHz:1.45,rest:[.8,2.4],restChance:.7,night:.35,turnRate:2.65,curve:1.4,wave:1.15,perceptionBL:3.7,stroke:[1.1,2.5],coast:[.35,.8],schooling:null},
 anthias:{cruiseBL:[.5,1.0],burstBL:2.5,finHz:2.15,tailHz:1.55,rest:[1,3.2],restChance:.8,night:.32,turnRate:2.15,curve:1.1,wave:.92,perceptionBL:5.8,stroke:[.8,2.1],coast:[.4,1.1],schooling:'station'},
 chromis:{cruiseBL:[.65,1.25],burstBL:2.7,finHz:2.25,tailHz:1.65,rest:[.5,1.6],restChance:.14,night:.3,turnRate:2.3,curve:1.15,wave:1,perceptionBL:5.8,stroke:[1.1,2.8],coast:[.4,1],schooling:'shoal'},
 gramma:{cruiseBL:[.28,.6],burstBL:2.15,finHz:1.9,tailHz:1.2,rest:[1.8,4.5],restChance:.85,night:.35,turnRate:2.1,curve:1.2,wave:.88,perceptionBL:3.4,stroke:[.9,2.1],coast:[.45,1.2],schooling:null},
 goby:{cruiseBL:[.22,.5],burstBL:1.2,finHz:2.3,tailHz:.55,rest:[4.5,8.5],restChance:.9,night:.6,turnRate:1.65,curve:1.6,wave:.55,perceptionBL:2.8,stroke:[.5,1.2],coast:[.7,1.5],schooling:null},
};
