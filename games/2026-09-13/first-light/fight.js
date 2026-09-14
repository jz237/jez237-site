// The fight, as forces on a line. The fish alternates runs, sulks, head-shakes and jumps; tension
// comes from how hard it pulls against the drag and how you hold the rod. Two ways to lose it:
// slack during a head-shake or jump lets the hook fall out, and overload past the weakest link
// (a reaction window of about a second in the red) breaks it. Side pressure turns a running fish.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function createFight({fish,rig,random}){
 // fish: {length, species, x,y,z}; rig: {dragKg, weakestKg, rodPower, lineStretch}
 const kg=fish.species.weightKg(fish.length);
 return {fish,rig,random,kg,state:'RUN',stateTime:0,stamina:1,hookHold:1,overload:0,tension:0,pull:0,runHeading:random()*6.283,jumpT:0,jumpY:0,lost:null,landed:false,elapsed:0,runsDone:0,maxTension:0,peakPullKg:0};
}
// input: {reeling:0..1, sidePressure:-1..1 (rod swept toward the fish's run side), rodUp:0..1}
// geom: {distToAngler, lineOut, depth}
export function stepFight(ft,dt,input,geom){
 const f=ft.fish,sp=f.species.fight;ft.elapsed+=dt;ft.stateTime+=dt;
 const size=clamp(ft.kg/2.5,.35,2.2); // a two and a half pound bass is the reference
 // state changes
 const fresh=ft.stamina;
 if(ft.state==='RUN'&&ft.stateTime>1.2+ft.random()*2.4*fresh){ft.state=ft.random()<sp.jumps*fresh*.6?'JUMP':ft.random()<sp.headshakes?'HEADSHAKE':'SULK';ft.stateTime=0;ft.runsDone++;}
 else if(ft.state==='SULK'&&ft.stateTime>1+ft.random()*2){ft.state=fresh>.35&&ft.random()<.7?'RUN':'HEADSHAKE';ft.stateTime=0;ft.runHeading+=(ft.random()-.5)*2.2;}
 else if(ft.state==='HEADSHAKE'&&ft.stateTime>.9+ft.random()*.8){ft.state=fresh>.3?'RUN':'SULK';ft.stateTime=0;ft.runHeading+=(ft.random()-.5)*1.6;}
 else if(ft.state==='JUMP'){ft.jumpT+=dt*1.6;if(ft.jumpT>=1){ft.state='RUN';ft.stateTime=0;ft.jumpT=0;ft.runHeading+=(ft.random()-.5)*2;}}
 if(ft.stamina<.15&&ft.state!=='JUMP')ft.state='TIRED';
 // pull force in kg-equivalent, against the drag; side pressure blunts a run
 const side=clamp(input.sidePressure||0,-1,1);
 let pull;switch(ft.state){case 'RUN':pull=size*(1.6+sp.runs*1.2)*(.5+.5*fresh)*(1-Math.abs(side)*.45);break;case 'SULK':pull=size*.9*(.4+.6*fresh);break;case 'HEADSHAKE':pull=size*(1.3+Math.sin(ft.stateTime*44)*1.1)*(.5+.5*fresh);break;case 'JUMP':pull=size*(ft.jumpT<.5?.3:2.4)*(.6+.4*fresh);break;default:pull=size*.35;}
 ft.pull=pull;ft.peakPullKg=Math.max(ft.peakPullKg,pull);
 // line tension: the fish pulling against drag and the angler's reeling; drag slips above its setting
 const reel=clamp(input.reeling||0,0,1);
 let tension=pull*(.3+.7*reel)+reel*.6*size;
 if(tension>ft.rig.dragKg){geom.lineOut+=(tension-ft.rig.dragKg)*.9*dt;tension=ft.rig.dragKg+(tension-ft.rig.dragKg)*.25;}
 // slack when the fish runs toward you or jumps and you keep the rod high
 const jumpSlack=ft.state==='JUMP'&&ft.jumpT>.35&&ft.jumpT<.8?(input.rodUp>.5?.75:.25):0;
 const towardYou=ft.state==='RUN'&&Math.cos(ft.runHeading)>.55&&reel<.5?.6:0;
 tension*=1-Math.max(jumpSlack,towardYou);
 ft.tension=tension;ft.maxTension=Math.max(ft.maxTension,tension);
 // stamina drains with tension held against it, recovers a little when slack
 ft.stamina=clamp(ft.stamina-dt*(.028*tension/size+.004*reel)+ (tension<.2?dt*.004:0),0,1);
 // failure modes
 const slack=tension<.24*size&&(ft.state==='HEADSHAKE'||(ft.state==='JUMP'&&ft.jumpT>.3));
 ft.hookHold=clamp(ft.hookHold+(slack?-dt*1.4:dt*.08),0,1);
 // paper mouth: a crappie horsed at more than 1.5x its own weight tears the hook out
 if(ft.fish.species&&ft.fish.species.paperMouth&&tension>ft.kg*1.5)ft.hookHold=clamp(ft.hookHold-dt*.7,0,1);
 if(ft.hookHold<=0){ft.lost='threw the hook';ft.state='LOST';}
 const overloaded=tension>ft.rig.weakestKg*.92;
 ft.overload=clamp(ft.overload+(overloaded?dt:-dt*1.5),0,2);
 if(ft.overload>=1){ft.lost='broke off';ft.state='LOST';}
 // teeth: an esocid on anything but a wire leader saws through the line at species.teeth per second
 const teeth=ft.fish.species&&ft.fish.species.teeth;if(teeth&&!ft.rig.wire&&ft.state!=='LOST'&&ft.random()<teeth*dt){ft.lost='bitten off';ft.state='LOST';}
 // fish motion request: direction and speed for the population layer
 const speed=ft.state==='RUN'?size*1.6*(1+fresh):ft.state==='TIRED'?.15:ft.state==='SULK'?.1:.5;
 geom.lineOut=Math.max(2,geom.lineOut-reel*ft.rig.retrieveMs*dt*(1-tension/(ft.rig.dragKg+.01))*.9);
 // landed: tired and close
 if(ft.state==='TIRED'&&geom.distToAngler<2.9)ft.landed=true;
 return {speed,heading:ft.runHeading,jump:ft.state==='JUMP'?Math.sin(ft.jumpT*Math.PI)*.45:0,tension,state:ft.state,lineOut:geom.lineOut};
}
