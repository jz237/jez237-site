// Tackle as real ratings. A rig is a rod, reel, line and lure whose limits must nest: the weakest
// link is what fails first under load, a lure outside the rod's range casts badly, and (from M3)
// hook size gates which mouths can take it. Pure module, node-testable.
export const LURES={
 walker:{id:'walker',name:'Bone walker',family:'topwater',massG:14,buoyancy:'float',sinkRate:0,diveDepth:0,drag:.9,action:'walk',color:0xe9e3cf,length:.11,radius:.014},
 worm:{id:'worm',name:'Texas-rigged worm, 3/8 oz',family:'soft',massG:14,buoyancy:'sink',sinkRate:.45,diveDepth:0,drag:1.1,action:'hop',color:0x4d5a2a,length:.18,radius:.007},
 squarebill:{id:'squarebill',name:'Squarebill crankbait',family:'crank',massG:11,buoyancy:'crank',sinkRate:0,diveDepth:1.6,drag:1.4,action:'wobble',color:0xd8b04a,length:.065,radius:.016},
 bucktail:{id:'bucktail',name:'Double-blade bucktail',family:'blade',massG:60,buoyancy:'sink',sinkRate:.35,diveDepth:0,drag:1.6,action:'thump',color:0x2a2a2e,length:.20,radius:.02},
 nightcrawler:{id:'nightcrawler',name:'Nightcrawler under a float',family:'bait',massG:8,buoyancy:'sink',sinkRate:.25,floatDepth:.9,diveDepth:0,drag:1.2,action:'hang',color:0x8a5a4a,length:.06,radius:.006},
 cutbait:{id:'cutbait',name:'Cut bait on a sinker',family:'bait',massG:26,buoyancy:'sink',sinkRate:1.3,diveDepth:0,drag:1.5,action:'rest',color:0x9a7a6a,length:.05,radius:.012,circle:true}
};
export const RODS={
 ml:{id:'ml',name:'6\'6" medium-light, fast',lureG:[3.5,14],lineKg:[2.7,5.4],power:.35,length:1.98},
 mh:{id:'mh',name:'7\' medium-heavy, fast',lureG:[10,28],lineKg:[5.4,9],power:.6,length:2.13},
 xh:{id:'xh',name:'8\'6" heavy musky rod',lureG:[30,120],lineKg:[18,45],power:.9,length:2.6}
};
export const REELS={
 spin2500:{id:'spin2500',name:'2500 spinning reel',maxDragKg:5,dragKg:2.2,retrieveMs:1.05},
 bc71:{id:'bc71',name:'7.1:1 baitcaster',maxDragKg:8,dragKg:4,retrieveMs:1.25},
 bc400:{id:'bc400',name:'400-size low-profile reel',maxDragKg:12,dragKg:7,retrieveMs:1.5}
};
export const LINES={
 fluoro8:{id:'fluoro8',name:'8 lb fluorocarbon',testKg:3.6,buoyancy:-.6,stretch:.12,visibility:.3},
 mono10:{id:'mono10',name:'10 lb monofilament',testKg:4.5,buoyancy:.4,stretch:.2,visibility:.5},
 braid15:{id:'braid15',name:'15 lb braid, 12 lb fluoro leader',testKg:6.8,leaderKg:5.4,buoyancy:.1,stretch:.04,visibility:.7},
 braid80:{id:'braid80',name:'80 lb braid, wire leader',testKg:36,leaderKg:40,wire:true,buoyancy:.1,stretch:.03,visibility:.9},
 mono6:{id:'mono6',name:'6 lb monofilament',testKg:2.7,buoyancy:.4,stretch:.2,visibility:.4},
 mono15:{id:'mono15',name:'15 lb monofilament',testKg:6.8,buoyancy:.4,stretch:.2,visibility:.6}
};
export const RIGS=[
 {id:'finesse',name:'Finesse spinning',rod:'ml',reel:'spin2500',line:'fluoro8',lure:'worm',hook:'2/0 EWG'},
 {id:'topwater',name:'Topwater casting',rod:'mh',reel:'bc71',line:'mono10',lure:'walker',hook:'#4 trebles'},
 {id:'crank',name:'Squarebill casting',rod:'mh',reel:'bc71',line:'braid15',lure:'squarebill',hook:'#6 trebles'},
 {id:'musky',name:'Musky casting',rod:'xh',reel:'bc400',line:'braid80',lure:'bucktail',hook:'5/0 trebles'},
 {id:'float',name:'Float rig',rod:'ml',reel:'spin2500',line:'mono6',lure:'nightcrawler',hook:'#6 baitholder'},
 {id:'bottom',name:'Bottom rig',rod:'mh',reel:'bc71',line:'mono15',lure:'cutbait',hook:'3/0 circle'}
];
export function rigParts(rig){return {rod:RODS[rig.rod],reel:REELS[rig.reel],line:LINES[rig.line],lure:LURES[rig.lure]};}
// The chain: every component's breaking or slipping load in kg, sorted weakest first. The rod
// entry is the load past which a rod rated for that line class is being abused.
export function weakestLink(rig){
 const p=rigParts(rig);
 const chain=[{part:'line',kg:p.line.testKg},{part:'drag',kg:p.reel.dragKg},{part:'rod',kg:p.rod.lineKg[1]*1.3}];
 if(p.line.leaderKg)chain.push({part:'leader',kg:p.line.leaderKg});
 chain.sort((a,b)=>a.kg-b.kg);
 const lureFit=p.lure.massG>=p.rod.lureG[0]&&p.lure.massG<=p.rod.lureG[1];
 const lineFit=p.line.testKg>=p.rod.lineKg[0]&&p.line.testKg<=p.rod.lineKg[1]+1.5;
 return {weakest:chain[0],chain,lureFit,lineFit,castEfficiency:lureFit?1:(p.lure.massG<p.rod.lureG[0]?.55:.8)};
}
export function describeRig(rig){const p=rigParts(rig),w=weakestLink(rig);return `${p.rod.name} · ${p.reel.name} · ${p.line.name} · ${p.lure.name} (${rig.hook}) · weakest link: ${w.weakest.part} ${w.weakest.kg.toFixed(1)} kg${w.lureFit?'':' · lure outside rod range'}`;}
