// Authored reconstruction from course observations, in metres. Map coordinates
// describe geography, not a texture or mesh extracted from the Nintendo game.
// Source/remaining fidelity checks: COURSE-MATCH.md.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function fromMap(points,cx,cy,scale=.75){return points.map(([x,z])=>[(x-cx)*scale,(z-cy)*scale]);}
export function polygonDistance(points,x,z){let inside=false,d=Infinity;for(let i=0,j=points.length-1;i<points.length;j=i++){
 const a=points[j],b=points[i],dx=b[0]-a[0],dz=b[1]-a[1],t=clamp(((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz),0,1);
 d=Math.min(d,Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t));if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])inside=!inside;
 }return inside?-d:d;
}
const sunny={
 name:'Sunny Beach',theme:'beach',tag:'01 / SUNNY BEACH',layoutRevision:2,
 description:'A long sandbar separates two fast straights. Round the tight ends, keep clear of the beach, and thread the buoys.',
 anchors:[[38,32],[39,-55],[35,-133],[19,-166],[-8,-168],[-31,-145],[-36,-60],[-37,44],[-32,137],[-12,166],[12,168],[31,146],[39,88]],
 ground(x,z){const axisZ=clamp(z,-143,143),width=10.5+1.8*Math.cos(z*.015),bar=3.3-Math.hypot(x,z-axisZ)*3.3/width;
 const beach=clamp((x-(76+4*Math.cos(z*.014)))*.18,-10,9);return Math.max(-9,bar,beach);},
 obstacles:[],resistance:[],raceRamps:[]
};
const sunsetLand=fromMap([[176,55],[189,70],[190,105],[227,149],[247,182],[242,227],[249,280],[240,307],[250,343],[310,399],[345,420],[430,438],[461,443],[459,454],[193,455],[174,432],[165,340],[168,247],[170,184]],245,275);
const sunset={
 name:'Sunset Bay',theme:'resort',tag:'02 / SUNSET BAY',layoutRevision:2,
 description:'Orange evening water wraps around an L-shaped island. A race ramp offers a jump beside the pier-lined western straight.',
 anchors:fromMap([[290,302],[281,222],[258,163],[217,80],[194,49],[167,52],[142,93],[131,165],[103,190],[99,219],[117,260],[140,333],[158,402],[180,458],[268,495],[366,515],[435,494],[468,455],[448,420],[385,398],[317,376],[298,350]],245,275),
 ground(x,z){return clamp(-polygonDistance(sunsetLand,x,z)*.48,-10,5);},
 obstacles:[],resistance:[],raceRamps:[{id:100,name:'SUNSET JUMP',x:(130-245)*.75,z:(198-275)*.75,tx:0,tz:1,width:12,length:17,height:2.1,floating:false}],
 piers:[{x:(133-245)*.75,z:(144-275)*.75,tx:1,tz:0,length:61,width:3.2,deck:1.4},{x:(132-245)*.75,z:(299-275)*.75,tx:1,tz:0,length:68,width:3.2,deck:1.4}]
};
const lakeLand=fromMap([[67,108],[104,98],[174,116],[229,109],[320,76],[334,107],[329,194],[345,246],[326,295],[294,329],[273,348],[228,351],[173,343],[126,368],[77,350],[70,293],[63,254],[72,215],[62,174]],200,240);
const lakeIsland=fromMap([[127,72],[166,63],[207,66],[252,85],[224,96],[193,99],[153,88]],200,240);
const lakeOuter=fromMap([[40,73],[87,38],[170,38],[247,34],[326,18],[377,37],[399,100],[395,215],[399,295],[372,343],[342,398],[274,419],[218,450],[153,458],[92,418],[38,354],[9,272],[16,204],[6,151]],200,240);
const lake={
 name:'Drake Lake',theme:'lake',tag:'03 / DRAKE LAKE',layoutRevision:2,
 description:'A misty freshwater circuit with irregular wooded banks, a small island, timber posts and weed beds that slow a wet hull.',
 anchors:fromMap([[374,274],[366,188],[366,91],[341,60],[306,63],[246,54],[178,54],[122,61],[84,67],[59,86],[31,160],[40,212],[31,269],[52,325],[74,372],[123,404],[186,416],[243,407],[307,376],[356,336]],200,240),
 ground(x,z){return clamp(Math.max(-polygonDistance(lakeLand,x,z),-polygonDistance(lakeIsland,x,z),polygonDistance(lakeOuter,x,z))*.4,-8,13);},
 obstacles:fromMap([[182,381],[224,370],[254,355],[267,373],[290,382],[269,401],[240,391],[214,392]],200,240).map(([x,z])=>({x,z,r:.45,type:'post'})),
 resistance:[{x:(320-200)*.75,z:(352-240)*.75,rx:13,rz:9,drag:.75},{x:(129-200)*.75,z:(88-240)*.75,rx:12,rz:5,drag:.65}],raceRamps:[]
};
const fortMap=points=>fromMap(points,210,300,.8);
const fortLand=fortMap([[110,135],[111,84],[117,74],[123,83],[127,121],[139,153],[159,176],[203,189],[293,200],[360,215],[370,225],[319,228],[267,228],[267,264],[259,292],[268,430],[249,467],[216,491],[132,507],[104,500],[108,360],[125,351],[136,290],[151,274],[159,277],[180,277],[194,261],[207,263],[207,244],[181,250],[153,264],[130,286],[119,330],[110,339],[106,325],[107,166],[43,155],[41,143],[57,135]]);
const fortCrates=fortMap([[261,172],[295,195],[334,200],[247,179],[274,181],[307,194],[322,207],[351,205],[177,298],[94,328]]);
const fort={
 name:'Marine Fortress',theme:'fortress',tag:'04 / MARINE FORTRESS',layoutRevision:2,
 description:'Rough grey water around a stone fort. Floating crates crowd the eastern arm; Hard and above open a curved inner route after the first lap.',
 anchors:fortMap([[81,273],[81,192],[53,178],[37,156],[38,128],[54,89],[79,68],[104,60],[125,63],[148,94],[176,144],[201,160],[264,179],[337,185],[374,204],[384,227],[373,247],[307,251],[290,270],[283,345],[279,423],[260,466],[225,493],[168,510],[105,516],[81,499],[76,461],[80,360]]),
 ground(x,z){return clamp(-polygonDistance(fortLand,x,z)*.7,-11,6.5);},
 obstacles:fortCrates.slice(0,3).map(([x,z])=>({x,z,r:1.0,type:'crate'})),
 extraObstacles:fortCrates.slice(3).map(([x,z])=>({x,z,r:1.05,type:'crate'})),
 resistance:[],raceRamps:[],
 shortcut:{kind:'gate',from:fortMap([[307,251]])[0],to:fortMap([[81,310]])[0],width:7,clearance:5.5,
  via:fortMap([[258,246],[207,253],[173,268],[153,293],[134,327],[117,343],[99,338],[83,326]]),
  structure:fortMap([[179,263],[143,310]])},
 fortWalls:fortMap([[117,100],[140,172],[227,202],[337,218],[249,263],[249,420],[228,467],[143,490],[123,384]])
};
const portMap=points=>fromMap(points,220,285,.8);
const portShip=portMap([[119,103],[145,103],[163,132],[165,276],[160,409],[145,461],[124,492],[103,466],[89,426],[89,158],[104,117]]);
const portDock=portMap([[200,95],[330,96],[331,124],[371,164],[373,223],[331,266],[331,283],[295,283],[282,271],[280,230],[260,204],[231,205],[231,189],[260,161],[261,136],[239,111],[204,111]]);
const portNorth=portMap([[90,-120],[600,-120],[600,120],[400,99],[369,66],[333,67],[330,77],[199,77],[174,40],[162,35],[110,35],[91,17]]);
const portRamp=(id,x,z,width,length=12)=>({id,name:'BOW JUMP',x:(x-220)*.8,z:(z-285)*.8,tx:-.36,tz:Math.sqrt(1-.36*.36),width,length,height:2.1,floating:false});
const portSmallRamps=[[165,476],[188,461],[202,442]].map(([x,z],i)=>portRamp(110+i,x,z,10));
const port={
 boundary:portMap([[10,80],[30,22],[65,7],[89,7],[90,36],[164,36],[199,77],[330,77],[333,66],[368,66],[430,127],[430,259],[369,320],[235,320],[235,532],[210,563],[35,563],[9,543]]),
 name:'Port Blue',theme:'port',tag:'05 / PORT BLUE',layoutRevision:2,
 description:'A long tanker divides the harbor. Normal uses the outer dock basin. Hard offers both routes; Expert and Reverse require the winding inner channel.',
 anchors:portMap([[60,260],[60,184],[69,140],[87,103],[123,84],[200,82],[315,86],[348,105],[386,157],[391,214],[366,260],[337,292],[290,300],[244,294],[195,291],[175,325],[167,417],[148,471],[124,500],[96,480],[79,438],[65,355]]),
 expertAnchors:portMap([[60,260],[60,184],[69,140],[87,103],[123,84],[162,101],[194,114],[227,120],[246,137],[249,155],[236,171],[220,186],[216,203],[222,214],[245,213],[263,222],[272,243],[273,270],[254,290],[223,289],[195,291],[175,325],[167,417],[148,471],[124,500],[96,480],[79,438],[65,355]]),
 expertClosedAreas:[portMap([[194,76],[336,76],[336,96],[194,96]]),portMap([[280,283],[439,283],[439,328],[280,328]])],
 ground(x,z){return Math.max(port.renderGround(x,z),clamp(-polygonDistance(portShip,x,z)*.8,-10,6),clamp(-polygonDistance(portDock,x,z)*.8,-10,6));},
 renderGround(x,z){return clamp(Math.max(-polygonDistance(portNorth,x,z)*.8,(x-(430-220)*.8)*.8),-10,6);},
 obstacles:[],resistance:[],raceRamps:[],raceRampsByClass:[portSmallRamps,[portRamp(110,184,463,64,18)],[portRamp(110,187,463,84,18)],portSmallRamps],shipOutline:portShip,dockOutline:portDock,
 shortcut:{kind:'tunnel',from:portMap([[123,84]])[0],to:portMap([[175,325]])[0],width:6,clearance:4.3,continuous:true,
 via:portMap([[162,101],[194,114],[227,120],[246,137],[249,155],[236,171],[220,186],[216,203],[222,214],[245,213],[263,222],[272,243],[273,270],[254,290],[223,289]]),
 structure:portMap([[194,114],[227,120],[246,137],[249,155],[236,171],[220,186],[216,203],[222,214],[245,213],[263,222],[272,243],[273,270],[263,279]])}
};
const cityMap=points=>fromMap(points,200,275,.8);
const cityWater=cityMap([[154,20],[337,20],[385,67],[372,100],[373,141],[390,152],[377,187],[359,195],[348,211],[358,232],[306,370],[306,524],[249,524],[249,498],[241,499],[229,524],[16,524],[14,334],[123,225],[140,225],[149,234],[176,234],[200,215],[200,198],[177,177],[177,141],[167,130],[167,86],[154,70]]);
const cityCenter=cityMap([[206,65],[224,51],[257,58],[258,174],[248,180],[248,226],[253,231],[253,466],[241,472],[56,470],[52,454],[52,387],[139,310],[186,278],[186,258],[223,221],[223,177],[206,165]]);
const cityEast=cityMap([[277,37],[295,37],[329,70],[329,160],[315,175],[289,232],[277,231],[277,177]]);
const citySand=cityMap([[184,36],[223,51],[206,65]]);
const cityBalls=cityMap([[179,134],[192,134],[186,141],[180,150],[192,150],[108,485],[108,496],[108,507],[108,518]]).map(([x,z])=>({x,z,r:.7,type:'ball'}));
const cityExpertBalls=[...cityBalls,...cityMap([[186,135],[186,157],[119,487],[119,498],[119,509]]).map(([x,z])=>({x,z,r:.7,type:'ball'}))];
const cityRamp=(id,x,z,tx,tz,width,length=14)=>({id,name:'CITY JUMP',x:(x-200)*.8,z:(z-275)*.8,tx,tz,width,length,height:id===120?2.7:2.1,floating:false});
const cityLateRamps=[cityRamp(121,185,113,0,1,9),cityRamp(122,84,488,1,0,14),cityRamp(123,189,489,1,0,13)];
const city={
 shortcut:{kind:'jump-dive',from:cityMap([[269,390]])[0],to:cityMap([[229,30]])[0],width:6,via:cityMap([[269,360],[269,315],[269,285],[269,260],[269,236],[269,200],[269,160],[269,75],[260,45]]),structure:cityMap([[269,390],[269,70]])},
 crossbars:[{x:(269-200)*.8,z:(234-275)*.8,tx:1,tz:0,length:32.8,depth:.9,bottom:.45,top:1.35}],
 name:'Twilight City',theme:'city',tag:'06 / TWILIGHT CITY',layoutRevision:2,
 description:'Floodlit waterways and metal buoys. The inner wall offers a jump shortcut; Expert moves the ramp back, requiring F during descent to dive beneath it. The outer route stays open.',
 anchors:cityMap([[269,420],[288,341],[322,281],[342,239],[336,212],[352,181],[368,160],[358,139],[358,114],[374,68],[333,31],[277,29],[229,29],[182,27],[173,55],[174,96],[178,133],[190,169],[207,200],[204,218],[174,244],[141,278],[116,321],[87,349],[48,383],[24,429],[23,458],[38,472],[77,478],[131,486],[179,501],[212,513],[244,483],[266,456]]),
 ground(x,z){return Math.max(city.renderGround(x,z),clamp(-polygonDistance(cityCenter,x,z)*.8,-10,6),clamp(-polygonDistance(cityEast,x,z)*.8,-10,6));},
 renderGround(x,z){return clamp(Math.max(polygonDistance(cityWater,x,z)*.8,Math.min(1.1,1.1-polygonDistance(citySand,x,z)*.6)),-10,8);},
 quayOutlines:[cityCenter,cityEast],obstaclesByClass:[cityBalls,cityBalls,cityExpertBalls,cityBalls],
 raceRampsByClass:[[cityRamp(120,270,260,0,-1,10),...cityLateRamps],[cityRamp(120,270,260,0,-1,10),...cityLateRamps],[cityRamp(120,270,285,0,-1,10),...cityLateRamps],[cityRamp(120,270,285,0,-1,10),...cityLateRamps]],resistance:[]
};
const glacierMap=points=>fromMap(points,205,280,.8);
const glacierLand=glacierMap([[76,118],[92,99],[143,97],[191,98],[251,98],[276,103],[283,113],[275,132],[251,159],[221,190],[196,219],[181,241],[175,275],[176,309],[192,336],[207,358],[207,373],[187,387],[148,409],[111,431],[97,434],[82,421],[76,400],[82,373],[83,348],[79,320],[77,290],[80,267],[74,238],[74,202],[69,168]]);
const glacierNorth=glacierMap([[-350,-250],[700,-250],[700,20],[417,47],[354,57],[292,54],[231,62],[192,86],[171,91],[125,87],[65,75],[0,63],[-350,63]]);
const glacierIceBalls=glacierMap([[27,190],[27,212],[26,231],[237,187],[256,190],[240,206],[217,205],[219,227],[200,225],[196,249]]).map(([x,z])=>({x,z,r:1.7,type:'ice'}));
const glacierRamp=(id,x,z,tx,tz,width,length)=>({id,name:'ICE COAST JUMP',x:(x-205)*.8,z:(z-280)*.8,tx,tz,width,length,height:1.9,floating:false});
const glacier={
 name:'Glacier Coast',theme:'ice',tag:'07 / GLACIER COAST',layoutRevision:2,
 description:'Race around a long ice peninsula, through the narrow western straight and past floating ice on the eastern return. Fixed ramps face the original race direction.',
 anchors:glacierMap([[34,351],[33,306],[32,269],[31,235],[31,201],[31,166],[40,133],[64,113],[97,96],[147,95],[187,94],[214,85],[243,91],[281,96],[301,107],[306,122],[290,142],[267,163],[254,183],[232,203],[215,223],[211,250],[211,278],[211,307],[219,334],[223,359],[218,383],[204,409],[180,411],[161,424],[144,441],[125,456],[102,459],[78,447],[53,419],[37,390]]),
 ground(x,z){return clamp(Math.max(-polygonDistance(glacierLand,x,z),-polygonDistance(glacierNorth,x,z))*.85,-10,38);},
 obstacles:glacierIceBalls,
 raceRamps:[glacierRamp(130,59,256,0,-1,17,34),glacierRamp(131,49,207,0,-1,18,34),glacierRamp(132,57,161,0,-1,17,34),glacierRamp(133,185,312,0,1,16,17)],
 resistance:[]
};
export const CLASSIC_COURSES={greyhaven:sunny,amber:sunset,reed:lake,citadel:fort,port,neon:city,glacier};
export function courseResistance(course,x,z,wet=1){let drag=0;for(const p of course.resistance||[]){const q=((x-p.x)/p.rx)**2+((z-p.z)/p.rz)**2;drag=Math.max(drag,p.drag*clamp((1-q)*3,0,1));}return drag*clamp(wet,0,1);}
