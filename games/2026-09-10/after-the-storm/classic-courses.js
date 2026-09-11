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
const sunnyMap=points=>fromMap(points,168,250,.75);
const sunnyBuoys=rows=>rows.map(([x,z,side])=>({x:(x-168)*.75,z:(z-250)*.75,side}));
const sunnyNormalBuoys=sunnyBuoys([[218,165,-1],[198,87,1],[133,30,-1],[124,77,-1],[142,126,1],[118,185,-1],[138,246,1],[119,277,-1],[142,379,1],[127,439,-1],[215,481,-1],[225,434,-1],[207,358,1]]);
const sunnyHardBuoys=sunnyBuoys([[214,165,-1],[203,87,1],[133,30,-1],[126,77,-1],[132,126,1],[118,185,-1],[129,246,1],[119,277,-1],[129,379,1],[133,439,-1],[215,481,-1],[225,434,-1],[213,358,1]]);
// Expert's course map has a 35 pixel smaller left margin.
const sunnyExpertBuoys=sunnyBuoys([[179,165,-1],[167,87,1],[99,30,-1],[91,78,-1],[97,126,1],[86,185,-1],[94,246,1],[89,277,-1],[94,379,1],[98,439,-1],[181,481,-1],[180,435,-1],[183,358,1]].map(([x,z,side])=>[x+35,z,side]));
// Reverse geography is rotated into the common world frame around map (179,261).
const sunnyReverseBuoys=sunnyBuoys([[147,165,1],[158,69,-1],[231,75,-1],[243,131,1],[243,243,-1],[240,276,1],[247,338,-1],[235,395,1],[243,443,-1],[163,438,1],[153,358,-1]].map(([x,z,side])=>[358-x,522-z,side])).map((b,i)=>i===9?{...b,offset:2}:b);
const sunnyBalls=points=>sunnyMap(points).map(([x,z])=>({x,z,r:.55,type:'ball'}));
const sunny={
 name:'Sunny Beach',theme:'beach',tag:'01 / SUNNY BEACH',layoutRevision:3,
 buoysByClass:[sunnyNormalBuoys,sunnyHardBuoys,sunnyExpertBuoys,sunnyReverseBuoys],
 boundary:sunnyMap([[94,0],[96,459],[104,497],[120,511],[202,515],[238,500],[273,470],[273,0]]),
 obstaclesByClass:[[],sunnyBalls([[107,327],[130,327],[153,327]]),sunnyBalls([[106,327],[119,327],[132,327],[145,327],[159,327]]),sunnyBalls([[208,195],[221,195],[234,195],[247,195],[260,195]].map(([x,z])=>[358-x,522-z]))],
 description:'A long sandbar separates two fast straights. Round the tight ends, keep clear of the beach, and thread the buoys.',
 anchors:[[38,39.75],[39,-55],[24,-133],[19,-166],[-8,-168],[-31,-145],[-36,-60],[-37,44],[-32,137],[-12,166],[12,168],[31,146],[39,88]],
 ground(x,z){const axisZ=clamp(z,-143,143),width=10.5+1.8*Math.cos(z*.015),bar=3.3-Math.hypot(x,z-axisZ)*3.3/width;
 const beach=clamp((x-(76+4*Math.cos(z*.014)))*.18,-10,9);return Math.max(-9,bar,beach);},
 obstacles:[],resistance:[],raceRamps:[]
};
const sunsetLand=fromMap([[176,55],[189,70],[190,105],[227,149],[247,182],[242,227],[249,280],[240,307],[250,343],[310,399],[345,420],[430,438],[461,443],[459,454],[193,455],[174,432],[165,340],[168,247],[170,184]],245,275);
const sunsetMap=points=>fromMap(points,245,275);
const sunsetBuoys=rows=>rows.map(([x,z,side])=>({x:(x-245)*.75,z:(z-275)*.75,side}));
const sunsetNormalBuoys=sunsetBuoys([[258,134,-1],[203,66,1],[140,52,-1],[125,95,-1],[154,166,1],[110,283,-1],[156,342,1],[197,512,-1],[332,506,1],[429,501,-1],[482,405,-1],[426,389,-1],[382,405,1],[318,370,-1]]);
// Hard adds seven pixels on the left; Expert removes sixty relative to Normal.
const sunsetHardBuoys=sunsetBuoys([[264,134,-1],[209,66,1],[146,52,-1],[132,95,-1],[154,166,1],[140,283,-1],[144,342,1],[204,504,-1],[279,495,1],[357,506,-1],[419,490,1],[488,405,-1],[433,389,-1],[388,405,1],[324,370,-1]].map(([x,z,side])=>[x-7,z,side]));
const sunsetExpertBuoys=sunsetBuoys([[197,134,-1],[142,66,1],[79,52,-1],[65,95,-1],[76,166,1],[79,266,-1],[78,342,1],[126,497,-1],[149,492,-1],[212,495,1],[292,495,-1],[352,490,1],[421,405,-1],[366,398,-1],[322,402,1],[257,370,-1]].map(([x,z,side])=>[x+60,z,side]));
const sunsetReverseBuoys=sunsetBuoys([[192,175,-1],[128,147,1],[81,148,-1],[90,48,1],[154,60,-1],[239,48,1],[288,64,-1],[382,214,1],[365,288,-1],[381,464,-1],[295,492,1],[251,407,-1]].map(([x,z,side])=>[512-x,552-z,side]));
// Ten metal balls, excluding the adjoining dotted course boundary.
const sunsetBalls=points=>sunsetMap(points).map(([x,z])=>({x,z,r:.85,type:'ball'}));
const sunsetForwardBalls=sunsetBalls([[364,350],[375,350],[388,350],[359,358],[369,358],[380,358],[390,358],[364,366],[374,366],[385,366]]);
const sunsetReverseBalls=sunsetBalls([[124,183],[135,183],[145,183],[119,191],[129,191],[140,191],[150,191],[121,199],[134,199],[145,199]].map(([x,z])=>[512-x,552-z]));
const sunset={
 name:'Sunset Bay',theme:'resort',tag:'02 / SUNSET BAY',layoutRevision:4,
 finishLine:sunsetMap([[250,300],[420,300]]),finishBypass:3,
 waveTrain:[(130-245)*.75,(223-275)*.75,14,.9],
 mooredBoats:[[90,146],[93,299]].map(([x,z],i)=>({id:'sunset-mooring-'+i,x:(x-245)*.75,z:(z-275)*.75,width:3.5,length:10,heading:0})),
 buoysByClass:[sunsetNormalBuoys,sunsetHardBuoys,sunsetExpertBuoys,sunsetReverseBuoys],
 obstaclesByClass:[[],sunsetForwardBalls,sunsetForwardBalls,sunsetReverseBalls],
 anchorsByClass:{2:sunsetMap([[290,302],[281,222],[258,163],[217,80],[194,49],[167,52],[142,93],[131,165],[103,190],[99,219],[150,260],[140,333],[158,402],[180,458],[209,478],[268,510],[310,512],[352,480],[412,508],[448,486],[468,455],[448,420],[385,398],[317,376],[298,350]])},
 boundary:sunsetMap([[76,48],[91,17],[118,7],[220,7],[250,28],[280,72],[311,120],[326,163],[333,291],[348,322],[389,350],[475,384],[499,411],[499,498],[481,530],[445,539],[115,541],[80,518],[74,446]]),
 description:'Orange evening water wraps around an L-shaped island. A race ramp offers a jump beside the pier-lined western straight.',
 anchors:fromMap([[290,302],[281,222],[258,163],[217,80],[194,49],[167,52],[142,93],[131,165],[103,190],[99,219],[117,260],[140,333],[158,402],[180,458],[268,495],[366,515],[435,494],[468,455],[448,420],[385,398],[317,376],[298,350]],245,275),
 ground(x,z){return clamp(-polygonDistance(sunsetLand,x,z)*.48,-10,5);},
 obstacles:[],resistance:[],raceRamps:[{id:100,name:'SUNSET JUMP',x:(130-245)*.75,z:(198-275)*.75,tx:0,tz:1,width:12,length:17,height:2.1,floating:false}],
 crossbars:[{x:(133-245)*.75,z:(144-275)*.75,tx:1,tz:0,length:61,depth:3.2,bottom:2.8,top:3.2,material:'wood',pileSpacing:14},{x:(137.5-245)*.75,z:(299-275)*.75,tx:1,tz:0,length:57.75,depth:3.2,bottom:2.8,top:3.2,material:'wood',pileSpacing:14,pileOffsets:[-24.525,-10.925,2.675,16.275,28.875]}]
};
const lakeLand=fromMap([[67,108],[104,98],[174,116],[229,109],[320,76],[334,107],[329,194],[345,246],[326,295],[294,329],[273,348],[228,351],[173,343],[126,368],[77,350],[70,293],[63,254],[72,215],[62,174]],200,240);
const lakeIsland=fromMap([[127,72],[166,63],[207,66],[252,85],[224,96],[193,99],[153,88]],200,240);
const lakeOuter=fromMap([[40,73],[87,38],[170,38],[247,34],[326,18],[377,37],[399,100],[395,215],[399,295],[372,343],[342,398],[274,419],[218,450],[153,458],[92,418],[38,354],[9,272],[16,204],[6,151]],200,240);
const lakeMap=points=>fromMap(points,200,240);
const lakeBuoys=rows=>rows.map(([x,z,side])=>({x:(x-200)*.75,z:(z-240)*.75,side}));
const lakeNormalBuoys=lakeBuoys([[371,146,-1],[357,88,1],[279,58,-1],[116,65,-1],[36,118,-1],[45,168,1],[36,228,-1],[46,282,1],[51,343,-1],[120,393,1],[212,390,1],[333,365,-1]]);
const lakeHardBuoys=lakeBuoys([[371,146,-1],[357,88,1],[279,58,-1],[116,65,-1],[35,140,-1],[45,170,1],[35,206,-1],[46,244,1],[37,284,-1],[120,393,1],[212,390,1],[250,393,-1],[325,368,1]]);
const lakeExpertBuoys=lakeBuoys([[371,146,-1],[357,88,1],[279,58,-1],[116,65,-1],[35,140,-1],[45,170,1],[35,206,-1],[46,244,1],[37,284,-1],[103,407,-1],[152,388,1],[190,398,-1],[229,367,1],[258,393,-1],[299,368,1],[360,358,-1]]);
const lakeReverseBuoys=lakeBuoys([[70,129,-1],[103,101,1],[161,105,-1],[182,67,1],[221,99,-1],[270,84,1],[316,102,-1],[367,195,-1],[378,239,1],[373,269,-1],[380,314,1],[374,341,-1],[297,405,-1],[134,405,-1],[53,387,1],[63,335,-1]].map(([x,z,side])=>[420-x,478-z,side]));
lakeNormalBuoys[11].approach={x:(293-200)*.75,z:(395-240)*.75,throttle:.4,radius:3};
lakeHardBuoys[11].approach={x:(228-200)*.75,z:(382-240)*.75,throttle:.4,radius:3};
lakeReverseBuoys[3].approach={x:(254-200)*.75,z:(398-240)*.75,throttle:.4,radius:3};
lakeReverseBuoys[2].approach={x:(277-200)*.75,z:(383-240)*.75,throttle:.4,radius:3};
const lakePosts=[[253.5,358.5],[264.5,369.5],[239.5,374.5],[283.5,375.5],[182.5,380.5],[224.5,380.5],[252.5,381.5],[290.5,385.5],[268.5,387.5],[200.5,388.5],[238.5,389.5],[222.5,399.5],[249.5,402.5]];
const lakePostObstacles=(dx=0,dz=0)=>lakeMap(lakePosts.map(([x,z])=>[x+dx,z+dz])).map(([x,z])=>({x,z,r:.45,type:'post'}));
const lakeWeedMarkers=[[200.5,49.5,7,6],[132.5,87,6,4.5],[192,107.5,5.5,4]];
const lakeExpertWeeds=[...lakeWeedMarkers,[20.5,175,8,6.5],[54.5,218.5,5,5],[24.5,249.5,7,6]];
const lakeWeeds=(rows,dx=0,dz=0)=>rows.map(([x,z,rx,rz])=>({x:(x+dx-200)*.75,z:(z+dz-240)*.75,rx:rx*.75,rz:rz*.75,drag:.65}));
const lakeNorth=[[374,274],[366,188],[366,91],[341,60],[306,63],[246,54],[178,54],[122,61],[84,67],[59,86],[31,160],[40,212],[31,269],[52,325],[74,372],[123,404]];
const lake={
 name:'Drake Lake',theme:'lake',tag:'03 / DRAKE LAKE',layoutRevision:3,boundary:lakeOuter,
 finishLinesByClass:[lakeMap([[357,267],[408,267]]),lakeMap([[357,267],[408,267]]),lakeMap([[357,267],[408,267]]),lakeMap([[361,269],[412,269]])],
 buoysByClass:[lakeNormalBuoys,lakeHardBuoys,lakeExpertBuoys,lakeReverseBuoys],
 anchorsByClass:{1:lakeMap([...lakeNorth,[180,409],[225,396],[258,361],[289,367],[326,381],[353,362],[369,317]]),2:lakeMap([...lakeNorth.slice(0,-1),[109,397],[142,380],[166,386],[201,389],[231,381],[268,377],[306,378],[343,365],[370,333]])},
 description:'A misty freshwater circuit with irregular wooded banks, a small island, timber posts and weed beds that slow a wet hull.',
 anchors:fromMap([[374,274],[366,188],[366,91],[341,60],[306,63],[246,54],[178,54],[122,61],[84,67],[59,86],[31,160],[40,212],[31,269],[52,325],[74,372],[123,404],[186,416],[243,407],[307,376],[356,336]],200,240),
 ground(x,z){return clamp(Math.max(-polygonDistance(lakeLand,x,z),-polygonDistance(lakeIsland,x,z),polygonDistance(lakeOuter,x,z))*.4,-8,13);},
 obstacles:lakePostObstacles(),obstaclesByClass:[lakePostObstacles(),lakePostObstacles(),lakePostObstacles(),lakePostObstacles(4,3)],
 resistance:lakeWeeds(lakeWeedMarkers),resistanceByClass:[lakeWeeds(lakeWeedMarkers),lakeWeeds(lakeWeedMarkers),lakeWeeds(lakeExpertWeeds),lakeWeeds(lakeExpertWeeds,4,3)],raceRamps:[]
};
const fortMap=points=>fromMap(points,210,300,.8);
const fortLand=fortMap([[110,135],[111,84],[117,74],[123,83],[127,121],[139,153],[159,176],[203,189],[293,200],[360,215],[370,225],[319,228],[267,228],[267,264],[259,292],[268,430],[249,467],[216,491],[132,507],[104,500],[108,360],[125,351],[136,290],[151,274],[159,277],[180,277],[194,261],[207,263],[207,244],[181,250],[153,264],[130,286],[119,330],[110,339],[106,325],[107,166],[43,155],[41,143],[57,135]]);
const fortObstacles=rows=>rows.map(([x,z,type='crate'])=>({x:(x-210)*.8,z:(z-300)*.8,r:type==='timber'?.82:1,type}));
const fortNormalObjects=[[261,171],[295,195],[334,198]];
const fortHardObjects=[[263,173],[326,179,'timber'],[287,190],[270,190,'timber'],[310,192],[334,198],[323,205,'timber']];
const fortExpertObjects=[[263,173],[326,179,'timber'],[245,181,'timber'],[273,181,'timber'],[287,190],[337,192],[310,192],[352,205],[323,205,'timber'],[178,266],[126,329]];

const fortBuoys=rows=>rows.map(([x,z,side])=>({x:(x-210)*.8,z:(z-300)*.8,side}));
const fortNormalBuoys=fortBuoys([[69,203,1],[160,64,1],[170,94,1],[155,138,-1],[201,156,1],[350,174,1],[360,269,1],[306,267,1]]);
const fortHardBuoys=fortBuoys([[69,203,1],[158,90,1],[155,138,-1],[192,157,1],[350,174,1],[295,260,1]]);
const fortExpertBuoys=fortBuoys([[69,203,1],[158,90,1],[155,138,-1],[192,157,1],[350,168,1],[295,260,1]]);
const fortReverseBuoys=fortBuoys([[176,320,1],[118,382,1],[274,394,1],[311,425,-1],[309,463,1],[399,362,1]].map(([x,z,side])=>[465-x,564-z,side]));
fortReverseBuoys[3].approach={x:(169-210)*.8,z:(160-300)*.8,throttle:.4,radius:3};
fortReverseBuoys[5].approach={x:(58-210)*.8,z:(183-300)*.8,throttle:.4,radius:3};
const fortArchSpans=[[[120,494],[120,560],25],[[159,493],[170,553],26],[[192,484],[213,533],25],[[224,476],[253,506],25]];
const fortArches=fortArchSpans.flatMap(([a,b,width],arch)=>{const [[ax,az],[bx,bz]]=fortMap([a,b]),length=Math.hypot(bx-ax,bz-az),tx=(bx-ax)/length,tz=(bz-az)/length,n=16;return Array.from({length:n},(_,i)=>{const f=(i+.5)/n,u=2*f-1;return {kind:'stone-arch',arch,x:ax+(bx-ax)*f,z:az+(bz-az)*f,tx,tz,length:length/n+.02,depth:width*.8,bottom:i===0||i===n-1?-10:7.5*Math.sqrt(1-u*u)-.7,top:11,material:'stone'};});});
for(const b of fortArches){const parts=fortArches.filter(p=>p.arch===b.arch),i=parts.indexOf(b);b.soffitBefore=parts[Math.max(0,i-1)].bottom;b.soffitAfter=parts[Math.min(parts.length-1,i+1)].bottom;}
const fort={
 name:'Marine Fortress',theme:'fortress',tag:'04 / MARINE FORTRESS',layoutRevision:4,
 finishLine:fortMap([[9,272],[108,272]]),crossbars:fortArches,
 boundary:fortMap([[39,42],[173,42],[182,45],[188,62],[189,117],[192,126],[200,133],[218,142],[228,144],[302,149],[322,153],[341,161],[352,163],[389,181],[397,187],[402,196],[405,206],[405,252],[312,340],[312,429],[310,440],[291,468],[270,493],[231,523],[188,544],[150,554],[40,554],[20,549],[12,543],[8,534],[9,265],[13,213],[13,163],[18,70],[22,51],[29,43]]),
 buoysByClass:[fortNormalBuoys,fortHardBuoys,fortExpertBuoys,fortReverseBuoys],retainRouteControls:true,
 description:'Rough grey water around a stone fort. Floating crates crowd the eastern arm; Hard and above open a curved inner route after the first lap.',
 anchors:fortMap([[81,273],[81,192],[53,178],[37,156],[38,128],[54,89],[79,68],[104,60],[125,63],[148,94],[176,144],[201,160],[264,179],[337,185],[374,204],[384,227],[373,247],[307,251],[290,270],[283,345],[279,423],[260,466],[225,493],[168,510],[105,516],[81,499],[76,461],[80,360]]),
 ground(x,z){return clamp(-polygonDistance(fortLand,x,z)*.7,-11,6.5);},
 obstacles:fortObstacles(fortNormalObjects),
 obstaclesByClass:[fortObstacles(fortNormalObjects),fortObstacles(fortHardObjects),fortObstacles(fortExpertObjects),fortObstacles(fortExpertObjects)],
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
const glacierBuoys=rows=>rows.map(([x,z,side])=>({x:(x-205)*.8,z:(z-280)*.8,side}));
const glacierExpertBuoys=glacierBuoys([[27,286,1],[67,222,-1],[34,138,1],[331,131,1],[280,159,1],[247,175,-1],[228,216,1],[195,240,-1],[204,290,1],[220,330,1],[233,389,1],[194,392,-1],[170,427,1],[130,435,-1],[108,459,1],[38,423,1]]);
const glacierReverseBuoys=glacierBuoys([[360,112,1],[308,76,-1],[284,103,1],[233,103,-1],[219,142,1],[171,154,-1],[201,207,1],[219,245,1],[214,299,-1],[191,339,1],[149,357,-1],[134,384,1],[114,412,1],[380,403,1],[389,250,-1]].map(([x,z,side])=>[417-x,537-z,side]));
const glacier={
 boundary:glacierMap([[14,65],[235,55],[417,43],[348,124],[336,151],[310,181],[285,214],[257,248],[228,284],[225,306],[245,331],[276,348],[285,373],[280,396],[257,420],[202,458],[128,505],[68,534],[27,529],[15,503]]),
 buoysByClass:[glacierExpertBuoys,glacierExpertBuoys,glacierExpertBuoys,glacierReverseBuoys],
 name:'Glacier Coast',theme:'ice',tag:'07 / GLACIER COAST',layoutRevision:2,
 description:'Race around a long ice peninsula, through the narrow western straight and past floating ice on the eastern return. Line up before the ice and release hard steering to keep your balance. Water handling returns when you slide off.',
 anchors:glacierMap([[34,351],[33,306],[32,269],[31,235],[31,201],[31,166],[40,133],[64,113],[97,96],[147,95],[187,94],[214,85],[243,91],[281,96],[301,107],[306,122],[290,142],[267,163],[254,183],[232,203],[215,223],[211,250],[211,278],[211,307],[219,334],[223,359],[218,383],[204,409],[180,411],[148,418],[138,425],[133,436],[123,443],[104,449],[78,447],[53,419],[37,390]]),
 ground(x,z){return clamp(Math.max(-polygonDistance(glacierLand,x,z),-polygonDistance(glacierNorth,x,z))*.85,-10,38);},
 iceSheets:[
  {id:'north-shelf',height:.45,approach:glacierMap([[207,84],[225,84],[325,105]]),reverseApproach:glacierMap([[340,112],[324,103],[221,90]]),outline:glacierMap([[231,62],[292,54],[353,57],[339,96],[307,110],[284,114],[275,103],[251,98],[229,97]])},
  {id:'south-1',height:.32,guideGate:5,reverseApproach:glacierMap([[191,420],[211,391]]),outline:glacierMap([[172,402],[183,400],[196,405],[187,417],[176,418],[163,412]])},
  {id:'south-2',height:.38,outline:glacierMap([[151,418],[162,424],[167,445],[157,458],[142,451],[138,438]])},
  {id:'south-3',height:.3,outline:glacierMap([[128,430],[143,439],[135,455],[123,461],[115,453]])},
  {id:'south-4',height:.34,outline:glacierMap([[112,447],[125,452],[121,467],[105,463],[101,453]])}
 ],
 obstacles:glacierIceBalls,
 raceRamps:[glacierRamp(130,59,256,0,-1,17,34),glacierRamp(131,49,207,0,-1,18,34),glacierRamp(132,57,161,0,-1,17,34),glacierRamp(133,185,312,0,1,16,17)],
 resistance:[]
};
const southernMap=points=>fromMap(points,210,325,.8);
// Buoy centers transcribed from the original class maps. R is red (+1), L yellow (-1).
// The southern buoy covers both the outer bend and the original under-pier route.
const southernBuoys=rows=>rows.map(([x,z,side])=>({x:(x-210)*.8,z:(z-325)*.8,side,width:Math.abs(x-151)<2&&z>540&&z<550?110:23}));
const southernNormalBuoys=southernBuoys([[368,227,1],[368,151,-1],[262,84,-1],[179,152,-1],[139,188,1],[88,213,-1],[83,343,-1],[160,423,1],[151,544,-1],[375,488,-1],[352,445,1]]);
const southernHardBuoys=southernBuoys([[368,227,1],[368,151,-1],[262,84,-1],[205,158,1],[143,191,-1],[86,254,1],[83,343,-1],[160,423,1],[151,544,-1],[375,488,-1],[352,445,1]]);
// Expert map adds a 128 pixel margin to the left of the same geography.
const southernExpertBuoys=southernBuoys([[495,227,1],[496,151,-1],[390,84,-1],[319,152,-1],[266,190,1],[213,228,-1],[210,343,-1],[230,366,-1],[297,435,1],[279,545,-1],[503,487,-1],[480,445,1]].map(([x,z,side])=>[x-128,z,side]));
// Reverse map rotates the 425 x 652 course geography; its right text margin is excluded.
const southernReverseBuoys=southernBuoys([[37,211,1],[54,167,-1],[273,107,1],[279,199,1],[302,301,-1],[358,387,-1],[316,448,1],[260,459,-1],[239,498,1],[163,566,-1],[69,507,-1],[42,425,1]].map(([x,z,side])=>[425-x,652-z,side]));
const southernCore=southernMap([[313,101],[329,115],[329,170],[320,247],[329,294],[335,342],[348,379],[338,420],[332,463],[337,510],[326,539],[302,541],[292,529],[295,504],[310,475],[314,407],[313,351],[310,290],[306,235],[312,178],[295,132],[296,116]]);
const southernShoal=southernMap([[313,70],[340,79],[359,102],[364,132],[354,175],[345,224],[347,282],[364,331],[377,370],[375,409],[368,451],[372,505],[358,551],[336,576],[311,584],[279,572],[265,551],[264,524],[275,492],[298,462],[301,412],[298,363],[300,324],[295,285],[292,240],[299,191],[287,164],[270,145],[266,111],[281,89]]);
function southernPier(ax,az,bx,bz,depth=6){const [[x,z],[ex,ez]]=southernMap([[ax,az],[bx,bz]]),length=Math.hypot(ex-x,ez-z);return {x:(x+ex)/2,z:(z+ez)/2,tx:(ex-x)/length,tz:(ez-z)/length,length,depth,bottom:.65,top:1.05,material:'wood',pileSpacing:12};}
const southernPlatform=southernMap([[316,318],[329,329],[342,353],[340,387],[321,418],[300,397],[289,353],[301,338]]);
const southern={
 name:'Southern Island',theme:'island',tag:'08 / SOUTHERN ISLAND',layoutRevision:3,
 boundary:southernMap([[10,254],[29,195],[91,131],[171,72],[269,14],[326,11],[380,38],[405,83],[412,500],[383,588],[350,637],[268,637],[205,604],[153,540],[109,490],[65,421],[11,331]]),
 buoysByClass:[southernNormalBuoys,southernHardBuoys,southernExpertBuoys,southernReverseBuoys],
 description:'An eastern sand island and a western islet joined by piers. The falling tide opens clearance beneath the decks while exposing the surrounding shoals.',
 anchors:southernMap([[390,368],[390,288],[383,227],[363,180],[354,151],[370,103],[363,71],[338,40],[298,38],[260,76],[238,115],[248,156],[214,176],[181,177],[142,173],[118,186],[99,224],[66,251],[57,287],[65,320],[94,355],[116,398],[140,446],[157,494],[168,537],[194,578],[251,609],[309,611],[354,591],[374,551],[361,488],[372,445],[390,422]]),
 ground(x,z){const [ix,iz]=southernMap([[117,287]])[0],distance=Math.hypot(x-ix,z-iz),core=-polygonDistance(southernCore,x,z)*.32,shoalDistance=polygonDistance(southernShoal,x,z),fringe=Math.min(-.1,-3-shoalDistance*(shoalDistance>0?.3:.13)),islet=(27*.8-distance)*.35,isletFringe=Math.min(-.1,-.45+(45*.8-distance)*.13);return Math.min(clamp(Math.max(core,fringe,islet,isletFringe),-10,5),.35+Math.max(0,polygonDistance(southernPlatform,x,z))*.5);},
 crossbars:[southernPier(314,119,315,528,6),southernPier(117,287,315,352,6),southernPier(172,526,315,526,8),southernPier(216,526,216,541,8),{outline:southernPlatform,bottom:.65,top:1.05,material:'wood'},{kind:'ship',outline:southernMap([[227,118],[235,130],[235,163],[220,163],[220,130]]),bottom:-1.5,top:1.4,material:'ship',floating:true},{kind:'cabin',x:(227-210)*.8,z:(153-325)*.8,tx:0,tz:1,length:7,depth:5,bottom:1.4,top:3.4,material:'white',floating:true}],
 raceRamps:[{id:150,name:'BOAT JUMP',x:(253-210)*.8,z:(117-325)*.8,tx:-Math.SQRT1_2,tz:Math.SQRT1_2,width:10,length:12,height:4.2,floating:true},{id:151,name:'PIER DIVE',x:(189-210)*.8,z:(477-325)*.8,tx:Math.SQRT1_2,tz:Math.SQRT1_2,width:13,length:10,height:2.1,floating:true}],
 obstacles:[],resistance:[]
};
export const CLASSIC_COURSES={greyhaven:sunny,amber:sunset,reed:lake,citadel:fort,port,neon:city,glacier,tempest:southern};
export function courseResistance(course,x,z,wet=1){let drag=0;for(const p of course.resistance||[]){const q=((x-p.x)/p.rx)**2+((z-p.z)/p.rz)**2;drag=Math.max(drag,p.drag*clamp((1-q)*3,0,1));}return drag*clamp(wet,0,1);}
