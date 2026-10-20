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
 // Pectoral rowing carries ordinary patrols; the tail joins in bursts and displays.
 rostratum:{cruiseBL:[.42,.85],burstBL:2.2,finHz:1.7,tailHz:.9,rest:[.8,2],restChance:.3,night:.4,turnRate:1.55,curve:.8,wave:.42,perceptionBL:4.6,stroke:[2.4,5],coast:[.8,1.7],schooling:null},
 semilarvatus:{cruiseBL:[.36,.72],burstBL:1.65,finHz:1.8,tailHz:.88,rest:[1.4,3.8],restChance:.76,night:.85,turnRate:1.7,curve:.98,wave:.85,perceptionBL:3.6,stroke:[1.4,3.5],coast:[.6,1.3],schooling:null},
 clown:{cruiseBL:[.4,.85],burstBL:2.6,finHz:1.9,tailHz:1.45,rest:[.8,2.4],restChance:.7,night:.35,turnRate:2.65,curve:1.4,wave:1.15,perceptionBL:3.7,stroke:[1.1,2.5],coast:[.35,.8],schooling:null},
 anthias:{cruiseBL:[.5,1.0],burstBL:2.5,finHz:2.15,tailHz:1.55,rest:[1,3.2],restChance:.8,night:.32,turnRate:2.15,curve:1.1,wave:.92,perceptionBL:5.8,stroke:[.8,2.1],coast:[.4,1.1],schooling:'station'},
 chromis:{cruiseBL:[.65,1.25],burstBL:2.7,finHz:2.25,tailHz:1.65,rest:[.5,1.6],restChance:.14,night:.3,turnRate:2.3,curve:1.15,wave:1,perceptionBL:5.8,stroke:[1.1,2.8],coast:[.4,1],schooling:'shoal'},
 gramma:{cruiseBL:[.28,.6],burstBL:2.15,finHz:1.9,tailHz:1.2,rest:[1.8,4.5],restChance:.85,night:.35,turnRate:2.1,curve:1.2,wave:.88,perceptionBL:3.4,stroke:[.9,2.1],coast:[.45,1.2],schooling:null},
 goby:{cruiseBL:[.22,.5],burstBL:1.2,finHz:2.3,tailHz:.55,rest:[4.5,8.5],restChance:.9,night:.6,turnRate:1.65,curve:1.6,wave:.55,perceptionBL:2.8,stroke:[.5,1.2],coast:[.7,1.5],schooling:null},
 // Gallery options. Rhythms are illustrative, chosen from published natural history.
 strigosus:{cruiseBL:[.4,.85],burstBL:2.2,finHz:1.85,tailHz:.95,rest:[.5,1.4],restChance:.2,night:.4,turnRate:1.7,curve:.85,wave:.45,perceptionBL:4.4,stroke:[2,4.5],coast:[.6,1.4],schooling:null},
 vulpinus:{cruiseBL:[.28,.62],burstBL:1.9,finHz:1.4,tailHz:.8,rest:[1.5,3.5],restChance:.55,night:.35,turnRate:1.4,curve:.8,wave:.6,perceptionBL:4,stroke:[2,4],coast:[.9,2],schooling:null},
 bispinosa:{cruiseBL:[.35,.8],burstBL:2.6,finHz:2.4,tailHz:1.3,rest:[.6,1.6],restChance:.5,night:.35,turnRate:2.4,curve:1.2,wave:.7,perceptionBL:3.6,stroke:[.8,2],coast:[.4,.9],schooling:null},
 loricula:{cruiseBL:[.35,.8],burstBL:2.6,finHz:2.4,tailHz:1.3,rest:[.6,1.6],restChance:.5,night:.35,turnRate:2.4,curve:1.2,wave:.7,perceptionBL:3.6,stroke:[.8,2],coast:[.4,.9],schooling:null},
 hexataenia:{cruiseBL:[.5,1.1],burstBL:3.2,finHz:2.9,tailHz:1.5,rest:[.3,.9],restChance:.45,night:.3,turnRate:3,curve:1.5,wave:.8,perceptionBL:3.4,stroke:[.5,1.4],coast:[.3,.7],schooling:null},
 cinctus:{cruiseBL:[.3,.7],burstBL:3,finHz:2.2,tailHz:1.6,rest:[3,8],restChance:.9,night:.5,turnRate:2,curve:1.4,wave:1,perceptionBL:3.2,stroke:[.4,.9],coast:[.5,1.2],schooling:null},
};
/** Species habits beyond the shared swimming profile. Species without an entry
 * keep their established behavior exactly. Values are illustrative.
 * graze: bouts of bites at reef faces (range limits sites to a home territory).
 * rivals/display: who provokes a broadside fin display, a short chase, or a
 * defensive spine display with camouflage. sails: median fins fold with speed.
 * labriform: pectoral rowing carries patrols. home: a persistent reef shelter
 * with short excursions; retreat: back to it when a larger fish comes close.
 * graze.surface limits sites to rock or to coral (default either); labels name
 * the approach and the feeding bout. plankton: strikes at single drifting
 * particles (interval in s, reach in body lengths). guard: a display or chase
 * happens only within this distance of the fish's post (its shelter, or a
 * clown's anemone), against intruders in it; chaseLabel names that chase. */
export type MarineHabits={
 graze?:{chance:number;bites:[number,number];interval:[number,number];stroke:number;range?:number;surface?:'rock'|'coral';labels?:[string,string]};
 plankton?:{interval:[number,number];reach:[number,number]};guard?:number;chaseLabel?:string;
 rivals?:MarineSpecies[];display?:'broadside'|'chase'|'spines';displayGap?:number;displayCooldown?:[number,number];
 sails?:boolean;labriform?:boolean;home?:number;retreat?:boolean;camouflage?:boolean;cocoon?:boolean;
};
export const marineHabits:Partial<Record<MarineSpecies,MarineHabits>>={
 // Blue tangs scrape algae from rock and take drifting plankton; meeting other
 // tangs they spar with brief broadside displays.
 tang:{graze:{chance:.5,bites:[2,5],interval:[.6,1.2],stroke:.3,surface:'rock'},plankton:{interval:[7,15],reach:[.3,.7]},rivals:['tang','rostratum','strigosus'],display:'broadside',displayCooldown:[30,55]},
 // Golden butterflyfish work slowly over coral heads, nipping polyps.
 semilarvatus:{graze:{chance:.75,bites:[3,6],interval:[.75,1.5],stroke:.3,surface:'coral',labels:['inspecting coral','picking at coral']}},
 // Clownfish charge fish that come into their anemone, then return to it.
 clown:{rivals:['tang','rostratum','semilarvatus','anthias','chromis','gramma','strigosus','vulpinus','bispinosa','loricula','hexataenia'],display:'chase',displayGap:.3,displayCooldown:[14,28],guard:1.1,chaseLabel:'defending its anemone'},
 // Anthias and chromis hover near the reef and strike single drifting prey.
 anthias:{plankton:{interval:[2.2,5.5],reach:[.4,.9]}},
 chromis:{plankton:{interval:[3,8],reach:[.35,.8]}},
 // The gramma picks plankton beside its ledge and chases small fish away from it.
 gramma:{plankton:{interval:[4,9],reach:[.35,.7]},rivals:['chromis','anthias','clown','gramma','hexataenia'],display:'chase',displayGap:.4,displayCooldown:[16,32],guard:.75,chaseLabel:'guarding its ledge'},
 rostratum:{graze:{chance:.62,bites:[3,7],interval:[.55,1.15],stroke:.4,surface:'rock'},rivals:['tang','rostratum','strigosus'],display:'broadside',sails:true,labriform:true},
 // Bristle-toothed: nearly constant, rapid scraping of film from rock.
 strigosus:{graze:{chance:.88,bites:[7,13],interval:[.22,.42],stroke:.25,surface:'rock'},rivals:['tang','rostratum','strigosus'],display:'broadside',sails:true,labriform:true},
 // Algae grazer; threatened, it raises venomous spines toward the intruder and darkens.
 vulpinus:{graze:{chance:.55,bites:[3,6],interval:[.7,1.4],stroke:.3,surface:'rock'},rivals:['tang','rostratum','strigosus','vulpinus'],display:'spines',displayGap:.35,displayCooldown:[30,50],sails:true,labriform:true,camouflage:true},
 // Dwarf angels graze around their own rockwork and spar with other Centropyge.
 bispinosa:{graze:{chance:.72,bites:[2,5],interval:[.45,.9],stroke:.35,range:1.5,surface:'rock'},rivals:['bispinosa','loricula'],display:'chase',labriform:true,home:1.6,retreat:true},
 loricula:{graze:{chance:.72,bites:[2,5],interval:[.45,.9],stroke:.35,range:1.5,surface:'rock'},rivals:['bispinosa','loricula'],display:'chase',labriform:true,home:1.6,retreat:true},
 // Secretive pod hunter among the rock; sleeps in a mucus cocoon in a cavity.
 hexataenia:{graze:{chance:.8,bites:[1,3],interval:[.35,.7],stroke:.45,range:1.1,surface:'rock'},rivals:['hexataenia'],display:'chase',labriform:true,home:1.2,retreat:true,cocoon:true},
};
